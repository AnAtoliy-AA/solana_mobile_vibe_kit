// Cloudflare Worker to proxy API requests and fix CORS issues
// Deploy this to Cloudflare Workers at https://workers.cloudflare.com

const TARGET_API = 'https://launch.meme/api';
const ALLOWED_ORIGINS = [
  'https://anatoliy-aa.github.io',
  'http://localhost:3000',
  'http://localhost:3001',
];

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS(origin);
  }

  // Check if origin is allowed
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Construct target URL
  const targetUrl = `${TARGET_API}${url.pathname}`;

  // Forward the request to the target API
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': request.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
      Accept: 'application/json, text/plain, */*',
      Origin: 'https://launch.meme',
      Referer: 'https://launch.meme/',
      Host: 'launch.meme',
    },
    body: request.body,
  });

  try {
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);

    // Fix CORS headers - remove duplicates and set proper values
    modifiedResponse.headers.delete('access-control-allow-origin');
    modifiedResponse.headers.delete('access-control-allow-credentials');
    modifiedResponse.headers.delete('access-control-allow-methods');
    modifiedResponse.headers.delete('access-control-allow-headers');

    // Set clean CORS headers
    modifiedResponse.headers.set('Access-Control-Allow-Origin', origin || '*');
    modifiedResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    modifiedResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With'
    );

    return modifiedResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin || '*',
      },
    });
  }
}

function handleCORS(origin) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}
