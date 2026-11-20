/**
 * Physics engine for Torsional Pendulum Lab
 * Pure mathematical equations, state integration, realistic engineering limits,
 * auxiliary masses (Searle's method), and real-world laboratory scenarios.
 */

export interface WireMaterial {
  name: string;
  shearModulus: number; // Pa (N/m^2)
  density: number; // kg/m^3
  yieldShearStrength: number; // Pa (Elastic limit in shear)
  colorHex: string;
  description: string;
}

export const WIRE_MATERIALS: Record<string, WireMaterial> = {
  steel: {
    name: 'Hardened Steel',
    shearModulus: 7.9e10, // 79 GPa
    density: 7850,
    yieldShearStrength: 2.5e8, // 250 MPa
    colorHex: '#94a3b8',
    description: 'High rigidity, sharp resonance, standard laboratory reference wire.',
  },
  phosphorBronze: {
    name: 'Phosphor Bronze',
    shearModulus: 4.4e10, // 44 GPa
    density: 8800,
    yieldShearStrength: 1.8e8, // 180 MPa
    colorHex: '#d97706',
    description: 'Low internal friction, classic historical galvanometer suspension material.',
  },
  brass: {
    name: 'Yellow Brass',
    shearModulus: 3.7e10, // 37 GPa
    density: 8500,
    yieldShearStrength: 1.4e8, // 140 MPa
    colorHex: '#eab308',
    description: 'Moderate rigidity, easily twisted, ductile alloy.',
  },
  copper: {
    name: 'Electrolytic Copper',
    shearModulus: 4.5e10, // 45 GPa
    density: 8960,
    yieldShearStrength: 7.0e7, // 70 MPa (low elastic limit)
    colorHex: '#f97316',
    description: 'Highly malleable with noticeable elasticity and moderate damping.',
  },
  nichrome: {
    name: 'Nichrome Wire',
    shearModulus: 7.6e10, // 76 GPa
    density: 8400,
    yieldShearStrength: 3.0e8, // 300 MPa
    colorHex: '#cbd5e1',
    description: 'Resilient nickel-chromium alloy with high tensile strength.',
  },
};

export interface AuxiliaryMassParams {
  enabled: boolean;
  massEach: number; // kg (e.g. 0.25 kg each)
  cylinderRadius: number; // m (e.g. 0.015 m)
  distanceFromAxis: number; // m (distance d from disc center)
}

export interface LabReading {
  id: string;
  trialNumber: number;
  wireMaterial: string;
  wireLength: number; // m
  wireRadius: number; // mm
  discMass: number; // kg
  discRadius: number; // cm
  auxiliaryMasses: boolean;
  auxiliaryDistance: number; // cm
  oscillationsCounted: number;
  totalTime: number; // s
  experimentalPeriod: number; // s
  theoreticalPeriod: number; // s
  percentageError: number; // %
  calculatedShearModulus: number; // Pa
  theoreticalShearModulus: number; // Pa
  timestamp: string;
}

/**
 * Calculates moment of inertia of a uniform circular disc rotating about its central perpendicular axis.
 * I = (1/2) * M * R^2
 */
export function calculateDiscInertia(mass: number, radius: number): number {
  if (mass <= 0 || radius <= 0) return 0;
  return 0.5 * mass * radius * radius;
}

/**
 * Calculates additional moment of inertia of two identical cylindrical auxiliary masses
 * placed symmetrically at distance d from the central suspension axis (Parallel Axis Theorem).
 * I_aux = 2 * ( (1/2) * m * r_c^2 + m * d^2 )
 */
export function calculateAuxiliaryInertia(
  massEach: number,
  cylinderRadius: number,
  distanceFromAxis: number
): number {
  if (massEach <= 0 || distanceFromAxis < 0) return 0;
  const iSelf = 0.5 * massEach * cylinderRadius * cylinderRadius;
  return 2 * (iSelf + massEach * distanceFromAxis * distanceFromAxis);
}

/**
 * Calculates torsional constant (torsional rigidity C) of a solid cylindrical wire.
 * C = (pi * eta * r^4) / (2 * L)
 */
export function calculateTorsionalConstant(
  shearModulus: number,
  wireRadius: number,
  wireLength: number
): number {
  if (wireLength <= 0 || wireRadius <= 0 || shearModulus <= 0) return 0;
  return (Math.PI * shearModulus * Math.pow(wireRadius, 4)) / (2 * wireLength);
}

/**
 * Undamped natural angular frequency: omega_0 = sqrt(C / I)
 */
export function calculateNaturalFrequency(C: number, I: number): number {
  if (I <= 0 || C <= 0) return 0;
  return Math.sqrt(C / I);
}

/**
 * Evaluates elastic shear stress, shear strain, and checks against material yield strength
 * to simulate real-world plastic deformation hazards in university physics labs.
 */
