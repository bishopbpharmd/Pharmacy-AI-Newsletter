import crypto from "crypto";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { email } = JSON.parse(event.body || "{}");
    if (!email) return { statusCode: 400, body: "Missing email" };

    const emailHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

    const url = `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts/${emailHash}?api_key=${process.env.EMAILOCTOPUS_API_KEY}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        statusCode: 200,
        body: JSON.stringify({ exists: true, status: data.status, fields: data.fields || {} })
      };
    } else {
      return { statusCode: 200, body: JSON.stringify({ exists: false }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
