import React, { useState, useEffect } from 'react';
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';

import '../styles/dashboard.css';
import NavBar from './Navbar';

import AllChatsComponent from './AllChats';
import AddFriendComponent from './AddFriend';
import InvitesComponent from './Invites';
import SettingsComponent from './Settings';

const componentsMap = {
  'chats': AllChatsComponent,
  'add-friend': AddFriendComponent,
  'invites': InvitesComponent,
  'settings': SettingsComponent,

};

function Dashboard() {
  const [currentView, setCurrentView] = useState('chats');

  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate, db]);

  const handleValueChange = (newValue) => {
    console.log("New value:", newValue);  // Debugging log
    setCurrentView(newValue);
  };

  const ComponentToRender = componentsMap[currentView];

  return (
    <div className="dashboard">
      <NavBar onValueChange={handleValueChange} />
      <div className='dashboard-main'>
        {ComponentToRender ? <ComponentToRender/> : <AllChatsComponent/>}        
      </div>

    </div>
  );
}

export default Dashboard;
