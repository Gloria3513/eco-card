"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Trash2, RotateCcw, Award, ChevronLeft, ChevronRight, HelpCircle, Check, Info } from "lucide-react";

// --- 1. GAME TYPES & DATABASES ---
interface WasteItem {
  id: string;
  name: string;
  category: "plastic" | "paper-carton" | "can-glass" | "general-food";
  tip: string;
  explanation: string;
  jsxSvg: React.ReactNode;
}

interface Flashcard {
  id: string;
  badge: string;
  title: string;
  tip: string;
  definition: string;
  example: string;
  icon: string;
}

interface EcoLevel {
  minScore: number;
  name: string;
  emoji: string;
  power: string;
}

const ECO_LEVELS: EcoLevel[] = [
  { minScore: 0, name: "에코 입문자", emoji: "🌱", power: "친환경 의욕 충만한 새싹급 시민" },
  { minScore: 50, name: "에코 가디언", emoji: "🌿", power: "올바른 분리배출을 전파하기 시작한 수호자" },
  { minScore: 150, name: "에코 히어로", emoji: "🌳", power: "탄소 중립의 원리를 꿰뚫은 친환경 영웅" },
  { minScore: 300, name: "지구 프렌즈 마스터", emoji: "✨🌍", power: "완벽한 자원순환을 이룩한 위대한 지구 지킴이" }
];

const CARDS_DATABASE: Flashcard[] = [
  {
    id: "carbon-footprint",
    badge: "환경 지표",
    title: "탄소 발자국",
    tip: "Carbon Footprint",
    definition: "개인이나 단체가 일상생활 속에서 상품을 생산하고 소비하는 전체 과정에서 발생하는 온실가스(특히 이산화탄소)의 총량을 뜻합니다.",
    example: "샤워 시간을 1분 줄이거나 대중교통을 이용하면 나만의 탄소 발자국 지수가 획기적으로 낮아져요!",
    icon: "👣"
  },
  {
    id: "net-zero",
    badge: "글로벌 약속",
    title: "탄소 중립",
    tip: "Net Zero",
    definition: "실질적인 온실가스 배출량을 '0'으로 만드는 것. 배출하는 온실가스 양과 흡수(조림 사업, 탄소 포집 등)하는 온실가스 양을 같게 만들어 순 배출을 제로로 만듭니다.",
    example: "산림을 조성하여 탄소를 가두고, 석탄 발전을 태양광 및 풍력 에너지로 전환하여 넷제로를 달성해요.",
    icon: "🍃"
  },
  {
    id: "upcycling",
    badge: "자원 순환",
    title: "업사이클링",
    tip: "Upcycling (새활용)",
    definition: "단순히 폐기물을 다시 쓰는 재활용(Recycling)을 넘어, 디자인이나 활용도를 더해 아예 새로운 고부가가치 친환경 제품으로 재탄생시키는 행위입니다.",
    example: "버려진 트럭 방수포 천을 씻고 재단하여 방수 기능이 뛰어난 힙한 패션 가방이나 지갑을 제작해요!",
    icon: "🎨"
  },
  {
    id: "re100",
    badge: "기업 캠페인",
    title: "RE100",
    tip: "Renewable Energy 100%",
    definition: "기업이 사용하는 전력량의 100%를 화석연료가 아닌 태양광, 풍력 등 무공해 재생에너지(Renewable Energy)로만 충당하겠다는 자발적 글로벌 캠페인입니다.",
    example: "세계적인 글로벌 IT 기업들이 반도체 공장을 오직 태양광과 풍력 발전소 발전량만으로 운영하기 시작했어요.",
    icon: "⚡"
  },
  {
    id: "greenwashing",
    badge: "주의해야 할 현상",
    title: "그린워싱",
    tip: "Greenwashing (위장 환경주의)",
    definition: "실제로는 친환경적이지 않음에도 불구하고, 허위 광고나 일부 친환경 마케팅을 전면에 내세워 마치 엄청난 에코 기업인 것처럼 소비자를 기만하는 행위입니다.",
    example: "플라스틱 일회용 컵을 과다 생산하면서 단순히 초록색 자연 나뭇잎 로고를 박아 에코 마크인 것처럼 위장하는 마케팅.",
    icon: "⚠️"
  },
  {
    id: "circular-economy",
    badge: "미래 경제체제",
    title: "순환 경제",
    tip: "Circular Economy",
    definition: "한 번 쓰고 버리는 기존의 선형 경제 선순환 체제를 극복하고, 자원을 최대한 오랫동안 보존하며 재사용, 재제조하여 폐기물 발생을 제로에 가깝게 줄이는 친환경 경제 구조입니다.",
    example: "가전제품을 구매하는 대신 기업으로부터 렌탈하여 사용 후 본사에서 부품을 완벽히 회수해 재조립하는 생태계.",
    icon: "🔄"
  }
];

