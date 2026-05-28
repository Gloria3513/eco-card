/**
 * EcoCard Hero (에코카드 히어로) - Core Logic & Sound Synth Engine
 */

// --- 1. GAME DATA & SVG ILLUSTRATIONS ---
const WASTE_DATABASE = [
  {
    id: 'clear-pet',
    name: '투명 페트병',
    category: 'plastic',
    tip: '라벨 제거 & 찌그러트리기',
    explanation: '내용물을 비우고 라벨을 떼어낸 뒤, 찌그러트려서 투명 페트병 전용 수거함에 분리배출해야 합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <rect x="42" y="10" width="16" height="12" rx="3" fill="#0284c7" />
      <rect x="45" y="22" width="10" height="8" fill="#e2e8f0" />
      <path d="M40 30 C40 30 25 45 25 55 L25 100 C25 105 30 110 35 110 L65 110 C70 110 75 105 75 100 L75 55 C75 45 60 30 60 30 Z" fill="url(#pet-grad)" stroke="#0284c7" stroke-width="2.5" />
      <path d="M35 55 L65 55 M35 70 L65 70 M35 85 L65 85" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" />
      <path d="M45 42 L55 42 L52 48 L55 48 L48 54" stroke="#a3e635" stroke-width="2" fill="none" />
    </svg>`
  },
  {
    id: 'milk-carton',
    name: '깨끗한 우유팩',
    category: 'paper-carton',
    tip: '물에 헹군 뒤 넓게 펼쳐서 건조',
    explanation: '일반 폐지와 섞이지 않도록 물로 씻은 뒤 펼쳐서 건조한 후, 종이팩 전용 수거함에 넣어야 합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="carton-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <path d="M30 45 L50 20 L70 45 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5" />
      <path d="M50 20 L70 25 L70 45 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2" />
      <rect x="30" y="45" width="40" height="60" rx="2" fill="url(#carton-grad)" stroke="#94a3b8" stroke-width="2.5" />
      <path d="M30 45 L50 55 L70 45" fill="none" stroke="#94a3b8" stroke-width="1.5" />
      <!-- Cow Spot/Eco Logo -->
      <circle cx="50" cy="75" r="10" fill="#f59e0b" fill-opacity="0.2" />
      <path d="M47 72 C49 70 51 70 53 72 C55 74 55 76 53 78 C51 80 49 80 47 78 Z" fill="#f59e0b" />
    </svg>`
  },
  {
    id: 'aluminum-can',
    name: '알루미늄 음료캔',
    category: 'can-glass',
    tip: '내용물 비우고 압착하여 배출',
    explanation: '내용물을 모두 비우고 가볍게 물로 헹군 다음 발로 밟아 납작하게 만들어 캔 전용함에 배출합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="can-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="50%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="20" rx="20" ry="6" fill="#e2e8f0" stroke="#475569" stroke-width="2.5" />
      <ellipse cx="50" cy="20" rx="10" ry="3" fill="#475569" />
      <path d="M30 20 L30 100 C30 106 70 106 70 100 L70 20 Z" fill="url(#can-grad)" stroke="#475569" stroke-width="2.5" />
      <ellipse cx="50" cy="100" rx="20" ry="6" fill="#64748b" stroke="#475569" stroke-width="2" />
      <rect x="42" y="50" width="16" height="12" rx="2" fill="#e11d48" fill-opacity="0.3" />
      <text x="50" y="60" font-family="'Outfit'" font-size="10" font-weight="900" fill="#e11d48" text-anchor="middle">CAN</text>
    </svg>`
  },
  {
    id: 'apple-core',
    name: '사과 음식물 쓰레기',
    category: 'general-food',
    tip: '동물 사료로 쓰일 수 있는 부드러운 상태',
    explanation: '사과 껍질이나 씨 같은 잔여물은 부드럽고 잘 부서지므로 동물 사료 및 퇴비로 가공 가능한 음식물 쓰레기입니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 20 Q54 10 58 18" fill="none" stroke="#854d0e" stroke-width="3" stroke-linecap="round" />
      <path d="M56 12 C62 10 65 15 58 18 C58 18 56 12 56 12 Z" fill="#4ade80" />
      <!-- Apple Meat top and bottom -->
      <path d="M30 45 C30 30 70 30 70 45 C65 52 35 52 30 45 Z" fill="#fef08a" stroke="#854d0e" stroke-width="1.5" />
      <path d="M30 75 C35 68 65 68 70 75 C70 90 30 90 30 75 Z" fill="#fef08a" stroke="#854d0e" stroke-width="1.5" />
      <!-- Apple Core Stem -->
      <rect x="47" y="40" width="6" height="40" rx="2" fill="#eab308" />
      <!-- Seeds -->
      <circle cx="44" cy="60" r="3" fill="#451a03" />
      <circle cx="56" cy="58" r="3" fill="#451a03" />
      <!-- Red Skin outlines -->
      <path d="M30 45 C24 50 24 70 30 75" fill="none" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />
      <path d="M70 45 C76 50 76 70 70 75" fill="none" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'broken-glass',
    name: '깨진 유리잔',
    category: 'general-food',
    tip: '신문지에 싸서 일반 쓰레기로!',
    explanation: '깨진 유리는 재활용 선별 과정에서 작업자를 다치게 하므로 재활용이 절대 불가능합니다. 신문지에 겹겹이 싸서 일반쓰레기로 버려야 합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.3"/>
        </linearGradient>
      </defs>
      <!-- Left shard -->
      <path d="M25 25 L45 25 L40 60 L20 70 L25 25 Z" fill="url(#glass-grad)" stroke="#64748b" stroke-width="2.5" />
      <!-- Right shard -->
      <path d="M55 25 L75 25 L80 80 L62 82 L55 25 Z" fill="url(#glass-grad)" stroke="#64748b" stroke-width="2.5" />
      <!-- Bottom base broken -->
      <path d="M48 95 L52 95 L50 70 L48 95 Z" fill="url(#glass-grad)" stroke="#64748b" stroke-width="2" />
      <ellipse cx="50" cy="98" rx="18" ry="4" fill="none" stroke="#64748b" stroke-width="2.5" />
      <!-- Warning Sparkles -->
      <path d="M40 45 L48 50 M56 42 L64 48 M45 75 L55 70" stroke="#f87171" stroke-width="2.5" />
    </svg>`
  },
  {
    id: 'dirty-ramen',
    name: '씻지 않은 컵라면 용기',
    category: 'general-food',
    tip: '오염된 스티로폼은 일반 쓰레기',
    explanation: '스티로폼 용기에 빨간 국물 자국 등의 이물질이 씻기지 않고 배어 있는 경우, 재활용 가치가 없어 일반쓰레기로 배출해야 합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 35 L80 35 L70 85 C68 95 32 95 30 85 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5" />
      <ellipse cx="50" cy="35" rx="30" ry="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" />
      <!-- Red stains inside and out -->
      <path d="M30 35 Q50 48 70 35" fill="none" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
      <path d="M35 55 Q42 65 40 75" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
      <path d="M60 48 Q65 60 62 70" fill="none" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round" />
      <text x="50" y="20" font-family="'Outfit'" font-size="8" fill="#ef4444" font-weight="bold" text-anchor="middle">❌ NO RECYCLE</text>
    </svg>`
  },
  {
    id: 'clean-styrofoam',
    name: '깨끗한 스티로폼',
    category: 'plastic',
    tip: '테이프/택배송장 완전히 제거',
    explanation: '이물질이 묻지 않은 순수한 하얀색 스티로폼 상자는 테이프와 택배송장 스티커를 전부 떼어낸 뒤 플라스틱(스티로폼) 수거함으로 분리배출합니다.',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,20 85,35 85,75 50,90 15,75 15,35" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" />
      <polygon points="50,20 50,90" fill="none" stroke="#cbd5e1" stroke-width="2" />
      <polygon points="15,35 50,52 85,35" fill="none" stroke="#cbd5e1" stroke-width="2" />
      <!-- Sparkle highlights for cleanliness -->
      <path d="M25 20 L25 12 M21 16 L29 16" stroke="#10b981" stroke-width="1.5" />
      <path d="M78 80 L78 72 M74 76 L82 76" stroke="#10b981" stroke-width="1.5" />
    </svg>`
  }
];

