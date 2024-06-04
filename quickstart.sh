#!/bin/bash

# Check for .env
if ! test -f ".env"; then
    read -p "No .env file found. Did you already set the MONGODB_URI environment variable? (Y/[n]) " yn
    case $yn in
        Y ) ;;
        * ) echo "Make sure MONGODB_URI is set either in .env file or through export. Exiting."; exit 1;;
    esac
fi

# Install dependencies
/usr/bin/env python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/api/requirements.txt
cd 35l-dating-app
npm install
cd ..

# Start backend and frontend
python3 backend/api/main.py &
cd 35l-dating-app
npm start
