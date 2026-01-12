import type { Work } from '../model/types'

// Используем специальный синтаксис [[MUSIC:ID]] для вставки виджета
const contentWithMusic = `
<p>The warp core hummed, a heartbeat against the silence of the void. It was the only sound Kathryn allowed herself to hear, focusing on its rhythm to keep the encroaching darkness at bay.</p>

[[MUSIC:1]]

<p>Seven years. It felt like a lifetime, yet simultaneously like no time at all. The Delta Quadrant had changed them, etched itself into the lines of their faces and the stiffness of their postures.</p>
<div class="my-8 text-center text-text-muted tracking-[0.5em]">***</div>

[[MUSIC:2]]

<p>"Confirmed," the Vulcan said, his tone devoid of surprise. "It appears to be a Dyson sphere, though of a configuration not in our database."</p>
<p>Kathryn stood, smoothing her uniform. "On screen."</p>
`

const simpleContent = `
<p>The warp core hummed, a heartbeat against the silence of the void. It was the only sound Kathryn allowed herself to hear, focusing on its rhythm to keep the encroaching darkness at bay.</p>
<p>Seven years. It felt like a lifetime, yet simultaneously like no time at all. The Delta Quadrant had changed them, etched itself into the lines of their faces and the stiffness of their postures.</p>
<div class="my-8 text-center text-text-muted tracking-[0.5em]">***</div>
<p>"Confirmed," the Vulcan said, his tone devoid of surprise. "It appears to be a Dyson sphere, though of a configuration not in our database."</p>
<p>Kathryn stood, smoothing her uniform. "On screen."</p>
`

export const getChapterContent = async (slug: string, chapter: number): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const baseContent = chapter === 1 ? contentWithMusic : simpleContent

  return `
    <div class="chapter-start-marker" data-chapter="${chapter}"></div>
    ${baseContent}
    <p><em>[System Log: Content of chapter ${chapter} loaded successfully from the database.]</em></p>
    <p>The narrative continues deeper into the void. This is the generated content for chapter ${chapter}, simulating a fetch request from the server.</p>
  `
}

