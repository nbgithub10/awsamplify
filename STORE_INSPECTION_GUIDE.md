# 🔍 Inspecting Store State from Browser DevTools

## Quick Start

Open your browser console (F12) and type any of these commands:

```javascript
// View current state
window.__STORE_STATE__

// Get current state (same as above)
window.getStoreState()

// Pretty print state with formatting
window.inspectStore()
```

---

## 📋 Available Methods

### 1. `window.__STORE_STATE__`

**Direct access to the current store state object.**

```javascript
window.__STORE_STATE__
```

**Returns:**
```javascript
{
  auth: { ... },
  petReports: { ... },
  searchFilters: { ... },
  registration: { ... }
}
```

**Use when:** You want to quickly inspect the entire state.

---

### 2. `window.getStoreState()`

**Function that returns the current store state.**

```javascript
window.getStoreState()
```

**Returns:** Same as `__STORE_STATE__` but as a function call.

**Use when:** You want to call it programmatically or in a script.

---

### 3. `window.inspectStore()`

**Pretty-prints the state with formatted console output.**

```javascript
window.inspectStore()
```

**Output:**
```
📦 Current Store State
{
  auth: {
    user: null,
    profile: null,
    isAuthenticated: false
  },
  petReports: {
    reports: [5 items]
  },
  ...
}
```

**Use when:** You want a nicely formatted view in the console.

---

## 🎯 Specific State Inspection

### Check Authentication Status

```javascript
// Is user logged in?
window.__STORE_STATE__.auth.isAuthenticated

// Get user profile
window.__STORE_STATE__.auth.profile

// Get user name
window.__STORE_STATE__.auth.profile?.name
```

### Check Pet Reports

```javascript
// Get all reports
window.__STORE_STATE__.petReports.reports

// Count reports
window.__STORE_STATE__.petReports.reports.length

// Get first report
window.__STORE_STATE__.petReports.reports[0]

// Filter lost pets
window.__STORE_STATE__.petReports.reports.filter(r => r.status === 'lost')

// Filter found pets
window.__STORE_STATE__.petReports.reports.filter(r => r.status === 'found')
```

### Check Search Filters

```javascript
// Get all filters
window.__STORE_STATE__.searchFilters.filters

// Get specific filter
window.__STORE_STATE__.searchFilters.filters.country
window.__STORE_STATE__.searchFilters.filters.includeLost
window.__STORE_STATE__.searchFilters.filters.searchMode
```

### Check Registration Form

```javascript
// Get form data
window.__STORE_STATE__.registration.formData

// Check if form is dirty
window.__STORE_STATE__.registration.isDirty

// Get specific field
window.__STORE_STATE__.registration.formData.email
```

---

## 🛠️ Advanced Inspection Techniques

### 1. Watch State Changes in Real-Time

```javascript
// Store reference to compare
let previousState = window.getStoreState();

// Check every 2 seconds
setInterval(() => {
  const currentState = window.getStoreState();
  if (JSON.stringify(currentState) !== JSON.stringify(previousState)) {
    console.log('🔄 State changed!');
    console.log('Previous:', previousState);
    console.log('Current:', currentState);
    previousState = currentState;
  }
}, 2000);
```

### 2. Deep Inspection with JSON

```javascript
// Pretty print with indentation
JSON.stringify(window.__STORE_STATE__, null, 2)

// Copy to clipboard (in most browsers)
copy(JSON.stringify(window.__STORE_STATE__, null, 2))
```

### 3. Search for Specific Values

```javascript
// Find all reports from India
window.__STORE_STATE__.petReports.reports
  .filter(r => r.country === 'India')

// Find reports by name
window.__STORE_STATE__.petReports.reports
  .filter(r => r.name.toLowerCase().includes('bella'))

// Count reports by status
const reports = window.__STORE_STATE__.petReports.reports;
const lost = reports.filter(r => r.status === 'lost').length;
const found = reports.filter(r => r.status === 'found').length;
console.log({ lost, found, total: reports.length });
```

### 4. Create Custom Inspection Functions

```javascript
// Add to console for quick access
window.showAuth = () => {
  const auth = window.__STORE_STATE__.auth;
  console.table({
    'Authenticated': auth.isAuthenticated,
    'User': auth.profile?.name || 'N/A',
    'Email': auth.profile?.email || 'N/A'
  });
};

// Call it
window.showAuth();
```

---

## 📊 Using Console Table for Better Visualization

### View All Reports as Table

```javascript
console.table(window.__STORE_STATE__.petReports.reports.map(r => ({
  ID: r.id,
  Name: r.name,
  Breed: r.breed,
  Status: r.status,
  Country: r.country,
  State: r.state
})));
```

### View Filters as Table

```javascript
console.table(window.__STORE_STATE__.searchFilters.filters);
```

---

## 🎨 Color-Coded Console Output

### Pretty Print with Colors

