import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Sliders,
  Activity,
  Camera,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Volume2,
  VolumeX,
  Gauge,
  Ruler,
  Scale,
  AlertTriangle,
  ShieldCheck,
  Disc,
  Hand,
  CheckCircle2,
} from 'lucide-react';
import {
  WIRE_MATERIALS,
  AuxiliaryMassParams,
  evaluateWireStress,
} from '../physics/torsionalPendulum.ts';

interface BottomControlDockProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStep: () => void;
  onRecordTrial: () => void;
  timer: number;
  currentAngleRad: number;
  currentOmega: number;
  currentAlpha: number;
  currentTorque: number;
  cycleCount: number;
  lastMeasuredPeriod: number;
  theoreticalPeriod: number;
  theoreticalFrequency: number;
  inertia: number;
  discInertia: number;
  auxiliaryInertia: number;
  torsionalConstant: number;
  wireLength: number;
  setWireLength: (val: number) => void;
  wireRadius: number;
  setWireRadius: (val: number) => void;
  wireMaterial: string;
  setWireMaterial: (val: string) => void;
  discMass: number;
  setDiscMass: (val: number) => void;
  discRadius: number;
  setDiscRadius: (val: number) => void;
  initialAngleDeg: number;
  setInitialAngleDeg: (val: number) => void;
  dampingFactor: number;
  setDampingFactor: (val: number) => void;
  cameraPreset: 'perspective' | 'front' | 'closeup' | 'top' | 'bench';
  setCameraPreset: (preset: 'perspective' | 'front' | 'closeup' | 'top' | 'bench') => void;
  showChart: boolean;
  setShowChart: (show: boolean) => void;
  showDegreeRing: boolean;
  setShowDegreeRing: (show: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  // Real-world practical physics additions
  auxiliaryMasses: AuxiliaryMassParams;
  setAuxiliaryMasses: React.Dispatch<React.SetStateAction<AuxiliaryMassParams>>;
  releaseMode: 'gate' | 'hand';
  setReleaseMode: (mode: 'gate' | 'hand') => void;
  onOpenInstrumentModal?: (tool: 'screwGauge' | 'vernier' | 'balance') => void;
  logarithmicDecrement: number;
  qualityFactor: number;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  isRunning,
  onTogglePlay,
  onReset,
  onStep,
  onRecordTrial,
  timer,
  currentAngleRad,
  currentOmega,
  currentAlpha,
  currentTorque,
  cycleCount,
  lastMeasuredPeriod,
  theoreticalPeriod,
  theoreticalFrequency,
  inertia,
  discInertia,
  auxiliaryInertia,
  torsionalConstant,
  wireLength,
  setWireLength,
  wireRadius,
  setWireRadius,
  wireMaterial,
  setWireMaterial,
  discMass,
  setDiscMass,
  discRadius,
  setDiscRadius,
  initialAngleDeg,
  setInitialAngleDeg,
  dampingFactor,
  setDampingFactor,
  cameraPreset,
  setCameraPreset,
  showChart,
  setShowChart,
  showDegreeRing,
  setShowDegreeRing,
  soundEnabled,
  setSoundEnabled,
  simSpeed,
  setSimSpeed,
  auxiliaryMasses,
  setAuxiliaryMasses,
  releaseMode,
  setReleaseMode,
  onOpenInstrumentModal,
  logarithmicDecrement,
  qualityFactor,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'parameters' | 'metrology' | 'view'>('telemetry');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const angleDeg = (currentAngleRad * 180) / Math.PI;

  const matData = WIRE_MATERIALS[wireMaterial] || {
    shearModulus: 7.9e10,
    yieldShearStrength: 250e6,
  };

  const stressInfo = evaluateWireStress(
    currentAngleRad,
    wireRadius,
    wireLength,
    matData.shearModulus,
    matData.yieldShearStrength
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[1040px] px-3 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center">
        {/* Collapse Toggle Drawer Handle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 border-b-0 rounded-t-lg text-[11px] font-semibold transition backdrop-blur-md shadow-lg"
          title="Toggle bottom control dock"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Show Controls & Telemetry</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls (Cinema Mode)</span>
            </>
          )}
        </button>

        {/* Main Dock Container */}
        {!isCollapsed && (
          <div className="w-full bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Tab Header Strip */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 overflow-x-auto gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'telemetry'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry & Stress</span>
                </button>

                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'parameters'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Apparatus & Masses</span>
                </button>

                <button
                  onClick={() => setActiveTab('metrology')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'metrology'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Metrology Tools</span>
                </button>

                <button
                  onClick={() => setActiveTab('view')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'view'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera & Environment</span>
                </button>
              </div>

              {/* Quick Actions (Sound & Chart Toggle) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowChart(!showChart)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
                    showChart
                      ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span className="hidden sm:inline">{showChart ? 'Waveform Active' : 'Waveform'}</span>
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
                  title={soundEnabled ? 'Mute acoustics' : 'Enable sound effects'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="p-3 sm:p-4">
              {/* TAB 1: TELEMETRY & CONTROLS */}
              {activeTab === 'telemetry' && (
                <div className="space-y-3.5">
                  {/* Primary Transport Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Play / Step / Reset Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onTogglePlay}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                          isRunning
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                            : 'bg-cyan-500 hover:cyan-400 text-slate-950 shadow-cyan-500/25'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Oscillate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={onStep}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-40 transition"
                        title="Step forward +0.05s"
                      >
                        <StepForward className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Step</span>
                      </button>

                      <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                        title="Reset to initial twist"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>

                      {/* Quick Twist Preset Angles */}
                      <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <span className="text-[10px] text-slate-500 px-1.5 font-mono uppercase">Twist:</span>
                        {[-30, 15, 30, 45].map((deg) => (
                          <button
                            key={deg}
                            onClick={() => setInitialAngleDeg(deg)}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                              Math.round(initialAngleDeg) === deg
                                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {deg > 0 ? `+${deg}°` : `${deg}°`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Record Trial Action */}
                    <button
                      onClick={onRecordTrial}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/20"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Record Reading</span>
                    </button>
                  </div>

                  {/* Telemetry Readouts Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {/* Timer */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-between">
                        <span>Timer</span>
                        <span className="text-cyan-400 font-mono">0.01s</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-slate-100 mt-0.5">
                        {timer.toFixed(2)}s
                      </div>
                    </div>

                    {/* Angular Displacement theta */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Displacement θ
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-0.5">
                        {angleDeg.toFixed(1)}°
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {currentAngleRad.toFixed(3)} rad
                      </div>
                    </div>

                    {/* Angular Velocity omega */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Velocity ω
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-amber-400 mt-0.5">
                        {currentOmega.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">rad/s</div>
                    </div>

                    {/* Restoring Torque tau */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Torque τ
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5">
                        {currentTorque.toFixed(3)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">N·m</div>
                    </div>

                    {/* Cycle Counter */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Cycles (n)
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-indigo-400 mt-0.5">
                        {cycleCount}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">oscillations</div>
                    </div>

                    {/* Measured Period */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        T (Measured)
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-purple-400 mt-0.5">
                        {lastMeasuredPeriod > 0 ? `${lastMeasuredPeriod.toFixed(3)}s` : '—'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">exp. photogate</div>
                    </div>

                    {/* Theoretical Period */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        T (Theoretical)
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-0.5">
                        {theoreticalPeriod.toFixed(3)}s
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        f = {theoreticalFrequency.toFixed(2)} Hz
                      </div>
                    </div>
                  </div>

                  {/* WIRE ELASTIC STRESS & DAMPING DYNAMICS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {/* Wire Stress & Yield Limit Meter */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          {stressInfo.isWithinElasticLimit ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          )}
                          <span>Wire Elastic Stress Limit (τ)</span>
                        </span>
                        <span
                          className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            stressInfo.stressPercentageOfYield > 100
                              ? 'bg-rose-950 text-rose-300 border border-rose-700'
                              : stressInfo.stressPercentageOfYield > 70
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          }`}
                        >
                          {stressInfo.stressPercentageOfYield.toFixed(1)}% of Yield
                        </span>
                      </div>

                      {/* Stress bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-1">
                        <div
                          className={`h-full transition-all duration-150 ${
                            stressInfo.stressPercentageOfYield > 100
                              ? 'bg-rose-500'
                              : stressInfo.stressPercentageOfYield > 70
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{
                            width: `${Math.min(stressInfo.stressPercentageOfYield, 100)}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>Max Shear: {(stressInfo.maxStressPa / 1e6).toFixed(1)} MPa</span>
                        <span>Yield: {(matData.yieldShearStrength / 1e6).toFixed(0)} MPa</span>
                        <span>Safe limit: ±{stressInfo.maxAllowableAngleDeg.toFixed(0)}°</span>
                      </div>
                    </div>

                    {/* Damping Metrics & Quality Factor */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-300 block text-[11px]">
                          Underdamped Decay Metrics
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 space-x-3">
                          <span>
                            Log Decrement (δ):{' '}
                            <strong className="text-cyan-300 font-mono">
                              {logarithmicDecrement > 0 ? logarithmicDecrement.toFixed(4) : '0.0000'}
                            </strong>
                          </span>
                          <span>
                            Quality Factor (Q):{' '}
                            <strong className="text-amber-300 font-mono">
                              {isFinite(qualityFactor) && qualityFactor > 0 ? qualityFactor.toFixed(1) : '∞'}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-mono block">Inertia Total</span>
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {(inertia * 1e4).toFixed(2)} × 10<sup>-4</sup> kg·m<sup>2</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPARATUS PARAMETERS & AUXILIARY MASSES */}
              {activeTab === 'parameters' && (
                <div className="space-y-3.5 text-xs">
                  {/* Primary Parameters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Wire Material Presets */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <label className="font-semibold text-slate-300 flex items-center justify-between">
                        <span>Wire Material & Rigidity (η)</span>
                        <span className="font-mono text-cyan-400 text-[11px]">
                          {(matData.shearModulus / 1e9).toFixed(1)} GPa
                        </span>
                      </label>
                      <select
                        value={wireMaterial}
                        onChange={(e) => setWireMaterial(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 font-mono outline-none"
                      >
                        {Object.entries(WIRE_MATERIALS).map(([key, mat]) => (
                          <option key={key} value={key}>
                            {mat.name} ({mat.shearModulus / 1e9} GPa, yield {mat.yieldShearStrength / 1e6} MPa)
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500">
                        {WIRE_MATERIALS[wireMaterial]?.description}
                      </p>
                    </div>

                    {/* Wire Length L */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>Wire Length (L)</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {wireLength.toFixed(2)} m ({(wireLength * 100).toFixed(0)} cm)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.3}
                        max={1.4}
                        step={0.05}
                        value={wireLength}
                        onChange={(e) => setWireLength(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0.30 m</span>
                        <span>T ∝ √L</span>
                        <span>1.40 m</span>
                      </div>
                    </div>

                    {/* Wire Radius r */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>Wire Radius (r)</span>
                        <span className="font-mono text-rose-400 font-bold">
                          {(wireRadius * 1000).toFixed(3)} mm (Ø {(wireRadius * 2000).toFixed(2)} mm)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.0003}
                        max={0.0012}
                        step={0.00005}
                        value={wireRadius}
                        onChange={(e) => setWireRadius(parseFloat(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0.30 mm</span>
                        <span className="text-rose-400">C ∝ r⁴ (Critical error sensitivity)</span>
                        <span>1.20 mm</span>
                      </div>
                    </div>

                    {/* Disc Mass M */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>Flywheel Disc Mass (M)</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {discMass.toFixed(2)} kg
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={4.0}
                        step={0.1}
                        value={discMass}
                        onChange={(e) => setDiscMass(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0.50 kg</span>
                        <span>I_disc = ½ M R²</span>
                        <span>4.00 kg</span>
                      </div>
                    </div>

                    {/* Disc Radius R */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>Disc Radius (R)</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {(discRadius * 100).toFixed(1)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.05}
                        max={0.20}
                        step={0.01}
                        value={discRadius}
                        onChange={(e) => setDiscRadius(parseFloat(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>5.0 cm</span>
                        <span>T ∝ R</span>
                        <span>20.0 cm</span>
                      </div>
                    </div>

                    {/* Damping / Air Resistance */}
                    <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between font-semibold text-slate-300">
                        <span>Air Resistance & Damping (b)</span>
                        <span className="font-mono text-indigo-400 font-bold">
                          {dampingFactor === 0 ? 'Frictionless' : dampingFactor.toExponential(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.0008}
                        step={0.00005}
                        value={dampingFactor}
                        onChange={(e) => setDampingFactor(parseFloat(e.target.value))}
                        className="w-full accent-indigo-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0.0 (Pure SHM)</span>
                        <span>Underdamped decay</span>
                        <span>High damping</span>
                      </div>
                    </div>
                  </div>

                  {/* SEARLE'S METHOD AUXILIARY MASSES & RELEASE MODE BOX */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                    {/* Searle's Auxiliary Masses */}
                    <div className="bg-slate-900/70 border border-cyan-900/40 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Disc className="w-4 h-4 text-cyan-400" />
                          <span>Searle's Symmetrical Auxiliary Masses</span>
                        </label>
                        <button
                          onClick={() =>
                            setAuxiliaryMasses((prev) => ({
                              ...prev,
                              enabled: !prev.enabled,
                            }))
                          }
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition ${
                            auxiliaryMasses.enabled
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {auxiliaryMasses.enabled ? 'Mounted' : 'Mount Cylinders'}
                        </button>
                      </div>

                      {auxiliaryMasses.enabled ? (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Radial Distance (d):</span>
                            <span className="font-mono font-bold text-cyan-300">
                              {(auxiliaryMasses.distanceFromAxis * 100).toFixed(1)} cm
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.03}
                            max={0.09}
                            step={0.005}
                            value={auxiliaryMasses.distanceFromAxis}
                            onChange={(e) =>
                              setAuxiliaryMasses((prev) => ({
                                ...prev,
                                distanceFromAxis: parseFloat(e.target.value),
                              }))
                            }
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>d = 3.0 cm</span>
                            <span className="text-cyan-400">
                              +{(auxiliaryInertia * 1e4).toFixed(2)} × 10<sup>-4</sup> kg·m<sup>2</sup>
                            </span>
                            <span>d = 9.0 cm</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Two brass weights (2 × {auxiliaryMasses.massEach * 1000}g) along machined radial slots for determining unknown disc moment of inertia.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          Mount two identical cylindrical weights along the radial grooves of the disc to perform Searle's classic practical experiment.
                        </p>
                      )}
                    </div>

                    {/* Release Dynamics Mode */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-2">
                      <span className="font-bold text-slate-200 block text-xs flex items-center gap-1.5">
                        <Hand className="w-4 h-4 text-amber-400" />
                        <span>Disc Release Mode (Real-world student technique)</span>
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setReleaseMode('gate')}
                          className={`p-2 rounded-lg border text-left transition ${
                            releaseMode === 'gate'
                              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-[11px]">Mechanical Gate</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Ideal pure torsion</div>
                        </button>

                        <button
                          onClick={() => setReleaseMode('hand')}
                          className={`p-2 rounded-lg border text-left transition ${
                            releaseMode === 'hand'
                              ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold text-[11px]">Manual Hand Release</div>
                          <div className="text-[10px] text-amber-300 mt-0.5">Coupled lateral wobble</div>
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-500">
                        {releaseMode === 'hand'
                          ? 'Simulates asymmetric finger friction during manual student release, causing coupled swinging wobble alongside pure torsion.'
                          : 'Ideal mechanical clamp release keeping the disc strictly in the horizontal plane without transverse pendulum wobble.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: METROLOGY BENCH TOOLS */}
              {activeTab === 'metrology' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">
                        Laboratory Metrology Instruments
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Inspect calibrated measurements corresponding to your current apparatus setup
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Screw Gauge */}
                    <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                          <Ruler className="w-4 h-4" />
                          <span>Micrometer Screw Gauge</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          Measures wire diameter. Least Count: <strong>0.01 mm</strong> (Pitch 0.5 mm, 50 circular divisions).
                        </p>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] space-y-0.5">
                          <div className="text-slate-400">Target Wire Diameter:</div>
                          <div className="text-cyan-300 font-bold text-sm">
                            {(wireRadius * 2000).toFixed(2)} mm
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenInstrumentModal?.('screwGauge')}
                        className="mt-3 w-full py-1.5 px-3 rounded-lg bg-cyan-600/30 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/50 font-semibold text-xs transition"
                      >
                        Inspect Screw Gauge
                      </button>
                    </div>

                    {/* Vernier Caliper */}
                    <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3.5 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                          <Gauge className="w-4 h-4" />
                          <span>Vernier Caliper</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          Measures flywheel disc diameter. Least Count: <strong>0.1 mm (0.01 cm)</strong>.
                        </p>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] space-y-0.5">
                          <div className="text-slate-400">Target Disc Diameter:</div>
                          <div className="text-emerald-300 font-bold text-sm">
                            {(discRadius * 200).toFixed(1)} cm ({(discRadius * 2000).toFixed(0)} mm)
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenInstrumentModal?.('vernier')}
                        className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-600/30 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/50 font-semibold text-xs transition"
                      >
                        Inspect Vernier Caliper
                      </button>
                    </div>

                    {/* Analytical Balance */}
                    <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                          <Scale className="w-4 h-4" />
                          <span>Digital Analytical Balance</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          Precision electronic balance for disc and auxiliary masses. Precision: <strong>0.1 g</strong>.
                        </p>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] space-y-0.5">
                          <div className="text-slate-400">Total Measured Mass:</div>
                          <div className="text-amber-300 font-bold text-sm">
                            {(discMass + (auxiliaryMasses.enabled ? auxiliaryMasses.massEach * 2 : 0)).toFixed(3)} kg
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenInstrumentModal?.('balance')}
                        className="mt-3 w-full py-1.5 px-3 rounded-lg bg-amber-600/30 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/50 font-semibold text-xs transition"
                      >
                        Inspect Digital Balance
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CAMERA & ENVIRONMENT */}
              {activeTab === 'view' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Camera Presets */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300 block">Camera View Presets</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'perspective', label: 'Isometric Lab' },
                        { id: 'front', label: 'Front Elevation' },
                        { id: 'closeup', label: 'Disc Close-up' },
                        { id: 'top', label: 'Top-Down Aerial' },
                        { id: 'bench', label: 'Workbench Metrology' },
                      ].map((view) => (
                        <button
                          key={view.id}
                          onClick={() => setCameraPreset(view.id as typeof cameraPreset)}
                          className={`p-2 rounded-lg text-[11px] font-medium border text-center transition ${
                            cameraPreset === view.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          } ${view.id === 'bench' ? 'col-span-2' : ''}`}
                        >
                          {view.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Reference Toggles */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300 block">Scientific Visual Overlays</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={showDegreeRing}
                          onChange={(e) => setShowDegreeRing(e.target.checked)}
                          className="rounded accent-cyan-400"
                        />
                        <span>Fixed Acrylic Protractor Ring (0° - 360°)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={showChart}
                          onChange={(e) => setShowChart(e.target.checked)}
                          className="rounded accent-cyan-400"
                        />
                        <span>Real-time Waveform Oscilloscope</span>
                      </label>
                    </div>
                  </div>

                  {/* Simulation Playback Speed */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-300 block">Simulation Pace / Time Scale</span>
                    <div className="flex gap-2">
                      {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setSimSpeed(speed)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition ${
                            simSpeed === speed
                              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Pacing independently calculated by RK4 numerical integrator.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
