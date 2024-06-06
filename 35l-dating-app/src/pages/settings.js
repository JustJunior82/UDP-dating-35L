import React from "react";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import Convert from "ansi-to-html";
import "../App.css"; // for the ascii styling
import {useState} from "react";
// import {useNavigate} from "react-router-dom";

import '../custom.scss';

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
            <form onSubmit={props.handleSubmitPreferences}>
                <div className='int-subtitle'>Interests:</div>
                {props.masterInterestsList.map((item, index) => (
                <div key={index}>
                    <input type="checkbox" name={item} value={item} onChange={handleInterestsChange}/>
                    <label>{item}</label><br/>
                </div>))}
                <br/>
                <div className='int-subtitle'>Preferences:</div>
                {prefsList()}
                <div className='update-button'>
                    <button type="submit">Update Preferences</button>
                </div>
                <hr className='thick-horizontal-bar' />
            </form>
        </>
    );
}

function Settings({ userInfo, setUserInfo, masterPrefList, masterInterestsList }) {
    const [preferences, setPreferences] = useState([]);
    const [interests, setInterests] = useState([]);
    const noImage = "";
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = React.useState(noImage);

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

    async function selectImage(formData) {
        let response = await fetch("http://localhost:12345/api/img2ascii", {
            method: 'POST',
            body: formData,
        });
        if (response.status !== 200) {
            alert("Failed to upload image. Only jpeg and png images with less than 2 MB are currently supported.");
            return noImage;
        }
        let responseData = await response.json();
        if (responseData["error"] !== 0) {
            alert("Failed to convert image to ASCII.");
            return noImage;
        }
        let content = responseData["content"];
        return content;
    }

    let convert = new Convert({newline: true, escapeXML: true});

    let username = userInfo["username"];
    let accessToken = userInfo["token"];
    React.useEffect(() => {
        let getProfileImageUrl = new URL('http://localhost:12345/api/get_profile_image');
        getProfileImageUrl.searchParams.append("username", username);
        fetch(getProfileImageUrl.toString()).then(
            (response) => {
                if (response.status !== 200) {
                    // alert("Not logged in!");
                    navigate("/login");
                    return {error: 0, image: noImage};
                }
                return response.json(); 
            }
        ).then(
            (responseData) => {
                if (responseData["error"] !== 0) {
                    alert("Failed to fetch profile image.");
                    return noImage;
                }
                return responseData["content"];
            }
        ).then(
            (image) => {
                setSelectedImage(image);
            }
        ).catch(
            error => {}
        )},
        [navigate, username, accessToken]
    );

    return (
        <div className='settings'>
            <div className='settings-title'>
                Settings
            </div>
            <hr className='thick-horizontal-bar' />
            <div classNAme='ascii-conversion'>
                <span className='settings-subtitle'>
                    Set ASCII Photo
                </span>
                <div className='subtitle-description'>
                    Upload a photo to be converted to ASCII art.
                </div>
                <hr className='horizontal-bar' />
                <br/>
                <div>
                    <form encType="multipart/form-data" method="POST" onSubmit={async (event) => {
                            event.preventDefault();
                            let postProfileImageUrl = new URL('http://localhost:12345/api/post_profile_image');
                            postProfileImageUrl.searchParams.append("username", username);
                            postProfileImageUrl.searchParams.append("access_token", accessToken);
                            let response = await fetch(postProfileImageUrl.toString(), {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    image: selectedImage
                                })
                            });
                            if (response.status !== 200) {
                                alert("Failed to upload profile image.");
                                return;
                            }
                            let responseData = await response.json();
                            if (responseData["error"] !== 0) {
                                alert("Failed to upload profile image.");
                                return;
                            }
                            alert("Successfully uploaded profile image.");
                        }}>
                        <input name="image" type="file" onChange={async (event) => {
                            let data = new FormData();
                            data.append('image', event.target.files[0]);
                            let content = await selectImage(data);
                            setSelectedImage(content);
                        }} />
                        <span className='confirm-button'>
                            <button type="submit">Confirm</button>
                            </span>
                        <span className='reset-button'>
                            <button type="reset" onClick={() => {setSelectedImage(noImage); }}>Remove</button>
                        </span>
                        <br/>
                    </form>
                </div>
                <div className="profile-image">
                    <pre>{
                        parse(convert.toHtml(selectedImage))
                    }</pre>
                </div>
            </div>
            <br/>
            <span className='settings-subtitle'>Update Preferences</span>
            <div className='subtitle-description'>
                Select your interests and preferences
            </div>
            <hr className='horizontal-bar' />
            {preferenceUpdate({
                preferences: preferences,
                interests: interests,
                masterPrefList: masterPrefList,
                masterInterestsList: masterInterestsList,
                setInterests: setInterests,
                setPreferences: setPreferences,
                handleSubmitPreferences: handleSubmitPreferences
            })}
        </div>
    )
    


};
 
export default Settings;
