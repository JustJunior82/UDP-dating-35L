import React from 'react'
import './home.scss'
import Sidebar from '../components/Chat/Sidebar'
import Chat from '../components/Chat/Chat'

const HomeTest = () => {
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default HomeTest