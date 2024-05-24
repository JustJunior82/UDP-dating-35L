import datetime

import uvicorn
from email_validator import validate_email, EmailNotValidError
from fastapi import FastAPI
from fastapi.responses import JSONResponse

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

############ CONSTANTS #################

SESSION_TIMEOUT_DURATION = datetime.timedelta(hours=1)

app = FastAPI()

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
async def post_profile(username: str, password: str, profile_key: str, profile: str):
    user = mongo.get_mongo_client()["UDPDating"]["Users"].find_one({"user": username})
    if not user:
        return JSONResponse({"error": NONEXISTENT_USER})
    
    if not hasher.verify_password(password, user["passhex"]):
        return JSONResponse({"error": INVALID_PASSWORD})
    
    sanitized_profile = sanitizer.sanitize_string(profile)
    mongo.post_profile(username, profile_key, sanitized_profile)
    return JSONResponse({"error": SUCCESS})

@app.post("/api/delete_profile_key")
async def delete_profile_key(username: str, password: str, profile_key: str):
    user = mongo.get_mongo_client()["UDPDating"]["Users"].find_one({"user": username})
    if not user:
        return JSONResponse({"error": NONEXISTENT_USER})
    
    if not hasher.verify_password(password, user["passhex"]):
        return JSONResponse({"error": INVALID_PASSWORD})

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
            "expired": (now + SESSION_TIMEOUT_DURATION).timestamp()
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
        elif now > datetime.datetime.fromtimestamp(session_document["created"]) + SESSION_TIMEOUT_DURATION:
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
            "expired": (now + SESSION_TIMEOUT_DURATION).timestamp()
        }
    })

@app.get("/api/validate_token")
async def validate_token(username: str, access_token: str) -> JSONResponse:
    mongo_client = mongo.get_mongo_client()
    now = datetime.datetime.now()
    sessions = mongo_client["UDPDating"]["Sessions"]
    try:
        session_document = sessions.find_one({"$and": [{"user": username}, {"access-token": access_token}]})
        if session_document is None:
            return JSONResponse({"error": INVALID_LOGIN}, status_code=401)
        elif now > datetime.datetime.fromtimestamp(session_document["created"]) + SESSION_TIMEOUT_DURATION:
            return JSONResponse({"error": SESSION_TIMED_OUT}, status_code=401)
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return JSONResponse({"error": FAILED_MONGODB_ACTION})
    return JSONResponse({"error": SUCCESS})

uvicorn.run(app, port=12345, host="0.0.0.0")