const WASTE_DATABASE: WasteItem[] = [
  {
    id: "clear-pet",
    name: "투명 페트병",
    category: "plastic",
    tip: "라벨 제거 & 찌그러트리기",
    explanation: "내용물을 비우고 라벨을 떼어낸 뒤, 찌그러트려서 투명 페트병 전용 수거함에 분리배출해야 합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#0284c7" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <rect x="42" y="10" width="16" height="12" rx="3" fill="#0284c7" />
        <rect x="45" y="22" width="10" height="8" fill="#e2e8f0" />
        <path d="M40 30 C40 30 25 45 25 55 L25 100 C25 105 30 110 35 110 L65 110 C70 110 75 105 75 100 L75 55 C75 45 60 30 60 30 Z" fill="url(#pet-grad)" stroke="#0284c7" strokeWidth="2.5" />
        <path d="M35 55 L65 55 M35 70 L65 70 M35 85 L65 85" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M45 42 L55 42 L52 48 L55 48 L48 54" stroke="#a3e635" strokeWidth={2} fill="none" />
      </svg>
    )
  },
  {
    id: "milk-carton",
    name: "깨끗한 우유팩",
    category: "paper-carton",
    tip: "물에 헹군 뒤 넓게 펼쳐서 건조",
    explanation: "일반 폐지와 섞이지 않도록 물로 씻은 뒤 펼쳐서 건조한 후, 종이팩 전용 수거함에 넣어야 합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="carton-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <path d="M30 45 L50 20 L70 45 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
        <path d="M50 20 L70 25 L70 45 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
        <rect x="30" y="45" width="40" height="60" rx="2" fill="url(#carton-grad)" stroke="#94a3b8" strokeWidth="2.5" />
        <path d="M30 45 L50 55 L70 45" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="50" cy="75" r="10" fill="#f59e0b" fillOpacity={0.2} />
        <path d="M47 72 C49 70 51 70 53 72 C55 74 55 76 53 78 C51 80 49 80 47 78 Z" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: "aluminum-can",
    name: "알루미늄 음료캔",
    category: "can-glass",
    tip: "내용물 비우고 압착하여 배출",
    explanation: "내용물을 모두 비우고 가볍게 물로 헹군 다음 발로 밟아 납작하게 만들어 캔 전용함에 배출합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="can-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="20" rx="20" ry="6" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
        <ellipse cx="50" cy="20" rx="10" ry="3" fill="#475569" />
        <path d="M30 20 L30 100 C30 106 70 106 70 100 L70 20 Z" fill="url(#can-grad)" stroke="#475569" strokeWidth="2.5" />
        <ellipse cx="50" cy="100" rx="20" ry="6" fill="#64748b" stroke="#475569" strokeWidth="2" />
        <rect x="42" y="50" width="16" height="12" rx="2" fill="#e11d48" fillOpacity={0.3} />
        <text x="50" y="60" fontFamily="'Outfit'" fontSize="10" fontWeight="900" fill="#e11d48" textAnchor="middle">CAN</text>
      </svg>
    )
  },
  {
    id: "apple-core",
    name: "사과 음식물 쓰레기",
    category: "general-food",
    tip: "동물 사료로 쓰일 수 있는 부드러운 상태",
    explanation: "사과 껍질이나 씨 같은 잔여물은 부드럽고 잘 부서지므로 동물 사료 및 퇴비로 가공 가능한 음식물 쓰레기입니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20 Q54 10 58 18" fill="none" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
        <path d="M56 12 C62 10 65 15 58 18 C58 18 56 12 56 12 Z" fill="#4ade80" />
        <path d="M30 45 C30 30 70 30 70 45 C65 52 35 52 30 45 Z" fill="#fef08a" stroke="#854d0e" strokeWidth="1.5" />
        <path d="M30 75 C35 68 65 68 70 75 C70 90 30 90 30 75 Z" fill="#fef08a" stroke="#854d0e" strokeWidth="1.5" />
        <rect x="47" y="40" width="6" height="40" rx="2" fill="#eab308" />
        <circle cx="44" cy="60" r="3" fill="#451a03" />
        <circle cx="56" cy="58" r="3" fill="#451a03" />
        <path d="M30 45 C24 50 24 70 30 75" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M70 45 C76 50 76 70 70 75" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "broken-glass",
    name: "깨진 유리잔",
    category: "general-food",
    tip: "신문지에 싸서 일반 쓰레기!",
    explanation: "깨진 유리는 재활용 선별 과정에서 작업자를 다치게 하므로 재활용이 절대 불가능합니다. 신문지에 겹겹이 싸서 일반쓰레기로 버려야 합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <path d="M25 25 L45 25 L40 60 L20 70 L25 25 Z" fill="url(#glass-grad)" stroke="#64748b" strokeWidth="2.5" />
        <path d="M55 25 L75 25 L80 80 L62 82 L55 25 Z" fill="url(#glass-grad)" stroke="#64748b" strokeWidth="2.5" />
        <path d="M48 95 L52 95 L50 70 L48 95 Z" fill="url(#glass-grad)" stroke="#64748b" strokeWidth="2" />
        <ellipse cx="50" cy="98" rx="18" ry="4" fill="none" stroke="#64748b" strokeWidth="2.5" />
        <path d="M40 45 L48 50 M56 42 L64 48 M45 75 L55 70" stroke="#f87171" strokeWidth="2.5" />
      </svg>
    )
  },
  {
    id: "dirty-ramen",
    name: "씻지 않은 컵라면 용기",
    category: "general-food",
    tip: "오염된 스티로폼은 일반 쓰레기",
    explanation: "스티로폼 용기에 빨간 국물 자국 등의 이물질이 씻기지 않고 배어 있는 경우, 재활용 가치가 없어 일반쓰레기로 배출해야 합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 35 L80 35 L70 85 C68 95 32 95 30 85 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
        <ellipse cx="50" cy="35" rx="30" ry="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M30 35 Q50 48 70 35" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
        <path d="M35 55 Q42 65 40 75" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 48 Q65 60 62 70" fill="none" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" />
        <text x="50" y="20" fontFamily="'Outfit'" fontSize="8" fill="#ef4444" fontWeight="bold" textAnchor="middle">❌ NO RECYCLE</text>
      </svg>
    )
  },
  {
    id: "clean-styrofoam",
    name: "깨끗한 스티로폼",
    category: "plastic",
    tip: "테이프/택배송장 완전히 제거",
    explanation: "이물질이 묻지 않은 순수한 하얀색 스티로폼 상자는 테이프와 택배송장 스티커를 전부 떼어낸 뒤 플라스틱(스티로폼) 수거함으로 분리배출합니다.",
    jsxSvg: (
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,20 85,35 85,75 50,90 15,75 15,35" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
        <polygon points="50,20 50,90" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <polygon points="15,35 50,52 85,35" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M25 20 L25 12 M21 16 L29 16" stroke="#10b981" strokeWidth="1.5" />
        <path d="M78 80 L78 72 M74 76 L82 76" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    )
  }
];