const CARDS_DATABASE = [
  {
    id: 'carbon-footprint',
    badge: '환경 지표',
    title: '탄소 발자국',
    tip: 'Carbon Footprint',
    definition: '개인이나 단체가 일상생활 속에서 상품을 생산하고 소비하는 전체 과정에서 발생하는 온실가스(특히 이산화탄소)의 총량을 뜻합니다.',
    example: '샤워 시간을 1분 줄이거나 대중교통을 이용하면 나만의 탄소 발자국 지수가 획기적으로 낮아져요!',
    icon: '👣'
  },
  {
    id: 'net-zero',
    badge: '글로벌 약속',
    title: '탄소 중립',
    tip: 'Net Zero',
    definition: '실질적인 온실가스 배출량을 "0"으로 만드는 것. 배출하는 온실가스 양과 흡수(조림 사업, 탄소 포집 등)하는 온실가스 양을 같게 만들어 순 배출을 제로로 만듭니다.',
    example: '산림을 조성하여 탄소를 가두고, 석탄 발전을 태양광 및 풍력 에너지로 전환하여 넷제로를 달성해요.',
    icon: '🍃'
  },
  {
    id: 'upcycling',
    badge: '자원 순환',
    title: '업사이클링',
    tip: 'Upcycling (새활용)',
    definition: '단순히 폐기물을 다시 쓰는 재활용(Recycling)을 넘어, 디자인이나 활용도를 더해 아예 새로운 고부가가치 친환경 제품으로 재탄생시키는 행위입니다.',
    example: '버려진 트럭 방수포 천을 씻고 재단하여 방수 기능이 뛰어난 힙한 패션 가방이나 지갑을 제작해요!',
    icon: '🎨'
  },
  {
    id: 're100',
    badge: '기업 캠페인',
    title: 'RE100',
    tip: 'Renewable Energy 100%',
    definition: '기업이 사용하는 전력량의 100%를 화석연료가 아닌 태양광, 풍력 등 무공해 재생에너지(Renewable Energy)로만 충당하겠다는 자발적 글로벌 캠페인입니다.',
    example: '세계적인 글로벌 IT 기업들이 반도체 공장을 오직 태양광과 풍력 발전소 발전량만으로 운영하기 시작했어요.',
    icon: '⚡'
  },
  {
    id: 'greenwashing',
    badge: '주의해야 할 현상',
    title: '그린워싱',
    tip: 'Greenwashing (위장 환경주의)',
    definition: '실제로는 친환경적이지 않음에도 불구하고, 허위 광고나 일부 친환경 마케팅을 전면에 내세워 마치 엄청난 에코 기업인 것처럼 소비자를 기만하는 행위입니다.',
    example: '플라스틱 일회용 컵을 과다 생산하면서 단순히 초록색 자연 나뭇잎 로고를 박아 에코 마크인 것처럼 위장하는 마케팅.',
    icon: '⚠️'
  },
  {
    id: 'circular-economy',
    badge: '미래 경제체제',
    title: '순환 경제',
    tip: 'Circular Economy',
    definition: '한 번 쓰고 버리는 기존의 선형 경제 선순환 체제를 극복하고, 자원을 최대한 오랫동안 보존하며 재사용, 재제조하여 폐기물 발생을 제로에 가깝게 줄이는 친환경 경제 구조입니다.',
    example: '가전제품을 구매하는 대신 기업으로부터 렌탈하여 사용 후 본사에서 부품을 완벽히 회수해 재조립하는 생태계.',
    icon: '🔄'
  }
];

