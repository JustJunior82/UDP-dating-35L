import React from 'react'
// import Message from './Message'


const Message = ({ message }) => {
    let date = new Date(message.timestamp * 1000);
    let timeString = date.toLocaleTimeString();
                        
    return (
        <div className='message owner'>
        <div className='messageInfo'>
            {/* can add username here or timestamp */}
            <span>{message.sender}</span>
            <span>{timeString}</span>
        </div>
        <div className='messageContent'>
            <p>{message.message}</p>
        </div>
        </div>
    )
}


const Messages = ({ messages }) => {
    let list = [];
    if (messages.length === 0) {
        list.push(<p>No one has sent a message yet. Send a message to start the conversation!</p>)
    }
    else {
        let item;
        for (item of messages) {
            list.push(<Message key={item.message.slice(0,5)} message={{sender: item.sender, message: item.message, timestamp: item.timestamp}}/>);
        }
    }
    // messages is array of messages 
    return (
        <div className='messages'>
            {list}
        </div>
    );
}

export default Messages