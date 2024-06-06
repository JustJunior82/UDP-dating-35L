import React from "react";
import { useNavigate } from "react-router-dom";
import "../custom.scss";

import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

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
                navigate("/profile");
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
        <div className='login-body'>
            <div className='login'>
                <>
                    <div className="popup">
                        <div className="popup-inner">
                            <div className='login-title'>
                                Login
                            </div>
                            <form onSubmit={handleLogin}>
                                <div className='login-content'>
                                    <span className='icon'>
                                        <FaUser /> 
                                    </span> 
                                    <div className="login-input-box">
                                        <label>
                                            <input type="text" onChange={handleUsernameChange} placeholder='Username'/>
                                        </label>
                                    </div> 
                                </div>
                                <div className='login-content'>
                                    <span className='icon'>
                                        <FaLock /> 
                                    </span>
                                    <div className='login-input-box'>
                                        <label>
                                            <input type="password" onChange={handlePasswordChange} placeholder='Password'/>
                                        </label>
                                    </div>
                                </div>
                                <div className='login-button'>
                            <button type="submit">Login</button>
                                </div>
                            </form>
                            {/* <h2>Don't have an account?</h2>
                            <div onClick={() => navigate('/registration')}>Register here</div>  */}
                            <div className='login-nav'>
                                Don't have an account?&nbsp;
                                <div className='login-reg-link' onClick={() => navigate('/registration')}>Register here.</div> 
                            </div>
                        </div>
                    </div>
                </>
            </div> 
        </div>   
    );
};

export default Login;