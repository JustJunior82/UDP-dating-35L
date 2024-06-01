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

function Profile ({ userInfo, setMessage, visitingProfile, setVisitingProfile, visitingUsername, setVisitingUsername }) {
    const [found, setFound] = useState(false);
    const [profileData, setProfileData] = useState({ preferences: "", friends: ""});
    const [isFriend, setIsFriend] = useState(false);
    const navigate = useNavigate();

    function requestProfile(username) {
        get_profile_data(username).then(success => {
            if (success) {
                setFound(true);
                setProfileData(success);
                if (visitingProfile && success.friends.split(",").includes(userInfo.username)) {
                    setIsFriend(true);
                }
            }
        });
    }

    // error from redirecting to another proifle from friend proifle
    function handleProfileRedirect(visitingUsername) {
        // redirect to profile page of friend
        if (visitingUsername === userInfo.username) {
            setVisitingProfile(false);
            setVisitingUsername("");
            setProfileData({ preferences: "", friends: "" });
            setFound(false);
        } 
        else {
            setVisitingProfile(true);
            setVisitingUsername(visitingUsername);
            setProfileData({ preferences: "", friends: "" });
            setFound(false);
        }
    }

    function handleMessageRedirect(visitingUsername) {
        // redirect to profile page of friend
        setMessage(visitingUsername);
        // set current messaging higher state to friend's username
        navigate("/messages");
    }

    if (!found) {
        if (!visitingProfile) {
            requestProfile(userInfo.username);
        }
        else {
            // console.log("requesting friend proifle data");
            requestProfile(visitingUsername);
        }
        
    }

    function visitingHeader() {
        if (visitingProfile) {
            return (
            <>
                <button onClick={() => {setVisitingProfile(false); setFound(false)}}>Back to my Profile</button>
                <h1> Username: {visitingUsername}</h1>
            </>);
        }
        else {
            return( <h1>Username: {userInfo.username}</h1>)
        }
    }

    function handleFollow() {
        // add visitng profile to 
    }

    function followButton() {
        // let following = is a friend
        if (!visitingProfile)
            return;

        if (!isFriend) {
            return (<button onClick={handleFollow}>Follow</button>);
        }
        else {
            return (<button>Following</button>);
        }
    }

    return(
        <> 
            <br/>
            {visitingHeader()}
            {followButton()}
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