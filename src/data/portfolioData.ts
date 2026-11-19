import {
  Project,
  SkillCategory,
  TimelineEntry,
  MoodPreset,
  SoundscapePreset,
  KeyboardSwitchInfo,
  ScreenTerminalModeInfo,
  StickyNote
} from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Sawon Ahmed',
  title: 'Full Stack Developer & 3D Web Architect',
  subtitle: 'Bridging modern distributed cloud systems with cutting-edge 3D interactive web experiences',
  email: 'asawon800@gmail.com',
  github: 'https://github.com/sanonahmed',
  linkedin: 'https://linkedin.com/in/sawon-ahmed',
  location: 'Global / Remote',
  status: 'Available for high-impact roles & freelance architecture',
  bio: 'Full Stack Engineer with 6+ years of expertise designing scalable microservices, low-latency APIs, and immersive WebGL/Three.js interfaces. Passionate about procedural graphics, spatial UI, real-time collaboration, and building high-performance software that feels alive.',
  stats: [
    { label: 'Years Experience', value: '6+' },
    { label: 'Production Apps', value: '35+' },
    { label: 'Lines of Code', value: '450k+' },
    { label: 'Uptime Maintained', value: '99.98%' },
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'omniflow',
    title: 'OmniFlow Cloud Engine',
    category: 'Cloud & Systems',
    tagline: 'Enterprise cloud orchestration & live telemetry dashboard',
    description: 'A distributed cloud management platform monitoring Kubernetes clusters, serverless workloads, and automated failover with real-time WebSockets.',
    fullDetails: 'OmniFlow manages multi-region container deployments with intelligent auto-scaling algorithms. Built with a Go microservices backend streaming metric metrics via gRPC to a high-concurrency Redis queue, paired with an interactive React dashboard featuring real-time cluster topology graphs.',
    architectureHighlights: [
      'Engineered sub-50ms telemetry pipeline processing 45,000 events/sec via Go and Redis Streams.',
      'Designed custom DAG workflow executor with rollback automation and blue-green deployment gates.',
      'Integrated Prometheus metric exporters and dynamic node health score calculation.'
    ],
    metrics: [
      { label: 'Throughput', value: '45k events/s' },
      { label: 'Latency', value: '< 50ms' },
      { label: 'Cluster Scale', value: '120+ Nodes' }
    ],
    tags: ['Go', 'Kubernetes', 'React', 'TypeScript', 'Redis', 'Docker', 'gRPC'],
    demoUrl: 'https://github.com/sanonahmed/omniflow-cloud',
    githubUrl: 'https://github.com/sanonahmed/omniflow-cloud',
    featured: true,
    color: '#38bdf8'
  },
  {
    id: 'apex3d-studio',
    title: 'Apex3D Spatial Studio',
    category: '3D & WebGL',
    tagline: 'In-browser collaborative 3D scene builder & PBR material editor',
    description: 'WebGL-powered 3D CAD & spatial visualization platform enabling real-time procedural geometry modeling, lighting rigs, and physically-based material synthesis.',
    fullDetails: 'Apex3D brings desktop-grade 3D authoring directly to modern web browsers. Featuring custom GLSL shader nodes, tone mapping configurations, real-time shadow baking, and an instanced rendering pipeline that effortlessly handles 100,000+ interactive geometry polygons at 60 FPS.',
    architectureHighlights: [
      'Developed procedural mesh generation algorithms with custom normals and tangents computation.',
      'Implemented WebGL state machine with texture atlasing and instanced draw calls to prevent GC stalls.',
      'Built multi-user spatial synchronization utilizing WebSockets and optimistic client prediction.'
    ],
    metrics: [
      { label: 'Render Budget', value: '60 FPS' },
      { label: 'Polygons', value: '100k+ Live' },
      { label: 'Load Time', value: '< 800ms' }
    ],
    tags: ['Three.js', 'WebGL', 'TypeScript', 'GLSL', 'Web Audio', 'React', 'Zustand'],
    demoUrl: 'https://github.com/sanonahmed/apex3d-studio',
    githubUrl: 'https://github.com/sanonahmed/apex3d-studio',
    featured: true,
    color: '#a855f7'
  },
  {
    id: 'kubepulse',
    title: 'KubePulse Microservices Monitor',
    category: 'Cloud & Systems',
    tagline: 'Distributed tracing & automated anomaly detection system',
    description: 'Observability platform tracking inter-service RPC latency, bottleneck identification, and automated root-cause analysis across distributed systems.',
    fullDetails: 'KubePulse correlates logs, metrics, and distributed traces across disparate microservices. Incorporates a machine learning anomaly detection worker that identifies cascading network timeouts before customer-facing degradation occurs.',
    architectureHighlights: [
      'Unified OpenTelemetry collector receiver with PostgreSQL time-series partitioning for 30-day retention.',
      'Constructed interactive dependency graph visualizer utilizing Canvas 2D and force-directed graph physics.',
      'Reduced mean time to resolution (MTTR) by 64% in simulated production load tests.'
    ],
    metrics: [
      { label: 'MTTR Reduction', value: '64%' },
      { label: 'Trace Ingestion', value: '1.2 GB/min' },
      { label: 'Query Response', value: '120ms' }
    ],
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'OpenTelemetry', 'Tailwind'],
    demoUrl: 'https://github.com/sanonahmed/kubepulse-monitor',
    githubUrl: 'https://github.com/sanonahmed/kubepulse-monitor',
    featured: true,
    color: '#10b981'
  },
  {
    id: 'devpulse-ide',
    title: 'DevPulse Real-time IDE',
    category: 'Full Stack',
    tagline: 'Cloud developer workspace with CRDT pairing & container execution',
    description: 'Browser-based code editor offering zero-latency collaborative typing, integrated bash terminal emulator, and instant containerized preview environments.',
    fullDetails: 'DevPulse delivers an instant dev environment in the browser with full TypeScript language server support, split view diffing, integrated terminal via xterm.js, and multi-cursor real-time collaboration powered by Yjs CRDTs.',
    architectureHighlights: [
      'Seamless multi-cursor synchronization with Conflict-Free Replicated Data Types (CRDT).',
      'Secure sandbox isolation using ephemeral Linux containers spawned in sub-seconds.',
      'Custom syntax highlighters and auto-completion pipeline with monaco-editor integration.'
    ],
    metrics: [
      { label: 'Sync Latency', value: '< 15ms' },
      { label: 'Concurrent Coders', value: '30+ / room' },
      { label: 'Cold Boot', value: '1.2s' }
    ],
    tags: ['React 19', 'TypeScript', 'Node.js', 'Docker', 'CRDT', 'WebSockets'],
    demoUrl: 'https://github.com/sanonahmed/devpulse-ide',
    githubUrl: 'https://github.com/sanonahmed/devpulse-ide',
    featured: false,
    color: '#f59e0b'
  },
  {
    id: 'echopay',
    title: 'EchoPay FinTech Gateway',
    category: 'Full Stack',
    tagline: 'High-throughput payment processing pipeline with cryptographic audit ledger',
    description: 'Fault-tolerant financial checkout and reconciliation engine ensuring zero double-spending, idempotent webhook guarantees, and immutable transaction ledgers.',
    fullDetails: 'Engineered for strict consistency and ACID compliance under extreme concurrency. Leverages distributed locking in Redis, event sourcing with Kafka, and cryptographically signed audit logs for compliance with financial standards.',
    architectureHighlights: [
      'Implemented distributed two-phase commit protocol with automated compensation workflows.',
      'Zero double-spend architecture backed by deterministic idempotency keys and strict token verification.',
      'PCI-DSS compliant field-level AES-256-GCM encryption for all sensitive customer payment vectors.'
    ],
    metrics: [
      { label: 'TPS Peak', value: '12,500' },
      { label: 'Settlement Lag', value: '< 200ms' },
      { label: 'Failure Rate', value: '0.0001%' }
    ],
    tags: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'React', 'Docker'],
    demoUrl: 'https://github.com/sanonahmed/echopay-gateway',
    githubUrl: 'https://github.com/sanonahmed/echopay-gateway',
    featured: false,
    color: '#06b6d4'
  },
  {
    id: 'neuroforge',
    title: 'NeuroForge AI Studio',
    category: 'AI & Tools',
    tagline: 'Visual node-based agent orchestration & vector search pipeline',
    description: 'Graph-based builder for designing multi-agent AI workflows, retrieval-augmented generation (RAG) pipelines, and intelligent automated tasks.',
    fullDetails: 'Users can visually drag and drop LLM prompt nodes, embedding vector databases, conditional branches, and Python execution sandbox nodes to orchestrate autonomous AI applications.',
    architectureHighlights: [
      'Visual interactive node graph canvas built with smooth panning, zooming, and cable curve physics.',
      'Streaming responses via Server-Sent Events (SSE) with token-by-token visual node lighting.',
      'Vector hybrid search integration combining semantic embeddings with lexical BM25 indexing.'
    ],
    metrics: [
      { label: 'Pipeline Nodes', value: '50+ / graph' },
      { label: 'Stream Speed', value: '85 tokens/s' },
      { label: 'Search Latency', value: '18ms' }
    ],
    tags: ['React Flow', 'FastAPI', 'Python', 'Vector DB', 'Next.js', 'Tailwind'],
    demoUrl: 'https://github.com/sanonahmed/neuroforge-ai',
    githubUrl: 'https://github.com/sanonahmed/neuroforge-ai',
    featured: false,
    color: '#ec4899'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Frontend & 3D Web',
    icon: 'Layers',
    description: 'Modern reactive component architectures, physically-based 3D graphics, and responsive UI',
    skills: [
      { name: 'React 19 & Next.js', level: 98, experience: '6 yrs', highlight: true },
      { name: 'TypeScript', level: 96, experience: '5 yrs', highlight: true },
      { name: 'Three.js & WebGL', level: 92, experience: '4 yrs', highlight: true },
      { name: 'Tailwind CSS', level: 95, experience: '5 yrs' },
      { name: 'GLSL / Custom Shaders', level: 85, experience: '3 yrs' },
      { name: 'HTML5 Canvas & Web Audio', level: 90, experience: '4 yrs' },
      { name: 'State Management (Zustand/Redux)', level: 94, experience: '5 yrs' },
      { name: 'Responsive & Accessibility', level: 92, experience: '6 yrs' }
    ]
  },
  {
    name: 'Backend & Distributed Systems',
    icon: 'Server',
    description: 'Scalable service architectures, high-performance APIs, asynchronous message queues',
    skills: [
      { name: 'Node.js & Express', level: 95, experience: '6 yrs', highlight: true },
      { name: 'Go (Golang)', level: 88, experience: '3 yrs', highlight: true },
      { name: 'Python & FastAPI', level: 90, experience: '4 yrs' },
      { name: 'REST & GraphQL APIs', level: 94, experience: '6 yrs', highlight: true },
      { name: 'gRPC & Protocol Buffers', level: 86, experience: '3 yrs' },
      { name: 'WebSockets & Real-time Eventing', level: 92, experience: '5 yrs' },
      { name: 'Microservices Architecture', level: 91, experience: '4 yrs' }
    ]
  },
  {
    name: 'Databases & Infrastructure',
    icon: 'Database',
    description: 'Reliable persistence layers, cache invalidation, and automated cloud deployments',
    skills: [
      { name: 'PostgreSQL & SQL Design', level: 93, experience: '5 yrs', highlight: true },
      { name: 'Redis Caching & Pub/Sub', level: 92, experience: '4 yrs', highlight: true },
      { name: 'MongoDB & NoSQL', level: 89, experience: '5 yrs' },
      { name: 'Docker & Containerization', level: 94, experience: '5 yrs', highlight: true },
      { name: 'Kubernetes (K8s)', level: 84, experience: '3 yrs' },
      { name: 'CI/CD Pipelines (GitHub Actions)', level: 92, experience: '5 yrs' },
      { name: 'AWS & Cloud Infrastructure', level: 88, experience: '4 yrs' }
    ]
  },
  {
    name: 'Engineering Practices & Tooling',
    icon: 'Cpu',
    description: 'Clean code craftsmanship, test-driven reliability, and system optimization',
    skills: [
      { name: 'System Design & Scalability', level: 92, experience: '5 yrs', highlight: true },
      { name: 'Automated Testing (Unit/E2E)', level: 90, experience: '5 yrs' },
      { name: 'Performance Optimization & Profiling', level: 91, experience: '4 yrs' },
      { name: 'Git & Trunk-based Collaboration', level: 96, experience: '6 yrs' },
      { name: 'Security & Auth (OAuth, JWT, RBAC)', level: 92, experience: '5 yrs' },
      { name: 'Observability & Telemetry (OpenTelemetry)', level: 86, experience: '3 yrs' }
    ]
  }
];

