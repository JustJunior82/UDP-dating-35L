import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import getMatchingProfiles from "../components/API/getMatchingProfiles";

const MAX_NUM_POSTS = 100;
const MAX_PREFS_DISPLAYED = 2;

function renderPosts(info, handleProfileRedirect) {
    function isPrivate(user) {
        return(("public" in user) && user.public === "false");
    }

    function prefsList(user) {
        if (!("preferences" in user.profile)) {
            return(<ul><li key="none">None</li></ul>);
        }
        let ide = [];
        let os = [];
        let pl = [];
        let value;
        for (value of user.profile.preferences.split(",")) {
            if (value !== "") {
                if (value.startsWith("ide")) { ide.push(<li key={value}>{value.slice(4,)}</li>); }
                else if (value.startsWith("os")) { os.push(<li key={value}>{value.slice(3,)}</li>); }
                else { pl.push(<li key={value}>{value.slice(3,)}</li>); }
            }
        }

        if (ide.length > MAX_PREFS_DISPLAYED) { ide = ide.slice(0, MAX_PREFS_DISPLAYED).push("..."); }
        if (os.length > MAX_PREFS_DISPLAYED) { os = os.slice(0, MAX_PREFS_DISPLAYED).push("..."); }
        if (pl.length > MAX_PREFS_DISPLAYED) { pl = pl.slice(0, MAX_PREFS_DISPLAYED).push("..."); }

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

    function interestsList(user) {
        if (!("interests" in user.profile)) {
            return (<li key="none">None</li>)
        }
        return (
            user.profile.interests.split(",").map((item, index) => (
            <li key={index}>{item}</li>)));
    }

    const PrivatePortion = (props) => {
        if (isPrivate(props.user.profile)) {
            return (<p>This Profile is private <br/>(limited information will be displayed)</p>)
        }
        else {
            return(<>
                <h4>Interests</h4>
                <ul>
                {interestsList(props.user)}
                </ul>
                <h4>Preferences</h4>
                {prefsList(props.user)}
            </>);
        }
    }

    return (
    <>
        {info.map((user) => {return (
            <div key={user.user}>
                --------------------------------
                <h3>{user.user}</h3>
                <button onClick={() => handleProfileRedirect(user.user)}>View Profile</button>
                <h4>Member since: {user.profile.joinDate}</h4>
                <PrivatePortion user={user}/>
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
            getMatchingProfiles("preferences", searchInput).then(success => {
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
        getMatchingProfiles("joinDate", "-").then(success => {
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