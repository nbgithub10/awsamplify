/**
 * @fileoverview Type definitions for the global store using JSDoc
 * These types provide TypeScript-like type safety in JavaScript projects
 */

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - OAuth user token/credential data
 * @property {Object|null} profile - User profile information (name, email, picture, etc.)
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 */

/**
 * @typedef {Object} PetReport
 * @property {string} id - Unique identifier for the report
 * @property {string} name - Pet name
 * @property {string} breed - Pet breed
 * @property {string} type - Pet type (Dog, Cat, etc.)
 * @property {'lost'|'found'} status - Report status
 * @property {string} country - Country location
 * @property {string} state - State/Province location
 * @property {string} suburb - Suburb/City location
 * @property {string} postcode - Postal/ZIP code
 * @property {string} lastSeen - Last seen location description
 * @property {string} contact - Contact information
 * @property {string} details - Additional details
 * @property {string} color - Pet color description
 * @property {string[]} images - Array of image data URLs
 * @property {string} createdAt - ISO timestamp of report creation
 * @property {number} [similarityScore] - Optional similarity score for image search
 */

/**
 * @typedef {Object} PetReportsState
 * @property {PetReport[]} reports - Array of all pet reports
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} country - Selected country
 * @property {string} state - Selected state/province
 * @property {string} postcode - City/Suburb filter
 * @property {boolean} includeLost - Include lost pets in search
 * @property {boolean} includeFound - Include found pets in search
 * @property {string|null} searchImagePreview - Data URL of uploaded search image
 * @property {'location'|'image'|'hybrid'} searchMode - Current search mode
 */

/**
 * @typedef {Object} SearchFiltersState
 * @property {SearchFilters} filters - Current search filter values
 */

/**
 * @typedef {Object} RegistrationFormData
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} country
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} postalCode
 * @property {string} userType
 * @property {string} experience
 * @property {string[]} availability
 * @property {Object} socialProfiles
 * @property {string} socialProfiles.facebook
 * @property {string} socialProfiles.instagram
 * @property {string} socialProfiles.x
 * @property {string} socialProfiles.tiktok
 * @property {string} socialProfiles.youtube
 * @property {string} socialProfiles.website
 */

/**
 * @typedef {Object} RegistrationState
 * @property {RegistrationFormData} formData - Current registration form data
 * @property {boolean} isDirty - Whether form has been modified
 */

/**
 * @typedef {Object} StoreState
 * @property {AuthState} auth - Authentication state
 * @property {PetReportsState} petReports - Pet reports state
 * @property {SearchFiltersState} searchFilters - Search filters state
 * @property {RegistrationState} registration - Registration form state
 */

/**
 * @typedef {Object} Action
 * @property {string} type - Action type constant
 * @property {*} [payload] - Optional action payload
 */

/**
 * @callback Dispatch
 * @param {Action} action - Action to dispatch
 * @returns {void}
 */

/**
 * @callback Middleware
 * @param {StoreState} state - Current store state
 * @param {Action} action - Action being dispatched
 * @param {Dispatch} next - Next middleware in chain
 * @returns {void}
 */

// Export empty object to make this a module
export {};

