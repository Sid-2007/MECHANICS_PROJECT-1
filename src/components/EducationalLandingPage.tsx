import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Scale,
  Activity,
  AlertTriangle,
  Lightbulb,
  Radio,
  ExternalLink,
  ChevronDown,
  Search,
  Atom,
  RotateCw,
  Cpu,
  GraduationCap,
  Sparkles,
  FileText,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FadeIn, AnimatedCounter } from './MotionHelpers.tsx';
import { IIITDMLogo } from './IIITDMLogo.tsx';

interface EducationalLandingPageProps {
  onLaunchSimulation: () => void;
  hasReviewedTheory: boolean;
  setHasReviewedTheory: (reviewed: boolean) => void;
}

// Precision Mechanics Project Emblem SVG Component
export const MechanicsLabLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 46,
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Academic Precision Ring */}
    <circle cx="50" cy="50" r="46" fill="#070d1e" stroke="#1e293b" strokeWidth="2" />
    <circle cx="50" cy="50" r="41" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

    {/* Central Torsion Wire Axis */}
    <line x1="50" y1="14" x2="50" y2="72" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="18" r="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />

    {/* Flywheel Inertia Disc (Perspective Ellipse) */}
    <ellipse cx="50" cy="68" rx="28" ry="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
    <ellipse cx="50" cy="71" rx="28" ry="9" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />

    {/* Restoring Torque Curvature Arrows */}
    <path
      d="M 28 64 C 34 56, 66 56, 72 64"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="74,62 72,66 68,63" fill="#f59e0b" />

    {/* Center Pivot Indicator */}
    <circle cx="50" cy="68" r="2.5" fill="#f59e0b" />
  </svg>
);