export const works: Work[] = [
  {
    id: '1',
    slug: 'gravity-of-silence',
    title: 'The Gravity of Silence',
    author: 'DeepSpaceWriter',
    type: 'Original',
    rating: '12+',
    warnings: ['Cosmic Horror', 'Isolation'],
    summary: 'In the quiet sectors of the Deep Field, sound is a luxury and silence is a weapon.',
    tags: ['SciFi', 'CosmicHorror', 'SlowBurn'],
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7tdbDN6dNGK20-9amKZHfEyIyWXp38AEI7yYH29v1Q1P12uR9Y8stn1VoT1pXk3XM_qIRKl4Ps0A3hUAAVMt96EnlX3bfIX_3Zf2CZIRY_KDHAug6utFg9PYF5V0AB_bAxLzHKAhruQ89sHb6eGkItsK_ppz_URdkR6Xed7AziVlJfs4rkHlFZj21AE346VQRrGAkl2n4ezjmypcG3TSWATx1ZPwBuWd1xAofeYxdg7obqFPsVf-x2obBE46yIW7JqdXmqpz3dzI',
    stats: { words: 15402, chapters: 5, kudos: 120, date: '2023-10-27', status: 'Complete' },
    content: contentWithMusic,
    authorAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Тестовая ссылка на аудиофайл авторской озвучки
    soundtracks: [
      {
        id: '1',
        title: 'Memory Lane',
        tracks: [
          {
            id: 't1',
            title: 'Space Ambience',
            artist: 'Void',
            url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_1420790680.mp3',
          },
          {
            id: 't2',
            title: 'Melancholy',
            artist: 'Piano',
            url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
          },
        ],
      },
      {
        id: '2',
        title: 'Tension Rising',
        tracks: [
          {
            id: 't3',
            title: 'Deep Drone',
            artist: 'Signal',
            url: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_550d815fa5.mp3',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'echoes-in-rain',
    title: 'Echoes in Rain',
    author: 'SeoulDreamer',
    type: 'Fanfic',
    rating: '16+',
    warnings: ['Profanity', 'Smoking'],
    fandom: 'Stray Kids',
    pairings: ['Minho/Jisung', 'Hyunjin/Felix'],
    summary:
      'They met under the grey sky of Seoul, two strangers running from a past that refused to stay buried.',
    tags: ['AU', 'Angst', 'MemoryLoss'],
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTdzsdm9Jm9Xu_20j6BEz5QtkLUW7qSU7_8Tkdc9I3bbHQQE-FmSjGFSWw5u0updrFVZeAneA3b5LeoBBUVmU2m1jaNb5ZxOuo3BI-oxzj_xd3QZ4Zxx3onGOwGPN664n3vQxme6loU6Yum-2MFhhSNqeVkH4Z9vzdT--wwr5ZJisuCWU9r0FJ6NIhD97fJcQsGfqK-aVBB-IfLFiycaM271D2TrJ26Gq5TJHslIZFXhz2D1sSlWHSFOL3vqzOHs6quLKSpvcUzCw',
    stats: { words: 4200, chapters: 1, kudos: 85, date: '2023-11-14', status: 'In Progress' },
    content: simpleContent,
  },
  {
    id: '3',
    slug: 'obsidian-state',
    title: 'Obsidian State',
    author: 'GeoMind',
    type: 'Original',
    rating: '0+',
    warnings: [],
    summary:
      'A collection of short stories revolving around the geological formation of a new planet.',
    tags: ['Experimental', 'Nature'],
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9GnISUb2lRpf8WG7DU58xysEo7E0lBY5C0ryVV9g1eP7zvIRu-h1x9bjrmpx8DDQSjtKFCQAR0YXRuLNfrVHkMi40nk-GaqEVYFh2nVVqgh9hRwJ70GXXrGz1X8rBBUJeWEt9zNxW1gDgnjS5bwc_DbH_AjafhJ0dR23rTJnB35ZNH6YMMs3EOlYcqXZusRpnP2o-GTKmG5Fpgalq3zKWOQB-uzVs1GLS6CQ_f1HM3uCQdH3l8FDZ28vu1cIyQTt1Zhk7EndTJM',
    stats: { words: 22150, chapters: 8, kudos: 400, date: '2023-08-02', status: 'Complete' },
    content: simpleContent,
  },
  {
    id: '4',
    slug: 'stellar-parallax',
    title: 'Stellar Parallax',
    author: 'StarWalker',
    type: 'Fanfic',
    rating: '18+',
    warnings: ['Violence', 'Space Battles'],
    fandom: 'Star Wars',
    pairings: ['Kylo Ren/Rey'],
    summary:
      'Distance is relative. A space-opera adaptation where the idol industry spans galaxies.',
    tags: ['SpaceOpera', 'Romance'],
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmYNhe1btI_4LjruIicKqJS45MOjTQBMWvfOViUfcmoJXDHoMf-hUpPp9YtbOlIFc5bMfloJtmlldYGisiRHW4jtYGdLx2IkZMPELUVJd1aOLrnni6JQgwfHwBBU1tOjVw0r7zgmlLWKKBnZgYYQx3zCLrydPLbI9R4KNSeXfppH96a1sQLg7WiVtzAbKEtIKGyh7FOiDaR1zbIPeQcfRDf7cNQNqR7wNc31hUsXBp1inAAnpp1ULlCCEXdPSBnw-LKlCa9cvgbGo',
    stats: { words: 8900, chapters: 1, kudos: 210, date: '2023-12-01', status: 'One-Shot' },
    content: simpleContent,
  },
  {
    id: '5',
    slug: 'old-logs-2021',
    title: 'The Lost Logs: 2021',
    author: 'SystemAdmin',
    type: 'Archive',
    rating: '0+',
    warnings: ['Corrupt Data'],
    summary: 'Recovered data fragments from the pre-awakening era.',
    tags: ['Fragment', 'Data'],
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAuuqOP0Kzq9ilVA0Vz_ijYK7_WIUCZqwQ8cuvRMnor_nxgWbFOaROVshX6JO8oaUWVyhyc-MEy-As94mS3Wze75Ro24RSvXMqJ2v_mxy04OLU9YTrvviY1pzTyFHq_jRFu2Uh2wd61wDmrCiw4nk6Y420IvTuBg-DV9jXwmylaKjYQ4ZedtOAY_FdegYnlBmnp-PtQmdHYvhDGkkxpIYIiJjR7MZ_EA_vEEiQijdThzxBgCMB9MwKToMPXGntsxvPWnndp8O0p_R8',
    stats: { words: 1200, chapters: 1, kudos: 10, date: '2021-01-01', status: 'Complete' },
    content: simpleContent,
  },
  {
    id: 'jjk-1',
    slug: 'all-you-can-save',
    title: 'Всё, что успеешь спасти',
    author: 'Nightmare Boy',
    type: 'Fanfic',
    rating: '18+',
    fandom: 'Jujutsu Kaisen',
    pairings: ['Мегуми Фушигуро/Юджи Итадори', 'Сатору Годжо/Сугуру Гето'],
    characters: [
      {name: "Мегуми Фушигуро", role: "Main"},
      {name: "Юджи Итадори", role: "Main"},
      {name: "Сатору Годжо", role: "Secondary"},
      {name: "Сугуру Гето", role: "Secondary"},
      {name: "Нобара Кугисаки", role: "Secondary"},
      {name: "Сукуна Рёмен", role: "Secondary"},
    ],
    warnings: ['Насилие', 'Нецензурная лексика', 'Смерть второстепенных персонажей'],
    tags: [
      'AU: Без магии',
      'Hurt/Comfort',
      'Альбинизм',
      'Исторические эпохи',
      'Развитие отношений',
      'Романтика',
      'Детектив',
      'Слоуберн',
      'Элементы ангста'
    ],
    series: 'Итафуши',
    summary:
      '1950-ые!au, где Юджи и Мегуми знакомятся на последнем году обучения в школе и их жизни начинают сплетаться друг с другом. Они узнают, что у опекуна Мегуми, их школьного учителя по математике Годжо Сатору, в прошлом был близкий друг по имени Сугуру, и вместе решают его найти.',
    notes:
      'Эта история в первую очередь про романтические отношения Юджи и Мегуми, но кроме них она ещё и о том, какое влияние оказывают на ребят их близкие люди. О Юджи до определённого момента заботился его дедушка...',
    coverUrl: 'https://i.pinimg.com/736x/8b/6e/c3/8b6ec30768407481861ec379204052fa.jpg', // Placeholder image similar to style
    stats: {
      words: 85772,
      chapters: 21,
      kudos: 316,
      comments: 186,
      bookmarks: 99,
      date: '2025-04-06',
      status: 'In Progress'
    },
    content: '<p>Текст первой главы...</p>' // Используем заглушку
  },
]
