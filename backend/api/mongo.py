import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv, find_dotenv

######## INIT ########

#load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

uri = os.getenv("MONGODB_URI")
if uri is None:
    print(os.getcwd())
    raise Exception("Environment variable MONGODB_URI is not set. Ask for .env file!")

#create a new client and connect to the server
global mongo_client
mongo_client = MongoClient(uri, server_api=ServerApi('1'))

#send a ping to confirm a successful connection
try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    raise Exception("Failed to connect to MongoDB. Likely, environment variable MONGODB_URI is not set. Ask for .env file!") from e

######## FUNCTIONS ########

def get_mongo_client():
    return mongo_client

#queries for usernames that contain search_str regardless of case
def search_users(username):
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    users = users_collection.find({"user": {"$regex": username, "$options": "i"}}).limit(10)
    return [{"user": user["user"], "email": user["email"], "profile": user.get("profile", {})} for user in users]

#queries for users with profile
def search_profile(profile_key, profile_val):
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    query = {f"profile.{profile_key}": {"$regex": profile_val, "$options": "i"}}
    users = users_collection.find(query)
    return [{"user": user["user"], "email": user["email"], "profile": user.get("profile", {})} for user in users]

#returns profile of username, if one exists
def get_profile(username):
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    user = users_collection.find_one({"user": username})
    return user

#updates new_profile_str that corresponds to username
def post_profile(username, profile_key, new_profile_str):
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    result = users_collection.update_one(
        {"user": username},
        {"$set": {f"profile.{profile_key}": new_profile_str}}
    )
    if result.matched_count == 0:
        raise Exception("User does not exist")

#removes a profile key if it doesn't exist
def delete_profile_key(username, profile_key):
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    result = users_collection.update_one(
        {"user": username},
        {"$unset": {f"profile.{profile_key}": ""}}
    )
    if result.matched_count == 0:
        raise Exception("User does not exist")