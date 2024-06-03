# UDP: UDP Dating Protocol
UCLA COM SCI 35L project.

## Setup
To setup the app, dependencies need to be installed.

To install backend dependencies, we recommend using a virtual environment (`venv`).
```sh
python3 -m venv venv
source venv/bin/activate
```

Then, install using `pip`.
```sh
pip install --upgrade pip
pip install backend/api/requirements.txt
```

To install frontend dependencies, use a fairly recently version of Node (e.g. 21.6.1). Then,
```sh
cd 35l-dating-app
npm install
```

## Usage
Assuming you are in the project root directory, to run the app, use the virtual environment. Assuming you are in the project root directory,
```sh
source venv/bin/activate
python3 backend/api/main.py
```
This will start the backend on localhost on port 12345 supporting HTTP/1.1 i.e. (`http://localhost:12345/`).

Then change to the `35l-dating-app` directory and start the frontend,
```sh
cd 35l
npm start
```

## API Documentation
See [/backend/README.md](/backend/README.md)
