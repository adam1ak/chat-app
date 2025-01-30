import React, { useEffect, useRef, useState } from 'react';
import app from '../firebase-config.js';

import { getFirestore, getDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import pfp from '../assets/personPfp.svg'
import '../styles/selected-chat.css'


function SelectedChat({ handleHide, handleDeleteFriend, isActive, friendName, generatedUid, user}) {

  const auth = getAuth(app);
  const db = getFirestore(app);


  const textareaRef = useRef(null);
  const [typedText, setTypedText] = useState("")

  const [messages, setMessages] = useState([])

  useEffect(() => {
    const focusTextArea = () => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }

    focusTextArea()

    const intervalId = setInterval(focusTextArea, 100);

    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    if (!generatedUid) return;

    const docRef = doc(db, "chats", generatedUid);

    // Listen for real-time updates using onSnapshot
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        setMessages(chatData.messages || []);
        console.log('messages updated')
      }
    });

    // Clean up the listener when the component is unmounted or generatedUid changes
    return () => {
      unsubscribe();
    };
  }, [generatedUid, db]);

  // useEffect(() => {
  //   if(!generatedUid) return

  //   const fetchMessages = async () => {
  //     const docRef = doc(db, "chats", generatedUid);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const chatData = docSnap.data();
  //       setMessages(chatData.messages || []);
  //     }
  //   };

  //   fetchMessages()
  //   console.log('fetching messages')

  // }, [generatedUid, db]);
  

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; 
    textarea.style.height = Math.min(textarea.scrollHeight, 40) + "px"; 

  };

  const handleSendMessage = () => {
    if(typedText === "") return

    const newMessage = {
      id : messages.length + 1,
      senderUid : user.uid,
      text : typedText
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setTypedText("")

    const docRef = doc(db, "chats", generatedUid);
    const payload = {messages : updatedMessages}
    setDoc(docRef, payload);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div 
      className="selected-chat" 
      style = {{
        display: isActive && friendName ? "flex" : "none"
      }}>
      <div className='selected-chat-header'>
        <div className='chat-info'>
          <img
            src={pfp}
            alt="pfp" />
          <p>{friendName}</p>
        </div>
        
        <div className='chat-actions'>
          <i
            className="bi bi-person-x-fill"
            onClick={handleDeleteFriend}/>
          <i
            className="bi bi-x"
            onClick={handleHide}/>
        </div>

      </div>

      <div className='divider' />
      <div className='selected-chat-main'>
        <div className='selected-chat-messages'>

          {messages.map((message, index) => {

            const isSenderChange = (currentIndex) => {
              if (!(currentIndex > 0 && currentIndex < messages.length - 1)) return false
              if (messages[currentIndex].senderUid === messages[currentIndex + 1].senderUid) return true
              return false
            }

            const messageType = message.senderUid === user.uid ? 'send' : 'recived';
            const pfpClass = message.senderUid === user.uid ? 'pfp-send' : 'pfp-recived';
            const addMarginClass = isSenderChange(index) ? 'message-spacing' : ''

            return (
              <div
                key={index}
                className={`message ${messageType} ${addMarginClass} `}
              >
                <p>{message.text}</p>
                <img
                  src={pfp}
                  alt="pfp"
                  className={`message-pfp ${pfpClass}`} />
              </div>
            )

          })}

        </div>
        <div className='selected-chat-send'>
          <div className='selected-chat-send-textarea'>
            <textarea
              ref={textareaRef}
              rows={1}
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder='Aa'
            />
          </div>
          <div className='selected-chat-send-btn' onClick={() => handleSendMessage()}>
            <i className="bi bi-send" ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedChat;
