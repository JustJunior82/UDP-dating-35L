import React from "react";

async function get_profile_data(username) {
    let profileUrl = new URL('http://localhost:12345/api/get_profile');
    profileUrl.searchParams.append("username", username);
    let response = await fetch(profileUrl.toString(), {
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
    console.log(json);
}

async function post_profile(username) {
    
}

function Profile ({ props }) {
    get_profile_data(props.username);
    // console.log(props);
    return (
        <>
            <h1>User's Own Profile</h1>
            <h3>{props.username}</h3>
            {/* <img src={props.image} alt=""></img>
            <ul>
                {props.preferences.map((item, index) => (
                <li key={index}>{item}</li>))}
            </ul> */}
        </>
    );
};
 
export default Profile;