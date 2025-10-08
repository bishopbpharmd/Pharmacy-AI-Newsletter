/**
 * Read Later Buttons JavaScript
 * 
 * Handles the functionality for all Read Later buttons on the page.
 * Implements optimistic updates with rollback on API failure.
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Read Later] Initializing Read Later buttons...');
  
  // Initialize all read-later buttons
  const readLaterButtons = document.querySelectorAll('.read-later-bookmark');
  
  console.log(`[Read Later] Found ${readLaterButtons.length} buttons`);
  
  // Wait for auth system to be ready, then show/hide buttons
  waitForAuthAndUpdateVisibility();
  
  // Set up click handlers for visible buttons
  readLaterButtons.forEach((button, index) => {
    console.log(`[Read Later] Setting up button ${index + 1}:`, button.dataset.articleId);
    
                button.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('[Read Later] Button clicked:', this.dataset.articleId);
                  
                  const articleId = this.dataset.articleId;
                  const currentSaved = this.dataset.saved === 'true';
                  const newSaved = !currentSaved;
                  
                  console.log(`[Read Later] Toggling ${articleId} from ${currentSaved} to ${newSaved}`);
                  
                  // Check authentication before proceeding
                  if (!window.auth || !window.auth.isAuthenticated()) {
                    console.log('[Read Later] User not authenticated, showing message');
                    showAuthenticationMessage();
                    return;
                  }
                  
                  // Store original state for potential rollback
                  const originalState = {
                    saved: currentSaved,
                    innerHTML: this.innerHTML,
                    classList: this.classList.toString()
                  };
                  
                  // Optimistic update - immediately update UI
                  updateButtonState(this, newSaved);
                  
                  // Call API and handle rollback on failure
                  handleApiCall(this, articleId, newSaved, originalState);
                });
  });
  
  console.log('[Read Later] Initialization complete');
  
  // Listen for auth state changes (login/logout)
  document.addEventListener('auth:stateChanged', updateButtonVisibility);
});

/**
 * Wait for auth system to be ready, then update button visibility
 */
