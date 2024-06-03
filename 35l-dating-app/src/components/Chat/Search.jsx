import React from 'react'
import '../../pages/home.scss'

const Search = () => {
  return (
    <div className='search'>
      <div className='searchForm'>
        <input type='text' placeholder='Search...'/>
      </div>
      <div className='userChat'>
        <div className='userChatInfo'>
          <span>Chatter</span>
        </div>
      </div>
    </div>
  )

}

export default Search