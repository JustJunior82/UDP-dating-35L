# UDP Dating API Documentation

## Setup
Requires private `.env` variables. Make sure you have `.env`!

## Operations

### Say hi
GET
`/api/say_hi?my_field={field}`

Say hi to field!

Response body:
String of the form "hi {field}!"

### Register
POST
`/api/register?username={username}&email={email}&password={password}`

Register a user.

Response body:

### Login
POST
`/api/login?username={username}&password={password}`

Login an existing user.

Response body:

If successful,
access-token: Generated access token.
expired: POSIX timestamp indicating when access token expires.

### Token regeneration
PUT
`/api/regenerate_token?username={username}&access_token={access_token}`

Attempt to regenerate a token given a username and previous issued access
token.

Response body:

If successful,
access-token: New access token,
expired: POSIX timestamp indicating when new access token expires.

### Token validation
GET
`/api/validate_token?username={username}&access_token={access_token}`

Attempt to validate a token given a username and access token.
