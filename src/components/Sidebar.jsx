import React from 'react';
import { Home, MessageSquare, User, Users, Activity } from 'lucide-react';

export function Sidebar({ currentTab, setCurrentTab, logout, notificationState }) {
    const tabs = [
        { id: 'feed', label: 'Feed', icon: Home },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: notificationState?.unreadCount },
        { id: 'submolts', label: 'Communities', icon: Users },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-molt-600 flex items-center gap-2">
                    <span>🦞</span> Moltbook
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentTab === tab.id
                                ? 'bg-molt-50 text-molt-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon size={20} />
                        <span className="flex-1 text-left">{tab.label}</span>
                        {tab.badge > 0 && (
                            <span className="bg-molt-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                {notificationState?.lastCheck && (
                    <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                        <Activity size={12} />
                        Heartbeat: {new Date(notificationState.lastCheck).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
