import React from "react";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import Convert from "ansi-to-html";
import { useHotkeys } from 'react-hotkeys-hook'
import "../App.css"; // for the ascii styling

function Matching ({ userInfo }) {
    let [matchIndex, setMatchIndex] = React.useState(0);
    let [potentialMatches, setPotentialMatches] = React.useState([]);
    const currentProfile = matchIndex < potentialMatches.length ? potentialMatches[matchIndex] : null;
    let [currentImage, setCurrentImage] = React.useState("");
    let [loading, setLoading] = React.useState(true);
    let navigate = useNavigate();

    let [username, setUsername] = React.useState(userInfo.username);
    let [accessToken, setAccessToken] = React.useState(userInfo.token);

    let convert = new Convert({newline: true, escapeXML: true});

    async function handleReject() {
        console.log("reject");
        let resolveMatchUrl = new URL("http://localhost:12345/api/resolve_potential_match");
        resolveMatchUrl.searchParams.append("username", username);
        resolveMatchUrl.searchParams.append("access_token", accessToken);
        resolveMatchUrl.searchParams.append("to", currentProfile);
        resolveMatchUrl.searchParams.append("success", "false");
        let response = await fetch(resolveMatchUrl.toString(), {method: "POST"});
        if (response.status !== 200) {
            alert("Failed to reject current profile. Continuing...");
            // continue despite failure
        }
        else {
            let content = await response.json();
            if (content["error"] !== 0) {
                alert("Failed to reject current profile. Continuing...");
                // continue despite failure
            }
        }
        setMatchIndex(matchIndex + 1);
    }

    async function handleAccept() {
        console.log("accept");
        let resolveMatchUrl = new URL("http://localhost:12345/api/resolve_potential_match");
        resolveMatchUrl.searchParams.append("username", username);
        resolveMatchUrl.searchParams.append("access_token", accessToken);
        resolveMatchUrl.searchParams.append("to", currentProfile);
        resolveMatchUrl.searchParams.append("success", "true");
        let response = await fetch(resolveMatchUrl.toString(), {method: "POST"});
        if (response.status !== 200) {
            alert("Failed to reject current profile. Continuing...");
            // continue despite failure
        }
        else {
            let content = await response.json();
            if (content["error"] !== 0) {
                alert("Failed to accept current profile. Continuing...");
                // continue despite failure
            }
        }
        setMatchIndex(matchIndex + 1);
    }

    useHotkeys('ctrl+b', handleReject);
    useHotkeys('ctrl+f', handleAccept);
    
    React.useEffect(() => {
        // for now, assume only up to default limit number of potential matches
        let nextPotentialMatches = [];
        let searchPotentialMatchesURL = new URL("http://localhost:12345/api/search_potential_matches");
        searchPotentialMatchesURL.searchParams.append("username", username);
        searchPotentialMatchesURL.searchParams.append("access_token", accessToken);
        searchPotentialMatchesURL.searchParams.append("limit", "20"); // this limit is currently hardcoded for performance reasons
        fetch(searchPotentialMatchesURL.toString()).then(
            (response) => {
                if (response.status !== 200) {
                    // alert("Not logged in!");
                    navigate("/login");
                    return;
                }
                setLoading(false);
                return response.json(); 
            }
        ).then(
            (responseData) => {
                if (responseData["error"] !== 0) {
                    alert("Failed to search for potential messages.");
                    return {
                        count: 0,
                        matches: [],
                    };
                }
                return responseData["content"]["matches"];
            }
        ).then(
            (matches) => {
                nextPotentialMatches = matches;
                // console.log("matches", nextPotentialMatches);
                setPotentialMatches(nextPotentialMatches);
            }
        ).catch(
            error => {
                navigate("/login");
            }
        )
    }, [username, accessToken, navigate]);

    React.useEffect(() => {
        if (loading || currentProfile === undefined || currentProfile === null)
            return;
        let getProfileImageUrl = new URL('http://localhost:12345/api/get_profile_image');
        getProfileImageUrl.searchParams.append("username", currentProfile);
        fetch(getProfileImageUrl.toString()).then(
            (response) => {
                return response.json(); 
            }
        ).then(
            (responseData) => {
                if (responseData["error"] !== 0) {
                    alert("Failed to fetch profile image.");
                    return "";
                }
                return responseData["content"];
            }
        ).then(
            (image) => {
                if (image === "") {
                    setCurrentImage("No image found.");
                } else {
                    setCurrentImage(image);
                }
            }
        ).catch(
            error => {}
        )
    }, [loading, currentProfile]);

    if (loading) {
        return <div className='loading'>Loading...</div>;
    }
    if (currentProfile === null) {
        return <div className='no-matches'>No more matches.</div>;
    }

    return (
        <div className='matching-bg'>
            <div className='matching'>
                <div>
                    <span className='reject'>Reject (ctrl+b)</span> <span className='slash'>/</span> <span className='accept'>Accept (ctrl+f)</span>
                </div>
                <div className="profile-image matching-pfp">
                    <pre>{
                        parse(convert.toHtml(currentImage))
                    }</pre>
                </div>
                <div className='matching-user'>
                    {currentProfile}
                </div>
                <div className='matching-buttons'>
                    <button onClick={handleReject}>Reject</button>
                    <button onClick={handleAccept}>Accept</button>
                </div>
                
            </div>
        </div>
        
    );
}

export default Matching;
