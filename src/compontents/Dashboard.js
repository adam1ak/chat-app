import React, { useState } from 'react';
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

  const handleValueChange = (newValue) => {
    console.log("New value:", newValue);  // Debugging log
    setCurrentView(newValue);
  };

  const ComponentToRender = componentsMap[currentView];

  return (
    <div className="dashboard">
      <NavBar onValueChange={handleValueChange} />
      {ComponentToRender ? <ComponentToRender /> : <AllChatsComponent/>}
    </div>
  );
}

export default Dashboard;
