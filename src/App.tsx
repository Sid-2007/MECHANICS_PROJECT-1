import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EducationalLandingPage } from './components/EducationalLandingPage.tsx';
import { TorsionalScene } from './components/TorsionalScene.tsx';
import { OscillationChart, DataPoint } from './components/OscillationChart.tsx';
import { BottomControlDock } from './components/BottomControlDock.tsx';
import { TopHeader } from './components/TopHeader.tsx';
import { LabNotebookModal } from './components/LabNotebookModal.tsx';
import { FormulaDerivationDrawer } from './components/FormulaDerivationDrawer.tsx';
import { LabGuideModal } from './components/LabGuideModal.tsx';
import { InstrumentInspectionModal } from './components/InstrumentInspectionModal.tsx';
import {
  calculateTheoreticalPeriod,
  calculateDampedCharacteristics,
  calculateShearModulusFromPeriod,
  stepRK4,
  WIRE_MATERIALS,
  LabReading,
  AuxiliaryMassParams,
} from './physics/torsionalPendulum.ts';
import { playZeroCrossSound, playRecordChime } from './utils/audioSynth.ts';

export default function App() {
  // ----------------------------------------------------
  // NAVIGATION ROUTING & THEORY GATE
  // ----------------------------------------------------
  const [currentView, setCurrentView] = useState<'theory' | 'simulation'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#simulation') {
      return 'simulation';
    }
    return 'theory';
  });
  const [hasReviewedTheory, setHasReviewedTheory] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#simulation') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#simulation') {
        setCurrentView('simulation');
      } else {
        setCurrentView('theory');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateTo = (view: 'theory' | 'simulation') => {
    setCurrentView(view);
    if (view === 'simulation') {
      window.location.hash = '#simulation';
    } else {
      window.location.hash = '#theory';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ----------------------------------------------------
  // EXPERIMENT PARAMETERS
  // ----------------------------------------------------
  const [wireMaterial, setWireMaterial] = useState<string>('steel');
  const [wireLength, setWireLength] = useState<number>(0.8); // meters
  const [wireRadius, setWireRadius] = useState<number>(0.0006); // meters (0.6 mm)
  const [discMass, setDiscMass] = useState<number>(1.5); // kg
  const [discRadius, setDiscRadius] = useState<number>(0.1); // meters (10 cm)
  const [initialAngleDeg, setInitialAngleDeg] = useState<number>(30); // degrees
  const [dampingFactor, setDampingFactor] = useState<number>(0.00015); // N*m*s/rad

  // Searle's auxiliary masses state
  const [auxiliaryMasses, setAuxiliaryMasses] = useState<AuxiliaryMassParams>({
    enabled: false,
    massEach: 0.25, // 250 g each
    cylinderRadius: 0.015, // 1.5 cm radius
    distanceFromAxis: 0.06, // 6.0 cm from axis
  });

  // Release dynamics mode ('gate' for ideal pure torsion, 'hand' for student wobble)
  const [releaseMode, setReleaseMode] = useState<'gate' | 'hand'>('gate');

  // Metrology instrument inspection modal
  const [activeInstrument, setActiveInstrument] = useState<'screwGauge' | 'vernier' | 'balance' | null>(null);

  // ----------------------------------------------------
  // DERIVED THEORETICAL VALUES
  // ----------------------------------------------------
  const shearModulus = WIRE_MATERIALS[wireMaterial]?.shearModulus || 7.9e10;
  const theoretical = calculateTheoreticalPeriod(
    discMass,
    discRadius,
    wireLength,
    wireRadius,
    shearModulus,
    auxiliaryMasses
  );
  const dampedProps = calculateDampedCharacteristics(
    theoretical.torsionalConstant,
    theoretical.inertia,
    dampingFactor
  );

  // Dynamic hand-release wobble intensity (decays when running)
  const wobbleIntensity = releaseMode === 'hand' ? 0.035 : 0;

  // ----------------------------------------------------
  // SIMULATION STATE
  // ----------------------------------------------------
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>((30 * Math.PI) / 180);
  const [currentOmega, setCurrentOmega] = useState<number>(0);
  const [currentAlpha, setCurrentAlpha] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [lastMeasuredPeriod, setLastMeasuredPeriod] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);

  // Graph data buffer
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  // Lab Notebook Readings
  const [readings, setReadings] = useState<LabReading[]>([]);

  // UI Modals & Views
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isDerivationsOpen, setIsDerivationsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const [showDegreeRing, setShowDegreeRing] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'closeup' | 'top' | 'bench'>('perspective');

  // Physics loop mutable refs to prevent stale closures and React re-renders in rAF
  const stateRef = useRef({
    isRunning,
    isDragging,
    angle: (initialAngleDeg * Math.PI) / 180,
    omega: 0,
    timer: 0,
    cycleCount: 0,
    zeroCrossCount: 0,
    lastMeasuredPeriod: 0,
    lastZeroCrossTime: 0,
    hasPassedZeroOnce: false,
    prevAngle: (initialAngleDeg * Math.PI) / 180,
    simSpeed,
    C: theoretical.torsionalConstant,
    I: theoretical.inertia,
    b: dampingFactor,
    soundEnabled,
  });

  // Keep stateRef in sync with parameter changes
  useEffect(() => {
    stateRef.current.C = theoretical.torsionalConstant;
    stateRef.current.I = theoretical.inertia;
    stateRef.current.b = dampingFactor;
    stateRef.current.simSpeed = simSpeed;
    stateRef.current.soundEnabled = soundEnabled;
    stateRef.current.isRunning = isRunning;
    stateRef.current.isDragging = isDragging;
  }, [
    theoretical.torsionalConstant,
    theoretical.inertia,
    dampingFactor,
    simSpeed,
    soundEnabled,
    isRunning,
    isDragging,
  ]);

  // Handle Initial Angle changes from controls when not running
  useEffect(() => {
    if (!isRunning && !isDragging) {
      const rad = (initialAngleDeg * Math.PI) / 180;
      stateRef.current.angle = rad;
      stateRef.current.omega = 0;
      setCurrentAngle(rad);
      setCurrentOmega(0);
      setCurrentAlpha(-(stateRef.current.C * rad) / stateRef.current.I);
    }
  }, [initialAngleDeg, isRunning, isDragging]);

  // ----------------------------------------------------
  // NUMERICAL INTEGRATION LOOP (RK4 with fixed sub-stepping)
  // ----------------------------------------------------
  useEffect(() => {
    let animId = 0;
    let lastTimestamp = performance.now();
    let chartThrottle = 0;

    const loop = (timestamp: number) => {
      const deltaSec = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (stateRef.current.isRunning && !stateRef.current.isDragging) {
        const speed = stateRef.current.simSpeed;
        const totalDt = deltaSec * speed;

        // Sub-step fixed RK4 (120 Hz internal physics accuracy)
        const subSteps = 6;
        const dtSub = totalDt / subSteps;

        let a = stateRef.current.angle;
        let w = stateRef.current.omega;
        let lastAlpha = 0;

        for (let i = 0; i < subSteps; i++) {
          const res = stepRK4(
            a,
            w,
            dtSub,
            stateRef.current.C,
            stateRef.current.I,
            stateRef.current.b
          );
          a = res.theta;
          w = res.omega;
          lastAlpha = res.alpha;

          // Zero-crossing cycle detection
          const prev = stateRef.current.prevAngle;
          if ((prev < 0 && a >= 0) || (prev > 0 && a <= 0)) {
            // Linear interpolation to find precise sub-step zero crossing time
            const fraction = Math.abs(prev) / (Math.abs(prev) + Math.abs(a) + 1e-9);
            const exactZeroTime = stateRef.current.timer + fraction * dtSub;

            if (stateRef.current.soundEnabled) {
              playZeroCrossSound(0.12);
            }

            stateRef.current.zeroCrossCount += 1;

            if (stateRef.current.hasPassedZeroOnce) {
              const halfPeriod = exactZeroTime - stateRef.current.lastZeroCrossTime;
              const fullPeriod = halfPeriod * 2;
              stateRef.current.lastMeasuredPeriod = fullPeriod;
              setLastMeasuredPeriod(fullPeriod);
            }

            stateRef.current.lastZeroCrossTime = exactZeroTime;
            stateRef.current.hasPassedZeroOnce = true;

            // 1 full cycle is completed every 2 zero crossings
            const completedCycles = Math.floor(stateRef.current.zeroCrossCount / 2);
            if (completedCycles !== stateRef.current.cycleCount) {
              stateRef.current.cycleCount = completedCycles;
              setCycleCount(completedCycles);
            }
          }
          stateRef.current.prevAngle = a;
        }

        stateRef.current.angle = a;
        stateRef.current.omega = w;
        stateRef.current.timer += totalDt;

        // Sync to React state throttled (~30Hz React state update, 60Hz canvas)
        setCurrentAngle(a);
        setCurrentOmega(w);
        setCurrentAlpha(lastAlpha);
        setTimer(stateRef.current.timer);

        // Chart buffer recording
        chartThrottle += deltaSec;
        if (chartThrottle >= 0.04) {
          chartThrottle = 0;
          const potEnergy = 0.5 * stateRef.current.C * a * a;
          const kinEnergy = 0.5 * stateRef.current.I * w * w;
          const totEnergy = potEnergy + kinEnergy;

          setChartData((prev) => {
            const next = [
              ...prev,
              {
                time: stateRef.current.timer,
                theta: a,
                omega: w,
                potentialEnergy: potEnergy,
                kineticEnergy: kinEnergy,
                totalEnergy: totEnergy,
              },
            ];
            // Keep up to 1000 points
            return next.length > 1000 ? next.slice(next.length - 1000) : next;
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // ----------------------------------------------------
  // TRANSPORT ACTIONS
  // ----------------------------------------------------
  const handleTogglePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsDragging(false);
    const rad = (initialAngleDeg * Math.PI) / 180;
    stateRef.current.angle = rad;
    stateRef.current.omega = 0;
    stateRef.current.timer = 0;
    stateRef.current.cycleCount = 0;
    stateRef.current.zeroCrossCount = 0;
    stateRef.current.lastMeasuredPeriod = 0;
    stateRef.current.hasPassedZeroOnce = false;
    stateRef.current.lastZeroCrossTime = 0;
    stateRef.current.prevAngle = rad;

    setCurrentAngle(rad);
    setCurrentOmega(0);
    setCurrentAlpha(-(stateRef.current.C * rad) / stateRef.current.I);
    setTimer(0);
    setCycleCount(0);
    setLastMeasuredPeriod(0);
    setChartData([]);
  }, [initialAngleDeg]);

  const handleStep = useCallback(() => {
    if (isRunning) return;
    const dt = 0.05 * simSpeed;
    const res = stepRK4(
      stateRef.current.angle,
      stateRef.current.omega,
      dt,
      stateRef.current.C,
      stateRef.current.I,
      stateRef.current.b
    );
    stateRef.current.angle = res.theta;
    stateRef.current.omega = res.omega;
    stateRef.current.timer += dt;

    setCurrentAngle(res.theta);
    setCurrentOmega(res.omega);
    setCurrentAlpha(res.alpha);
    setTimer(stateRef.current.timer);

    const potEnergy = 0.5 * stateRef.current.C * res.theta * res.theta;
    const kinEnergy = 0.5 * stateRef.current.I * res.omega * res.omega;
    setChartData((prev) => [
      ...prev,
      {
        time: stateRef.current.timer,
        theta: res.theta,
        omega: res.omega,
        potentialEnergy: potEnergy,
        kineticEnergy: kinEnergy,
        totalEnergy: potEnergy + kinEnergy,
      },
    ]);
  }, [isRunning, simSpeed]);

  // ----------------------------------------------------
  // INTERACTIVE 3D DISC DRAGGING
  // ----------------------------------------------------
  const handleDiscDragStart = useCallback(() => {
    setIsDragging(true);
    setIsRunning(false);
  }, []);

  const handleDiscDragChange = useCallback((newAngleRad: number) => {
    stateRef.current.angle = newAngleRad;
    stateRef.current.omega = 0;
    setCurrentAngle(newAngleRad);
    setCurrentOmega(0);
    setInitialAngleDeg((newAngleRad * 180) / Math.PI);
  }, []);

  const handleDiscDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ----------------------------------------------------
  // LAB NOTEBOOK TRIAL RECORDING
  // ----------------------------------------------------
  const handleRecordTrial = useCallback(() => {
    const countedOscillations = cycleCount > 0 ? cycleCount : 10;
    const expPeriod = lastMeasuredPeriod > 0
      ? lastMeasuredPeriod
      : (cycleCount > 0 && timer > 0 ? timer / cycleCount : theoretical.period0);
    const totalRecordedTime = timer > 0 && cycleCount > 0
      ? timer
      : expPeriod * countedOscillations;
    const theoPeriod = theoretical.period0;
    const pctErr = Math.abs((expPeriod - theoPeriod) / theoPeriod) * 100;
    const calcEta = calculateShearModulusFromPeriod(
      expPeriod,
      discMass,
      discRadius,
      wireLength,
      wireRadius,
      auxiliaryMasses.enabled ? theoretical.auxiliaryInertia : 0
    );

    const newReading: LabReading = {
      id: `trial_${Date.now()}`,
      trialNumber: readings.length + 1,
      wireMaterial,
      wireLength,
      wireRadius,
      discMass,
      discRadius,
      auxiliaryMasses: auxiliaryMasses.enabled,
      auxiliaryDistance: auxiliaryMasses.enabled ? auxiliaryMasses.distanceFromAxis * 100 : 0,
      oscillationsCounted: countedOscillations,
      totalTime: totalRecordedTime,
      experimentalPeriod: expPeriod,
      theoreticalPeriod: theoPeriod,
      percentageError: pctErr,
      calculatedShearModulus: calcEta,
      theoreticalShearModulus: shearModulus,
      timestamp: new Date().toLocaleTimeString(),
    };

    setReadings((prev) => [...prev, newReading]);
    if (soundEnabled) {
      playRecordChime(0.25);
    }
  }, [
    lastMeasuredPeriod,
    cycleCount,
    timer,
    theoretical.period0,
    theoretical.auxiliaryInertia,
    auxiliaryMasses,
    discMass,
    discRadius,
    wireLength,
    wireRadius,
    readings.length,
    wireMaterial,
    shearModulus,
    soundEnabled,
  ]);

  const handleDeleteReading = useCallback((id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleClearReadings = useCallback(() => {
    setReadings([]);
  }, []);

  const handleAddReading = useCallback((r: LabReading) => {
    setReadings((prev) => [...prev, r]);
  }, []);

  // Current restoring torque & acceleration
  const currentTorque = -theoretical.torsionalConstant * currentAngle;
  const currentAlphaVal = isRunning
    ? currentAlpha
    : theoretical.inertia > 0
    ? currentTorque / theoretical.inertia
    : 0;

  // Render Educational Landing Page if currentView === 'theory'
  if (currentView === 'theory') {
    return (
      <EducationalLandingPage
        onLaunchSimulation={() => navigateTo('simulation')}
        hasReviewedTheory={hasReviewedTheory}
        setHasReviewedTheory={setHasReviewedTheory}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. TOP SCIENTIFIC HEADER */}
      <TopHeader
        isRunning={isRunning}
        isDragging={isDragging}
        wireMaterial={wireMaterial}
        wireLength={wireLength}
        wireRadius={wireRadius}
        discMass={discMass}
        discRadius={discRadius}
        theoreticalPeriod={theoretical.period0}
        readingsCount={readings.length}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenDerivations={() => setIsDerivationsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onReset={handleReset}
        onReturnToTheory={() => navigateTo('theory')}
      />

      {/* 2. 3D WEBGL VIEWPORT (Unobstructed Center) */}
      <div className="absolute inset-0 z-0">
        <TorsionalScene
          currentAngle={currentAngle}
          wireLength={wireLength}
          wireRadius={wireRadius}
          discMass={discMass}
          discRadius={discRadius}
          wireColorHex={WIRE_MATERIALS[wireMaterial]?.colorHex || '#94a3b8'}
          isDraggingDisc={isDragging}
          onDiscDragStart={handleDiscDragStart}
          onDiscDragChange={handleDiscDragChange}
          onDiscDragEnd={handleDiscDragEnd}
          cameraPreset={cameraPreset}
          showDegreeRing={showDegreeRing}
          soundEnabled={soundEnabled}
          auxiliaryMasses={auxiliaryMasses}
          releaseMode={releaseMode}
          wobbleIntensity={wobbleIntensity}
          onOpenInstrumentModal={(tool) => setActiveInstrument(tool)}
        />
      </div>

      {/* 3. REAL-TIME OSCILLOSCOPE WAVEFORM */}
      {showChart && (
        <>
          {/* Desktop Pinned Card */}
          <div className="hidden md:block fixed top-20 right-4 z-20 w-96 h-56 transition-all duration-300">
            <OscillationChart
              data={chartData}
              initialAngle={(initialAngleDeg * Math.PI) / 180}
              theoreticalPeriod={theoretical.period0}
              gamma={dampedProps.gamma}
              onClear={() => setChartData([])}
              isPaused={!isRunning}
              onTogglePause={handleTogglePlay}
            />
          </div>

          {/* Mobile Overlay Card */}
          <div className="md:hidden fixed inset-x-3 top-20 z-30 h-64 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl p-1">
            <OscillationChart
              data={chartData}
              initialAngle={(initialAngleDeg * Math.PI) / 180}
              theoreticalPeriod={theoretical.period0}
              gamma={dampedProps.gamma}
              onClear={() => setChartData([])}
              isPaused={!isRunning}
              onTogglePause={handleTogglePlay}
            />
          </div>
        </>
      )}

      {/* 4. COLLAPSIBLE BOTTOM DOCK (Unified Ergonomic Controls) */}
      <BottomControlDock
        isRunning={isRunning}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onStep={handleStep}
        onRecordTrial={handleRecordTrial}
        timer={timer}
        currentAngleRad={currentAngle}
        currentOmega={currentOmega}
        currentAlpha={currentAlphaVal}
        currentTorque={currentTorque}
        cycleCount={cycleCount}
        lastMeasuredPeriod={lastMeasuredPeriod}
        theoreticalPeriod={theoretical.period0}
        theoreticalFrequency={theoretical.frequency0}
        inertia={theoretical.inertia}
        discInertia={theoretical.discInertia}
        auxiliaryInertia={theoretical.auxiliaryInertia}
        torsionalConstant={theoretical.torsionalConstant}
        wireLength={wireLength}
        setWireLength={setWireLength}
        wireRadius={wireRadius}
        setWireRadius={setWireRadius}
        wireMaterial={wireMaterial}
        setWireMaterial={setWireMaterial}
        discMass={discMass}
        setDiscMass={setDiscMass}
        discRadius={discRadius}
        setDiscRadius={setDiscRadius}
        initialAngleDeg={initialAngleDeg}
        setInitialAngleDeg={setInitialAngleDeg}
        dampingFactor={dampingFactor}
        setDampingFactor={setDampingFactor}
        cameraPreset={cameraPreset}
        setCameraPreset={setCameraPreset}
        showChart={showChart}
        setShowChart={setShowChart}
        showDegreeRing={showDegreeRing}
        setShowDegreeRing={setShowDegreeRing}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        auxiliaryMasses={auxiliaryMasses}
        setAuxiliaryMasses={setAuxiliaryMasses}
        releaseMode={releaseMode}
        setReleaseMode={setReleaseMode}
        onOpenInstrumentModal={(tool) => setActiveInstrument(tool)}
        logarithmicDecrement={dampedProps.logarithmicDecrement}
        qualityFactor={dampedProps.qualityFactor}
      />

      {/* 5. VIRTUAL LAB NOTEBOOK MODAL */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        readings={readings}
        onAddReading={handleAddReading}
        onDeleteReading={handleDeleteReading}
        onClearReadings={handleClearReadings}
        currentParams={{
          wireMaterial,
          wireLength,
          wireRadius,
          discMass,
          discRadius,
          dampingConstant: dampingFactor,
          period0: theoretical.period0,
        }}
      />

      {/* 6. FORMULAS & DERIVATIONS DRAWER */}
      <FormulaDerivationDrawer
        isOpen={isDerivationsOpen}
        onClose={() => setIsDerivationsOpen(false)}
        wireMaterial={wireMaterial}
        wireLength={wireLength}
        wireRadius={wireRadius}
        discMass={discMass}
        discRadius={discRadius}
        inertia={theoretical.inertia}
        torsionalConstant={theoretical.torsionalConstant}
        theoreticalPeriod={theoretical.period0}
      />

      {/* 7. QUICK LAB ONBOARDING GUIDE MODAL */}
      <LabGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 8. LABORATORY METROLOGY INSPECTION BENCH MODAL */}
      <InstrumentInspectionModal
        isOpen={activeInstrument !== null}
        initialTool={activeInstrument || 'screwGauge'}
        onClose={() => setActiveInstrument(null)}
        wireRadiusMeters={wireRadius}
        discRadiusMeters={discRadius}
        discMassKg={discMass}
      />
    </div>
  );
}
