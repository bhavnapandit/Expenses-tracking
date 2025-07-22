const baseUrl = "https://expenses-tracking-api.onrender.com";
// const baseUrl = 'http://localhost:5000';

// Helper to build query string from object
const buildQueryString = (params) => {
    if (!params) return '';
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
};

// Generic fetch function
export  const apiRequest = async ({
    endpoint,
    method = 'GET',
    data = null,
    token = null,
    queryParams = null,
}) => {
    const url = `${baseUrl}${endpoint}${buildQueryString(queryParams)}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
        const response = await fetch(url, {
            method,
            headers,
            ...(data && { body: JSON.stringify(data) }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API error');
        }

        return result;
    } catch (error) {
        // console.error('API error:', error.message);
        throw error;
    }
};
