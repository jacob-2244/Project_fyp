'use client';

import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/header';
import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { BounceLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ChatPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sidebarState, setSidebarState] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const chatBody = document.getElementsByClassName('chatBody')[0];
    if (chatBody) {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
  };
  

  const toggleSidebar = () => {
    alert('CLickeddd')
    setSidebarState((prev) => !prev);
  };

  // Authentication check
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  // Fetch available users
  useEffect(() => {
    if (!user) return;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '!=', user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableUsers(userList);
    }, (error) => {
      console.error('Error fetching users:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch messages
  useEffect(() => {
    if (!selectedUser || !user) return;

    const chatRoomId = [user.email, selectedUser.email].sort().join('_');
    const messagesRef = collection(db, 'chats', chatRoomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      scrollToBottom();
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => unsubscribe();
  }, [selectedUser, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !user) return;

    const chatRoomId = [user.email, selectedUser.email].sort().join('_');

    try {
      const messagesRef = collection(db, 'chats', chatRoomId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: new Date(),
        sender: user.email,
        recipient: selectedUser.email,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render loading state
  if (loading || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <BounceLoader color="rgb(79 70 170)" size={60} />
        <p className="mt-4 text-gray-700">Loading, please wait...</p>
      </div>
    );
  }

  // Render authentication check
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please log in to access the chat</p>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="flex h-screen bg-gray-200 font-roboto">

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="flex h-screen">
          {/* User List Sidebar */}
          <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Available Users</h2>
            {availableUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`p-2 mb-2 cursor-pointer rounded ${selectedUser?.id === chatUser.id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-200'
                  }`}
              >
                <div className="font-semibold">{chatUser.username}</div>
                <div className="text-sm text-gray-500">
                  {chatUser.email} - {chatUser.occupation}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col" >
            {selectedUser ? (
              <>
                <div className="bg-gray-200 p-4">
                  <h2 className="text-xl font-bold">
                    Chat with {selectedUser.username || selectedUser.email}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto chatBody" style={
                  {padding:'0 1rem'}
                }>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-2 p-2 rounded max-w-md chatBody ${message.sender === user.email
                          ? 'bg-indigo-600 text-white self-end ml-auto'
                          : 'bg-gray-300 text-black mr-auto'
                        }`}
                    >
                      {message.text}
                    </div>
                  ))} 
                </div>

                <form onSubmit={sendMessage} style={{margin:'0px 0px 69px'}} className="bg-gray-100 p-4 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}