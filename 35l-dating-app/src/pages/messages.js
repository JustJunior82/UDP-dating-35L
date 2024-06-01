// import { React, useState } from "react";


function Messages({ userInfo }) {
    return (
    <>
        <h1>Message your Friends</h1>
        <h3>Currently messaging: {userInfo.message}</h3>
    </>);
};
 
export default Messages;