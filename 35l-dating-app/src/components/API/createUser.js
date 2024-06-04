import React from "react";

async function createUser(email, username, password) {
    let registrationURL = new URL('http://localhost:12345/api/register');
    registrationURL.searchParams.append("username", username);
    registrationURL.searchParams.append("password", password);
    registrationURL.searchParams.append("email", email);
    let response = await fetch(registrationURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
		// body: JSON.stringify({username: username, password: password, email: email})
    });

    if(await response.status !== 200) {
        alert("Creating a user failed!");
        return;
    }

    let json = await response.json();
    console.log(json);

    switch (json.error) {
        case 1:
            alert("Invalid Email. Please enter valid Email");
            return false;
        case 2:
            alert("Email/Username Already Taken!");
            return false;
        case 3:
            alert("Database Error, please try again later");
            return false;
        default:
            console.log("Success creating user");
            return true;
    }
}

export default createUser;