export const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: 'exp-1',
    period: '2024 - Present',
    role: 'Lead Full Stack & 3D Web Architect',
    company: 'HyperScale Systems',
    location: 'Remote / Global',
    description: 'Directing the architecture of next-generation distributed enterprise applications and high-fidelity 3D interactive web tools.',
    achievements: [
      'Spearheaded migration of legacy monolith to decoupled Go/Node.js microservices, cutting P99 latency by 58%.',
      'Created custom Three.js spatial modeling pipeline adopted across 14 enterprise customer suites.',
      'Mentored team of 12 full stack developers in TypeScript best practices, CI/CD automation, and test coverage.'
    ],
    techStack: ['Go', 'TypeScript', 'Three.js', 'React 19', 'Kubernetes', 'PostgreSQL', 'Redis']
  },
  {
    id: 'exp-2',
    period: '2022 - 2024',
    role: 'Senior Full Stack Engineer',
    company: 'CloudSphere Technologies',
    location: 'San Francisco, CA (Hybrid)',
    description: 'Built high-concurrency cloud telemetry pipelines, developer portals, and real-time visualization dashboards.',
    achievements: [
      'Constructed distributed stream processing service handling over 350M daily events with 99.99% uptime.',
      'Pioneered interactive WebGL network graph viewer replacing sluggish DOM charts and improving frame rates from 18 to 60 FPS.',
      'Authored automated deployment pipelines reducing production release turnaround from 4 hours to 12 minutes.'
    ],
    techStack: ['Node.js', 'Python', 'React', 'WebGL', 'Docker', 'AWS ECS', 'Kafka']
  },
  {
    id: 'exp-3',
    period: '2020 - 2022',
    role: 'Full Stack Software Engineer',
    company: 'Nexus Labs',
    location: 'Remote',
    description: 'Engineered web applications, RESTful microservices, and client-facing collaboration tools.',
    achievements: [
      'Built multi-tenant SaaS dashboard serving 80,000+ monthly active business users.',
      'Designed and executed database schema indexing and query optimization on PostgreSQL, slashing server CPU by 40%.',
      'Implemented real-time document sharing engine with WebSocket connection pooling and automatic reconnections.'
    ],
    techStack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind']
  },
  {
    id: 'exp-4',
    period: '2018 - 2020',
    role: 'Frontend & Interactive Web Developer',
    company: 'PixelCraft Studio',
    location: 'Remote',
    description: 'Crafted dynamic marketing experiences, creative web canvases, and responsive single-page applications.',
    achievements: [
      'Developed 20+ award-winning commercial web showcases with smooth canvas animations and micro-interactions.',
      'Standardized modern React & TypeScript workflow, eliminating common runtime type exceptions across projects.'
    ],
    techStack: ['JavaScript / ES6+', 'React', 'HTML5 Canvas', 'CSS3 / SASS', 'REST APIs', 'Webpack']
  }
];

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Electric cyan key light, magenta back accents, deep obsidian horizon',
    keyLight: 0x38bdf8,
    fillLight: 0x1e1b4b,
    rimLight: 0xf43f5e,
    groundLight: 0x090d16,
    fogColor: 0x08090d,
    accentGlow: '#38bdf8',
    bloomIntensity: 1.25
  },
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave',
    description: 'Outrun sunset palette with hot neon pink key, deep twilight violet fog, and cyan specular rims',
    keyLight: 0xf43f5e,
    fillLight: 0x4c1d95,
    rimLight: 0x06b6d4,
    groundLight: 0x2e0854,
    fogColor: 0x190533,
    accentGlow: '#ec4899',
    bloomIntensity: 1.85
  },
  {
    id: 'tokyo-dusk',
    name: 'Tokyo Dusk',
    description: 'Warm sunset amber key, deep purple shadow fill, coral highlights',
    keyLight: 0xfbbf24,
    fillLight: 0x3b0764,
    rimLight: 0xf97316,
    groundLight: 0x140b1e,
    fogColor: 0x0f0a17,
    accentGlow: '#f59e0b',
    bloomIntensity: 0.9
  },
  {
    id: 'matrix-emerald',
    name: 'Matrix Emerald',
    description: 'Terminal phosphor greens, cybernetic dark atmosphere, mint glows',
    keyLight: 0x34d399,
    fillLight: 0x064e3b,
    rimLight: 0x10b981,
    groundLight: 0x041a12,
    fogColor: 0x050f0b,
    accentGlow: '#10b981',
    bloomIntensity: 1.1
  },
  {
    id: 'clean-studio',
    name: 'Clean Studio',
    description: 'Refined neutral daylight, titanium metallics, high-contrast studio rig',
    keyLight: 0xf1f5f9,
    fillLight: 0x334155,
    rimLight: 0x94a3b8,
    groundLight: 0x0f172a,
    fogColor: 0x0a0e17,
    accentGlow: '#60a5fa',
    bloomIntensity: 0.5
  }
];

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'off',
    name: 'Mute Ambient',
    subtitle: 'Silent mode (UI SFX only)',
    color: '#64748b',
    genre: 'Muted'
  },
  {
    id: 'cyber-space',
    name: 'Cyber Space',
    subtitle: 'Sub-harmonic resonant drone with ethereal arpeggios',
    color: '#38bdf8',
    genre: 'Deep Drone'
  },
  {
    id: 'server-hum',
    name: 'Server Room',
    subtitle: 'High-density rack airflow with 60Hz transformer hum',
    color: '#10b981',
    genre: 'Data Center'
  },
  {
    id: 'tokyo-rain',
    name: 'Tokyo Rain',
    subtitle: 'Soothing rain generator with warm neon harmonic chords',
    color: '#a855f7',
    genre: 'Atmospheric'
  },
  {
    id: 'synthwave-breeze',
    name: 'Synthwave Pad',
    subtitle: 'Analog detuned warm saw pads with resonant filter sweep',
    color: '#f59e0b',
    genre: 'Melodic Pad'
  }
];

