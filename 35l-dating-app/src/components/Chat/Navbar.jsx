import React from 'react'
import '../../pages/home.scss'

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className='logo'>LOGO</span>
      <div className='user'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJEV_IAQ1fbkJtHo-9BEHJi-jgzxapppeSwA&s" alt="" />
        <span>Surtr</span>
        {/* <button>logout</button> */}
      </div>
    </div>
  )
}

export default Navbar