const ECO_LEVELS = [
  { minScore: 0, name: '에코 입문자', emoji: '🌱', power: '친환경 의욕 충만한 새싹급 시민' },
  { minScore: 50, name: '에코 가디언', emoji: '🌿', power: '올바른 분리배출을 전파하기 시작한 수호자' },
  { minScore: 150, name: '에코 히어로', emoji: '🌳', power: '탄소 중립의 원리를 꿰뚫은 친환경 영웅' },
  { minScore: 300, name: '지구 프렌즈 마스터', emoji: '✨🌍', power: '완벽한 자원순환을 이룩한 위대한 지구 지킴이' }
];

// --- 2. GAME STATE ---
let state = {
  score: 0,
  highScore: 0,
  streak: 0,
  levelIndex: 0,
  currentView: 'trash', // 'trash' or 'cards'
  soundEnabled: true,
  
  // Game 1: Waste Classification State
  wasteIndex: 0,
  wasteOrder: [],
  selectedChoice: null, // user selected bin category
  answeredCorrectly: null,
  
  // Game 2: Flashcard State
  cardIndex: 0,
  cardFlipped: false
};

// --- 3. WEB AUDIO SYNTHESIZER ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Custom retro sound effects synthesizer
 */
const synth = {
  playPing() {
    if (!state.soundEnabled) return;
    initAudio();
    const t = audioCtx.currentTime;
    
    // Satisfying double ping (retro sound)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, t); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15); // C6
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, t); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.51, t + 0.12); // E6
    
    gainNode.gain.setValueAtTime(0.12, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  },
  
  playBuzz() {
    if (!state.soundEnabled) return;
    initAudio();
    const t = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.35); // downwards pitch slide
    
    gainNode.gain.setValueAtTime(0.15, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    
    // Low pass filter to make it warmer and less harsh
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.45);
  },
  
  playWhoosh() {
    if (!state.soundEnabled) return;
    initAudio();
    const t = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);
    
    gainNode.gain.setValueAtTime(0.01, t);
    gainNode.gain.linearRampToValueAtTime(0.08, t + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.4);
  },
  
  playLevelUp() {
    if (!state.soundEnabled) return;
    initAudio();
    const t = audioCtx.currentTime;
    
    // 4-note ascending retro arpeggio chord!
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50]; // C4, E4, G4, C5, E5, C6
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + index * 0.08);
      
      gainNode.gain.setValueAtTime(0.08, t + index * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + index * 0.08 + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(t + index * 0.08);
      osc.stop(t + index * 0.08 + 0.35);
    });
  }
};

