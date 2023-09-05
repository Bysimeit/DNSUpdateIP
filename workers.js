addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const SECRET_TOKEN = "YOUR_SECRET_TOKEN";
  
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (token !== SECRET_TOKEN) {
    return new Response('Unauthorized', {status: 401});
  } else {
    const currentIp = request.headers.get('CF-Connecting-IP');

    const API_URL = "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/dns_records/YOUR_DNS_RECORD_ID";
    const HEADERS = {
      "Authorization": "Bearer YOUR_API_TOKEN",
      "Content-Type": "application/json"
    };

    const payload = {
      type: "A",
      name: "YOUR_DOMAIN_OR_SUBDOMAIN",
      content: currentIp,
      ttl: 1, // 1 IS AUTOMATIC
      proxied: true
    };

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
    return new Response('IP Updated', {status: 200});
    } else {
    return new Response('Update Failed', {status: 500});
    }
  }
}
