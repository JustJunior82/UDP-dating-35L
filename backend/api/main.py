import collections
import datetime

import ascii_magic
import PIL.Image
import uvicorn
from email_validator import validate_email, EmailNotValidError
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

######## INTERNAL DEPENDENCIES ########

import mongo
import hasher
import sanitizer

############ ERROR CODES ##############

SUCCESS = 0
INVALID_EMAIL = 1
DUPLICATE_USER_OR_EMAIL = 2
FAILED_MONGODB_ACTION = 3
NONEXISTENT_USER = 4
INVALID_PASSWORD = 5
INVALID_LOGIN = 6
SESSION_TIMED_OUT = 7
LIMIT_TOO_LONG = 8
DUPLICATE_MATCH = 9
UNSUPPORTED_IMAGE_FORMAT = 10
IMAGE_TOO_LARGE = 11
FAILED_ASCII_MAGIC_ACTION = 12
FAILED_PIL_ACTION = 13

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:12345",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/search_users")
async def search_users(username: str):
    users = mongo.search_users(username)
    return JSONResponse(users)

@app.get("/api/search_profile")
async def search_profile(profile_key: str, profile_val: str):
    profiles = mongo.search_profile(profile_key, profile_val)
    return JSONResponse(profiles)

@app.get("/api/get_profile")
async def get_profile(username: str):
    user = mongo.get_profile(username)
    if user:
        profile = user.get("profile", "")
        if profile == "":
            profile = {}
        return JSONResponse({"profile": profile, "error": SUCCESS})
    return JSONResponse({"error": NONEXISTENT_USER})

#Makes sure that:
# 1. the user exists (otherwise throw nonexistent user error)
# 2. the password hash is correct using hasher
@app.post("/api/post_profile")
async def post_profile(username: str, access_token: str, profile_key: str, profile: str):
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    
    sanitized_profile = sanitizer.sanitize_string(profile)
    mongo.post_profile(username, profile_key, sanitized_profile)
    return JSONResponse({"error": SUCCESS})

@app.post("/api/delete_profile_key")
async def delete_profile_key(username: str, access_token: str, profile_key: str):
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})

    mongo.delete_profile_key(username, profile_key)
    return JSONResponse({"error": SUCCESS})

@app.post("/api/register")
async def register(username: str, password: str, email: str) -> JSONResponse:
    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except EmailNotValidError as exc:
        print("Email not valid: exception below")
        print(exc)
        return JSONResponse({"error": INVALID_EMAIL})
    
    passhex = hasher.hash_password(password)
    
    users = mongo.get_mongo_client()["UDPDating"]["Users"]
    if users.find_one({"$or": [{"user": username}, {"email": email}]}) is not None:
        print("Duplicate user or email")
        return JSONResponse({"error": DUPLICATE_USER_OR_EMAIL})
    try:
        users.insert_one({"user": username, "email": email, "passhex": passhex, "profile": {}})
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return JSONResponse({"error": FAILED_MONGODB_ACTION})
    return JSONResponse({"error": SUCCESS})

@app.post("/api/login")
async def login(username: str, password: str) -> JSONResponse:
    mongo_client = mongo.get_mongo_client()
    passhex = hasher.hash_password(password)
    users = mongo_client["UDPDating"]["Users"]
    if users.find_one({"$and": [{"user": username}, {"passhex": passhex}]}) is None:
        return JSONResponse({"error": INVALID_LOGIN}, status_code=401)

    access_token = hasher.generate_access_token()
    now = datetime.datetime.now()
    sessions = mongo_client["UDPDating"]["Sessions"]
    try:
        if sessions.find_one({"user": username}) is None:
            sessions.insert_one({"user": username, "access-token": access_token, "created": now.timestamp()})
        else:
            sessions.update_one({"user": username}, {"$set": {"access-token": access_token, "created": now.timestamp()}})
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return JSONResponse({"error": FAILED_MONGODB_ACTION})
    
    return JSONResponse({
        "error": SUCCESS, 
        "content": {
            "access-token": access_token,
            "expired": (now + mongo.get_access_token_duration()).timestamp()
        }
    })

@app.put("/api/regenerate_token")
async def regenerate_token(username: str, access_token: str) -> JSONResponse:
    mongo_client = mongo.get_mongo_client()
    now = datetime.datetime.now()
    sessions = mongo_client["UDPDating"]["Sessions"]
    new_token = hasher.generate_access_token()
    try:
        session_document = sessions.find_one({"$and": [{"user": username}, {"access-token": access_token}]})
        if session_document is None:
            return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
        elif now > datetime.datetime.fromtimestamp(session_document["created"]) + mongo.get_access_token_duration():
            return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
        else:
            sessions.update_one(
                {"$and": [{"user": username}, {"access-token": access_token}]},
                {"$set": {"access-token": new_token, "created": now.timestamp()}}
            )
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return JSONResponse({"error": FAILED_MONGODB_ACTION})
    return JSONResponse({
        "error": SUCCESS,
        "content": {
            "access-token": new_token,
            "expired": (now + mongo.get_access_token_duration()).timestamp()
        }
    })

@app.get("/api/validate_token")
async def validate_token(username: str, access_token: str) -> JSONResponse:
    match mongo.validate_token_internal(username, access_token):
        case mongo.InternalErrorCode.SUCCESS:
            return JSONResponse({"error": SUCCESS})
        case mongo.InternalErrorCode.INVALID_LOGIN:
            return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
        case mongo.InternalErrorCode.SESSION_TIMED_OUT:
            return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
        case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
            return JSONResponse({"error": FAILED_MONGODB_ACTION})
        case _:
            return JSONResponse({"error": INVALID_LOGIN}, status_code=500)

