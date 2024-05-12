import React from "react";
import { useState } from "react";

function Login({ setLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function handleLogin(event) {
        event.preventDefault()
        // Implement API Authentication call
        let auth = null;

        if (auth) {
            setLogin();
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