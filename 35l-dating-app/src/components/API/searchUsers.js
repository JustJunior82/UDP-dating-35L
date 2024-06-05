import React from "react";

async function searchUsers(username) {
    let url = new URL('http://localhost:12345/api/search_users');
    url.searchParams.append("username", username);
    let response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Fetching Profile failed!");
        return;
    }

    let json = await response.json();
    
    return json;
}

export default searchUsers;