// --- 4. CANVAS CONFETTI PARTICLE SYSTEM ---
const canvas = document.getElementById('effect-canvas');
let ctx = null;
let particles = [];
let animationId = null;

function setupCanvas() {
  if (canvas) {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

class Particle {
  constructor(x, y, colorType) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    this.speedX = (Math.random() - 0.5) * 16;
    this.speedY = (Math.random() - 0.7) * 16 - 4; // initially burst upwards
    this.gravity = 0.35;
    this.drag = 0.98;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    
    // Choose beautiful eco-themed leaf colors
    if (colorType === 'eco') {
      const hues = [120, 142, 160, 80]; // vibrant greens, teals, lime
      this.hue = hues[Math.floor(Math.random() * hues.length)];
      this.color = `hsl(${this.hue}, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 40}%)`;
    } else {
      // Level-up celebration gold sparks!
      this.color = `hsl(${Math.random() * 15 + 42}, 100%, ${Math.random() * 20 + 50}%)`;
    }
    
    this.alpha = 1;
    this.fade = Math.random() * 0.015 + 0.01;
    this.isLeaf = Math.random() > 0.3; // Leaf shape vs sparkles
  }

  update() {
    this.speedX *= this.drag;
    this.speedY += this.gravity;
    this.speedY *= this.drag;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.fade;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    if (this.isLeaf) {
      // Draw crisp leaf vector
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.2, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.2, 0, -this.size);
      ctx.fill();
    } else {
      // Draw diamond sparkling stars
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 0.6, 0);
      ctx.lineTo(0, this.size);
      ctx.lineTo(-this.size * 0.6, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

function spawnParticleBurst(x, y, amount, type = 'eco') {
  for (let i = 0; i < amount; i++) {
    particles.push(new Particle(x, y, type));
  }
  if (!animationId) {
    updateParticles();
  }
}

function updateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0) {
    animationId = requestAnimationFrame(updateParticles);
  } else {
    animationId = null;
  }
}

// --- 5. LOCAL STORAGE UTILITIES ---
function saveGameData() {
  const localData = {
    score: state.score,
    highScore: state.highScore,
    soundEnabled: state.soundEnabled,
    levelIndex: state.levelIndex
  };
  localStorage.setItem('ecocard_hero_save', JSON.stringify(localData));
}

function loadGameData() {
  const raw = localStorage.getItem('ecocard_hero_save');
  if (raw) {
    try {
      const data = JSON.parse(raw);
      state.score = data.score || 0;
      state.highScore = data.highScore || 0;
      state.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
      state.levelIndex = data.levelIndex || 0;
    } catch (e) {
      console.error("Error loading local eco data:", e);
    }
  }
}

// --- 6. STATE MANIPULATION & UI RENDERING ---

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initGameOrder() {
  state.wasteOrder = shuffleArray(WASTE_DATABASE);
  state.wasteIndex = 0;
}

/**
 * Evaluates score levels and prompts congratulations modal if leveled up!
 */
function checkLevelProgression() {
  let targetLvl = 0;
  for (let i = ECO_LEVELS.length - 1; i >= 0; i--) {
    if (state.score >= ECO_LEVELS[i].minScore) {
      targetLvl = i;
      break;
    }
  }
  
  if (targetLvl > state.levelIndex) {
    state.levelIndex = targetLvl;
    // Unveils level up overlay!
    const lvlInfo = ECO_LEVELS[targetLvl];
    document.getElementById('modal-emoji').innerText = lvlInfo.emoji;
    document.getElementById('modal-lvl-title').innerText = `${lvlInfo.name} 달성!`;
    document.getElementById('modal-lvl-power').innerText = lvlInfo.power;
    document.getElementById('level-up-modal').classList.add('active');
    
    // Play celebratory sound arpeggio
    setTimeout(() => {
      synth.playLevelUp();
      // Burst golden stars around the screen
      spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2 - 100, 80, 'gold');
    }, 250);
  }
}

