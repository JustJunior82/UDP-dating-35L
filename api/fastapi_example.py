import hashlib
import os

import ascii_magic
import PIL.Image
import uvicorn
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

SUCCESS = 0
INVALID_EMAIL = 1
DUPLICATE_USER_OR_EMAIL = 2
FAILED_MONGODB_ACTION = 3
UNSUPPORTED_IMAGE_FORMAT = 10
IMAGE_TOO_LARGE = 11
FAILED_PIL_ACTION = 12
FAILED_ASCII_MAGIC_ACTION = 13

load_dotenv()

app = FastAPI()
uri = os.getenv("MONGODB_URI")
if uri is None:
    raise Exception("Environment variable MONGODB_URI is not set. Ask for .env file!")

# Create a new client and connect to the server
mongo_client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    raise Exception("Failed to connect to MongoDB. Likely, environment variable MONGODB_URI is not set. Ask for .env file!") from e

@app.get("/api/say_hi")
async def hi(my_field:str):
	return f"hi {my_field}!"

@app.post("/api/register")
async def register(username: str, password: str, email: str) -> JSONResponse:
    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except EmailNotValidError as exc:
        print("Email not valid: exception below")
        print(exc)
        return JSONResponse({"error": INVALID_EMAIL})
    
    hasher = hashlib.new("sha256")
    hasher.update(password.encode())
    passhex = hasher.hexdigest()
    
    users = mongo_client["UDPDating"]["Users"]
    if users.find_one({"$or": [{"user": username}, {"email": email}]}) is not None:
        print("Duplicate user or email")
        return JSONResponse({"error": DUPLICATE_USER_OR_EMAIL})
    try:
        users.insert_one({"user": username, "email": email, "passhex": passhex})
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return JSONResponse({"error": FAILED_MONGODB_ACTION})
    return JSONResponse({"error": SUCCESS})

@app.post("/api/img2ascii")
async def img2ascii(image: UploadFile) -> JSONResponse:
    COLUMNS = 200
    FILE_SIZE_LIMIT_BYTES = 2000000

    if image.content_type != "image/jpeg" and image.content_type != "image/png":
        return JSONResponse({"error": UNSUPPORTED_IMAGE_FORMAT}, status_code=422)
    file_size = len(image.file.read())
    if file_size > FILE_SIZE_LIMIT_BYTES:
        return JSONResponse({"error": IMAGE_TOO_LARGE}, status_code=422)
    image.file.seek(0)

    try:
        pillow_image = PIL.Image.open(image.file)
    except Exception:
        return JSONResponse({"error": FAILED_PIL_ACTION})
    
    try:
        art = ascii_magic.AsciiArt.from_pillow_image(pillow_image)
    except Exception:
        return JSONResponse({"error": FAILED_ASCII_MAGIC_ACTION})
    
    return JSONResponse({"error": SUCCESS, "content": art.to_ascii(COLUMNS)})

uvicorn.run(app, port=12345, host="0.0.0.0")

'''
here's how to test running this on Zack's server:

1. ssh into the server: ssh cs35l@5.78.68.176 with password eggert
2. there should just be a test.py (this scirpt) sitting in the home directory. python3 test.py will run it.
3. to run the program without being on the shell, type nohup python3 test.py & which generates logs to nohup.out and runs until killed (forever).
4. to kill the process (if fastapi says port occupied for example), use ps aux | grep test.py to find the process (pid is the first number after "cs35l"/whatever user owns the process) and then use kill -9 [pid] to kill it. 
5. to test functionality, go to 5.78.68.176:12345/docs. To test each what each function actually returns with your browser (for GET, for post use Postman) use 5.78.68.176:12345/say_hi?my_field=myname or whatever decorator LINK you used in @app.get("LINK").

Dependencies currently required (TODO: package up for TAs):
FastAPI (pip3 install fastapi)
Uvicorn (pip3 install uvicorn)

Update:
Recommended to use python venv: (Linux/Mac instructions below)
This is because currently api/requirements.txt is expecting very specific versions of packages atm.

e.g. if you have your python at /path/to/python

/path/to/python -m venv venv
source venv/bin/activate
pip install -r api/requirements.txt

You can add --dry-run to pip install to make sure things should go as expected without actually installing.
'''
