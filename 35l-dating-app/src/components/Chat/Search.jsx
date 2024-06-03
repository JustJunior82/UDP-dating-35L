import React from 'react'
import '../../pages/home.scss'

const Search = () => {
  return (
    <div className='search'>
      <div className='searchForm'>
        <input type='text' placeholder='Search...'/>
      </div>
      <div className='userChat'>
        <img src='https://64.media.tumblr.com/df20a8df3c9a1057ac9f9f5e87b9050e/9127d32c64eaf2d9-05/s1280x1920/e53ff142d1e31e414e9ce7991211dd0f6068d58a.jpg' alt=''/>
        <div className='userChatInfo'>
          <span>Texas</span>
        </div>
      </div>
    </div>
  )

}

export default Search