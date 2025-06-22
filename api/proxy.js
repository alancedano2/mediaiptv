export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Obtenemos la URL del stream que viene como parámetro
  const targetUrl = new URL(req.url).searchParams.get('url');

  // Verificamos si nos dieron una URL
  if (!targetUrl) {
    return new Response('Error: No se proporcionó una URL de destino.', { status: 400 });
  }

  try {
    // Hacemos la llamada al servidor del stream desde nuestro servidor
    const response = await fetch(targetUrl);

    // Si la respuesta no es exitosa, devolvemos el error
    if (!response.ok) {
        return new Response(`Error al contactar el servidor de streaming: ${response.statusText}`, { status: response.status });
    }

    // Devolvemos el contenido del stream (el video) a nuestra página
    return new Response(response.body, {
      headers: {
        // Copiamos las cabeceras originales, como el tipo de contenido
        'Content-Type': response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*', // Permitimos que nuestra propia página lo use
      },
    });
  } catch (error) {
    return new Response(`Error en el proxy: ${error.message}`, { status: 500 });
  }
}
