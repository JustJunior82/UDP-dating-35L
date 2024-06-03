import React from "react";
import { useNavigate } from "react-router-dom";
import parse from 'html-react-parser';
import Convert from "ansi-to-html";

import "../App.css"; // for the ascii styling

const Profile = (userInfo) => {
    const noImage = "";
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = React.useState(noImage);
    const [profileKey, setProfileKey] = React.useState("");
    const [profileValue, setProfileValue] = React.useState("");
    const [addPreferenceValue, setAddPreferenceValue] = React.useState("");
    const [removePreferenceValue, setRemovePreferenceValue] = React.useState("");

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

    let username = userInfo["userInfo"]["username"];
    let accessToken = userInfo["userInfo"]["token"];
    React.useEffect(() => {
        let getProfileImageUrl = new URL('http://localhost:12345/api/get_profile_image');
        getProfileImageUrl.searchParams.append("username", username);
        getProfileImageUrl.searchParams.append("access_token", accessToken);
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
        [navigate]
    );

    return (
        <div>
            <h1>User's Settings</h1>
            <div>
                <h2>
                    ASCII Photo
                </h2>
                <div>
                    <form encType="multipart/form-data" method="POST" onSubmit={async (event) => {
                            event.preventDefault();
                            let postProfileImageUrl = new URL('http://localhost:12345/api/post_profile_image');
                            postProfileImageUrl.searchParams.append("username", userInfo["userInfo"]["username"]);
                            postProfileImageUrl.searchParams.append("access_token", userInfo["userInfo"]["token"]);
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
                        <button type="reset" onClick={() => {setSelectedImage(noImage); }}>Remove</button>
                        <button type="submit">Confirm</button>
                    </form>
                </div>
                <div className="profile-image">
                    <pre>{
                        parse(convert.toHtml(selectedImage))
                    }</pre>
                </div>
            </div>
            <div>
                <h2>Edit profile</h2>
                <p>Remember that only <code>os</code>, <code>ide</code>, and <code>pl</code> are taken into account for matching. Additional preferences may be added below for the purposes of searching.</p>
                <form onSubmit={async (event) => {
                    event.preventDefault();
                    if (profileKey === "" || profileValue === "") {
                        alert("Must input nonempty profile key and profile value.");
                        return;
                    }
                    if (profileKey === "preferences") {
                        if (!window.confirm("Warning: you probably meant to update preferences below. Are you sure want to directly edit the preferences list?"))
                            return;
                    }
                    let postProfileUrl = new URL('http://localhost:12345/api/post_profile');
                    postProfileUrl.searchParams.append("username", userInfo["userInfo"]["username"]);
                    postProfileUrl.searchParams.append("access_token", userInfo["userInfo"]["token"]);
                    postProfileUrl.searchParams.append("profile_key", profileKey);
                    postProfileUrl.searchParams.append("profile", profileValue);
                    let response = await fetch(postProfileUrl.toString(), {
                        method: 'POST',
                    });
                    if (response.status !== 200) {
                        alert("Failed to update profile.");
                        return;
                    }
                    let responseData = await response.json();
                    if (responseData["error"] !== 0) {
                        alert("Failed to update profile.");
                        return;
                    }
                    alert("Successfully updated profile.");
                }}>
                    <input type="text" placeholder="key" value={profileKey} onChange={(event) => {setProfileKey(event.target.value)}} />
                    <input type="text" placeholder="value" value={profileValue} onChange={(event) => {setProfileValue(event.target.value)}} />
                    <button type="submit" >Update</button>
                </form>
            </div>
            <div>
                <h2>Add preferences</h2>
                <p>Preferences may be added for the purposes of searching.</p>
                <form onSubmit={async (event) => {
                    event.preventDefault();

                    let profileUrl = new URL('http://localhost:12345/api/get_profile');
                    profileUrl.searchParams.append("username", username);
                    let currentPreferencesResponse = await fetch(profileUrl.toString(), {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json'
                        },
                    });
                
                    if (currentPreferencesResponse.status !== 200) {
                        alert("Fetching Profile failed!");
                        return;
                    }
                
                    let json = await currentPreferencesResponse.json();
                    if (json.error !== 0) {
                        alert("Fetching Profile failed!");
                        return;
                    }

                    let currentPreferences = json.profile["preferences"];
                    if (currentPreferences.includes(addPreferenceValue)) {
                        alert("Preference is already included.");
                        return;
                    }
                    if (currentPreferences === "")
                        currentPreferences = addPreferenceValue;
                    else
                        currentPreferences += "," + addPreferenceValue;
                    
                    let postProfileUrl = new URL('http://localhost:12345/api/post_profile');
                    postProfileUrl.searchParams.append("username", userInfo["userInfo"]["username"]);
                    postProfileUrl.searchParams.append("access_token", userInfo["userInfo"]["token"]);
                    postProfileUrl.searchParams.append("profile_key", "preferences");
                    postProfileUrl.searchParams.append("profile", currentPreferences);
                    let response = await fetch(postProfileUrl.toString(), {
                        method: 'POST',
                    });
                    if (response.status !== 200) {
                        alert("Failed to update preference.");
                        return;
                    }
                    let responseData = await response.json();
                    if (responseData["error"] !== 0) {
                        alert("Failed to update preference.");
                        return;
                    }
                    alert("Successfully updated preference.");
                }}>
                    <input type="text" placeholder="value" value={addPreferenceValue} onChange={(event) => {setAddPreferenceValue(event.target.value)}} />
                    <button type="submit" >Add</button>
                </form>
            </div>
            <div>
            <h2>Remove preferences</h2>
                <form onSubmit={async (event) => {
                    event.preventDefault();

                    let profileUrl = new URL('http://localhost:12345/api/get_profile');
                    profileUrl.searchParams.append("username", username);
                    let currentPreferencesResponse = await fetch(profileUrl.toString(), {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json'
                        },
                    });
                
                    if (currentPreferencesResponse.status !== 200) {
                        alert("Fetching Profile failed!");
                        return;
                    }
                
                    let json = await currentPreferencesResponse.json();
                    if (json.error !== 0) {
                        alert("Fetching Profile failed!");
                        return;
                    }

                    let currentPreferences = json.profile["preferences"];
                    if (!currentPreferences.includes(removePreferenceValue)) {
                        alert("Preference is not included.");
                        return;
                    }
                    currentPreferences = currentPreferences.replace(removePreferenceValue, "");
                    
                    let postProfileUrl = new URL('http://localhost:12345/api/post_profile');
                    postProfileUrl.searchParams.append("username", userInfo["userInfo"]["username"]);
                    postProfileUrl.searchParams.append("access_token", userInfo["userInfo"]["token"]);
                    postProfileUrl.searchParams.append("profile_key", "preferences");
                    postProfileUrl.searchParams.append("profile", currentPreferences);
                    let response = await fetch(postProfileUrl.toString(), {
                        method: 'POST',
                    });
                    if (response.status !== 200) {
                        alert("Failed to update preference.");
                        return;
                    }
                    let responseData = await response.json();
                    if (responseData["error"] !== 0) {
                        alert("Failed to update preference.");
                        return;
                    }
                    alert("Successfully updated preference.");
                }}>
                    <input type="text" placeholder="value" value={removePreferenceValue} onChange={(event) => {setRemovePreferenceValue(event.target.value)}} />
                    <button type="submit" >Remove</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;