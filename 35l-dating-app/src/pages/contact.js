import React from "react";

import "../custom.scss";

import { FaGithub } from "react-icons/fa";
 
const Contact = () => {
    return (
        <div class='contact-body'>
            <div class='users top'>
                <div class='user'>
                    <img 
                        src='https://media.istockphoto.com/id/870832662/vector/mans-silhouette-glyph-icon.jpg?s=612x612&w=0&k=20&c=EF2vbKRj5msrDKGuZJrEZpEwaYjf3cQallPKfZ4_iBk=' 
                        alt='' 
                    />
                    <div class='content'>
                        <div>
                            Eric Wang 
                        </div>
                        <div>
                            <FaGithub /> <a href="https://github.com/nouturnsign" target="_blank" rel="noopener noreferrer">
                             nouturnsign
                            </a>
                        </div>
                    </div>
                </div>
                <div class='user'>
                    <img 
                        src='https://media.istockphoto.com/id/870832662/vector/mans-silhouette-glyph-icon.jpg?s=612x612&w=0&k=20&c=EF2vbKRj5msrDKGuZJrEZpEwaYjf3cQallPKfZ4_iBk=' 
                        alt='' 
                    />
                    <div class='content'>
                        <div> 
                            Andrew Wu
                        </div>
                        <div>
                            <FaGithub /> <a href="https://github.com/yuchaeqi" target="_blank" rel="noopener noreferrer">
                                yuchaeqi
                            </a>
                        </div>
                    </div>
                </div>
                <div class='user'>
                    <img 
                        src='https://media.istockphoto.com/id/870832662/vector/mans-silhouette-glyph-icon.jpg?s=612x612&w=0&k=20&c=EF2vbKRj5msrDKGuZJrEZpEwaYjf3cQallPKfZ4_iBk=' 
                        alt='' 
                    />
                    <div class='content'>
                        <div>
                            Zack Sima
                        </div>
                        <div>
                            <FaGithub /> <a href="https://github.com/leisongao2005" target="_blank" rel="noopener noreferrer">
                                zack-sima
                            </a>
                        </div>
                    </div>
                </div>
                <div class='user'>
                    <img 
                        src='https://media.istockphoto.com/id/870832662/vector/mans-silhouette-glyph-icon.jpg?s=612x612&w=0&k=20&c=EF2vbKRj5msrDKGuZJrEZpEwaYjf3cQallPKfZ4_iBk=' 
                        alt='' 
                    />
                    <div class='content'>
                        <div>
                            Leison Gao
                        </div>
                        <div>
                            <FaGithub /> <a href="https://github.com/leisongao2005" target="_blank" rel="noopener noreferrer">
                                leisongao2005
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class='bottom'>
                <p>Find our source code at <a href="https://github.com/JustJunior82/UDP-dating-35L" target="_blank" rel="noopener noreferrer">this Github link</a>. If the link does not render, https://github.com/JustJunior82/UDP-dating-35L is the link.</p>
            </div>
        </div>
    );
};
 
export default Contact;