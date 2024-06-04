import React from 'react'
import './home.scss'
import Sidebar from '../components/Chat/Sidebar'
import Chat from '../components/Chat/Chat'

const ChatPage = (props) => {
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar matches={props.matches} currMessage={props.currMessage} setCurrentMessage={props.setCurrentMessage}/>
        <Chat username={props.username} token={props.token} currMessage={props.currMessage}/>
      </div>
    </div>
  )
}

export default ChatPage