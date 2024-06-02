import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_NUM_POSTS = 10;

async function getMatchingProfiles(preference) {
    let profileUrl = new URL('http://localhost:12345/api/search_profile');
    profileUrl.searchParams.append("profile_key", "preferences");
    profileUrl.searchParams.append("profile_val", preference);
    console.log(profileUrl);
    let response = await fetch(profileUrl.toString(), {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    });
    if (response.status !== 200) {
        alert("Search failed!");
        return;
    }

    let json = await response.json();
    return json;
}

function renderPosts(info, handleProfileRedirect) {

    function preferenceList(user) {
        let prefs = user.profile.preferences.split(",");
        if (prefs.length > 3) {
            prefs = prefs.slice(0, 3);
            prefs.push("...");
        }
        return (prefs.map((item, index) => (<li key={index}>{item}</li>)));

    }
    return (
    <>
        {info.map((user) => {return (
            <div key={user.user}>
                --------------------------------
                <h3>{user.user}</h3>
                <button onClick={() => handleProfileRedirect(user.user)}>View Profile</button>
                <h4>Member since: {user.profile.joinDate}</h4>
                <h4>Preferences</h4>
                <ul> 
                    {preferenceList(user)}
                </ul>
                --------------------------------
            </div>);
        })}
    </>);
}

function Search(username, masterPrefList, update) { // handles input filtering and relays information to backend
    const [searchInput, setSearchInput] = useState("");
    const [filter, setFilter] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    function handleSubmit () {
        console.log("seaching");
        if (searchInput.length > 0) {
            // check if input is a valid preference

            if (!masterPrefList.includes(searchInput)) {
                alert("Not a valid preference");
                return;
            }
            // if valid add to filters
            setFilter(searchInput);
            // fetch profiles with preference from backend
            getMatchingProfiles(searchInput).then(success => {
                console.log("fetch request", success);
                if (success) {
                    // update displayed profiles
                    console.log("success, updating");
                    success = success.filter((event) => event.user !== username);
                    update(success.slice(0,MAX_NUM_POSTS));
                }
            })
        }
    }
    function filterButton() {
        if (filter !== "") {
            return (
                <>
                    <p>Current filter: {filter}</p> 
                    <button onClick={() => setFilter("")}>Clear filter</button>
                </>);
        }
        else {
            return;
        }
    }
    return(
        <>
            <input
            type="search"
            placeholder="Search here"
            onChange={handleChange}
            value={searchInput} />
            <button onClick={handleSubmit}>Search</button>
            <br/>
            {filterButton()}
        </>
    )
}

function Posts({ userInfo, masterPrefList, setVisitingProfile, setVisitingUsername }) {
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    function handleProfileRedirect(username) {
        setVisitingProfile(true);
        setVisitingUsername(username);
        navigate("/profile");
    }

    if (posts.length === 0) {
        getMatchingProfiles("").then(success => {
            if (success) {
                // preventing user from seeing their own profile
                success = success.filter((event) => event.user !== userInfo.username);
                setPosts(success.slice(0,MAX_NUM_POSTS));
            }
        })
    }

    return (
    <>
        <h1>View Public Profiles</h1>
        {Search(userInfo.username, masterPrefList, setPosts)}
        {renderPosts(posts, (username) => handleProfileRedirect(username))}
    </>);
};
 
export default Posts;