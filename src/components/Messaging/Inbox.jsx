import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RequestList } from './RequestList';
import { ChatWindow } from './ChatWindow';
import { Plus } from 'lucide-react';

export default function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatTarget, setNewChatTarget] = useState('');
    const [newChatMsg, setNewChatMsg] = useState('');

    const loadInbox = async () => {
        setLoading(true);
        try {
            const res = await api.getConversations();
            // res.conversations.items based on messaging.md
            const items = res.conversations?.items || [];
            setConversations(items);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInbox();
    }, [activeConversationId]); // Reload inbox when closing a chat (to update unread/last msg)

    const handleStartChat = async (e) => {
        e.preventDefault();
        try {
            await api.requestChat(newChatTarget, newChatMsg);
            setShowNewChat(false);
            setNewChatTarget('');
            setNewChatMsg('');
            alert("Request sent! Wait for them to approve.");
            loadInbox(); // Check if existing chat was found
        } catch (e) {
            alert("Failed to start chat: " + e.message);
        }
    };

    // If chat active, show window
    if (activeConversationId) {
        return <ChatWindow conversationId={activeConversationId} onBack={() => setActiveConversationId(null)} />;
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                <button
                    onClick={() => setShowNewChat(true)}
                    className="flex items-center gap-2 bg-molt-600 text-white px-4 py-2 rounded-lg hover:bg-molt-700"
                >
                    <Plus size={18} /> New Chat
                </button>
            </div>

            <RequestList onRequestHandled={loadInbox} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading inbox...</div>
                ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        No active conversations. Start one!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 overflow-y-auto">
                        {conversations.map(conv => (
                            <button
                                key={conv.conversation_id}
                                onClick={() => setActiveConversationId(conv.conversation_id)}
                                className="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-4 transition-colors"
                            >
                                <div className="w-10 h-10 bg-molt-100 rounded-full flex items-center justify-center text-molt-600 font-bold">
                                    {conv.with_agent?.name?.[0] || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-gray-900 truncate">{conv.with_agent?.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(conv.last_message_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 truncate flex items-center justify-between">
                                        <span>Click to view messages</span>
                                        {conv.unread_count > 0 && (
                                            <span className="bg-molt-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="font-bold text-lg mb-4">Start New Conversation</h3>
                        <form onSubmit={handleStartChat} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-molt-500"
                                    placeholder="e.g. HelpfulBot"
                                    value={newChatTarget}
                                    onChange={e => setNewChatTarget(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Message</label>
                                <textarea
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-molt-500"
                                    placeholder="Only send if you have a real reason!"
                                    value={newChatMsg}
                                    onChange={e => setNewChatMsg(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewChat(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-molt-600 text-white rounded-lg hover:bg-molt-700"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
