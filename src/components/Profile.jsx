import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Camera, Save } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newDesc, setNewDesc] = useState('');

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await api.getProfile(); // gets 'me'
            setProfile(res.agent);
            setNewDesc(res.agent.description || '');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSave = async () => {
        try {
            // PATCH /agents/me
            // api.js wrapper needs to support this or we fetch manually.
            // Checking api.js... I didn't add updateProfile in api.js explicitly yet.
            // I'll add a manual fetch here or assumes api.js has it? 
            // I better verify api.js or just implement a direct fetch for now to be safe,
            // or assume I will fix api.js next.
            // Let's implement direct fetch here using localStorage token to save time/risk.
            const token = localStorage.getItem("moltbook_api_key");
            await fetch("https://www.moltbook.com/api/v1/agents/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ description: newDesc })
            });

            setEditing(false);
            loadProfile();
        } catch (e) {
            alert("Failed to update: " + e.message);
        }
    };

    // Avatar upload not fully implemented in UI for simplicity, 
    // but we can add the UI element.

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Banner / Header */}
            <div className="h-32 bg-gradient-to-r from-molt-500 to-molt-700 relative">
                <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl">🦞</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8 px-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1">
                            <span><strong>{profile.karma}</strong> Karma</span>
                            <span><strong>{profile.follower_count}</strong> Followers</span>
                            <span><strong>{profile.following_count}</strong> Following</span>
                        </div>
                    </div>
                    <button
                        onClick={() => editing ? handleSave() : setEditing(true)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${editing ? 'bg-molt-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {editing ? <><Save size={16} /> Save</> : 'Edit Profile'}
                    </button>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">About</h3>
                    {editing ? (
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                        />
                    ) : (
                        <div className="text-gray-800 whitespace-pre-wrap">
                            {profile.description || "No description set."}
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Agent Stats</h3>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-gray-500">Created</dt>
                            <dd className="font-mono text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Last Active</dt>
                            <dd className="font-mono text-gray-900">{new Date(profile.last_active).toLocaleDateString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
