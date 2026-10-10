import React from 'react';
import type { Project } from '../data/projects';

// Deterministic pseudo-random so every project's art is stable between renders
const rng = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

type ArtProps = { c1: string; c2: string; c3: string; r: () => number };

const SafePulse = ({ c1, c2 }: ArtProps) => (
  <g>
    {[40, 75, 110, 145].map((rad, i) => (
      <circle key={rad} cx="200" cy="150" r={rad} fill="none" stroke={c1} strokeOpacity={0.6 - i * 0.12} strokeWidth="1.5" />
    ))}
    <path d="M200 150 L200 5 A145 145 0 0 1 325 78 Z" fill={`url(#sweep-safepulse-bharat)`} opacity="0.5" />
    <polyline points="20,150 120,150 140,110 160,195 180,80 200,170 215,140 230,150 380,150" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    {[[140, 90], [270, 200], [250, 85]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="10" fill={c2} opacity="0.3" />
        <circle cx={x} cy={y} r="4" fill={c2} />
      </g>
    ))}
  </g>
);

const Events = ({ c1, c2, r }: ArtProps) => (
  <g>
    <g transform="rotate(-8 200 150)">
      <rect x="70" y="80" width="260" height="140" rx="14" fill="#0b0b12" stroke={c1} strokeWidth="2" />
      <line x1="250" y1="85" x2="250" y2="215" stroke={c1} strokeDasharray="6 6" />
      <rect x="90" y="100" width="120" height="12" rx="6" fill="#fff" />
      <rect x="90" y="122" width="80" height="8" rx="4" fill={c2} opacity="0.8" />
      <rect x="90" y="180" width="60" height="22" rx="11" fill={c1} />
      {Array.from({ length: 49 }).map((_, i) => (
        r() > 0.45 ? <rect key={i} x={262 + (i % 7) * 8} y={118 + Math.floor(i / 7) * 8} width="7" height="7" fill="#fff" /> : null
      ))}
    </g>
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={r() * 400} cy={r() * 300} r={r() * 3 + 1} fill={i % 2 ? c1 : c2} opacity="0.7" />
    ))}
  </g>
);

const Rag = ({ c1, c2, r }: ArtProps) => {
  const pts = Array.from({ length: 18 }, () => [40 + r() * 320, 30 + r() * 240]);
  return (
    <g>
      {pts.map(([x, y], i) =>
        pts.slice(i + 1).map(([x2, y2], j) =>
          Math.hypot(x - x2, y - y2) < 110 ? <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={c1} strokeOpacity="0.35" /> : null
        )
      )}
      {pts.map(([x, y], i) => (
        <line key={`q${i}`} x1="200" y1="150" x2={x} y2={y} stroke={c2} strokeOpacity={i % 4 === 0 ? 0.8 : 0} strokeWidth="1.5" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={i % 4 === 0 ? 6 : 3.5} fill={i % 4 === 0 ? c2 : '#fff'} />
      ))}
      <rect x="160" y="128" width="80" height="44" rx="10" fill="#0a0a0a" stroke="#fff" strokeWidth="2" />
      <text x="200" y="156" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="14">LLM</text>
    </g>
  );
};

const Earnly = ({ c1, c2 }: ArtProps) => (
  <g>
    {[60, 95, 75, 130, 115, 170, 205].map((h, i) => (
      <rect key={i} x={50 + i * 42} y={250 - h} width="26" height={h} rx="5" fill={i === 6 ? c2 : c1} opacity={0.35 + i * 0.09} />
    ))}
    <polyline points="63,180 105,150 147,165 189,110 231,125 273,70 315,40" fill="none" stroke="#fff" strokeWidth="3" />
    {[[320, 70, 26], [280, 120, 18]].map(([x, y, rad], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={rad} fill={c2} />
        <circle cx={x} cy={y} r={rad - 6} fill="none" stroke="#0a0a0a" strokeWidth="2" />
        <text x={x} y={y + 6} textAnchor="middle" fontSize={rad} fontWeight="700" fill="#0a0a0a">₹</text>
      </g>
    ))}
  </g>
);

