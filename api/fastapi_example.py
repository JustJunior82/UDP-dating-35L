from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/say_hi")
async def hi(my_field:str):
	return f"hi {my_field}!"

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
'''
