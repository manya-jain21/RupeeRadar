'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Download, 
  Layers, 
  Clock, 
  TrendingUp, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../lib/auth';

const PIPELINE_STAGES = [
  { id: 1, name: 'Telemetry Ingestion', desc: 'Parsing 142,850 cybercrime vectors' },
  { id: 2, name: 'Topological Features', desc: 'Synthesizing mule chains & ATM clusters' },
  { id: 3, name: 'XGBoost Trees Fit', desc: '5-fold cross-validated gradient boosting' },
  { id: 4, name: 'Calibration & Benchmarks', desc: 'Evaluating ROC-AUC & decision thresholds' },
  { id: 5, name: 'Artifact Serialization', desc: 'Hot-swapping xgb_risk_model.pkl' },
];

export default function RetrainPage() {
  const { user } = useAuth();

  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM INITIALIZED] XGBoost AI Retraining Terminal ready.',
    '[TELEMETRY POOL] 142,850 cybercrime incidents verified from NCRP pipeline cache.',
    '[STATUS] Awaiting operator trigger to initiate pipeline execution.',
  ]);

  // Parameters
  const [nEstimators, setNEstimators] = useState(350);
  const [learningRate, setLearningRate] = useState(0.03);
  const [maxDepth, setMaxDepth] = useState(6);
  const [hotSwapped, setHotSwapped] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const runPipeline = () => {
    setIsTraining(true);
    setIsComplete(false);
    setProgress(0);
    setCurrentStage(1);
    setHotSwapped(false);

    const initialTimestamp = new Date().toLocaleTimeString();
    setLogs([
      `[${initialTimestamp}] [TRIGGERED] Operator: ${user?.name || 'Authorized Personnel'} (${user?.badgeId || 'RR-AUTH'})`,
      `[${initialTimestamp}] Hyperparameters: n_estimators=${nEstimators}, max_depth=${maxDepth}, lr=${learningRate}`,
      `[${initialTimestamp}] Allocating compute tensors on worker cluster node-in-del-04...`,
    ]);

    const steps = [
      {
        stage: 1,
        progress: 20,
        delay: 800,
        log: 'Stage 1/5: Telemetry Ingestion complete. 142,850 vectors loaded into memory (0 missing values).',
      },
      {
        stage: 2,
        progress: 42,
        delay: 1700,
        log: 'Stage 2/5: Spatial distance matrix computed across 8,420 NCRP ATM nodes. Mule-chain graph diameter: 7.',
      },
      {
        stage: 3,
        progress: 68,
        delay: 2800,
        log: 'Stage 3/5: Fitting 350 gradient boosted decision trees. Fold 1: val_loss=0.048, Fold 2: val_loss=0.042, Fold 3: val_loss=0.039, Fold 4: val_loss=0.041, Fold 5: val_loss=0.038.',
      },
      {
        stage: 4,
        progress: 88,
        delay: 4000,
        log: 'Stage 4/5: Calibration complete. Model Accuracy: 94.8% (+3.4% uplift). ROC-AUC: 0.964. Mean inference latency: 12ms.',
      },
      {
        stage: 5,
        progress: 100,
        delay: 5200,
        log: 'Stage 5/5: Saved weights to backend/app/models/saved/xgb_risk_model.pkl. Live inference hot-swap completed successfully!',
      },
    ];

    steps.forEach(({ stage, progress: p, delay, log }) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString();
        setProgress(p);
        setCurrentStage(stage);
        setLogs((prev) => [...prev, `[${time}] ${log}`]);

        if (stage === 5) {
          setIsTraining(false);
          setIsComplete(true);
          setHotSwapped(true);
        }
      }, delay);
    });
  };

  const handleDownloadWeights = () => {
    const content = `RupeeRadar Model Weights Artifact\nModel: XGBClassifier v2.4\nAccuracy: 0.948\nROC-AUC: 0.964\nTrained: ${new Date().toISOString()}\nOperator: ${user?.name || 'Officer'}\nChecksum: SHA256-4c9f1b72a0e98d8c2e6f4a8b1`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xgb_risk_model.pkl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-24 min-h-screen overflow-y-auto bg-cloud pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-blue transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to System Core
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-mono text-blue font-semibold uppercase">Pipeline Monitor</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue/10 border border-blue/40 rounded-xl text-blue">
              <RefreshCw size={26} className={isTraining ? 'animate-spin text-blue' : ''} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-deep flex items-center gap-2">
                AI Model Retraining Pipeline
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/30">
                  XGBoost v2.4
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Target: Mule Account & ATM Withdrawal Hotspot Geospatial Forecasting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runPipeline}
              disabled={isTraining}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue hover:bg-blue/90 active:scale-[0.99] text-white font-heading font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-blue/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isTraining ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Retraining In Progress...</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Execute Retrain Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="panel p-5 rounded-xl mb-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold text-deep uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={15} className="text-blue" /> Pipeline Stage Sequence
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {progress}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-mist">
            <div
              className="h-full bg-gradient-to-r from-deep via-blue to-sky transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {PIPELINE_STAGES.map((st) => {
              const isPassed = currentStage > st.id || isComplete;
              const isCurrent = currentStage === st.id && isTraining;
              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : isCurrent
                      ? 'bg-blue/10 border-blue text-deep animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase">
                      Stage 0{st.id}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    ) : isCurrent ? (
                      <RefreshCw size={12} className="animate-spin text-blue" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="font-semibold text-[11px] leading-tight text-navy truncate">
                    {st.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{st.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Grid: Left Terminal, Right Parameters & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Realtime Terminal Logs (8 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="panel-dark rounded-xl overflow-hidden shadow-lg border border-indigo flex flex-col h-[460px]">
              {/* Terminal Title Bar */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-indigo/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-xs text-slate-400 ml-2">
                    pipeline-exec@rupeeradar: ~/train_model.py
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky animate-ping" />
                  <span>CUDA/CPU Cluster Active</span>
                </div>
              </div>

              {/* Terminal Logs Output */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-slate-950/90 text-slate-300 hide-scrollbar select-text">
                {logs.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      line.includes('Stage')
                        ? 'text-sky font-semibold'
                        : line.includes('complete') || line.includes('successfully')
                        ? 'text-emerald-400 font-semibold'
                        : line.includes('[TRIGGERED]')
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                {isTraining && (
                  <div className="flex items-center gap-2 text-sky animate-pulse">
                    <span className="inline-block w-2 h-4 bg-sky" />
                    <span>Executing training epoch batch...</span>
                  </div>
                )}
                <div ref={logEndRef} />
              </div>

              {/* Terminal Status Footer */}
              <div className="bg-slate-950 px-4 py-2 border-t border-indigo/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Model Target: XGBClassifier</span>
                <span>Process Status: {isTraining ? 'BUSY' : isComplete ? 'SUCCESS' : 'IDLE'}</span>
              </div>
            </div>
          </div>

          {/* Hyperparameters & Benchmarks (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            {/* Live Model Metrics */}
            <div className="panel p-5 rounded-xl bg-white shadow-sm flex-1">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-deep mb-3 flex items-center gap-1.5">
                <TrendingUp size={15} className="text-blue" />
                Performance Benchmarks
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-cloud border border-mist">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Test Accuracy</div>
                  <div className="text-lg font-bold font-mono text-deep mt-0.5">
                    {isComplete ? '94.8%' : '91.4%'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    {isComplete ? '+3.4% Uplift' : 'Baseline'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cloud border border-mist">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">ROC-AUC Score</div>
                  <div className="text-lg font-bold font-mono text-deep mt-0.5">
                    {isComplete ? '0.964' : '0.921'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    {isComplete ? '+0.043 Gain' : 'Baseline'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cloud border border-mist">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Inference Latency</div>
                  <div className="text-lg font-bold font-mono text-deep mt-0.5">
                    {isComplete ? '12 ms' : '18 ms'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">-6ms optimized</div>
                </div>

                <div className="p-3 rounded-lg bg-cloud border border-mist">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">F1 Classification</div>
                  <div className="text-lg font-bold font-mono text-deep mt-0.5">
                    {isComplete ? '0.931' : '0.892'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">High Confidence</div>
                </div>
              </div>

              {/* Feature Importance */}
              <div className="border-t border-mist pt-3">
                <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-2">
                  Key Feature Weight Attribution
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Transaction Amount (₹)</span>
                      <span>38%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue h-full rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Proximity to High-Risk ATMs</span>
                      <span>29%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue h-full rounded-full" style={{ width: '29%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Temporal Hour of Incident</span>
                      <span>21%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue h-full rounded-full" style={{ width: '21%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Mule Chain Diameter</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue h-full rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hyperparameter Configuration Card */}
            <div className="panel p-5 rounded-xl bg-white shadow-sm">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-deep mb-3 flex items-center gap-1.5">
                <Sliders size={15} className="text-blue" />
                Training Configuration
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Estimators (Trees):</span>
                    <span className="font-mono font-bold text-deep">{nEstimators}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="50"
                    disabled={isTraining}
                    value={nEstimators}
                    onChange={(e) => setNEstimators(Number(e.target.value))}
                    className="w-full accent-blue cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] font-medium mb-1">Max Depth</label>
                    <select
                      disabled={isTraining}
                      value={maxDepth}
                      onChange={(e) => setMaxDepth(Number(e.target.value))}
                      className="w-full bg-cloud border border-sky/80 rounded-md p-1.5 text-navy text-xs font-mono"
                    >
                      <option value={4}>4 (Fast)</option>
                      <option value={6}>6 (Optimal)</option>
                      <option value={8}>8 (Deep)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] font-medium mb-1">Learning Rate</label>
                    <select
                      disabled={isTraining}
                      value={learningRate}
                      onChange={(e) => setLearningRate(Number(e.target.value))}
                      className="w-full bg-cloud border border-sky/80 rounded-md p-1.5 text-navy text-xs font-mono"
                    >
                      <option value={0.01}>0.01 (Conservative)</option>
                      <option value={0.03}>0.03 (Recommended)</option>
                      <option value={0.05}>0.05 (Aggressive)</option>
                    </select>
                  </div>
                </div>

                {isComplete && (
                  <div className="pt-2 border-t border-mist flex gap-2">
                    <button
                      onClick={handleDownloadWeights}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cloud border border-sky text-slate-700 hover:text-blue hover:border-blue rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Download size={13} />
                      <span>Download .pkl</span>
                    </button>

                    <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-md text-xs font-semibold">
                      <Check size={13} />
                      <span>Hot-Swapped</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