const FaceId = ({ c1, c2 }: ArtProps) => (
  <g>
    <ellipse cx="160" cy="150" rx="70" ry="90" fill="none" stroke={c1} strokeWidth="1.5" />
    {[-50, -25, 0, 25, 50].map((d) => (
      <ellipse key={d} cx="160" cy="150" rx={Math.abs(70 - Math.abs(d) * 0.6)} ry="90" fill="none" stroke={c1} strokeOpacity="0.3" transform={`translate(${d * 0.3} 0)`} />
    ))}
    {[-60, -30, 0, 30, 60].map((d) => (
      <line key={d} x1="95" y1={150 + d} x2="225" y2={150 + d} stroke={c1} strokeOpacity="0.3" />
    ))}
    <circle cx="135" cy="130" r="5" fill="#fff" />
    <circle cx="185" cy="130" r="5" fill="#fff" />
    <path d="M140 185 q20 14 40 0" stroke="#fff" strokeWidth="2.5" fill="none" />
    {['M80 55 h-25 v25', 'M240 55 h25 v25', 'M80 245 h-25 v-25', 'M240 245 h25 v-25'].map((d) => (
      <path key={d} d={d} stroke="#fff" strokeWidth="3" fill="none" />
    ))}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={300} y={70 + i * 60} width="50" height="36" rx="6" fill="#0a0a0a" stroke={c2} strokeWidth="2" />
        {i < 2 && <line x1="325" y1={106 + i * 60} x2="325" y2={130 + i * 60} stroke={c2} strokeWidth="2" />}
      </g>
    ))}
    <line x1="230" y1="150" x2="298" y2="148" stroke={c2} strokeDasharray="4 4" />
  </g>
);

const Mentor = ({ c1, c2 }: ArtProps) => (
  <g>
    <rect x="60" y="60" width="180" height="56" rx="18" fill={c1} opacity="0.85" />
    <rect x="80" y="80" width="110" height="8" rx="4" fill="#fff" />
    <rect x="80" y="94" width="70" height="8" rx="4" fill="#fff" opacity="0.6" />
    <rect x="160" y="135" width="180" height="56" rx="18" fill="#141418" stroke={c2} strokeWidth="2" />
    <rect x="180" y="155" width="130" height="8" rx="4" fill={c2} />
    <rect x="180" y="169" width="90" height="8" rx="4" fill={c2} opacity="0.6" />
    <rect x="60" y="210" width="120" height="40" rx="14" fill={c1} opacity="0.5" />
    {[0, 1, 2].map((i) => <circle key={i} cx={95 + i * 22} cy="230" r="5" fill="#fff" opacity={1 - i * 0.25} />)}
    <path d="M330 60 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill="#fff" />
    <path d="M295 90 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill={c2} />
  </g>
);

const Law = ({ c1, c2 }: ArtProps) => (
  <g stroke="#fff" strokeWidth="2.5" fill="none">
    <line x1="200" y1="60" x2="200" y2="240" />
    <line x1="110" y1="85" x2="290" y2="85" />
    <circle cx="200" cy="60" r="8" fill={c2} stroke="none" />
    <path d="M150 240 h100" strokeWidth="4" />
    <line x1="120" y1="85" x2="95" y2="160" /><line x1="120" y1="85" x2="145" y2="160" />
    <line x1="280" y1="85" x2="255" y2="160" /><line x1="280" y1="85" x2="305" y2="160" />
    <path d="M90 160 a30 14 0 0 0 60 0 z" fill={c1} fillOpacity="0.6" />
    <path d="M250 160 a30 14 0 0 0 60 0 z" fill={c2} fillOpacity="0.6" />
    <circle cx="200" cy="150" r="125" stroke={c1} strokeOpacity="0.25" strokeDasharray="3 8" />
  </g>
);

const BharatPlus = ({ c1, c2 }: ArtProps) => (
  <g transform="translate(200 150)">
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="0" y1="0" x2="0" y2="-95" stroke={c1} strokeOpacity="0.7" strokeWidth="1.5" transform={`rotate(${i * 15})`} />
    ))}
    <circle r="95" fill="none" stroke="#fff" strokeWidth="3" />
    <circle r="60" fill="none" stroke={c2} strokeWidth="1.5" strokeDasharray="4 6" />
    <circle r="18" fill={c2} />
    <path d="M-8 0 h16 M0 -8 v16" stroke="#0a0a0a" strokeWidth="4" />
    <circle r="125" fill="none" stroke={c1} strokeOpacity="0.2" />
  </g>
);

const BharatOs = ({ c1, c2 }: ArtProps) => (
  <g>
    {[[40, 40, c1], [130, 90, c2], [220, 60, '#fff']].map(([x, y, col], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <rect width="150" height="110" rx="10" fill="#0e0e14" stroke={col as string} strokeWidth="2" />
        <rect width="150" height="22" rx="10" fill={col as string} opacity="0.25" />
        {[0, 1, 2].map((d) => <circle key={d} cx={14 + d * 12} cy="11" r="4" fill={col as string} />)}
        <rect x="14" y="38" width={90 - i * 15} height="8" rx="4" fill={col as string} opacity="0.7" />
        <rect x="14" y="54" width={60 + i * 10} height="8" rx="4" fill={col as string} opacity="0.4" />
      </g>
    ))}
    <rect x="100" y="255" width="200" height="30" rx="15" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.3" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={120 + i * 34} y="262" width="16" height="16" rx="4" fill={i % 2 ? c1 : c2} />)}
  </g>
);

