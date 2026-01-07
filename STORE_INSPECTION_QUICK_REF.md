# 🔍 Store Inspection - Quick Reference Card

Copy this card and keep it handy for quick reference!

---

## 📦 View Entire State

```javascript
window.__STORE_STATE__       // Direct access
window.getStoreState()       // Function call  
window.inspectStore()        // Pretty print with emoji
```

---

## 🔐 Authentication

```javascript
// Check if logged in
window.__STORE_STATE__.auth.isAuthenticated

// Get user name
window.__STORE_STATE__.auth.profile?.name

// Get user email
window.__STORE_STATE__.auth.profile?.email

// Get entire auth state
window.__STORE_STATE__.auth
```

---

## 🐾 Pet Reports

```javascript
// Get all reports
window.__STORE_STATE__.petReports.reports

// Count total reports
window.__STORE_STATE__.petReports.reports.length

// Get lost pets only
window.__STORE_STATE__.petReports.reports.filter(r => r.status === 'lost')

// Get found pets only
window.__STORE_STATE__.petReports.reports.filter(r => r.status === 'found')

// Find by name
window.__STORE_STATE__.petReports.reports.filter(r => 
  r.name.toLowerCase().includes('bella')
)

// Find by country
window.__STORE_STATE__.petReports.reports.filter(r => r.country === 'India')

// Get first report
window.__STORE_STATE__.petReports.reports[0]
```

---

## 🔍 Search Filters

```javascript
// Get all filters
window.__STORE_STATE__.searchFilters.filters

// Get specific filter
window.__STORE_STATE__.searchFilters.filters.country
window.__STORE_STATE__.searchFilters.filters.state
window.__STORE_STATE__.searchFilters.filters.postcode
window.__STORE_STATE__.searchFilters.filters.includeLost
window.__STORE_STATE__.searchFilters.filters.includeFound
window.__STORE_STATE__.searchFilters.filters.searchMode
```

---

## 📝 Registration Form

```javascript
// Get form data
window.__STORE_STATE__.registration.formData

// Check if form is modified
window.__STORE_STATE__.registration.isDirty

// Get specific fields
window.__STORE_STATE__.registration.formData.fullName
window.__STORE_STATE__.registration.formData.email
window.__STORE_STATE__.registration.formData.phone
```

---

## 📊 Pretty Formatting

```javascript
// View as table
console.table(window.__STORE_STATE__.petReports.reports)

// View as JSON
JSON.stringify(window.__STORE_STATE__, null, 2)

// Copy to clipboard
copy(JSON.stringify(window.__STORE_STATE__, null, 2))
```

---

## 📈 Statistics

```javascript
// Count by status
const reports = window.__STORE_STATE__.petReports.reports;
const lost = reports.filter(r => r.status === 'lost').length;
const found = reports.filter(r => r.status === 'found').length;
console.log({ total: reports.length, lost, found });

// Group by country
reports.reduce((acc, r) => {
  acc[r.country] = (acc[r.country] || 0) + 1;
  return acc;
}, {})

// List unique countries
[...new Set(reports.map(r => r.country))]
```

---

## 🔄 Watch Changes

```javascript
// Watch for any state change
let lastState = JSON.stringify(window.getStoreState());
setInterval(() => {
  const currentState = JSON.stringify(window.getStoreState());
  if (currentState !== lastState) {
    console.log('🔄 State changed!');
    window.inspectStore();
    lastState = currentState;
  }
}, 2000);
```

---

## 💾 localStorage Sync

```javascript
// Compare with localStorage
const storeReports = window.__STORE_STATE__.petReports.reports;
const savedReports = JSON.parse(localStorage.getItem('pet_reports_v1') || '[]');
console.log('Store:', storeReports.length);
console.log('Saved:', savedReports.length);
console.log('Match:', storeReports.length === savedReports.length);
```

---

## 🎨 Custom Helpers (After Running Snippet)

```javascript
// After pasting store-inspector-snippet.js:

window.storeHelpers.getLostPets()
window.storeHelpers.getFoundPets()
window.storeHelpers.findPetByName("bella")
window.storeHelpers.getPetsByCountry("India")
window.storeHelpers.exportState()
window.storeHelpers.compareWithStorage()
```

---

## 🐛 Debug Common Issues

```javascript
// Check if store exists
if (window.__STORE_STATE__) {
  console.log('✅ Store initialized');
} else {
  console.log('❌ Store not found');
}

// Verify reports loaded
const reports = window.__STORE_STATE__?.petReports?.reports;
if (reports?.length > 0) {
  console.log(`✅ ${reports.length} reports loaded`);
} else {
  console.log('⚠️ No reports');
}
```

---

## 📱 Save as Chrome Snippet

1. Open DevTools (F12)
2. Go to **Sources** tab
3. Click **Snippets** (left sidebar)
4. Click **+ New snippet**
5. Paste commands you use often
6. Right-click → **Run**

---

## 💡 Pro Tips

```javascript
// Export to file
copy(JSON.stringify(window.__STORE_STATE__, null, 2))

// Search in JSON
JSON.stringify(window.__STORE_STATE__)
  .includes('search_term')

// Deep clone state (for comparison)
const snapshot = JSON.parse(
  JSON.stringify(window.getStoreState())
)
```

---

## ⚠️ Remember

- ✅ Only works in **development mode** (`npm start`)
- ❌ NOT available in production builds
- 🔄 State updates automatically
- 🔒 Secure - never exposed in production

---

## 📚 Full Documentation

- **STORE_INSPECTION_GUIDE.md** - Complete reference
- **store-inspector-snippet.js** - Advanced tool
- **STORE_INSPECTION_SUMMARY.md** - Quick guide

---

**Print this card or save it for quick reference! 📋✨**

