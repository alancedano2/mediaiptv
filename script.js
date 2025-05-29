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
  }
];

const player = new Clappr.Player({
  source: channels[0].stream,
  parentId: '#player',
  width: '100%',
  height: '400px',
});

function getCurrentProgram(channel) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  return channel.programs.find(p => {
    const [sh, sm] = p.start.split(':').map(Number);
    const [eh, em] = p.end.split(':').map(Number);
    const startM = sh * 60 + sm;
    const endM = eh * 60 + em;
    return current >= startM && current < endM;
  });
}

function loadChannels() {
  const list = document.getElementById('channels');
  channels.forEach((channel, index) => {
    const li = document.createElement('li');
    const logo = document.createElement('img');
    logo.src = channel.logo;

    const span = document.createElement('span');
    span.textContent = channel.name;

    const arrow = document.createElement('span');
    arrow.textContent = '⯆';
    arrow.style.marginLeft = 'auto';

    li.appendChild(logo);
    li.appendChild(span);
    li.appendChild(arrow);

    li.onclick = () => {
      player.load(channel.stream);
      showProgram(channel);
    };

    list.appendChild(li);
  });
}

function showProgram(channel) {
  const box = document.getElementById('program-box');
  const nowProg = getCurrentProgram(channel);
  box.innerHTML = `<h3>Programación de ${channel.name}</h3>`;
  channel.programs.forEach(p => {
    const live = (nowProg && nowProg.title === p.title)
      ? '<span class="live-label">EN VIVO</span>' : '';
    box.innerHTML += `<p>${p.start} - ${p.end} — ${p.title} ${live}</p>`;
  });
  box.style.display = 'block';
}

loadChannels();
showProgram(channels[0]);
