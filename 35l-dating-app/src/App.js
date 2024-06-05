import React from "react";
import Navbar from "./components/Navbar/";
import './App.css';
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

import ChatPage from "./pages/ChatPage";

// import PrivateRoute from "./pages/PrivateRoute";


function App() {
    const [isLoggedIn, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        token: "",
        expiration: ""
    });
    const [visitingProfile, setVisitingProfile] = useState(false);
    const [visitingUsername, setVisitingUsername] = useState("");
    const [matches, setMatches] = useState([]);
    const [outMatches, setOutMatches] = useState([]);

    const masterPrefList = {ide: ["Visual Studio", "Xcode", "Pycharm", "Atom", "Rstudio"], 
        os: ["MacOS", "Windows", "Linux", "ChromeOS", "iPadOS"], 
        pl: ["C", "C++", "Python", "Bash", "Lisp", "Javascript", "Java",]};
    const masterInterestsList = ["men", "women", "reinmann","eggert", "cs35L", "cs33"];

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
                    masterInterestsList={masterInterestsList}
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
                    setVisitingUsername={setVisitingUsername}
                    matches={matches} setMatches={setMatches}
                    outMatches={outMatches} setOutMatches={setOutMatches}/>} />
                <Route path="/settings" element={<Settings userInfo={userInfo} 
                    setUserInfo={setUserInfo} 
                    masterPrefList={masterPrefList}
                    masterInterestsList={masterInterestsList}/>} />
                <Route path="/messages" element={<Messages userInfo={userInfo} 
                    setCurrMessage={(username) => setUserInfo({...userInfo, message: username})}/>} />
                {/* hidden page only accessible when registering */}
                <Route path="/registration" element={<Registration userInfo={userInfo} 
                    setLogin={(props) => handleLogin(props)}
                    setUserInfo={setUserInfo} 
                    masterPrefList={masterPrefList}
                    masterInterestsList={masterInterestsList}/>} />

            </Routes>
        </Router>
    );
};
 
export default App;
