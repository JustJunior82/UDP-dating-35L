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

error:
- 0 => success
- 1 => invalid email
- 2 => invalid user
- 3 => failed to insert into database