const Electro = ({ c1, c2, r }: ArtProps) => (
  <g>
    {Array.from({ length: 16 }).map((_, i) => {
      const y = 20 + i * 17;
      const x = 30 + r() * 80;
      const bend = 140 + r() * 40;
      return (
        <g key={i}>
          <polyline points={`0,${y} ${x},${y} ${bend},${150 + (y - 150) * 0.35} 160,${150 + (y - 150) * 0.35}`} fill="none" stroke={c1} strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="3" fill={c2} />
        </g>
      );
    })}
    <rect x="160" y="95" width="110" height="110" rx="10" fill="#0a0a0a" stroke="#fff" strokeWidth="2" />
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i}>
        <line x1={175 + i * 16} y1="95" x2={175 + i * 16} y2="80" stroke="#fff" strokeWidth="2" />
        <line x1={175 + i * 16} y1="205" x2={175 + i * 16} y2="220" stroke="#fff" strokeWidth="2" />
      </g>
    ))}
    <path d="M222 115 l-22 40 h18 l-8 32 26 -44 h-18 z" fill={c2} />
    <path d="M300 150 h100" stroke={c1} strokeWidth="1.5" strokeDasharray="5 5" />
  </g>
);

const Notes = ({ c1, c2 }: ArtProps) => (
  <g>
    {[2, 1, 0].map((i) => (
      <g key={i} transform={`translate(${110 + i * 18} ${50 + i * 14}) rotate(${(i - 1) * 6})`}>
        <rect width="170" height="210" rx="10" fill={i === 0 ? '#111116' : '#0b0b10'} stroke={i === 0 ? '#fff' : c1} strokeWidth="2" strokeOpacity={i === 0 ? 1 : 0.5} />
        {i === 0 && (
          <>
            <rect x="20" y="24" width="90" height="12" rx="6" fill={c2} />
            {[0, 1, 2, 3, 4, 5, 6].map((l) => <rect key={l} x="20" y={56 + l * 18} width={130 - (l % 3) * 25} height="6" rx="3" fill="#fff" opacity="0.35" />)}
            <text x="20" y="190" fill={c1} fontFamily="monospace" fontSize="12">SELECT * FROM notes;</text>
          </>
        )}
      </g>
    ))}
  </g>
);

const NearPulse = ({ c1, c2 }: ArtProps) => (
  <g>
    {[35, 70, 105, 140].map((rad, i) => (
      <circle key={rad} cx="200" cy="150" r={rad} fill="none" stroke={c1} strokeOpacity={0.6 - i * 0.12} strokeWidth="1.5" />
    ))}
    <line x1="60" y1="150" x2="340" y2="150" stroke={c1} strokeOpacity="0.3" strokeDasharray="3 3" />
    <line x1="200" y1="10" x2="200" y2="290" stroke={c1} strokeOpacity="0.3" strokeDasharray="3 3" />
    <path d="M200 150 L310 80 A140 140 0 0 0 200 10 Z" fill={c1} opacity="0.3" />
    {[[160, 110], [250, 180], [230, 95], [130, 175]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="8" fill={c2} opacity="0.4" />
        <circle cx={x} cy={y} r="3.5" fill="#fff" />
      </g>
    ))}
  </g>
);

const arts: Record<string, React.FC<ArtProps>> = {
  'vexlora-nearpulse': NearPulse,
  'safepulse-bharat': SafePulse,
  'vexlora-events': Events,
  'rag-model': Rag,
  earnly: Earnly,
  'faceid-blockchain': FaceId,
  'mentor-ai': Mentor,
  'law-agency-agent': Law,
  'bharatplus-ai': BharatPlus,
  'bharat-os': BharatOs,
  'electro-zap': Electro,
  'pec-notes': Notes,
};

export const ProjectCover = ({ project, className = '' }: { project: Project; className?: string }) => {
  if (project.image) {
    return (
      <div className={`absolute inset-0 overflow-hidden bg-neutral-950 ${className}`}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s} className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border border-white/15 bg-black/50 text-neutral-300 backdrop-blur-md">{s}</span>
          ))}
        </div>
      </div>
    );
  }

  const h = project.hue;
  const c1 = `hsl(${h} 85% 62%)`;
  const c2 = `hsl(${(h + 70) % 360} 90% 65%)`;
  const c3 = `hsl(${(h + 180) % 360} 80% 60%)`;
  const Art = arts[project.id] ?? Rag;
  const seed = project.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const r = rng(seed);

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-neutral-950 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 25% 15%, hsl(${h} 90% 50% / 0.35), transparent 55%), radial-gradient(circle at 85% 95%, hsl(${(h + 70) % 360} 90% 50% / 0.25), transparent 50%)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full p-6 transition-transform duration-700 group-hover:scale-105">
        <defs>
          <linearGradient id={`sweep-${project.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} stopOpacity="0" />
            <stop offset="1" stopColor={c1} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <Art c1={c1} c2={c2} c3={c3} r={r} />
      </svg>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border border-white/15 bg-black/50 text-neutral-300">{s}</span>
        ))}
      </div>
    </div>
  );
};
