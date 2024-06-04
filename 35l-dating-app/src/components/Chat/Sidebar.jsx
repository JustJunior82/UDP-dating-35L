import { React, useState } from "react";
import '../../pages/home.scss'
// import Navbar from './Navbar'
// import Search from './Search'
// import Chats from './Chats'


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


const Search = (props) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          props.handleSubmit(event);
        }
    }
    return (
        <div className='search'>
        <div className='searchForm'>
            <form onKeyDown={handleKeyDown}>
                <input type='text' value={props.searchQuery} placeholder='Search...' onChange={props.onChange}/>
                {/* <input type="submit"/> */}
            </form>
        </div>
        {/* <div className='userChat'>
            <div className='userChatInfo'>
            <span>Chatter</span>
            </div>
        </div> */}
        </div>
    )
}

const Chats = (props) => {
    // console.log(props.currMessage);
    if (props.currMessage === "default") {
        // load messages of first friend
        // console.log(props.friends.split(",").sort().at(0));
        props.setCurrentMessage(props.matches.sort().at(0));
    }
    // console.log("friends", props.friends);
    let list = [];
    let match;
    for (match of props.matches.sort()) {
        // change styling to bold current person you are messaging
        /*
        ********************
        how to create on_click references that change for every rendering
        ********************
        */
        if (match === props.currMessage) {
            list.unshift(<div className='userChat' key={match}>
                <div className='userChatInfo'>
                    <span><b>{match}</b></span> 
                </div>
            </div>);
        }
        else {
            list.push(<div className='userChat' key={match}>
                <div className='userChatInfo'>
                    <span>{match}</span>
                </div>
            </div>);
        }
    }

    return (
        <div className='chats'>
            {list}
        </div>);
}

const Sidebar = (props) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        event.preventDefault();
        setSearchQuery(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("query", searchQuery);
        if (props.matches.includes(searchQuery)) {
            console.log("submitting");
            props.setCurrentMessage(searchQuery);
            setSearchQuery("");
        }
        else {
            alert("Cannot find user");
        }
    }

    return (
        <div className='sidebar'>
            <Navbar/>
            <Search searchQuery={searchQuery} handleSubmit={handleSubmit} onChange={handleSearchChange} friends={props.friends}/>
            <Chats matches={props.matches} currMessage={props.currMessage} setCurrentMessage={props.setCurrentMessage}/>
        </div>

  )
}

export default Sidebar