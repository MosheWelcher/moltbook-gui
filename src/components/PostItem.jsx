import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, CornerDownRight } from 'lucide-react';
import { api } from '../services/api';

export function PostItem({ post, onVote }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Format date helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleToggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const res = await api.getComments(post.id);
                if (res.comments) setComments(res.comments);
            } catch (e) {
                console.error("Failed to load comments", e);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const calculateVotes = (p) => (p.upvotes || 0) - (p.downvotes || 0);

    const handleVote = async (type) => {
        // Optimistic UI update could go here, but for now we just call API
        // The parent Feed component might refresh, or we just update local state if we had it
        try {
            if (type === 'up') await api.upvotePost(post.id);
            else await api.downvotePost(post.id);
            onVote && onVote(post.id); // Trigger refresh
        } catch (e) {
            console.error("Vote failed", e);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            await api.postComment(post.id, replyContent);
            setReplyContent('');
            // Refresh comments
            const res = await api.getComments(post.id);
            if (res.comments) setComments(res.comments);
        } catch (e) {
            alert("Failed to post comment: " + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm">
            {/* Vote Sidebar */}
            <div className="flex">
                <div className="w-12 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-3 gap-2">
                    <button onClick={() => handleVote('up')} className="text-gray-400 hover:text-orange-500 transition-colors">
                        <ThumbsUp size={18} />
                    </button>
                    <span className="text-sm font-bold text-gray-700">{calculateVotes(post)}</span>
                    <button onClick={() => handleVote('down')} className="text-gray-400 hover:text-blue-500 transition-colors">
                        <ThumbsDown size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2 gap-2">
                        {post.submolt && (
                            <span className="font-bold text-gray-800 hover:underline cursor-pointer">
                                m/{post.submolt.name}
                            </span>
                        )}
                        <span>•</span>
                        <span>Posted by u/{post.author?.name}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>

                    {post.url ? (
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all mb-3 block">
                            {post.url} <ExternalLinkIcon size={12} className="inline" />
                        </a>
                    ) : (
                        <div className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
                        <button
                            onClick={handleToggleComments}
                            className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-sm font-medium"
                        >
                            <MessageCircle size={16} />
                            {post.comment_count || 0} Comments
                        </button>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-3">
                            {/* Reply Box */}
                            <form onSubmit={handleReply} className="mb-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-molt-500"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-molt-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-molt-700 disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </form>

                            {/* Comments List */}
                            {loadingComments ? (
                                <div className="text-center text-sm text-gray-500 py-2">Loading comments...</div>
                            ) : (
                                <div className="space-y-3">
                                    {comments.length === 0 ? (
                                        <div className="text-center text-sm text-gray-400">No comments yet. Be the first!</div>
                                    ) : (
                                        comments.map(comment => (
                                            <div key={comment.id} className="bg-white p-3 rounded border border-gray-200">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                    <span className="font-bold text-gray-700">{comment.author?.name}</span>
                                                    <span>{calculateVotes(comment)} points</span>
                                                    <span>•</span>
                                                    <span>{formatDate(comment.created_at)}</span>
                                                </div>
                                                <div className="text-sm text-gray-800">{comment.content}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ExternalLinkIcon = ({ className }) => (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
)
