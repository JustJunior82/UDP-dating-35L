import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

async function createUser(email, username, password) {
    let registrationURL = new URL('http://localhost:12345/api/register');
    registrationURL.searchParams.append("username", username);
    registrationURL.searchParams.append("password", password);
    registrationURL.searchParams.append("email", email);
    let response = await fetch(registrationURL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
		// body: JSON.stringify({username: username, password: password, email: email})
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
    // console.log(json);

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

async function postProfile(username, token, props) {
    let errors = false;

    for (const [key, value] of Object.entries(props)) {
        // if (value === '') {
        //     alert("Please fill out all fields");
        //     return false;
        // }
        let profileURL = new URL('http://localhost:12345/api/post_profile');
        profileURL.searchParams.append("username", username);
        profileURL.searchParams.append("access_token", token);
        profileURL.searchParams.append("profile_key", key);
        profileURL.searchParams.append("profile", value);
        console.log(profileURL);
    
        let response = await fetch(profileURL.toString(), {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        });
    
        if (response.status !== 200) {
            alert("Profile upload failed!");
            return;
        }
    
        let json = await response.json();
    
        if (json.error !== 0) {
            errors = true;
        }
    }
    if (errors)
        alert("Error creating profile. Please try again");
    return !errors;
}

const baseRegistration = (props) => {
    return(
        <>
            <h1>Welcome to UDP Dating App</h1>
            <h2>Create your account below:</h2>
            <h3>I already have an account</h3>
            <button onClick={() => props.navigate("/login")}>Login Page</button> 
            <br/>
            <br/>
            <br/>
            <form onSubmit={props.handleRegistration}>
                <label>
                    Email:
                    <input type="email" onChange={props.handleEmailChange} />
                </label>
                <br/>
                <label>
                    Username:
                    <input type="text" onChange={props.handleUsernameChange} />
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" onChange={props.handlePasswordChange} />
                </label>
                <button type="submit">Register</button>
            </form>
        </>
    );
}

const profileCreation = (props) => {
    return (
        <>
            <h1>Create your Profile</h1>
            <br/>
            <form onSubmit={props.handleProfileCreation}>
                <h2>Full Name</h2>
                <label>
                    <input type="text" onChange={props.handleNameChange} />
                </label>
                <h2>Where do you Live? (optional)</h2>
                <label>
                    Country:
                    <input type="text" onChange={props.handleCountryChange} />
                </label>
                <label>
                    State:
                    <input type="text" onChange={props.handleStateChange} />
                </label>
                <h2>What is your Birthday?</h2>
                <label>
                    Birthday:
                    <input type="date" onChange={props.handleBirthdayChange} />
                </label>
                <br/>
                <label>
                    About Me:
                    <br/>
                    <textarea onChange={props.handleBioChange} rows="4" cols="100"></textarea>
                </label>
                <br/>
                <label>
                    Profile Picture (optional):
                    <input type="file" onChange={props.handleImageChange} accept="image/png, image/jpeg"/>
                </label>
                <br/>
                <button type="submit">Next</button>
            </form>
            <br/>
        </>
    );
}

function preferenceSelection(props) {

    const handleInterestsChange = (event) => {
        const { value, checked } = event.target;

        console.log(`${value} is ${checked}`);

        if (checked) {
            props.setInterests([...props.interests, value]);
        }
        else {
            props.setInterests(props.interests.filter((event) => event !== value));
        }
        console.log("new interests:", props.interests);
    }

    const handlePreferencesChange = (event, key) => {
        const { value, checked } = event.target;

        console.log(`${key} for ${value} is ${checked}`);

        if (checked) {
            props.setPreferences([...props.preferences, key + ":" + value]);
        }
        else {
            props.setPreferences(props.preferences.filter((event) => event !== value));
        }
        console.log("new preferences:", props.preferences);
    }

    function prefsList() {
        let list = [];
        for (const [key, value] of Object.entries(props.masterPrefList)) {
            list.push(<div key={key}>
                <h5>{key}</h5>
                {value.map((item, index) => (
                <div key={index}>
                    <input type="checkbox" name={item} value={item} onChange={(event) => handlePreferencesChange(event, key)}/>
                    <label>{item}</label><br/>
                </div>))}
            </div>);
        }
        return(
            <>
            {list}
            </>
        );
    }

    return (
        <>
            <h1>What things are you interested in (We'll use these to help match you with others)</h1>
            <form onSubmit={props.handleSubmitPreferences}>
                <h3>Interests:</h3>
                {props.masterInterestsList.map((item, index) => (
                <div key={index}>
                    <input type="checkbox" name={item} value={item} onChange={handleInterestsChange}/>
                    <label>{item}</label><br/>
                </div>))}
                <h3>Preferences:</h3>
                {prefsList()}
                <button type="submit">Finish Profile Creation</button>
            </form>
        </>
    );
}

function Registration ({ userInfo, setUserInfo, masterPrefList, masterInterestsList, setLogin }) {
    // General States
    const [part, setPart] = useState(0);
    const navigate = useNavigate();

    // Registration States
    const [email, setEmail] = useState('');

    // lifting state functions
    function setUsername(val) {
        setUserInfo({...userInfo, username: val});
    }
    function setPassword(val) {
        setUserInfo({...userInfo, password: val});
    }

    // Profile Creation States
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('');

    // Preference Selection States
    const [preferences, setPreferences] = useState([]);
    const [interests, setInterests] = useState([]);

    function handleRegistration(event) {
        event.preventDefault();
        createUser(email, userInfo.username, userInfo.password).then(success => {
            if (success) {
                setUserInfo({...userInfo, token: "", expiration: "", message: "default"});
                console.log("user creation success", success);
                requestLogin(userInfo.username, userInfo.password).then(success => {
                    console.log("user login success", success);
                    if (success) {
                        console.log(success.content["access-token"]);
                        setLogin({username: userInfo.username, password: userInfo.password, token: success.content["access-token"], expiration: success.content.expired});
                        const date = new Date();
                        let joinDate = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
                        let data = {joinDate: joinDate, country: "", state: "", birthday: "", bio: "", pfp: "", interests: "", ide: "", os: "", pl: "", friends: ""}
                        
                        console.log("username", userInfo.username);
                        console.log("token", userInfo.token);
                        console.log("data", data);
                        postProfile(userInfo.username, success.content["access-token"], data).then(success => {
                            if (success) {
                                console.log("user base profile creation success", success);
                                setPart(1);
                            }
                            
                        });
                    }
                })
            }});
    }

    function handleProfileCreation(event) {
        event.preventDefault();
        console.log("posting profile data");
        let data = {"name": name, "country": country, "state": state, "birthday": birthday, "bio": bio, "pfp": image}
        postProfile(userInfo.username, userInfo.token, data).then(success => {
            if (success)
                setPart(2);
        });
    }

    function handleSubmitPreferences(event) {
        event.preventDefault();
        console.log("submitting preferences:", preferences)
        postProfile(userInfo.username, userInfo.token, { interests: interests, preferences: preferences }).then(success => {
            if (success) {
                navigate("/profile");
            }
            else {
                alert("Error creating profile");
            }
        });
    }

    // Registration State Handlers
    const handleEmailChange = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }
    const handleUsernameChange = (event) => {
        event.preventDefault();
        setUsername(event.target.value);
    }
    const handlePasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    }

    // Profile Creation State Handlers
    const handleNameChange = (event) => {
        event.preventDefault();
        setName(event.target.value);
    }
    const handleCountryChange = (event) => {
        event.preventDefault();
        setCountry(event.target.value);
    }
    const handleStateChange = (event) => {
        event.preventDefault();
        setState(event.target.value);
    }
    const handleBirthdayChange = (event) => {
        event.preventDefault();
        setBirthday(event.target.value);
    }
    const handleBioChange = (event) => {
        event.preventDefault();
        setBio(event.target.value);
    }
    const handleImageChange = (event) => {
        event.preventDefault();
        setImage(event.target.files[0]);
    }

    switch (part) {
        default:
        case 0:
            return baseRegistration(
                {navigate: navigate, 
                handleRegistration: handleRegistration, 
                handleEmailChange: handleEmailChange,
                handleUsernameChange: handleUsernameChange,
                handlePasswordChange: handlePasswordChange});
        case 1:
            return profileCreation(
                {handleNameChange: handleNameChange,
                handleProfileCreation: handleProfileCreation,
                handleCountryChange: handleCountryChange,
                handleStateChange: handleStateChange,
                handleBirthdayChange: handleBirthdayChange,
                handleBioChange: handleBioChange,
                handleImageChange: handleImageChange});
        case 2:
            return preferenceSelection({
                preferences: preferences,
                interests: interests,
                masterPrefList: masterPrefList,
                masterInterestsList: masterInterestsList,
                setInterests: setInterests,
                setPreferences: setPreferences,
                handleSubmitPreferences: handleSubmitPreferences
            });
    }
};
 
export default Registration;