function updateScoreboard() {
  document.getElementById('score-value').innerText = state.score;
  document.getElementById('streak-value').innerText = `${state.streak}🔥`;
  
  if (state.score > state.highScore) {
    state.highScore = state.score;
  }
  document.getElementById('best-value').innerText = state.highScore;
  
  // Update Level indicators
  const currentLvl = ECO_LEVELS[state.levelIndex];
  document.getElementById('badge-emoji').innerText = currentLvl.emoji;
  document.getElementById('badge-name').innerText = currentLvl.name;
  
  // Calculate Progress percentage to next level
  let progressPct = 100;
  const nextLvl = ECO_LEVELS[state.levelIndex + 1];
  const currentMin = currentLvl.minScore;
  
  if (nextLvl) {
    const range = nextLvl.minScore - currentMin;
    const offset = state.score - currentMin;
    progressPct = Math.max(0, Math.min(100, (offset / range) * 100));
  }
  
  document.getElementById('lvl-progress-bar').style.width = `${progressPct}%`;
  saveGameData();
}

/**
 * Mode 1: waste card rendering
 */
function renderWasteCard() {
  const currentItem = state.wasteOrder[state.wasteIndex];
  if (!currentItem) return;
  
  const container = document.getElementById('waste-card-box');
  container.className = 'waste-card'; // reset status
  
  // Set illustration and titles
  document.getElementById('waste-illustration').innerHTML = currentItem.svg;
  document.getElementById('waste-name').innerText = currentItem.name;
  document.getElementById('waste-badge-tip').innerText = `💡 ${currentItem.tip}`;
  
  // Clear any existing explanation box
  const explBox = document.getElementById('explanation-banner');
  explBox.style.display = 'none';
  
  // Reset user interact states
  state.selectedChoice = null;
  state.answeredCorrectly = null;
}

/**
 * Handle recycling bin decision
 */
