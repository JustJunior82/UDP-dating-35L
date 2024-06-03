import React from 'react'
import '../../pages/home.scss'

const Message = () => {
  return (
    <div className='message owner'>
      <div className='messageInfo'>
        <img 
          src='https://w0.peakpx.com/wallpaper/880/330/HD-wallpaper-video-game-arknights-surtr-arknights.jpg' 
          alt=''
        />
        <span>just now</span>
      </div>
      <div className='messageContent'>
        <p>Hey, how are you?</p>
        <img 
          src='https://w0.peakpx.com/wallpaper/880/330/HD-wallpaper-video-game-arknights-surtr-arknights.jpg' 
          alt=''
        />
      </div>
    </div>
  )
}

export default Message