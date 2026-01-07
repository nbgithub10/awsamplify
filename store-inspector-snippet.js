// ====================================
// Store Inspector - Chrome Snippet
// ====================================
//
// HOW TO USE:
// 1. Open Chrome DevTools (F12)
// 2. Go to "Sources" tab
// 3. Click "Snippets" (left sidebar)
// 4. Click "+ New snippet"
// 5. Paste this code
// 6. Right-click → "Run"
//
// Or just paste this directly into console!
// ====================================

(function() {
  'use strict';

  console.log('%c🔍 Store Inspector Loaded', 'color: #4CAF50; font-size: 18px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  // Check if store exists
  if (!window.__STORE_STATE__) {
    console.log('%c❌ Store not found!', 'color: #f44336; font-weight: bold;');
    console.log('Make sure you\'re running in development mode (npm start)');
    return;
  }

  const state = window.__STORE_STATE__;

  // ===================
  // 1. SUMMARY
  // ===================
  console.log('\n%c📊 Store Summary', 'color: #2196F3; font-size: 16px; font-weight: bold;');
  console.table({
    'Total Reports': state.petReports.reports.length,
    'Lost Pets': state.petReports.reports.filter(r => r.status === 'lost').length,
    'Found Pets': state.petReports.reports.filter(r => r.status === 'found').length,
    'Authenticated': state.auth.isAuthenticated ? '✅' : '❌',
    'User': state.auth.profile?.name || 'N/A',
    'Current Country': state.searchFilters.filters.country,
    'Form Dirty': state.registration.isDirty ? '✅' : '❌'
  });

  // ===================
  // 2. AUTH STATE
  // ===================
  console.log('\n%c🔐 Authentication', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
  if (state.auth.isAuthenticated) {
    console.log('✅ User is logged in');
    console.table({
      Name: state.auth.profile?.name || 'N/A',
      Email: state.auth.profile?.email || 'N/A',
      Picture: state.auth.profile?.picture ? '✅' : '❌'
    });
  } else {
    console.log('❌ No user logged in');
  }

  // ===================
  // 3. PET REPORTS
  // ===================
  console.log('\n%c🐾 Pet Reports', 'color: #FF9800; font-size: 14px; font-weight: bold;');

  const reports = state.petReports.reports;
  if (reports.length === 0) {
    console.log('No reports available');
  } else {
    // Summary by status
    const byStatus = {
      lost: reports.filter(r => r.status === 'lost').length,
      found: reports.filter(r => r.status === 'found').length
    };
    console.log(`Total: ${reports.length} (${byStatus.lost} lost, ${byStatus.found} found)`);

    // Summary by country
    const byCountry = reports.reduce((acc, r) => {
      acc[r.country] = (acc[r.country] || 0) + 1;
      return acc;
    }, {});
    console.log('By Country:', byCountry);

    // Recent reports (last 3)
    console.log('\nMost Recent Reports:');
    console.table(reports.slice(0, 3).map(r => ({
      ID: r.id,
      Name: r.name || 'Unnamed',
      Breed: r.breed,
      Status: r.status,
      Location: `${r.suburb}, ${r.state}`,
      Date: new Date(r.createdAt).toLocaleDateString()
    })));
  }

  // ===================
  // 4. SEARCH FILTERS
  // ===================
  console.log('\n%c🔍 Search Filters', 'color: #9C27B0; font-size: 14px; font-weight: bold;');
  console.table(state.searchFilters.filters);

  // ===================
  // 5. REGISTRATION
  // ===================
  console.log('\n%c📝 Registration Form', 'color: #FF5722; font-size: 14px; font-weight: bold;');
  const formData = state.registration.formData;
  const hasData = formData.fullName || formData.email || formData.phone;

  if (hasData) {
    console.log('Form has data:', state.registration.isDirty ? '✅ (modified)' : '✅');
    console.table({
      'Full Name': formData.fullName || 'N/A',
      'Email': formData.email || 'N/A',
      'Phone': formData.phone || 'N/A',
      'Country': formData.country || 'N/A',
      'User Type': formData.userType || 'N/A'
    });
  } else {
    console.log('Form is empty');
  }

  // ===================
  // 6. LOCALSTORAGE SYNC
  // ===================
  console.log('\n%c💾 LocalStorage Sync', 'color: #00BCD4; font-size: 14px; font-weight: bold;');

  try {
    const savedReports = JSON.parse(localStorage.getItem('pet_reports_v1') || '[]');
    const savedAuth = JSON.parse(localStorage.getItem('auth_state') || 'null');

    console.table({
      'Store Reports': state.petReports.reports.length,
      'Saved Reports': savedReports.length,
      'Sync Status': savedReports.length === state.petReports.reports.length ? '✅ Synced' : '⚠️ Out of sync',
      'Auth Saved': savedAuth ? '✅' : '❌'
    });
  } catch (e) {
    console.log('Error reading localStorage:', e.message);
  }

  // ===================
  // 7. QUICK COMMANDS
  // ===================
  console.log('\n%c⚡ Quick Commands', 'color: #FFC107; font-size: 14px; font-weight: bold;');
  console.log('%cwindow.inspectStore()%c - View entire state', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.__STORE_STATE__%c - Access state object', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.getStoreState()%c - Get current state', 'color: #FF9800; font-family: monospace;', '');

  // ===================
  // 8. CUSTOM HELPERS
  // ===================

  // Add helper functions
  window.storeHelpers = {
    // Get lost pets
    getLostPets: () => state.petReports.reports.filter(r => r.status === 'lost'),

    // Get found pets
    getFoundPets: () => state.petReports.reports.filter(r => r.status === 'found'),

    // Search pets by name
    findPetByName: (name) => state.petReports.reports.filter(r =>
      r.name && r.name.toLowerCase().includes(name.toLowerCase())
    ),

    // Get pets by country
    getPetsByCountry: (country) => state.petReports.reports.filter(r =>
      r.country === country
    ),

    // Export to JSON
    exportState: () => {
      const json = JSON.stringify(state, null, 2);
      console.log(json);
      copy(json);
      console.log('✅ State copied to clipboard!');
    },

    // Compare with localStorage
    compareWithStorage: () => {
      const storeReports = state.petReports.reports;
      const savedReports = JSON.parse(localStorage.getItem('pet_reports_v1') || '[]');

      console.log('Store:', storeReports.length, 'reports');
      console.log('Storage:', savedReports.length, 'reports');
      console.log('Match:', storeReports.length === savedReports.length ? '✅' : '❌');

      if (storeReports.length !== savedReports.length) {
        console.log('Difference:', Math.abs(storeReports.length - savedReports.length), 'reports');
      }
    }
  };

  console.log('\n%c🎁 Helper Functions Added!', 'color: #E91E63; font-size: 14px; font-weight: bold;');
  console.log('%cwindow.storeHelpers.getLostPets()%c - Get all lost pets', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.storeHelpers.getFoundPets()%c - Get all found pets', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.storeHelpers.findPetByName("bella")%c - Search by name', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.storeHelpers.getPetsByCountry("India")%c - Get pets by country', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.storeHelpers.exportState()%c - Export & copy to clipboard', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.storeHelpers.compareWithStorage()%c - Compare with localStorage', 'color: #FF9800; font-family: monospace;', '');

  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c✅ Store inspection complete!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');

})();

