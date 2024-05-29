import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/profile");
    }

    function handleLogin(event) {
        event.preventDefault()
        // Implement API Authentication call
        let auth = true;
        let userData = { username: "dummy user",  image: "image-url", preferences: ["A", "B", "C"] };
        
        if (auth) {
            setLogin(userData);
            // After Login, redirect to Profile Page
            handleRedirect();
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={handleUsernameChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
};

export default Login;