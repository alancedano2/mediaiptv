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
    stream: 'https://televicentro.streamguys1.com/wkaqfm/playlist.m3u8?listeningSessionID=67acd14beee8d430_9104582_MwEfK6da_MjA1LjIzNC4yMTIuMTQw_0000000Wtno&downloadSessionID=0&key=01c804a8663a4d6f85af625fe28c982aba4db423010cf5b57d1e62338ad0b8d5&aw_0_1st.playerId=kq105&source=kq105.com&us_privacy=1YNY&clientType=web&callLetters=WKAQ-FM&devicename=web-desktop&stationid=1846&dist=kq105.com&subscription_type=free&aw_0_1st.version=1.0_html5&aw_0_1st.playerid=kq105_floating_player',
    programs: [
      { start: '00:00', end: '06:00', title: 'Radio Chillout' },
      { start: '06:00', end: '12:00', title: 'KQ Radio Mañanas' },
      { start: '12:00', end: '18:00', title: 'KQ Radio Tardes' },
      { start: '18:00', end: '23:59', title: 'Noche con KQ Radio' }
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

function toggleProgramDropdown(li, channel, arrow) {
  const existingDropdown = li.querySelector('.program-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
    arrow.classList.remove('open');
    return;
  }

  // Cierra otras programaciones abiertas
  document.querySelectorAll('.program-dropdown').forEach(d => d.remove());
  document.querySelectorAll('.arrow.open').forEach(a => a.classList.remove('open'));

  arrow.classList.add('open');

  const nowProg = getCurrentProgram(channel);
  const dropdown = document.createElement('div');
  dropdown.className = 'program-dropdown';

  channel.programs.forEach(p => {
    const liveSpan = (nowProg && nowProg.title === p.title)
      ? '<span class="live-label">EN VIVO</span>'
      : '';
    const pElem = document.createElement('p');
    pElem.innerHTML = `${p.start} - ${p.end} — ${p.title} ${liveSpan}`;
    dropdown.appendChild(pElem);
  });

  li.appendChild(dropdown);
}

function loadChannels() {
  const list = document.getElementById('channels');
  channels.forEach((channel, idx) => {
    const li = document.createElement('li');

    const mainDiv = document.createElement('div');
    mainDiv.className = 'channel-main';

    const logo = document.createElement('img');
    logo.src = channel.logo;
    logo.alt = `${channel.name} logo`;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = channel.name;

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';

    mainDiv.appendChild(logo);
    mainDiv.appendChild(nameSpan);
    mainDiv.appendChild(arrow);

    li.appendChild(mainDiv);

    li.addEventListener('click', () => {
      player.load(channel.stream);
      toggleProgramDropdown(li, channel, arrow);
    });

    list.appendChild(li);
  });
}

loadChannels();
