export const config = {
  runtime: 'edge',
};

// Este es el nuevo proxy mejorado
export default async function handler(req) {
  // 1. Obtenemos la URL de destino del parámetro de la petición
  const targetUrl = new URL(req.url).searchParams.get('url');

  if (!targetUrl) {
    return new Response('Error: No se proporcionó una URL de destino.', { status: 400 });
  }

  // 2. Creamos una nueva URL válida para la petición
  const fetchUrl = new URL(targetUrl);

  // 3. Hacemos la petición al servidor del stream desde nuestro servidor Vercel
  const response = await fetch(fetchUrl.toString(), {
    headers: {
      // Nos aseguramos de pasar las cabeceras importantes del navegador
      'User-Agent': req.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': fetchUrl.origin, // A veces los servidores de stream requieren un referer
    },
  });

  // 4. Si el stream es un archivo de texto (como .m3u8), tenemos que reescribir las URLs internas
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/vnd.apple.mpegurl') || contentType.includes('application/x-mpegurl')) {
    
    const playlistContent = await response.text();
    const baseUrl = new URL('.', fetchUrl).toString(); // Obtenemos la URL base (ej: https://server.com/live/)

    // Reemplazamos todas las URLs relativas dentro del archivo para que pasen por nuestro proxy
    const rewrittenPlaylist = playlistContent.replace(/^(?!#)(.*)$/gm, (line) => {
      if (line.startsWith('http')) {
        // Si la línea ya es una URL completa, la pasamos por el proxy
        return `/api/proxy?url=${encodeURIComponent(line)}`;
      } else {
        // Si es una URL relativa, la completamos y la pasamos por el proxy
        const absoluteUrl = new URL(line, baseUrl).toString();
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      }
    });
    
    // Devolvemos la lista de reproducción modificada
    return new Response(rewrittenPlaylist, {
      headers: { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
       },
    });
  }

  // 5. Para todos los demás archivos (como los trozos de video .ts), simplemente los pasamos directamente
  return new Response(response.body, {
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    },
  });
}
