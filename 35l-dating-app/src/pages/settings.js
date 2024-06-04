import React from "react";
import {useState} from "react";
// import {useNavigate} from "react-router-dom";

import postProfile from "../components/API/postProfile";

function preferenceUpdate(props) {

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
                <button type="submit">Update Preferences</button>
            </form>
        </>
    );
}

function Settings({ userInfo, masterPrefList, masterInterestsList }) {
    const [preferences, setPreferences] = useState([]);
    const [interests, setInterests] = useState([]);

    function handleSubmitPreferences(event) {
        event.preventDefault();
        console.log("submitting preferences:", preferences)
        postProfile(userInfo.username, userInfo.token, { interests: interests, preferences: preferences }).then(success => {
            if (success) {
                alert("Success updating profile");
            }
            else {
                alert("Error creating profile");
            }
        });
    }

    return (
        <>
            <h1>User's Settings</h1>
            <h3>Update Preferences</h3>
            {preferenceUpdate({
                preferences: preferences,
                interests: interests,
                masterPrefList: masterPrefList,
                masterInterestsList: masterInterestsList,
                setInterests: setInterests,
                setPreferences: setPreferences,
                handleSubmitPreferences: handleSubmitPreferences
            })}
        </>
    )
    


};
 
export default Settings;