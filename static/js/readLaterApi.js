/**
 * Read Later API Helper
 * 
 * Handles API calls to the Netlify function for saving/unsaving articles.
 * Provides clean interface for ReadLaterButton to use.
 */

/**
 * Get the current user's Auth0 access token
 * @returns {Promise<string|null>} - Access token or null if not authenticated
 */
async function getAuthToken() {
  try {
    // Check if Auth0 client is available
    if (!window.auth0Client) {
      console.warn('[readLaterApi] Auth0 client not available');
      return null;
    }

    // Check if user is authenticated
    const isAuthenticated = await window.auth0Client.isAuthenticated();
    if (!isAuthenticated) {
      console.warn('[readLaterApi] User not authenticated');
      return null;
    }

    // Get the access token
    const token = await window.auth0Client.getTokenSilently();
    return token;
  } catch (error) {
    console.error('[readLaterApi] Failed to get auth token:', error);
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
 * Check if an article is saved by the current user
 * @param {string} articleId - The unique ID of the article
 * @returns {Promise<boolean>} - True if saved, false if not saved or error
 */
async function isArticleSaved(articleId) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return false; // Not authenticated, so not saved
    }

    // This would require a separate GET endpoint in the Netlify function
    // For now, we'll return false and let the UI handle initial state
    console.log(`[readLaterApi] Checking if article ${articleId} is saved (not implemented yet)`);
    return false;

  } catch (error) {
    console.error(`[readLaterApi] Failed to check if article ${articleId} is saved:`, error);
    return false;
  }
}

// Export the API functions
window.readLaterApi = {
  saveArticle,
  unsaveArticle,
  isArticleSaved
};

console.log('[readLaterApi] API helper loaded');
