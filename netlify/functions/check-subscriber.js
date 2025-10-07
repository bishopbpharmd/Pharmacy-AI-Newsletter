export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { email } = JSON.parse(event.body || "{}");
    console.log('Netlify function - Received email:', email);
    console.log('Netlify function - Request body:', event.body);
    
    if (!email) return { statusCode: 400, body: "Missing email" };

    // EmailOctopus v2 API - Search for contact by email address
    // Note: The email_address parameter should do exact matching, but let's verify
    const url = `https://api.emailoctopus.com/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts?email_address=${encodeURIComponent(email)}`;
    console.log('Netlify function - EmailOctopus URL:', url);
    console.log('Netlify function - Encoded email:', encodeURIComponent(email));
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Netlify function - EmailOctopus response status:', res.status);

    if (res.ok) {
      const data = await res.json();
      console.log('Netlify function - EmailOctopus response data:', JSON.stringify(data, null, 2));
      
      // Check if we found any contacts
      if (data.data && data.data.length > 0) {
        const contact = data.data[0]; // Get the first (and likely only) contact
        console.log('Netlify function - Found contact:', contact.email_address);
        console.log('Netlify function - Contact status:', contact.status);
        
        // Log email comparison for debugging (but don't block on minor differences)
        if (contact.email_address.toLowerCase() !== email.toLowerCase()) {
          console.warn('Netlify function - Email case/format difference detected:');
          console.warn('  Requested:', email);
          console.warn('  Returned:', contact.email_address);
          console.warn('  Using returned email from EmailOctopus');
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            exists: true, 
            status: contact.status, 
            fields: contact.fields || {},
            email_address: contact.email_address,
            created_at: contact.created_at,
            last_updated_at: contact.last_updated_at
          })
        };
      } else {
        // No contacts found
        return { 
          statusCode: 200, 
          body: JSON.stringify({ exists: false }) 
        };
      }
    } else if (res.status === 404) {
      // List not found or no contacts found
      return { 
        statusCode: 200, 
        body: JSON.stringify({ exists: false }) 
      };
    } else {
      // Other API errors
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      console.error('EmailOctopus API error:', res.status, errorData);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: `API error: ${res.status}` }) 
      };
    }
  } catch (err) {
    console.error('Netlify function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
