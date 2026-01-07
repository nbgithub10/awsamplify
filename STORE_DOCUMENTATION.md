# Global State Management System

## Overview

This project now includes a Redux-like global state management system built with React Context API. The system provides centralized state management with middleware support for logging and localStorage persistence.

## Architecture

### Core Components

1. **StoreContext** (`src/store/StoreContext.js`)
   - Main provider component that wraps the application
   - Manages global state using React's useReducer
   - Applies middleware chain for logging and persistence
   - Hydrates initial state from localStorage

2. **Reducer** (`src/store/reducer.js`)
   - Combined reducer handling all state slices:
     - `auth`: User authentication state
     - `petReports`: Pet report data
     - `searchFilters`: Search filter preferences
     - `registration`: Registration form data

3. **Actions** (`src/store/actions.js`)
   - Action type constants (e.g., `LOGIN`, `ADD_REPORT`)
   - Action creator functions for dispatching actions

4. **Middleware** (`src/store/middleware.js`)
   - **Logger Middleware**: Logs actions and state changes in development
   - **LocalStorage Middleware**: Persists specific state slices

5. **Custom Hooks** (`src/store/useStore.js`)
   - `useStore()`: Access entire store state
   - `useDispatch()`: Get dispatch function
   - `useSelector(selector)`: Select specific state slice

## State Structure

```javascript
{
  auth: {
    user: Object | null,           // OAuth user credentials
    profile: Object | null,         // User profile (name, email, picture)
    isAuthenticated: boolean        // Authentication status
  },
  petReports: {
    reports: Array<PetReport>       // All pet reports
  },
  searchFilters: {
    filters: {
      country: string,
      state: string,
      postcode: string,
      includeLost: boolean,
      includeFound: boolean,
      searchImagePreview: string | null,
      searchMode: 'location' | 'image' | 'hybrid'
    }
  },
  registration: {
    formData: {
      fullName: string,
      email: string,
      phone: string,
      // ... other form fields
      socialProfiles: Object
    },
    isDirty: boolean                // Form modification flag
  }
}
```

## Usage

### Setting Up (Already Done)

The store is already set up in `src/index.js`:

```javascript
import { StoreProvider } from './store/StoreContext';

root.render(
  <GoogleOAuthProvider clientId="...">
    <StoreProvider>
      <App />
    </StoreProvider>
  </GoogleOAuthProvider>
);
```

### Using in Components

#### Accessing State

```javascript
import { useStore } from '../store/useStore';

function MyComponent() {
  const state = useStore();
  
  // Access specific state slices
  const { isAuthenticated, profile } = state.auth;
  const reports = state.petReports.reports;
  
  return <div>...</div>;
}
```

#### Dispatching Actions

```javascript
import { useDispatch } from '../store/useStore';
import { loginUser, addPetReport } from '../store/actions';

function MyComponent() {
  const dispatch = useDispatch();
  
  const handleLogin = (user, profile) => {
    dispatch(loginUser(user, profile));
  };
  
  const handleAddReport = (report) => {
    dispatch(addPetReport(report));
  };
  
  return <div>...</div>;
}
```

#### Using Selector

```javascript
import { useSelector } from '../store/useStore';

function MyComponent() {
  // Select only what you need
  const reports = useSelector(state => state.petReports.reports);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  
  return <div>...</div>;
}
```

## Available Actions

### Authentication
- `loginUser(user, profile)` - Login user with OAuth
- `logoutUser()` - Logout user
- `updateProfile(profile)` - Update user profile

### Pet Reports
- `addPetReport(report)` - Add new pet report
- `updatePetReports(reports)` - Update all reports
- `setPetReports(reports)` - Replace all reports

### Search Filters
- `setSearchFilters(filters)` - Update search filters
- `resetSearchFilters()` - Reset to defaults

### Registration
- `updateRegistrationForm(formData)` - Update form fields
- `clearRegistrationForm()` - Clear all form data

## Middleware

### Logger Middleware

Automatically logs all actions and state changes in **development mode only**.

Output format:
```
▼ action auth/LOGIN @ 10:30:45
  ▼ prev state
    auth: { user: null, ... }
  ▼ action
    { type: 'auth/LOGIN', payload: {...} }
  ▼ next state
    auth: { user: {...}, ... }
  ▼ diff
    auth: { from: {...}, to: {...} }
```

**Disable in production**: The logger checks `process.env.NODE_ENV` and only runs in development.

### LocalStorage Middleware

Automatically persists specific state slices to localStorage:
- **Pet Reports** → `pet_reports_v1` key
- **Auth State** → `auth_state` key

Search filters and registration data are **not persisted** (session-only).

## Migration Notes

### Components Updated

1. **UserProfile.js**
   - Now uses `useStore()` for auth state
   - Dispatches `loginUser()` and `logoutUser()` actions
   - Removed local `useState` for user/profile

2. **PetSearch.js**
   - Uses `state.petReports.reports` from store
   - Dispatches `addPetReport()` for new reports
   - Syncs search filters to store automatically
   - Removed localStorage management code

3. **UserRegistration.js** (Ready for integration)
   - Can use `state.registration.formData` for persistence
   - Dispatch `updateRegistrationForm()` on field changes
   - Form data survives navigation/refresh

### Backward Compatibility

✅ **localStorage keys preserved**:
- `pet_reports_v1` - Existing data loads seamlessly
- `auth_state` - New key for auth persistence

✅ **Sample data**: If localStorage is empty, sample pet reports are automatically loaded.

## Type Safety

All store code includes JSDoc type annotations for:
- IntelliSense autocomplete in VS Code
- Type checking (if using TypeScript)
- Better documentation

Example:
```javascript
/**
 * @param {import('./types.js').PetReport} report
 * @returns {import('./types.js').Action}
 */
export const addPetReport = (report) => ({
  type: ADD_REPORT,
  payload: report
});
```

## Development Tips

### Debugging State

Open browser console in development mode to see:
- All dispatched actions
- State before/after each action
- Calculated state diffs

### Adding New State Slices

1. Define types in `types.js`
2. Add initial state in `reducer.js`
3. Create action constants and creators in `actions.js`
4. Add reducer case in `reducer.js`
5. Optionally add persistence in `middleware.js`

### Performance

- Use `useSelector` to subscribe to specific state slices
- Components only re-render when selected state changes
- Middleware runs sequentially (logger → persistence)

## Testing

The store system supports testing:

```javascript
import { StoreProvider } from '../store/StoreContext';
import { render } from '@testing-library/react';

test('component with store', () => {
  render(
    <StoreProvider>
      <MyComponent />
    </StoreProvider>
  );
  // ... test assertions
});
```

## Future Enhancements

Possible improvements:
- Add Redux DevTools integration
- Implement time-travel debugging
- Add state persistence to SessionStorage
- Create selector memoization (like reselect)
- Add action batching for performance
- Implement undo/redo functionality

## Troubleshooting

### "useStore must be used within a StoreProvider"
- Ensure `<StoreProvider>` wraps your component tree in `index.js`

### State not persisting
- Check browser console for localStorage errors
- Verify action types start with correct prefix (`auth/`, `petReports/`)

### Logger not showing
- Ensure `NODE_ENV=development`
- Check browser console is not filtered

## Support

For issues or questions about the store system, check:
1. Type definitions in `types.js`
2. Action constants in `actions.js`
3. Browser console logs (development mode)

