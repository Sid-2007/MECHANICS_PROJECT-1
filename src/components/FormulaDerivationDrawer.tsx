import React from 'react';
import { X, Layers, Check, Calculator } from 'lucide-react';
import { WIRE_MATERIALS } from '../physics/torsionalPendulum.ts';

interface FormulaDerivationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wireMaterial: string;
  wireLength: number;
  wireRadius: number;
  discMass: number;
  discRadius: number;
  inertia: number;
  torsionalConstant: number;
  theoreticalPeriod: number;
}

export const FormulaDerivationDrawer: React.FC<FormulaDerivationDrawerProps> = ({
  isOpen,
  onClose,
  wireMaterial,
  wireLength,
  wireRadius,
  discMass,
  discRadius,
  inertia,
  torsionalConstant,
  theoreticalPeriod,
}) => {
  if (!isOpen) return null;

  const currentEta = WIRE_MATERIALS[wireMaterial]?.shearModulus || 7.9e10;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Formula & Derivation Reference</h3>
            <p className="text-[11px] text-slate-400">Fundamental equations of torsional oscillations</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-300">
        {/* Card 1: Moment of Inertia */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100">1. Moment of Inertia (I)</span>
            <span className="font-mono text-cyan-400 font-semibold">{inertia.toExponential(4)} kg·m<sup>2</sup></span>
          </div>
          <p className="leading-relaxed">
            For a uniform solid circular disc of mass <span className="font-mono text-slate-200">M</span> and radius <span className="font-mono text-slate-200">R</span> rotating about its central perpendicular axis:
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-sm text-cyan-300">
            I = (1/2) · M · R<sup>2</sup>
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded">
            = 0.5 × {discMass.toFixed(2)} kg × ({discRadius.toFixed(2)} m)<sup>2</sup>
          </div>
        </div>

        {/* Card 2: Torsional Constant */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100">2. Torsional Constant (C)</span>
            <span className="font-mono text-amber-400 font-semibold">{torsionalConstant.toExponential(4)} N·m/rad</span>
          </div>
          <p className="leading-relaxed">
            The restoring torque per unit radian twist in a solid cylindrical wire of shear modulus <span className="font-mono text-slate-200">η</span>, radius <span className="font-mono text-slate-200">r</span>, and length <span className="font-mono text-slate-200">L</span>:
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-sm text-amber-300">
            C = (π · η · r<sup>4</sup>) / (2 · L)
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded">
            = (π × {currentEta.toExponential(2)} × {(wireRadius * 1000).toFixed(2)}<sup>4</sup>×10<sup>-12</sup>) / (2 × {wireLength.toFixed(2)})
          </div>
        </div>

        {/* Card 3: Equation of Motion */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="font-bold text-slate-100 block">3. Equation of Rotational Motion</span>
          <p className="leading-relaxed">
            Applying rotational dynamics with restoring torque <span className="font-mono text-cyan-300">τ = -Cθ</span> and damping <span className="font-mono text-cyan-300">-b(dθ/dt)</span>:
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-sm text-emerald-300">
            I(d<sup>2</sup>θ/dt<sup>2</sup>) + b(dθ/dt) + Cθ = 0
          </div>
          <p className="leading-relaxed text-[11px]">
            For undamped or lightly damped motion (<span className="font-mono">b ≈ 0</span>), this yields simple harmonic motion with:
          </p>
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-xs text-slate-200">
            ω₀ = √(C / I)
          </div>
        </div>

        {/* Card 4: Periodic Time T */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100">4. Time Period (T)</span>
            <span className="font-mono text-emerald-400 font-semibold">{theoreticalPeriod.toFixed(3)} s</span>
          </div>
          <p className="leading-relaxed">
            Substituting <span className="font-mono text-slate-200">I</span> and <span className="font-mono text-slate-200">C</span>:
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-sm text-emerald-400 font-bold">
            T = 2π · √(I / C) = 2 · √((π · M · R<sup>2</sup> · L) / (η · r<sup>4</sup>))
          </div>
        </div>

        {/* Card 5: Rigidity Modulus Formula */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="font-bold text-slate-100 block">5. Rigidity Modulus (η) from Experiment</span>
          <p className="leading-relaxed">
            Squaring both sides of the period equation and solving for <span className="font-mono text-slate-200">η</span>:
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-center text-sm text-cyan-300 font-bold">
            η = (4π · M · R<sup>2</sup> · L) / (T<sup>2</sup> · r<sup>4</sup>)
          </div>
          <p className="text-[11px] text-slate-400">
            By determining the time period <span className="font-mono">T</span> for a given wire length <span className="font-mono">L</span>, the rigidity modulus of the wire is determined directly in the laboratory.
          </p>
        </div>
      </div>
    </div>
  );
};
