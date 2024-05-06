import hashlib
import os

import uvicorn
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from fastapi import FastAPI
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

app = FastAPI()
uri = os.getenv("MONGODB_URI")
assert uri is not None # TODO: better error handling

# Create a new client and connect to the server
mongo_client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.get("/say_hi")
async def hi(my_field:str):
	return f"hi {my_field}!"

@app.post("/register")
async def register(username: str, password: str, email: str): # TODO: use meaningful return values
    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except EmailNotValidError as exc:
        print(exc)
        return 1
    
    hasher = hashlib.new("sha256")
    hasher.update(password.encode())
    passhex = hasher.hexdigest()
    
    users = mongo_client["UDPDating"]["Users"]
    if users.find_one({"$or": [{"user": username}, {"email": email}]}) is not None:
        print("Duplicate user or email")
        return 2
    users.insert_one({"user": username, "email": email, "passhex": passhex})
    return 0

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
