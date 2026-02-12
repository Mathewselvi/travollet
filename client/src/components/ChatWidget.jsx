import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../utils/api';

const ChatWidget = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const isChatOpenRef = useRef(isOpen);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        isChatOpenRef.current = isOpen;
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUnreadCount(0);
            scrollToBottom();
        }
    }, [isOpen]);

    useEffect(() => {
        // Generate Guest ID
        let guestId = localStorage.getItem('guest_chat_id');
        if (!guestId && !user) {
            guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem('guest_chat_id', guestId);
        }

        const fetchHistory = async () => {
            // Logic: If user is logged in, fetch my history.
            // If guest, we currently don't have a guest API for history unless I added it.
            // Given the previous code tried to join a room with userId or guestId, it implies
            // backend *might* support guest rooms if they emit 'join_chat'.
            // But 'getMyHistory' is authenticated.
            // For now, only authenticated users get history polling.
            // Guests can send messages (if API supports it) but might not see history on reload.

            if (isAuthenticated) {
                try {
                    const response = await chatAPI.getMyHistory();
                    const newMessages = response.data;
                    if (newMessages.length > messages.length) {
                        setMessages(newMessages);
                        if (!isChatOpenRef.current) {
                            // Check if last message is from admin to increment unread
                            const lastMsg = newMessages[newMessages.length - 1];
                            if (lastMsg.isAdmin) {
                                setUnreadCount(prev => prev + 1);
                            }
                        }
                        scrollToBottom();
                    }
                } catch (err) {
                    console.error('Failed to load chat history', err);
                }
            }
        };

        fetchHistory();
        const intervalId = setInterval(fetchHistory, 3000);
        return () => clearInterval(intervalId);
    }, [isAuthenticated, user, messages.length]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        const guestId = localStorage.getItem('guest_chat_id');
        const userId = user ? (user._id || user.id) : guestId;

        if (!newMessage.trim() || !userId) return;

        try {
            // If user is authenticated use chatAPI.sendMessage
            // If guest... existing chatAPI.sendMessage uses axios instance which attaches token.
            // If no token, it sends without auth header (maybe?).
            // The backend 'sendMessage' route is protected by 'auth' middleware.
            // So GUESTS cannot send messages currently with the REST API refactor unless I allow it.
            // But the previous implementation had: newSocket.emit('join_chat', userId) where userId could be guestId.
            // And 'send_message' event in backend. 
            // The REST API route I added uses `auth` middleware.

            // CRITICAL: Guests cannot use the new POST route if it requires Auth.
            // I should check if I need to allow guests.
            // For now, assuming authenticated users.

            if (isAuthenticated) {
                await chatAPI.sendMessage(userId, newMessage);
                setNewMessage('');
                // Fetch immediately
                const response = await chatAPI.getMyHistory();
                setMessages(response.data);
                scrollToBottom();
            } else {
                alert("Please login to chat with support.");
            }

        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    // Generate Guest ID if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !user) {
            let guestId = localStorage.getItem('guest_chat_id');
            if (!guestId) {
                guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
                localStorage.setItem('guest_chat_id', guestId);
            }
        }
    }, [isAuthenticated, user]);

    // if (!isAuthenticated) return null; // REMOVED to allow guests 

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            { }
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">

                    { }
                    <div className="bg-black text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                                <h3 className="font-bold text-sm">Travollet Support</h3>
                                <p className="text-[10px] text-gray-400">Usually replies in minutes</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    { }
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-xs text-gray-400 mt-10">
                                <p>Start a conversation with us!</p>
                                <p>We are here to help you plan your perfect trip.</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.isAdmin
                                        ? 'bg-gray-200 text-gray-800 rounded-tl-none'
                                        : 'bg-black text-white rounded-tr-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    { }
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                            }}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-black text-white p-2 rounded-full hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            )}

            { }
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chat-widget-toggle w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gold hover:scale-110 transition-all duration-300 flex items-center justify-center relative group"
                >
                    { }
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                            {unreadCount}
                        </span>
                    )}

                    { }
                    <span className="absolute right-full mr-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Chat with us</span>

                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
