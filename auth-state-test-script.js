// ═══════════════════════════════════════════════════════════
// GOOGLE AUTH STATE - QUICK TEST SCRIPT
// ═══════════════════════════════════════════════════════════
//
// HOW TO USE:
// 1. Login via Google in UserProfile component
// 2. Navigate to any page (including home)
// 3. Open browser console (F12)
// 4. Paste this entire script
// 5. Press Enter
//
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  console.clear();
  console.log('%c╔═══════════════════════════════════════════════╗', 'color: #4CAF50;');
  console.log('%c║  🔐 GOOGLE AUTH STATE VERIFICATION TEST      ║', 'color: #4CAF50; font-weight: bold;');
  console.log('%c╚═══════════════════════════════════════════════╝', 'color: #4CAF50;');

  // Check if store exists
  if (!window.__STORE_STATE__) {
    console.log('\n%c❌ ERROR: Store not found!', 'color: #f44336; font-weight: bold;');
    console.log('Make sure you\'re running in development mode (npm start)');
    console.log('\nPossible reasons:');
    console.log('1. App not fully loaded yet - wait a moment and try again');
    console.log('2. Not in development mode');
    console.log('3. StoreProvider not wrapping the app');
    return;
  }

  const auth = window.__STORE_STATE__.auth;
  const currentPage = window.location.pathname;

  // Debug: Check if state is actually an object
  if (!auth || typeof auth !== 'object') {
    console.log('\n%c❌ ERROR: Auth state is invalid!', 'color: #f44336; font-weight: bold;');
    console.log('Auth value:', auth);
    console.log('Type:', typeof auth);
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 1: Authentication Status
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c1️⃣  AUTHENTICATION STATUS', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  if (auth.isAuthenticated) {
    console.log('%c✅ USER IS LOGGED IN', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    console.log('\n✨ Auth state successfully retained!');
  } else {
    console.log('%c❌ USER IS NOT LOGGED IN', 'color: #f44336; font-weight: bold; font-size: 16px;');
    console.log('\n⚠️  Please login via Google first, then run this test again.');
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 2: User Profile Data
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c2️⃣  USER PROFILE DATA', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  console.table({
    'Name': auth.profile?.name || '❌ Missing',
    'Email': auth.profile?.email || '❌ Missing',
    'Picture URL': auth.profile?.picture ? '✅ Available' : '❌ Missing',
    'Access Token': auth.user?.access_token ? '✅ Available' : '❌ Missing'
  });

  if (auth.profile?.picture) {
    console.log('\n📸 Profile Picture:');
    console.log(auth.profile.picture);
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 3: localStorage Persistence
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c3️⃣  LOCALSTORAGE PERSISTENCE', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  try {
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      const matches = (
        parsed.isAuthenticated === auth.isAuthenticated &&
        parsed.profile?.email === auth.profile?.email
      );

      console.log('✅ Auth state saved in localStorage');
      console.table({
        'Saved': parsed.isAuthenticated ? '✅ Yes' : '❌ No',
        'User Name': parsed.profile?.name || 'N/A',
        'Matches Store': matches ? '✅ Yes' : '⚠️ Mismatch'
      });

      if (!matches) {
        console.warn('⚠️  Warning: localStorage and store don\'t match!');
      }
    } else {
      console.log('❌ No auth state in localStorage');
      console.log('⚠️  This might be an issue. Auth should be persisted.');
    }
  } catch (e) {
    console.error('❌ Error reading localStorage:', e.message);
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 4: Navigation Persistence
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c4️⃣  NAVIGATION PERSISTENCE', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  console.table({
    'Current Page': currentPage,
    'Auth Retained': auth.isAuthenticated ? '✅ Yes' : '❌ No',
    'Profile Available': auth.profile?.name ? '✅ Yes' : '❌ No'
  });

  if (currentPage === '/' || currentPage === '/home' || currentPage === '/real-estate-home') {
    console.log('\n🏠 You are on the HOME page');
    if (auth.isAuthenticated && auth.profile) {
      console.log('✅ Auth state should be visible in the header!');
      console.log('   Look for: "Welcome, ' + auth.profile.name + '!"');
    } else {
      console.log('⚠️  WARNING: You are on home but auth state shows not logged in!');
      console.log('\nPossible issues:');
      console.log('1. Navigate too quickly after login - state may not have persisted yet');
      console.log('2. Check if localStorage has auth_state:', !!localStorage.getItem('auth_state'));
      console.log('3. Try refreshing the page to reload from localStorage');
      console.log('\nTo debug:');
      console.log('• Go back to /login');
      console.log('• Login again');
      console.log('• Wait 2 seconds after login');
      console.log('• Then navigate to home');
    }
  } else {
    console.log('\n📄 Current page:', currentPage);
    console.log('✅ Auth state is available on this page too!');
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 5: UI State Check
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c5️⃣  EXPECTED UI STATE', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  if (auth.isAuthenticated && auth.profile) {
    console.log('\n✅ Header should display:');
    console.log('   • Profile picture (if available)');
    console.log('   • Welcome message: "Welcome, ' + auth.profile.name + '!"');
    console.log('   • "My Profile" button');
    console.log('\n❌ Header should NOT show:');
    console.log('   • "Sign In" link');
    console.log('   • "Join" button');
  } else {
    console.log('\n❌ Header should display:');
    console.log('   • "Sign In" link');
    console.log('   • "Join" button');
    console.log('\n✅ Header should NOT show:');
    console.log('   • Welcome message');
    console.log('   • Profile picture');
  }

  // ═══════════════════════════════════════════════════════════
  // TEST 6: Full Auth Object
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c6️⃣  FULL AUTH OBJECT', 'color: #2196F3; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  console.log('\nFull auth state object:');
  console.log(auth);

  // ═══════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c╔═══════════════════════════════════════════════╗', 'color: #4CAF50;');
  console.log('%c║            ✅ TEST RESULTS                    ║', 'color: #4CAF50; font-weight: bold;');
  console.log('%c╚═══════════════════════════════════════════════╝', 'color: #4CAF50;');

  const results = {
    authenticated: auth.isAuthenticated,
    hasProfile: !!auth.profile?.name,
    hasEmail: !!auth.profile?.email,
    hasPicture: !!auth.profile?.picture,
    hasToken: !!auth.user?.access_token,
    inLocalStorage: !!localStorage.getItem('auth_state'),
    onHomePage: currentPage === '/' || currentPage === '/home'
  };

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`\n${passed}/${total} checks passed (${percentage}%)`);
  console.table(results);

  if (percentage === 100) {
    console.log('\n%c🎉 PERFECT! Everything is working!', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    console.log('✅ Auth state is properly retained across navigation');
  } else if (percentage >= 80) {
    console.log('\n%c✅ GOOD! Most things working', 'color: #8BC34A; font-weight: bold; font-size: 16px;');
    console.log('⚠️  Some minor issues detected (see details above)');
  } else {
    console.log('\n%c⚠️  WARNING! Some issues detected', 'color: #FF9800; font-weight: bold; font-size: 16px;');
    console.log('Please check the details above');
  }

  // ═══════════════════════════════════════════════════════════
  // QUICK COMMANDS
  // ═══════════════════════════════════════════════════════════
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');
  console.log('%c⚡ QUICK COMMANDS', 'color: #FFC107; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ddd;');

  console.log('\nType these in console:');
  console.log('%cwindow.__STORE_STATE__.auth%c - View auth state', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.inspectStore()%c - View entire store', 'color: #FF9800; font-family: monospace;', '');
  console.log('%cwindow.__STORE_STATE__.auth.profile.name%c - Get user name', 'color: #FF9800; font-family: monospace;', '');

  console.log('\n%c╔═══════════════════════════════════════════════╗', 'color: #4CAF50;');
  console.log('%c║        ✅ VERIFICATION COMPLETE!              ║', 'color: #4CAF50; font-weight: bold;');
  console.log('%c╚═══════════════════════════════════════════════╝', 'color: #4CAF50;');

})();

