const BUTTERFLY_SVG = (size: number, color: string) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="12" rx="9" ry="11" fill={color} opacity="0.7" transform="rotate(-20 10 12)" />
    <ellipse cx="30" cy="12" rx="9" ry="11" fill={color} opacity="0.7" transform="rotate(20 30 12)" />
    <ellipse cx="8" cy="22" rx="7" ry="7" fill={color} opacity="0.5" transform="rotate(-30 8 22)" />
    <ellipse cx="32" cy="22" rx="7" ry="7" fill={color} opacity="0.5" transform="rotate(30 32 22)" />
    <path d="M20 2 Q21 15 20 28" stroke="#be185d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 2 Q16 0 14 1" stroke="#be185d" strokeWidth="1" strokeLinecap="round" />
    <path d="M22 2 Q24 0 26 1" stroke="#be185d" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const BUTTERFLIES = [
  { top: '8%', left: '5%', size: 28, color: '#fda4af', anim: 'animate-butterfly-1', opacity: 0.35 },
  { top: '20%', right: '8%', size: 22, color: '#f9a8d4', anim: 'animate-butterfly-2', opacity: 0.3 },
  { top: '45%', left: '3%', size: 18, color: '#fda4af', anim: 'animate-butterfly-3', opacity: 0.25 },
  { top: '60%', right: '5%', size: 26, color: '#fbcfe8', anim: 'animate-butterfly-4', opacity: 0.3 },
  { top: '75%', left: '10%', size: 20, color: '#fda4af', anim: 'animate-butterfly-5', opacity: 0.28 },
  { top: '15%', left: '45%', size: 16, color: '#f9a8d4', anim: 'animate-butterfly-6', opacity: 0.2 },
  { top: '85%', right: '15%', size: 24, color: '#fecdd3', anim: 'animate-butterfly-7', opacity: 0.25 },
];

export function ButterflyLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          className={b.anim}
          style={{
            position: 'absolute',
            top: b.top,
            left: 'left' in b ? b.left : undefined,
            right: 'right' in b ? (b as { right: string }).right : undefined,
            opacity: b.opacity,
          }}
        >
          {BUTTERFLY_SVG(b.size, b.color)}
        </div>
      ))}
    </div>
  );
}
