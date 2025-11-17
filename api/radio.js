// Contenido para: /api/radio.js

export default async function handler(req, res) {
  // La URL de la radio que queremos "proxear"
  const streamUrl =
    'https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player';

  try {
    // 1. El servidor de Vercel pide el .m3u8 (sin CORS)
    const response = await fetch(streamUrl, {
      cache: 'no-store', // Le decimos que no guarde caché
    });

    if (!response.ok) {
      throw new Error(`Error del servidor de radio: ${response.statusText}`);
    }

    const playlistText = await response.text();

    // 2. El servidor de Vercel analiza el texto
    const lines = playlistText.split('\n');
    let lastExtinfLine = '';
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('#EXTINF:')) {
        lastExtinfLine = lines[i];
        break;
      }
    }

    let artist = null;
    let title = null;

    if (lastExtinfLine) {
      const artistMatch = /artist="([^"]*)"/.exec(lastExtinfLine);
      const titleMatch = /title="([^"]*)"/.exec(lastExtinfLine);
      artist = artistMatch ? artistMatch[1] : null;
      title = titleMatch ? titleMatch[1] : null;
    }

    // 3. El servidor de Vercel le responde a tu HTML con un JSON
    
    // IMPORTANTE: Ponemos este header para permitir que tu Vercel hable consigo mismo
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Cache-Control', 'no-cache'); // Sin caché

    res.status(200).json({
      artist: artist,
      title: title,
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la metadata.' });
  }
}
