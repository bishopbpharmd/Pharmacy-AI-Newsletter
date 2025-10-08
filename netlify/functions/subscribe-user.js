export async function handler(event) {
  // CORS and content-type headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method not allowed" }) 
    };
  }

  try {
    const { firstName, lastName, email, company } = JSON.parse(event.body || "{}");
    
    console.log('Subscribe function - Received data:', { firstName, lastName, email, company });
    
    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return { 
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Missing required fields", 
          success: false 
        }) 
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { 
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Invalid email format", 
          success: false 
        }) 
      };
    }

    // EmailOctopus v2 API - Create or update contact
    const url = `https://api.emailoctopus.com/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`;
    
    const emailoctopusData = {
      email_address: email,
      fields: {
        FirstName: firstName,
        LastName: lastName,
        Company: company
      },
      status: "subscribed"
    };

    console.log('Subscribe function - Calling EmailOctopus v2 API:', url);
    console.log('Subscribe function - Data being sent:', emailoctopusData);

    const response = await fetch(url, {
      method: 'PUT', // Use PUT for upsert operation (create or update)
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`
      },
      body: JSON.stringify(emailoctopusData)
    });

    console.log('Subscribe function - EmailOctopus v2 response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Subscribe function - EmailOctopus v2 success response:', data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: "Successfully subscribed to newsletter",
          data: data
        })
      };
    } else {
      const errorData = await response.json().catch(() => ({ 
        title: 'Unknown error',
        detail: 'Unable to process subscription request'
      }));
      console.error('Subscribe function - EmailOctopus v2 error:', response.status, errorData);
      
      // Handle specific EmailOctopus v2 errors
      let errorMessage = "Subscription failed";
      
      if (errorData.type && errorData.type.includes('already-exists')) {
        errorMessage = "This email address is already subscribed";
      } else if (errorData.type && errorData.type.includes('validation')) {
        errorMessage = errorData.detail || "Invalid data provided";
      } else if (errorData.type && errorData.type.includes('not-found')) {
        errorMessage = "Subscription service not found";
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
      
      return {
        statusCode: response.status >= 400 && response.status < 500 ? 400 : 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: errorMessage,
          details: errorData
        })
      };
    }

  } catch (error) {
    console.error('Subscribe function - Unexpected error:', error);
    return { 
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: "Internal server error" 
      }) 
    };
  }
}
