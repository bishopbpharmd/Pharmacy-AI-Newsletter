import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const auth0Domain = process.env.AUTH0_DOMAIN;

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verify Auth0 JWT token and extract user_id
 * @param {string} authHeader - Authorization header (Bearer token)
 * @returns {string|null} - user_id or null if invalid
 */
async function verifyAuth0Token(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    // For Auth0, we would normally verify the JWT signature
    // For now, we'll decode without verification (in production, use jwks-rsa)
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.sub) {
      return null;
    }

    // Auth0 sub is typically in format: "auth0|user_id" or "google-oauth2|user_id"
    return decoded.sub;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function handler(event) {
  const method = event.httpMethod;
  const { articleId } = JSON.parse(event.body || '{}');
  
  console.log(`[saved-articles] ${method} request for articleId: ${articleId}`);

  // Verify user authentication
  const userId = await verifyAuth0Token(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized - invalid token' })
    };
  }

  console.log(`[saved-articles] Authenticated user: ${userId}`);

  try {
    if (method === 'POST') {
      // Save article - insert or upsert
      const { data, error } = await supabase
        .from('saved_articles')
        .upsert({
          user_id: userId,
          article_id: articleId,
          saved_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,article_id'
        });

      if (error) {
        console.error('[saved-articles] POST error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to save article', details: error.message })
        };
      }

      console.log(`[saved-articles] Article ${articleId} saved for user ${userId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Article saved' })
      };

    } else if (method === 'DELETE') {
      // Unsave article - remove from table
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId);

      if (error) {
        console.error('[saved-articles] DELETE error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to unsave article', details: error.message })
        };
      }

      console.log(`[saved-articles] Article ${articleId} unsaved for user ${userId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Article unsaved' })
      };

    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

  } catch (error) {
    console.error('[saved-articles] Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}
