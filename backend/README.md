# API Endpoints

## GET /api/search_users

Searches for users by username.

**Parameters:**
- `username` (str): The username to search for.

**Returns:**
- A JSON response with a list of users that match the username sequence.

## GET /api/search_profile

Searches user profiles for a specific key-value pair.

**Parameters:**
- `profile_key` (str): The profile key to search for.
- `profile_val` (str): The value to match against.

**Returns:**
- A JSON response with a list of users (including their profiles) that have the specified profile key with values that include the search string.

## GET /api/get_profile

Retrieves the profile of a user.

**Parameters:**
- `username` (str): The username of the user.

**Returns:**
- A JSON response with the user's profile if it exists, otherwise an error indicating the user does not exist.

## POST /api/post_profile

Posts a profile entry for a user.

**Parameters:**
- `username` (str): The username of the user.
- `password` (str): The user's password.
- `profile_key` (str): The key for the profile entry.
- `profile` (str): The value for the profile entry.

**Returns:**
- A JSON response indicating success or failure (e.g., user does not exist, invalid password).

## POST /api/delete_profile_key

Deletes a profile key for a user.

**Parameters:**
- `username` (str): The username of the user.
- `password` (str): The user's password.
- `profile_key` (str): The key to delete from the profile.

**Returns:**
- A JSON response indicating success or failure (e.g., user does not exist, invalid password).

## POST /api/register

Registers a new user.

**Parameters:**
- `username` (str): The username for the new user.
- `password` (str): The password for the new user.
- `email` (str): The email address for the new user.

**Returns:**
- A JSON response indicating success or failure (e.g., invalid email, duplicate user or email, failed MongoDB action).

## BUILD ##

Given the right dependencies have been installed, putting the working directory in "api" and executing "python3 main.py" should run the server on port 12345.
