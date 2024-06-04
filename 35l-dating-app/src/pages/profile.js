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


    function isPrivate() {
        return(("public" in profileData) && profileData.public === "false");
    }

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

    const FriendsList = () => {
        if (!("friends" in profileData)) {
            if (visitingProfile) {
                return(<>
                <h3>Friends:</h3>
                <ul><li>{visitingUsername} has no friends yet. Message them to start chatting!</li></ul>
                </>);
            }
            else {
                return(<>
                    <h3>Friends:</h3>
                    <ul><li>Go to the posts page to find some new friends!</li></ul>
                    </>);
            }
        }

        const MessageButton = (item) => {
            if (!isLoggedIn) {
                return;
            }
            return (<button onClick={() => handleMessageRedirect(item)}>Message</button>);
        }

        if (Object.keys(profileData.friends).length !== 0) {
            return(
                <>
                    <h3>Friends:</h3>
                    <ul>
                        {profileData.friends.split(",").map((item, index) => (
                        <li key={index}>
                            -------------------------
                            <br/>
                            <button onClick={() => handleProfileRedirect(item)}>{item}</button>
                            <br/>
                            <MessageButton/>
                        </li>))}
                    </ul>
                    </>
                );
        }
        else if (visitingProfile) {
            return(<>
            <h3>Friends:</h3>
            <ul><li>{visitingUsername} has no friends yet. Message them to start chatting!</li></ul>
            </>);
        }
        else {
            return(<>
                <h3>Friends:</h3>
                <ul><li>Go to the posts page to find some new friends!</li></ul>
                </>);
        }
    }

    const PrefsList = () => {
        if (!("preferences" in profileData)) {
            if (visitingProfile) {
                return (<>
                    <h3>My Preferences:</h3><ul><li key="none">None</li></ul>
                </>);
            }
            else {
                return (<>
                    <h3>My Preferences:</h3><ul><li key="none">Add to your preferences list on the Settings page</li></ul>
                </>);
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
            <>
            <h3>My Preferences:</h3>
            <ul>
                <h4>ide:</h4>
                {ide}
                <h4>os:</h4>
                {os}
                <h4>pl:</h4>
                {pl}
            </ul>
            </>);
    }

    const InterestsList = () => {
        if (!("interests" in profileData)) {
            if (visitingProfile) {
                return (<>
                    <h3>My Interests:</h3>
                    <ul> <li key="none">None</li></ul>
                </>);
            }
            else {
                return (<>
                    <h3>My Interests:</h3>
                    <ul><li key="none">Add to your interests list on the Settings page</li></ul>
                </>)
            }
        }
        return (<>
            <h3>My Interests:</h3>
            <ul>{profileData.interests.split(",").map((item, index) => (<li key={index}>{item}</li>))}</ul>
            </>);
    }

    const PrivatePortion = () => {
        if (isPrivate() && visitingProfile) {
            return(<p>This Profile is private, follow {visitingUsername} to see their full profile</p>);
        }
        else {
            return(<>
                <h3>Name: {profileData.name}</h3>
                <h3>From: {profileData.state},{profileData.country}</h3>
                <h3>Joined: {profileData.joinDate}</h3>
                <h3>Birthday: {profileData.birthday}</h3>
                <h3>About Me: {profileData.bio}</h3>
                <InterestsList/>
                <PrefsList/>

                <FriendsList/>
            </>);
        }
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
        // allow everyone to see username, and join date
        return(
            <> 
                <br/>
                {visitingHeader()}
                {followButton()}
                <h3>Joined: {profileData.joinDate}</h3>
                <PrivatePortion/>
            </>);
    }
};
 
export default Profile;