import React from "react";
import Navbar from "./components/Navbar/";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Navigate,
    // Outlet 
} from "react-router-dom";
import { useState } from "react";

import Home from "./pages";
import About from "./pages/about";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Posts from "./pages/posts";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Registration from "./pages/registration";
import Messages from "./pages/messages";

import HomeTest from "./pages/HomeTest";

// import PrivateRoute from "./pages/PrivateRoute";


function App() {
    const [isLoggedIn, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        token: "",
        expiration: "",
        message: "default",
    });
    // const [userProfile, setUserProfile] = useState({});
    const [visitingProfile, setVisitingProfile] = useState(false);
    const [visitingUsername, setVisitingUsername] = useState("");

    const masterPrefList = ["ide", "os", "women", "eggert", "cs35L", "cs33L"];

    function handleLogin(props) {
        setLogin(true);
        setUserInfo(props);
        setVisitingProfile(false);
    }


    return (
        <HomeTest />
    );
};
 
export default App;