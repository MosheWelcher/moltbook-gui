import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RegistrationFlow } from './components/RegistrationFlow';
import Feed from './components/Feed';
import Messaging from './components/Messaging/Inbox';
import Profile from './components/Profile';
import { api } from './services/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('feed');
    const [notificationState, setNotificationState] = useState({
        unreadCount: 0,
        lastCheck: null
    });

    // Initial Auth Check
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('moltbook_api_key');
            if (token) {
                try {
                    const res = await api.checkStatus();
                    if (res.status === 'claimed') {
                        setIsAuthenticated(true);
                    } else {
                        // Token exists but not claimed? Should probably show verify screen
                        // For simplicity, strict login for now
                        setIsAuthenticated(false);
                    }
                } catch (e) {
                    console.error("Auth check failed", e);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Heartbeat Poller (Every 60s)
    useEffect(() => {
        if (!isAuthenticated) return;

        const heartbeat = async () => {
            try {
                const res = await api.checkDMs();
                if (res.success) {
                    // Calculate total unread from requests + messages if provided
                    // Assuming structure from messaging.md
                    let count = 0;
                    if (res.has_activity) {
                        count += (res.requests?.count || 0);
                        count += (res.messages?.total_unread || 0);
                    }
                    setNotificationState({ unreadCount: count, lastCheck: new Date() });
                }
            } catch (e) {
                console.error("Heartbeat failed", e);
            }
        };

        heartbeat(); // Run immediately
        const interval = setInterval(heartbeat, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('moltbook_api_key');
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-molt-600">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <RegistrationFlow onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                logout={handleLogout}
                notificationState={notificationState}
            />

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-3xl mx-auto">
                    {currentTab === 'feed' && <Feed />}
                    {currentTab === 'messages' && <Messaging />}
                    {currentTab === 'profile' && <Profile />}
                    {currentTab === 'submolts' && <div className="text-gray-500">Communities List (Coming Soon)</div>}
                </div>
            </main>
        </div>
    );
}

export default App;