export function evaluateWireStress(
  thetaRad: number,
  wireRadius: number,
  wireLength: number,
  shearModulus: number,
  yieldStrength: number
): {
  shearStrain: number;
  maxStressPa: number;
  yieldStrengthPa: number;
  stressPercentageOfYield: number;
  isWithinElasticLimit: boolean;
  maxAllowableAngleDeg: number;
} {
  if (wireLength <= 0 || wireRadius <= 0) {
    return {
      shearStrain: 0,
      maxStressPa: 0,
      yieldStrengthPa: yieldStrength,
      stressPercentageOfYield: 0,
      isWithinElasticLimit: true,
      maxAllowableAngleDeg: 180,
    };
  }

  // Maximum shear strain occurs at outer radius: gamma_max = (r * theta) / L
  const shearStrain = (wireRadius * Math.abs(thetaRad)) / wireLength;
  const maxStressPa = shearModulus * shearStrain;
  const stressPercentageOfYield = (maxStressPa / yieldStrength) * 100;
  const isWithinElasticLimit = maxStressPa <= yieldStrength;

  // Maximum safe angle before exceeding yield strength
  const maxSafeAngleRad = (yieldStrength * wireLength) / (shearModulus * wireRadius);
  const maxAllowableAngleDeg = (maxSafeAngleRad * 180) / Math.PI;

  return {
    shearStrain,
    maxStressPa,
    yieldStrengthPa: yieldStrength,
    stressPercentageOfYield,
    isWithinElasticLimit,
    maxAllowableAngleDeg,
  };
}

/**
 * Undamped theoretical time period: T_0 = 2 * pi * sqrt(I / C)
 * Accommodates optional auxiliary masses (Searle's method).
 */
export function calculateTheoreticalPeriod(
  mass: number,
  discRadius: number,
  wireLength: number,
  wireRadius: number,
  shearModulus: number,
  auxParams?: AuxiliaryMassParams
): {
  inertia: number;
  discInertia: number;
  auxiliaryInertia: number;
  torsionalConstant: number;
  omega0: number;
  period0: number;
  frequency0: number;
} {
  const iDisc = calculateDiscInertia(mass, discRadius);
  const iAux = auxParams?.enabled
    ? calculateAuxiliaryInertia(
        auxParams.massEach,
        auxParams.cylinderRadius,
        auxParams.distanceFromAxis
      )
    : 0;

  const totalInertia = iDisc + iAux;
  const C = calculateTorsionalConstant(shearModulus, wireRadius, wireLength);
  const omega0 = calculateNaturalFrequency(C, totalInertia);
  const period0 = omega0 > 0 ? (2 * Math.PI) / omega0 : 0;
  const frequency0 = period0 > 0 ? 1 / period0 : 0;

  return {
    inertia: totalInertia,
    discInertia: iDisc,
    auxiliaryInertia: iAux,
    torsionalConstant: C,
    omega0,
    period0,
    frequency0,
  };
}

/**
 * Damped theoretical frequency, period, logarithmic decrement, and Quality Factor (Q)
 */
export function calculateDampedCharacteristics(
  C: number,
  I: number,
  dampingConstant: number
): {
  gamma: number;
  dampingRatio: number;
  omegaDamped: number;
  periodDamped: number;
  logarithmicDecrement: number;
  qualityFactor: number;
} {
  if (I <= 0 || C <= 0) {
    return {
      gamma: 0,
      dampingRatio: 0,
      omegaDamped: 0,
      periodDamped: 0,
      logarithmicDecrement: 0,
      qualityFactor: Infinity,
    };
  }

  const omega0 = Math.sqrt(C / I);
  const gamma = dampingConstant / (2 * I);
  const dampingRatio = dampingConstant / (2 * Math.sqrt(I * C));

  if (omega0 <= gamma) {
    // Critically damped or overdamped
    return {
      gamma,
      dampingRatio,
      omegaDamped: 0,
      periodDamped: 0,
      logarithmicDecrement: 0,
      qualityFactor: 0,
    };
  }

  const omegaDamped = Math.sqrt(omega0 * omega0 - gamma * gamma);
  const periodDamped = (2 * Math.PI) / omegaDamped;
  const logarithmicDecrement = gamma * periodDamped;
  const qualityFactor = logarithmicDecrement > 0 ? Math.PI / logarithmicDecrement : Infinity;

  return {
    gamma,
    dampingRatio,
    omegaDamped,
    periodDamped,
    logarithmicDecrement,
    qualityFactor,
  };
}

/**
 * Searle's method: Calculates Moment of Inertia of the disc without knowing wire shear modulus!
 * Formula: I_disc = (2 * m * (d2^2 - d1^2) * T0^2) / (T2^2 - T1^2)
 */
export function calculateSearleInertia(
  massEach: number,
  d1: number,
  d2: number,
  periodDiscAlone: number,
  periodWithAux1: number,
  periodWithAux2: number
): number {
  const num = 2 * massEach * (d2 * d2 - d1 * d1) * (periodDiscAlone * periodDiscAlone);
  const den = periodWithAux2 * periodWithAux2 - periodWithAux1 * periodWithAux1;
  return den !== 0 ? num / den : 0;
}

