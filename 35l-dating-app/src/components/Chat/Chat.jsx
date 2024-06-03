import React from 'react'
import '../../pages/home.scss'
import Messages from './Messages'
import Input from './Input'
import { HiUserRemove } from "react-icons/hi";
import { RiMoreFill } from "react-icons/ri";

const Chat = () => {
  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>Texas</span>
        <div className='chatIcons'>
          <HiUserRemove />
          <RiMoreFill />
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat