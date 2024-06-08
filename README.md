# UDP: UDP Dating Protocol
UCLA COM SCI 35L project.

## IMPORTANT: Setting up .env
To keep the database secure, .env files will be individually sent to TAs. They should be placed under the root UDP-dating-35L directory at UDP-dating-35L/.env.

## IMPORTANT: uvloop in requirements.txt
Windows does not support a Python package named `uvloop`. If using a Windows machine, please substitute
`backend/api/requirements.txt` with `backend/api/requirements-windows.txt`. The quickstart script attempt to do platform
detection.

## Quickstart
To just run the application, a quickstart script has been provided in the project root directory.
```sh
./quickstart.sh
```

## Setup
To setup the app, dependencies need to be installed. You will need Python 3 and Node.js.

To install backend dependencies, we recommend using a virtual environment (`venv`).
```sh
python3 -m venv venv
source venv/bin/activate
```

Then, install using `pip`.
```sh
pip install --upgrade pip
pip install -r backend/api/requirements.txt
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
This will start the backend on localhost on port 12345 supporting HTTP/1.1 i.e. `http://localhost:12345/`.

Then change to the `35l-dating-app` directory and start the frontend,
```sh
npm start
```
This will start the frontend on localhost on port 3000 i.e. `http://localhost:3000/`.

## Contributors

The following is a mapping from name to contributor username and email as displayed in `git log`.
- Zack Sima: `Zack Sima <simayance@gmail.com>`
- Andrew Wu: `yuchaeqi <137462450+yuchaeqi@users.noreply.github.com>`
- Eric Wang: `nouturnsign <89937277+nouturnsign@users.noreply.github.com>`
- Leison Gao: `Leison Gao <leisongao2005@g.ucla.edu>`

## API Documentation
See [/backend/README.md](/backend/README.md)
