import React from "react";
import Navbar from "./components/Navbar/index";
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
// import PrivateRoute from "./pages/PrivateRoute";


function App() {
    const [isLoggedIn, setLogin] = useState(false);

    // let PrivateRoute = () => {
    //     // outlet renders child elements if user is logged in, else navigate to login page
    //     return isLoggedIn ? <Outlet /> : <Navigate to={Login} />;
    // }

    // dummy login function
    function handleLogin() {
        setLogin(true);
    }
    
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home isAuth={String(isLoggedIn)} onLogIn={() => handleLogin()}/>} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/contact"
                    element={<Contact />}
                />
                <Route path="/posts" element={<Posts />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path='/' element={<PrivateRoute />}>
                    <Route path='/' element={<Home isAuth={String(isLoggedIn)} onLogIn={() => handleLogin()}/>}/>
                </Route> */}

            </Routes>
        </Router>
    );
}
 
export default App;