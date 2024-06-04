import React from "react";

async function sendMessage(username, token, to, message) {
    let profileUrl = new URL('http://localhost:12345/api/send_message');
    profileUrl.searchParams.append("username", username);
    profileUrl.searchParams.append("access_token", token);
    profileUrl.searchParams.append("to", to);
    profileUrl.searchParams.append("message", message);

    let response = await fetch(profileUrl.toString(), {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Sending Message failed!");
        return;
    }

    let json = await response.json();
    if (json.error === 0)
        return json;
    return false;
}

export default sendMessage;