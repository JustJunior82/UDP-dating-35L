import React from 'react'

import fetchMessages from "../API/fetchMessages";

function Chats (friends) {
    console.log("friends", friends);
    return (
        <div className='chats'>
            {friends.split(",").map((item, index) => (
                <div className='userChat' key={index}>
                    <div className='userChatInfo' key={index}>
                    <span>{item}</span>
                    <p>Last message</p>
                    </div>
            </div>))}
        </div>
    
    // <div className='chats'>
    //   <div className='userChat'>
    //     <div className='userChatInfo'>
    //       <span>Spongebob</span>
    //       <p>Hey, how are you?</p>
    //     </div>
    //   </div>

    //   <div className='userChat'>
    //     <div className='userChatInfo'>
    //       <span>Patrick</span>
    //       <p>Hey, how are you?</p>
    //     </div>
    //   </div>

    //   <div className='userChat'>
    //     <div className='userChatInfo'>
    //       <span>Skadi</span>
    //       <p>Hey, how are you?</p>
    //     </div>
    //   </div>

    //   <div className='userChat'>
    //     <div className='userChatInfo'>
    //       <span>Guy3</span>
    //       <p>Hey, how are you?</p>
    //     </div>
    //   </div>
  )
}

export default Chats