async function waitForAuthAndUpdateVisibility() {
  console.log('[Read Later] Waiting for auth system to be ready...');
  console.log('[Read Later] Initial state - window.auth:', !!window.auth, 'window.auth0Client:', !!window.auth0Client);
  
  // Wait up to 5 seconds for auth system to initialize
  const maxWaitTime = 5000;
  const checkInterval = 100;
  let elapsed = 0;
  
  while (elapsed < maxWaitTime) {
    if (window.auth && typeof window.auth.isAuthenticated === 'function' && window.auth0Client) {
      console.log('[Read Later] Auth system is ready (including auth0Client), updating visibility...');
      await updateButtonVisibility();
      
      // Fetch saved articles and update button states
      await loadSavedArticlesAndUpdateButtons();
      return;
    }
    
    // Debug: Log what we're waiting for
    if (elapsed % 500 === 0) {
      console.log(`[Read Later] Still waiting... (${elapsed}ms) - auth: ${!!window.auth}, auth0Client: ${!!window.auth0Client}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    elapsed += checkInterval;
  }
  
  console.warn('[Read Later] Auth system not ready after 5 seconds, hiding all buttons');
  // Hide all buttons if auth system isn't ready
  const readLaterButtons = document.querySelectorAll('.read-later-bookmark');
  readLaterButtons.forEach(button => {
    button.style.display = 'none';
  });
}

/**
 * Load saved articles from server and update all button states
 */
async function loadSavedArticlesAndUpdateButtons() {
  console.log('[Read Later] Loading saved articles from server...');
  
  // Check if readLaterApi is available
  if (!window.readLaterApi || !window.readLaterApi.getSavedArticles) {
    console.warn('[Read Later] readLaterApi.getSavedArticles not available');
    return;
  }
  
  // Check if user is authenticated
  const isAuthenticated = window.auth ? window.auth.isAuthenticated() : false;
  if (!isAuthenticated) {
    console.log('[Read Later] User not authenticated, skipping saved articles fetch');
    return;
  }
  
  try {
    const savedArticleIds = await window.readLaterApi.getSavedArticles();
    
    if (savedArticleIds === null) {
      console.log('[Read Later] No saved articles returned (API error or not authenticated)');
      return;
    }
    
    // Handle empty array (user has no saved articles)
    if (savedArticleIds.length === 0) {
      console.log('[Read Later] User has no saved articles');
      return; // All buttons remain in unsaved state
    }
    
    console.log(`[Read Later] Loaded ${savedArticleIds.length} saved articles:`, savedArticleIds);
    
    // Update all buttons on the page
    const readLaterButtons = document.querySelectorAll('.read-later-bookmark');
    let updatedCount = 0;
    
    readLaterButtons.forEach(button => {
      const articleId = button.dataset.articleId;
      const isSaved = savedArticleIds.includes(articleId);
      
      if (isSaved) {
        updateButtonState(button, true);
        updatedCount++;
      }
    });
    
    console.log(`[Read Later] Updated ${updatedCount} buttons to saved state`);
    
  } catch (error) {
    console.error('[Read Later] Error loading saved articles:', error);
  }
}

/**
 * Show user-friendly message when not authenticated
 */
function showAuthenticationMessage() {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-size: 14px;
    max-width: 300px;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  `;
  
  notification.textContent = 'Please log in to save articles to your reading list';
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

/**
 * Show/hide save buttons based on authentication status
 */
function updateButtonVisibility() {
  const readLaterButtons = document.querySelectorAll('.read-later-bookmark');
  
  try {
    // Check if user is authenticated using the existing auth system
    const isAuthenticated = window.auth ? window.auth.isAuthenticated() : false;
    
    console.log('[Read Later] Auth system available:', !!window.auth);
    console.log('[Read Later] User authenticated:', isAuthenticated);
    
    readLaterButtons.forEach(button => {
      if (isAuthenticated) {
        button.style.display = 'flex'; // Show button
      } else {
        button.style.display = 'none'; // Hide button
      }
    });
    
    console.log(`[Read Later] Updated visibility for ${readLaterButtons.length} buttons. Authenticated: ${isAuthenticated}`);
  } catch (error) {
    console.error('[Read Later] Error checking authentication status:', error);
    // Hide all buttons on error
    readLaterButtons.forEach(button => {
      button.style.display = 'none';
    });
  }
}


/**
 * Update button visual state
 * @param {HTMLElement} button - The button element
 * @param {boolean} isSaved - The new saved state
 */
function updateButtonState(button, isSaved) {
  // Update data attributes
  button.dataset.saved = isSaved.toString();
  button.setAttribute('aria-pressed', isSaved.toString());
  button.setAttribute('aria-label', isSaved ? 'Remove from reading list' : 'Save to reading list');
  
  // Update visual state
  if (isSaved) {
    // Show saved state: filled bookmark
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
    `;
    button.classList.add('saved');
  } else {
    // Show default state: outline bookmark
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    `;
    button.classList.remove('saved');
  }
}

/**
 * Handle API call with rollback on failure
 * @param {HTMLElement} button - The button element
 * @param {string} articleId - The article ID
 * @param {boolean} newSaved - The new saved state
 * @param {Object} originalState - The original button state for rollback
 */
async function handleApiCall(button, articleId, newSaved, originalState) {
  try {
    // Check if API is available
    if (!window.readLaterApi) {
      console.warn('[Read Later] API not available, keeping optimistic state');
      return;
    }

    // Call appropriate API method
    let success;
    if (newSaved) {
      success = await window.readLaterApi.saveArticle(articleId);
    } else {
      success = await window.readLaterApi.unsaveArticle(articleId);
    }

    if (!success) {
      throw new Error('API call failed');
    }

    console.log(`[Read Later] API call successful for ${articleId}`);
    
    // Fire success event
    const event = new CustomEvent('readlater:success', {
      detail: { articleId, saved: newSaved },
      bubbles: true
    });
    button.dispatchEvent(event);

  } catch (error) {
    console.error(`[Read Later] API call failed for ${articleId}:`, error);
    
    // Rollback to original state
    rollbackButtonState(button, originalState);
    
    // Fire error event
    const event = new CustomEvent('readlater:error', {
      detail: { articleId, error: error.message },
      bubbles: true
    });
    button.dispatchEvent(event);
  }
}

/**
 * Rollback button to original state
 * @param {HTMLElement} button - The button element
 * @param {Object} originalState - The original state to restore
 */
function rollbackButtonState(button, originalState) {
  console.log(`[Read Later] Rolling back button state for ${button.dataset.articleId}`);
  
  // Restore data attributes
  button.dataset.saved = originalState.saved.toString();
  button.setAttribute('aria-pressed', originalState.saved.toString());
  button.setAttribute('aria-label', originalState.saved ? 'Remove from reading list' : 'Save to reading list');
  
  // Restore visual state
  button.innerHTML = originalState.innerHTML;
  button.className = originalState.classList;
}
