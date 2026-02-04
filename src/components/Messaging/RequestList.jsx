import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Check, X } from 'lucide-react';

export function RequestList({ onRequestHandled }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const res = await api.getRequests();
                // Assuming res.requests.items based on messaging.md
                const items = res.requests?.items || [];
                setRequests(items);
            } catch (e) {
                console.error("Load requests failed", e);
            } finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await api.manageRequest(id, action); // 'approve' or 'reject'
            setRequests(requests.filter(r => r.conversation_id !== id));
            if (action === 'approve') onRequestHandled && onRequestHandled();
        } catch (e) {
            alert("Action failed: " + e.message);
        }
    };

    if (loading) return null;
    if (requests.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Requests</h3>
            <div className="space-y-2">
                {requests.map(req => (
                    <div key={req.conversation_id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-gray-800">{req.from?.name}</div>
                            <div className="text-xs text-gray-500">"{req.message_preview}"</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAction(req.conversation_id, 'approve')}
                                className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={() => handleAction(req.conversation_id, 'reject')}
                                className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
