/**
 * @fileoverview Barrel export for store module
 * Import everything you need from a single location
 */

// Context and Provider
export { StoreContext, StoreProvider } from './StoreContext';

// Custom Hooks
export { useStore, useDispatch, useSelector } from './useStore';

// Actions
export {
  // Action type constants
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE,
  ADD_REPORT,
  UPDATE_REPORTS,
  SET_REPORTS,
  SET_FILTERS,
  RESET_FILTERS,
  UPDATE_FORM,
  CLEAR_FORM,

  // Action creators
  loginUser,
  logoutUser,
  updateProfile,
  addPetReport,
  updatePetReports,
  setPetReports,
  setSearchFilters,
  resetSearchFilters,
  updateRegistrationForm,
  clearRegistrationForm
} from './actions';

// Middleware (for advanced use cases)
export {
  loggerMiddleware,
  localStorageMiddleware,
  applyMiddleware
} from './middleware';

// Reducer (for testing or advanced use cases)
export {
  rootReducer,
  getInitialState
} from './reducer';

/**
 * Example usage:
 *
 * // Basic usage
 * import { useStore, useDispatch, loginUser } from './store';
 *
 * function MyComponent() {
 *   const state = useStore();
 *   const dispatch = useDispatch();
 *
 *   dispatch(loginUser(user, profile));
 * }
 *
 * // With selector
 * import { useSelector } from './store';
 *
 * function MyComponent() {
 *   const reports = useSelector(state => state.petReports.reports);
 * }
 */

