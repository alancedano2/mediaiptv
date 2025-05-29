const channels = [
  {
    name: 'KQ-105 TV',
    logo: 'https://bloximages.chicago2.vip.townnews.com/kq105.com/content/tncms/custom/image/f8b14b8c-a5ba-11ee-b21a-4b46656e8613.png?resize=640%2C184',
    stream: 'https://live20.bozztv.com/akamaissh101/ssh101/kq105/chunks.m3u8',
    programs: [
      { start: '00:00', end: '06:00', title: 'Videos Musicales' },
      { start: '06:00', end: '10:00', title: 'KQ Al Aire con Héctor Ortiz' },
      { start: '10:00', end: '15:00', title: 'KQOnline con Alex Diaz' },
      { start: '15:00', end: '18:00', title: 'La Tendencia de Molusco' },
      { start: '18:00', end: '19:00', title: 'KQ Al Aire con Pedro Villegas' },
      { start: '19:00', end: '23:59', title: 'Videos Musicales' }
    ]
  },
  {
    name: 'eWo TV',
    logo: 'https://ewopr-puce.vercel.app/logo.png',
    stream: 'https://stream.gia.tv/giatv/giatv-eWoPRTV/eWoPRTV/playlist.m3u8',
    programs: [
      { start: '08:00', end: '09:30', title: 'La Verdad Absoluta' },
      { start: '09:30', end: '10:00', title: 'Cuenta Regresiva' },
      { start: '10:00', end: '11:00', title: 'El Update' },
      { start: '11:00', end: '15:00', title: 'ThrowBack' },
      { start: '15:00', end: '15:30', title: 'El Perfil' },
      { start: '15:30', end: '17:30', title: '24/7 Retro' }
    ]
  },
  {
    name: 'KQ105 Radio',
    logo: 'https://bloximages.chicago2.vip.townnews.com/kq105.com/content/tncms/custom/image/f8b14b8c-a5ba-11ee-b21a-4b46656e8613.png?resize=640%2C184',
    stream: 'https://stream.gia.tv/giatv/giatv-kq105radio/kq105radio/playlist.m3u8',
    programs: [
      { start: '00:00', end: '23:59', title: 'Radio en Vivo' }
    ]
  }
];

const channelsContainer = document.getElementById('channels');
const playerContainer = document.getElementById('player');

let currentPlayer = null;
let currentOpenIndex = null;

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function nowInMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function getCurrentProgram(programs) {
  const now = nowInMinutes();
  return programs.find(p => {
    const start = timeToMinutes(p.start);
    const end = timeToMinutes(p.end);
    // Manejo para programas que cruzan la medianoche
    if (end < start) {
      return now >= start || now < end;
    }
    return now >= start && now < end;
  });
}

function createProgramList(programs) {
  const ul = document.createElement('div');
  ul.classList.add('program-dropdown');

  programs.forEach(p => {
    const pEl = document.createElement('p');
    pEl.textContent = `${p.start} - ${p.end} : ${p.title}`;

    // Si está en vivo
    const current = getCurrentProgram(programs);
    if (p.title === current.title) {
      const liveSpan = document.createElement('span');
      liveSpan.classList.add('live-label');
      liveSpan.textContent = 'EN VIVO';
      pEl.appendChild(liveSpan);
    }
    ul.appendChild(pEl);
  });
  return ul;
}

function initPlayer(streamUrl) {
  if(currentPlayer){
    currentPlayer.destroy();
  }
  currentPlayer = new Clappr.Player({
    source: streamUrl,
    parentId: '#player',
    width: '100%',
    height: '100%',
    autoPlay: true,
    mute: false,
    mediacontrol: {seekbar: "#00ff00"}
  });
}

channels.forEach((channel, index) => {
  const li = document.createElement('li');
  li.classList.add('channel-card');

  // Header con logo y nombre
  const header = document.createElement('div');
  header.classList.add('channel-header');

  const logo = document.createElement('img');
  logo.src = channel.logo;
  logo.alt = `${channel.name} logo`;
  logo.classList.add('channel-logo');

  const name = document.createElement('span');
  name.textContent = channel.name;
  name.classList.add('channel-name');

  header.appendChild(logo);
  header.appendChild(name);

  // Botón reproducir
  const btn = document.createElement('button');
  btn.textContent = 'Reproducir';
  btn.classList.add('play-btn');

  btn.addEventListener('click', () => {
    // Cambiar stream del player
    initPlayer(channel.stream);

    // Mostrar/ocultar programación
    if(currentOpenIndex === index){
      currentOpenIndex = null;
      if(li.querySelector('.program-dropdown')){
        li.removeChild(li.querySelector('.program-dropdown'));
      }
    } else {
      // Cerrar antes el otro si hay
      if(currentOpenIndex !== null) {
        const prevLi = channelsContainer.children[currentOpenIndex];
        if(prevLi.querySelector('.program-dropdown')) {
          prevLi.removeChild(prevLi.querySelector('.program-dropdown'));
        }
      }
      currentOpenIndex = index;

      // Añadir lista de programas con animación
      const progList = createProgramList(channel.programs);
      li.appendChild(progList);
    }
  });

  li.appendChild(header);
  li.appendChild(btn);
  channelsContainer.appendChild(li);
});
