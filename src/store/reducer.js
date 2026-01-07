/**
 * @fileoverview Root reducer for the global store
 * Combines all state slice reducers
 */

import {
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE,
  ADD_REPORT,
  UPDATE_REPORTS,
  SET_REPORTS,
  SET_FILTERS,
  RESET_FILTERS,
  UPDATE_FORM,
  CLEAR_FORM
} from './actions';

/**
 * Initial state for authentication
 * @type {import('./types.js').AuthState}
 */
const initialAuthState = {
  user: null,
  profile: null,
  isAuthenticated: false
};

/**
 * Initial state for pet reports
 * @type {import('./types.js').PetReportsState}
 */
const initialPetReportsState = {
  reports: []
};

/**
 * Initial state for search filters
 * @type {import('./types.js').SearchFiltersState}
 */
const initialSearchFiltersState = {
  filters: {
    country: 'India',
    state: 'Maharashtra',
    postcode: '',
    includeLost: true,
    includeFound: true,
    searchImagePreview: null,
    searchMode: 'location'
  }
};

/**
 * Initial state for registration form
 * @type {import('./types.js').RegistrationState}
 */
const initialRegistrationState = {
  formData: {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    userType: '',
    experience: '',
    availability: [],
    socialProfiles: {
      facebook: '',
      instagram: '',
      x: '',
      tiktok: '',
      youtube: '',
      website: ''
    }
  },
  isDirty: false
};

/**
 * Auth reducer
 * @param {import('./types.js').AuthState} state
 * @param {import('./types.js').Action} action
 * @returns {import('./types.js').AuthState}
 */
function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true
      };

    case LOGOUT:
      return {
        ...initialAuthState
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

/**
 * Pet reports reducer
 * @param {import('./types.js').PetReportsState} state
 * @param {import('./types.js').Action} action
 * @returns {import('./types.js').PetReportsState}
 */
function petReportsReducer(state = initialPetReportsState, action) {
  switch (action.type) {
    case ADD_REPORT:
      return {
        ...state,
        reports: [action.payload, ...state.reports]
      };

    case UPDATE_REPORTS:
      return {
        ...state,
        reports: action.payload
      };

    case SET_REPORTS:
      return {
        ...state,
        reports: action.payload
      };

    default:
      return state;
  }
}

/**
 * Search filters reducer
 * @param {import('./types.js').SearchFiltersState} state
 * @param {import('./types.js').Action} action
 * @returns {import('./types.js').SearchFiltersState}
 */
function searchFiltersReducer(state = initialSearchFiltersState, action) {
  switch (action.type) {
    case SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case RESET_FILTERS:
      return initialSearchFiltersState;

    default:
      return state;
  }
}

/**
 * Registration reducer
 * @param {import('./types.js').RegistrationState} state
 * @param {import('./types.js').Action} action
 * @returns {import('./types.js').RegistrationState}
 */
function registrationReducer(state = initialRegistrationState, action) {
  switch (action.type) {
    case UPDATE_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        },
        isDirty: true
      };

    case CLEAR_FORM:
      return initialRegistrationState;

    default:
      return state;
  }
}

/**
 * Root reducer - combines all slice reducers
 * @param {import('./types.js').StoreState} state
 * @param {import('./types.js').Action} action
 * @returns {import('./types.js').StoreState}
 */
export function rootReducer(state, action) {
  return {
    auth: authReducer(state?.auth, action),
    petReports: petReportsReducer(state?.petReports, action),
    searchFilters: searchFiltersReducer(state?.searchFilters, action),
    registration: registrationReducer(state?.registration, action)
  };
}

/**
 * Get initial state - used by StoreProvider
 * @returns {import('./types.js').StoreState}
 */
export function getInitialState() {
  return {
    auth: initialAuthState,
    petReports: initialPetReportsState,
    searchFilters: initialSearchFiltersState,
    registration: initialRegistrationState
  };
}

