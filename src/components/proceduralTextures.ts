import * as THREE from 'three';

/**
 * Procedural texture generator for high-realism scientific apparatus.
 * Eliminates external asset dependencies and guarantees crisp high-DPI rendering.
 */

/**
 * Creates high-detail procedural mahogany/oak laboratory workbench texture
 */
export function createWoodWorkbenchTexture(width = 1024, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep rich lab mahogany base
  ctx.fillStyle = '#261b14';
  ctx.fillRect(0, 0, width, height);

  // Subtle wood fiber longitudinal bands
  for (let y = 0; y < height; y += 4) {
    const tone = Math.sin(y * 0.05) * 15 + Math.sin(y * 0.15) * 8;
    const r = Math.min(255, Math.max(0, 48 + Math.floor(tone)));
    const g = Math.min(255, Math.max(0, 32 + Math.floor(tone * 0.7)));
    const b = Math.min(255, Math.max(0, 22 + Math.floor(tone * 0.5)));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y, width, 4);
  }

  // Soft wood grain waves
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let i = 0; i < 30; i++) {
    const yCenter = (i / 30) * height + Math.sin(i) * 20;
    ctx.beginPath();
    ctx.moveTo(0, yCenter);
    for (let x = 0; x < width; x += 40) {
      const dy = Math.sin((x + i * 50) * 0.015) * 8;
      ctx.lineTo(x, yCenter + dy);
    }
    ctx.lineWidth = 12 + (i % 5) * 4;
    ctx.stroke();
  }

  // Semi-gloss polyurethane finish reflection highlight
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates wire texture with visible vertical and helical torsion lines
 * so users can visibly see the elastic twist along the wire.
 */
