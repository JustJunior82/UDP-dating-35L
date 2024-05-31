import { React, useState } from "react";

import eggert from "../user_info/eggert.jpeg";
import reinman from "../user_info/reinman.jpeg";
import block from "../user_info/block.jpeg";
import smallberg from "../user_info/smallberg.jpeg";



function renderPosts(info) {
    return (
    <>
        {info.map((user) => {return (
            <div key={user.username}>
                <h3>{user.username}</h3>
                <img src={user.image} alt=""></img>
                <ul>
                    {user.preferences.map((item, index) => (
                    <li key={index}>{item}</li>))}
                </ul>
            </div>);
        })}
    </>);
}

function Search(update) { // handles input filtering and relays information to backend
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const handleSubmit = () => {
        if (searchInput.length > 0) {
            // let posts = sendInputToAPI(searchInput);
            // update(posts)

            // store preference values in database
            
            update([
                {
                    image: eggert, // should be retrieve direclty from database
                    username: "imeggert",
                    name: "Paul Eggert",
                    preferences: ["A", "B"]
                },
                {
                    image: reinman,
                    username: "imreinman",
                    name: "Glenn Reinman",
                    preferences: ["C"]
                },
                {
                    image: block,
                    username: "imblock",
                    name: "Gene Block",
                    preferences: ["D", "E"]
                },
                {
                    image: smallberg,
                    username: "imsmallberg",
                    name: "David Smallber",
                    preferences: ["X", "Y"]
                },
            ])
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
        </>
    )
}

function Posts() {
    // const [preferences, setPreferences] = useState([]);
    const [posts, setPosts] = useState([ //dummy function
        // can get backend to display profiles in order of popularity? 
        // send info of click to backend and keep track of number of page visits?
        {
            image: eggert, // should be retrieve direclty from database
            username: "imeggert",
            name: "Paul Eggert",
            preferences: ["A", "B"]
        },
        {
            image: reinman,
            username: "imreinman",
            name: "Glenn Reinman",
            preferences: ["C"]
        },
        {
            image: block,
            username: "imblock",
            name: "Gene Block",
            preferences: ["D", "E"]
        },
    ]);
    return (
    <>
        <h1>View public posts</h1>
        <p>
            Currently figuring out frontend, backend integration. searching shoudl send a query to backend api to get posts, but not working yet<br/>
            Instead on form submit just adds another post
        </p>
        {Search(setPosts)}
        {renderPosts(posts)}
    </>);
};
 
export default Posts;