function selectRecycleBin(category, binElement) {
  if (state.answeredCorrectly !== null) return; // Prevent double taps during card switch animations
  
  const currentItem = state.wasteOrder[state.wasteIndex];
  const cardElement = document.getElementById('waste-card-box');
  
  const rect = binElement.getBoundingClientRect();
  const clickX = rect.left + rect.width / 2;
  const clickY = rect.top + rect.height / 2;
  
  if (currentItem.category === category) {
    // CORRECT ANSWER!
    state.answeredCorrectly = true;
    state.streak++;
    
    // Streak multiplier points
    const bonus = state.streak >= 5 ? 15 : 10;
    state.score += bonus;
    
    cardElement.classList.add('correct');
    synth.playPing();
    
    // Spawn floating score pop-up
    showScorePop(clickX, clickY, `+${bonus}`, 'plus');
    // Spawn beautiful leaves particles
    spawnParticleBurst(clickX, clickY, 25, 'eco');
    
    // Render feedback explanation immediately
    renderExplanation(currentItem, true);
    
    // Proceed to next card after delay
    setTimeout(() => {
      state.wasteIndex++;
      if (state.wasteIndex >= state.wasteOrder.length) {
        initGameOrder(); // reshuffle when run out
      }
      renderWasteCard();
      updateScoreboard();
      checkLevelProgression();
    }, 1800);
    
  } else {
    // WRONG ANSWER!
    state.answeredCorrectly = false;
    state.streak = 0; // Break combo streak
    
    cardElement.classList.add('wrong');
    synth.playBuzz();
    
    showScorePop(clickX, clickY, `TRY AGAIN`, 'minus');
    
    renderExplanation(currentItem, false);
    
    // Reset card animation so user can try again
    setTimeout(() => {
      cardElement.classList.remove('wrong');
      state.answeredCorrectly = null;
    }, 1200);
  }
}

function showScorePop(x, y, text, type) {
  const pop = document.createElement('div');
  pop.className = `score-pop ${type}`;
  pop.innerText = text;
  pop.style.left = `${x - 40}px`;
  pop.style.top = `${y - 20}px`;
  
  document.body.appendChild(pop);
  
  setTimeout(() => {
    pop.remove();
  }, 1000);
}

function renderExplanation(item, isCorrect) {
  const banner = document.getElementById('explanation-banner');
  const title = document.getElementById('expl-title-text');
  const text = document.getElementById('expl-desc-text');
  const icon = document.getElementById('expl-icon-badge');
  
  banner.style.display = 'flex';
  
  if (isCorrect) {
    banner.style.background = 'rgba(16, 185, 129, 0.08)';
    banner.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    icon.innerText = '✅';
    icon.style.color = 'var(--color-primary)';
    title.innerText = '멋져요! 완벽한 분리수거 수칙';
  } else {
    banner.style.background = 'rgba(248, 113, 113, 0.08)';
    banner.style.borderColor = 'rgba(248, 113, 113, 0.3)';
    icon.innerText = '⚠️';
    icon.style.color = 'var(--color-danger)';
    title.innerText = '앗, 다시 한 번 확인해 볼까요?';
  }
  
  text.innerText = item.explanation;
}

/**
 * Mode 2: Carbon Neutrality Flashcards rendering
 */
function renderFlashcard() {
  const cardData = CARDS_DATABASE[state.cardIndex];
  if (!cardData) return;
  
  // Reset rotation state
  state.cardFlipped = false;
  document.getElementById('flash-card-inner').classList.remove('flipped');
  
  // Front face mapping
  document.getElementById('card-badge').innerText = cardData.badge;
  document.getElementById('card-front-icon').innerText = cardData.icon;
  document.getElementById('card-front-title').innerText = cardData.title;
  document.getElementById('card-front-tip').innerText = cardData.tip;
  
  // Back face mapping
  document.getElementById('card-back-title').innerText = cardData.title;
  document.getElementById('card-back-definition').innerText = cardData.definition;
  document.getElementById('card-back-example').innerText = cardData.example;
  
  // Indicators
  document.getElementById('card-idx-indicator').innerText = `${state.cardIndex + 1} / ${CARDS_DATABASE.length}`;
  document.getElementById('prev-card-btn').disabled = state.cardIndex === 0;
  document.getElementById('next-card-btn').disabled = state.cardIndex === CARDS_DATABASE.length - 1;
}

function handleCardFlip() {
  state.cardFlipped = !state.cardFlipped;
  const inner = document.getElementById('flash-card-inner');
  
  if (state.cardFlipped) {
    inner.classList.add('flipped');
  } else {
    inner.classList.remove('flipped');
  }
  
  synth.playWhoosh();
}

/**
 * Handles learning confirmation (Got it! button)
 */
