import React from 'react';
import { X, Sparkles, MoveHorizontal, Play, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface LabGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabGuideModal: React.FC<LabGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Welcome to Torsional Pendulum Virtual Lab</h2>
              <p className="text-xs text-slate-400">Quick start guide for college physics students</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <MoveHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">1. Twist the Inertia Disc</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Click and drag directly on the 3D suspended disc with your mouse/touch, or choose a quick twist angle preset (+15°, +30°, +45°) from the bottom dock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">2. Run Oscillations & Inspect Waveform</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Press <span className="text-cyan-400 font-semibold">Start Oscillation</span>. Observe the real-time degree dial markings, zero-crossing pointer, and live waveform oscilloscope. Step frame-by-frame or adjust simulation pace.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">3. Record Trials & Error Analysis</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Click <span className="text-emerald-400 font-semibold">Record Trial to Notebook</span> to log the time period and automatically compute the wire\'s rigidity modulus (η). Open the Lab Notebook to review observations, export CSV, and complete the Viva Voce quiz!
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it, Begin Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
