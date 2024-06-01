import React from "react";

import "../custom.scss";
 
const About = () => {
    return (
        <div class="content-wrap">
            <div class="container-md">
                <div class="row my-3">
                    <h1>
                        CS35L Final Project: UDP Dating Protocol
                    </h1>
                    <h3>
                        Created by: Eric Wang, Andrew Wu, Minh Nguyen, Zack Sima, and Leison Gao
                    </h3>
                </div>
                <div class="row my-3">
                    <div class="col">
                        <h4>Description:</h4>
                        <p>
                        As we all know, Professor Eggert has not used a GUI since the 1980s, but it's not like computer science professors are not interested in dating. We are proposing UDP (a recursive acronym that stands for UDP dating protocol), a dating application for computer science professors.
                    Users must create an account and log in. Profiles are rendered using markdown (effectively, a README.md) and the editor is navigable using a subset of emacs keystrokes. Once authenticated, users can update their profile and fetch potential matches.
                    Profiles contain “pictures,” but rather than standard image data, pictures are stored as ASCII art. Profiles also contain preferences that are used in determining matches. Users can upload standard image data (e.g. png) and convert the picture into ASCII using an in-app converter.
                    Once a user creates a profile, all it takes is a click to start matching. You can either look through users who have added you as a potential match or find people by preference. Users can create more complex queries out of simple queries. Like Tinder, you can swipe left or right. Users swipe left by pressing C-b and swipe right by pressing C-f. Profiles that the user swipes right on will be added to your potential matches.
                    Once both users add each other as potential matches, they can message each other. Messages, of course, are all in ASCII encoding.
                        In case the emacs keybindings are unsatisfactory, users may also opt to use vim mode instead, activating a different set of keybindings.
                        In case the overall application is unsatisfactory, users may delete their profile.
                        </p>
                    </div>
                    <div class="col">
                        <h4>Tech Stack:</h4>
                        <ul>
                            <li>Frontend: React.js</li>
                            <li>Backend: Python FastAPI</li>
                            <li>Git/Github - Version Control</li>
                            <li>Database: MongoDB</li>
                        </ul>
                        <h4>Features:</h4>
                        <ul>
                            <li>Displaying Dynamic Data: shows suggested matches by displaying other users profiles</li>
                            <li>Uploading Data: users can upload their own profiles to the server</li>
                            <li>Searching through Data:
                                <ul>
                                    <li>Users can search directly to look at other users' profile and READMEs (bio's)</li>
                                    <li>Users can also search by preferences to find a list of potential matches</li>
                                </ul>
                            </li>
                            <li>Authentication: users register by providing the necessary credentials and can later log in by verifying their identity</li>
                            <li>Additional Features:
                                <ul>
                                    <li>“Instant” messaging, users can message potential matches to connect</li>
                                    <li>Users can follow other users profiles (potential matches)</li>
                                    <li>ASCII profile picture converter: Users can convert profile picture to ASCII art</li>
                                    <li>Vim mode: allows different set of keybinds to navigate through application</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default About;