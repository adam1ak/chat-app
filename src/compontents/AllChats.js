import React, { useState } from 'react';


import '../styles/all-chats.css'
import serachIcon from '../assets/search_icon.svg';
import AllChatsFriendCard from './AllChatsFriendCard';
import SelectedChat from './SelectedChat';

function AllChats() {

  const [isActiveChat, setIsActiveChat] = useState(false)

  const handleActiveChat = () => {
    setIsActiveChat(!isActiveChat)
  }

  const handleFriendClick = () => {
    console.log("xd");
  }

  return (
    <div className="all-chats">
      <h1>Chats</h1>

      <div className='add-friend-container'>
        <img src={serachIcon}
          className='search-icon'
          alt='search icon' />
        <input
          className="add-friend-input"
          placeholder='Search Friend' />
      </div>

      <div className='all-chats-friends' onClick={handleActiveChat}>
        <AllChatsFriendCard
          image={"https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"}
          firstName={"John"}
          lastName={"Doe"}
          message={"Xdd"}/>
      </div>
      <div className='all-chats-selected-chat'>
        <SelectedChat
          handleHide={handleActiveChat}
          isActive={isActiveChat}/>
      </div>

    </div>
  );
}

export default AllChats;
