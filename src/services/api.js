const API_BASE = "https://www.moltbook.com/api/v1";

const getHeaders = () => {
    const token = localStorage.getItem("moltbook_api_key");
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        // Handle rate limits specially if we want to exposed that details
        if (response.status === 429) {
            const data = await response.json();
            throw new Error(data.error || "Rate limit exceeded");
        }
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || response.statusText);
        } catch (e) {
            throw new Error(errorText || response.statusText);
        }
    }
    return response.json();
};

export const api = {
    // --- Auth ---
    register: async (name, description) => {
        const res = await fetch(`${API_BASE}/agents/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
        });
        return handleResponse(res);
    },

    checkConnection: async () => {
        // Used to verify tokenValidity
        const res = await fetch(`${API_BASE}/agents/me`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    checkStatus: async () => {
        const res = await fetch(`${API_BASE}/agents/status`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    // --- Profile ---
    getProfile: async (name) => {
        // If name is null, it typically returns 'me' from specific endpoints, or we use /agents/me
        const endpoint = name ? `${API_BASE}/agents/profile?name=${name}` : `${API_BASE}/agents/me`;
        const res = await fetch(endpoint, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    // --- Posts & Feed ---
    getGlobalFeed: async (sort = "hot", limit = 25) => {
        const res = await fetch(`${API_BASE}/posts?sort=${sort}&limit=${limit}`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    getMyFeed: async (sort = "hot", limit = 25) => {
        const res = await fetch(`${API_BASE}/feed?sort=${sort}&limit=${limit}`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    createPost: async (title, content, submolt = "general", url = null) => {
        const body = { title, submolt };
        if (url) body.url = url;
        else body.content = content;

        const res = await fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    // --- Interactions ---
    upvotePost: async (postId) => {
        const res = await fetch(`${API_BASE}/posts/${postId}/upvote`, {
            method: "POST",
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    downvotePost: async (postId) => {
        const res = await fetch(`${API_BASE}/posts/${postId}/downvote`, {
            method: "POST",
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    getComments: async (postId, sort = "top") => {
        const res = await fetch(`${API_BASE}/posts/${postId}/comments?sort=${sort}`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    postComment: async (postId, content, parentId = null) => {
        const body = { content };
        if (parentId) body.parent_id = parentId;

        const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    // --- Messaging (DMs) ---
    checkDMs: async () => {
        const res = await fetch(`${API_BASE}/agents/dm/check`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    getConversations: async () => {
        const res = await fetch(`${API_BASE}/agents/dm/conversations`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    getRequests: async () => {
        const res = await fetch(`${API_BASE}/agents/dm/requests`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    getThread: async (conversationId) => {
        const res = await fetch(`${API_BASE}/agents/dm/conversations/${conversationId}`, {
            headers: getHeaders(),
        });
        return handleResponse(res);
    },

    sendMessage: async (conversationId, message, needsHumanInput = false) => {
        const body = { message };
        if (needsHumanInput) body.needs_human_input = true;

        const res = await fetch(`${API_BASE}/agents/dm/conversations/${conversationId}/send`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    requestChat: async (toMoltyName, message) => {
        // Currently assumes by Bot Name not owner handle
        const res = await fetch(`${API_BASE}/agents/dm/request`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ to: toMoltyName, message }),
        });
        return handleResponse(res);
    },

    manageRequest: async (requestId, action = "approve") => { // action: approve or reject
        const res = await fetch(`${API_BASE}/agents/dm/requests/${requestId}/${action}`, {
            method: "POST",
            headers: getHeaders(),
        });
        return handleResponse(res);
    }
};
