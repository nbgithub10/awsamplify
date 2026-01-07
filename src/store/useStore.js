/**
 * @fileoverview Custom hooks for accessing the global store
 * Provides React-Redux-like API for components
 */

import { useContext } from 'react';
import { StoreContext } from './StoreContext';

/**
 * Custom hook to access the entire store state
 * Similar to useSelector in react-redux
 * @returns {import('./types.js').StoreState}
 */
export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context.state;
}

/**
 * Custom hook to access the dispatch function
 * Similar to useDispatch in react-redux
 * @returns {import('./types.js').Dispatch}
 */
export function useDispatch() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useDispatch must be used within a StoreProvider');
  }

  return context.dispatch;
}

/**
 * Custom hook to select specific state slice
 * @template T
 * @param {(state: import('./types.js').StoreState) => T} selector - Selector function
 * @returns {T}
 */
export function useSelector(selector) {
  const state = useStore();
  return selector(state);
}

