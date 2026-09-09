'use client';

export default function MiniTrailGraph({ chain, originLabel = 'Fraud Origin', targetLabel = 'Target ATM' }: { chain: string[]; originLabel?: string; targetLabel?: string }) {
  const nodes = [originLabel, ...chain, targetLabel];
  const width = 220;
  const height = 40 + nodes.length * 34;
  const cx = width / 2;

  const points = nodes.map((_, i) => ({
    x: cx + (i % 2 === 0 ? -30 : 30) * (i === 0 || i === nodes.length - 1 ? 0 : 1),
    y: 20 + i * 34,
  }));

  return (
    <svg width={width} height={height} className="overflow-visible">
      {points.slice(0, -1).map((p, i) => (
        <line
          key={i}
          x1={p.x} y1={p.y}
          x2={points[i + 1].x} y2={points[i + 1].y}
          stroke="#10B981"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      ))}
      {points.map((p, i) => {
        const isEnd = i === 0 || i === nodes.length - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x} cy={p.y} r={5}
              fill={i === 0 ? '#EF4444' : isEnd ? '#0EA5E9' : '#F59E0B'}
              stroke="#111827"
              strokeWidth={1}
            />
            <text
              x={p.x + (p.x < cx ? -10 : 10)}
              y={p.y + 4}
              textAnchor={p.x < cx ? 'end' : 'start'}
              fontSize={10}
              fill="#374151"
              fontFamily="var(--font-body)"
            >
              {nodes[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}