# CORS Proxy Setup

The production deployment needs a proxy to handle CORS issues with the launch.meme API.

## Option 1: Cloudflare Workers (Recommended - Free)

1. Go to https://workers.cloudflare.com
2. Sign up/login (free tier: 100,000 requests/day)
3. Create a new Worker
4. Copy the contents of `worker.js` into the worker editor
5. Deploy the worker
6. Copy the worker URL (e.g., `https://your-worker.your-subdomain.workers.dev`)
7. Set the environment variable `REACT_APP_PROXY_URL` to your worker URL

## Option 2: Vercel Serverless Function

1. Create `api/proxy.js` in your project:

```javascript
export default async function handler(req, res) {
  const TARGET_API = 'https://launch.meme/api';
  const path = req.url.replace('/api/proxy', '');

  const response = await fetch(`${TARGET_API}${path}`, {
    method: req.method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://launch.meme',
      Referer: 'https://launch.meme/',
    },
    body: req.method !== 'GET' ? req.body : undefined,
  });

  const data = await response.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.json(data);
}
```

2. Deploy to Vercel
3. Use `https://your-app.vercel.app/api/proxy` as the proxy URL

## Option 3: Move to Vercel/Netlify (Simplest)

Both platforms support proxy rewrites in their config:

### Vercel (`vercel.json`):

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://launch.meme/api/:path*"
    }
  ]
}
```

### Netlify (`netlify.toml`):

```toml
[[redirects]]
  from = "/api/*"
  to = "https://launch.meme/api/:splat"
  status = 200
  force = true
```

## Environment Variables

After setting up the proxy, add to GitHub repository secrets:

- `REACT_APP_PROXY_URL` - Your proxy URL (e.g., `https://your-worker.workers.dev`)

Or update `.github/workflows/deploy-pages.yml` to set it.
