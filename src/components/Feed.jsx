import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PostItem } from './PostItem';
import { Plus, X } from 'lucide-react';

export default function Feed() {
    const [activeTab, setActiveTab] = useState('global'); // global | my
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Post State
    const [isPosting, setIsPosting] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', submolt: 'general' });
    const [postingError, setPostingError] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = activeTab === 'global'
                ? await api.getGlobalFeed('hot')
                : await api.getMyFeed('hot');

            // Handle response structure. Assuming res.data.posts or res.posts
            // skill.md search example shows results array. 
            // Based on curl GET /posts example in skill.md:
            // Response usually depends on API spec, standard is { items: [] } or just [] or { posts: [] }
            // I'll assume res.posts or res.data based on typical implementation, 
            // but skill.md didn't explicitly show /posts response json.
            // I'll assume `res.data` if wrapped or `res` is the array.
            // Let's safe check properly in actual code, defaulting to empty array.

            const items = res.posts || res.items || (Array.isArray(res) ? res : []);
            setPosts(items);
        } catch (e) {
            console.error("Feed load error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setPostingError(null);
        try {
            await api.createPost(newPost.title, newPost.content, newPost.submolt);
            setIsPosting(false);
            setNewPost({ title: '', content: '', submolt: 'general' });
            fetchPosts(); // Refresh feed
        } catch (err) {
            setPostingError(err.message);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'global' ? 'Global Feed' : 'My Feed'}
                </h2>

                {/* Simple Tab Switcher */}
                <div className="bg-white rounded-lg p-1 border border-gray-200 flex text-sm">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`px-3 py-1.5 rounded-md ${activeTab === 'global' ? 'bg-molt-100 text-molt-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-3 py-1.5 rounded-md ${activeTab === 'my' ? 'bg-molt-100 text-molt-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Following
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-molt-600"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                            No posts found. Be the first to post!
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostItem key={post.id} post={post} onVote={fetchPosts} />
                        ))
                    )}
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsPosting(true)}
                className="fixed bottom-8 right-8 bg-molt-600 text-white p-4 rounded-full shadow-lg hover:bg-molt-700 transition-transform hover:scale-105 z-50"
            >
                <Plus size={24} />
            </button>

            {/* Create Post Modal */}
            {isPosting && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Create Post</h3>
                            <button onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="w-full text-lg font-bold border-none focus:ring-0 placeholder-gray-400 p-0"
                                    value={newPost.title}
                                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="What's on your mind? (Use markdown!)"
                                    className="w-full h-32 border-none resize-none focus:ring-0 placeholder-gray-400 p-0"
                                    value={newPost.content}
                                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                    required
                                />
                            </div>

                            {postingError && <div className="text-red-500 text-sm">{postingError}</div>}

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <select
                                    className="bg-gray-50 border border-gray-200 rounded text-sm px-2 py-1"
                                    value={newPost.submolt}
                                    onChange={e => setNewPost({ ...newPost, submolt: e.target.value })}
                                >
                                    <option value="general">m/general</option>
                                    <option value="coding">m/coding</option>
                                    <option value="humor">m/humor</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-molt-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-molt-700"
                                >
                                    Post 🦞
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
