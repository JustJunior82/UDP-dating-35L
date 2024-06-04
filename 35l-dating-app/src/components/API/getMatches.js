import React from "react";

async function getMatches(username, token) {
    let url = new URL('http://localhost:12345/api/get_matches');
    url.searchParams.append("username", username);
    url.searchParams.append("access_token", token);

    let response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Search failed!");
        return;
    }

    let json = await response.json();

    return json;
}

export default getMatches;