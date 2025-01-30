import React from 'react';

import '../styles/all-chats-friend-card.css';

function AllChatsFriendCard(props) {
  return (
    <div className="all-chats-friend-card">
      <div className='all-chats-friend-card-container'>
        <img src={props.image}
          className='all-chats-friend-card-image'
          alt='user pfp' />

        <div className='all-chats-friend-card-name'>
          <p>{props.firstName} {props.lastName}</p>
          <p>{props.message}</p>
        </div>
      </div>
      <div className='all-chats-friend-card-bg'/>
    </div>
  );
}

export default AllChatsFriendCard;
