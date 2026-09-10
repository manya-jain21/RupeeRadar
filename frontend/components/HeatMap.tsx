'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr: false });

const HeatLayer = dynamic(() => import('./HeatLayer'), { ssr: false });

// Generates synthetic offset positions for mule-account nodes around a target ATM
function buildTrailNodes(targetLat: number, targetLon: number, chain: string[], riskScore: number) {
  const atmColor = riskScore > 90 ? '#C3110C' : '#0EA5E9';
  const nodes = [{ label: 'Fraud Origin', lat: targetLat + 0.025, lon: targetLon - 0.02, color: '#EF4444' }];
  chain.forEach((id, i) => {
    const t = (i + 1) / (chain.length + 1);
    nodes.push({
      label: id,
      lat: targetLat + 0.025 * (1 - t) - 0.006 * i,
      lon: targetLon - 0.02 * (1 - t) + 0.006 * i,
      color: '#F59E0B',
    });
  });
  nodes.push({ label: 'Target ATM', lat: targetLat, lon: targetLon, color: atmColor });
  return nodes;
}

export default function HeatMap({ atms, predictions, complaints }: any) {
  const [mounted, setMounted] = useState(false);
  const [activeTrail, setActiveTrail] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="h-full w-full bg-navy rounded-xl animate-pulse"></div>;

  const center: [number, number] = [28.6139, 77.2090];

  const heatPoints = complaints?.map((c: any) => [
    c.final_withdrawal_atm_lat,
    c.final_withdrawal_atm_lon,
    c.amount / 10000
  ]) || [];

  const trailNodes = activeTrail
    ? buildTrailNodes(activeTrail.lat, activeTrail.lon, activeTrail.chain, activeTrail.riskScore)
    : null;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-indigo shadow-sm">
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {heatPoints.length > 0 && <HeatLayer points={heatPoints} />}

        {predictions?.map((pred: any, idx: number) => (
          <CircleMarker
            key={idx}
            center={[pred.lat, pred.lon]}
            radius={8}
            pathOptions={{
              color: pred.risk_score > 90 ? '#C3110C' : '#0D47A1',
              fillColor: pred.risk_score > 90 ? '#C3110C' : '#2196F3',
              fillOpacity: 0.85,
              weight: 2
            }}
            eventHandlers={{
              click: () => setActiveTrail({
                lat: pred.lat,
                lon: pred.lon,
                chain: (pred.mule_account_chain?.split(',')) ?? ['a3f8ad25', '5033b07f', 'bd6f9a12'],
              }),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {pred.bank} · Risk {pred.risk_score}
            </Tooltip>
          </CircleMarker>
        ))}

        {trailNodes && (
  <>
    <Polyline
      positions={trailNodes.map(n => [n.lat, n.lon])}
      pathOptions={{ color: '#059669', weight: 4, opacity: 0.9, dashArray: '8 6' }}
    />
    {trailNodes.map((n, i) => (
      <CircleMarker
        key={i}
        center={[n.lat, n.lon]}
        radius={9}
        pathOptions={{ color: '#111827', fillColor: n.color, fillOpacity: 1, weight: 2 }}
      >
        <Tooltip
          permanent
          direction="right"
          offset={[10, 0]}
          className="!bg-navy !text-white !font-bold !text-[12px] !px-2 !py-1 !rounded-md !border !border-white/20 !opacity-100"
        >
          {n.label}
        </Tooltip>
      </CircleMarker>
    ))}
  </>
)}
      </MapContainer>
    </div>
  );
}