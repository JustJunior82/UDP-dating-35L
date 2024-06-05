import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import createUser from "../components/API/createUser";
import requestLogin from "../components/API/requestLogin";
import postProfile from "../components/API/postProfile";

import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

const baseRegistration = (props) => {
    return(
        <div className='register-body'>
            <div className='register'>
                <>
                    <div className='register-title'>
                        Welcome to UDP Dating App!
                    </div>
                    <div className="register-subtitle">
                        Register below:
                    </div>
                    {/* <button onClick={() => props.navigate("/login")}>Login Page</button>  */}
                    <div className='register-form'>
                        <form onSubmit={props.handleRegistration}>
                            <div className='register-content'>
                                <span className='icon'>
                                    <IoMail />
                                </span>
                                <div className="register-input-box">
                                <label>
                                    <input type="email" onChange={props.handleEmailChange} placeholder='Email'/>
                                </label>
                                </div>
                            </div>
                            <div className='register-content'>
                                    <span className='icon'>
                                        <FaUser /> 
                                    </span> 
                                <div className="register-input-box">
                                <label>
                                    <input type="text" onChange={props.handleUsernameChange} placeholder='Username'/>
                                </label>
                                </div>
                            </div>
                            <div className='register-content'>
                                <span className='icon'>
                                    <FaLock /> 
                                </span>
                                <div className="register-input-box">
                                <label>
                                    <input type="password" onChange={props.handlePasswordChange} placeholder='Password'/>
                                </label>
                                </div>
                            </div>
                            <div className='register-button'>
                                <button type="submit">Register</button>
                            </div>
                        </form>
                    </div>
                    <div className='register-nav'>
                        Already have an account?&nbsp;
                        <div className='register-login-link' onClick={() => props.navigate('/login')}>Login here.</div>
                    </div>
                </>
            </div>
        </div>
        
    );
}

const profileCreation = (props) => {
    return (
        <div className='profile-creation'>
            <>
                <div className='create-profile-title'>
                    Create your Profile
                </div>
                <div className='create-profile-subtitle'>
                    <span className='required-asterisk'>*</span> are required fields
                </div>
                <div className='create-profile-form'>
                <form onSubmit={props.handleProfileCreation}>
                    <div className='double-box'>
                        <div className='profile-input-box'>
                            <h2>Full Name<span className='required-asterisk'>*</span></h2>
                            <label>
                                <input type="text" onChange={props.handleNameChange} />
                            </label>
                        </div>
                        <div className='profile-input-box'>
                            <h2>Birthday<span className='required-asterisk'>*</span></h2>
                            <label>
                                <input type="date" onChange={props.handleBirthdayChange} />
                            </label>
                        </div>
                    </div>
                    <div className='second-double-box'>
                        <div className='profile-input-box'>
                        <h2>Where do you Live?</h2>
                        <label>
                            <input type="text" onChange={props.handleCountryChange} placeholder='Country'/>
                        </label>
                        </div>
                        <div className='profile-input-box'>
                        <label>
                            <input type="text" onChange={props.handleStateChange} placeholder='State'/>
                        </label>
                        </div>
                    </div>
                    <label>
                        <h2>About Me:<span className='required-asterisk'>*</span></h2>
                        <textarea onChange={props.handleBioChange} rows="4" cols="100"></textarea>
                    </label>
                    <br/>
                    <div className='profile-privacy'>
                        <label>
                            Private Profile (selecting this option will restrict certain users from viewing your profile):
                            <input type="checkbox" value={!props.publicProfile} onChange={props.handlePublicProfileChange}/>
                        </label>
                    </div>
                    <div className='next-button'>
                        <button type="submit">Next</button>
                    </div>
                </form>
                </div>
            </>
        </div>
    );
}

const preferenceSelection = (props) => {

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
    const [publicProfile, setPublicProfile] = useState(false);

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
        let data = {"name": name, "country": country, "state": state, "birthday": birthday, "bio": bio, "public": !publicProfile}
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
    const handlePublicProfileChange = () => {
        setPublicProfile(!publicProfile);
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
                publicProfile: publicProfile,
                handlePublicProfileChange: handlePublicProfileChange});
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