import React from "react";

async function postProfile(username, token, props) {
    let errors = false;
    for (const [key, value] of Object.entries(props)) {
        let profileURL = new URL('http://localhost:12345/api/post_profile');
        profileURL.searchParams.append("username", username);
        profileURL.searchParams.append("access_token", token);
        profileURL.searchParams.append("profile_key", key);
        profileURL.searchParams.append("profile", value);
        console.log(profileURL);
    
        let response = await fetch(profileURL.toString(), {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        });
    
        if (response.status !== 200) {
            alert("Profile upload failed!");
            return;
        }
    
        let json = await response.json();
    
        if (json.error !== 0) {
            errors = true;
        }
    }
    if (errors)
        alert("Error creating profile. Please try again");
    return !errors;
}

export default postProfile;