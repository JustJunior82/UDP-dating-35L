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

async function postProfile(username, password, key, value) {
    let profileURL = new URL('http://localhost:12345/api/post_profile');
    profileURL.searchParams.append("username", username);
    profileURL.searchParams.append("password", password);
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
        console.log(json.error);
        alert("Error creating profile. Please try again");
        return false;
    }
    return true;
}

function Profile ({ userInfo, isLoggedIn, setMessage, visitingProfile, setVisitingProfile, visitingUsername, setVisitingUsername }) {
    const [found, setFound] = useState(false);
    const [profileData, setProfileData] = useState({ preferences: "", friends: ""});
    const [isFriend, setIsFriend] = useState(false);
    const navigate = useNavigate();

    function requestProfile(username) {
        get_profile_data(username).then(success => {
            if (success) {
                setFound(true);
                setProfileData(success);
                console.log("checking if " + username + "is a friend of" + userInfo.username);
                console.log(success);
                get_profile_data(userInfo.username).then(s => {
                    if (s)  {
                        if (visitingProfile && s.friends.split(",").includes(username)) {
                            setIsFriend(true);
                        }
                        else {
                            setIsFriend(false);
                        }
                    }
                    else {
                        setIsFriend(false);
                    }
                })
                
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

    function visitingHeader() {
        if (!isLoggedIn) {
            return(<>
                <button onClick={() => {setVisitingProfile(false); setFound(false); navigate("/posts")}}>Back to Posts</button>
                <h1>Username: {visitingUsername}</h1>
            </>);
        }
        else if (visitingProfile && isLoggedIn) {
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

    function handleFollow(username, follow) {
        // add visitng profile to
        if (!isLoggedIn) {
            alert("Please create an account to follow other users");
            navigate("/registration");
        }
        get_profile_data(userInfo.username).then(success => {
            if (success) {
                let newFriends = success.friends;

                if (follow) {
                    newFriends = newFriends + "," + username;
                }
                else {
                    newFriends = newFriends.split(",").filter((event) => event !== username).join(",");
                }
                
                console.log("newfirends are: ", newFriends);
                postProfile(userInfo.username, userInfo.password, "friends", newFriends).then(success => {
                    if (success) {
                        setIsFriend(follow);
                    }
                    else {
                        alert("Following " + username + " failed, please try again later");
                    }
                })
            }
        });
    }

    function followButton() {
        if (!visitingProfile) {
            return;
        }
        if (!isFriend) {
            return (<button onClick={() => handleFollow(visitingUsername, true)}>Follow</button>);
        }
        else {
            return (
                <>
                    <button>Following</button>
                    <button onClick={() => handleFollow(visitingUsername, false)}>Unfollow</button>
                </>
            );
        }
    }

    function friendsList() {
        if (!("friends" in profileData)) {
            if (visitingProfile) {
                return(<p>{visitingUsername} has no friends yet. Message them to start chatting!</p>)
            }
            else {
                return(<p>Go to the posts page to find some new friends!</p>);
            }
        }
        function messageButton(item) {
            if (!isLoggedIn) {
                return;
            }
            return (<><button onClick={() => handleMessageRedirect(item)}>Message</button><br/></>);
        }
        if (Object.keys(profileData.friends).length !== 0) {
            return(
                profileData.friends.split(",").map((item, index) => (
                <li key={index}>
                    -------------------------
                    <br/>
                    <button onClick={() => handleProfileRedirect(item)}>{item}</button>
                    <br/>
                    {messageButton()}
                    -------------------------
                </li>)));
        }
        else if (visitingProfile) {
            return(<p>{visitingUsername} has no friends yet. Message them to start chatting!</p>)
        }
        else {
            return(<p>Go to the posts page to find some new friends!</p>);
        }
    }

    function prefsList() {
        if (!("preferences" in profileData)) {
            if (visitingProfile) {
                return (<ul><li key="none">None</li></ul>);
            }
            else {
                return (<ul><li key="none">Add to your preferences list on the Settings page</li></ul>);
            }
        }
        let ide = [];
        let os = [];
        let pl = [];
        let value;

        for (value of profileData.preferences.split(",")) {
            if (value !== "") {
                if (value.startsWith("ide")) {
                    ide.push(<li key={value}>{value.slice(4,)}</li>);
                }
                else if (value.startsWith("os")) {
                    os.push(<li key={value}>{value.slice(3,)}</li>);
                }
                else {
                    pl.push(<li key={value}>{value.slice(3,)}</li>);
                }
            }
        }
        return (
            <ul>
                <h4>ide:</h4>
                {ide}
                <h4>os:</h4>
                {os}
                <h4>pl:</h4>
                {pl}
            </ul>
        )
    }

    function interestsList() {
        if (!("interests" in profileData)) {
            if (visitingProfile) {
                return (<li key="none">None</li>);
            }
            else {
                return (<li key="none">Add to your interests list on the Settings page</li>)
            }
        }
        return (
            profileData.interests.split(",").map((item, index) => (
            <li key={index}>{item}</li>)));
    }

    if (!found) {
        if (!visitingProfile) {
            requestProfile(userInfo.username);
        }
        else {
            requestProfile(visitingUsername);
        }
        return;
    }

    else {
        return(
            <> 
                <br/>
                {visitingHeader()}
                {followButton()}
                {/* <img src={profileData.pfp} alt=""></img> */}
                <h3>Name: {profileData.name}</h3>
                <h3>From: {profileData.state},{profileData.country}</h3>
                <h3>Joined: {profileData.joinDate}</h3>
                <h3>Birthday: {profileData.birthday}</h3>
                <h3>About Me: {profileData.bio}</h3>

                <h3>My Interests:</h3>
                <ul>
                    {interestsList()}
                    {/* {profileData.interests.split(",").map((item, index) => (
                        <li key={index}>{item}</li>))} */}
                </ul> 

                <h3>My Preferences:</h3>
                {prefsList()}

                <h3>Friends:</h3>
                <ul>
                    {friendsList()}
                </ul>
            </>);
    }
};
 
export default Profile;