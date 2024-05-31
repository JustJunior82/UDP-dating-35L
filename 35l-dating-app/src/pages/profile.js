import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    if (json.error === 0)
        return json.profile;
    return false;
}

function Profile ({ userInfo, setMessage, visitingProfile, setVisitingProfile, friendUsername, setFriendUsername }) {
    const [found, setFound] = useState(false);
    const [profileData, setProfileData] = useState({ preferences: "", friends: ""});
    const navigate = useNavigate();

    function requestProfile(username) {
        get_profile_data(username).then(success => {
            console.log(success);
            if (success) {
                setFound(true);
                setProfileData(success);
                // console.log("profile_data:", success);
            }
        });
    }

    function handleProfileRedirect(friendUsername) {
        // redirect to profile page of friend
        setVisitingProfile(true);
        setFriendUsername(friendUsername);
        setFound(false);
        // setProfileData({ preferences: "", friends: ""});
    }

    function handleMessageRedirect(friendUsername) {
        // redirect to profile page of friend
        setMessage(friendUsername);
        // set current messaging higher state to friend's username
        navigate("/messages");
    }

    if (!found) {
        if (!visitingProfile) {
            requestProfile(userInfo.username);
        }
        else {
            console.log("requesting friend proifle data");
            requestProfile(friendUsername);
        }
        
    }

    function visiting() {
        if (visitingProfile) {
            return (
            <>
                <button onClick={() => {setVisitingProfile(false); setFound(false)}}>Back to my Profile</button>
                <h1> Username: {friendUsername}</h1>
            </>);
        }
        else {
            return( <h1>Username: {userInfo.username}</h1>)
        }
    }
    return(
        <> 
            <br/>
            {visiting()}
            <img src={profileData.pfp} alt=""></img>
            <h3>From: {profileData.state},{profileData.country}</h3>
            <h3>Joined: {profileData.joinDate}</h3>
            <h3>Birthday: {profileData.birthday}</h3>

            <h3>My Preferences:</h3>
            <ul>
                {profileData.preferences.split(",").map((item, index) => (
                <li key={index}>{item}</li>))}
            </ul> 
            <h3>Friends:</h3>
            <ul>
                {profileData.friends.split(",").map((item, index) => (
                <li key={index}>
                    -------------------------
                    <br/>
                    <button onClick={() => handleProfileRedirect(item)}>{item}</button>
                    <br/>
                    <button onClick={() => handleMessageRedirect(item)}>Message</button>
                    <br/>
                    -------------------------
                </li>))}
            </ul>
        </>);
    
};
 
export default Profile;