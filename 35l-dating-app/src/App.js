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
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Registration from "./pages/registration";
import Messages from "./pages/messages";

// import PrivateRoute from "./pages/PrivateRoute";


function App() {
    const [isLoggedIn, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "testuser",
        password: "1234",
        token: "",
        expiration: "",
        message: "default"
    });
    const [visitingProfile, setVisitingProfile] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");

    function handleLogin(props) {
        setLogin(true);
        setUserInfo(props);
    }


    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn}/>
            <Routes>
                <Route exact path="/" element={<Home isAuth={String(isLoggedIn)} onLogIn={() => setLogin(true)} onLogOut={() => setLogin(false)}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login userInfo={userInfo} setUserInfo={setUserInfo} setLogin={(props) => handleLogin(props)}/>} />
                {/* unaccessable until logged in */}
                <Route path="/profile" element={<Profile userInfo={userInfo} 
                    setMessage={(friendUsername) => setUserInfo({ ...userInfo, message: friendUsername })} 
                    visitingProfile={visitingProfile}
                    setVisitingProfile={setVisitingProfile}
                    friendUsername={friendUsername}
                    setFriendUsername={setFriendUsername}/>} />
                <Route path="/settings" element={<Settings userInfo={userInfo} />} />
                <Route path="/messages" element={<Messages userInfo={userInfo}/>} />
                {/* hidden page only accessible when registering */}
                <Route path="/registration" element={<Registration userInfo={userInfo} setUserInfo={setUserInfo}/>} />

            </Routes>
        </Router>
    );
};
 
export default App;