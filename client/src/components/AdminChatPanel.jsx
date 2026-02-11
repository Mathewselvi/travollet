import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

import { SOCKET_URL } from '../utils/api';

const ENDPOINT = SOCKET_URL;

const AdminChatPanel = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [typingUsers, setTypingUsers] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    useEffect(() => {
        const newSocket = io(ENDPOINT, {
            transports: ['websocket', 'polling'],
            reconnection: true,
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);


    const fetchConversations = async () => {
        try {
            const response = await adminAPI.getAllConversations();
            setConversations(response.data);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchConversations();

        if (socket) {

            socket.on('conversation_updated', () => {


                fetchConversations();
            });


            socket.on('display_typing', (data) => {
                setTypingUsers(prev => ({ ...prev, [data.room]: true }));
            });

            socket.on('stop_typing', (data) => {
                setTypingUsers(prev => ({ ...prev, [data.room]: false }));
            });
        }

        return () => {
            if (socket) {
                socket.off('conversation_updated');
                socket.off('display_typing');
                socket.off('stop_typing');
            }
        };
    }, [socket]);


    useEffect(() => {
        if (!selectedUser || !socket) return;


        socket.emit('join_chat', selectedUser._id);

        const fetchHistory = async () => {
            try {
                const response = await adminAPI.getConversationMessages(selectedUser._id);
                setMessages(response.data);
                setTimeout(scrollToBottom, 100);
            } catch (err) {
                console.error('Error fetching history:', err);
            }
        };
        fetchHistory();

        const handleReceiveMessage = (message) => {

            if (message.conversationId === selectedUser._id) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }

            fetchConversations();
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [selectedUser, socket]);



    const handleSendMessage = (e) => {
        e.preventDefault();
        const adminId = user._id || user.id;
        const targetUserId = selectedUser._id || selectedUser.id || selectedUser;

        if (!newMessage.trim() || !socket || !selectedUser || !adminId) return;

        const messageData = {
            senderId: adminId,
            receiverId: targetUserId,
            conversationId: targetUserId,
            content: newMessage,
            isAdmin: true
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const handleDeleteConversation = async (userId) => {
        try {
            await adminAPI.deleteConversation(userId);

            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(null);
                setMessages([]);
            }
            fetchConversations();
        } catch (err) {
            console.error('Failed to delete conversation:', err);
            alert('Failed to delete conversation');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex">

            { }
            <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="font-serif font-bold text-lg">Inbox</h2>
                    <p className="text-xs text-gray-500">Recent customer inquiries</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No messages yet.</div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.user._id}
                                onClick={() => setSelectedUser(conv.user)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white ${selectedUser?._id === conv.user._id ? 'bg-white border-l-4 border-l-black' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-sm ${selectedUser?._id === conv.user._id ? 'text-black' : 'text-gray-700'}`}>{conv.user.name}</h3>
                                    <div className="flex items-center gap-2">
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Delete conversation with ${conv.user.name}? This cannot be undone.`)) {




                                                    handleDeleteConversation(conv.user._id);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Delete Conversation"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    {typingUsers[conv.user._id] ? (
                                        <span className="text-gold font-bold animate-pulse">Typing...</span>
                                    ) : conv.lastMessage}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">{new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            { }
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{selectedUser.name}</h3>
                                <p className="text-xs text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm ${msg.isAdmin ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your reply..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-black transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-gold text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                        <p>Select a conversation to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPanel;
