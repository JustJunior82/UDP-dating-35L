import React from "react";

async function getMatchingProfiles(key, value) {
    let profileUrl = new URL('http://localhost:12345/api/search_profile');
    profileUrl.searchParams.append("profile_key", key);
    profileUrl.searchParams.append("profile_val", value);
    console.log(profileUrl);
    let response = await fetch(profileUrl.toString(), {
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

export default getMatchingProfiles;