export const KEYBOARD_SWITCHES: KeyboardSwitchInfo[] = [
  {
    type: 'blue',
    name: 'Cherry MX Blue',
    feel: 'Clicky & Tactile',
    soundType: 'Crisp Snap',
    color: '#38bdf8',
    accentHex: 0x38bdf8
  },
  {
    type: 'brown',
    name: 'Gateron Brown',
    feel: 'Tactile Bump',
    soundType: 'Deep Thock',
    color: '#f59e0b',
    accentHex: 0xf59e0b
  },
  {
    type: 'red',
    name: 'Linear Red',
    feel: 'Smooth Linear',
    soundType: 'Quiet Thud',
    color: '#ef4444',
    accentHex: 0xef4444
  }
];

export const SCREEN_MODES: ScreenTerminalModeInfo[] = [
  {
    mode: 'code',
    name: 'Architecture Code',
    tagline: 'TypeScript 5.8 Workstation Core',
    badge: 'IDE',
    color: '#38bdf8'
  },
  {
    mode: 'build',
    name: 'Container Build',
    tagline: 'Streaming Docker CI/CD Pipeline',
    badge: 'BUILD',
    color: '#10b981'
  },
  {
    mode: 'matrix',
    name: 'Matrix Digital Rain',
    tagline: 'Phosphor Green Cyber Stream',
    badge: 'MATRIX',
    color: '#22c55e'
  }
];

