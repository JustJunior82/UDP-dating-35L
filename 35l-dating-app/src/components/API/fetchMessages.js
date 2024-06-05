import React from "react";


async function fetchMessages(username, token, to) {
    let profileUrl = new URL('http://localhost:12345/api/fetch_messages');
    profileUrl.searchParams.append("username", username);
    profileUrl.searchParams.append("access_token", token);
    profileUrl.searchParams.append("to", to);

    let response = await fetch(profileUrl.toString(), {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Fetching Messages failed!");
        return;
    }

    let json = await response.json();
    if (json.error === 0)
        return json;
    return false;
}

export default fetchMessages;