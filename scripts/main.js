
const channels = [
  {
    name: "KQ-105 TV",
    logo: "/public/logos/kq-logo.png",
    stream: "https://7ea7-2607-f00-9-be70-a08d-f293-7c76-df06.ngrok-free.app/lista.m3u",
    epg: "https://7ea7-2607-f00-9-be70-a08d-f293-7c76-df06.ngrok-free.app/epg.xml"
  },
  {
    name: "eWo TV",
    logo: "/public/logos/ewo-logo.png",
    stream: "https://stream.gia.tv/giatv/giatv-eWoPRTV/eWoPRTV/playlist.m3u8",
    epg: "https://7ea7-2607-f00-9-be70-a08d-f293-7c76-df06.ngrok-free.app/epg.xml"
  }
];

const player = new Clappr.Player({
  source: channels[0].stream,
  parentId: "#player",
  height: "360px"
});

const channelItems = document.getElementById("channelItems");

channels.forEach((ch, index) => {
  const div = document.createElement("div");
  div.className = "channel-item";
  div.innerHTML = `
    <img src="${ch.logo}" class="channel-logo" />
    <div class="channel-details">${ch.name}</div>
  `;
  div.onclick = () => {
    player.load(ch.stream);
  };
  channelItems.appendChild(div);
});