function verifyCardLearned() {
  synth.playPing();
  
  // Trigger particle burst on card
  const rect = document.getElementById('flash-card-box').getBoundingClientRect();
  const burstX = rect.left + rect.width / 2;
  const burstY = rect.top + rect.height / 2;
  
  spawnParticleBurst(burstX, burstY, 20, 'eco');
  showScorePop(burstX, burstY, '배움 +10', 'plus');
  
  state.score += 10;
  updateScoreboard();
  checkLevelProgression();
  
  showToast('🌱 지식이 향상되었습니다! 탄소 중립 에코 파워 10P 충전 완료.');
  
  // Auto flip back and progress to next card
  setTimeout(() => {
    if (state.cardIndex < CARDS_DATABASE.length - 1) {
      state.cardIndex++;
      renderFlashcard();
    } else {
      showToast('🎉 모든 탄소 중립 개념을 마스터하셨습니다! 대단해요!');
      // Cycle back
      state.cardIndex = 0;
      renderFlashcard();
    }
  }, 1000);
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-text').innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// --- 7. EVENT LISTENERS & INITS ---

document.addEventListener('DOMContentLoaded', () => {
  loadGameData();
  setupCanvas();
  initGameOrder();
  
  // Init view states
  renderWasteCard();
  renderFlashcard();
  updateScoreboard();
  
  // 1. Tab switches
  const btnTrashMode = document.getElementById('tab-trash-game');
  const btnCardsMode = document.getElementById('tab-flashcards');
  
  btnTrashMode.addEventListener('click', () => {
    if (state.currentView === 'trash') return;
    state.currentView = 'trash';
    btnTrashMode.classList.add('active');
    btnCardsMode.classList.remove('active');
    
    document.getElementById('trash-game-view').classList.add('active');
    document.getElementById('flashcards-view').classList.remove('active');
    
    synth.playWhoosh();
  });
  
  btnCardsMode.addEventListener('click', () => {
    if (state.currentView === 'cards') return;
    state.currentView = 'cards';
    btnCardsMode.classList.add('active');
    btnTrashMode.classList.remove('active');
    
    document.getElementById('flashcards-view').classList.add('active');
    document.getElementById('trash-game-view').classList.remove('active');
    
    synth.playWhoosh();
  });
  
  // 2. Sound Switch Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  
  // Initial Sync
  if (state.soundEnabled) {
    soundIcon.innerText = '🔊';
  } else {
    soundIcon.innerText = '🔇';
  }
  
  soundBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      soundIcon.innerText = '🔊';
      showToast('소리 효과가 활성화되었습니다.');
      initAudio();
      synth.playPing();
    } else {
      soundIcon.innerText = '🔇';
      showToast('음소거 모드가 설정되었습니다.');
    }
    saveGameData();
  });
  
  // 3. Bin selections (Mode 1)
  const bins = document.querySelectorAll('.bin-button');
  bins.forEach(bin => {
    bin.addEventListener('click', () => {
      const cat = bin.getAttribute('data-bin');
      selectRecycleBin(cat, bin);
    });
  });
  
  // 4. Interactive Card Flips (Mode 2)
  const flashCard = document.getElementById('flash-card-box');
  flashCard.addEventListener('click', (e) => {
    // Avoid double trigger if clicking buttons inside the scene
    if (e.target.closest('.knowledge-verdict') || e.target.closest('.card-actions-wrapper')) {
      return;
    }
    handleCardFlip();
  });
  
  // Study verification (Got it / study again)
  document.getElementById('btn-study-again').addEventListener('click', () => {
    synth.playWhoosh();
    handleCardFlip(); // Flip card back to try memorizing again
  });
  
  document.getElementById('btn-learned-gotit').addEventListener('click', () => {
    verifyCardLearned();
  });
  
  // Flashcard navigations
  document.getElementById('prev-card-btn').addEventListener('click', () => {
    if (state.cardIndex > 0) {
      state.cardIndex--;
      renderFlashcard();
      synth.playWhoosh();
    }
  });
  
  document.getElementById('next-card-btn').addEventListener('click', () => {
    if (state.cardIndex < CARDS_DATABASE.length - 1) {
      state.cardIndex++;
      renderFlashcard();
      synth.playWhoosh();
    }
  });
  
  // 5. Level up modal dismissing
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('level-up-modal').classList.remove('active');
    synth.playPing();
  });
});
