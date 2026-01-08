/**
 * Common API service for all HTTP calls
 */

const API_BASE_URL = 'https://agus4uqwza.execute-api.ap-southeast-2.amazonaws.com';

/**
 * Fetch animal profiles/records
 * @returns {Promise<Array>} Array of animal records
 */
export const fetchUserProfiles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching animal profiles:', error);
        throw error;
    }
};

/**
 * Generic API call function
 * @param {string} endpoint - API endpoint (e.g., '/animals')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Response data
 */
export const apiCall = async (endpoint, options = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error);
        throw error;
    }
};

export default {
    fetchAnimalProfiles: fetchUserProfiles,
    apiCall,
};

