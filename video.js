export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CAMBIADO: Ahora apuntamos a la página de video, no al stream m3u8.
  const targetUrl = 'https://4135-2607-f00-9-b7fe-b9f2-ea2b-2692-b001.ngrok-free.app/embed/video/';

  // Tu "asistente" va a la página de Ngrok con el "Pase VIP".
  const response = await fetch(targetUrl, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });

  // Recoge el contenido de la página (que es HTML).
  const pageContent = await response.text();

  // Devuelve esa página HTML para que se muestre en el iframe.
  return new Response(pageContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
