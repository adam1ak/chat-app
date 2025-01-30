import React, { useState, useEffect } from 'react';
import { getFirestore, getDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';

import '../styles/all-chats.css'
import serachIcon from '../assets/search_icon.svg';
import AllChatsFriendCard from './AllChatsFriendCard';
import SelectedChat from './SelectedChat';

function AllChats() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)

  const [friendName, setFriendName] = useState('')
  const [generatedUid, setGeneratedUid] = useState('')
  const [friends, setFriends] = useState([])
  const [selectedFriendData, setSelectedFriendData] = useState(null)

  const [lgScreen, setIsLgScreen] = useState(false)

  const [isActiveChat, setIsActiveChat] = useState(false)

  // Firebase authentication observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const fetchFriends = async () => {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFriends(userData.friends || []);
            setUserData(userData)
          }
        };

        fetchFriends();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsLgScreen(true)
        setIsActiveChat(true)
      } else {
        setIsLgScreen(false)
        setIsActiveChat(false)
      }
    };

    window.addEventListener('resize', handleResize);

    // Check the screen size initially
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleActiveChat = () => {
    if (!lgScreen) {
      setIsActiveChat(!isActiveChat)
      console.log(friends)
    }
  }

  const generateChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join(":");
  };

  const handleFriendClick = (e, index) => {
    handleActiveChat()
    setSelectedFriendData(e)
    setFriendName(friends[index].firstName + ' ' + friends[index].lastName)
    setGeneratedUid(generateChatId(user.uid, e.id))
  }


  const handledeleteFriend = async () => {
    const userDocRef = doc(db, "users", userData.uid);
    const friendDocRef = doc(db, "users", selectedFriendData.id);
    
    try {
      await updateDoc(userDocRef, {
        friends: arrayRemove(selectedFriendData),
      });

      await updateDoc(friendDocRef, {
        friends: arrayRemove(userData),
      });

      setFriends(friends.filter((friend) => friend.id !== selectedFriendData.id));

    }catch (error) {
      console.error("Error updating document: ", error);
    }
   }

  return (
    <div className="all-chats">

      <div className='all-chats-left'>
        <h1>Chats</h1>

        <div className='add-friend-container'>
          <img src={serachIcon}
            className='search-icon'
            alt='search icon' />
          <input
            className="add-friend-input"
            placeholder='Search Friend' />
        </div>

        <div className='all-chats-friends'>
          {
            friends.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleFriendClick(item, index)}
                className='all-chats-friends-item'
              >
                <AllChatsFriendCard
                  image={item.pfpSrc}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  message={"xd"}
                />
              </div>

            ))
          }
        </div>
      </div>

      <div className='all-chats-right'>
        <SelectedChat
          handleHide={handleActiveChat}
          handleDeleteFriend={handledeleteFriend}
          friendName={friendName}
          generatedUid={generatedUid}
          user={user}
          isActive={isActiveChat} />
      </div>

    </div>
  );
}

export default AllChats;
