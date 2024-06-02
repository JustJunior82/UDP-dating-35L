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
- `access_token` (str): The user's access token.
- `profile_key` (str): The key for the profile entry.
- `profile` (str): The value for the profile entry.

**Returns:**
- A JSON response indicating success or failure (e.g., user does not exist, invalid password).

## POST /api/delete_profile_key

Deletes a profile key for a user.

**Parameters:**
- `username` (str): The username of the user.
- `access_token` (str): The user's access token.
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

=======
## POST /api/login

Login an existing user and get an access token.

**Parameters:**
- `username` (str): The username for the existing user.
- `password` (str): The password for the existing user.

**Returns:**
- An error code
- If successful,
  - access-token: Generated access token.
  - expired: POSIX timestamp indicating when access token expires.

## PUT /api/regenerate_token

Regenerate a token given a username and previous issued access
token.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.

**Returns:**
- An error code
- If successful,
  - access-token: Generated access token.
  - expired: POSIX timestamp indicating when access token expires.

## GET /api/validate_token

Validate a token given a username and access token.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.

**Returns:**
- An error code

## GET /api/search_potential_matches

Search for potential matches, ranked according to the algorithm.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.
- `skip` (int, default=0): The number of entries to skip. After querying n items, the next query should use skip=n.
- `limit` (int, default=100): The limit of number of searches. You are guaranteed that the number of search results is less than or equal to limit, possibly 0. The limit cannot exceed 100.
- `ide` (bool, default=false): Whether or not to filter for IDE.
- `os` (bool, default=false): Whether or not to filter for operating system.
- `pl` (bool, default=false): Whether or not to filter for programming language.

**Notes:**
- Other profile attributes can be added, but these are the only ones currently assessed for matching.
- Booleans in FastAPI can be set according to https://fastapi.tiangolo.com/tutorial/query-params/#query-parameter-type-conversion tldr; just use 0 (false) or 1 (true)
- Setting all of ide, os, pl to false means that there is no filter. Anyone can be considered a match, and they will still be ranked according to algorithm.

**Returns:**
- An error code
- `count` (int): the number of potential matches
- `matches` (list[str]): list of potential_matches by username ordered from best to worst

## POST /api/resolve_potential_match

Indicate whether a potential match should be accepted or not.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.
- `to` (str): A username indicating to whom we are resolving the match.
- `success` (bool): If we want to accept the potential match to a given username.

**Returns:**
- An error code

## GET /api/get_matches

Get two-way resolved matches where both you and the other person have accepted.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.

**Returns:**
- An error code
- `count` (int): the number of matches
- `matches` (list[str]): list of matches

### POST /api/img2ascii

Convert an image to ASCII. Image should either have Content-Type image/jpeg or image/png.

**Parameters:**
- `image` (str): The filename.

**Returns:**
- ASCII string

### GET /api/send_message

Sends a messager to another user. Note that messages user1 -> user2 and messages user2 -> user1 will be in the same list.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.
- `to` (str): username of recipient
- `message` (str): message contents

### GET /api/fetch_messages

Grabs a list of messages from a conversation.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.
- `to` (str): username of other user in conversation

**Returns:**
- `error`: error code
- `content`: list of messages; each message object has members `sender`, `message`, and `timestamp`

### GET /api/clear_messages

Clears conversation between logged in user and other user. Any user can one-way delete messages for privacy.

**Parameters:**
- `username` (str): The username for the existing user.
- `access_token` (str): The valid access token for the existing user.
- `to` (str): username of other user in conversation

## BUILD ##

Given the right dependencies have been installed, putting the working directory in "api" and executing "python3 main.py" should run the server on port 12345.
