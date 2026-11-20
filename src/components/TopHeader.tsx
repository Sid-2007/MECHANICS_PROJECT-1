import React from 'react';
import {
  Compass,
  BookOpen,
  FileText,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { WIRE_MATERIALS } from '../physics/torsionalPendulum.ts';
import { IIITDMLogo } from './IIITDMLogo.tsx';

interface TopHeaderProps {
  isRunning: boolean;
  isDragging: boolean;
  wireMaterial: string;
  wireLength: number;
  wireRadius: number;
  discMass: number;
  discRadius: number;
  theoreticalPeriod: number;
  readingsCount: number;
  onOpenNotebook: () => void;
  onOpenDerivations: () => void;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onReturnToTheory: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  isRunning,
  isDragging,
  wireMaterial,
  wireLength,
  wireRadius,
  discMass,
  discRadius,
  theoreticalPeriod,
  readingsCount,
  onOpenNotebook,
  onOpenDerivations,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
  onReset,
  onReturnToTheory,
}) => {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
      {/* Left: Branding & Apparatus Live Spec Pill + Return to Theory */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onReturnToTheory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/90 hover:bg-zinc-900 border border-zinc-700 hover:border-sky-500 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl transition group cursor-pointer"
          title="Return to Theory & Guide Page"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Theory & Guide</span>
        </button>

        <div className="flex items-center gap-3 bg-zinc-950/90 border border-zinc-800 rounded-2xl px-3.5 py-2 shadow-2xl backdrop-blur-xl">
          <IIITDMLogo size={34} />
          <div className="hidden xl:block leading-tight border-r border-zinc-700 pr-3">
            <div className="text-[9px] font-bold tracking-wider text-amber-400">PDPM IIITDM</div>
            <div className="text-[9px] text-slate-400">Jabalpur</div>
          </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              Torsional Pendulum Lab
            </h1>

            {/* Static State Badge (No pulsating dots) */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isDragging
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : isRunning
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}
            >
              {isDragging ? 'Twisting Disc' : isRunning ? 'Oscillating' : 'Paused'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
            <span className="text-slate-300 capitalize">{WIRE_MATERIALS[wireMaterial]?.name || wireMaterial}</span>
            <span>·</span>
            <span>L: {wireLength.toFixed(2)}m</span>
            <span>·</span>
            <span>r: {(wireRadius * 1000).toFixed(2)}mm</span>
            <span>·</span>
            <span>M: {discMass.toFixed(1)}kg</span>
            <span>·</span>
            <span className="text-cyan-400">T₀: {theoreticalPeriod.toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </div>

      {/* Right: Quick Action Hub */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Interactive Drag Hint */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click & drag 3D disc to twist</span>
        </div>

        {/* Derivations Quick Card */}
        <button
          onClick={onOpenDerivations}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-semibold shadow-lg backdrop-blur-xl transition"
          title="View formulas and derivations"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Formulas & Derivations</span>
        </button>

        {/* Lab Notebook Button */}
        <button
          onClick={onOpenNotebook}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 backdrop-blur-xl transition"
        >
          <BookOpen className="w-4 h-4" />
          <span>Lab Notebook</span>
          {readingsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-cyan-400 font-mono font-bold">
              {readingsCount}
            </span>
          )}
        </button>

        {/* Instructions / Lab Guide */}
        <button
          onClick={onOpenGuide}
          className="p-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 shadow-lg backdrop-blur-xl transition"
          title="Lab Objectives & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
