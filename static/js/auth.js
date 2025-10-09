/* Auth0 SPA Login Controller for Hugo
 * Focus: login/logout, session state, UI sync
 * Requires: auth0-spa-js (loaded via CDN) and window.__AUTH0 populated
 */
console.log("[auth] Script loaded and starting...");
(() => {
  // --- Safety checks --------------------------------------------------------
  const waitFor = (cond, timeout = 8000, interval = 50) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        if (cond()) return resolve();
        if (Date.now() - start > timeout) return reject(new Error("Timeout waiting for condition"));
        setTimeout(tick, interval);
      };
      tick();
    });

  // --- Config ---------------------------------------------------------------
  const CFG = (() => {
    const src = (window && window.__AUTH0) || {};
    if (!src.domain || !src.clientId) {
      console.error("[auth] Missing window.__AUTH0 { domain, clientId }");
    }
    return {
      domain: src.domain || "",
      clientId: src.clientId || "",
      audience: src.audience || "",
      cacheLocation: "localstorage",
      refreshIntervalSec: 60 * 10, // try refresh every 10 minutes
    };
  })();

  // --- State & subscribers --------------------------------------------------
  let auth0Client = null;
  let _isAuthenticated = false;
  let _user = null;
  const subscribers = new Set();
  const notify = () => subscribers.forEach((cb) => {
    try { cb(getPublicState()); } catch (e) { console.warn("[auth] subscriber error", e); }
  });

  const getPublicState = () => ({
    isAuthenticated: _isAuthenticated,
    user: _user,
  });

  // --- UI helpers -----------------------------------------------------
  function updateUI() {
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const profileLi = document.getElementById("profileLi");
    const logoutLi = document.getElementById("logoutLi");
    const mobileAuthContainer = document.getElementById("mobileAuthContainer");
    const authLi = loginBtn ? loginBtn.closest('li') : null;

    // Check if we're on mobile (screen width <= 768px)
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // Desktop: Update desktop buttons - hide/show the <li> elements to control spacing
      if (authLi) authLi.style.display = _isAuthenticated ? "none" : "inline-block";
      if (profileLi) profileLi.style.display = _isAuthenticated ? "inline-block" : "none";
      if (logoutLi) logoutLi.style.display = _isAuthenticated ? "inline-block" : "none";
    } else {
      // Mobile: Let CSS handle the display, just ensure they're hidden
      if (authLi) authLi.style.display = "none";
      if (profileLi) profileLi.style.display = "none";
      if (logoutLi) logoutLi.style.display = "none";
    }
    
    // Update mobile buttons (always in hamburger menu)
    if (mobileLoginBtn) mobileLoginBtn.style.display = _isAuthenticated ? "none" : "block";
    if (mobileAuthContainer) mobileAuthContainer.style.display = _isAuthenticated ? "block" : "none";
  }

  // --- Core auth actions ----------------------------------------------------
  async function init() {
    try {
      console.log("[auth] Initializing...");
      
      // Debug: Check what's available
      console.log("[auth] Available globals:", {
        createAuth0Client: typeof createAuth0Client,
        windowAuth0: typeof window.auth0,
        windowAuth0Create: typeof window.auth0?.createAuth0Client,
        windowAuth0Config: !!window.__AUTH0,
        config: window.__AUTH0
      });
      
      // Wait for Auth0 SDK to load with longer timeout
      await waitFor(() => {
        if (typeof createAuth0Client === "function") return true;
        if (window.auth0 && typeof window.auth0.createAuth0Client === "function") {
          window.createAuth0Client = window.auth0.createAuth0Client;
          return true;
        }
        return false;
      }, 15000, 100);
      console.log("[auth] Auth0 SDK loaded");
      
      // Wait for config
      await waitFor(() => window.__AUTH0 && window.__AUTH0.domain && window.__AUTH0.clientId);
      console.log("[auth] Config loaded:", window.__AUTH0);

    // Create Auth0 client with callback URI
    const callbackUri = `${window.location.origin}/callback`;
    console.log("[auth] Creating Auth0 client with config:", {
      domain: CFG.domain,
      clientId: CFG.clientId,
      cacheLocation: CFG.cacheLocation,
      redirect_uri: callbackUri
    });
    
    auth0Client = await createAuth0Client({
      domain: CFG.domain,
      clientId: CFG.clientId,
      cacheLocation: CFG.cacheLocation,
      authorizationParams: {
        redirect_uri: callbackUri,
        audience: CFG.audience
      }
    });
      console.log("[auth] Auth0 client created successfully");
      
      // Expose auth0Client globally AFTER it's created
      window.auth0Client = auth0Client;
      console.log("[auth] Exposed window.auth0Client globally");

    // Note: Auth0 redirect handling is now done in /callback page

    await refreshState();
    wireButtons();
    scheduleSilentRefresh();
    notify();
    
    // Add resize listener to handle screen size changes
    window.addEventListener('resize', () => {
      updateUI();
    });
    
    console.log("[auth] Initialization complete");
    } catch (error) {
      console.error("[auth] Initialization failed:", error);
      // Show login button as fallback
      updateUI();
    }
  }

  async function refreshState() {
    try {
      const wasAuthenticated = _isAuthenticated;
      _isAuthenticated = await auth0Client.isAuthenticated();
      _user = _isAuthenticated ? await auth0Client.getUser() : null;
      console.log("[auth] State refreshed:", { isAuthenticated: _isAuthenticated, user: _user?.email });
      
      // Clear localStorage if user is not authenticated
      if (!_isAuthenticated) {
        const existingUser = localStorage.getItem('user');
        if (existingUser) {
          console.log("[auth] User not authenticated, clearing localStorage");
          localStorage.removeItem('user');
          // Update navbar to show subscribe button
          if (typeof updateNavbarSubscriptionButton === 'function') {
            updateNavbarSubscriptionButton();
          }
        }
      }
      
      // Fire auth state change event if authentication status changed
      if (wasAuthenticated !== _isAuthenticated) {
        console.log("[auth] Authentication status changed, firing event");
        document.dispatchEvent(new CustomEvent('auth:stateChanged', {
          detail: { isAuthenticated: _isAuthenticated, user: _user }
        }));
      }
    } catch (err) {
      console.warn("[auth] refreshState error:", err);
      _isAuthenticated = false;
      _user = null;
      
      // Clear localStorage on error
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        console.log("[auth] Auth error, clearing localStorage");
        localStorage.removeItem('user');
        // Update navbar to show subscribe button
        if (typeof updateNavbarSubscriptionButton === 'function') {
          updateNavbarSubscriptionButton();
        }
      }
    } finally {
      updateUI();
    }
  }

  async function login(options = {}) {
    try {
      console.log("[auth] Starting login...");
      
      // Clear any existing user data when starting new login
      localStorage.removeItem('user');
      console.log("[auth] Cleared existing user data for new login");
      
      if (!auth0Client) {
        console.error("[auth] Auth0 client not initialized!");
        alert("Authentication system is not ready. Please refresh the page and try again.");
        return;
      }
      
      const loginRedirectUri = window.location.origin;
      console.log("[auth] Login redirect URI:", loginRedirectUri);
      
      // Check if we're on the check-subscriber page and should return here
      const isOnCheckSubscriber = window.location.pathname.includes('check-subscriber');
      console.log("[auth] Currently on check-subscriber page:", isOnCheckSubscriber);
      
      // Always redirect to callback page for consistent flow
      const callbackUri = `${window.location.origin}/callback`;
      console.log("[auth] Redirecting to callback page:", callbackUri);
      
      const authParams = {
        redirect_uri: callbackUri,
        ...options.authorizationParams,
      };
      
      console.log("[auth] Auth parameters:", authParams);
      
      await auth0Client.loginWithRedirect({
        authorizationParams: authParams,
      });
    } catch (err) {
      console.error("[auth] login error:", err);
      alert("Login failed: " + err.message + ". Please try again.");
    }
  }

  function logout() {
    try {
      console.log("[auth] Starting logout...");
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      console.log("[auth] Cleared user data from localStorage");
      
      // Update navbar to show subscribe button
      if (typeof updateNavbarSubscriptionButton === 'function') {
        updateNavbarSubscriptionButton();
      }
      
      auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (err) {
      console.error("[auth] logout error:", err);
    }
  }

  // Periodic silent refresh to keep session alive
  function scheduleSilentRefresh() {
    const jitter = Math.floor(Math.random() * 30);
    const every = (CFG.refreshIntervalSec + jitter) * 1000;
    setInterval(async () => {
      try {
        await auth0Client.getTokenSilently();
        await refreshState();
        notify();
      } catch (err) {
        console.warn("[auth] silent refresh failed:", err?.error || err);
      }
    }, every);
  }

              // Wire UI buttons
              function wireButtons() {
                console.log("[auth] Starting to wire buttons...");
                const loginBtn = document.getElementById("loginBtn");
                const mobileLoginBtn = document.getElementById("mobileLoginBtn");
                const profileBtn = document.getElementById("profileBtn");
                const mobileSavedBtn = document.getElementById("mobileSavedBtn");
                const logoutBtn = document.getElementById("logoutBtn");
                const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
                
                console.log("[auth] Button elements found:", {
                  loginBtn: loginBtn,
                  mobileLoginBtn: mobileLoginBtn,
                  profileBtn: profileBtn,
                  mobileSavedBtn: mobileSavedBtn,
                  logoutBtn: logoutBtn,
                  mobileLogoutBtn: mobileLogoutBtn
                });
                
                if (loginBtn) {
                  console.log("[auth] Adding click listener to login button");
                  loginBtn.addEventListener("click", (e) => {
                    console.log("[auth] Desktop login clicked");
                    e.preventDefault();
                    e.stopPropagation();
                    login();
                  });
                } else {
                  console.error("[auth] Login button not found!");
                }
                
                if (mobileLoginBtn) {
                  mobileLoginBtn.addEventListener("click", (e) => {
                    console.log("[auth] Mobile login clicked");
                    e.preventDefault();
                    e.stopPropagation();
                    login();
                    if (typeof closeMobileMenu === 'function') {
                      closeMobileMenu();
                    }
                  });
                }
                
                if (profileBtn) {
                  profileBtn.addEventListener("click", (e) => {
                    console.log("[auth] Desktop profile clicked - navigating to check-subscriber page");
                    // Let the default navigation happen - don't prevent it
                  });
                }
                
                if (mobileSavedBtn) {
                  mobileSavedBtn.addEventListener("click", (e) => {
                    console.log("[auth] Mobile saved clicked - navigating to saved page");
                    // Close mobile menu first, then let navigation happen
                    if (typeof closeMobileMenu === 'function') {
                      closeMobileMenu();
                    }
                    // Don't prevent default - let the link navigate
                  });
                }
                
                if (logoutBtn) {
                  logoutBtn.addEventListener("click", (e) => {
                    console.log("[auth] Desktop logout clicked");
                    e.preventDefault();
                    e.stopPropagation();
                    logout();
                  });
                }
                
                if (mobileLogoutBtn) {
                  mobileLogoutBtn.addEventListener("click", (e) => {
                    console.log("[auth] Mobile logout clicked");
                    e.preventDefault();
                    e.stopPropagation();
                    logout();
                    if (typeof closeMobileMenu === 'function') {
                      closeMobileMenu();
                    }
                  });
                }
              }

  // --- Public API on window.auth -------------------------------------------
  const api = {
    // state
    isReady: () => !!auth0Client,
    isAuthenticated: () => _isAuthenticated,
    getUser: () => _user,

    // actions
    login,
    logout,

    // subscription
    onChange: (cb) => {
      if (typeof cb === "function") subscribers.add(cb);
      return () => subscribers.delete(cb);
    },

    // force check
    refresh: async () => { await refreshState(); notify(); },
  };

  // Expose and boot
  window.auth = api;
  
  // Note: window.auth0Client is exposed inside init() after client is created
  
  // Also expose legacy functions for backward compatibility
  window.login = login;
  window.logout = logout;
  
  // Wire buttons immediately as a fallback
  function wireButtonsImmediately() {
    console.log("[auth] Wiring buttons immediately as fallback...");
    console.log("[auth] Checking if login button exists:", document.getElementById("loginBtn"));
    wireButtons();
  }
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("[auth] DOM loaded, starting initialization...");
      wireButtonsImmediately(); // Wire buttons immediately
      init(); // Then initialize Auth0
    });
  } else {
    console.log("[auth] DOM already loaded, starting initialization...");
    wireButtonsImmediately(); // Wire buttons immediately
    init(); // Then initialize Auth0
  }
})();