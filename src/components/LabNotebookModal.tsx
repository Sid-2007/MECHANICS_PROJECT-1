import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FileSpreadsheet,
  Calculator,
  HelpCircle,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  Disc,
} from 'lucide-react';
import { LabReading, calculateErrorPropagation, WIRE_MATERIALS, calculateSearleInertia } from '../physics/torsionalPendulum.ts';

interface LabNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: LabReading[];
  onAddReading: (reading: LabReading) => void;
  onDeleteReading: (id: string) => void;
  onClearReadings: () => void;
  currentParams: {
    wireMaterial: string;
    wireLength: number;
    wireRadius: number;
    discMass: number;
    discRadius: number;
    dampingConstant: number;
    period0: number;
  };
}

export const LabNotebookModal: React.FC<LabNotebookModalProps> = ({
  isOpen,
  onClose,
  readings,
  onAddReading,
  onDeleteReading,
  onClearReadings,
  currentParams,
}) => {
  const [activeTab, setActiveTab] = useState<'observations' | 'searles' | 'calculations' | 'theory' | 'procedure' | 'quiz'>('observations');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Searle's Method interactive calculator state
  const [searleM, setSearleM] = useState<number>(0.25);
  const [searleD1, setSearleD1] = useState<number>(0.04);
  const [searleD2, setSearleD2] = useState<number>(0.08);
  const [searleT0, setSearleT0] = useState<number>(currentParams.period0);
  const [searleT1, setSearleT1] = useState<number>(
    parseFloat((currentParams.period0 * 1.15).toFixed(3))
  );
  const [searleT2, setSearleT2] = useState<number>(
    parseFloat((currentParams.period0 * 1.45).toFixed(3))
  );

  if (!isOpen) return null;

  // Compute summary stats from readings
  const validReadings = readings.filter(r => r.experimentalPeriod > 0);
  const meanExpPeriod = validReadings.length > 0
    ? validReadings.reduce((sum, r) => sum + r.experimentalPeriod, 0) / validReadings.length
    : 0;

  const meanEta = validReadings.length > 0
    ? validReadings.reduce((sum, r) => sum + r.calculatedShearModulus, 0) / validReadings.length
    : 0;

  const theoreticalEta = WIRE_MATERIALS[currentParams.wireMaterial]?.shearModulus || 7.9e10;
  const overallEtaError = meanEta > 0 ? Math.abs((meanEta - theoreticalEta) / theoreticalEta) * 100 : 0;

  // Error propagation sample
  const errorAnalysis = calculateErrorPropagation({
    mass: currentParams.discMass,
    deltaMass: 0.001, // 1g balance precision
    discRadius: currentParams.discRadius,
    deltaDiscRadius: 0.0001, // 0.1 mm vernier caliper
    wireLength: currentParams.wireLength,
    deltaWireLength: 0.001, // 1 mm meter scale
    wireRadius: currentParams.wireRadius,
    deltaWireRadius: 0.00001, // 0.01 mm screw gauge
    period: currentParams.period0,
    deltaPeriod: 0.02, // 0.02s reaction time
  });

  // Export CSV
  const exportToCSV = () => {
    if (readings.length === 0) return;
    const headers = [
      'Trial',
      'Material',
      'Length (m)',
      'Wire Radius (mm)',
      'Disc Mass (kg)',
      'Disc Radius (cm)',
      'Oscillations (n)',
      'Total Time (s)',
      'T_exp (s)',
      'T_theo (s)',
      'Error (%)',
      'Calculated Eta (N/m^2)',
      'Theoretical Eta (N/m^2)',
      'Timestamp',
    ];

    const rows = readings.map(r => [
      r.trialNumber,
      r.wireMaterial,
      r.wireLength.toFixed(3),
      (r.wireRadius * 1000).toFixed(3),
      r.discMass.toFixed(2),
      (r.discRadius * 100).toFixed(2),
      r.oscillationsCounted,
      r.totalTime.toFixed(2),
      r.experimentalPeriod.toFixed(3),
      r.theoreticalPeriod.toFixed(3),
      r.percentageError.toFixed(2),
      r.calculatedShearModulus.toExponential(4),
      r.theoreticalShearModulus.toExponential(4),
      `"${r.timestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `torsional_pendulum_observations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preload standard sample lab data
  const handleLoadSampleData = () => {
    const samples: LabReading[] = [
      {
        id: 's1',
        trialNumber: 1,
        wireMaterial: 'steel',
        wireLength: 0.8,
        wireRadius: 0.0006,
        discMass: 1.5,
        discRadius: 0.1,
        auxiliaryMasses: false,
        auxiliaryDistance: 0,
        oscillationsCounted: 10,
        totalTime: 36.8,
        experimentalPeriod: 3.68,
        theoreticalPeriod: 3.66,
        percentageError: 0.55,
        calculatedShearModulus: 7.82e10,
        theoreticalShearModulus: 7.9e10,
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 's2',
        trialNumber: 2,
        wireMaterial: 'steel',
        wireLength: 0.8,
        wireRadius: 0.0006,
        discMass: 1.5,
        discRadius: 0.1,
        auxiliaryMasses: false,
        auxiliaryDistance: 0,
        oscillationsCounted: 20,
        totalTime: 73.4,
        experimentalPeriod: 3.67,
        theoreticalPeriod: 3.66,
        percentageError: 0.27,
        calculatedShearModulus: 7.86e10,
        theoreticalShearModulus: 7.9e10,
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 's3',
        trialNumber: 3,
        wireMaterial: 'steel',
        wireLength: 0.6,
        wireRadius: 0.0006,
        discMass: 1.5,
        discRadius: 0.1,
        auxiliaryMasses: false,
        auxiliaryDistance: 0,
        oscillationsCounted: 20,
        totalTime: 63.5,
        experimentalPeriod: 3.175,
        theoreticalPeriod: 3.169,
        percentageError: 0.19,
        calculatedShearModulus: 7.87e10,
        theoreticalShearModulus: 7.9e10,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];

    samples.forEach(s => onAddReading(s));
  };

  // Viva Voce practical lab quiz questions
  const quizQuestions = [
    {
      q: 'What is a torsional pendulum?',
      options: [
        'A heavy bob oscillating in a vertical plane under gravity.',
        'A body suspended by an elastic wire executing rotational oscillations about the wire axis.',
        'A compound pendulum oscillating about a knife edge.',
        'A system governed purely by gravitational restoring torque.',
      ],
      correct: 1,
      explanation: 'A torsional pendulum consists of an inertia body (like a circular disc) suspended by a thin elastic wire, which oscillates due to the elastic restoring torque of the twisted wire.',
    },
    {
      q: 'Why does the wire radius (r) contribute the largest source of experimental error in calculating rigidity modulus (η)?',
      options: [
        'Because the wire radius changes during oscillations.',
        'Because the wire radius enters the formula to the fourth power (r⁴), magnifying error fourfold.',
        'Because screw gauges are inherently inaccurate.',
        'Because temperature alters the radius instantaneously.',
      ],
      correct: 1,
      explanation: 'Since η ∝ 1/r⁴, fractional error propagation yields Δ(η)/η = 4 · (Δr/r). A mere 1% measurement error in wire radius causes a ~4% error in the calculated rigidity modulus.',
    },
    {
      q: 'What is the expression for the moment of inertia (I) of a uniform circular disc of mass M and radius R about an axis perpendicular to its face passing through its center?',
      options: [
        'I = M · R²',
        'I = (1/2) · M · R²',
        'I = (2/5) · M · R²',
        'I = (1/4) · M · R²',
      ],
      correct: 1,
      explanation: 'For a uniform flat circular disc rotated about its central perpendicular axis, I = (1/2) M R².',
    },
    {
      q: 'How does the theoretical period (T) depend on the suspension wire length (L)?',
      options: [
        'T is directly proportional to L (T ∝ L)',
        'T is directly proportional to the square root of L (T ∝ √L)',
        'T is inversely proportional to L (T ∝ 1/L)',
        'T is independent of L',
      ],
      correct: 1,
      explanation: 'Since torsional constant C ∝ 1/L and T = 2π√(I/C), T ∝ √(1/(1/L)) = √L. Thus, plotting T² versus L produces a straight line passing through the origin.',
    },
    {
      q: 'Why should the initial angular displacement (θ₀) be kept relatively small during lab trials?',
      options: [
        'To prevent the disc from catching fire from air friction.',
        'To ensure the wire is deformed within its elastic limit and avoid lateral swinging or helical sagging.',
        'Because Three.js cannot calculate large angles.',
        'To make the stopwatch easier to read.',
      ],
      correct: 1,
      explanation: 'Hooke\'s law for torsion (τ = -Cθ) holds strictly within the elastic limit of the wire material. Large twists cause permanent plastic deformation and induce lateral swinging.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Virtual Physics Laboratory Notebook
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono">
                  PHY-201 EXPERIMENT
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Determination of Rigidity Modulus (η) and Moment of Inertia via Torsional Oscillations
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'observations', label: 'Observations Table', icon: FileSpreadsheet, badge: readings.length },
            { id: 'searles', label: "Searle's Method (Inertia)", icon: Disc },
            { id: 'calculations', label: 'Calculations & Error', icon: Calculator },
            { id: 'theory', label: 'Theory & Derivations', icon: Layers },
            { id: 'procedure', label: 'Apparatus & Procedure', icon: Info },
            { id: 'quiz', label: 'Viva Voce Exam', icon: HelpCircle },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900 text-cyan-300 border border-cyan-700 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/40">

          {/* TAB 1: OBSERVATIONS TABLE */}
          {activeTab === 'observations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Experimental Records & Oscillations Log</h3>
                  <p className="text-xs text-slate-400">
                    Record time for 10 or 20 oscillations to calculate experimental period T and determine wire rigidity modulus η.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSampleData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    Load Benchmark Data
                  </button>
                  <button
                    onClick={exportToCSV}
                    disabled={readings.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold disabled:opacity-40 transition shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  {readings.length > 0 && (
                    <button
                      onClick={onClearReadings}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/30 text-rose-400 border border-slate-700 hover:border-rose-700 transition"
                      title="Clear all readings"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-inner">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Wire Material</th>
                      <th className="py-3 px-3">L (m)</th>
                      <th className="py-3 px-3">r (mm)</th>
                      <th className="py-3 px-3">M (kg)</th>
                      <th className="py-3 px-3">R (cm)</th>
                      <th className="py-3 px-3">Osc (n)</th>
                      <th className="py-3 px-3">Time t (s)</th>
                      <th className="py-3 px-3 text-cyan-400">T_exp (s)</th>
                      <th className="py-3 px-3">T_theo (s)</th>
                      <th className="py-3 px-3">Error %</th>
                      <th className="py-3 px-3 text-amber-400">Calc η (GPa)</th>
                      <th className="py-3 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {readings.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-12 text-center text-slate-500 font-sans">
                          No experimental trials recorded yet.
                          <br />
                          Run the simulation and click <span className="text-cyan-400 font-medium">"Record Trial to Lab Notebook"</span> in the lab dock or click "Load Benchmark Data" above.
                        </td>
                      </tr>
                    ) : (
                      readings.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{r.trialNumber}</td>
                          <td className="py-2.5 px-3 capitalize font-sans text-slate-200">
                            {WIRE_MATERIALS[r.wireMaterial]?.name || r.wireMaterial}
                          </td>
                          <td className="py-2.5 px-3">{r.wireLength.toFixed(2)}</td>
                          <td className="py-2.5 px-3">{(r.wireRadius * 1000).toFixed(3)}</td>
                          <td className="py-2.5 px-3">{r.discMass.toFixed(2)}</td>
                          <td className="py-2.5 px-3">{(r.discRadius * 100).toFixed(1)}</td>
                          <td className="py-2.5 px-3 font-semibold">{r.oscillationsCounted}</td>
                          <td className="py-2.5 px-3">{r.totalTime.toFixed(2)}</td>
                          <td className="py-2.5 px-3 font-bold text-cyan-400">{r.experimentalPeriod.toFixed(3)}</td>
                          <td className="py-2.5 px-3 text-slate-400">{r.theoreticalPeriod.toFixed(3)}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                r.percentageError < 1.0
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : r.percentageError < 3.0
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {r.percentageError.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-amber-400">
                            {(r.calculatedShearModulus / 1e9).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => onDeleteReading(r.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                              title="Delete trial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats Grid */}
              {validReadings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Mean Experimental Period
                    </span>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                      {meanExpPeriod.toFixed(3)} s
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Averaged across {validReadings.length} completed trial readings
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Calculated Rigidity Modulus (η)
                    </span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {(meanEta / 1e9).toFixed(2)} GPa
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Theoretical standard: {(theoreticalEta / 1e9).toFixed(2)} GPa
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Overall Percentage Error
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {overallEtaError.toFixed(2)}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Within acceptable scientific experimental limits (&lt; 5%)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SEARLE'S METHOD */}
          {activeTab === 'searles' && (
            <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                      <Disc className="w-4 h-4" />
                      <span>Searle's Method: Determination of Moment of Inertia (I<sub>0</sub>) Without Knowing Wire Modulus</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Classical university laboratory method using two identical auxiliary cylindrical masses placed at symmetrical radial distances d<sub>1</sub> and d<sub>2</sub>.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                    ADVANCED METROLOGY
                  </span>
                </div>
              </div>

              {/* Theory Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">1. Disc Alone</span>
                  <p className="text-[11px] text-slate-400">
                    With the disc alone oscillating:
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-center text-cyan-300">
                    T<sub>0</sub><sup>2</sup> = 4π<sup>2</sup>(I<sub>0</sub> / C)
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">2. Auxiliary Masses at d<sub>1</sub></span>
                  <p className="text-[11px] text-slate-400">
                    Two masses m placed at distance d<sub>1</sub> from the axis:
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-center text-amber-300">
                    T<sub>1</sub><sup>2</sup> = 4π<sup>2</sup>(I<sub>0</sub> + 2md<sub>1</sub><sup>2</sup> + 2I<sub>c</sub>) / C
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">3. Auxiliary Masses at d<sub>2</sub></span>
                  <p className="text-[11px] text-slate-400">
                    Shifted symmetrically outward to distance d<sub>2</sub>:
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-center text-emerald-300">
                    T<sub>2</sub><sup>2</sup> = 4π<sup>2</sup>(I<sub>0</sub> + 2md<sub>2</sub><sup>2</sup> + 2I<sub>c</sub>) / C
                  </div>
                </div>
              </div>

              {/* Elimination of unknowns */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">The Mathematical Beauty of Searle's Derivation</h4>
                <p>
                  Subtracting T<sub>1</sub><sup>2</sup> from T<sub>2</sub><sup>2</sup> eliminates the unknown moment of inertia of each cylinder about its own center (2I<sub>c</sub>):
                </p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center text-sm text-cyan-300">
                  T<sub>2</sub><sup>2</sup> - T<sub>1</sub><sup>2</sup> = [8π<sup>2</sup> · m · (d<sub>2</sub><sup>2</sup> - d<sub>1</sub><sup>2</sup>)] / C
                </div>
                <p>
                  Dividing T<sub>0</sub><sup>2</sup> by (T<sub>2</sub><sup>2</sup> - T<sub>1</sub><sup>2</sup>) completely eliminates the wire's torsional constant C:
                </p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-center text-sm text-amber-300">
                  I<sub>0</sub> = [2 · m · (d<sub>2</sub><sup>2</sup> - d<sub>1</sub><sup>2</sup>) · T<sub>0</sub><sup>2</sup>] / (T<sub>2</sub><sup>2</sup> - T<sub>1</sub><sup>2</sup>)
                </div>
                <p className="text-[11px] text-slate-400">
                  This proves that the moment of inertia of any body can be determined strictly by measuring time periods and distances, without knowing the wire's shear modulus (η) or radius (r)!
                </p>
              </div>

              {/* Interactive Calculator */}
              <div className="bg-slate-950/70 p-5 rounded-xl border border-cyan-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-400">Interactive Searle's Method Calculator</h4>
                  <button
                    onClick={() => {
                      setSearleT0(currentParams.period0);
                      const i0Real = 0.5 * currentParams.discMass * Math.pow(currentParams.discRadius, 2);
                      const t1Calc = currentParams.period0 * Math.sqrt(1 + (2 * searleM * (searleD1 * searleD1)) / i0Real);
                      const t2Calc = currentParams.period0 * Math.sqrt(1 + (2 * searleM * (searleD2 * searleD2)) / i0Real);
                      setSearleT1(parseFloat(t1Calc.toFixed(3)));
                      setSearleT2(parseFloat(t2Calc.toFixed(3)));
                    }}
                    className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 rounded-lg text-xs font-semibold transition"
                  >
                    Sync with Current Apparatus
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Mass of each Cylinder (m)</label>
                    <input
                      type="number"
                      step={0.01}
                      value={searleM}
                      onChange={(e) => setSearleM(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">kg (e.g. 0.25 kg)</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Position 1 Distance (d₁)</label>
                    <input
                      type="number"
                      step={0.005}
                      value={searleD1}
                      onChange={(e) => setSearleD1(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">m ({(searleD1 * 100).toFixed(1)} cm)</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Position 2 Distance (d₂)</label>
                    <input
                      type="number"
                      step={0.005}
                      value={searleD2}
                      onChange={(e) => setSearleD2(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">m ({(searleD2 * 100).toFixed(1)} cm)</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Period Disc Alone (T₀)</label>
                    <input
                      type="number"
                      step={0.01}
                      value={searleT0}
                      onChange={(e) => setSearleT0(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">seconds</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Period with Masses at d₁ (T₁)</label>
                    <input
                      type="number"
                      step={0.01}
                      value={searleT1}
                      onChange={(e) => setSearleT1(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">seconds</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <label className="text-[11px] text-slate-400 block">Period with Masses at d₂ (T₂)</label>
                    <input
                      type="number"
                      step={0.01}
                      value={searleT2}
                      onChange={(e) => setSearleT2(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 font-mono text-slate-200 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">seconds</span>
                  </div>
                </div>

                {/* Calculated Result Card */}
                {(() => {
                  const computedI0 = calculateSearleInertia(
                    searleM,
                    searleD1,
                    searleD2,
                    searleT0,
                    searleT1,
                    searleT2
                  );
                  const theoreticalDiscI0 = 0.5 * currentParams.discMass * Math.pow(currentParams.discRadius, 2);
                  const searleErrorPct = theoreticalDiscI0 > 0 ? Math.abs((computedI0 - theoreticalDiscI0) / theoreticalDiscI0) * 100 : 0;

                  return (
                    <div className="p-4 bg-slate-900 rounded-xl border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block">
                          Calculated Disc Moment of Inertia (I₀) via Searle's Formula
                        </span>
                        <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                          {computedI0 > 0 ? `${(computedI0 * 1e4).toFixed(3)} × 10⁻⁴ kg·m²` : 'Invalid T₂ > T₁ inputs'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Theoretical disc value (½MR²): <strong className="text-slate-200 font-mono">{(theoreticalDiscI0 * 1e4).toFixed(3)} × 10⁻⁴ kg·m²</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block">Percentage Error</span>
                        <span className={`text-base font-bold font-mono ${searleErrorPct < 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {searleErrorPct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATIONS & ERROR ANALYSIS */}
          {activeTab === 'calculations' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Mathematical Formulations & Working Steps
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">1. Moment of Inertia of Disc (I)</div>
                    <div className="text-slate-200">I = (1/2) · M · R<sup>2</sup></div>
                    <div className="text-slate-400 text-[11px]">
                      = 0.5 · {currentParams.discMass.toFixed(2)} kg · ({currentParams.discRadius.toFixed(2)} m)<sup>2</sup>
                    </div>
                    <div className="text-cyan-400 font-bold">
                      = {(0.5 * currentParams.discMass * Math.pow(currentParams.discRadius, 2)).toExponential(4)} kg·m<sup>2</sup>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">2. Torsional Constant (C)</div>
                    <div className="text-slate-200">C = (π · η · r<sup>4</sup>) / (2 · L)</div>
                    <div className="text-slate-400 text-[11px]">
                      = (π · {theoreticalEta.toExponential(2)} · ({(currentParams.wireRadius * 1000).toFixed(2)}×10<sup>-3</sup> m)<sup>4</sup>) / (2 · {currentParams.wireLength.toFixed(2)})
                    </div>
                    <div className="text-amber-400 font-bold">
                      = {((Math.PI * theoreticalEta * Math.pow(currentParams.wireRadius, 4)) / (2 * currentParams.wireLength)).toExponential(4)} N·m/rad
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">3. Theoretical Time Period (T)</div>
                    <div className="text-slate-200">T = 2π · √(I / C)</div>
                    <div className="text-slate-400 text-[11px]">
                      = 2 · 3.14159 · √({(0.5 * currentParams.discMass * Math.pow(currentParams.discRadius, 2)).toExponential(3)} / {((Math.PI * theoreticalEta * Math.pow(currentParams.wireRadius, 4)) / (2 * currentParams.wireLength)).toExponential(3)})
                    </div>
                    <div className="text-emerald-400 font-bold">
                      = {currentParams.period0.toFixed(3)} seconds
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">4. Determination of Rigidity Modulus (η)</div>
                    <div className="text-slate-200">η = (4π · M · R<sup>2</sup> · L) / (T<sup>2</sup> · r<sup>4</sup>)</div>
                    <div className="text-slate-400 text-[11px]">
                      Using experimentally measured period T to back-calculate η
                    </div>
                    <div className="text-cyan-400 font-bold">
                      = {(theoreticalEta / 1e9).toFixed(2)} GPa (nominal)
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Propagation Breakdown */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Error Propagation & Sensitivity Analysis
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Max Probable Error: ±{errorAnalysis.percentageError.toFixed(2)}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Taking logarithmic differentiation of <span className="font-mono text-cyan-300">η = (4π M R<sup>2</sup> L) / (T<sup>2</sup> r<sup>4</sup>)</span> gives the fractional uncertainty relation:
                </p>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 text-center">
                  (Δη / η) = (ΔM / M) + 2(ΔR / R) + (ΔL / L) + <span className="text-rose-400 font-bold">4(Δr / r)</span> + 2(ΔT / T)
                </div>

                {/* Contribution Bars */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-400">Relative Error Contributions by Parameter:</div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-rose-400 font-bold">Wire Radius r (Screw Gauge) [4× weight]</span>
                        <span className="text-slate-300">{errorAnalysis.contributions.wireRadius.toFixed(1)}% of total error</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${Math.min(errorAnalysis.contributions.wireRadius, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-cyan-400">Period Measurement T (Stopwatch) [2× weight]</span>
                        <span className="text-slate-300">{errorAnalysis.contributions.period.toFixed(1)}% of total error</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${Math.min(errorAnalysis.contributions.period, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-amber-400">Disc Radius R (Vernier Calipers) [2× weight]</span>
                        <span className="text-slate-300">{errorAnalysis.contributions.discRadius.toFixed(1)}% of total error</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.min(errorAnalysis.contributions.discRadius, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-emerald-400">Wire Length L (Meter Scale) [1× weight]</span>
                        <span className="text-slate-300">{errorAnalysis.contributions.wireLength.toFixed(1)}% of total error</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(errorAnalysis.contributions.wireLength, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 leading-relaxed">
                    <strong>Critical Laboratory Insight:</strong> Because the wire radius <span className="font-mono">r</span> enters to the 4th power in the denominator, any fractional error in measuring <span className="font-mono">r</span> is magnified by a factor of 4. Therefore, the radius of the suspension wire must be measured at multiple mutually perpendicular orientations along its length using a precision screw gauge with zero-error correction.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THEORY & DERIVATIONS */}
          {activeTab === 'theory' && (
            <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-400">Aim & Objectives</h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>To find the moment of inertia of a uniform circular disc about an axis passing through its center and perpendicular to its plane.</li>
                  <li>To determine the rigidity modulus (η) of the material of a given wire using a torsional pendulum.</li>
                  <li>To verify the relationship between time period squared (T²) and length of suspension wire (L).</li>
                  <li>To perform rigorous uncertainty and error propagation analysis on experimental observations.</li>
                </ul>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200">Theory of Torsional Oscillations</h3>
                <p>
                  When a heavy disc suspended by a thin wire is rotated in a horizontal plane through a small angle <span className="font-mono text-cyan-300">θ</span> and then released, the twisted wire exerts an elastic restoring torque <span className="font-mono text-cyan-300">τ</span> that opposes the rotation.
                </p>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-center text-sm text-cyan-300">
                  τ = -C · θ
                </div>
                <p>
                  where <span className="font-mono text-cyan-300">C</span> is the restoring couple per unit twist (torsional rigidity constant) of the wire of length <span className="font-mono">L</span>, radius <span className="font-mono">r</span>, and shear modulus <span className="font-mono">η</span>:
                </p>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-center text-sm text-amber-300">
                  C = (π · η · r⁴) / (2 · L)
                </div>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200">Differential Equation of Motion</h3>
                <p>
                  According to Newton\'s rotational second law, <span className="font-mono text-cyan-300">τ = I · α = I · (d²θ/dt²)</span>, where <span className="font-mono">I</span> is the moment of inertia of the suspended disc. Equating this to the elastic restoring torque:
                </p>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-center text-sm text-emerald-300">
                  I · (d²θ/dt²) + C · θ = 0  ⟹  (d²θ/dt²) + (C / I) · θ = 0
                </div>
                <p>
                  This is the standard equation of simple harmonic motion with natural angular frequency:
                </p>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-center text-sm text-slate-200">
                  ω₀ = √(C / I)
                </div>
                <p>
                  Hence, the periodic time <span className="font-mono">T</span> of oscillation is:
                </p>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-center text-sm text-cyan-400 font-bold">
                  T = 2π / ω₀ = 2π · √(I / C)
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPARATUS & PROCEDURE */}
          {activeTab === 'procedure' && (
            <div className="space-y-6 text-xs text-slate-300">
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-400">Apparatus Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-sans font-semibold text-slate-200">Torsional Pendulum Assembly</div>
                    <div className="text-slate-400 text-[11px] mt-1">Rigid vertical stand, heavy cast base, split-chuck collets</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-sans font-semibold text-slate-200">Suspension Wire</div>
                    <div className="text-slate-400 text-[11px] mt-1">Steel / Brass / Bronze wire, length 0.3 - 1.2 m, diameter ~1.2 mm</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-sans font-semibold text-slate-200">Screw Gauge (Micrometer)</div>
                    <div className="text-slate-400 text-[11px] mt-1">Pitch: 0.5 mm, Circular scale divisions: 50, Least Count: 0.01 mm</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-sans font-semibold text-slate-200">Vernier Calipers & Digital Balance</div>
                    <div className="text-slate-400 text-[11px] mt-1">Least Count: 0.01 cm, Precision balance: ±0.1 g</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Step-by-Step Laboratory Procedure</h3>
                <ol className="space-y-3 list-decimal list-inside text-slate-300">
                  <li className="leading-relaxed">
                    <strong>Wire Attachment:</strong> Secure one end of the wire tightly in the top rigid chuck and the lower end in the center chuck of the inertia disc. Ensure the wire is straight, vertical, and kink-free.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Length Measurement:</strong> Measure the active length of the suspension wire (from the bottom of the top chuck to the top of the disc chuck) using a millimeter meter scale.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Wire Radius Measurement:</strong> Using a screw gauge, determine the zero error. Measure the diameter of the wire at five different positions in mutually perpendicular directions. Compute the mean radius <span className="font-mono">r</span>.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Disc Parameters:</strong> Measure the mass <span className="font-mono">M</span> of the disc with a laboratory balance, and its diameter at various positions with vernier calipers to obtain radius <span className="font-mono">R</span>.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Set Oscillation:</strong> Gently rotate the disc in the horizontal plane by a small angle (e.g. 15° to 30°) and release it smoothly without imparting any lateral swinging or wobble.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Stopwatch Timing:</strong> As the reference mark on the disc passes the fixed pointer (equilibrium position), start the digital timer. Count 20 complete oscillations and record the total time <span className="font-mono">t</span>.
                  </li>
                  <li className="leading-relaxed">
                    <strong>Repeat & Graph:</strong> Repeat for at least 3 different wire lengths. Plot <span className="font-mono">T²</span> versus <span className="font-mono">L</span> to evaluate the slope and determine <span className="font-mono">η</span>.
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-sm font-semibold text-amber-400">Important Precautions</h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>The wire must be clamped securely in both chucks so there is zero slippage during oscillations.</li>
                  <li>The amplitude of oscillation must be small so the wire remains strictly within its elastic limit.</li>
                  <li>The disc must oscillate purely about its vertical axis without any pendular swinging motion.</li>
                  <li>Do not count the first 2-3 oscillations to let the system stabilize into pure torsional mode.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: VIVA VOCE EXAM */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Viva Voce Practical Examination</h3>
                  <p className="text-xs text-slate-400">Test your mastery of torsional oscillations, shear modulus, and experimental techniques.</p>
                </div>
                <button
                  onClick={() => setShowQuizResults(!showQuizResults)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
                >
                  {showQuizResults ? 'Hide Explanations' : 'Submit & Check Answers'}
                </button>
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => {
                  const selected = selectedQuizAnswers[qIdx];
                  const isAnswered = selected !== undefined;
                  const isCorrect = selected === q.correct;

                  return (
                    <div
                      key={qIdx}
                      className={`p-5 rounded-xl border transition ${
                        showQuizResults
                          ? isCorrect
                            ? 'bg-emerald-950/20 border-emerald-800/60'
                            : 'bg-rose-950/20 border-rose-800/60'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-cyan-400 font-mono">QUESTION {qIdx + 1}</span>
                        {showQuizResults && isAnswered && (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                              isCorrect ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                            }`}
                          >
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-slate-200 mt-2">{q.q}</h4>

                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          const isOptionCorrect = optIdx === q.correct;

                          let btnClasses = 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700';
                          if (isOptionSelected) {
                            btnClasses = 'border-cyan-500 bg-cyan-500/10 text-cyan-200';
                          }
                          if (showQuizResults) {
                            if (isOptionCorrect) {
                              btnClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              btnClasses = 'border-rose-500 bg-rose-500/20 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setSelectedQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                              }}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${btnClasses}`}
                            >
                              <span>{opt}</span>
                              {showQuizResults && isOptionCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizResults && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                          <strong className="text-cyan-400">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>Torsional Pendulum Simulation Platform · Engineering Physics Lab</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Close Notebook
          </button>
        </div>
      </div>
    </div>
  );
};
