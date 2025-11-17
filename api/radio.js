// Contenido para: /api/radio.js

export default async function handler(req, res) {
  // 1. Log para saber que la función se activó
  console.log("--- [LOG DE VERCEL] Inició la función /api/radio ---");

  const streamUrl =
    'https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player';

  try {
    const response = await fetch(streamUrl, { cache: 'no-store' });
    
    // 2. Log para ver el estatus de la radio
    console.log(`[LOG DE VERCEL] Estatus de la radio: ${response.status}`);

    if (!response.ok) {
      console.error(`[LOG DE VERCEL] Error de fetch: ${response.statusText}`);
      throw new Error(`Error del servidor de radio: ${response.statusText}`);
    }

    const playlistText = await response.text();
    
    // 3. ¡EL LOG MÁS IMPORTANTE!
    console.log("--- [LOG DE VERCEL] TEXTO RECIBIDO DE LA RADIO: ---");
    console.log(playlistText);
    console.log("--- [LOG DE VERCEL] FIN DEL TEXTO ---");

    const lines = playlistText.split('\n');
    let lastExtinfLine = '';
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('#EXTINF:')) {
        lastExtinfLine = lines[i];
        break;
      }
    }

    // 4. Log para ver qué línea encontramos
    console.log(`[LOG DE VERCEL] Línea #EXTINF encontrada: ${lastExtinfLine}`);

    let artist = null;
    let title = null;

    if (lastExtinfLine) {
      const artistMatch = /artist="([^"]*)"/.exec(lastExtinfLine);
      const titleMatch = /title="([^"]*)"/.exec(lastExtinfLine);
      artist = artistMatch ? artistMatch[1] : null;
      title = titleMatch ? titleMatch[1] : null;
    }

    // 5. Log para ver qué logramos parsear
    console.log(`[LOG DE VERCEL] Parseado: Artist=${artist}, Title=${title}`);

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).json({ artist: artist, title: title });

  } catch (error) {
    console.error("[LOG DE VERCEL] CATCH ERROR:", error.message);
    res.status(500).json({ error: 'Error al buscar la metadata.' });
  }
}