export const EducationalLandingPage: React.FC<EducationalLandingPageProps> = ({
  onLaunchSimulation,
  hasReviewedTheory,
  setHasReviewedTheory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll tracking with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="myjio-landing min-h-screen soothing-deep-bg text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200 relative overflow-x-hidden">
      {/* ---------------------------------------------------- */}
      {/* PERSISTENT TACTILE TEXTURES & AMBIENT ILLUMINATION   */}
      {/* ---------------------------------------------------- */}
      {/* Subtle Precision Engineering Drafting Grid */}
      <div className="fixed inset-0 bg-blueprint-grid pointer-events-none z-0 opacity-70" />

      {/* Organic Analog Micro-Noise Texture (Anti-Pitch-Black, Satin Matte Feel) */}
      <div className="fixed inset-0 bg-analog-grain pointer-events-none z-0 opacity-40 mix-blend-overlay" />

      {/* Diffused Ambient Luminous Aura Lights (Deep Oceanic Teal & Twilight Indigo) */}
      <div className="fixed -top-40 -left-40 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-[700px] h-[700px] bg-sky-600/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/4 w-[800px] h-[800px] bg-indigo-600/8 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* ---------------------------------------------------- */}
      {/* 1. CINEMATIC EDITORIAL NAVIGATION BAR                */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#0b1120]/80 border-b border-slate-700/60 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Explore Dropdown & Search Bar */}
          <div className="flex items-center gap-4 sm:gap-6">


            
          </div>

          {/* Center: College Mechanics Lab Emblem */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <IIITDMLogo size={55} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                  PDPM IIITDM JABALPUR
                </div>
                <div className="text-xs font-bold text-white tracking-tight leading-none mt-0.5 group-hover:text-sky-300 transition-colors">
                  Torsional Pendulum Virtual Laboratory
                </div>
                <div className="text-[9px] text-slate-400 mt-1">Engineering Physics • Academic Project</div>
              </div>
            </a>
          </div>

          {/* Right: Navigation Anchors & Launch Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <button
                onClick={() => scrollToSection('theory-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Theory
              </button>
              <button
                onClick={() => scrollToSection('derivations-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Derivations
              </button>
              <button
                onClick={() => scrollToSection('protocol-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Protocol
              </button>
              <button
                onClick={() => scrollToSection('applications-section')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Applications
              </button>
            </div>

            

            {/* Launch Lab Action Button */}
            <button
              onClick={() => scrollToSection('gate-section')}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-sky-950/40 hover:shadow-sky-600/30 cursor-pointer active:scale-95"
            >
              <span>Launch Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. CINEMATIC HERO SECTION WITH PARALLAX PHOTOGRAPHY  */}
      {/* ---------------------------------------------------- */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-transparent border-b border-slate-800/80 overflow-hidden">
        {/* Photographic Background with Subtle Parallax */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(0, ${scrollY * 0.18}px, 0)`,
            willChange: 'transform',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=2000&q=85"
            alt="Scientific physics research laboratory"
            className="w-full h-[120%] object-cover object-center filter brightness-[0.22] contrast-[1.1] saturate-[0.9]"
          />
        </div>

        {/* Soothing Vignette & Deep Navy Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/75 to-[#0b1120]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0b1120]/50 to-[#0b1120] pointer-events-none" />

        {/* Subtle coordinate grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Staggered Cinematic Headline & Project Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <FadeIn delayMs={100} direction="down">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="uppercase tracking-widest font-semibold">
                    COLLEGE ENGINEERING MECHANICS // EXP-PHYS-201
                  </span>
                </div>
              </FadeIn>

              {/* Staggered Title Reveal */}
              <FadeIn delayMs={200} direction="up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                  Torsional Pendulum: <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-indigo-200">
                    Exploring Rotational Oscillations
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delayMs={300} direction="up">
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                  An interactive physics and engineering mechanics project investigating restoring torque,
                  shear elasticity, and moments of inertia via rotational simple harmonic motion.
                  Suspended from a rigid clamp, the wire twists under angular displacement and generates
                  an internal elastic restoring couple that governs harmonic oscillation.
                </p>
              </FadeIn>

              {/* Action Buttons */}
              <FadeIn delayMs={400} direction="up">
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToSection('gate-section')}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-xl shadow-sky-950/60 hover:shadow-sky-600/30 cursor-pointer active:scale-95 group"
                  >
                    <span>Review Theory & Enter Virtual Lab</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('theory-section')}
                    className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm px-5 py-3.5 rounded-lg transition-all duration-200 cursor-pointer shadow-md"
                  >
                    Explore Experiment Theory
                  </button>
                </div>
              </FadeIn>

              {/* Metric Callouts with Animated Counters */}
              <FadeIn delayMs={500} direction="up">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:-translate-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Restoring Torque</div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">τ = −κθ</div>
                    <div className="text-[10px] text-slate-500">Hookean Shear</div>
                  </div>
                  <div className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:-translate-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Natural Period</div>
                    <div className="text-sm font-mono font-bold text-sky-400 mt-0.5">T = 2π√(I/κ)</div>
                    <div className="text-[10px] text-slate-500">Gravity Independent</div>
                  </div>
                  <div className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:-translate-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Torsional Rigidity</div>
                    <div className="text-sm font-mono font-bold text-indigo-400 mt-0.5">
                      κ = πηr<sup>4</sup>/(2L)
                    </div>
                    <div className="text-[10px] text-slate-500">4th-Power Radius</div>
                  </div>
                  <div className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:-translate-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Searle's Method</div>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                      I<sub>1</sub> vs I<sub>2</sub>
                    </div>
                    <div className="text-[10px] text-slate-500">Inertia Elimination</div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: LIVING SCIENTIFIC DIAGRAM (Subtle Harmonic Oscillation Animation) */}
            <div className="lg:col-span-5">
              <FadeIn delayMs={350} direction="left">
                <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/40 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 group">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white tracking-wider">
                        FIG 1.0 — EXPERIMENTAL APPARATUS SCHEMATIC
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      BENCH TP-800
                    </span>
                  </div>

                  {/* Precision SVG Technical Diagram with Living Motion */}
                  <div className="w-full flex justify-center py-2 relative overflow-hidden">
                    <svg
                      viewBox="0 0 420 440"
                      className="w-full max-w-[370px] h-auto text-slate-300 select-none gpu-accelerated"
                    >
                      <defs>
                        <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#d97706" />
                          <stop offset="35%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#b45309" />
                          <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>
                        <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#94a3b8" />
                          <stop offset="50%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                        <linearGradient id="steelStandGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#1e293b" />
                          <stop offset="50%" stopColor="#475569" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
                        </marker>
                      </defs>

                      {/* Heavy Laboratory Base */}
                      <rect x="70" y="400" width="280" height="24" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                      <rect x="90" y="424" width="240" height="6" rx="2" fill="#09090b" />
                      <text x="210" y="416" fill="#a1a1aa" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        CAST IRON VIBRATION-ISOLATED BASE
                      </text>

                      {/* Vertical Rigid Support Column */}
                      <rect x="85" y="30" width="16" height="370" rx="2" fill="url(#steelStandGrad)" stroke="#3f3f46" strokeWidth="1" />
                      {/* Support Crossarm */}
                      <rect x="85" y="30" width="145" height="18" rx="2" fill="url(#steelStandGrad)" stroke="#3f3f46" strokeWidth="1" />

                      {/* Upper Rigid Chuck / Torsion Head */}
                      <rect x="200" y="48" width="24" height="26" rx="2" fill="#27272a" stroke="#71717a" strokeWidth="1.2" />
                      <circle cx="212" cy="61" r="3" fill="#38bdf8" />

                      {/* Upper Clamp Callout */}
                      <line x1="224" y1="55" x2="280" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="286" y="58" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                        RIGID CHUCK (z = 0)
                      </text>

                      {/* Suspension Wire */}
                      <line x1="212" y1="74" x2="212" y2="265" stroke="url(#wireGrad)" strokeWidth="2.2" />

                      {/* Wire Dimension Callout */}
                      <line x1="180" y1="74" x2="180" y2="265" stroke="#71717a" strokeWidth="1" markerEnd="url(#arrowHead)" markerStart="url(#arrowHead)" />
                      <text x="170" y="170" fill="#a1a1aa" fontSize="10" fontFamily="monospace" textAnchor="end">
                        Length L = 0.80 m
                      </text>
                      <line x1="212" y1="165" x2="270" y2="135" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="276" y="137" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                        Radius r = 0.60 mm (r^4 effect)
                      </text>

                      {/* Lower Pin Chuck Clamping Disc */}
                      <rect x="204" y="265" width="16" height="18" rx="2" fill="#27272a" stroke="#71717a" strokeWidth="1" />

                      {/* LIVING ANIMATED FLYWHEEL INERTIA DISC */}
                      <g className="animate-torsion-disc">
                        {/* Heavy Inertial Brass Flywheel Disc Top */}
                        <ellipse cx="212" cy="290" rx="80" ry="24" fill="url(#brassGrad)" stroke="#b45309" strokeWidth="1.5" />
                        {/* Disc Rim Thickness */}
                        <path
                          d="M 132,290 C 132,303 168,314 212,314 C 256,314 292,303 292,290 L 292,303 C 292,316 256,327 212,327 C 168,327 132,316 132,303 Z"
                          fill="#b45309"
                          stroke="#78350f"
                          strokeWidth="1.5"
                        />

                        {/* Symmetrical Searle Auxiliary Masses */}
                        <rect x="155" y="278" width="16" height="14" rx="2" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
                        <rect x="253" y="278" width="16" height="14" rx="2" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />

                        {/* Degree markings on rim */}
                        <line x1="212" y1="304" x2="212" y2="313" stroke="#000" strokeWidth="1.5" />
                        <line x1="180" y1="300" x2="182" y2="308" stroke="#78350f" strokeWidth="1" />
                        <line x1="244" y1="300" x2="242" y2="308" stroke="#78350f" strokeWidth="1" />
                      </g>

                      {/* Radial distance indicator d */}
                      <line x1="212" y1="285" x2="253" y2="285" stroke="#38bdf8" strokeWidth="1" markerEnd="url(#arrowHead)" />
                      <text x="232" y="277" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        d = 6.0 cm
                      </text>

                      {/* Inertia Disc Callout */}
                      <line x1="270" y1="290" x2="330" y2="265" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="336" y="263" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                        INERTIA DISC (M, R)
                      </text>
                      <text x="336" y="277" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
                        + Searle Masses m₁ = m₂
                      </text>

                      {/* Living Restoring Torque Curvature Arrow */}
                      <path
                        d="M 175,330 C 190,343 234,343 249,330"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        markerEnd="url(#arrowHead)"
                        className="animate-torque-pulse"
                      />
                      <text x="212" y="355" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        Restoring Torque τ = −κθ
                      </text>

                      {/* Living Laser Photogate Sensor */}
                      <rect x="290" y="340" width="30" height="25" rx="3" fill="#27272a" stroke="#52525b" strokeWidth="1" />
                      <line
                        x1="290"
                        y1="352"
                        x2="160"
                        y2="352"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-laser-pulse"
                      />
                      <circle cx="212" cy="352" r="3" fill="#ef4444" className="animate-laser-pulse" />
                      <text x="328" y="356" fill="#ef4444" fontSize="9" fontFamily="monospace">
                        INFRARED OPTICAL GATE
                      </text>
                    </svg>
                  </div>

                  <div className="mt-2 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>SPECIMEN: HIGH-TENSILE CARBON STEEL</span>
                    <span className="text-sky-400 font-semibold">TOLERANCE: ±0.001s</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* Bottom Hero Ribbon: 4 Navigation Columns              */}
          {/* ---------------------------------------------------- */}
          <FadeIn delayMs={600} direction="up">
            <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => scrollToSection('theory-section')}
                className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all duration-300"
              >
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  01. EXPERIMENT OVERVIEW
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  <span>Working Principle & Hookean Shear</span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => scrollToSection('derivations-section')}
                className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all duration-300"
              >
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  02. MATHEMATICAL DERIVATION
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  <span>Equation of Motion & Searle's Method</span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => scrollToSection('protocol-section')}
                className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all duration-300"
              >
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  03. LABORATORY PROTOCOL
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  <span>Metrology Bench & Error Analysis</span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => scrollToSection('applications-section')}
                className="text-left group cursor-pointer p-3 rounded-lg hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition-all duration-300"
              >
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  04. ENGINEERING APPLICATIONS
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  <span>Gravitational & Gyroscopic Systems</span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. SECTION 01: THEORY & PHYSICAL MECHANICS           */}
      {/* ---------------------------------------------------- */}
      <section id="theory-section" className="py-20 bg-transparent border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  MECHANICS THEORY // SECTION 01
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Fundamental Rotational Mechanics
                </h2>
              </div>
              <button
                onClick={() => scrollToSection('derivations-section')}
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer group"
              >
                <span>View Derivations</span>
                <div className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-sky-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Theory narrative & formulas */}
            <div className="lg:col-span-7 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
              <FadeIn delayMs={100}>
                <p>
                  When a cylindrical wire or rod is clamped rigidly at its upper extremity and twisted through an angular displacement
                  <span className="font-mono text-white font-semibold"> θ </span> at its lower end, every cross-section of the wire
                  parallel to the base experiences an angular shear displacement proportional to its axial distance from the fixed clamp.
                </p>
              </FadeIn>

              <FadeIn delayMs={150}>
                <p>
                  Consider a thin concentric cylindrical shell inside the wire of radius <span className="font-mono text-white font-semibold">ρ</span> and
                  thickness <span className="font-mono text-white font-semibold">dρ</span>. If the wire has length <span className="font-mono text-white font-semibold">L</span>,
                  the shear strain <span className="font-mono text-white font-semibold">φ</span> at radial distance <span className="font-mono text-white font-semibold">ρ</span> is:
                </p>
              </FadeIn>

              {/* Formula Callout */}
              <FadeIn delayMs={200}>
                <div className="p-5 rounded-xl glass-card font-mono flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md transition-all">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Shear Strain at Radial Distance ρ</div>
                    <div className="text-xl font-bold text-sky-300 mt-1">φ = (ρ · θ) / L</div>
                  </div>
                  <div className="text-xs text-slate-400 max-w-xs text-right hidden sm:block">
                    Strain vanishes at central core (ρ = 0) and reaches maximum at outer surface (ρ = r).
                  </div>
                </div>
              </FadeIn>

              <FadeIn delayMs={250}>
                <p>
                  By Hooke's Law in pure shear, the shearing stress is <span className="font-mono text-white font-semibold">σ<sub>s</sub> = η · φ = η (ρ θ / L)</span>,
                  where <span className="font-mono text-white font-semibold">η</span> (eta) is the wire material's <strong>Shear Modulus (Modulus of Rigidity)</strong>.
                  Multiplying stress by the annular area <span className="font-mono text-white font-semibold">dA = 2πρ dρ</span> gives the tangential shearing force.
                  Multiplying by the moment arm <span className="font-mono text-white font-semibold">ρ</span> gives the elemental restoring torque:
                </p>
              </FadeIn>

              <FadeIn delayMs={300}>
                <div className="p-5 rounded-xl glass-card font-mono shadow-lg">
                  <div className="text-xs text-slate-400 uppercase mb-2 font-bold">Integration over Solid Cylinder of Radius r:</div>
                  <div className="text-base sm:text-lg font-bold text-sky-400 overflow-x-auto py-1">
                    τ = ∫<sub>0</sub><sup>r</sup> (2πρ dρ) · [η (ρθ / L)] · ρ = (2πηθ / L) ∫<sub>0</sub><sup>r</sup> ρ<sup>3</sup> dρ = [πηr<sup>4</sup> / (2L)] · θ = κθ
                  </div>
                </div>
              </FadeIn>

              <FadeIn delayMs={350}>
                <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-md backdrop-blur-md">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>The Fourth-Power Law (r<sup>4</sup> Scaling):</strong> Because restoring torque scales with the 4th power
                    of wire radius <span className="font-mono">r</span>, a mere 10% increase in wire radius produces a{' '}
                    <strong>
                      <AnimatedCounter value={46.4} decimals={1} suffix="% increase" className="text-amber-300 font-bold" />
                    </strong>{' '}
                    in torsional rigidity <span className="font-mono">κ</span>. In our laboratory metrology procedure, the wire diameter must be measured with an ultra-precise
                    micrometric screw gauge across multiple orientations.
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right 5 Columns: Photographic Specimen Card & Parameter Reference */}
            <div className="lg:col-span-5 space-y-6">
              {/* Scientific Photograph Card */}
              <FadeIn delayMs={200} direction="left">
                <div className="relative rounded-2xl overflow-hidden glass-card group shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                      alt="Precision mechanical testing of suspension specimens"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 contrast-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 flex flex-col justify-end">
                    <div className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">
                      SPECIMEN CHARACTERIZATION
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      Elastic Shear Stress & Modulus of Rigidity
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      High-tensile suspension wire testing under controlled torsional displacement.
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Parameter Reference Table */}
              <FadeIn delayMs={300} direction="left">
                <div className="p-5 rounded-xl glass-card space-y-4 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Physical Variables & SI Units</span>
                  </h3>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">τ (Restoring Torque)</span>
                      <span className="text-white font-bold">N · m</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">θ (Angular Twist)</span>
                      <span className="text-white font-bold">radians (rad)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">κ (Torsional Constant)</span>
                      <span className="text-white font-bold">N · m / rad</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">η (Shear Modulus)</span>
                      <span className="text-white font-bold">N / m² (Pa)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">I (Moment of Inertia)</span>
                      <span className="text-white font-bold">kg · m²</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400">L (Suspension Length)</span>
                      <span className="text-white font-bold">meters (m)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">r (Wire Radius)</span>
                      <span className="text-white font-bold">meters (m)</span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Material Modulus Comparison */}
              <FadeIn delayMs={400} direction="left">
                <div className="p-5 rounded-xl glass-card space-y-3 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Atom className="w-4 h-4 text-indigo-400" />
                    <span>Standard Laboratory Specimens</span>
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-300">High-Tensile Carbon Steel</span>
                      <span className="text-sky-300 font-bold">
                        η ≈ <AnimatedCounter value={79.0} decimals={1} suffix=" GPa" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Copper Alloy</span>
                      <span className="text-slate-400">η ≈ 44.0 GPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Brass (Cartridge)</span>
                      <span className="text-slate-400">η ≈ 37.0 GPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Aluminum 6061-T6</span>
                      <span className="text-slate-400">η ≈ 26.0 GPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Tungsten Alloy</span>
                      <span className="text-slate-400">η ≈ 161.0 GPa</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. SECTION 02: MATHEMATICAL DERIVATIONS & SEARLE'S   */}
      {/* ---------------------------------------------------- */}
      <section id="derivations-section" className="py-20 bg-slate-950/20 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  MATHEMATICAL DERIVATIONS // SECTION 02
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Equation of Motion & Natural Period
                </h2>
              </div>
              <button
                onClick={() => scrollToSection('protocol-section')}
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer group"
              >
                <span>Lab Protocol</span>
                <div className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-sky-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Card: Harmonic Oscillator Equation */}
            <FadeIn delayMs={100} direction="up">
              <div className="p-6 rounded-2xl glass-card space-y-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">DERIVATION 2.1</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                    ROTATIONAL S.H.M.
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Differential Equation of Motion</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  By Newton's rotational analog (<span className="font-mono">Στ = I α</span>), the restoring torque
                  <span className="font-mono"> τ = −κθ </span> accelerates the total mass moment of inertia <span className="font-mono">I</span>:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-center space-y-2 shadow-inner">
                  <div className="text-base sm:text-lg font-bold text-white">
                    I (d²θ / dt²) + κ θ = 0
                  </div>
                  <div className="text-xs text-slate-400">
                    (d²θ / dt²) + (κ / I) θ = 0
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This is the standard differential equation for Simple Harmonic Motion. Setting <span className="font-mono">ω<sub>0</sub><sup>2</sup> = κ / I</span>,
                  the angular frequency and natural period are:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-center space-y-2 shadow-inner">
                  <div className="text-lg font-bold text-sky-400">
                    T = 2π √(I / κ) = 2π √[ (2 L I) / (π η r<sup>4</sup>) ]
                  </div>
                  <div className="text-xs text-slate-400">
                    Frequency f = 1 / T = (1 / 2π) √(κ / I)
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-2">
                  <div className="font-semibold text-slate-300">Crucial Physical Insights:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Period <span className="font-mono">T</span> is <strong>independent of amplitude θ</strong> (isochronism holds strictly within the Hookean elastic regime).</li>
                    <li>Unlike a gravitational pendulum (<span className="font-mono">T = 2π√(L/g)</span>), the torsional period is <strong>completely independent of gravity g</strong>.</li>
                    <li>The restoring mechanism relies purely on the elastic shear modulus of the wire.</li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Right Card: Searle's Two-Trial Auxiliary Mass Method */}
            <FadeIn delayMs={200} direction="up">
              <div className="p-6 rounded-2xl glass-card space-y-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400">DERIVATION 2.2</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                    METROLOGY PRECISION
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Searle's Auxiliary Mass Method</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  In physical experiments, calculating the exact moment of inertia <span className="font-mono">I<sub>0</sub></span> of an irregular flywheel or mounting chuck introduces systematic error.
                  G.F.C. Searle devised a rigorous method placing two identical symmetrical cylinders of mass <span className="font-mono">m</span> at radial distances:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs sm:text-sm space-y-2 shadow-inner">
                  <div className="text-slate-300">
                    Trial 1 at radius d<sub>1</sub>: <span className="text-white font-semibold">I<sub>1</sub> = I<sub>0</sub> + 2m d<sub>1</sub><sup>2</sup></span> → <span className="text-sky-400">T<sub>1</sub><sup>2</sup> = (4π²/κ) I<sub>1</sub></span>
                  </div>
                  <div className="text-slate-300">
                    Trial 2 at radius d<sub>2</sub>: <span className="text-white font-semibold">I<sub>2</sub> = I<sub>0</sub> + 2m d<sub>2</sub><sup>2</sup></span> → <span className="text-sky-400">T<sub>2</sub><sup>2</sup> = (4π²/κ) I<sub>2</sub></span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Subtracting the squared periods completely eliminates the unknown baseline inertia <span className="font-mono">I<sub>0</sub></span>:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-center space-y-2 shadow-inner">
                  <div className="text-sm sm:text-base font-bold text-emerald-400">
                    T<sub>2</sub><sup>2</sup> − T<sub>1</sub><sup>2</sup> = (4π² / κ) · [2m (d<sub>2</sub><sup>2</sup> − d<sub>1</sub><sup>2</sup>)]
                  </div>
                  <div className="text-xs font-bold text-white">
                    κ = [ 8π² m (d<sub>2</sub><sup>2</sup> − d<sub>1</sub><sup>2</sup>) ] / (T<sub>2</sub><sup>2</sup> − T<sub>1</sub><sup>2</sup>)
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-2">
                  Substituting <span className="font-mono">κ = πηr<sup>4</sup> / (2L)</span> yields the direct determination of the shear modulus <span className="font-mono">η</span> purely from mass, ruler distances, and stopwatch readings, with zero assumptions about the disc geometry.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. SECTION 03: LABORATORY PROTOCOL & ERROR ANALYSIS  */}
      {/* ---------------------------------------------------- */}
      <section id="protocol-section" className="py-20 bg-transparent border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  EXPERIMENTAL PROCEDURE // SECTION 03
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Apparatus Metrology & Error Analysis
                </h2>
              </div>
              <button
                onClick={() => scrollToSection('applications-section')}
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer group"
              >
                <span>Applications</span>
                <div className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-sky-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Apparatus & Objectives */}
            <div className="space-y-6">
              <FadeIn delayMs={100} direction="up">
                <div className="p-5 rounded-xl glass-card space-y-4 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-sky-400" />
                    <span>Experimental Objectives</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-mono font-bold">1.</span>
                      <span>Determine the torsional rigidity constant <span className="font-mono text-white">κ</span> of experimental wires.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-mono font-bold">2.</span>
                      <span>Measure the wire material's shear modulus of rigidity <span className="font-mono text-white">η</span>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-mono font-bold">3.</span>
                      <span>Investigate moment of inertia <span className="font-mono text-white">I</span> using Searle's auxiliary mass method.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 font-mono font-bold">4.</span>
                      <span>Verify theoretical scaling laws: <span className="font-mono text-white">T ∝ √L</span> and <span className="font-mono text-white">T ∝ 1/r<sup>2</sup></span>.</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delayMs={200} direction="up">
                <div className="p-5 rounded-xl glass-card space-y-3 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-sky-400" />
                    <span>Required Metrology Tools</span>
                  </h3>
                  <ul className="space-y-2 text-xs font-mono text-slate-300">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>Micrometer Screw Gauge</span>
                      <span className="text-slate-400">LC: 0.01 mm</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>Vernier Calliper</span>
                      <span className="text-slate-400">LC: 0.02 mm</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>Digital Laser Photogate</span>
                      <span className="text-slate-400">Res: 0.001 s</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>Precision Analytical Balance</span>
                      <span className="text-slate-400">Res: 0.1 g</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Metric Steel Rule</span>
                      <span className="text-slate-400">LC: 1.0 mm</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </div>

            {/* Middle: Step-by-Step Laboratory Procedure */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 space-y-4 shadow-xl backdrop-blur-md">
              <FadeIn delayMs={150} direction="up">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>Step-by-Step Procedure</span>
                </h3>
              </FadeIn>

              <div className="space-y-3.5 text-xs text-slate-300">
                <FadeIn delayMs={200}>
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/30 transition-all duration-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="text-sky-400 font-mono">01</span>
                      <span>Metrological Characterization</span>
                    </div>
                    Measure the wire radius <span className="font-mono">r</span> at 5 distinct positions along the wire using the micrometer screw gauge. Measure diameter in two mutually perpendicular directions at each position to account for non-circularity.
                  </div>
                </FadeIn>

                <FadeIn delayMs={250}>
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/30 transition-all duration-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="text-sky-400 font-mono">02</span>
                      <span>Suspension & Leveling</span>
                    </div>
                    Clamp the top of the specimen wire into the rigid overhead chuck. Ensure the spirit bubble level on the base confirms the stand is horizontal. Measure the active free length <span className="font-mono">L</span> between chuck jaws.
                  </div>
                </FadeIn>

                <FadeIn delayMs={300}>
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/30 transition-all duration-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="text-sky-400 font-mono">03</span>
                      <span>Excitation & Small Angle Gate</span>
                    </div>
                    Gently rotate the circular inertia disc through a small angle <span className="font-mono">θ ≤ 30°</span>. Release cleanly without imparting transverse pendular swinging or orbital wobble.
                  </div>
                </FadeIn>

                <FadeIn delayMs={350}>
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/30 transition-all duration-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="text-sky-400 font-mono">04</span>
                      <span>Optical Period Recording</span>
                    </div>
                    Arm the photogate timer. Record the time elapsed for 20 complete oscillations (<span className="font-mono">t<sub>20</sub></span>). Calculate period <span className="font-mono">T = t<sub>20</sub> / 20</span>. Repeat for 3 trials and compute mean period.
                  </div>
                </FadeIn>

                <FadeIn delayMs={400}>
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/30 transition-all duration-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="text-sky-400 font-mono">05</span>
                      <span>Searle's Symmetrical Mass Trials</span>
                    </div>
                    Place identical auxiliary masses at symmetrical radial distances <span className="font-mono">d₁</span> and <span className="font-mono">d₂</span>, recording periods <span className="font-mono">T₁</span> and <span className="font-mono">T₂</span> to eliminate baseline inertia error.
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Right: Error Analysis & Precautions */}
            <div className="space-y-6">
              <FadeIn delayMs={200} direction="up">
                <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 space-y-4 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Logarithmic Error Propagation</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    From <span className="font-mono">η = (8π I L) / (T<sup>2</sup> · r<sup>4</sup>)</span>, taking natural logarithms and differentials:
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 text-center font-bold shadow-inner">
                    Δη/η = 4 (Δr/r) + (ΔL/L) + (ΔI/I) + 2 (ΔT/T)
                  </div>

                  <p className="text-xs text-slate-400">
                    Notice the coefficient <strong>4</strong> on <span className="font-mono">Δr/r</span>. A 1% error in wire radius contributes <strong>4% error</strong> to the shear modulus, making wire diameter metrology the dominant source of laboratory uncertainty.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delayMs={300} direction="up">
                <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 space-y-3 shadow-lg backdrop-blur-md transition-all">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Crucial Lab Precautions</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">·</span>
                      <span><strong>Small Angle Restriction:</strong> Never exceed 45° to avoid plastic yield and non-linear elasticity.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">·</span>
                      <span><strong>Pure Torsion Mode:</strong> Prevent lateral swinging; any pendular mode siphons energy from the torsional frequency.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">·</span>
                      <span><strong>Draft Shielding:</strong> Keep the draft glass cage closed to prevent aerodynamic damping perturbations.</span>
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. SECTION 04: REAL-WORLD APPLICATIONS               */}
      {/* ---------------------------------------------------- */}
      <section id="applications-section" className="py-20 bg-[#060914] border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  ENGINEERING APPLICATIONS // SECTION 04
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Real-World Gravitational & Scientific Applications
                </h2>
              </div>
              <button
                onClick={() => scrollToSection('gate-section')}
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer group"
              >
                <span>Enter Virtual Lab</span>
                <div className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-sky-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Application 1: Cavendish Balance */}
            <FadeIn delayMs={100} direction="up">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500/50 flex flex-col justify-between h-full bg-slate-900/90 shadow-xl group transition-all duration-500 hover:-translate-y-1">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                    alt="Gravitational physics and orbital mechanics"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1">
                      GRAVITATIONAL PHYSICS
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      Cavendish Gravitational Balance
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Henry Cavendish used a delicate torsion fiber balance in 1798 to measure the minuscule gravitational attraction
                      between lead spheres, determining Newton's gravitational constant <span className="font-mono text-white">G</span> and
                      weighing planet Earth for the first time in human history.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-sky-400 font-bold pt-2 border-t border-slate-800">
                    G = 6.67430 × 10<sup>-11</sup> N·m²/kg²
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Application 2: Reaction Wheels */}
            <FadeIn delayMs={200} direction="up">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500/50 flex flex-col justify-between h-full bg-slate-900/90 shadow-xl group transition-all duration-500 hover:-translate-y-1">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
                    alt="Satellite reaction wheels and space telescope attitude control"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1">
                      GYROSCOPIC ATTITUDE CONTROL
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      Satellite Reaction Wheels
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Modern satellites and precision observatories use internal reaction flywheel assemblies for orbital attitude control.
                      Their suspension shafts and vibration isolation flexures undergo torsional frequency tuning to prevent structural resonance with imaging sensors.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-400 font-bold pt-2 border-t border-slate-800">
                    Attitude Jitter &lt; 0.007 arcsec
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Application 3: Coulomb Electrostatic Balance */}
            <FadeIn delayMs={300} direction="up">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500/50 flex flex-col justify-between h-full bg-slate-900/90 shadow-xl group transition-all duration-500 hover:-translate-y-1">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                    alt="Coulomb electrostatic balance precision measurements"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1">
                      ELECTRODYNAMICS
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      Coulomb's Law Verification
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Charles-Augustin de Coulomb invented the torsion balance to establish the inverse-square law for electrostatic
                      attraction and repulsion (<span className="font-mono text-white">F = k q<sub>1</sub>q<sub>2</sub>/r<sup>2</sup></span>), proving that torsion fibers can resolve forces as tiny as 10<sup>-9</sup> Newtons.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 font-bold pt-2 border-t border-slate-800">
                    Sensitivity down to 10<sup>-9</sup> N
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Application 4: Atomic Force Microscopy */}
            <FadeIn delayMs={400} direction="up">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500/50 flex flex-col justify-between h-full bg-slate-900/90 shadow-xl group transition-all duration-500 hover:-translate-y-1">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
                    alt="AFM micro-cantilever lateral force microscopy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1">
                      NANOTECHNOLOGY & AFM
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      AFM Lateral Force Microscopy
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      Modern nanoscale materials science utilizes micro-machined silicon cantilever torsional resonance to image
                      atomic-scale lateral friction, shear forces, and surface bond energies on crystalline semiconductor surfaces.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold pt-2 border-t border-slate-800">
                    Piconewton (10<sup>-12</sup> N) Resolution
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. CHECKBOX GATE & SIMULATION LAUNCH SECTION         */}
      {/* ---------------------------------------------------- */}
      <section id="gate-section" className="py-24 bg-[#050811] relative overflow-hidden border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/30 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-500">
              {/* Subtle accent glow */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 mb-2">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                      <span>STUDENT LABORATORY ACCESS CONSOLE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      Enter the Virtual Laboratory
                    </h2>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Engine Status</div>
                    <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>RK4 SIMULATION ONLINE</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  You are about to launch the full 3D Torsional Pendulum Virtual Laboratory. You will be able to customize
                  wire specimens, adjust length and radius, attach Searle auxiliary masses, calibrate photogate timing,
                  inspect physical instruments on the metrology bench, and record real-time trial observations in your notebook.
                </p>

                {/* Verification Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs font-mono text-slate-300 text-left">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Hookean shear restoring couple: τ = −κθ</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Fourth-power radius stiffness: κ = πηr^4 / (2L)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Isochronous period relation: T = 2π√(I/κ)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Searle's inertia-canceling auxiliary mass trials</span>
                  </div>
                </div>

                {/* The Gate Checkbox Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
                  <label className="flex items-center gap-3.5 cursor-pointer select-none text-left">
                    <input
                      type="checkbox"
                      checked={hasReviewedTheory}
                      onChange={(e) => setHasReviewedTheory(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500 focus:ring-offset-black cursor-pointer accent-sky-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        I have reviewed the experiment theory and am ready to begin the simulation.
                      </span>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">
                        Prerequisite for laboratory practical session
                      </span>
                    </div>
                  </label>

                  {/* Status Indicator */}
                  <span
                    className={`text-xs font-mono px-3 py-1.5 rounded-md whitespace-nowrap shadow-sm transition-all ${
                      hasReviewedTheory
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {hasReviewedTheory ? '✓ Theory Verified' : 'Pending Review'}
                  </span>
                </div>

                {/* Launch Simulation Button (Strictly Disabled Until Checked) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-400 text-center sm:text-left">
                    {!hasReviewedTheory ? (
                      <span className="text-amber-400/90 flex items-center gap-1.5 justify-center sm:justify-start">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Please check the confirmation box above to unlock the virtual lab.</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Virtual lab unlocked. Click Launch Simulation to initialize 3D apparatus.</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!hasReviewedTheory}
                    onClick={onLaunchSimulation}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-mono font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3 ${
                      hasReviewedTheory
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xl shadow-sky-950/60 hover:shadow-sky-600/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                        : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
                    }`}
                  >
                    <span>Launch Simulation →</span>
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. COLLEGE PROJECT FOOTER                            */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#03060c] text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Project Branding & Academic Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <IIITDMLogo size={54} />
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">PDPM IIITDM JABALPUR</div>
                  <h3 className="text-base font-bold text-white leading-tight mt-1">Torsional Pendulum Virtual Laboratory</h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                An academic Engineering Physics project developed at PDPM IIITDM Jabalpur, exploring shear modulus,
                torsional rigidity, and rotational harmonic dynamics through an interactive virtual experiment.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('gate-section')}
                  className="flex items-center gap-2 text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer group"
                >
                  <span>Enter Virtual Lab</span>
                  <div className="w-5 h-5 rounded-full bg-sky-600 group-hover:bg-sky-500 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            </div>

            {/* Middle Columns: Experiment Modules & Resources */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Lab Sections</div>
              <div><button onClick={() => scrollToSection('theory-section')} className="hover:text-white transition-colors cursor-pointer">Theory & Mechanics</button></div>
              <div><button onClick={() => scrollToSection('derivations-section')} className="hover:text-white transition-colors cursor-pointer">Derivations</button></div>
              <div><button onClick={() => scrollToSection('protocol-section')} className="hover:text-white transition-colors cursor-pointer">Lab Protocol</button></div>
              <div><button onClick={() => scrollToSection('applications-section')} className="hover:text-white transition-colors cursor-pointer">Real-World Uses</button></div>
              <div><button onClick={() => scrollToSection('gate-section')} className="text-sky-400 font-bold hover:text-sky-300 transition-colors cursor-pointer">Simulation Gate</button></div>
            </div>

            <div className="md:col-span-2 space-y-2.5">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-2">Course Topics</div>
              <div><span className="text-slate-400">Rotational S.H.M.</span></div>
              <div><span className="text-slate-400">Shear Rigidity (η)</span></div>
              <div><span className="text-slate-400">Searle's Method</span></div>
              <div><span className="text-slate-400">Moment of Inertia</span></div>
              <div><span className="text-slate-400">Error Propagation</span></div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Project Information</div>
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>Course: Engineering Physics / Classical Mechanics</div>
                <div>Topic: Rotational Oscillations & Rigidity Modulus</div>
                <div className="text-slate-200 font-semibold pt-1">Project Team</div>
                <div className="pt-1">Siddharth Jadav <span className="text-cyan-400">· 26BCS234</span></div>
                <div>Om Tale <span className="text-cyan-400">· 26BCS248</span></div>
                <div>Om Kedar <span className="text-cyan-400">· 26BCS171</span></div>
                <div className="text-emerald-400 pt-1">Institution: PDPM IIITDM Jabalpur</div>
              </div>
            </div>
          </div>

          {/* Sub-footer */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
              <div>
                PDPM IIITDM Jabalpur · Engineering Physics Group Project
              </div>
              <div>
                Open Educational Physics Simulation · RK4 Numerical Integrator
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
