import React from "react";

function Profile ({ props }) {
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