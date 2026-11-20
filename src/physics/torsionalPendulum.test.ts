import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiscInertia,
  calculateAuxiliaryInertia,
  calculateTorsionalConstant,
  calculateTheoreticalPeriod,
  calculateShearModulusFromPeriod,
  calculateErrorPropagation,
  evaluateWireStress,
  calculateSearleInertia,
  calculateDampedCharacteristics,
  stepRK4,
  getAnalyticalState,
  WIRE_MATERIALS,
} from './torsionalPendulum.ts';

test('calculateDiscInertia computes (1/2) * M * R^2 correctly', () => {
  const I = calculateDiscInertia(2, 0.1);
  assert.ok(Math.abs(I - 0.01) < 1e-12);
  assert.equal(calculateDiscInertia(0, 0.1), 0);
  assert.equal(calculateDiscInertia(-1, 0.1), 0);
});

test('calculateAuxiliaryInertia applies parallel axis theorem for two symmetrical masses', () => {
  // Two masses each 0.25 kg, radius 0.015 m, placed at d = 0.08 m from axis
  const m = 0.25;
  const rc = 0.015;
  const d = 0.08;
  const iSelf = 0.5 * m * rc * rc;
  const expectedI = 2 * (iSelf + m * d * d); // ~0.003256 kg*m^2

  const iAux = calculateAuxiliaryInertia(m, rc, d);
  assert.ok(Math.abs(iAux - expectedI) < 1e-8);
});

test('evaluateWireStress calculates shear strain and detects elastic limit exceedance', () => {
  const thetaSafe = (15 * Math.PI) / 180; // 15 deg
  const thetaExtreme = (150 * Math.PI) / 180; // 150 deg (excessive twist)
  const r = 0.0006;
  const L = 0.8;
  const eta = WIRE_MATERIALS.copper.shearModulus; // 45 GPa
  const yieldStrength = WIRE_MATERIALS.copper.yieldShearStrength; // 70 MPa

  const safeResult = evaluateWireStress(thetaSafe, r, L, eta, yieldStrength);
  assert.equal(safeResult.isWithinElasticLimit, true);
  assert.ok(safeResult.stressPercentageOfYield < 100);

  const extremeResult = evaluateWireStress(thetaExtreme, r, L, eta, yieldStrength);
  assert.equal(extremeResult.isWithinElasticLimit, false);
  assert.ok(extremeResult.stressPercentageOfYield > 100);
});

test('calculateSearleInertia correctly determines disc inertia from two auxiliary distances and periods', () => {
  const massDisc = 1.6;
  const discR = 0.10;
  const trueInertia = calculateDiscInertia(massDisc, discR); // 0.008 kg*m^2
  const wireL = 0.8;
  const wireR = 0.0006;
  const eta = WIRE_MATERIALS.steel.shearModulus;

  const mAux = 0.3; // 300g each
  const rc = 0.015;
  const d1 = 0.04; // 4 cm
  const d2 = 0.08; // 8 cm

  const p0 = calculateTheoreticalPeriod(massDisc, discR, wireL, wireR, eta).period0;
  const p1 = calculateTheoreticalPeriod(massDisc, discR, wireL, wireR, eta, {
    enabled: true,
    massEach: mAux,
    cylinderRadius: rc,
    distanceFromAxis: d1,
  }).period0;
  const p2 = calculateTheoreticalPeriod(massDisc, discR, wireL, wireR, eta, {
    enabled: true,
    massEach: mAux,
    cylinderRadius: rc,
    distanceFromAxis: d2,
  }).period0;

  const searleInertia = calculateSearleInertia(mAux, d1, d2, p0, p1, p2);
  const diffPct = Math.abs((searleInertia - trueInertia) / trueInertia) * 100;
  assert.ok(diffPct < 1.0, `Searle inertia should match within 1%, got ${diffPct}%`);
});

test('calculateDampedCharacteristics computes logarithmic decrement and Q factor', () => {
  const C = 0.02;
  const I = 0.008;
  const b = 0.0002;
  const damped = calculateDampedCharacteristics(C, I, b);

  assert.ok(damped.periodDamped > 0);
  assert.ok(damped.logarithmicDecrement > 0);
  assert.ok(damped.qualityFactor > 10);
  assert.ok(Math.abs(damped.qualityFactor * damped.logarithmicDecrement - Math.PI) < 1e-4);
});

test('stepRK4 integrates undamped motion preserving energy and matching analytical harmonic oscillator', () => {
  const I = 0.01;
  const C = 0.05;
  const b = 0.0;
  const initialTheta = 0.5;
  let currentTheta = initialTheta;
  let currentOmega = 0.0;
  const dt = 0.005;
  const totalSteps = 200;

  for (let i = 0; i < totalSteps; i++) {
    const next = stepRK4(currentTheta, currentOmega, dt, C, I, b);
    currentTheta = next.theta;
    currentOmega = next.omega;
  }

  const time = totalSteps * dt;
  const analytical = getAnalyticalState(time, initialTheta, C, I, b);
  const diffTheta = Math.abs(currentTheta - analytical.theta);
  assert.ok(diffTheta < 0.005, `Difference in theta too high: ${diffTheta}`);
});
