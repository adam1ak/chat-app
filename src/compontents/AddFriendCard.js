import React from 'react';

import '../styles/add-friend.css';

function AddFriendCard(props) {
  return (
    <div className="add-friend-card">
        <div className='add-friend-card-image-container'>
            <img src={props.image}
              className='add-friend-card-image'
              alt='user pfp'/>
        </div>

        <div className='add-friend-card-info'>
            <p>{props.firstName} {props.lastName}</p>
            <div className='add-friend-card-btns'>
              <button
                className="accept-btn"
                onClick={props.handleAdd}>{props.btnText}</button>
              <button
                className="decline-btn"
                style={{display: props.display}}
                onClick={props.handleDecline}>Decline</button>
            </div>
        </div>
    </div>
  );
}

export default AddFriendCard;
