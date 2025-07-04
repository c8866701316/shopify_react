
// import React, { useState, useEffect, useRef } from 'react';
// import test from "../logo.svg"
// import { BiSupport } from 'react-icons/bi';

// const Chatbot = ({ position = 'bottom-right', height = 500, width = 400 }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // Track loading state
//   const messageContainerRef = useRef(null);

//   // Positioning logic
//   const getPosition = () => {
//     switch (position) {
//       case 'bottom-right':
//         return { right: '0.75rem', bottom: '4rem' };
//       case 'bottom-left':
//         return { left: '0.75rem', bottom: '4rem' };
//       case 'top-right':
//         return { right: '0.75rem', top: '4rem' };
//       case 'top-left':
//         return { left: '0.75rem', top: '4rem' };
//       default:
//         return { right: '0.75rem', bottom: '4rem' };
//     }
//   };

//   const getPositionButton = () => {
//     switch (position) {
//       case 'bottom-right':
//         return { right: '0.75rem', bottom: '0.75rem' };
//       case 'bottom-left':
//         return { left: '0.75rem', bottom: '0.75rem' };
//       case 'top-right':
//         return { right: '0.75rem', top: '0.75rem' };
//       case 'top-left':
//         return { left: '0.75rem', top: '0.75rem' };
//       default:
//         return { right: '0.75rem', bottom: '0.75rem' };
//     }
//   };

//   // Toggle chatbot visibility
//   const toggleChatbot = () => {
//     setIsVisible(!isVisible);
//   };

//   // Add a new message
//   const addMessage = (text, sender) => {
//     setMessages((prev) => [...prev, { text, sender }]);
//   };
//   const handleSend = async () => {
//     if (inputValue.trim()) {
//       addMessage(inputValue, 'user');
//       setInputValue('');
//       setIsLoading(true);

//       try {
//         // Prepare the conversation history
//         const conversationHistory = [
//           { role: 'system', content: 'You are a helpful assistant.' },
//           ...messages.map((msg) => ({
//             role: msg.sender === 'user' ? 'user' : 'assistant',
//             content: msg.text,
//           })),
//           { role: 'user', content: inputValue }, // Include the current input
//         ];

//         const response = await fetch('https://api.openai.com/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             messages: conversationHistory,
//             max_tokens: 150,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch response from OpenAI');
//         }

//         const data = await response.json();
//         const botResponse = data.choices[0].message.content.trim();
//         addMessage(botResponse, 'bot');

//         // Send the API response to the backend
//         await fetch(`${process.env.REACT_APP_API_URL}/api/store-chat-completion`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             id: data.id,
//             prompt_tokens: data.usage.prompt_tokens,
//             completion_tokens: data.usage.completion_tokens,
//             total_tokens: data.usage.total_tokens,
//           }),
//         });
//       } catch (error) {
//         console.error('Error fetching ChatGPT response:', error);
//         addMessage('Sorry, something went wrong. Please try again.', 'bot');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };
//   const clearChat = () => {
//     setMessages([]);
//   };
//   // Scroll to bottom of message container
//   useEffect(() => {
//     if (messageContainerRef.current) {
//       messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Calculate width based on screen size
//   const chatPopupWidth = window.innerWidth > 768 ? (typeof width === 'number' ? `${width}px` : '400px') : 'calc(100% - 64px)';

//   return (
//     <div id="chatbot" >
//       {/* Chat Popup */}
//       <div
//         id="chat-popup"
//         style={{
//           ...getPosition(),
//           position: 'fixed',
//           zIndex: 9999,
//           overflow: 'hidden',
//           borderRadius: '0.75rem',
//           border: '1px solid #d1d5db',
//           height: 'auto',
//           backgroundColor: '#ffffff',
//           transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//           transform: isVisible ? 'scale(1)' : 'scale(0)',
//           width: chatPopupWidth,
//         }}
//       >
//         {/* Header Section */}
//         <div
//           style={{
//             backgroundColor: '#005BD3', // Matches the blue background in the image
//             color: '#ffffff',
//             padding: '0.5rem 1rem',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             borderTopLeftRadius: '0.75rem',
//             borderTopRightRadius: '0.75rem',
//           }}
//         >
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             {/* Avatar Placeholder - Replace with actual image */}
//             <div
//               style={{
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '50%',
//                 // backgroundColor: '#e14343', // Placeholder color; use the actual image
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               {/* You can replace this with an <img> tag pointing to the Clubshop Support Angel image */}
//               <BiSupport style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
//               {/* <img src={test} alt="Support Angel" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> */}
//             </div>
//             <div>
//               <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Shopify Support System</div>
//               <div style={{ fontSize: '0.875rem' }}>Happy To Help You!</div>
//             </div>
//           </div>
//           <button
//             onClick={clearChat}
//             className="clear-chat-button"
//           >
//             Clear Chat
//           </button>
//         </div>

