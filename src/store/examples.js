/**
 * Example usage of the global store in React components
 * Copy these patterns when creating new components
 */

import React, { useState } from 'react';
import { useStore, useDispatch, useSelector } from '../store/useStore';
import {
  loginUser,
  logoutUser,
  addPetReport,
  setSearchFilters,
  updateRegistrationForm
} from '../store/actions';

// ============================================
// EXAMPLE 1: Basic Store Access
// ============================================

export function ExampleBasicStoreAccess() {
  const state = useStore();

  return (
    <div>
      <h2>Store State</h2>
      <p>Is Authenticated: {state.auth.isAuthenticated ? 'Yes' : 'No'}</p>
      <p>Total Pet Reports: {state.petReports.reports.length}</p>
      <p>Current Country: {state.searchFilters.filters.country}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Using Dispatch
// ============================================

export function ExampleDispatchActions() {
  const dispatch = useDispatch();
  const state = useStore();

  const handleLogin = () => {
    const mockUser = { access_token: 'mock-token' };
    const mockProfile = {
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://via.placeholder.com/150'
    };

    dispatch(loginUser(mockUser, mockProfile));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleAddReport = () => {
    const newReport = {
      id: `R-${Date.now()}`,
      name: 'Buddy',
      breed: 'Labrador',
      type: 'Dog',
      status: 'lost',
      country: 'India',
      state: 'Maharashtra',
      suburb: 'Mumbai',
      postcode: '400001',
      lastSeen: 'Marine Drive',
      contact: '+91 98765 43210',
      details: 'Friendly brown Labrador',
      color: 'Brown',
      images: [],
      createdAt: new Date().toISOString()
    };

    dispatch(addPetReport(newReport));
  };

  return (
    <div>
      <h2>Dispatch Actions</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleAddReport}>Add Test Report</button>
      <p>Authenticated: {state.auth.isAuthenticated ? 'Yes' : 'No'}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Using Selector for Performance
// ============================================

export function ExampleUseSelector() {
  // Only subscribes to specific parts of state
  // Component only re-renders when these values change
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userName = useSelector(state => state.auth.profile?.name);
  const reportCount = useSelector(state => state.petReports.reports.length);

  return (
    <div>
      <h2>Optimized State Access</h2>
      {isAuthenticated ? (
        <p>Welcome, {userName}!</p>
      ) : (
        <p>Please log in</p>
      )}
      <p>Total Reports: {reportCount}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Search Filters Management
// ============================================

export function ExampleSearchFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.searchFilters.filters);

  const handleCountryChange = (e) => {
    dispatch(setSearchFilters({
      country: e.target.value,
      // Can update multiple fields at once
      state: '' // Reset state when country changes
    }));
  };

  const handleToggleLost = () => {
    dispatch(setSearchFilters({
      includeLost: !filters.includeLost
    }));
  };

  return (
    <div>
      <h2>Search Filters</h2>
      <select value={filters.country} onChange={handleCountryChange}>
        <option value="India">India</option>
        <option value="Australia">Australia</option>
        <option value="United States">United States</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={filters.includeLost}
          onChange={handleToggleLost}
        />
        Include Lost Pets
      </label>

      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Form State Management
// ============================================

export function ExampleFormWithStore() {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.registration.formData);

  const handleFieldChange = (field, value) => {
    dispatch(updateRegistrationForm({
      [field]: value
    }));
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => handleFieldChange('fullName', e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => handleFieldChange('email', e.target.value)}
      />

      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => handleFieldChange('phone', e.target.value)}
      />

      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Conditional Rendering Based on State
// ============================================

export function ExampleConditionalRendering() {
  const state = useStore();
  const dispatch = useDispatch();

  if (!state.auth.isAuthenticated) {
    return (
      <div>
        <h2>Please Log In</h2>
        <button onClick={() => {
          // Simulate login
          dispatch(loginUser(
            { access_token: 'test' },
            { name: 'Test User', email: 'test@example.com' }
          ));
        }}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {state.auth.profile.name}!</h2>
      <p>Email: {state.auth.profile.email}</p>
      <button onClick={() => dispatch(logoutUser())}>
        Log Out
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Working with Lists
// ============================================

export function ExamplePetReportsList() {
  const reports = useSelector(state => state.petReports.reports);
  const dispatch = useDispatch();

  const lostPets = reports.filter(r => r.status === 'lost');
  const foundPets = reports.filter(r => r.status === 'found');

  const handleAddSample = () => {
    dispatch(addPetReport({
      id: `R-${Date.now()}`,
      name: `Pet-${Date.now()}`,
      breed: 'Mixed',
      type: 'Dog',
      status: 'lost',
      country: 'India',
      state: 'Maharashtra',
      suburb: 'Mumbai',
      postcode: '400001',
      lastSeen: 'Test Location',
      contact: '+91 12345 67890',
      details: 'Test report',
      color: 'Brown',
      images: [],
      createdAt: new Date().toISOString()
    }));
  };

  return (
    <div>
      <h2>Pet Reports</h2>
      <button onClick={handleAddSample}>Add Sample Report</button>

      <h3>Lost Pets ({lostPets.length})</h3>
      <ul>
        {lostPets.map(pet => (
          <li key={pet.id}>
            {pet.name || 'Unnamed'} - {pet.breed} - {pet.suburb}
          </li>
        ))}
      </ul>

      <h3>Found Pets ({foundPets.length})</h3>
      <ul>
        {foundPets.map(pet => (
          <li key={pet.id}>
            {pet.name || 'Unnamed'} - {pet.breed} - {pet.suburb}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 8: Custom Hook with Store
// ============================================

/**
 * Custom hook to get only lost pets
 */
function useLostPets() {
  const reports = useSelector(state => state.petReports.reports);
  return reports.filter(r => r.status === 'lost');
}

/**
 * Custom hook to get authenticated user
 */
function useAuthUser() {
  const auth = useSelector(state => state.auth);
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.profile,
    isLoading: false // Could add loading state
  };
}

export function ExampleCustomHooks() {
  const lostPets = useLostPets();
  const { isAuthenticated, user } = useAuthUser();

  return (
    <div>
      <h2>Custom Hooks Example</h2>
      <p>Auth: {isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}</p>
      <p>Lost Pets: {lostPets.length}</p>
      <ul>
        {lostPets.map(pet => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 9: Combining Multiple State Slices
// ============================================

export function ExampleCombinedState() {
  const state = useStore();
  const dispatch = useDispatch();

  // Access multiple state slices
  const { isAuthenticated, profile } = state.auth;
  const { reports } = state.petReports;
  const { filters } = state.searchFilters;

  // Filter reports based on current search filters
  const filteredReports = reports.filter(report => {
    if (!filters.includeLost && report.status === 'lost') return false;
    if (!filters.includeFound && report.status === 'found') return false;
    if (filters.country && report.country !== filters.country) return false;
    return true;
  });

  return (
    <div>
      <h2>Dashboard</h2>

      <div>
        <h3>User Info</h3>
        {isAuthenticated ? (
          <p>Welcome, {profile.name}</p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>

      <div>
        <h3>Search Filters</h3>
        <p>Country: {filters.country}</p>
        <p>Include Lost: {filters.includeLost ? 'Yes' : 'No'}</p>
        <p>Include Found: {filters.includeFound ? 'Yes' : 'No'}</p>
      </div>

      <div>
        <h3>Filtered Reports</h3>
        <p>Total: {reports.length}</p>
        <p>Filtered: {filteredReports.length}</p>
      </div>
    </div>
  );
}

// ============================================
// BEST PRACTICES
// ============================================

/*
1. Use useSelector for performance when you only need part of the state
2. Dispatch actions instead of directly modifying state
3. Keep component-specific UI state in useState (like toggles, modals)
4. Put shared/persisted state in the global store
5. Create custom hooks for common state access patterns
6. Use TypeScript/JSDoc types for better autocomplete
7. Keep action creators pure functions
8. Don't dispatch actions during render (use effects or callbacks)
9. Use meaningful action type names with namespace prefixes
10. Test components with store by wrapping in StoreProvider
*/

