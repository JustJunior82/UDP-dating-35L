import React from 'react'
import '../../pages/home.scss'

const Input = () => {
  return (
    <div className='input'>
        <input type='text' placeholder='Send a message...'/>
        <div className='send'>
            <input type = "file" style={{display: "none"}} id='file'/>
            <label htmlFor='file'>
            </label>
            <button>Send</button>
        </div>
    </div>
  )
}

export default Input