export const STICKY_NOTES_DATA: StickyNote[] = [
  {
    id: 'note-arch',
    title: 'Zero-GC 3D Engine',
    category: 'architecture',
    color: '#fef08a', // Canary yellow
    paperHex: 0xfef08a,
    pinColor: '#ef4444',
    rotation: -0.06,
    position: [-0.62, 1.002, 0.08],
    date: 'OCT 2026',
    badge: 'ARCH NOTE',
    content: 'Zero-GC animation loop achieved by module-level scratch vectors & instanced keycap buffers. Keeps WebGL2 frame times strictly < 16.6ms.',
    codeSnippet: 'const _scratchVec3 = new THREE.Vector3();\nkeyInstMesh.setMatrixAt(idx, matrix);',
    action: {
      label: 'Copy Snippet',
      type: 'copy',
      payload: 'const _scratchVec3 = new THREE.Vector3();\nkeyInstMesh.setMatrixAt(idx, matrix);'
    }
  },
  {
    id: 'note-roadmap',
    title: 'Q4 Dev Sprint',
    category: 'dev-notes',
    color: '#bae6fd', // Tech Cyan
    paperHex: 0xbae6fd,
    pinColor: '#3b82f6',
    rotation: 0.04,
    position: [-0.36, 1.002, 0.02],
    date: 'SPRINT 14',
    badge: 'ROADMAP',
    content: 'Upcoming: WebGPU compute shaders, procedural terrain rendering & GLSL audio reactive shader pipeline on the portrait display.',
    codeSnippet: '// Next: WGSL Compute Kernels\nconst adapter = await navigator.gpu.requestAdapter();',
    action: {
      label: 'Cycle Monitor Mode',
      type: 'screen-mode'
    }
  },
  {
    id: 'note-easter',
    title: 'Workspace Shortcuts',
    category: 'easter-egg',
    color: '#fed7aa', // Peach / Apricot
    paperHex: 0xfed7aa,
    pinColor: '#f97316',
    rotation: -0.03,
    position: [0.38, 1.002, 0.04],
    date: 'HOTKEYS',
    badge: 'TIPS',
    content: 'Live interactive desk hotkeys:\n[M] Switch Terminal (Code / Build / Matrix)\n[K] Toggle Cherry Blue / Brown / Red switches\n[P] Coffee steam puff\n[N] Succulent sway\n[G] Fog toggle',
    codeSnippet: 'window.addEventListener("keydown", (e) => executeWorkstationGadget(e.key));',
    action: {
      label: 'Copy All Shortcuts',
      type: 'copy',
      payload: 'Hotkeys: [M] Screen Mode, [K] Switch Type, [P] Coffee Steam, [N] Succulent, [G] Atmospheric Fog, [F] FPS Monitor'
    }
  },
  {
    id: 'note-collab',
    title: "Let's Collaborate",
    category: 'quick-contact',
    color: '#bbf7d0', // Mint Green
    paperHex: 0xbbf7d0,
    pinColor: '#10b981',
    rotation: 0.07,
    position: [0.65, 1.002, 0.10],
    date: 'COLLAB',
    badge: 'AVAILABLE',
    content: 'Looking for a Senior Full Stack or 3D Web Architect? I am available for forward-thinking engineering roles and freelance contracts.',
    codeSnippet: 'const response = await contactDeveloper({ role: "Lead Engineer / Architect" });',
    action: {
      label: 'Draft Collaboration Message',
      type: 'contact',
      payload: 'Collaboration Inquiry via 3D Desk Sticky Note'
    }
  }
];


