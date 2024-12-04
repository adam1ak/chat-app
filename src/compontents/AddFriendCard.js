import React from 'react';

import '../styles/add-friend.css';

function AddFriendCard(props) {
  return (
    <div className="add-friend-card">
        <img src={props.image}
            className='add-friend-card-image'
            alt='user pfp'/>
        <div className='add-friend-card-info'>
            <p>{props.firstName} {props.lastName}</p>
            <button
              onClick={props.handleAdd}>Add</button>
        </div>
    </div>
  );
}

export default AddFriendCard;
