import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';

import logo from '../assets/logo.svg';
import chat_icon from '../assets/chat.svg';
import add_friend_icon from '../assets/addFriend.svg';
import invites_icon from '../assets/invites.svg';
import logout_icon from '../assets/logout.svg';
import settings_icon from '../assets/settings.svg';

import '../styles/navbar.css';

function NavBar({ onValueChange }) {
    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/");
            }
        });
    }, [auth, navigate]);

    const handleSignOut = () => {
        auth.signOut();
    };

    return (
        <nav>
            <div className="nav-wrapper">
                <img src={logo} alt="logo" className="logo" />

                <div
                    className="nav-item active"
                    onClick={() => onValueChange('chats')}
                >
                    <img src={chat_icon} className="nav-icon" alt="chat icon" />
                    <p>All chats</p>
                </div>

                <div
                    className="nav-item"
                    onClick={() => onValueChange('add-friend')}
                >
                    <img src={add_friend_icon} className="nav-icon" alt="add friend icon" />
                    <p>Add friend</p>
                </div>

                <div
                    className="nav-item"
                    onClick={() => onValueChange('invites')}
                >
                    <img src={invites_icon} className="nav-icon" alt="invites icon" />
                    <p>Invites</p>
                </div>
                
                <div className="line"></div>

                <div
                    className="nav-item"
                    onClick={() => onValueChange('settings')}
                >
                    <img src={settings_icon} className="nav-icon" alt="settings icon" />
                    <p>Settings</p>
                </div>
            </div>

            <div className="nav-wrapper">
                <div className="nav-item" onClick={handleSignOut}>
                    <img src={logout_icon} className="nav-icon" alt="log out icon" />
                    <p>Log out</p>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