export function createWireTwistTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed steel wire surface
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 128, 512);

  // Distinct vertical contrast stripes
  for (let x = 0; x < 128; x += 16) {
    ctx.fillStyle = x % 32 === 0 ? '#475569' : '#e2e8f0';
    ctx.fillRect(x, 0, 8, 512);
  }

  // Clamp marks at top and bottom ends
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.fillRect(0, 0, 128, 20);
  ctx.fillRect(0, 492, 128, 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Circular dial texture with high-precision degree markings:
 * 0 to 360 degrees, major ticks every 10 deg, minor ticks every 2 deg, labels every 30 deg,
 * plus a bold red reference notch at 0 deg and dual auxiliary weight radial slots.
 */
export function createDialTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;

  // Background brushed brass/steel tone
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius + 20);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(0.7, '#cbd5e1');
  grad.addColorStop(0.95, '#94a3b8');
  grad.addColorStop(1, '#64748b');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle concentric micro-grooves (machined lathe finish)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let r = 50; r < radius - 30; r += 10) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Dual auxiliary weight radial slot guides (Searle's tracks at 0° and 180°)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.78, cy);
  ctx.lineTo(cx - radius * 0.25, cy);
  ctx.moveTo(cx + radius * 0.25, cy);
  ctx.lineTo(cx + radius * 0.78, cy);
  ctx.stroke();

  // Slot center alignment groove
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.78, cy);
  ctx.lineTo(cx - radius * 0.25, cy);
  ctx.moveTo(cx + radius * 0.25, cy);
  ctx.lineTo(cx + radius * 0.78, cy);
  ctx.stroke();

  // Slot millimeter graduation ticks (3cm, 4cm, 5cm, 6cm, 7cm, 8cm)
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  for (let d = 3; d <= 8; d++) {
    const frac = 0.25 + ((d - 3) / 5) * (0.78 - 0.25);
    const xPosR = cx + radius * frac;
    const xPosL = cx - radius * frac;

    // Right track ticks
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xPosR, cy - 12);
    ctx.lineTo(xPosR, cy + 12);
    ctx.moveTo(xPosL, cy - 12);
    ctx.lineTo(xPosL, cy + 12);
    ctx.stroke();

    ctx.fillText(`${d}cm`, xPosR, cy - 14);
    ctx.fillText(`${d}cm`, xPosL, cy - 14);
  }

  // Outer ring border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
  ctx.stroke();

  // Degree graduation ticks
  for (let deg = 0; deg < 360; deg++) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 10 === 0;
    const isMinor = deg % 2 === 0;

    let tickLen = 0;
    let strokeW = 1;
    let strokeColor = '#334155';

    if (isMajor) {
      tickLen = 32;
      strokeW = 3.5;
      strokeColor = '#0f172a';
    } else if (isMedium) {
      tickLen = 22;
      strokeW = 2;
      strokeColor = '#1e293b';
    } else if (isMinor) {
      tickLen = 12;
      strokeW = 1;
      strokeColor = '#475569';
    } else {
      continue;
    }

    const rOuter = radius - 8;
    const rInner = rOuter - tickLen;

    const x1 = cx + Math.cos(rad) * rOuter;
    const y1 = cy + Math.sin(rad) * rOuter;
    const x2 = cx + Math.cos(rad) * rInner;
    const y2 = cy + Math.sin(rad) * rInner;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Degree numeric labels on major ticks
    if (isMajor) {
      const rText = rInner - 22;
      const tx = cx + Math.cos(rad) * rText;
      const ty = cy + Math.sin(rad) * rText;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(rad + Math.PI / 2);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${deg}°`, 0, 0);
      ctx.restore();
    }
  }

  // Zero-degree Reference Marker (High-visibility red arrow indicator)
  ctx.save();
  ctx.translate(cx + radius - 20, cy);
  ctx.rotate(0);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-24, -10);
  ctx.lineTo(-18, 0);
  ctx.lineTo(-24, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Central hub cutout border
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates transparent acrylic protractor scale for the fixed chassis ring beneath the disc
 */
export function createProtractorRingTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.48;
  const rInner = size * 0.38;

  ctx.clearRect(0, 0, size, size);

  // Subtle translucent ring fill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2, true);
  ctx.fill();

  // Outer and inner borders
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter - 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, rInner + 2, 0, Math.PI * 2);
  ctx.stroke();

  // Degree ticks in cyan/white
  for (let deg = 0; deg < 360; deg++) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 10 === 0;
    const isMinor = deg % 2 === 0;

    let len = 0;
    let strokeW = 1;
    let strokeCol = 'rgba(255,255,255,0.4)';

    if (isMajor) {
      len = 28;
      strokeW = 3;
      strokeCol = '#38bdf8';
    } else if (isMedium) {
      len = 18;
      strokeW = 2;
      strokeCol = '#bae6fd';
    } else if (isMinor) {
      len = 10;
      strokeW = 1;
      strokeCol = 'rgba(255,255,255,0.5)';
    } else {
      continue;
    }

    const x1 = cx + Math.cos(rad) * (rOuter - 4);
    const y1 = cy + Math.sin(rad) * (rOuter - 4);
    const x2 = cx + Math.cos(rad) * (rOuter - 4 - len);
    const y2 = cy + Math.sin(rad) * (rOuter - 4 - len);

    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (isMajor) {
      const rx = cx + Math.cos(rad) * (rInner + 18);
      const ry = cy + Math.sin(rad) * (rInner + 18);
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(rad + Math.PI / 2);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${deg}°`, 0, 0);
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Metric millimeter ruler texture for the vertical stand support rod
 */
export function createRulerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, '#64748b');
  grad.addColorStop(0.3, '#cbd5e1');
  grad.addColorStop(0.7, '#f1f5f9');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 1024);

  // Vertical millimeter graduations
  ctx.fillStyle = '#0f172a';
  for (let mm = 0; mm <= 100; mm++) {
    const y = (mm / 100) * 1000 + 12;
    const isCm = mm % 10 === 0;
    const is5mm = mm % 5 === 0;

    let len = 15;
    let strokeW = 1;

    if (isCm) {
      len = 45;
      strokeW = 2.5;
    } else if (is5mm) {
      len = 28;
      strokeW = 1.8;
    }

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(10 + len, y);
    ctx.stroke();

    if (isCm) {
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${mm} cm`, 62, y);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates soft contact shadow texture
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 128;
  const cy = 128;
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates photogate digital LED display texture on the laboratory timer box
 */
export function createLedDisplayTexture(timeSec: number, stateText: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Black bezel
  ctx.fillStyle = '#050811';
  ctx.fillRect(0, 0, 256, 128);

  // Header status
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText(`PHOTOGATE: ${stateText}`, 15, 30);

  // 7-segment digital time readout
  ctx.fillStyle = '#22c55e'; // Green LED
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText(`${timeSec.toFixed(3)} s`, 15, 82);

  // Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('PRECISION 0.001s', 15, 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
