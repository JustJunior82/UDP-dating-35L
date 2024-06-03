import React from 'react'
import '../../pages/home.scss'

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className='logo'>LOGO</span>
      <div className='user'>
        <span>Surtr</span>
        {/* <button>logout</button> */}
      </div>
    </div>
  )
}

export default Navbar