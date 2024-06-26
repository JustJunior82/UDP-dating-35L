import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import getMatchingProfiles from "../components/API/getMatchingProfiles";
import searchUsers from "../components/API/searchUsers";

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

        if (ide.length > MAX_PREFS_DISPLAYED) { ide = [ide.slice(0, MAX_PREFS_DISPLAYED), <li key={0}>...</li>]; }
        if (os.length > MAX_PREFS_DISPLAYED) { os = [os.slice(0, MAX_PREFS_DISPLAYED), <li key={0}>...</li>]; }
        if (pl.length > MAX_PREFS_DISPLAYED) { pl = [pl.slice(0, MAX_PREFS_DISPLAYED), <li key={0}>...</li>]; }

        return (
            <ul>
                <h7>ide:</h7>
                {ide}
                <h7>os:</h7>
                {os}
                <h7>pl:</h7>
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
                <div className='posts-content'>
                    <div className='posts-subtitle'>Interests</div>
                    <ul>
                    {interestsList(props.user)}
                    </ul>
                    <div className='posts-subtitle'>Preferences</div>
                    {prefsList(props.user)}
                </div>
                
            </>);
        }
    }

    return (
    <>
        {info.map((user) => {return (
            <div key={user.user}>
                <hr className='thin-posts-horizontal-bar' />
                <div className='single-post'>
                    <div className='posts-user'>
                        <div className='posts-username'>
                            {user.user}
                        </div>
                        <div className='posts-click'>
                            <span onClick={() => handleProfileRedirect(user.user)}>View Profile</span>
                        </div>
                    </div>
                    
                    
                    <div className='posts-join'>Member since: {user.profile.joinDate}</div>
                    <PrivatePortion user={user}/>
                </div>
                
            </div>);
        })}
    </>);
}

function Search({ username, masterPrefList, masterInterestsList, update }) { // handles input filtering and relays information to backend
    const [searchInput, setSearchInput] = useState("");
    const [filter, setFilter] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    function handleSubmit () {
        if (searchInput.length > 0) {
            // check if input is a valid preference, interest, or username
            let key = "";
            if (Object.values(masterPrefList).flat().includes(searchInput)) {
                setFilter(searchInput);
                // fetch profiles with preference from backend
                getMatchingProfiles("preferences", searchInput).then(success => {
                    console.log("fetch request", success);
                    if (success) {
                        // update displayed profiles
                        console.log("success, updating, preferences");
                        success = success.filter((event) => event.user !== username);
                        update(success.slice(0,MAX_NUM_POSTS));
                        setSearchInput("");
                    }
                })
            }
            else if (masterInterestsList.includes(searchInput)) {
                setFilter(searchInput);
                // fetch profiles with preference from backend
                getMatchingProfiles("interests", searchInput).then(success => {
                    console.log("fetch request", success);
                    if (success) {
                        // update displayed profiles
                        console.log("success, updating, intetests");
                        success = success.filter((event) => event.user !== username);
                        update(success.slice(0,MAX_NUM_POSTS));
                        setSearchInput("");
                    }
                })
            }
            else {
                // try to search for profile, if success redirect to profile
                searchUsers(searchInput).then(success => {
                    if (success.length !== 0) {
                        setFilter(searchInput);
                        console.log("success, updating, username");
                        console.log(success);
                        success = success.filter((event) => event.user !== username);
                        update(success.slice(0,MAX_NUM_POSTS));
                        setSearchInput("");
                        return;
                    }
                    else {
                        alert("Not a valid search query");
                        return;
                    }
                })
            }
        }
    }

    function clearFilter() {
        setFilter("");
        getMatchingProfiles("joinDate", "-").then(success => {
            if (success) {
                // preventing user from seeing their own profile
                success = success.filter((event) => event.user !== username);
                update(success.slice(0,MAX_NUM_POSTS));
            }
        });
    }

    const FilterButton = () => {
        if (filter !== "") {
            return (<> <p>Current filter: {filter}</p> <button onClick={clearFilter}>Clear filter</button> </>);
        }
        return;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSubmit(event);
        }
    }

    return(
        <>
        <form onKeyDown={handleKeyDown}>
            <input type="search" placeholder="Search here..." onChange={handleChange} value={searchInput} />
        </form>
            <br/>
            <FilterButton/>
        </>
    )
}

function Posts({ userInfo, masterPrefList, masterInterestsList, setVisitingProfile, setVisitingUsername }) {
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
    <div className='posts-body'>
        <div className='posts-title'>View Public Profiles</div>
        <hr className='posts-horizontal-bar'/>
        <div className='posts-search'>
            <Search username={userInfo.username} masterPrefList={masterPrefList} masterInterestsList={masterInterestsList} update={setPosts}/>
        </div>
        {renderPosts(posts, (username) => handleProfileRedirect(username))}

    </div>);
};
 
export default Posts;