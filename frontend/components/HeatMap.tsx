'use client';
import MiniTrailGraph from './MiniTrailGraph';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const HeatLayer = dynamic(() => import('./HeatLayer'), { ssr: false });

export default function HeatMap({ atms, predictions, complaints }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-navy rounded-xl animate-pulse"></div>;

  const center: [number, number] = [28.6139, 77.2090];

  const heatPoints = complaints?.map((c: any) => [
    c.final_withdrawal_atm_lat,
    c.final_withdrawal_atm_lon,
    c.amount / 10000
  ]) || [];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-indigo shadow-sm">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {heatPoints.length > 0 && <HeatLayer points={heatPoints} />}

        {predictions?.map((pred: any, idx: number) => (
          <CircleMarker
  key={idx}
  center={[pred.lat, pred.lon]}
  radius={8}
  pathOptions={{
    color: '#0D47A1',
    fillColor: '#2196F3',
    fillOpacity: 0.85,
    weight: 2
  }}
>
  <Popup minWidth={240}>
  <div className="p-1">
    <p className="font-heading font-bold text-blue mb-1 text-xs uppercase">High Risk ATM</p>
    <p className="text-xs mb-1">Bank: {pred.bank}</p>
    <p className="text-xs mb-2">Risk Score: {pred.risk_score}</p>

    {pred.mule_account_chain && (
      <>
        <p className="text-[10px] uppercase text-slate-400 mb-1 tracking-wide">Money Trail</p>
        <MiniTrailGraph
          chain={pred.mule_account_chain.split(',')}
          targetLabel={`ATM: ${pred.bank}`}
        />
      </>
    )}
  </div>
</Popup>
</CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}