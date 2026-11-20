import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Eye, Download } from 'lucide-react';

export interface DataPoint {
  time: number;
  theta: number; // in radians
  omega: number; // in rad/s
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
}

interface OscillationChartProps {
  data: DataPoint[];
  initialAngle: number;
  theoreticalPeriod: number;
  gamma: number; // damping
  onClear: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const OscillationChart: React.FC<OscillationChartProps> = ({
  data,
  initialAngle,
  theoreticalPeriod,
  gamma,
  onClear,
  isPaused,
  onTogglePause,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plotMode, setPlotMode] = useState<'theta' | 'both' | 'phase' | 'energy'>('theta');
  const [timeWindow, setTimeWindow] = useState<number>(15); // seconds
  const [hoveredPoint, setHoveredPoint] = useState<{ time: number; thetaDeg: number; omega: number } | null>(null);

  // Render chart onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark sleek background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Margins
    const padL = 55;
    const padR = 25;
    const padT = 20;
    const padB = 35;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    if (plotW <= 10 || plotH <= 10) {
      ctx.restore();
      return;
    }

    // Grid line styling
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    if (plotMode === 'phase') {
      // PHASE PORTRAIT: Theta (horizontal) vs Omega (vertical)
      const maxTheta = Math.max(Math.abs(initialAngle) * 1.25, 0.2);
      const maxOmegaVal = data.length > 0 ? Math.max(...data.map(d => Math.abs(d.omega))) : 0;
      const maxOmega = Math.max(maxOmegaVal, 1.0) * 1.25;

      const toX = (th: number) => padL + ((th + maxTheta) / (2 * maxTheta)) * plotW;
      const toY = (om: number) => padT + (1 - (om + maxOmega) / (2 * maxOmega)) * plotH;

      // Center crosshairs
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(toX(0), padT);
      ctx.lineTo(toX(0), padT + plotH);
      ctx.moveTo(padL, toY(0));
      ctx.lineTo(padL + plotW, toY(0));
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('θ (rad)', padL + plotW / 2, height - 10);
      ctx.save();
      ctx.translate(16, padT + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('ω (rad/s)', 0, 0);
      ctx.restore();

      // Draw trajectory
      if (data.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4'; // Cyan
        ctx.lineWidth = 2;
        data.forEach((p, idx) => {
          const x = toX(p.theta);
          const y = toY(p.omega);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Current point marker
        const last = data[data.length - 1];
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(toX(last.theta), toY(last.omega), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (plotMode === 'energy') {
      // ENERGY PLOT: Potential, Kinetic, Total vs Time
      const maxTime = data.length > 0 ? data[data.length - 1].time : timeWindow;
      const minTime = Math.max(0, maxTime - timeWindow);
      const visibleData = data.filter(d => d.time >= minTime && d.time <= maxTime);

      const maxEnergyVal = data.length > 0 ? Math.max(...data.map(d => d.totalEnergy)) : 0;
      const maxEnergy = Math.max(maxEnergyVal, 0.05) * 1.2;

      const toX = (t: number) => padL + ((t - minTime) / timeWindow) * plotW;
      const toY = (e: number) => padT + (1 - e / maxEnergy) * plotH;

      // Grid horizontal lines
      for (let i = 0; i <= 4; i++) {
        const val = (i / 4) * maxEnergy;
        const y = toY(val);
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(padL + plotW, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(3) + ' J', padL - 8, y + 4);
      }

      // Draw Potential Energy (amber)
      if (visibleData.length > 1) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        visibleData.forEach((p, idx) => {
          const x = toX(p.time);
          const y = toY(p.potentialEnergy);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Kinetic Energy (cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        visibleData.forEach((p, idx) => {
          const x = toX(p.time);
          const y = toY(p.kineticEnergy);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Total Energy (emerald)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        visibleData.forEach((p, idx) => {
          const x = toX(p.time);
          const y = toY(p.totalEnergy);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      // Legend
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('■ Ep (Strain)', padL + 10, padT + 12);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('■ Ek (Rotational)', padL + 120, padT + 12);
      ctx.fillStyle = '#10b981';
      ctx.fillText('■ E_total', padL + 250, padT + 12);

    } else {
      // TIME SERIES PLOT: theta(t) and optionally omega(t)
      const maxTime = data.length > 0 ? data[data.length - 1].time : timeWindow;
      const minTime = Math.max(0, maxTime - timeWindow);
      const visibleData = data.filter(d => d.time >= minTime && d.time <= maxTime);

      // Max angular amplitude in degrees
      const maxThetaDeg = Math.max(Math.abs((initialAngle * 180) / Math.PI) * 1.2, 15);

      const toX = (t: number) => padL + ((t - minTime) / timeWindow) * plotW;
      const toY = (deg: number) => padT + (1 - (deg + maxThetaDeg) / (2 * maxThetaDeg)) * plotH;

      // Grid lines: horizontal degree lines
      const stepDeg = maxThetaDeg > 60 ? 30 : maxThetaDeg > 30 ? 15 : 5;
      for (let deg = -Math.floor(maxThetaDeg / stepDeg) * stepDeg; deg <= maxThetaDeg; deg += stepDeg) {
        const y = toY(deg);
        ctx.strokeStyle = deg === 0 ? '#475569' : '#1e293b';
        ctx.lineWidth = deg === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(padL + plotW, y);
        ctx.stroke();

        ctx.fillStyle = deg === 0 ? '#94a3b8' : '#64748b';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${deg}°`, padL - 8, y + 4);
      }

      // Vertical time grid lines
      const timeStep = timeWindow <= 10 ? 2 : timeWindow <= 20 ? 5 : 10;
      const startTimeGrid = Math.ceil(minTime / timeStep) * timeStep;
      for (let t = startTimeGrid; t <= minTime + timeWindow; t += timeStep) {
        const x = toX(t);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + plotH);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${t.toFixed(0)}s`, x, height - 12);
      }

      // Theoretical Damped Envelope lines (+/- theta0 * exp(-gamma * t))
      if (initialAngle !== 0) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // Translucent red dash
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);

        const initDeg = Math.abs((initialAngle * 180) / Math.PI);
        ctx.beginPath();
        for (let xPix = padL; xPix <= padL + plotW; xPix += 3) {
          const tVal = minTime + ((xPix - padL) / plotW) * timeWindow;
          const envVal = initDeg * Math.exp(-gamma * tVal);
          const y = toY(envVal);
          if (xPix === padL) ctx.moveTo(xPix, y);
          else ctx.lineTo(xPix, y);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let xPix = padL; xPix <= padL + plotW; xPix += 3) {
          const tVal = minTime + ((xPix - padL) / plotW) * timeWindow;
          const envVal = -initDeg * Math.exp(-gamma * tVal);
          const y = toY(envVal);
          if (xPix === padL) ctx.moveTo(xPix, y);
          else ctx.lineTo(xPix, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Angular Displacement Theta Curve (Emerald green)
      if (visibleData.length > 1) {
        ctx.strokeStyle = '#38bdf8'; // Sky blue / cyan
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        visibleData.forEach((p, idx) => {
          const deg = (p.theta * 180) / Math.PI;
          const x = toX(p.time);
          const y = toY(deg);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Optional Angular Velocity Overlay (Amber)
        if (plotMode === 'both') {
          // Normalize omega to fit scale
          const maxOmega = Math.max(...visibleData.map(d => Math.abs(d.omega)), 0.1);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          visibleData.forEach((p, idx) => {
            const scaledOmegaDeg = (p.omega / maxOmega) * (maxThetaDeg * 0.8);
            const x = toX(p.time);
            const y = toY(scaledOmegaDeg);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }

      // Graph Legend
      ctx.font = '10px "JetBrains Mono", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('■ θ (Displacement deg)', padL + 6, padT + 12);
      if (plotMode === 'both') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('■ ω (Velocity [scaled])', padL + 145, padT + 12);
      }
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillText('- - Theoretical Envelope', width - padR - 145, padT + 12);
    }

    ctx.restore();
  }, [data, plotMode, timeWindow, initialAngle, theoreticalPeriod, gamma]);

  // Export graph as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `torsional_pendulum_waveform_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/95 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-semibold text-slate-200 text-[11px]">Waveform</span>
          <span className="text-slate-500 font-mono text-[10px]">
            {data.length > 0 ? `${data[data.length - 1].time.toFixed(1)}s` : '0.0s'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Plot mode selectors */}
          <div className="flex bg-slate-800/80 rounded-md p-0.5 border border-slate-700/60">
            <button
              onClick={() => setPlotMode('theta')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                plotMode === 'theta' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              θ(t)
            </button>
            <button
              onClick={() => setPlotMode('both')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                plotMode === 'both' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              θ & ω
            </button>
            <button
              onClick={() => setPlotMode('phase')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                plotMode === 'phase' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase
            </button>
            <button
              onClick={() => setPlotMode('energy')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                plotMode === 'energy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Energy
            </button>
          </div>

          {/* Time window selector */}
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-[10px] font-mono outline-none"
          >
            <option value={10}>10s</option>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>

          {/* Actions */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume stream' : 'Pause stream'}
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={onClear}
            title="Clear waveform"
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={handleExportPNG}
            title="Export chart as PNG"
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 w-full min-h-[180px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
