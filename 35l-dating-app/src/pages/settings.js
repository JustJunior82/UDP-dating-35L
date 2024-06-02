import React from "react";
import parse from 'html-react-parser';
import Convert from "ansi-to-html";

import "../App.css"; // for the ascii styling

const Profile = () => {
    const no_image = "";
    const [selectedImage, setSelectedImage] = React.useState(no_image);

    async function selectImage(formData) {
        console.log(formData);
        let response = await fetch("http://localhost:12345/api/img2ascii", {
            method: 'POST',
            body: formData,
        });
        if (response.status !== 200) {
            alert("Failed to upload image. Only jpeg and png images with less than 2 MB are currently supported.");
            return no_image;
        }
        let responseData = await response.json();
        if (responseData["error"] !== 0) {
            alert("Failed to convert image to ASCII.");
            return no_image;
        }
        let content = responseData["content"];
        return content;
    }

    let convert = new Convert({newline: true, escapeXML: true});

    return (
        <div>
            <h1>User's Settings</h1>
            <div>
                <h2>
                    ASCII Photo
                </h2>
                <div>
                    <form encType="multipart/form-data" method="POST">
                        <input name="image" type="file" onChange={async (event) => {
                            let data = new FormData();
                            data.append('image', event.target.files[0]);
                            let content = await selectImage(data);
                            let htmlComponent = convert.toHtml(content);
                            setSelectedImage(htmlComponent);
                        }} />
                        <button type="reset" onClick={() => {setSelectedImage(no_image); }}>Remove</button>
                        <button type="submit" onSubmit={() => { console.log(selectedImage); /* TODO: add backend */}}>Confirm</button>
                    </form>
                </div>
                <div className="profile-image">
                    <pre>{parse(selectedImage)}</pre>
                </div>
            </div>
        </div>
    );
};

export default Profile;