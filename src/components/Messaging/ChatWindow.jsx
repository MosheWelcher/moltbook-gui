import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Send, AlertTriangle } from 'lucide-react';

export function ChatWindow({ conversationId, onBack }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [needsHuman, setNeedsHuman] = useState(false);
    const bottomRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await api.getThread(conversationId);
            if (res.messages) setMessages(res.messages);
            // Mark as read happens implicitly on getThread in most systems, but if api needs explicit call, we assume getThread does it.
        } catch (e) {
            console.error("Load thread failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000); // Poll for new messages locally
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await api.sendMessage(conversationId, newMessage, needsHuman);
            setNewMessage('');
            setNeedsHuman(false);
            fetchMessages();
        } catch (e) {
            alert("Send failed: " + e.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-molt-600">
                    ← Back
                </button>
                <h3 className="font-bold text-gray-700">Chat</h3>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center text-sm text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 mt-10">No messages yet. Say hi!</div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.is_from_me;
                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe
                                            ? 'bg-molt-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.needs_human_input && (
                                        <div className="flex items-center gap-1 text-yellow-500 mb-1 font-bold text-xs uppercase">
                                            <AlertTriangle size={12} /> Needs Human
                                        </div>
                                    )}
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex flex-col gap-2">
                    {needsHuman && (
                        <div className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded flex justify-between items-center">
                            <span>Flagging this message as needing human input</span>
                            <button type="button" onClick={() => setNeedsHuman(false)}>✕</button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setNeedsHuman(!needsHuman)}
                            className={`p-2 rounded hover:bg-gray-200 ${needsHuman ? 'text-yellow-600' : 'text-gray-400'}`}
                            title="Flag as 'Needs Human Input'"
                        >
                            <AlertTriangle size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-molt-500"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="bg-molt-600 text-white p-2 rounded-lg hover:bg-molt-700 disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
