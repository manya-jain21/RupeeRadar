'use client';

import { Network } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// ForceGraph2D must be imported dynamically with SSR disabled
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function NetworkPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate mock graph data for demo
    const nodes = [
      { id: 'origin', name: 'Fraud Origin', val: 10, color: '#ff003c' },
    ];
    const links = [];
    
    // Mule chains
    for (let i = 1; i <= 3; i++) {
      nodes.push({ id: `mule_${i}_1`, name: `Mule Account L1`, val: 5, color: '#fcee0a' });
      links.push({ source: 'origin', target: `mule_${i}_1` });
      
      nodes.push({ id: `mule_${i}_2`, name: `Mule Account L2`, val: 5, color: '#fcee0a' });
      links.push({ source: `mule_${i}_1`, target: `mule_${i}_2` });
      
      nodes.push({ id: `atm_${i}`, name: `Target ATM ${i}`, val: 8, color: '#00f0ff' });
      links.push({ source: `mule_${i}_2`, target: `atm_${i}` });
    }
    
    setGraphData({ nodes, links } as any);
  }, []);

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <header className="flex items-center gap-3 mb-6">
        <Network size={28} className="text-cyber-pink animate-pulse" />
        <h2 className="text-xl font-bold tracking-widest uppercase">Money Trail Analysis</h2>
      </header>
      
      <div className="flex-1 glass-panel rounded-xl border border-cyber-glass-border flex items-center justify-center relative overflow-hidden">
        {mounted ? (
          <ForceGraph2D
            graphData={graphData}
            nodeLabel="name"
            nodeRelSize={6}
            linkColor={() => 'rgba(0, 240, 255, 0.4)'}
            linkWidth={1.5}
            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={0.01}
            backgroundColor="#0f172a"
            nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
              const label = node.name;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

              ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = node.color;
              ctx.fillText(label, node.x, node.y);

              node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
            }}
            nodePointerAreaPaint={(node: any, color: any, ctx: any) => {
              ctx.fillStyle = color;
              const bckgDimensions = node.__bckgDimensions;
              bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
            }}
          />
        ) : (
          <div className="text-cyber-blue animate-pulse tracking-widest uppercase font-bold">Initializing AI Graph Engine...</div>
        )}
      </div>
    </div>
  );
}