```javascript
const state = window.__STORE_STATE__;

console.log('%c🔐 Auth State', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
console.log(state.auth);

console.log('%c🐾 Pet Reports', 'color: #FF9800; font-weight: bold; font-size: 14px;');
console.log(state.petReports);

console.log('%c🔍 Search Filters', 'color: #2196F3; font-weight: bold; font-size: 14px;');
console.log(state.searchFilters);

console.log('%c📝 Registration', 'color: #9C27B0; font-weight: bold; font-size: 14px;');
console.log(state.registration);
```

---

## 🐛 Debugging Common Issues

### Check if Store is Initialized

```javascript
if (window.__STORE_STATE__) {
  console.log('✅ Store is initialized');
  window.inspectStore();
} else {
  console.log('❌ Store not found. Make sure you\'re in development mode.');
}
```

### Verify Reports are Loading

```javascript
const reports = window.__STORE_STATE__?.petReports?.reports;
if (reports && reports.length > 0) {
  console.log(`✅ ${reports.length} reports loaded`);
} else {
  console.log('⚠️ No reports found');
}
```

### Check localStorage Sync

```javascript
// Compare store with localStorage
const storeReports = window.__STORE_STATE__.petReports.reports;
const savedReports = JSON.parse(localStorage.getItem('pet_reports_v1') || '[]');

console.log('Store reports:', storeReports.length);
console.log('Saved reports:', savedReports.length);
console.log('Match:', storeReports.length === savedReports.length ? '✅' : '❌');
```

---

## 📱 React DevTools Integration

### Using React DevTools Extension

1. Install **React Developer Tools** browser extension
2. Open DevTools → **Components** tab
3. Find `StoreProvider` in component tree
4. Click on it to see props and state
5. Look for `value` prop to see current store state

### Using Profiler

1. Open DevTools → **Profiler** tab
2. Record interactions
3. See which components re-render when store changes
4. Identify performance issues

---

## 💡 Pro Tips

### Tip 1: Auto-Inspect on Page Load

Add to console:
```javascript
// Run this once, it will persist in the session
window.addEventListener('load', () => {
  setTimeout(() => {
    console.clear();
    window.inspectStore();
  }, 1000);
});
```

### Tip 2: Quick Report Counter

```javascript
window.reportStats = () => {
  const reports = window.__STORE_STATE__.petReports.reports;
  const stats = {
    total: reports.length,
    lost: reports.filter(r => r.status === 'lost').length,
    found: reports.filter(r => r.status === 'found').length,
    countries: [...new Set(reports.map(r => r.country))],
    recent: reports.slice(0, 3).map(r => r.name)
  };
  console.table(stats);
  return stats;
};
```

### Tip 3: Watch Specific Value

```javascript
window.watchAuth = () => {
  let lastAuth = window.__STORE_STATE__.auth.isAuthenticated;
  setInterval(() => {
    const currentAuth = window.__STORE_STATE__.auth.isAuthenticated;
    if (currentAuth !== lastAuth) {
      console.log(`🔄 Auth changed: ${lastAuth} → ${currentAuth}`);
      lastAuth = currentAuth;
    }
  }, 1000);
};
```

---

## ⚠️ Important Notes

### Development Only

- Store inspection is **only available in development mode**
- Production builds will NOT expose `window.__STORE_STATE__`
- This is for debugging purposes only

### Security

- Never expose sensitive data in production
- Store state may contain user information
- Don't share console output publicly

### Performance

- Frequent console logging can slow down the app
- Use sparingly in performance-critical sections
- Clear console regularly (Ctrl+L or Cmd+K)

---

## 🎓 Quick Reference Card

```javascript
// === BASIC INSPECTION ===
window.__STORE_STATE__              // View entire state
window.inspectStore()               // Pretty print state

// === AUTH ===
window.__STORE_STATE__.auth.isAuthenticated
window.__STORE_STATE__.auth.profile

// === REPORTS ===
window.__STORE_STATE__.petReports.reports
window.__STORE_STATE__.petReports.reports.length

// === FILTERS ===
window.__STORE_STATE__.searchFilters.filters

// === ADVANCED ===
console.table(window.__STORE_STATE__.petReports.reports)
JSON.stringify(window.__STORE_STATE__, null, 2)
```

---

## 📚 Additional Resources

- Redux DevTools Extension: https://github.com/reduxjs/redux-devtools
- React DevTools: https://react.dev/learn/react-developer-tools
- Chrome DevTools Docs: https://developer.chrome.com/docs/devtools/

---

## 🆘 Troubleshooting

### "window.__STORE_STATE__ is undefined"

**Solution:**
1. Make sure you're in development mode (`npm start`)
2. Refresh the page
3. Check that StoreProvider is mounted
4. Look for initialization message in console

### "Cannot read property of undefined"

**Solution:**
```javascript
// Use optional chaining
window.__STORE_STATE__?.auth?.profile?.name
```

### Store not updating in console

**Solution:**
```javascript
// Get fresh reference
window.getStoreState()
// Don't rely on old references
```

---

**Happy Debugging! 🎉**

For any issues or questions, check the store implementation in:
- `src/store/StoreContext.js`
- `src/store/reducer.js`
- `src/store/actions.js`

