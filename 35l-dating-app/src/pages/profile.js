import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import resolvePotentialMatch from "../components/API/resolvePotentialMatch";
import getPotentialMatches from "../components/API/getPotentialMatches";
import getMatches from "../components/API/getMatches";
import getOutMatches from "../components/API/getOutMatches";

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
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ preferences: "", friends: ""});
    const [isMatch, setIsMatch] = useState(false);
    const [matches, setMatches] = useState([]);
    const [outMatches, setOutMatches] = useState([]);
    const navigate = useNavigate();

    const requestProfile = (username) => {
        get_profile_data(username).then(success => {
            if (success) {
                setProfileData(success);
                // if not visiting then also get list of matches to display
                if (!visitingProfile) {
                    getMatches(userInfo.username, userInfo.token).then(success => {
                        if (success) {
                            setMatches(success.content.matches);
                        }
                    })
                    getOutMatches(userInfo.username, userInfo.token).then(success => {
                        if (success) {
                            console.log(success.content.out_matches);
                            setOutMatches(success.content.out_matches);
                        }
                    })
                }
                else if (matches.includes(username)) { // check if is match for match button display
                    setIsMatch(true);
                }
                else {
                    setIsMatch(false);
                }
                setLoading(false);
            }
        });
    }


    function handleProfileRedirect(visitingUsername) {
        // redirect to profile page of friend
        if (visitingUsername === userInfo.username) {
            setVisitingProfile(false);
            setVisitingUsername("");
            setProfileData({ preferences: "", friends: "" });
            setLoading(true);
        } 
        else {
            setVisitingProfile(true);
            setVisitingUsername(visitingUsername);
            setProfileData({ preferences: "", friends: "" });
            setLoading(true);
        }
    }

    function handleMessageRedirect(visitingUsername) {
        // redirect to profile page of friend
        setMessage(visitingUsername);
        // set current messaging higher state to friend's username
        navigate("/messages");
    }

    const VisitingHeader = () => {
        if (!isLoggedIn) {
            return(<>
                <button onClick={() => {setVisitingProfile(false); setLoading(true); navigate("/posts")}}>Back to Posts</button>
                <h1>Username: {visitingUsername}</h1>
            </>);
        }
        else if (visitingProfile && isLoggedIn) {
            return (
            <>
                <button onClick={() => {setVisitingProfile(false); setLoading(true);}}>Back to my Profile</button>
                <h1> Username: {visitingUsername}</h1>
            </>);
        }
        else {
            return( <h1>Username: {userInfo.username}</h1>)
        }
    }

    function handleMatch(username, match) {
        if (!isLoggedIn) {
            alert("Please create an account to match with other users");
            navigate("/registration");
        }

        resolvePotentialMatch(userInfo.username, userInfo.token, username, match).then(success => {
            setOutMatches(outMatches => [...outMatches, username]);
            if (success === 0 && match) {
                alert("Sent Match Request to " + username);
            }
            else if (success === 9) {
                alert("Match Request already sent to " + username + "\nWait to see if they accept!");
            }
            else {
                alert("Sending Match request to " + username + " failed, please try again later");
            }
        })
    }

    function followButton() {
        if (!visitingProfile) {
            return;
        }
        if (outMatches.includes(visitingUsername)) {
            return (<button>Match Request Pending</button>);
        }
        else if (!isMatch) {
            return (<button onClick={() => handleMatch(visitingUsername, true)}>Match</button>);
        }
        else {
            return (<button>Matched</button>);
        }
    }

    function matchesList() {
        if (visitingProfile) {
            return;
        }
        function messageButton(item) {
            if (!isLoggedIn) {
                return;
            }
            return (<><button onClick={() => handleMessageRedirect(item)}>Message</button><br/></>);
        }
        if (matches.length !== 0) {
            return(
                matches.map((item, index) => (
                <li key={index}>
                    -------------------------
                    <br/>
                    <button onClick={() => handleProfileRedirect(item)}>{item}</button>
                    <br/>
                    {messageButton()}
                </li>)));
        }
        else {
            return(<p>Go to the posts page to find some new matches!</p>);
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

    useEffect(() => {
        if (loading) {
            const username = visitingProfile ? visitingUsername : userInfo.username;
            requestProfile(username);
        }
    }, [loading, visitingProfile, visitingUsername, userInfo.username]);

    if (loading) {
        return;
    }
    else {
        return(
            <> 
                <VisitingHeader/>
                {followButton()}
                <h3>Name: {profileData.name}</h3>
                <h3>From: {profileData.state},{profileData.country}</h3>
                <h3>Joined: {profileData.joinDate}</h3>
                <h3>Birthday: {profileData.birthday}</h3>
                <h3>About Me: {profileData.bio}</h3>

                <h3>My Interests:</h3>
                <ul>
                    {interestsList()}
                </ul> 

                <h3>My Preferences:</h3>
                {prefsList()}

                <h3>Matches:</h3>
                <ul>
                    {matchesList()}
                </ul>
            </>);
    }
};
 
export default Profile;