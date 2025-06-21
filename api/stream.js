// Este es el código para tu "asistente" o "proxy"

export const config = {
  runtime: 'edge', // Usamos un sistema rápido de Vercel
};

export default async function handler(req) {
  // Aquí pones la URL de tu stream de Ngrok
  const ngrokUrl = 'https://4135-2607-f00-9-b7fe-b9f2-ea2b-2692-b001.ngrok-free.app/hls/0/stream.m3u8?cachebust=d335c5';

  // Tu asistente va a Ngrok y le añade el "Pase VIP"
  const response = await fetch(ngrokUrl, {
    headers: {
      // El Pase VIP para que Ngrok no muestre el aviso
      'ngrok-skip-browser-warning': 'true',
    },
  });

  // Finalmente, tu asistente le entrega el video a tu página
  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type'),
    },
  });
}
