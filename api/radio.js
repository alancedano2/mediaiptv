export default async function handler(req, res) {
  
  // Generamos un "cache bust" para el servidor
  const cacheBust = `&_v=${new Date().getTime()}`;

  // URL del playlist maestro AHORA con el cache bust
  const masterPlaylistUrl =
    'https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player' + cacheBust;

  try {
    // --- PASO 1: Pedir el "menú" (playlist maestro) ---
    const masterResponse = await fetch(masterPlaylistUrl, { cache: 'no-store' });

    if (!masterResponse.ok) {
      throw new Error(`Error en Paso 1: ${masterResponse.statusText}`);
    }
    const masterPlaylistText = await masterResponse.text();

    // --- PASO 2: Encontrar la URL del "playlist real" ---
    const lines = masterPlaylistText.split('\n');
    let realPlaylistUrl = "";
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        realPlaylistUrl = line;
        break;
      }
    }

    if (!realPlaylistUrl) {
      throw new Error("No se encontró la URL del playlist real en el maestro.");
    }
    
    // ¡AÑADIMOS EL CACHE BUST A LA SEGUNDA URL TAMBIÉN!
    // (A veces las URLs ya tienen '?' así que usamos '&')
    realPlaylistUrl += `&_v=${new Date().getTime()}`;


    // --- PASO 3: Pedir el "playlist real" (que tiene la metadata) ---
    const realResponse = await fetch(realPlaylistUrl, { cache: 'no-store' });

    if (!realResponse.ok) {
      throw new Error(`Error en Paso 3: ${realResponse.statusText}`);
    }

    const realPlaylistText = await realResponse.text();

    // --- PASO 4: Parsear la metadata (como antes) ---
    const realLines = realPlaylistText.split('\n');
    let lastExtinfLine = '';
    for (let i = realLines.length - 1; i >= 0; i--) {
      if (realLines[i].startsWith('#EXTINF:')) {
        lastExtinfLine = realLines[i];
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

    // --- PASO 5: Enviar la respuesta al HTML ---
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    // Headers de caché súper agresivos para Vercel
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({ artist: artist, title: title });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
