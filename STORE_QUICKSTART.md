# Store Quick Start Guide

## Installation Complete! ✅

The global state management system is ready to use in your React application.

## Quick Start in 3 Steps

### 1️⃣ Import the hooks and actions

```javascript
import { useStore, useDispatch } from '../store/useStore';
import { loginUser, addPetReport, setSearchFilters } from '../store/actions';
```

Or use the barrel export:

```javascript
import { useStore, useDispatch, loginUser, addPetReport } from '../store';
```

### 2️⃣ Access state in your component

```javascript
function MyComponent() {
  const state = useStore();
  
  // Access any state slice
  const isLoggedIn = state.auth.isAuthenticated;
  const userName = state.auth.profile?.name;
  const allReports = state.petReports.reports;
  const currentFilters = state.searchFilters.filters;
  
  return <div>Welcome, {userName || 'Guest'}!</div>;
}
```

### 3️⃣ Dispatch actions to update state

```javascript
function MyComponent() {
  const dispatch = useDispatch();
  
  const handleLogin = (user, profile) => {
    dispatch(loginUser(user, profile));
  };
  
  const handleAddReport = (report) => {
    dispatch(addPetReport(report));
  };
  
  return (
    <button onClick={() => handleLogin(user, profile)}>
      Login
    </button>
  );
}
```

## Performance Tip: Use Selector

For better performance, use `useSelector` to subscribe only to specific state:

```javascript
import { useSelector } from '../store/useStore';

function MyComponent() {
  // Component only re-renders when reports change
  const reports = useSelector(state => state.petReports.reports);
  
  return <div>Total: {reports.length}</div>;
}
```

## Available Actions

### Authentication
```javascript
dispatch(loginUser(user, profile))       // Login
dispatch(logoutUser())                   // Logout
dispatch(updateProfile(profile))         // Update profile
```

### Pet Reports
```javascript
dispatch(addPetReport(report))           // Add new report
dispatch(updatePetReports(reports))      // Update all
dispatch(setPetReports(reports))         // Replace all
```

### Search Filters
```javascript
dispatch(setSearchFilters({              // Update filters
  country: 'India',
  includeLost: true
}))
dispatch(resetSearchFilters())           // Reset to defaults
```

### Registration Form
```javascript
dispatch(updateRegistrationForm({        // Update form
  fullName: 'John Doe',
  email: 'john@example.com'
}))
dispatch(clearRegistrationForm())        // Clear form
```

## State Structure

```javascript
state = {
  auth: {
    user: Object | null,
    profile: { name, email, picture },
    isAuthenticated: boolean
  },
  petReports: {
    reports: Array<PetReport>
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
    formData: { ... },
    isDirty: boolean
  }
}
```

## Development Tools

### Console Logging (Dev Mode Only)

Open browser console to see:
- All dispatched actions
- State before and after
- State differences (diff)
- Timestamps

Example output:
```
▼ action petReports/ADD_REPORT @ 10:30:45
  ▼ prev state { petReports: { reports: [5 items] } }
  ▼ action { type: "petReports/ADD_REPORT", payload: {...} }
  ▼ next state { petReports: { reports: [6 items] } }
  ▼ diff { petReports: { from: {...}, to: {...} } }
```

### Auto-Persistence

These states automatically save to localStorage:
- ✅ Pet Reports → `pet_reports_v1`
- ✅ Auth State → `auth_state`

Search filters and registration are session-only (not persisted).

## Complete Examples

See `src/store/examples.js` for 9 detailed examples including:
- Basic store access
- Dispatching actions
- Using selectors
- Search filters
- Form management
- Custom hooks
- Combining state slices
- And more!

## Full Documentation

📚 Read `STORE_DOCUMENTATION.md` for comprehensive documentation.

## Common Patterns

### Check if user is logged in
```javascript
const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
```

### Get all lost pets
```javascript
const lostPets = useSelector(state => 
  state.petReports.reports.filter(r => r.status === 'lost')
);
```

### Update single form field
```javascript
dispatch(updateRegistrationForm({ email: 'new@email.com' }));
```

### Get filtered reports count
```javascript
const count = useSelector(state => state.petReports.reports.length);
```

## Need Help?

1. Check `STORE_DOCUMENTATION.md` for detailed guides
2. Look at `src/store/examples.js` for code examples
3. See `src/registration/UserProfile.js` for real implementation
4. See `src/search/PetSearch.js` for complex usage

## That's It! 🚀

You're ready to use the global store in any component. Start by importing `useStore` and `useDispatch` and you're good to go!

