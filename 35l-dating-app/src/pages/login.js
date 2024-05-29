import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisteredPage ({handleSubmit, setUsername, setPassword, toggleRegistered}) {
    return(
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Username:
                            <input type="text" onChange={setUsername} />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input type="password" onChange={setPassword} />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <h2>Don't have an account?</h2>
                    <button onClick={toggleRegistered}>Register here</button> 
                </div>
            </div>
        </>
);}

function UnregisteredPage ({handleSubmit, setEmail, setUsername, setPassword, toggleRegistered}) {
    return(
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Email:
                            <input type="email" onChange={setEmail} />
                        </label>
                        <br/>
                        <label>
                            Username:
                            <input type="text" onChange={setUsername} />
                        </label>
                        <br/>
                        <label>
                            Password:
                            <input type="password" onChange={setPassword} />
                        </label>
                        <br/>
                        <button type="submit">Register</button>
                    </form>
                    <h2>I already have an account</h2>
                    <button onClick={toggleRegistered}>Login Page</button> 
                </div>
            </div>
        </>
);}

async function createUser(email, username, password) {
    let response = await fetch('http://localhost:12345/api/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
		body: JSON.stringify({username: username, password: password, email: email})
    });

    if(await response.status !== 200) {
        alert("Creating a user failed!");
        return;
    }

    let json = await response.json();
    console.log(json);

    switch (json.error) {
        case 1:
            alert("Invalid Email. Please enter valid Email");
            return false;
        case 2:
            alert("Email/Username Already Taken!");
            return false;
        case 3:
            alert("Database Error, please try again later");
            return false;
        default:
            console.log("Success creating user");
            return true;
    }
}

// username: testuser
// password: 1234
// email: test@test.com

async function requestLogin(username, password) {
    let response = await fetch('http://localhost:12345/api/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
		body: JSON.stringify({username: username, password: password, email: ""})
    });

    if(await response.status !== 200) {
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
            return true;
    }
}

function Login(setLogin) {
    const [isRegistered, setRegistered] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/profile");
    }

    function handleLogin(event) {
        event.preventDefault()
        console.log("attemped login");
        requestLogin(username, password).then(success => {
            if (success) {
                handleRedirect();
            }});
    }

    function handleRegistration(event) {
        event.preventDefault();
        createUser(email, username, password).then(success => {
            if (success) {
                handleRedirect();
            }});
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        console.log(email);
    }
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        console.log(username);
    }
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        console.log(password);
    }

    return isRegistered ? <RegisteredPage  handleSubmit={handleLogin} 
                                            setUsername={handleUsernameChange} 
                                            setPassword={handlePasswordChange} 
                                            toggleRegistered={() => setRegistered(false)}/> : 
                          <UnregisteredPage handleSubmit={handleRegistration} 
                                            setEmail={handleEmailChange} 
                                            setUsername={handleUsernameChange} 
                                            setPassword={handlePasswordChange} 
                                            toggleRegistered={() => setRegistered(true)}/>;
};

export default Login;