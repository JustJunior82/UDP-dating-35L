import React from "react";

async function requestLogin(username, password) {
    let loginUrl = new URL('http://localhost:12345/api/login');
    loginUrl.searchParams.append("username", username);
    loginUrl.searchParams.append("password", password);
    let response = await fetch(loginUrl.toString(), {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Login failed!");
        return;
    }

    let json = await response.json();
    // console.log(json);

    switch (json.error) {
        case 6:
            alert("Invalid email or password. Please try again");
            return false;
        case 3:
            alert("Database Error, please try again later");
            return false;
        default:
            console.log("Success Logging in ...");
            return json;
    }
}

export default requestLogin;