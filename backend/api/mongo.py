import datetime
import os
from enum import Enum, auto

import Levenshtein
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
mongo_client = MongoClient(uri, server_api=ServerApi('1'), tlsInsecure=True)

#send a ping to confirm a successful connection
try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    raise Exception("Failed to connect to MongoDB. Likely, environment variable MONGODB_URI is not set. Ask for .env file!") from e


class InternalErrorCode(Enum):
    SUCCESS = auto()
    INVALID_LOGIN = auto()
    SESSION_TIMED_OUT = auto()
    FAILED_MONGODB_ACTION = auto()

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
    
def get_access_token_duration() -> datetime.timedelta:
    return datetime.timedelta(hours=1)
    
def validate_token_internal(username: str, access_token: str) -> InternalErrorCode:
    mongo_client = get_mongo_client()
    now = datetime.datetime.now()
    sessions = mongo_client["UDPDating"]["Sessions"]
    try:
        session_document = sessions.find_one({"$and": [{"user": username}, {"access-token": access_token}]})
        if session_document is None:
            return InternalErrorCode.INVALID_LOGIN
        elif now > datetime.datetime.fromtimestamp(session_document["created"]) + get_access_token_duration():
            return InternalErrorCode.SESSION_TIMED_OUT
    except Exception as e:
        print("Unknown error: exception below")
        print(e)
        return InternalErrorCode.FAILED_MONGODB_ACTION
    return InternalErrorCode.SUCCESS

def get_match_score(my_user: str, their_user: str) -> float:
    users_collection = get_mongo_client()["UDPDating"]["Users"]
    my_profile = users_collection.find_one({"user": my_user})["profile"]
    their_profile = users_collection.find_one({"user": their_user})["profile"]

    score = 0
    weight_map = {"ide": 0.45, "os": 0.2, "pl": 0.35} # TODO: consider move random constants into config
    for key, coeff in weight_map.items():
        value = Levenshtein.ratio(my_profile.get(key, ""), their_profile.get(key, ""))
        score += coeff * value
    return score

def get_search_limit() -> int:
    return 100 # TODO: consider move random constants into config

######## MESSAGING ########

import hasher

#adds a message to database to hash(my_user)+hash(their_user), where if my_user < their_user, under get_mongo_client()["UDPDating"]["Messages"]
def add_message(my_user: str, their_user: str, sender: str, message: str):
    message_collection = get_mongo_client()["UDPDating"]["Messages"]

    #ensure consistent conversation ID by sorting usernames
    sorted_users = sorted([my_user, their_user])
    conversation_id = f"{hasher.hash_password(sorted_users[0])}{hasher.hash_password(sorted_users[1])}"

    message_document = {
        "sender": sender,
        "message": message,
        "timestamp": datetime.datetime.now().timestamp()
    }
    message_collection.update_one(
        {"conversation_id": conversation_id},
        {"$push": {"messages": message_document}},
        upsert=True
    )

#fetch messages stored in database between my_user and their_user, where if my_user < their_user, the message dict key will be hash(my_user)+hash(their_user) and values a list of messages
def fetch_messages(my_user: str, their_user: str) -> list:
    message_collection = get_mongo_client()["UDPDating"]["Messages"]

    sorted_users = sorted([my_user, their_user])
    conversation_id = f"{hasher.hash_password(sorted_users[0])}{hasher.hash_password(sorted_users[1])}"

    conversation = message_collection.find_one({"conversation_id": conversation_id})
    if conversation:
        return conversation.get("messages", [])
    return []

#clear messages between users in db
def clear_messages(my_user: str, their_user: str):
    message_collection = get_mongo_client()["UDPDating"]["Messages"]

    sorted_users = sorted([my_user, their_user])
    conversation_id = f"{hasher.hash_password(sorted_users[0])}{hasher.hash_password(sorted_users[1])}"

    message_collection.delete_one({"conversation_id": conversation_id})
