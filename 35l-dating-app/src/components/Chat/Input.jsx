import React from 'react'
import '../../pages/home.scss'
import { IoDocumentAttachSharp } from "react-icons/io5";
import { BiSolidImageAdd } from "react-icons/bi";

const Input = () => {
  return (
    <div className='input'>
        <input type='text' placeholder='Send a message...'/>
        <div className='send'>
            <div className='attachIcons'>
                <IoDocumentAttachSharp size={22}/>
            </div>
            <input type = "file" style={{display: "none"}} id='file'/>
            <label htmlFor='file'>
            <div className='attachIcons'>
                <BiSolidImageAdd size={25}/>
            </div>
            </label>
            <button>Send</button>
        </div>
    </div>
  )
}

export default Input