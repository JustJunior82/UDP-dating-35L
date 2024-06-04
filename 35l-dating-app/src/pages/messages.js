import { React, useState } from "react";
import ChatPage from "./ChatPage";
import getProfile from "../components/API/getProfile";


function Messages({ userInfo, setCurrMessage }) {
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState("");

    getProfile(userInfo.username).then(success => {
        if (success) {
            // update
            setFriends(success.friends)
            // console.log("friends", friends);
            setLoading(false);
        }
    });

    if (loading) {
        return;
    }
    else {
        return (
            <>
                <ChatPage friends={friends} 
                    username={userInfo.username}
                    token={userInfo.token}
                    currMessage={userInfo.message} 
                    setCurrentMessage={setCurrMessage}/>
            </>);
    }
};
 
export default Messages;