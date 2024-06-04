import React from 'react'
import '../../pages/home.scss'

const Message = () => {
  return (
    <div className='message owner'>
      <div className='messageInfo'>
        {/* can add username here or timestamp */}
        <span>just now</span>
      </div>
      <div className='messageContent'>
        <p>Hey, how are you?</p>
      </div>
    </div>
  )
}

export default Message