import React from "react";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import Convert from "ansi-to-html";
import "../App.css"; // for the ascii styling

function Matching ({ userInfo }) {
    let [matchIndex, setMatchIndex] = React.useState(0);
    let [potentialMatches, setPotentialMatches] = React.useState([]);
    const currentProfile = potentialMatches[matchIndex];
    let [currentImage, setCurrentImage] = React.useState("");
    let [loading, setLoading] = React.useState(true);
    let navigate = useNavigate();

    let username = userInfo.username;
    let accessToken = userInfo.token;

    let convert = new Convert({newline: true, escapeXML: true});
    
    React.useEffect(() => {
        // for now, assume only up to default limit number of potential matches
        let nextPotentialMatches = [];
        let searchPotentialMatchesURL = new URL("http://localhost:12345/api/search_potential_matches");
        searchPotentialMatchesURL.searchParams.append("username", username);
        searchPotentialMatchesURL.searchParams.append("access_token", accessToken);
        searchPotentialMatchesURL.searchParams.append("limit", "8"); // this limit is currently hardcoded for performance reasons
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
    });

    React.useEffect(() => {
        if (loading || currentProfile === null)
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
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>Reject/Accept</h1>
            <div>
                {currentProfile}
            </div>
            <div className="profile-image">
                <pre>{
                    parse(convert.toHtml(currentImage))
                }</pre>
            </div>
        </div>
    );
}

export default Matching;