/**
 * Back-calculates shear modulus (rigidity modulus eta) from an experimentally observed period T.
 * Formula: eta = (8 * pi * I * L) / (T^2 * r^4)
 */
export function calculateShearModulusFromPeriod(
  observedPeriod: number,
  mass: number,
  discRadius: number,
  wireLength: number,
  wireRadius: number,
  auxInertia = 0
): number {
  if (
    observedPeriod <= 0 ||
    wireRadius <= 0 ||
    wireLength <= 0 ||
    mass <= 0 ||
    discRadius <= 0
  ) {
    return 0;
  }
  const totalInertia = calculateDiscInertia(mass, discRadius) + auxInertia;
  const r4 = Math.pow(wireRadius, 4);
  const T2 = observedPeriod * observedPeriod;
  return (8 * Math.PI * totalInertia * wireLength) / (T2 * r4);
}

/**
 * Fractional uncertainty error propagation for Rigidity Modulus (eta).
 * delta_eta / eta = delta_M / M + 2 * delta_R / R + delta_L / L + 4 * delta_r / r + 2 * delta_T / T
 */
export function calculateErrorPropagation(params: {
  mass: number;
  deltaMass: number;
  discRadius: number;
  deltaDiscRadius: number;
  wireLength: number;
  deltaWireLength: number;
  wireRadius: number;
  deltaWireRadius: number;
  period: number;
  deltaPeriod: number;
}): {
  relativeError: number;
  percentageError: number;
  contributions: {
    mass: number;
    discRadius: number;
    wireLength: number;
    wireRadius: number;
    period: number;
  };
} {
  const cMass = params.deltaMass / params.mass;
  const cDiscRadius = (2 * params.deltaDiscRadius) / params.discRadius;
  const cWireLength = params.deltaWireLength / params.wireLength;
  const cWireRadius = (4 * params.deltaWireRadius) / params.wireRadius;
  const cPeriod = (2 * params.deltaPeriod) / params.period;

  const total = cMass + cDiscRadius + cWireLength + cWireRadius + cPeriod;

  return {
    relativeError: total,
    percentageError: total * 100,
    contributions: {
      mass: (cMass / total) * 100,
      discRadius: (cDiscRadius / total) * 100,
      wireLength: (cWireLength / total) * 100,
      wireRadius: (cWireRadius / total) * 100,
      period: (cPeriod / total) * 100,
    },
  };
}

/**
 * Fourth-order Runge-Kutta (RK4) integrator step for torsional pendulum.
 */
export function stepRK4(
  theta: number,
  omega: number,
  dt: number,
  C: number,
  I: number,
  b: number
): { theta: number; omega: number; alpha: number } {
  if (I <= 0) return { theta, omega, alpha: 0 };

  const getDerivs = (th: number, om: number) => {
    const dTheta = om;
    const dOmega = -(C * th + b * om) / I;
    return { dTheta, dOmega };
  };

  const k1 = getDerivs(theta, omega);
  const k2 = getDerivs(
    theta + 0.5 * dt * k1.dTheta,
    omega + 0.5 * dt * k1.dOmega
  );
  const k3 = getDerivs(
    theta + 0.5 * dt * k2.dTheta,
    omega + 0.5 * dt * k2.dOmega
  );
  const k4 = getDerivs(theta + dt * k3.dTheta, omega + dt * k3.dOmega);

  const nextTheta =
    theta + (dt / 6) * (k1.dTheta + 2 * k2.dTheta + 2 * k3.dTheta + k4.dTheta);
  const nextOmega =
    omega + (dt / 6) * (k1.dOmega + 2 * k2.dOmega + 2 * k3.dOmega + k4.dOmega);

  const alpha = -(C * nextTheta + b * nextOmega) / I;

  return {
    theta: nextTheta,
    omega: nextOmega,
    alpha,
  };
}

/**
 * Analytical solution for underdamped torsional oscillation at time t.
 */
export function getAnalyticalState(
  t: number,
  theta0: number,
  C: number,
  I: number,
  b: number
): { theta: number; omega: number; alpha: number } {
  if (I <= 0 || C <= 0) return { theta: 0, omega: 0, alpha: 0 };

  const omega0 = Math.sqrt(C / I);
  const gamma = b / (2 * I);

  if (gamma >= omega0) {
    const decay = Math.exp(-gamma * t);
    const theta = theta0 * decay * (1 + gamma * t);
    const omega = -theta0 * gamma * gamma * t * decay;
    return { theta, omega, alpha: 0 };
  }

  const omegaD = Math.sqrt(omega0 * omega0 - gamma * gamma);
  const decay = Math.exp(-gamma * t);

  const cosTerm = Math.cos(omegaD * t);
  const sinTerm = Math.sin(omegaD * t);

  const theta = decay * theta0 * (cosTerm + (gamma / omegaD) * sinTerm);
  const omega = -decay * theta0 * (omega0 * omega0 / omegaD) * sinTerm;
  const alpha = -(C * theta + b * omega) / I;

  return { theta, omega, alpha };
}
