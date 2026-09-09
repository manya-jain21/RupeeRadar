'use client';

import { useEffect, useState } from 'react';
import HeatMap from '../components/HeatMap';
import RiskList from '../components/RiskList';
import ComplaintFeed from '../components/ComplaintFeed';
import { fetchComplaints, fetchPredictions } from '../lib/api';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    async function load() {
      const c = await fetchComplaints();
      if (c.status === 'success') setComplaints(c.data);
      const p = await fetchPredictions();
      if (p.status === 'success') setPredictions(p.data);
    }
    load();
  }, []);

  return (
    <div className="h-screen w-screen relative">
      {/* Full-bleed map */}
      <div className="absolute inset-0 z-0">
        <HeatMap atms={[]} predictions={predictions} complaints={complaints} />
      </div>

      {/* Floating left panel */}
      <div className="absolute top-24 bottom-6 left-6 w-80 z-[500] panel rounded-xl overflow-hidden">
        <ComplaintFeed complaints={complaints} />
      </div>

      {/* Floating right panel */}
      <div className="absolute top-24 bottom-6 right-6 w-80 z-[500] panel rounded-xl overflow-hidden">
        <RiskList predictions={predictions} />
      </div>
    </div>
  );
}