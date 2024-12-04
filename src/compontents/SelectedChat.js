import React, { useEffect, useRef, useState } from 'react';

import pfp from '../assets/personPfp.svg'
import '../styles/selected-chat.css'


function SelectedChat({handleHide, isActive}) {

    const textareaRef = useRef(null);
    const [typedText, setTypedText] = useState("")

    useEffect(() => {
      const focusTextArea = () => {
        if(textareaRef.current){
          textareaRef.current.focus()
        }
      }

      focusTextArea()

      const intervalId = setInterval(focusTextArea, 100);

      return () => clearInterval(intervalId);
    }, [])

    const handleInput = () => {
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = Math.min(textarea.scrollHeight, 40) + "px"; // Max height for 5 rows (~120px)
    };

    const handleKeyDown = (e) => {
      if(e.key === "Enter"){
        e.preventDefault()
        console.log(typedText)
        setTypedText("")
      }
    }

    const messages = [
      { id: 0, text: "Hey, how's it going? It's been a while! How have things been with you lately?" }, // Receive
      { id: 1, text: "I'm doing great, thanks for asking! Life's been busy, but I can’t complain. How about you?" }, // Send
      { id: 0, text: "Not too bad. Work’s been keeping me on my toes, but I’m managing. What about you? Keeping busy?" }, // Receive
      { id: 1, text: "Oh, absolutely. Work has been hectic lately, lots of deadlines. Have you had time to relax?" }, // Send
      { id: 0, text: "A little. I managed to binge-watch some shows over the weekend, which was nice." }, // Receive
      { id: 1, text: "That’s great! Which shows did you get into? Anything you’d recommend?" }, // Send
      { id: 0, text: "I started the new season of that mystery series we talked about before. It’s so good!" }, // Receive
      { id: 1, text: "Oh, I’ve been meaning to watch that! How’s the new season shaping up?" }, // Send
      { id: 0, text: "It’s incredible! The twists and turns are even crazier than the last season." }, // Receive
      { id: 1, text: "You’re really making me want to start it tonight! I might have to!" }, // Send
      { id: 0, text: "You should! By the way, have you tried that new coffee place downtown yet? I’ve heard a lot about it." }, // Receive
      { id: 1, text: "Not yet, but I’ve heard good things too. Have you been there? What’s it like?" }, // Send
      { id: 0, text: "Yeah, I went last week. It’s fantastic. Their espresso is easily the best I’ve had in a long time!" }, // Receive
      { id: 1, text: "That sounds amazing. I’ll definitely check it out. Thanks for the tip!" }, // Send
      { id: 0, text: "You’re welcome! So, do you have any exciting plans for the weekend?" }, // Receive
      { id: 1, text: "I was thinking of going on a hike if the weather cooperates. I could use some fresh air. What about you?" }, // Send
      { id: 0, text: "That sounds fun! I’ve been meaning to get out more too. Maybe I’ll join you if I’m free." }, // Receive
      { id: 1, text: "That would be awesome! Let’s keep in touch and figure something out." }, // Send
      { id: 0, text: "Definitely! Oh, by the way, did you finish that book you were reading the last time we talked?" }, // Receive
      { id: 1, text: "Yes, I finished it last week! It was amazing—I couldn’t put it down. You have to read it next!" }, // Send
      { id: 0, text: "I’ve been meaning to start it. What’s it about again? Remind me." }, // Receive
      { id: 1, text: "It’s a mystery thriller with so many twists and unexpected reveals. You’ll love it!" }, // Send
      { id: 0, text: "Sounds like my kind of book. I’ll add it to my reading list!" }, // Receive
      { id: 1, text: "You won’t regret it. Let me know what you think once you dive into it!" }, // Send
      { id: 0, text: "Will do! By the way, have you caught up on the latest season of that show we both love?" }, // Receive
      { id: 1, text: "Not yet. I’ve been meaning to, but I just haven’t had the time. Is it any good?" }, // Send
      { id: 0, text: "It’s incredible! The plot twists are on another level this season." }, // Receive
      { id: 1, text: "That’s all the convincing I need. I’ll start it this weekend for sure!" }, // Send
      { id: 0, text: "Awesome. Let me know when you’ve seen it—we need to talk about it!" }, // Receive
      { id: 1, text: "For sure! I’ll message you as soon as I finish. I can’t wait to discuss it!" }, // Send
      { id: 0, text: "Looking forward to it! It’s going to be so much fun talking about all the crazy stuff that happens." }, // Receive
      { id: 1, text: "Me too! Let’s definitely catch up soon. Talk later!" }, // Send
    ];
    
  return (
    <div className="selected-chat" style={{display : isActive ? "flex" : "none"}}>
        <div className='selected-chat-header'>
            <div className='chat-info'>
              <img
                src={pfp}
                alt="pfp"/>
              <p>John Doe</p>
            </div>
            <i
              className="bi bi-x"
              onClick={handleHide}></i>
        </div>

        <div className='divider'/>
        <div className='selected-chat-main'>
            <div className='selected-chat-messages'>

              {messages.map((message, index) => {

                const isSenderChange = (currentIndex) => {
                  if(!(currentIndex > 0 && currentIndex < messages.length - 1)) return false
                  if(messages[currentIndex].id === messages[currentIndex + 1].id) return true
                  return false
                }

                const messageType = message.id === 1 ? 'send' : 'recived';
                const pfpClass = message.id === 1 ? 'pfp-send' : 'pfp-recived';
                const addMarginClass = isSenderChange(index) ? 'message-spacing' : ''

                return(
                  <div
                  key={index}
                  className={`message ${messageType} ${addMarginClass} `}
                >
                  <p>{message.text}</p>
                  <img
                    src={pfp}
                    alt="pfp"
                    className={`message-pfp ${pfpClass}`}/>
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
                <div className='selected-chat-send-btn'>
                    <i className="bi bi-send"></i>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SelectedChat;
