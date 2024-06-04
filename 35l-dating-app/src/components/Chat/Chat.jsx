import { React, useState, useEffect } from 'react'
import '../../pages/home.scss'
import Messages from './Messages'
// import Input from './Input'
// import { HiUserRemove } from "react-icons/hi";
// import { RiMoreFill } from "react-icons/ri";
import fetchMessages from "../API/fetchMessages";
import sendMessage from "../API/sendMessage";

const Input = (props) => {
    const [messageField, setMessageField] = useState("");
    // const [sending, setSending] = useState(false);

    const handleSearchChange = (event) => {
        event.preventDefault();
        setMessageField(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("sending message", messageField);
        setMessageField("");
        // setSending(true);
        // sendMessage(props.username, props.token, props.currMessage, messageField).then(success => {
        //     if (success) {
        //         console.log("submitted");
        //         setMessageField("");
        //     }
        // })

    }

    return (
        <form className='input' onSubmit={handleSubmit}>
            <input type='text' placeholder='Send a message...' value={messageField} onChange={handleSearchChange}/>
            <div className='send'>
                <input type = "file" style={{display: "none"}} id='file'/>
                <label htmlFor='file'>
                </label>
                <button>Send</button>
            </div>
        </form>
    );
}


function Chat (props) {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages(props.username, props.token, props.currMessage).then(success => {
            if (success) {
                setMessages(success.content)
                setLoading(false);
            }
        })
    }, [props.username, props.token, props.currMessage]);

    if (loading) {
        return;
    }
    
    else {
        console.log("finished loading");
        return (
            <div className='chat'>
            <div className='chatInfo'>
                <span>{props.currMessage}</span>
                {/* <div className='chatIcons'>
                <HiUserRemove />
                <RiMoreFill />
                </div> */}
            </div>
            <Messages messages={messages} />
            <Input username={props.username} token={props.token} currMessage={props.currMessage}/>
            </div>
        )
    }
}

export default Chat