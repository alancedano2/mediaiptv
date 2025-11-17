// Contenido para: /api/radio.js

export default async function handler(req, res) {
  console.log("--- [LOG DE VERCEL] Inició la función /api/radio (v2 FINAL) ---");

  const masterPlaylistUrl =
    'https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?key=96bc32e12ecb6b1bafd065de263d64235ff13cc93b57ff806196d3ecd0891325&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player';

  try {
    // --- PASO 1: Pedir el "menú" (playlist maestro) ---
    console.log("[LOG DE VERCEL] Paso 1: Buscando playlist maestro...");
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

    console.log("[LOG DE VERCEL] Paso 2: URL real encontrada:", realPlaylistUrl);

    // --- PASO 3: Pedir el "playlist real" (que tiene la metadata) ---
    console.log("[LOG DE VERCEL] Paso 3: Buscando playlist real...");
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

    console.log(`[LOG DE VERCEL] Parseado: Artist=${artist}, Title=${title}`);

    // --- PASO 5: Enviar la respuesta al HTML ---
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({ artist: artist, title: title });

  } catch (error) {
    console.error("[LOG DE VERCEL] CATCH ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
}
