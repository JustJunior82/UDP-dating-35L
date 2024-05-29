import React from "react";

async function get_profile_data(username) {
    const response = await fetch("http://0.0.0.0:12345/api/get_profile", {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
		body: JSON.stringify({username: username})
    });
    const profile = await response.json();
    console.log(profile);
}

async function post_profile(username) {
    
}

function Profile ({ props }) {
    get_profile_data(props.username);
    return (
        <>
            <h1>User's Own Profile</h1>
            <h3>{props.username}</h3>
            <img src={props.image} alt=""></img>
            <ul>
                {props.preferences.map((item, index) => (
                <li key={index}>{item}</li>))}
            </ul>
        </>
    );
};
 
export default Profile;