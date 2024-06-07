import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import resolvePotentialMatch from "../components/API/resolvePotentialMatch";
import getPotentialMatches from "../components/API/getPotentialMatches";
import getMatches from "../components/API/getMatches";
import getOutMatches from "../components/API/getOutMatches";

import parse from 'html-react-parser';
import Convert from "ansi-to-html";
import "../App.css"; // for the ascii styling

import { FaUser } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

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

function Profile ({ userInfo, isLoggedIn, setMessage, visitingProfile, setVisitingProfile, visitingUsername, setVisitingUsername, matches, setMatches, outMatches, setOutMatches }) {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ preferences: "", friends: ""});
    const [isMatch, setIsMatch] = useState(false);
    const navigate = useNavigate();
    const noImage = "";
    const [selectedImage, setSelectedImage] = React.useState(noImage);

    let convert = new Convert({newline: true, escapeXML: true});

    let username = userInfo["username"];
    let accessToken = userInfo["token"];
    React.useEffect(() => {
        let getProfileImageUrl = new URL('http://localhost:12345/api/get_profile_image');
        getProfileImageUrl.searchParams.append("username", username);
        getProfileImageUrl.searchParams.append("access_token", accessToken);
        fetch(getProfileImageUrl.toString()).then(
            (response) => {
                if (response.status !== 200) {
                    // alert("Not logged in!");
                    navigate("/login");
                    return {error: 0, image: noImage};
                }
                return response.json(); 
            }
        ).then(
            (responseData) => {
                if (responseData["error"] !== 0) {
                    alert("Failed to fetch profile image.");
                    return noImage;
                }
                return responseData["content"];
            }
        ).then(
            (image) => {
                setSelectedImage(image);
            }
        ).catch(
            error => {}
        )},
        [navigate, username, accessToken]
    );

    function isPrivate() {
        return(("public" in profileData) && profileData.public === "false");
    }

    function requestProfile(username) {
        get_profile_data(username).then(success => {
            if (success) {
                setProfileData(success);
                // if not visiting then also get list of matches to display
                console.log("success:", success);
                console.log("visitng", visitingProfile);

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
                    console.log("matches for", userInfo.username);
                    console.log(matches);
                    setIsMatch(true);
                }
                else {
                    console.log("matches for", userInfo.username);
                    console.log(matches);
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
        // console.log("visitng", visitingUsername);
        // console.log("setmessage", userInfo.message);
    }

    const VisitingHeader = () => {
        if (!isLoggedIn) {
            return(<>
                {/* <button onClick={() => {setVisitingProfile(false); setLoading(true); navigate("/posts")}}>Back to Posts</button> */}
                <div className='username'><span className='profile-user-icon'><FaUser /></span> {visitingUsername}</div>
            </>);
        }
        else if (visitingProfile && isLoggedIn) {
            return (
            <>
                {/* <button onClick={() => {setVisitingProfile(false); setLoading(true);}}>Back to my Profile</button> */}
                <div className='username'><span className='profile-user-icon'><FaUser /></span> {visitingUsername}</div>
            </>);
        }
        else {
            return(<div className='username'><span className='profile-user-icon'><FaUser /></span> {userInfo.username}</div>)
            
        }
    }

    const VisitingButton = () => {
        if (!isLoggedIn) {
            return(<>
                <button onClick={() => {setVisitingProfile(false); setLoading(true); navigate("/posts")}}>Back to Posts</button>
            </>);   
        }
        else if (visitingProfile && isLoggedIn) {
            return (
                <button onClick={() => {setVisitingProfile(false); setLoading(true);}}>Back to my Profile</button>
            );
        }
    }
    
    const ProfilePicture = () => {
        if (!isLoggedIn) {
            return (
                <>
                    <div className="profile-image">
                        <pre>{
                            parse(convert.toHtml(selectedImage))
                        }</pre>
                        {/* <div className='pfptext'>Profile Picture</div> */}
                    </div>  
                </>
            )
        }
        else if (visitingProfile && isLoggedIn) {
            return (
                <>
                    <div className="profile-image">
                        <pre>{
                            parse(convert.toHtml(selectedImage))
                        }</pre>
                        {/* <div className='pfptext'>Profile Picture</div> */}
                    </div>  
                </>
            );
        }
        else {
            return (
                <>
                        <pre>{
                            parse(convert.toHtml(selectedImage))
                        }</pre>
                        {/* <div className='pfptext'>Profile Picture</div> */}
                </>
            );
            
        }
    }

    function handleMatch(username, match) {
        if (!isLoggedIn) {
            alert("Please create an account to match with other users");
            navigate("/registration");
            return;
        }

        resolvePotentialMatch(userInfo.username, userInfo.token, username, match).then(success => {
            console.log("setting out matches before", outMatches);
            setOutMatches(outMatches => [...outMatches, username]);
            console.log("setting out matches after", outMatches);
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

    function followButton(isMatch) {
        console.log("rerender follow button ", isMatch);
        if (!visitingProfile) {
            return;
        }
        if (outMatches.includes(visitingUsername)) {
            return (
                <div className='pending-button'>
                    <button>Match Request Pending</button>
                </div>
            );
        }
        else if (!isMatch) {
            return (
                <div className='match-button'>
                    <button onClick={() => handleMatch(visitingUsername, true)}>Match</button>
                </div>
                
            );
        }
        else {
            return (
                <div className='matched-button'>
                    <button>Matched</button>
                </div>
            );
        }
    }

    const MatchesList = () => {
        if (visitingProfile) {
            return;
        }

        const MessageButton = ({ item }) => {
            if (!isLoggedIn) {
                return;
            }
            return (<button onClick={() => handleMessageRedirect(item)}>Message</button>);
        }
        if (matches.length !== 0) {
            return(<div className='profile-matches-body'>
               
                <h3 className=''>My Matches</h3>
                
                <div className='matches-list'>
                {matches.map((item, index) => (
                    <div key={index}>
                    <div className='profile-text'>
                        <div className='matched-user' onClick={() => handleProfileRedirect(item)}>{item}</div>
                        <span className='messages-button'>
                            <MessageButton item={item}/>
                        </span>
                    </div>
                    
            </div>
        ))} </div>
        </div>
    );
        }
        else {
            return(<div className='profile-matches-body'>
                <h3>My Matches</h3>
                <p>Go to the Matches page to find some new matches or search by preferenes on the Search Page!</p>
            </div>);
        }
    }

    const PrefsList = () => {
        if (!("preferences" in profileData)) {
            if (visitingProfile) {
                return (<>
                    <h3>&emsp;My Preferences:</h3><ul><li key="none">None</li></ul>
                </>);
            }
            else {
                return (<>
                    <h3>&emsp;My Preferences:</h3><ul><li key="none">Add to your preferences list on the Settings page</li></ul>
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
            <h3>&emsp;My Preferences:</h3>
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
                    <br/>
                    <h3>&emsp;My Interests:</h3>
                    <ul> <li key="none">None</li></ul>
                </>);
            }
            else {
                return (<>
                    <br/>
                    <h3>&emsp;My Interests:</h3>
                    <ul><li key="none">Add to your interests list on the Settings page</li></ul>
                </>)
            }
        }
        return (<>
            <br/>
            <h3>&emsp;My Interests:</h3>
            <ul>{profileData.interests.split(",").map((item, index) => (<li key={index}>{item}</li>))}</ul>
            </>);
    }

    const PrivatePortion = () => {
        if (isPrivate() && visitingProfile) {
            return(<p>This Profile is private, match with {visitingUsername} to see their full profile</p>);
        }
        else {
            return(
                <>
                    <div className='profile-birthday'>
                        <span style={{marginRight: '5px'}}><FaBirthdayCake /></span>
                        Birthday: {profileData.birthday}
                    </div>
                    <div className='profile-aboutme'>
                        About Me: 
                            <div className='profile-bio'>
                                <div>
                                    {`\t${profileData.bio}`}
                                </div>
                            </div>
                        <div className='profile-matches'>
                            <MatchesList/>
                        </div>      
                    </div>
                    <div className='interests-and-preferences'>
                        <InterestsList/>
                        <PrefsList/>
                    </div>
                    
                </>);
        }
    }
    

    useEffect(() => {
        if (loading) {
            const username = visitingProfile ? visitingUsername : userInfo.username;
            requestProfile(username);
        }
    }, [loading, visitingProfile, visitingUsername, userInfo.username]);

    useEffect(() => {
        console.log("isMatch updated:", isMatch);
    }, [isMatch]);

    useEffect(() => {
        console.log("matches updated:", matches);
    }, [matches]);

    if (loading) {
        return;
    }
    else {
        // allow everyone to see username, and join date
        return(
            <div>
                <div className='visiting-button'>
                    <VisitingButton/>
                </div>
                <div className='pfp'>
                    <ProfilePicture/>
                </div>
            <div className='profile-body'>
                        <div className='user-card'>
                            <VisitingHeader/>
                            <br/>
                            <div className='user-dates'>
                                <span style={{marginRight: '10px'}}><BsCalendarDateFill /></span>{" "}Join Date: {profileData.joinDate}
                            </div>
                        </div>
                <div className='profile-body-left'>

                </div>
                <div className='profile-body-right'>
                    <PrivatePortion/>
                </div>
                {followButton(isMatch)}
            </div>
            </div>
        );
    }
};
 
export default Profile;