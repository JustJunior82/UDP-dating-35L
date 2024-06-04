import React from "react";

async function resolvePotentialMatch(username, token, to, resolve) {
    let url = new URL('http://localhost:12345/api/resolve_potential_match');
    url.searchParams.append("username", username);
    url.searchParams.append("access_token", token);
    url.searchParams.append("to", to);
    if (resolve) {
        url.searchParams.append("success", resolve);
    }
    else {
        url.searchParams.append("success", "");
    }

    let response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Match failed!");
        return;
    }

    let json = await response.json();

    return json.error;
}

export default resolvePotentialMatch;