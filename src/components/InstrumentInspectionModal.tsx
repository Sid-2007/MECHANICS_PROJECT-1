import React, { useState } from 'react';
import { X, Ruler, HelpCircle, CheckCircle2, ChevronRight, Scale } from 'lucide-react';

interface InstrumentInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wireRadiusMeters: number;
  discRadiusMeters: number;
  discMassKg: number;
  initialTool?: 'screwGauge' | 'vernier' | 'balance';
}

export const InstrumentInspectionModal: React.FC<InstrumentInspectionModalProps> = ({
  isOpen,
  onClose,
  wireRadiusMeters,
  discRadiusMeters,
  discMassKg,
  initialTool = 'screwGauge',
}) => {
  const [activeTool, setActiveTool] = useState<'screwGauge' | 'vernier' | 'balance'>(initialTool);

  React.useEffect(() => {
    if (initialTool && isOpen) {
      setActiveTool(initialTool);
    }
  }, [initialTool, isOpen]);

  if (!isOpen) return null;

  // Wire diameter in mm
  const wireDiameterMm = wireRadiusMeters * 2000;
  // Screw gauge pitch is 0.5 mm, 50 circular divisions => LC = 0.01 mm
  const pitchMm = 0.5;
  const leastCountScrewGauge = 0.01;
  const msrMm = Math.floor(wireDiameterMm / pitchMm) * pitchMm;
  const remainderMm = wireDiameterMm - msrMm;
  const csrDivision = Math.round(remainderMm / leastCountScrewGauge) % 50;
  const calculatedWireDiameter = msrMm + csrDivision * leastCountScrewGauge;

  // Disc diameter in cm
  const discDiameterCm = discRadiusMeters * 200;
  const discDiameterMm = discDiameterCm * 10;
  const msrVernierMm = Math.floor(discDiameterMm);
  const vernierCoincidence = Math.round((discDiameterMm - msrVernierMm) * 10);
  const leastCountVernier = 0.1; // mm = 0.01 cm

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Laboratory Metrology Bench
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono">
                  INSTRUMENT READINGS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Precision dimensional measurements matching your virtual apparatus configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2">
          <button
            onClick={() => setActiveTool('screwGauge')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTool === 'screwGauge'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Micrometer Screw Gauge (Wire Diameter 2r)
          </button>
          <button
            onClick={() => setActiveTool('vernier')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTool === 'vernier'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Vernier Caliper (Disc Diameter 2R)
          </button>
          <button
            onClick={() => setActiveTool('balance')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTool === 'balance'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Digital Analytical Balance (Disc Mass M)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-xs">
          {/* TOOL 1: SCREW GAUGE */}
          {activeTool === 'screwGauge' && (
            <div className="space-y-5">
              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>Micrometer Screw Gauge Reading</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                      LEAST COUNT: 0.01 mm
                    </span>
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    Observed Wire Diameter: <strong>{calculatedWireDiameter.toFixed(3)} mm</strong>
                  </div>
                </div>

                {/* SVG Visual Representation of Micrometer Barrel & Thimble */}
                <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-x-auto">
                  <svg width="560" height="150" viewBox="0 0 560 150" className="select-none">
                    {/* Fixed Sleeve / Barrel */}
                    <rect x="40" y="35" width="260" height="80" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
                    {/* Reference Line */}
                    <line x1="40" y1="75" x2="300" y2="75" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Millimeter graduations on sleeve */}
                    {[0, 1, 2, 3, 4, 5].map((mm) => {
                      const x = 50 + mm * 40;
                      return (
                        <g key={mm}>
                          {/* Upper 1mm line */}
                          <line x1={x} y1="50" x2={x} y2="75" stroke="#f8fafc" strokeWidth="1.8" />
                          <text x={x} y="44" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">
                            {mm}
                          </text>
                          {/* Lower 0.5mm line */}
                          {mm < 5 && (
                            <line x1={x + 20} y1="75" x2={x + 20} y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                          )}
                        </g>
                      );
                    })}

                    {/* Rotating Knurled Thimble (positioned according to wireDiameterMm) */}
                    <g transform={`translate(${50 + wireDiameterMm * 40}, 0)`}>
                      {/* Thimble Bevel */}
                      <polygon points="0,25 35,20 35,130 0,125" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Thimble Main Body */}
                      <rect x="35" y="20" width="160" height="110" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                      {/* Knurling Texture Lines */}
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <line key={i} x1={70 + i * 16} y1="20" x2={70 + i * 16} y2="130" stroke="#334155" strokeWidth="2" />
                      ))}

                      {/* Circular Scale Graduations on Bevel */}
                      {[-2, -1, 0, 1, 2].map((offset) => {
                        const div = (csrDivision + offset + 50) % 50;
                        const y = 75 - offset * 18;
                        return (
                          <g key={offset}>
                            <line x1="0" y1={y} x2="16" y2={y} stroke="#f8fafc" strokeWidth={offset === 0 ? "2.5" : "1.2"} />
                            <text x="24" y={y + 4} fill={offset === 0 ? "#38bdf8" : "#cbd5e1"} fontSize="11" fontFamily="monospace" fontWeight={offset === 0 ? "bold" : "normal"}>
                              {div}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                {/* Calculation breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">1. Main Scale Reading (MSR)</span>
                    <span className="text-sm font-bold text-slate-100">{msrMm.toFixed(1)} mm</span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">2. Circular Scale Div (CSR)</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {csrDivision} × 0.01 = {(csrDivision * 0.01).toFixed(2)} mm
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Total Diameter (2r)</span>
                    <span className="text-sm font-bold text-emerald-400">{calculatedWireDiameter.toFixed(3)} mm</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 leading-relaxed text-[11px]">
                  <strong>Practical Lab Tip:</strong> Always measure the wire diameter in two mutually perpendicular directions (X and Y) at three distinct heights along the wire (top, middle, bottom) and take the average to eliminate cross-sectional ellipticity and taper error.
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: VERNIER CALIPER */}
          {activeTool === 'vernier' && (
            <div className="space-y-5">
              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span>Vernier Caliper Measurement</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      LEAST COUNT: 0.1 mm (0.01 cm)
                    </span>
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    Flywheel Diameter: <strong>{discDiameterCm.toFixed(2)} cm</strong> (Radius: {(discRadiusMeters * 100).toFixed(1)} cm)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Main Scale Reading (MSR)</span>
                    <span className="text-sm font-bold text-slate-100">{msrVernierMm} mm ({(msrVernierMm / 10).toFixed(1)} cm)</span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Vernier Coincidence (VSR)</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {vernierCoincidence} × 0.1 = {(vernierCoincidence * 0.1).toFixed(1)} mm
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Total Diameter (2R)</span>
                    <span className="text-sm font-bold text-emerald-400">{(discDiameterMm / 10).toFixed(2)} cm</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                  <strong>Vernier Principle:</strong> 10 Vernier Scale Divisions (VSD) equal 9 Main Scale Divisions (MSD) of 1 mm each.
                  <br />
                  Least Count = 1 MSD - 1 VSD = 1 mm - 0.9 mm = <strong>0.1 mm = 0.01 cm</strong>.
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: DIGITAL BALANCE */}
          {activeTool === 'balance' && (
            <div className="space-y-5">
              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>Analytical Top-Pan Laboratory Balance</span>
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                    PRECISION: ±0.1 g
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center p-6 bg-slate-900 rounded-xl border border-slate-800 gap-6">
                  {/* Digital Balance Display Visual */}
                  <div className="w-64 bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-inner text-center font-mono">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">METTLER DIGITAL BALANCE</div>
                    <div className="text-3xl font-bold text-emerald-400">
                      {(discMassKg * 1000).toFixed(1)} <span className="text-sm text-emerald-500">g</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{discMassKg.toFixed(3)} kg</div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Tare zeroed prior to placing the suspension disc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Draft shield closed to prevent air convection currents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Calibrated against standard stainless steel mass weights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Virtual Metrology Bench · College Physics Laboratory</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Close Metrology
          </button>
        </div>
      </div>
    </div>
  );
};
