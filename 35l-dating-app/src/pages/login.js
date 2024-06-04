import React from "react";
import { useNavigate } from "react-router-dom";

// username: testuser
// password: 1234
// email: test@test.com

// username: testuser2
// password: 1234
// email: testuser2@gmail.com

async function requestLogin(username, password) {
    let loginUrl = new URL('http://localhost:12345/api/login');
    loginUrl.searchParams.append("username", username);
    loginUrl.searchParams.append("password", password);
    let response = await fetch(loginUrl.toString(), {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
    });

    if (response.status !== 200) {
        alert("Login failed!");
        return;
    }

    let json = await response.json();
    console.log(json);

    switch (json.error) {
        case 6:
            alert("Invalid email or password. Please try again");
            return false;
        case 3:
            alert("Database Error, please try again later");
            return false;
        default:
            console.log("Success Logging in ...");
            return json;
    }
}

function Login({ userInfo, setUserInfo, setLogin }) {
    const navigate = useNavigate();
    
    // lifting state functions
    function setUsername(val) {
        setUserInfo({...userInfo, username: val});
    }
    function setPassword(val) {
        setUserInfo({...userInfo, password: val});
    }

    function handleLogin(event) {
        event.preventDefault()
        console.log("attemped login");
        requestLogin(userInfo.username, userInfo.password).then(success => {
            if (success) {
                setLogin({username: userInfo.username, password: userInfo.password, token: success.content["access-token"], expiration: success.content.expired});
                // navigate("/profile");
                navigate("/settings");
            }});
    }

    const handleUsernameChange = (event) => {
        event.preventDefault();
        setUsername(event.target.value);
    }
    
    const handlePasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    }

    return(
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <label>
                            Username:
                            <input type="text" onChange={handleUsernameChange} />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input type="password" onChange={handlePasswordChange} />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <h2>Don't have an account?</h2>
                    <button onClick={() => navigate('/registration')}>Register here</button> 
                </div>
            </div>
        </>
    );
};

export default Login;