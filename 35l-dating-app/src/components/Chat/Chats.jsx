import React from 'react'

const Chats = () => {
  return (
    <div className='chats'>
      <div className='userChat'>
        <img 
          src='https://avatarfiles.alphacoders.com/833/83315.png' 
          alt=''
        />
        <div className='userChatInfo'>
          <span>Spongebob</span>
          <p>Hey, how are you?</p>
        </div>
      </div>

      <div className='userChat'>
        <img
          src='https://wallpapers.com/images/hd/confused-patrick-random-pfp-x63wp9vs43cem64s.jpg' 
          alt=''
        />
        <div className='userChatInfo'>
          <span>Patrick</span>
          <p>Hey, how are you?</p>
        </div>
      </div>

      <div className='userChat'>
        <img 
          src='https://images2.alphacoders.com/119/1197933.jpg' 
          alt=''
        />
        <div className='userChatInfo'>
          <span>Skadi</span>
          <p>Hey, how are you?</p>
        </div>
      </div>

      <div className='userChat'>
        <img 
          src='https://i.pinimg.com/736x/a6/67/73/a667732975f0f1da1a0fd4625e30d776.jpg'
          alt=''
        />
        <div className='userChatInfo'>
          <span>Guy3</span>
          <p>Hey, how are you?</p>
        </div>
      </div>

    </div>
  )
}

export default Chats