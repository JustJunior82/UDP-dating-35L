import { React, useState, useEffect } from "react";
import ChatPage from "./ChatPage";
import getMatches from "../components/API/getMatches";


function Messages({ userInfo, setCurrMessage }) {
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (loading) {
            getMatches(userInfo.username, userInfo.token).then(success => {
                if (success) {
                    if (userInfo.message === undefined) {
                        setCurrMessage(success.content.matches.sort().at(0))
                    }
                    setMatches(success.content.matches)
                    setLoading(false);
                }
            });
        }
    },[loading])
    
    if (loading) {
        return;
    }
    else {
        return (
            <>
                <ChatPage matches={matches} 
                    username={userInfo.username}
                    token={userInfo.token}
                    currMessage={userInfo.message} 
                    setCurrentMessage={setCurrMessage}/>
            </>);
    }
};
 
export default Messages;