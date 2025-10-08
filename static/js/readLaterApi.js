/**
 * Read Later API Helper
 * 
 * Handles API calls to the Netlify function for saving/unsaving articles.
 * Provides clean interface for ReadLaterButton to use.
 */

/**
 * Get the current user's Auth0 access token
 * Uses Auth0 SPA SDK getTokenSilently for reliable token retrieval
 * @returns {Promise<string|null>} - JWT token or null if not authenticated
 */
async function getAuthToken() {
  try {
    console.log('[readLaterApi] Attempting to get Auth0 token...');
    
    // Check if Auth0 client is available
    if (!window.auth0Client) {
      console.warn('[readLaterApi] Auth0 client not available');
      return null;
    }

    // Check if user is authenticated using Auth0 client directly
    const isAuthenticated = await window.auth0Client.isAuthenticated();
    if (!isAuthenticated) {
      console.log('[readLaterApi] User not authenticated - no token available');
      return null;
    }

    console.log('[readLaterApi] User authenticated, fetching token...');
    
    // Get the access token using Auth0 SPA SDK
    const token = await window.auth0Client.getTokenSilently();
    
    if (!token) {
      console.warn('[readLaterApi] No token returned from Auth0');
      return null;
    }
    
    console.log('[readLaterApi] Successfully obtained Auth0 token');
    return token;
    
  } catch (error) {
    console.error('[readLaterApi] Failed to get auth token:', error);
    
    // Log specific error types for debugging
    if (error.error === 'login_required') {
      console.log('[readLaterApi] Login required - user needs to authenticate');
    } else if (error.error === 'consent_required') {
      console.log('[readLaterApi] Consent required - user needs to grant permissions');
    } else if (error.error === 'interaction_required') {
      console.log('[readLaterApi] Interaction required - user needs to complete authentication');
    }
    
    return null;
  }
}

/**
 * Save an article to the user's reading list
 * @param {string} articleId - The unique ID of the article
 * @returns {Promise<boolean>} - True if successful, false if failed
 */
async function saveArticle(articleId) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    console.log(`[readLaterApi] Saving article: ${articleId}`);

    const response = await fetch('/.netlify/functions/saved-articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ articleId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log(`[readLaterApi] Article ${articleId} saved successfully`);
    return true;

  } catch (error) {
    console.error(`[readLaterApi] Failed to save article ${articleId}:`, error);
    return false;
  }
}

/**
 * Unsave an article from the user's reading list
 * @param {string} articleId - The unique ID of the article
 * @returns {Promise<boolean>} - True if successful, false if failed
 */
async function unsaveArticle(articleId) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    console.log(`[readLaterApi] Unsaving article: ${articleId}`);

    const response = await fetch('/.netlify/functions/saved-articles', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ articleId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log(`[readLaterApi] Article ${articleId} unsaved successfully`);
    return true;

  } catch (error) {
    console.error(`[readLaterApi] Failed to unsave article ${articleId}:`, error);
    return false;
  }
}

/**
 * Get all saved articles for the current user
 * @returns {Promise<string[]|null>} - Array of article IDs or null if failed
 */
async function getSavedArticles() {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log('[readLaterApi] No token available for getSavedArticles');
      return null;
    }

    console.log('[readLaterApi] Fetching all saved articles...');
    
    const response = await fetch('/.netlify/functions/saved-articles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log(`[readLaterApi] Fetched ${result.articleIds?.length || 0} saved articles`);
    return result.articleIds || [];

  } catch (error) {
    console.error('[readLaterApi] Failed to fetch saved articles:', error);
    return null;
  }
}

// Export the API functions
window.readLaterApi = {
  saveArticle,
  unsaveArticle,
  getSavedArticles
};

console.log('[readLaterApi] API helper loaded');
