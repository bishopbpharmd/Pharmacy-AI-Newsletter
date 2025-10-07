/**
 * Auth0 Callback Handler
 * Handles the Auth0 redirect callback, stores user subscription data, and redirects to home
 */

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[auth-callback] Handling Auth0 callback...');
  
  try {
    // Check if we have Auth0 client available
    let auth0Client = null;
    if (window.auth0Client) {
      auth0Client = window.auth0Client;
    } else if (window.auth && window.auth.auth0Client) {
      auth0Client = window.auth.auth0Client;
    } else if (typeof window.createAuth0Client === 'function' && window.__AUTH0) {
      try {
        auth0Client = await window.createAuth0Client({
          domain: window.__AUTH0.domain,
          clientId: window.__AUTH0.clientId,
          cacheLocation: 'localstorage'
        });
        console.log('[auth-callback] Created Auth0 client on demand');
      } catch (createError) {
        console.error('[auth-callback] Could not create Auth0 client:', createError);
      }
    }

    if (!auth0Client) {
      console.error('[auth-callback] Auth0 client not available');
      redirectToHome();
      return;
    }

    // Handle the Auth0 redirect callback
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
      try {
        console.log('[auth-callback] Processing Auth0 redirect callback...');
        await auth0Client.handleRedirectCallback();
        
        // Get user information
        const user = await auth0Client.getUser();
        if (!user || !user.email) {
          console.error('[auth-callback] No user email available');
          redirectToHome();
          return;
        }

        console.log('[auth-callback] User authenticated:', user.email);
        
        // Check subscription status
        await checkAndStoreSubscriptionStatus(user.email);
        
      } catch (error) {
        console.error('[auth-callback] Error handling callback:', error);
        redirectToHome();
      } finally {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      // Not a callback, just redirect to home
      redirectToHome();
    }
    
  } catch (error) {
    console.error('[auth-callback] Unexpected error:', error);
    redirectToHome();
  }
});

/**
 * Check subscription status and store in localStorage
 */
async function checkAndStoreSubscriptionStatus(email) {
  console.log('[auth-callback] Checking subscription status for:', email);
  
  try {
    const response = await fetch('/.netlify/functions/check-subscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[auth-callback] Subscription data received:', data);

    // Validate email match to prevent mismatches
    if (data.exists && data.email_address && email.toLowerCase() !== data.email_address.toLowerCase()) {
      console.warn('[auth-callback] Email mismatch detected, treating as not subscribed');
      data.exists = false;
    }

    // Create user object with subscription data
    const userData = {
      email: email,
      subscribed: data.exists && data.status === 'subscribed',
      subscriptionData: data,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[auth-callback] User data stored in localStorage:', userData);

    // Redirect to home page
    redirectToHome();
    
  } catch (error) {
    console.error('[auth-callback] Error checking subscription:', error);
    
    // Store basic user data even if subscription check fails
    const userData = {
      email: email,
      subscribed: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    redirectToHome();
  }
}

/**
 * Redirect to home page
 */
function redirectToHome() {
  console.log('[auth-callback] Redirecting to home page...');
  window.location.href = '/';
}

/**
 * Utility function to get user data from localStorage
 */
function getUserData() {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('[auth-callback] Error reading user data from localStorage:', error);
    return null;
  }
}

// Make getUserData available globally for navbar use
window.getUserData = getUserData;
