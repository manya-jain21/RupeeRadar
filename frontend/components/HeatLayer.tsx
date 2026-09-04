'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

export default function HeatLayer({ points }: { points: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    // Create heat layer
    // @ts-ignore - leaflet.heat adds this to L
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 14,
      gradient: {
        0.4: '#00f0ff', // Cyber blue
        0.6: '#fcee0a', // Cyber yellow
        0.8: '#ff003c', // Cyber pink
        1.0: '#ff0000'  // Pure red
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
