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

// import PrivateRoute from "./pages/PrivateRoute";


function App() {
    const [isLoggedIn, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: "",
        image: "",
        preferences: []})

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
                <Route path="/posts" element={<Posts />} />
                <Route path="/login" element={<Login setLogin={(props) => handleLogin(props)}/>} />
                {/* unaccessable until logged in */}
                <Route path="/profile" element={<Profile props={userInfo}/>} />
                <Route path="/settings" element={<Settings />} />

            </Routes>
        </Router>
    );
};
 
export default App;