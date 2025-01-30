import React, { useState, useEffect } from 'react';
import { getDocs, arrayUnion , getFirestore, collection, where, query, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';
import '../styles/add-friend.css';
import serachIcon from '../assets/search_icon.svg';
import AddFriendCard from './AddFriendCard.js';


function AddFriend() {
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const [userFirstName, setUserFirstName] = useState("")
  const [userLastName, setUserLastName] = useState("")
  const [userId, setUserId] = useState("")
  const [userFullName, setUserFullName] = useState("")
  const [userPfp, setUserPfp] = useState("")

  const [searchedFriend, setSearchedFriend] = useState([]);
  const [friends, setFriends] = useState([]);

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

  const handleSearchChange = async (e) => {
    setSearchedFriend([]);
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length >= 4) {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("fullName", ">=", searchValue.charAt(0)),
        where("fullName", "<=", searchValue.charAt(0) + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      const filteredResults = documents.filter(doc =>
        doc.fullName.toLowerCase().includes(searchValue) && doc.id !== user.uid
      );

      setSearchedFriend(filteredResults);
    }
  };


  const handleAddFriend = async (friend) => {
    if (friends.find(f => f.id === friend.uid)) {
      alert("You are already friends with this user");
      return;
    }

    const inviteUser = {
      id: userId,
      firstName: userFirstName,
      lastName: userLastName,
      fullName: userFullName,
      pfpSrc: userPfp
    }

    // setShowAddFriend(false);
    const invteDocRef = doc(db, "users", friend.uid);

    try {
      await updateDoc(invteDocRef, {
        invites: arrayUnion(inviteUser), // Use arrayUnion to safely add without duplication
      });

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  

  return (
    <div className="add-friend">
      <h1>Add friend</h1>
      <div className='add-friend-search-section'>
        <div className='add-friend-container'>
          <img src={serachIcon}
            className='search-icon'
            alt='search icon' />
          <input
            className="add-friend-input"
            placeholder='Search Friend'
            onChange={handleSearchChange}
            onClick={() => setSearchedFriend([])} />
        </div>
        <div className="similar-users-list">
          {searchedFriend.map((user) => (
            <AddFriendCard
              key={user.uid}
              image={user.pfpSrc}
              firstName={user.firstName}
              lastName={user.lastName}
              btnText="Add"
              display="none"
              handleAdd={() => handleAddFriend(user)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddFriend;
