/**
 * @fileoverview Middleware functions for the global store
 * Includes localStorage persistence and development logger
 */

/**
 * Logger middleware - logs actions and state changes in development mode
 * @type {import('./types.js').Middleware}
 */
export const loggerMiddleware = (store) => (next) => (action) => {
  // Only log in development mode
  if (process.env.NODE_ENV !== 'development') {
    return next(action);
  }

  const prevState = store.getState();
  const timestamp = new Date().toLocaleTimeString();

  console.group(
    `%c action ${action.type} %c @ ${timestamp}`,
    'color: #4CAF50; font-weight: bold;',
    'color: #999; font-weight: normal;'
  );

  console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', prevState);
  console.log('%c action', 'color: #03A9F4; font-weight: bold;', action);

  // Call next middleware
  next(action);

  const nextState = store.getState();
  console.log('%c next state', 'color: #4CAF50; font-weight: bold;', nextState);

  // Calculate and show state diff
  try {
    const diff = calculateDiff(prevState, nextState);
    if (Object.keys(diff).length > 0) {
      console.log('%c diff', 'color: #FF9800; font-weight: bold;', diff);
    }
  } catch (e) {
    // Ignore diff calculation errors
  }

  console.groupEnd();
};

/**
 * Calculate diff between two states
 * @param {Object} prev - Previous state
 * @param {Object} next - Next state
 * @returns {Object} Difference object
 */
function calculateDiff(prev, next) {
  const diff = {};
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  allKeys.forEach((key) => {
    if (prev[key] !== next[key]) {
      diff[key] = {
        from: prev[key],
        to: next[key]
      };
    }
  });

  return diff;
}

/**
 * LocalStorage middleware - persists specific state slices to localStorage
 * @type {import('./types.js').Middleware}
 */
export const localStorageMiddleware = (store) => (next) => (action) => {
  // Call next middleware first
  next(action);

  // After state update, persist to localStorage
  const state = store.getState();

  try {
    // Persist pet reports to localStorage with key 'pet_reports_v1'
    if (action.type.startsWith('petReports/')) {
      localStorage.setItem('pet_reports_v1', JSON.stringify(state.petReports.reports));
    }

    // Persist auth state to localStorage with key 'auth_state'
    if (action.type.startsWith('auth/')) {
      localStorage.setItem('auth_state', JSON.stringify(state.auth));
    }

    // Note: We don't persist searchFilters or registration to localStorage
    // as they are session-specific
  } catch (error) {
    console.error('Error persisting to localStorage:', error);
  }
};

/**
 * Apply middleware to store
 * Middleware are applied in order: logger -> persistence
 * @param {...Function} middlewares - Middleware functions to apply
 * @returns {Function} Enhanced dispatch function
 */
export const applyMiddleware = (...middlewares) => (store) => {
  let dispatch = store.dispatch;

  const middlewareAPI = {
    getState: store.getState,
    dispatch: (action) => dispatch(action)
  };

  const chain = middlewares.map((middleware) => middleware(middlewareAPI));
  dispatch = compose(...chain)(store.dispatch);

  return { ...store, dispatch };
};

/**
 * Compose functions from right to left
 * @param {...Function} funcs - Functions to compose
 * @returns {Function} Composed function
 */
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

