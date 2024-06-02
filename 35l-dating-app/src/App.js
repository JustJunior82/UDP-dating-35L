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
import Posts from "./pages/posts";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Registration from "./pages/registration";
import Messages from "./pages/messages";

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
        <Router>
            <Navbar isLoggedIn={isLoggedIn}/>
            <Routes>
                <Route exact path="/" element={<Home isAuth={String(isLoggedIn)} onLogIn={() => setLogin(true)} onLogOut={() => setLogin(false)}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/posts" element={<Posts userInfo={userInfo}
                    masterPrefList={masterPrefList}
                    setVisitingProfile={setVisitingProfile}
                    setVisitingUsername={setVisitingUsername}/>} />
                <Route path="/login" element={<Login userInfo={userInfo} setUserInfo={setUserInfo} setLogin={(props) => handleLogin(props)}/>} />
                {/* unaccessable until logged in */}
                <Route path="/profile" element={<Profile userInfo={userInfo} 
                    isLoggedIn={isLoggedIn}
                    setMessage={(friendUsername) => setUserInfo({ ...userInfo, message: friendUsername })} 
                    visitingProfile={visitingProfile}
                    setVisitingProfile={setVisitingProfile}
                    visitingUsername={visitingUsername}
                    setVisitingUsername={setVisitingUsername}/>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/messages" element={<Messages userInfo={userInfo}/>} />
                {/* hidden page only accessible when registering */}
                <Route path="/registration" element={<Registration userInfo={userInfo} setUserInfo={setUserInfo} masterPrefList={masterPrefList}/>} />

            </Routes>
        </Router>
    );
};
 
export default App;