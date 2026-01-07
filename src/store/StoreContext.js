/**
 * @fileoverview Store Context and Provider for global state management
 */

import React, { createContext, useReducer, useEffect, useRef } from 'react';
import { rootReducer, getInitialState } from './reducer';
import { loggerMiddleware, localStorageMiddleware } from './middleware';

/**
 * Store Context
 * @type {React.Context<{state: import('./types.js').StoreState, dispatch: import('./types.js').Dispatch}>}
 */
export const StoreContext = createContext(null);

/**
 * Sample pet reports data - used as fallback if localStorage is empty
 */
const SAMPLE_REPORTS = [
  {
    id: 'P-001',
    name: 'Bella',
    breed: 'Golden Retriever',
    type: 'Dog',
    status: 'lost',
    country: 'India',
    state: 'Maharashtra',
    suburb: 'Bandra',
    postcode: '400050',
    lastSeen: 'Bandra West, near Linking Road',
    contact: '+91 98765 43210',
    details: 'Golden coat, very friendly, wearing red collar. Reward offered!',
    color: 'Golden',
    images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23f4a460" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3EGolden%0ARetriever%3C/text%3E%3C/svg%3E'],
    createdAt: '2026-01-02T10:30:00Z'
  },
  {
    id: 'P-002',
    name: 'Milo',
    breed: 'Persian Cat',
    type: 'Cat',
    status: 'found',
    country: 'India',
    state: 'Karnataka',
    suburb: 'Koramangala',
    postcode: '560034',
    lastSeen: 'Found near Koramangala 5th Block park',
    contact: '+91 98700 11122',
    details: 'White Persian cat, well groomed, seems to be someone\'s pet',
    color: 'White',
    images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e8e8" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23666"%3EPersian%0ACat%3C/text%3E%3C/svg%3E'],
    createdAt: '2026-01-02T14:15:00Z'
  },
  {
    id: 'P-003',
    name: 'Max',
    breed: 'Labrador',
    type: 'Dog',
    status: 'lost',
    country: 'Australia',
    state: 'New South Wales',
    suburb: 'Sydney',
    postcode: '2000',
    lastSeen: 'Sydney CBD, near Hyde Park',
    contact: '+61 412 345 678',
    details: 'Black Labrador, 3 years old, answers to Max. Very friendly with children.',
    color: 'Black',
    images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23333" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3ELabrador%3C/text%3E%3C/svg%3E'],
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'P-004',
    name: 'Luna',
    breed: 'Indie Dog',
    type: 'Dog',
    status: 'found',
    country: 'India',
    state: 'Delhi',
    suburb: 'Connaught Place',
    postcode: '110001',
    lastSeen: 'Found wandering in Connaught Place',
    contact: '+91 98123 45678',
    details: 'Brown indie dog, wearing blue collar with no tag. Looking for owner.',
    color: 'Brown',
    images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23a0522d" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3EIndie%0ADog%3C/text%3E%3C/svg%3E'],
    createdAt: '2026-01-03T06:45:00Z'
  },
  {
    id: 'P-005',
    name: 'Whiskers',
    breed: 'Tabby Cat',
    type: 'Cat',
    status: 'lost',
    country: 'United States',
    state: 'California',
    suburb: 'Los Angeles',
    postcode: '90001',
    lastSeen: 'Hollywood area, near Sunset Boulevard',
    contact: '+1 323 555 0123',
    details: 'Orange tabby cat with white paws. Microchipped. Please contact if found!',
    color: 'Orange/White',
    images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23ff8c42" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3ETabby%0ACat%3C/text%3E%3C/svg%3E'],
    createdAt: '2026-01-02T18:20:00Z'
  }
];

/**
 * Load initial state from localStorage
 * @returns {import('./types.js').StoreState}
 */
function loadInitialState() {
  const initialState = getInitialState();

  try {
    // Load pet reports from localStorage (key: pet_reports_v1)
    const savedReports = localStorage.getItem('pet_reports_v1');
    if (savedReports) {
      initialState.petReports.reports = JSON.parse(savedReports);
    } else {
      // Use sample data if no saved reports
      initialState.petReports.reports = SAMPLE_REPORTS;
    }

    // Load auth state from localStorage (key: auth_state)
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      initialState.auth = JSON.parse(savedAuth);
    }
  } catch (error) {
    console.error('Error loading initial state from localStorage:', error);
    // Use sample data on error
    initialState.petReports.reports = SAMPLE_REPORTS;
  }

  return initialState;
}

/**
 * Store Provider Component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function StoreProvider({ children }) {
  // Load initial state from localStorage
  const initialState = loadInitialState();

  const [state, dispatch] = useReducer(rootReducer, initialState);

  // Use ref to always have access to latest state
  const stateRef = useRef(state);

  // Always keep ref in sync with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Enhanced dispatch with middleware
  const enhancedDispatch = (action) => {
    // Capture previous state for logger
    const prevState = stateRef.current;

    // Dispatch the action to update the state
    dispatch(action);

    // Calculate new state immediately (useReducer is synchronous)
    const newState = rootReducer(prevState, action);
    stateRef.current = newState;

    // Create store object for middleware
    const store = {
      getState: () => stateRef.current,
      dispatch: enhancedDispatch
    };

    // Run logger middleware with both prev and new state
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toLocaleTimeString();
      console.group(
        `%c action ${action.type} %c @ ${timestamp}`,
        'color: #4CAF50; font-weight: bold;',
        'color: #999; font-weight: normal;'
      );
      console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', prevState);
      console.log('%c action', 'color: #03A9F4; font-weight: bold;', action);
      console.log('%c next state', 'color: #4CAF50; font-weight: bold;', newState);
      console.groupEnd();
    }

    // Run localStorage middleware with new state
    localStorageMiddleware(store)(() => {})(action);
  };

  // Persist sample data on first load if localStorage was empty
  useEffect(() => {
    const savedReports = localStorage.getItem('pet_reports_v1');
    if (!savedReports && state.petReports.reports.length === SAMPLE_REPORTS.length) {
      // Save sample reports to localStorage
      localStorage.setItem('pet_reports_v1', JSON.stringify(SAMPLE_REPORTS));
    }
  }, []);

  // Expose store state to window object in development mode for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.__STORE_STATE__ = state;
      window.getStoreState = () => state;
      window.inspectStore = () => {
        console.log('%c📦 Current Store State', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
        console.log(state);
        return state;
      };

      // Log helpful message on first mount
      if (!window.__STORE_INITIALIZED__) {
        console.log('%c🔍 Store Debugging Enabled', 'color: #2196F3; font-size: 14px; font-weight: bold;');
        console.log('%cType one of these in console:', 'color: #666; font-style: italic;');
        console.log('  %cwindow.__STORE_STATE__%c - View current state', 'color: #FF9800; font-weight: bold;', 'color: #666;');
        console.log('  %cwindow.getStoreState()%c - Get current state', 'color: #FF9800; font-weight: bold;', 'color: #666;');
        console.log('  %cwindow.inspectStore()%c - Pretty print state', 'color: #FF9800; font-weight: bold;', 'color: #666;');
        window.__STORE_INITIALIZED__ = true;
      }
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

