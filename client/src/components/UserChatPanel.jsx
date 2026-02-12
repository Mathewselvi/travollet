import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../utils/api';

const UserChatPanel = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user) return;

        // Poll for messages every 3 seconds
        const fetchHistory = async () => {
            try {
                const response = await chatAPI.getMyHistory();
                const newMessages = response.data;

                // Only scroll if new messages arrived
                if (newMessages.length > messages.length) {
                    setMessages(newMessages);
                    scrollToBottom();
                } else {
                    // Check if last message is different to handle read status changes or edge cases
                    const lastMsg = newMessages[newMessages.length - 1];
                    const currentLastMsg = messages[messages.length - 1];
                    if (lastMsg?._id !== currentLastMsg?._id) {
                        setMessages(newMessages);
                        scrollToBottom();
                    }
                }
            } catch (err) {
                console.error('Failed to load chat history', err);
            }
        };

        // Initial fetch
        fetchHistory();

        // Polling interval
        const intervalId = setInterval(fetchHistory, 3000);

        return () => clearInterval(intervalId);
    }, [user, messages.length]); // Depend on length to avoid excessive re-renders but keep updated

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userId = user._id || user.id;
        if (!newMessage.trim() || !userId) return;

        try {
            await chatAPI.sendMessage(userId, newMessage);
            setNewMessage('');
            // Fetch immediately to show the new message
            const response = await chatAPI.getMyHistory();
            setMessages(response.data);
            scrollToBottom();
        } catch (err) {
            console.error("Failed to send message", err);
            alert("Failed to send message. Please try again.");
        }
    };
    /* Removed socket.io typing indicators as they are not supported in polling mode */

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
            { }
            <div className="bg-black text-white p-6 flex justify-between items-center">
                <div>
                    <h3 className="font-serif font-bold text-xl mb-1">Support Inbox</h3>
                    <p className="text-sm text-gray-400">Direct line to Travollet Concierge</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-gold uppercase tracking-widest">
                    Active
                </div>
            </div>

            { }
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <div className="text-5xl mb-4">💬</div>
                        <p className="text-lg">Start a conversation with us!</p>
                        <p className="text-sm">We are here to help you plan your perfect trip.</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`max-w-[70%] rounded-2xl p-5 ${msg.isAdmin
                            ? 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                            : 'bg-black text-white rounded-tr-none shadow-md'
                            }`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className={`text-[10px] mt-2 ${msg.isAdmin ? 'text-gray-400' : 'text-gray-500'} text-right`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            { }
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100 flex gap-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (socket && user) {
                            socket.emit('typing', { room: user._id || user.id, isTyping: true });
                            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                            typingTimeoutRef.current = setTimeout(() => {
                                socket.emit('stop_typing', { room: user._id || user.id, isTyping: false });
                            }, 2000);
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 hover:shadow-lg transform active:scale-95 duration-200"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default UserChatPanel;