// --- 2. PHYSIC PARTICLE INTERACT ENGINE ---
class LeafParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  gravity: number;
  drag: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  alpha: number;
  fade: number;
  isLeaf: boolean;

  constructor(x: number, y: number, colorType: "eco" | "gold") {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    this.speedX = (Math.random() - 0.5) * 16;
    this.speedY = (Math.random() - 0.7) * 16 - 4; // initially burst upwards
    this.gravity = 0.35;
    this.drag = 0.98;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.alpha = 1;
    this.fade = Math.random() * 0.015 + 0.01;
    this.isLeaf = Math.random() > 0.3;
    
    if (colorType === "eco") {
      const hues = [120, 142, 160, 80]; // fresh greens & teal
      const hue = hues[Math.floor(Math.random() * hues.length)];
      this.color = `hsl(${hue}, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 40}%)`;
    } else {
      this.color = `hsl(${Math.random() * 15 + 42}, 100%, ${Math.random() * 20 + 50}%)`; // luxury golds
    }
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    if (this.isLeaf) {
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.2, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.2, 0, -this.size);
      ctx.fill();
    } else {
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

export default function Home() {
  // --- 3. REACT STATE MACHINE ---
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [currentView, setCurrentView] = useState<"trash" | "cards">("trash");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Waste classifier state
  const [wasteIndex, setWasteIndex] = useState(0);
  const [wasteOrder, setWasteOrder] = useState<WasteItem[]>([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wrongClickIndex, setWrongClickIndex] = useState<number | null>(null);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Popups & toast UI
  const [isLvlUpModalOpen, setIsLvlUpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scorePops, setScorePops] = useState<{ id: number; x: number; y: number; text: string; type: "plus" | "minus" }[]>([]);

  // Refs for audio context and Canvas particle animation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<LeafParticle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const scorePopIdCounter = useRef(0);

  // --- 4. GAME INITIALIZATION ---
  useEffect(() => {
    // Load Local eco stats
    const raw = localStorage.getItem("ecocard_hero_save");
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (saved.score !== undefined) setScore(saved.score);
        if (saved.highScore !== undefined) setHighScore(saved.highScore);
        if (saved.levelIndex !== undefined) setLevelIndex(saved.levelIndex);
        if (saved.soundEnabled !== undefined) setSoundEnabled(saved.soundEnabled);
      } catch (e) {
        console.error("Local storage decode error: ", e);
      }
    }

    // Shuffle waste objects
    const shuffled = [...WASTE_DATABASE].sort(() => Math.random() - 0.5);
    setWasteOrder(shuffled);

    // Initialise Canvas particle resize events
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    const localData = { score, highScore, soundEnabled, levelIndex };
    localStorage.setItem("ecocard_hero_save", JSON.stringify(localData));
  }, [score, highScore, soundEnabled, levelIndex]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        animationFrameIdRef.current = null;
      }
    };

    if (particlesRef.current.length > 0 && !animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [scorePops]); // Trigger loop startup on burst spawns

  // --- 5. AUDIO SYNTH ENGINE (Lazy Loader) ---
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = {
    ping() {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, t); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15); // C6

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(659.25, t); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, t + 0.12); // E6

      gainNode.gain.setValueAtTime(0.12, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.3);
      osc2.stop(t + 0.3);
    },

    buzz() {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.35);

      gainNode.gain.setValueAtTime(0.15, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, t);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    },

    whoosh() {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);

      gainNode.gain.setValueAtTime(0.01, t);
      gainNode.gain.linearRampToValueAtTime(0.08, t + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    },

    levelUp() {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + index * 0.08);

        gainNode.gain.setValueAtTime(0.08, t + index * 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + index * 0.08 + 0.3);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(t + index * 0.08);
        osc.stop(t + index * 0.08 + 0.35);
      });
    }
  };

  // --- 6. GAME UTILITIES ---
  const spawnConfetti = (x: number, y: number, amount: number, type: "eco" | "gold" = "eco") => {
    for (let i = 0; i < amount; i++) {
      particlesRef.current.push(new LeafParticle(x, y, type));
    }
    // Fire draw cycle if not running
    if (!animationFrameIdRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const renderLoop = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const particles = particlesRef.current;
          for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) particles.splice(i, 1);
          }
          if (particles.length > 0) {
            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
          } else {
            animationFrameIdRef.current = null;
          }
        };
        animationFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    }
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const pushScorePop = (x: number, y: number, text: string, type: "plus" | "minus") => {
    const id = scorePopIdCounter.current++;
    setScorePops((prev) => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setScorePops((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleLevelUpCheck = (newScore: number) => {
    let targetIndex = 0;
    for (let i = ECO_LEVELS.length - 1; i >= 0; i--) {
      if (newScore >= ECO_LEVELS[i].minScore) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex > levelIndex) {
      setLevelIndex(targetIndex);
      setIsLvlUpModalOpen(true);
      setTimeout(() => {
        playSound.levelUp();
        spawnConfetti(window.innerWidth / 2, window.innerHeight / 2 - 100, 75, "gold");
      }, 300);
    }
  };

  const handleScoreAddition = (amount: number) => {
    const nextScore = score + amount;
    setScore(nextScore);
    if (nextScore > highScore) setHighScore(nextScore);
    handleLevelUpCheck(nextScore);
  };

  // --- 7. EVENT CONTROLLERS ---
  const handleRecycleBinSubmit = (binCategory: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (answeredCorrectly !== null) return; // wait for next item trigger delay

    const activeItem = wasteOrder[wasteIndex];
    if (!activeItem) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    if (activeItem.category === binCategory) {
      // CORRECT CHOICE!
      setAnsweredCorrectly(true);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      const bonus = nextStreak >= 5 ? 15 : 10;
      handleScoreAddition(bonus);
      playSound.ping();

      pushScorePop(clickX, clickY, `+${bonus}`, "plus");
      spawnConfetti(clickX, clickY, 25, "eco");
      setShowExplanation(true);

      setTimeout(() => {
        setShowExplanation(false);
        setAnsweredCorrectly(null);
        setWasteIndex((prev) => {
          const next = prev + 1;
          if (next >= wasteOrder.length) {
            // reshuffle
            return 0;
          }
          return next;
        });
      }, 2000);
    } else {
      // WRONG CHOICE!
      setAnsweredCorrectly(false);
      setStreak(0);
      playSound.buzz();

      pushScorePop(clickX, clickY, "TRY AGAIN", "minus");
      setShowExplanation(true);

      setTimeout(() => {
        setAnsweredCorrectly(null);
      }, 1200);
    }
  };

  const toggleVolume = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      getAudioContext();
      playSound.ping();
      triggerToast("소리 효과가 활성화되었습니다. 🔊");
    } else {
      triggerToast("음소거 모드가 설정되었습니다. 🔇");
    }
  };

  const flipCard = () => {
    setCardFlipped((prev) => !prev);
    playSound.whoosh();
  };

  const handleCardLearned = () => {
    playSound.ping();
    
    // Confetti on flashcard
    const cardEl = document.getElementById("flash-card-box");
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      const burstX = rect.left + rect.width / 2;
      const burstY = rect.top + rect.height / 2;
      spawnConfetti(burstX, burstY, 20, "eco");
      pushScorePop(burstX, burstY, "배움 +10", "plus");
    }

    handleScoreAddition(10);
    triggerToast("🌱 지식이 향상되었습니다! 탄소 중립 에코 파워 10P 충전 완료.");

    // Advance to next card
    setTimeout(() => {
      setCardFlipped(false);
      setCardIndex((prev) => {
        const next = prev + 1;
        if (next >= CARDS_DATABASE.length) {
          triggerToast("🎉 모든 탄소 중립 카드를 암기하셨습니다!");
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  // Stats calculation
  const currentLvl = ECO_LEVELS[levelIndex];
  const nextLvl = ECO_LEVELS[levelIndex + 1];
  let levelProgressPct = 100;
  if (nextLvl) {
    const range = nextLvl.minScore - currentLvl.minScore;
    const currentDiff = score - currentLvl.minScore;
    levelProgressPct = Math.max(0, Math.min(100, (currentDiff / range) * 100));
  }

  const activeWasteItem = wasteOrder[wasteIndex];
  const activeFlashcard = CARDS_DATABASE[cardIndex];

  return (
    <main className="min-h-vh flex flex-col items-center relative py-6">
      
      {/* Background Glowing Layers */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      {/* Confetti Physics Layer */}
      <canvas id="effect-canvas" ref={canvasRef} />

      {/* Floating score text pops */}
      {scorePops.map((pop) => (
        <div
          key={pop.id}
          className={`score-pop ${pop.type}`}
          style={{ left: `${pop.x - 40}px`, top: `${pop.y - 20}px` }}
        >
          {pop.text}
        </div>
      ))}

      <div className="app-container">
        
        {/* 1. Header component */}
        <header className="eco-header">
          <div className="logo-section">
            <span className="logo-icon" aria-label="Sprout leaf icon">🌱</span>
            <div className="logo-text">
              <h1>EcoCard Hero</h1>
              <p>에코카드 히어로</p>
            </div>
          </div>
          <div className="utility-buttons">
            <button
              onClick={toggleVolume}
              className="icon-btn"
              title="Mute / Unmute dynamic synthesiser sound effects"
              aria-label="Sound control toggle"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </header>

        {/* 2. Interactive Stats Dashboard */}
        <section className="stat-dashboard" aria-label="Environmental scoreboard">
          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="stat-label">에코 파워</span>
              <span className="stat-value primary">{score}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">최고 점수</span>
              <span className="stat-value">{highScore}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">콤보 스트릭</span>
              <span className="stat-value secondary">{streak}🔥</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">현재 에코 레벨</span>
              <div className="stat-value" style={{ fontSize: "1.15rem", gap: "6px", paddingTop: "4px" }}>
                <span>{currentLvl.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>{currentLvl.name}</span>
              </div>
            </div>
          </div>

          {/* Growing Progress Bar */}
          <div className="bg-black/30 border border-[var(--glass-border)] p-4 rounded-2xl mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-2 font-bold">
              <span>레벨업 성장도</span>
              <span className="text-[var(--color-accent)]">{currentLvl.power}</span>
            </div>
            <div className="bg-white/5 h-2 rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500 ease-out"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* 3. Tab navigation */}
        <nav className="modes-navigation" aria-label="Game mode selection tabs">
          <button
            onClick={() => {
              setCurrentView("trash");
              playSound.whoosh();
            }}
            className={`mode-tab ${currentView === "trash" ? "active" : ""}`}
            aria-selected={currentView === "trash"}
          >
            <span>🗑️</span> 분리배출 마스터
          </button>
          <button
            onClick={() => {
              setCurrentView("cards");
              playSound.whoosh();
            }}
            className={`mode-tab ${currentView === "cards" ? "active" : ""}`}
            aria-selected={currentView === "cards"}
          >
            <span>🔄</span> 탄소 중립 3D 카드
          </button>
        </nav>

        {/* 4. ACTIVE WORKVIEW PANELS */}
        <div className="flex flex-col gap-6">
          
          {/* VIEW 1: Waste Classification Game */}
          {currentView === "trash" && (
            <section className="game-view active" aria-label="Trash sorting section">
              <div className="active-game-area">
                <div className="bin-grid-title" style={{ marginBottom: "-10px" }}>
                  화면 속 쓰레기에 알맞은 분리수거함을 아래에서 선택하세요!
                </div>

                {/* Shuffled Waste Item Card Display */}
                {activeWasteItem && (
                  <div className="waste-card-holder">
                    <div
                      id="waste-card-box"
                      className={`waste-card ${answeredCorrectly === true ? "correct" : ""} ${answeredCorrectly === false ? "wrong" : ""}`}
                    >
                      <div className="waste-card-image">
                        {activeWasteItem.jsxSvg}
                      </div>
                      <div className="waste-card-info">
                        <h2 className="waste-card-title">{activeWasteItem.name}</h2>
                        <div className="waste-card-tip">💡 {activeWasteItem.tip}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Explanation Drawer Banner */}
                {showExplanation && activeWasteItem && (
                  <div
                    className="waste-explanation-box"
                    style={{
                      background: answeredCorrectly === true ? "rgba(16, 185, 129, 0.08)" : "rgba(248, 113, 113, 0.08)",
                      borderColor: answeredCorrectly === true ? "rgba(16, 185, 129, 0.3)" : "rgba(248, 113, 113, 0.3)"
                    }}
                  >
                    <span className="expl-icon">{answeredCorrectly === true ? <Check size={20} /> : <HelpCircle size={20} />}</span>
                    <div className="expl-content">
                      <h3 className="expl-title">
                        {answeredCorrectly === true ? "성공! 올바른 분리수거 방법" : "앗, 다시 한 번 확인해 볼까요?"}
                      </h3>
                      <p className="expl-text">{activeWasteItem.explanation}</p>
                    </div>
                  </div>
                )}

                {/* Interactive Recycling Bins controls */}
                <div className="bin-grid-container">
                  <div className="bin-grid-title">올바른 분리수거함 선택</div>
                  <div className="bin-grid">
                    
                    <button
                      onClick={(e) => handleRecycleBinSubmit("plastic", e)}
                      className="bin-button bin-plastic"
                      aria-label="Plastic recycling"
                    >
                      <span className="bin-icon" aria-hidden="true">🔵</span>
                      <span className="bin-name">플라스틱</span>
                      <span className="bin-desc">페트병, 완구, 청결스티로폼</span>
                    </button>

                    <button
                      onClick={(e) => handleRecycleBinSubmit("paper-carton", e)}
                      className="bin-button bin-paper"
                      aria-label="Paper carton recycling"
                    >
                      <span className="bin-icon" aria-hidden="true">🟡</span>
                      <span className="bin-name">종이/팩</span>
                      <span className="bin-desc">신문, 종이컵, 우유팩</span>
                    </button>

                    <button
                      onClick={(e) => handleRecycleBinSubmit("can-glass", e)}
                      className="bin-button bin-can-glass"
                      aria-label="Can and Glass recycling"
                    >
                      <span className="bin-icon" aria-hidden="true">🔴</span>
                      <span className="bin-name">캔/유리</span>
                      <span className="bin-desc">음료캔, 유리병, 부탄가스</span>
                    </button>

                    <button
                      onClick={(e) => handleRecycleBinSubmit("general-food", e)}
                      className="bin-button bin-general-food"
                      aria-label="General and Food waste"
                    >
                      <span className="bin-icon" aria-hidden="true">🟣</span>
                      <span className="bin-name">일반/음식물</span>
                      <span className="bin-desc">사과씨, 깨진유리, 컵라면용기</span>
                    </button>

                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VIEW 2: Carbon Neutrality Cards */}
          {currentView === "cards" && activeFlashcard && (
            <section className="game-view active" aria-label="Carbon Neutrality Flashcards section">
              <div className="flashcards-container">
                <div className="bin-grid-title" style={{ marginBottom: "-10px" }}>
                  카드를 클릭하면 뒷면이 뒤집히며 상세 정보가 나타납니다!
                </div>

                {/* 3D Rotational Double sided scene container */}
                <div className="flip-card-scene" id="flash-card-box" onClick={flipCard}>
                  <div className={`flip-card-inner ${cardFlipped ? "flipped" : ""}`}>
                    
                    {/* CARD FRONT FACE */}
                    <div className="card-face card-face-front">
                      <span className="front-badge">{activeFlashcard.badge}</span>
                      <div className="front-main">
                        <span className="front-icon" aria-hidden="true">{activeFlashcard.icon}</span>
                        <h2 className="front-title">{activeFlashcard.title}</h2>
                        <span className="front-tip">{activeFlashcard.tip}</span>
                      </div>
                      <div className="front-prompt">
                        <span>💡</span> 카드를 터치하여 뒷면의 핵심 개념 확인
                      </div>
                    </div>

                    {/* CARD BACK FACE */}
                    <div className="card-face card-face-back">
                      <div className="back-header">
                        <h3 className="back-title">{activeFlashcard.title}</h3>
                        <span className="back-eco-tag">에코 키워드 사전</span>
                      </div>

                      <div className="back-body">
                        <p className="back-definition">{activeFlashcard.definition}</p>
                        
                        <div className="back-example">
                          <div className="back-example-label">실생활 실천 사례</div>
                          <p className="back-example-text">{activeFlashcard.example}</p>
                        </div>
                      </div>

                      <div className="back-footer">
                        화면을 터치하면 다시 앞으로 돌아갑니다
                      </div>
                    </div>

                  </div>
                </div>

                {/* Flashcard action deck controls */}
                <div className="card-actions-wrapper">
                  
                  {/* Navigator indicator */}
                  <div className="card-navigation">
                    <button
                      onClick={() => {
                        if (cardIndex > 0) {
                          setCardIndex((prev) => prev - 1);
                          setCardFlipped(false);
                          playSound.whoosh();
                        }
                      }}
                      disabled={cardIndex === 0}
                      className="nav-btn"
                      aria-label="Previous flashcard"
                    >
                      <ChevronLeft size={16} /> 이전 카드
                    </button>
                    <span className="card-indicator">
                      {cardIndex + 1} / {CARDS_DATABASE.length}
                    </span>
                    <button
                      onClick={() => {
                        if (cardIndex < CARDS_DATABASE.length - 1) {
                          setCardIndex((prev) => prev + 1);
                          setCardFlipped(false);
                          playSound.whoosh();
                        }
                      }}
                      disabled={cardIndex === CARDS_DATABASE.length - 1}
                      className="nav-btn"
                      aria-label="Next flashcard"
                    >
                      다음 카드 <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Verdict responses */}
                  <div className="knowledge-verdict">
                    <button
                      onClick={() => {
                        setCardFlipped(false);
                        playSound.whoosh();
                      }}
                      className="btn btn-secondary-action"
                      aria-label="Study this card again"
                    >
                      <RotateCcw size={16} /> 아하! 다시보기
                    </button>
                    <button
                      onClick={handleCardLearned}
                      className="btn btn-primary-action"
                      aria-label="I fully understand this concept"
                    >
                      <Award size={16} /> 완벽 이해! (+10P)
                    </button>
                  </div>

                </div>
              </div>
            </section>
          )}

        </div>

        {/* 5. Ambient feedback toast alerts */}
        <div id="toast-notification" className={`toast-msg ${toastMessage ? "show" : ""}`} role="alert" aria-live="polite">
          <span>🍃</span>
          <span>{toastMessage}</span>
        </div>

        {/* 6. Level Up popup modal overlay */}
        {isLvlUpModalOpen && (
          <div className="overlay active" role="dialog" aria-modal="true">
            <div className="modal-content">
              <span className="modal-icon" aria-hidden="true">{currentLvl.emoji}</span>
              <h2 className="modal-title">{currentLvl.name} 달성!</h2>
              <p className="modal-desc">
                축하합니다! 지구를 위한 올바른 분리배출 수칙과 풍부한 지식을 바탕으로 더욱 강력한 지구 수호자로 거듭나셨습니다.
              </p>
              
              <div className="modal-badge-info">
                <div className="modal-badge-name">{currentLvl.power}</div>
                <div className="modal-badge-power">새로운 에코 타이틀 배지가 해제되었습니다!</div>
              </div>

              <button
                onClick={() => {
                  setIsLvlUpModalOpen(false);
                  playSound.ping();
                }}
                className="btn btn-primary-action modal-btn"
                aria-label="Close modal dialog"
              >
                멋져요, 계속해서 지구 지키기!
              </button>
            </div>
          </div>
        )}

        {/* 7. Footer components */}
        <footer className="eco-footer">
          <div className="footer-stats">
            <span>🌱 심은 나무: <strong style={{ color: "var(--color-primary)" }}>{Math.floor(score / 60) + 5}그루</strong></span>
            <span className="footer-stats-bullet">•</span>
            <span>🌊 아낀 깨끗한 물: <strong style={{ color: "var(--color-secondary)" }}>{score * 2 + 45}L</strong></span>
          </div>
          <p>© 2026 EcoCard Hero. 지구를 구하는 가장 가벼운 발걸음.</p>
        </footer>

      </div>
    </main>
  );
}
