'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
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

// We need a separate component for the heat layer since it accesses the map instance directly
const HeatLayer = dynamic(() => import('./HeatLayer'), { ssr: false });

export default function HeatMap({ atms, predictions, complaints }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse"></div>;

  // Delhi center
  const center: [number, number] = [28.6139, 77.2090];
  
  // Extract heat points from complaints
  const heatPoints = complaints?.map((c: any) => [
    c.final_withdrawal_atm_lat,
    c.final_withdrawal_atm_lon,
    c.amount / 10000 // Intensity based on amount
  ]) || [];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.3)] border border-cyber-glass-border">
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

        {/* Render High Risk ATMs as red glowing pulses */}
        {predictions?.map((pred: any, idx: number) => (
          <CircleMarker
            key={idx}
            center={[pred.lat, pred.lon]}
            radius={8}
            pathOptions={{
              color: '#ff003c',
              fillColor: '#ff003c',
              fillOpacity: 0.8,
              weight: 2
            }}
          >
            <Popup className="cyber-popup">
              <div className="bg-slate-900 text-white p-2 rounded border border-cyber-pink">
                <p className="font-bold text-cyber-pink mb-1">HIGH RISK ATM</p>
                <p className="text-xs">Bank: {pred.bank}</p>
                <p className="text-xs">Risk Score: {pred.risk_score}</p>
                <p className="text-xs text-cyber-yellow">Window: {pred.predicted_time_window}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
