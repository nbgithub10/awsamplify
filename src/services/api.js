/**
 * Common API service for all HTTP calls
 */

import axios from 'axios';

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
 * Fetch Google user info using access token
 * @param {string} accessToken - Google OAuth access token
 * @returns {Promise<any>} User profile data from Google
 */
export const fetchGoogleUserInfo = async (accessToken) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching Google user info:', error);
        throw error;
    }
};

/**
 * Get user profile by email
 * @param {string} email - User's email address
 * @returns {Promise<any>} User profile data
 */
export const getUserProfile = async (email) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/user/${encodeURIComponent(email)}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

/**
 * Save/Update user profile
 * @param {Object} payload - User data containing email and profile (as JSON string)
 * @returns {Promise<any>} Response data
 */
export const saveUserProfile = async (payload) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/user`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Error saving user profile:', error);
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
