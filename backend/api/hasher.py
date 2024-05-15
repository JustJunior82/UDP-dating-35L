import hashlib

def hash_password(input_str):
    hasher = hashlib.new("sha256")
    hasher.update(input_str.encode())
    return hasher.hexdigest()

def verify_password(password, hashed_password):
    return hash_password(password) == hashed_password