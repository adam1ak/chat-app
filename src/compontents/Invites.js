import React, { useState, useEffect } from 'react';
import { arrayUnion, arrayRemove, getFirestore, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';
//import '../styles/add-friend.css';
import AddFriendCard from './AddFriendCard.js';


function Invites() {
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const [userFirstName, setUserFirstName] = useState("")
  const [userLastName, setUserLastName] = useState("")
  const [userId, setUserId] = useState("")
  const [userFullName, setUserFullName] = useState("")
  const [userPfp, setUserPfp] = useState("")

  const [inviteList, setInviteList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const fetchFriends = async () => {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);


          if (docSnap.exists()) {
            const userData = docSnap.data();
            setInviteList(userData.invites || []);
            setUserFirstName(userData.firstName)
            setUserLastName(userData.lastName)
            setUserId(userData.uid)
            setUserFullName(userData.fullName)
            setUserPfp(userData.pfpSrc)
          }
        };

        fetchFriends();
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, db]);

  const handleAddFriend = async (friend) => {
    const friendData = {
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      fullName: friend.fullName,
      pfpSrc: friend.pfpSrc
    };

    const userData = {
      id: userId,
      firstName: userFirstName,
      lastName: userLastName,
      fullName: userFullName,
      pfpSrc: userPfp
    }

    const userDocRef = doc(db, "users", user.uid);
    const friendDocRef = doc(db, "users", friend.id);

    try {
      await updateDoc(userDocRef, {
        friends: arrayUnion(friendData),
        invites: arrayRemove(friendData),
      });

      await updateDoc(friendDocRef, {
        friends: arrayUnion(userData),
      });

      setInviteList(inviteList.filter((user) => user.id !== friend.id));

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDecline = async (friend) => {
    const friendData = {
      id: friend.id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      fullName: friend.fullName,
      pfpSrc: friend.pfpSrc
    };

    const userDocRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userDocRef, {
        invites: arrayRemove(friendData),
      });

      setInviteList(inviteList.filter((user) => user.id !== friend.id));

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="invites">
      <h1>Invites</h1>
      {
        inviteList.length === 0 ? (
          <p>You don't have any invites</p>
        ) : (
          <p>
            You have : {inviteList.length} invite{inviteList.length > 1 ? 's' : ''}
          </p>
        )
      }
      {inviteList.map((user) => (
        <AddFriendCard
          key={user.id}
          image={user.pfpSrc}
          firstName={user.firstName}
          lastName={user.lastName}
          btnText="Accept"
          handleAdd={() => handleAddFriend(user)}
          handleDecline={() => handleDecline(user)} />
      ))}
    </div>
  );
}

export default Invites;
