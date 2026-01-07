/**
 * @fileoverview Action creators and action type constants for the global store
 */

// ===========================
// ACTION TYPE CONSTANTS
// ===========================

// Auth Actions
export const LOGIN = 'auth/LOGIN';
export const LOGOUT = 'auth/LOGOUT';
export const UPDATE_PROFILE = 'auth/UPDATE_PROFILE';

// Pet Reports Actions
export const ADD_REPORT = 'petReports/ADD_REPORT';
export const UPDATE_REPORTS = 'petReports/UPDATE_REPORTS';
export const SET_REPORTS = 'petReports/SET_REPORTS';

// Search Filters Actions
export const SET_FILTERS = 'searchFilters/SET_FILTERS';
export const RESET_FILTERS = 'searchFilters/RESET_FILTERS';

// Registration Actions
export const UPDATE_FORM = 'registration/UPDATE_FORM';
export const CLEAR_FORM = 'registration/CLEAR_FORM';

// ===========================
// ACTION CREATORS
// ===========================

/**
 * Login user with OAuth credentials
 * @param {Object} user - OAuth user token/credential data
 * @param {Object} profile - User profile information
 * @returns {import('./types.js').Action}
 */
export const loginUser = (user, profile) => ({
  type: LOGIN,
  payload: { user, profile }
});

/**
 * Logout user
 * @returns {import('./types.js').Action}
 */
export const logoutUser = () => ({
  type: LOGOUT
});

/**
 * Update user profile information
 * @param {Object} profile - Updated profile data
 * @returns {import('./types.js').Action}
 */
export const updateProfile = (profile) => ({
  type: UPDATE_PROFILE,
  payload: profile
});

/**
 * Add a new pet report
 * @param {import('./types.js').PetReport} report - New pet report
 * @returns {import('./types.js').Action}
 */
export const addPetReport = (report) => ({
  type: ADD_REPORT,
  payload: report
});

/**
 * Update the entire pet reports array
 * @param {import('./types.js').PetReport[]} reports - Updated reports array
 * @returns {import('./types.js').Action}
 */
export const updatePetReports = (reports) => ({
  type: UPDATE_REPORTS,
  payload: reports
});

/**
 * Set pet reports (replaces entire array)
 * @param {import('./types.js').PetReport[]} reports - Reports array
 * @returns {import('./types.js').Action}
 */
export const setPetReports = (reports) => ({
  type: SET_REPORTS,
  payload: reports
});

/**
 * Set search filters
 * @param {Partial<import('./types.js').SearchFilters>} filters - Filter values to update
 * @returns {import('./types.js').Action}
 */
export const setSearchFilters = (filters) => ({
  type: SET_FILTERS,
  payload: filters
});

/**
 * Reset search filters to default values
 * @returns {import('./types.js').Action}
 */
export const resetSearchFilters = () => ({
  type: RESET_FILTERS
});

/**
 * Update registration form data
 * @param {Partial<import('./types.js').RegistrationFormData>} formData - Form fields to update
 * @returns {import('./types.js').Action}
 */
export const updateRegistrationForm = (formData) => ({
  type: UPDATE_FORM,
  payload: formData
});

/**
 * Clear registration form data
 * @returns {import('./types.js').Action}
 */
export const clearRegistrationForm = () => ({
  type: CLEAR_FORM
});

