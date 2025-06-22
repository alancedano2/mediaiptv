export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const targetUrl = new URL(req.url).searchParams.get('url');
  if (!targetUrl) {
    return new Response('Error: No URL provided.', { status: 400 });
  }

  const fetchUrl = new URL(targetUrl);
  const response = await fetch(fetchUrl.toString(), {
    headers: {
      'User-Agent': req.headers.get('User-Agent') || 'Mozilla/5.0',
      'Referer': fetchUrl.origin,
    },
  });

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/vnd.apple.mpegurl') || contentType.includes('application/x-mpegurl')) {
    const playlistContent = await response.text();
    const baseUrl = new URL('.', fetchUrl).toString();
    const rewrittenPlaylist = playlistContent.replace(/^(?!#)(.*)$/gm, (line) => {
      if (line.startsWith('http')) {
        return `/api/proxy?url=${encodeURIComponent(line)}`;
      }
      const absoluteUrl = new URL(line, baseUrl).toString();
      return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
    });
    return new Response(rewrittenPlaylist, { headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' }});
  }

  return new Response(response.body, { headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' }});
}