//         {/* Message Container */}
//         <div
//           style={{
//             height: `calc(${typeof height === 'number' ? `${height}px` : '500px'} - 50px)`, // Adjust height to account for header
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           <div
//             id="message-container"
//             ref={messageContainerRef}
//             style={{
//               flexGrow: 1,
//               overflowY: 'auto',
//               padding: '10px',
//             }}
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: 'flex',
//                   width: '100',
//                   justifyContent: msg.sender === 'user' ? 'flex-start' : 'flex-end',
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     gap: '0.5rem',
//                     justifyContent: 'flex-start',
//                     alignItems: 'center',
//                     width: '80%',
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderRadius: '9999px',
//                       width: '35px',
//                       height: '35px',
//                       backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#d1d5db',
//                       order: msg.sender === 'user' ? 0 : 2,
//                     }}
//                   >
//                     {msg.sender === 'user' ? (
//                       <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
//                         <path
//                           fill="#ffffff"
//                           d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
//                         />
//                       </svg>
//                     ) : (
//                       <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512">
//                         <path
//                           fill="#000000"
//                           d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div
//                     style={{
//                       padding: '0.5rem',
//                       marginTop: '0.5rem',
//                       marginBottom: '0.5rem',
//                       borderRadius: '0.5rem',
//                       width: 'calc(100% - 43px)',
//                       wordWrap: 'break-word',
//                       backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#d1d5db',
//                       color: msg.sender === 'user' ? '#fff' : '#000',
//                     }}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div
//                 style={{
//                   display: 'flex',
//                   width: '100%',
//                   justifyContent: 'flex-end',
//                   padding: '10px',
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: '0.5rem',
//                     borderRadius: '0.5rem',
//                     backgroundColor: '#d1d5db',
//                     color: '#000',
//                   }}
//                 >
//                   Typing...
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* Input Container */}
//           <div
//             style={{
//               display: 'flex',
//               padding: '1rem',
//               gap: '0.5rem',
//               justifyContent: 'flex-start',
//               alignItems: 'center',
//               borderTop: '1px solid #d1d5db',
//               backgroundColor: '#ffffff',
//             }}
//           >
//             <input
//               id="chat-input"
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={(e) => {
//                 if (['Enter', 'NumpadEnter'].includes(e.code) && !isLoading) {
//                   handleSend();
//                 }
//               }}
//               placeholder="Type a message..."
//               disabled={isLoading}
//               style={{
//                 padding: '0.5rem',
//                 borderRadius: '0.5rem',
//                 border: '1px solidrgb(56, 127, 235)',
//                 outline: 'none',
//                 width: 'calc(100% - 50px)',
//                 opacity: isLoading ? 0.5 : 1,
//               }}
//             />
//             <button
//               id="send-button"
//               type="button"
//               onClick={handleSend}
//               disabled={isLoading}
//               style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: '9999px',
//                 backgroundColor: isLoading ? '#a3bff9' : '#3b82f6',
//                 outline: 'none',
//                 border: 'none',
//                 width: '42px',
//                 height: '42px',
//                 cursor: isLoading ? 'not-allowed' : 'pointer',
//               }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
//                 <path
//                   fill="#ffffff"
//                   d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* Toggle Button */}
//       <button
//         id="toggle-button"
//         onClick={toggleChatbot}
//         aria-label={isVisible ? 'Close chatbot' : 'Open chatbot'}
//         style={{
//           ...getPositionButton(),
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           borderRadius: '9999px',
//           backgroundColor: '#3b82f6',
//           outline: 'none',
//           border: 'none',
//           width: '42px',
//           height: '42px',
//           position: 'fixed',
//           zIndex: 9999,
//         }}
//       >
//         {isVisible ? (
//           <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512">
//             <path
//               fill="#ffffff"
//               d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
//             />
//           </svg>
//         ) : (
//           <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512">
//             <path
//               fill="#ffffff"
//               d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"
//             />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// };

// export default Chatbot;


import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { BiSupport } from 'react-icons/bi';

const Chatbot = ({ position = 'bottom-right', height = 500, width = 400, storeId = 151 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messageContainerRef = useRef(null);

  // Positioning logic
  const getPosition = () => {
    switch (position) {
      case 'bottom-right': return { right: '0.75rem', bottom: '4rem' };
      case 'bottom-left': return { left: '0.75rem', bottom: '4rem' };
      case 'top-right': return { right: '0.75rem', top: '4rem' };
      case 'top-left': return { left: '0.75rem', top: '4rem' };
      default: return { right: '0.75rem', bottom: '4rem' };
    }
  };

  const getPositionButton = () => {
    switch (position) {
      case 'bottom-right': return { right: '0.75rem', bottom: '0.75rem' };
      case 'bottom-left': return { left: '0.75rem', bottom: '0.75rem' };
      case 'top-right': return { right: '0.75rem', top: '0.75rem' };
      case 'top-left': return { left: '0.75rem', top: '0.75rem' };
      default: return { right: '0.75rem', bottom: '0.75rem' };
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  // Add a new message
  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  // Fetch or generate session_id on component mount
  useEffect(() => {
    const getSessionId = async () => {
      let storedSessionId = localStorage.getItem('session_id');
  
      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-session`, {}, {
            headers: { 'Content-Type': 'application/json' },
          });

          const data = response.data;
          if (data.session_id) {
            localStorage.setItem('session_id', data.session_id);
            setSessionId(data.session_id);
          } else {
            console.warn('No session_id in response');
            addMessage('Failed to initialize session. Please try again.', 'error');
          }
        } catch (error) {
          console.error('Error fetching session_id:', error);
          addMessage('Unable to connect to session service. Please try again later.', 'error');
        }
      }
    };
  
    getSessionId();
  }, []);
  
  // Handle sending a message
  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId) {
      if (!sessionId) {
        addMessage('No session ID available. Please try again.', 'bot');
      }
      return;
    }

    // Add user message to the conversation
    addMessage(inputValue, 'user');
    const currentMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      // Add the current message to the history
      conversationHistory.push({ role: 'user', content: currentMessage });

      const response = await fetch(`http://103.39.131.9:8050/api/ask/${storeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentMessage,
          session_id: sessionId,
          // conversation_history: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch response: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      addMessage(data.answer, 'bot');
    } catch (error) {
      console.error('Error fetching backend response:', error);
      addMessage('Sorry, something went wrong. Please try again.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat (but keep session)
  const clearChat = () => {
    setMessages([]);
  };

  // Scroll to bottom of message container
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Calculate width based on screen size
  const chatPopupWidth = window.innerWidth > 768 ?
    (typeof width === 'number' ? `${width}px` : '400px') :
    'calc(100% - 64px)';
  return (
    <div id="chatbot">
      {/* Chat Popup */}
      <div
        id="chat-popup"
        style={{
          ...getPosition(),
          position: 'fixed',
          zIndex: 9999,
          overflow: 'hidden',
          borderRadius: '0.75rem',
          border: '1px solid #d1d5db',
          height: 'auto',
          backgroundColor: '#ffffff',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: isVisible ? 'scale(1)' : 'scale(0)',
          width: chatPopupWidth,
        }}
      >
        {/* Header Section */}
        <div style={{
          backgroundColor: '#005BD3',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: '0.75rem',
          borderTopRightRadius: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BiSupport style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Ouros Jewels Support</div>
              <div style={{ fontSize: '0.875rem' }}>Happy To Help You!</div>
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              backgroundColor: '#ffffff',
              color: '#005BD3',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear Chat
          </button>
        </div>

        {/* Message Container */}
        <div style={{
          height: `calc(${typeof height === 'number' ? `${height}px` : '500px'} - 50px)`,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div
            id="message-container"
            ref={messageContainerRef}
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                width: '100%',
                justifyContent: msg.sender === 'user' ? 'flex-start' : 'flex-end',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '80%',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '9999px',
                    width: '35px',
                    height: '35px',
                    backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#d1d5db',
                    order: msg.sender === 'user' ? 0 : 2,
                  }}>
                    {msg.sender === 'user' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
                        <path fill="#ffffff" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512">
                        <path fill="#000000" d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z" />
                      </svg>
                    )}
                  </div>
                  <div style={{
                    padding: '0.5rem',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                    borderRadius: '0.5rem',
                    width: 'calc(100% - 43px)',
                    wordWrap: 'break-word',
                    backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#d1d5db',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                padding: '10px',
              }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#d1d5db',
                  color: '#000',
                }}>
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Container */}
          <div style={{
            display: 'flex',
            padding: '1rem',
            gap: '0.5rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderTop: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
          }}>
            <input
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (['Enter', 'NumpadEnter'].includes(e.code) && !isLoading) {
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              disabled={isLoading}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid rgb(56, 127, 235)',
                outline: 'none',
                width: 'calc(100% - 50px)',
                opacity: isLoading ? 0.5 : 1,
              }}
            />
            <button
              id="send-button"
              type="button"
              onClick={handleSend}
              disabled={isLoading}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '9999px',
                backgroundColor: isLoading ? '#a3bff9' : '#3b82f6',
                outline: 'none',
                border: 'none',
                width: '42px',
                height: '42px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
                <path fill="#ffffff" d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        id="toggle-button"
        onClick={toggleChatbot}
        aria-label={isVisible ? 'Close chatbot' : 'Open chatbot'}
        style={{
          ...getPositionButton(),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '9999px',
          backgroundColor: '#3b82f6',
          outline: 'none',
          border: 'none',
          width: '42px',
          height: '42px',
          position: 'fixed',
          zIndex: 9999,
        }}
      >
        {isVisible ? (
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512">
            <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="25" viewBox="0 0 640 512">
            <path fill="#ffffff" d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