@app.get("/api/search_potential_matches")
async def search_potential_matches(username: str, access_token: str, skip: int = 0, limit: int = 100, ide: bool = False, os: bool = False, pl: bool = False) -> JSONResponse:
    if limit > mongo.get_search_limit():
        return JSONResponse({"error": LIMIT_TOO_LONG})
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    mongo_client = mongo.get_mongo_client()
    users = mongo_client["UDPDating"]["Users"]
    me = users.find_one({"user": username})

    # create profile filter
    conditions = {"ide": ide, "os": os, "pl": pl}
    match_filter = collections.defaultdict(list)
    for key, cond in conditions.items():
        if cond and key in me["profile"]:
            match_filter["$and"].append({f"profile.{key}": {"$regex": me["profile"][key], "$options": "i"}})

    # find chunk of matches with varying goodness and use match filter
    result = []
    matches = mongo_client["UDPDating"]["Matches"]
    for them in users.find(match_filter, skip=skip, limit=limit):
        # cannot match oneself
        if them["user"] == me["user"]:
            continue
        # cannot rematch
        if matches.find_one({"$and": [{"from": me["user"]}, {"to": them["user"]}]}) is not None:
            continue
        # cannot match someone who already rejected me
        existing_match = matches.find_one({"$and": [{"from": them["user"]}, {"to": me["user"]}]})
        if existing_match is not None and not existing_match["success"]:
            continue

        result.append(them["user"])

    # sort by score in descending order (best match first)
    result.sort(key=lambda item: mongo.get_match_score(me["user"], item), reverse=True)

    # return the actual number of results and the results
    return JSONResponse({"error": SUCCESS, "content": {"count": len(result), "matches": result}})

@app.post("/api/resolve_potential_match")
async def resolve_potential_match(username: str, access_token: str, to: str, success: bool) -> JSONResponse:
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    mongo_client = mongo.get_mongo_client()
    matches_collection = mongo_client["UDPDating"]["Matches"]

    duplicate_match = matches_collection.find_one({"$and": [{"from": username}, {"to": to}]})
    if duplicate_match is not None:
        return JSONResponse({"error": DUPLICATE_MATCH})
    
    matches_collection.insert_one({"from": username, "to": to, "success": success})
    return JSONResponse({"error": SUCCESS})

@app.get("/api/get_matches")
async def get_matches(username: str, access_token: str) -> JSONResponse:
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    mongo_client = mongo.get_mongo_client()
    matches_collection = mongo_client["UDPDating"]["Matches"]
    
    # currently, the assumption is that you will match with few people and will not need it chunked
    potential_matches = set()
    for potential_match in matches_collection.find({"$or": [{"from": username}, {"to": username}]}):
        if potential_match["success"]:
            potential_matches.add((potential_match["from"], potential_match["to"]))
    
    matches = set()
    for from_user, to_user in potential_matches:
        if (to_user, from_user) in potential_matches:
            if from_user == username:
                matches.add(to_user)
            else:
                matches.add(from_user)

    return JSONResponse({"error": SUCCESS, "content": {"count": len(matches), "matches": list(matches)}})

@app.get("/api/get_profile_image")
async def get_profile_image(username: str, access_token: str) -> JSONResponse:
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    mongo_client = mongo.get_mongo_client()
    users = mongo_client["UDPDating"]["Users"]
    me = users.find_one({"user": username})
    image = me.get("image", "")
    return JSONResponse({"error": SUCCESS, "content": image})

@app.post("/api/post_profile_image")
async def post_profile_image(username: str, access_token: str, image: str) -> JSONResponse:
    if (auth := mongo.validate_token_internal(username, access_token)) != mongo.InternalErrorCode.SUCCESS:
        match auth:
            case mongo.InternalErrorCode.INVALID_LOGIN:
                return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
            case mongo.InternalErrorCode.SESSION_TIMED_OUT:
                return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
            case mongo.InternalErrorCode.FAILED_MONGODB_ACTION:
                return JSONResponse({"error": FAILED_MONGODB_ACTION})
    mongo_client = mongo.get_mongo_client()
    users = mongo_client["UDPDating"]["Users"]
    me = users.find_one({"user": username})
    # note: this currently assumes that the image field is always valid
    # ideally, this should probably be checked (e.g. provide img2ascii validation)
    me["image"] = image
    return JSONResponse({"error": SUCCESS})

@app.post("/api/img2ascii")
async def img2ascii(image: UploadFile) -> JSONResponse:
    COLUMNS = 120
    FILE_SIZE_LIMIT_BYTES = 2000000

    if image.content_type != "image/jpeg" and image.content_type != "image/png":
        return JSONResponse({"error": UNSUPPORTED_IMAGE_FORMAT}, status_code=422)
    file_size = len(image.file.read())
    if file_size > FILE_SIZE_LIMIT_BYTES:
        return JSONResponse({"error": IMAGE_TOO_LARGE}, status_code=422)
    image.file.seek(0)

    try:
        pillow_image = PIL.Image.open(image.file).convert("RGB")
    except Exception:
        return JSONResponse({"error": FAILED_PIL_ACTION})
    
    width, height = pillow_image.size   # Get dimensions

    square_dim = min(width, height)
    new_width = new_height = square_dim
    left = (width - new_width)/2
    top = (height - new_height)/2
    right = (width + new_width)/2
    bottom = (height + new_height)/2

    square_image = pillow_image.crop((left, top, right, bottom))
    
    try:
        art = ascii_magic.AsciiArt.from_pillow_image(square_image)
    except Exception:
        return JSONResponse({"error": FAILED_ASCII_MAGIC_ACTION})

    return JSONResponse({"error": SUCCESS, "content": art.to_ascii(COLUMNS)})

uvicorn.run(app, port=12345, host="0.0.0.0")