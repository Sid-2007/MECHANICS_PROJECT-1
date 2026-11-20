import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createDialTexture,
  createProtractorRingTexture,
  createRulerTexture,
  createContactShadowTexture,
  createWoodWorkbenchTexture,
  createWireTwistTexture,
} from './proceduralTextures.ts';
import { playRatchetSound } from '../utils/audioSynth.ts';
import { AuxiliaryMassParams } from '../physics/torsionalPendulum.ts';

interface TorsionalSceneProps {
  currentAngle: number; // in radians
  wireLength: number; // in meters
  wireRadius: number; // in meters
  discMass: number; // in kg
  discRadius: number; // in meters
  wireColorHex: string;
  isDraggingDisc: boolean;
  onDiscDragStart?: () => void;
  onDiscDragChange?: (newAngleRad: number) => void;
  onDiscDragEnd?: () => void;
  cameraPreset: 'perspective' | 'front' | 'closeup' | 'top' | 'bench';
  showDegreeRing: boolean;
  soundEnabled: boolean;
  auxiliaryMasses: AuxiliaryMassParams;
  releaseMode: 'gate' | 'hand'; // Ideal vs Imperfect hand release
  wobbleIntensity: number; // For coupled pendular tilt
  onOpenInstrumentModal?: (tool: 'screwGauge' | 'vernier' | 'balance') => void;
}

export const TorsionalScene: React.FC<TorsionalSceneProps> = ({
  currentAngle,
  wireLength,
  wireRadius,
  discRadius,
  wireColorHex,
  isDraggingDisc,
  onDiscDragStart,
  onDiscDragChange,
  onDiscDragEnd,
  cameraPreset,
  showDegreeRing,
  soundEnabled,
  auxiliaryMasses,
  releaseMode,
  wobbleIntensity,
  onOpenInstrumentModal,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({
    currentAngle,
    wireLength,
    wireRadius,
    discRadius,
    wireColorHex,
    isDraggingDisc,
    cameraPreset,
    showDegreeRing,
    soundEnabled,
    auxiliaryMasses,
    releaseMode,
    wobbleIntensity,
    onDiscDragStart,
    onDiscDragChange,
    onDiscDragEnd,
    onOpenInstrumentModal,
  });

  useEffect(() => {
    propsRef.current = {
      currentAngle,
      wireLength,
      wireRadius,
      discRadius,
      wireColorHex,
      isDraggingDisc,
      cameraPreset,
      showDegreeRing,
      soundEnabled,
      auxiliaryMasses,
      releaseMode,
      wobbleIntensity,
      onDiscDragStart,
      onDiscDragChange,
      onDiscDragEnd,
      onOpenInstrumentModal,
    };
  }, [
    currentAngle,
    wireLength,
    wireRadius,
    discRadius,
    wireColorHex,
    isDraggingDisc,
    cameraPreset,
    showDegreeRing,
    soundEnabled,
    auxiliaryMasses,
    releaseMode,
    wobbleIntensity,
    onDiscDragStart,
    onDiscDragChange,
    onDiscDragEnd,
    onOpenInstrumentModal,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080b14);
    scene.fog = new THREE.FogExp2(0x080b14, 0.07);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.05, 50);
    camera.position.set(2.2, 1.8, 2.7);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Procedural Studio Environment Reflection
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e293b, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    keyLight.position.set(3.5, 5.2, 3.8);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      keyLight.shadow.camera.left = -2;
      keyLight.shadow.camera.right = 2;
      keyLight.shadow.camera.top = 3;
      keyLight.shadow.camera.bottom = -1;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-3.2, 2.8, -2.8);
    scene.add(rimLight);

    // Warm table accent fill
    const tableLight = new THREE.PointLight(0xfef08a, 0.8, 4.0);
    tableLight.position.set(0.6, 0.4, 0.8);
    scene.add(tableLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.4;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0.85, 0);

    // ----------------------------------------------------
    // ASSETS & TEXTURES
    // ----------------------------------------------------
    const woodTexture = createWoodWorkbenchTexture(1024, 1024);
    const wireTwistTexture = createWireTwistTexture();
    const dialTexture = createDialTexture(1024);
    const protractorTexture = createProtractorRingTexture(1024);
    const rulerTexture = createRulerTexture();
    const shadowTexture = createContactShadowTexture();

    // Material Library
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.65,
      metalness: 0.6,
    });

    const brushedChromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.18,
      metalness: 0.9,
    });

    const polishedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.85,
    });

    const woodTableMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.35,
      metalness: 0.1,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      map: wireTwistTexture,
      color: new THREE.Color(propsRef.current.wireColorHex),
      roughness: 0.25,
      metalness: 0.88,
    });

    // ----------------------------------------------------
    // 1. REALISTIC LABORATORY WORKBENCH & SURROUNDING TOOLS
    // ----------------------------------------------------
    const benchGroup = new THREE.Group();
    scene.add(benchGroup);

    // Heavy wooden laboratory tabletop
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.08, 1.8),
      woodTableMat
    );
    tableTop.position.set(0.2, -0.04, 0);
    tableTop.receiveShadow = !isSoftwareGl;
    benchGroup.add(tableTop);

    // Heavy wooden table legs (4 corners)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x18100c, roughness: 0.7 });
    const legPositions = [
      [-0.95, -0.6, -0.75],
      [1.35, -0.6, -0.75],
      [-0.95, -0.6, 0.75],
      [1.35, -0.6, 0.75],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.1), legMat);
      leg.position.set(lx, ly, lz);
      benchGroup.add(leg);
    });

    // ----------------------------------------------------
    // 3D METROLOGY INSTRUMENTS ON BENCH (Clickable!)
    // ----------------------------------------------------
    const interactiveObjects: THREE.Object3D[] = [];

    // Instrument A: 3D Micrometer Screw Gauge (sitting on right of bench)
    const micrometerGroup = new THREE.Group();
    micrometerGroup.position.set(0.65, 0.015, 0.45);
    micrometerGroup.rotation.y = -Math.PI / 5;
    micrometerGroup.name = 'screwGauge';
    benchGroup.add(micrometerGroup);
    interactiveObjects.push(micrometerGroup);

    // U-Frame (cast steel)
    const uFrameGeom = new THREE.TorusGeometry(0.045, 0.012, 16, 24, Math.PI);
    const uFrame = new THREE.Mesh(uFrameGeom, castIronMat);
    uFrame.rotation.z = Math.PI / 2;
    uFrame.position.set(0, 0.012, 0);
    micrometerGroup.add(uFrame);

    // Anvil & Spindle
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 16), brushedChromeMat);
    spindle.rotation.z = Math.PI / 2;
    spindle.position.set(-0.01, 0.045, 0);
    micrometerGroup.add(spindle);

    // Sleeve / Barrel & Thimble
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.065, 16), brushedChromeMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.05, 0.045, 0);
    micrometerGroup.add(barrel);

    const thimble = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.055, 16), castIronMat);
    thimble.rotation.z = Math.PI / 2;
    thimble.position.set(0.09, 0.045, 0);
    micrometerGroup.add(thimble);

    const ratchet = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.02, 16), polishedBrassMat);
    ratchet.rotation.z = Math.PI / 2;
    ratchet.position.set(0.125, 0.045, 0);
    micrometerGroup.add(ratchet);

    // Instrument B: 3D Vernier Caliper (resting next to stand)
    const vernierGroup = new THREE.Group();
    vernierGroup.position.set(0.68, 0.008, -0.4);
    vernierGroup.rotation.y = Math.PI / 4;
    vernierGroup.name = 'vernier';
    benchGroup.add(vernierGroup);
    interactiveObjects.push(vernierGroup);

    // Main steel beam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.004, 0.022), brushedChromeMat);
    vernierGroup.add(beam);

    // Fixed jaw
    const fixedJaw = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.005, 0.07), brushedChromeMat);
    fixedJaw.position.set(-0.12, 0, 0.03);
    vernierGroup.add(fixedJaw);

    // Sliding vernier slider
    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.075), castIronMat);
    slider.position.set(0.02, 0.002, 0.025);
    vernierGroup.add(slider);

    // Instrument C: 3D Digital Laboratory Timer / Photogate Display Box
    const timerBoxGroup = new THREE.Group();
    timerBoxGroup.position.set(-0.68, 0.05, 0.45);
    timerBoxGroup.rotation.y = Math.PI / 6;
    benchGroup.add(timerBoxGroup);

    // Timer chassis
    const timerChassis = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.1, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 })
    );
    timerBoxGroup.add(timerChassis);

    // Glowing 7-segment digital screen
    const timerScreenMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const timerScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.06),
      timerScreenMat
    );
    timerScreen.rotation.x = -Math.PI / 6;
    timerScreen.position.set(0, 0.04, 0.082);
    timerBoxGroup.add(timerScreen);

    // Status LED indicator on timer box
    const timerLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    timerLed.position.set(0.08, 0.04, 0.07);
    timerBoxGroup.add(timerLed);

    // ----------------------------------------------------
    // 2. HEAVY CAST-IRON STAND & TRIPOD BASE
    // ----------------------------------------------------
    const apparatusGroup = new THREE.Group();
    scene.add(apparatusGroup);

    // Sturdy Cast Iron Tripod Base (Hammertone green/black finish)
    const baseCast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.52, 0.065, 36),
      castIronMat
    );
    baseCast.position.set(-0.12, 0.033, 0);
    baseCast.receiveShadow = !isSoftwareGl;
    apparatusGroup.add(baseCast);

    // Contact shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(-0.1, 0.002, 0);
    apparatusGroup.add(shadowPlane);

    // Circular Spirit Bubble Level (mounted directly on base!)
    const spiritLevelGroup = new THREE.Group();
    spiritLevelGroup.position.set(-0.35, 0.068, 0.16);
    apparatusGroup.add(spiritLevelGroup);

    const spiritBody = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 24), polishedBrassMat);
    spiritLevelGroup.add(spiritBody);

    const spiritGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.014, 24),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 })
    );
    spiritGlass.position.y = 0.002;
    spiritLevelGroup.add(spiritGlass);

    // Centered bubble
    const spiritBubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.005, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    spiritBubble.position.set(0, 0.008, 0);
    spiritLevelGroup.add(spiritBubble);

    // Leveling Screws (3 knurled brass feet with threading)
    const feetPositions = [
      [-0.48, 0.02, 0],
      [0.15, 0.02, 0.32],
      [0.15, 0.02, -0.32],
    ];
    feetPositions.forEach(([fx, fy, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.04, 16), polishedBrassMat);
      foot.position.set(fx, fy, fz);
      apparatusGroup.add(foot);
    });

    // Pillar mounting collar/socket clamping the vertical rod
    const pillarSocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.052, 0.09, 24),
      polishedBrassMat
    );
    pillarSocket.position.set(-0.25, 0.075, 0);
    apparatusGroup.add(pillarSocket);

    // Cross-locking T-bar handle screw on socket
    const tScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 12), brushedChromeMat);
    tScrew.rotation.z = Math.PI / 2;
    tScrew.position.set(-0.31, 0.075, 0);
    apparatusGroup.add(tScrew);

    // ----------------------------------------------------
    // 3. VERTICAL PILLAR & RIGID UPPER ARM
    // ----------------------------------------------------
    const pillarHeight = 2.2;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, pillarHeight, 32),
      brushedChromeMat
    );
    pillar.position.set(-0.25, pillarHeight / 2 + 0.04, 0);
    pillar.castShadow = !isSoftwareGl;
    pillar.receiveShadow = !isSoftwareGl;
    apparatusGroup.add(pillar);

    // Graduated Millimeter Ruler on Pillar
    const rulerPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 1.6, 0.045),
      new THREE.MeshStandardMaterial({
        map: rulerTexture,
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    rulerPlate.position.set(-0.21, 1.15, 0);
    rulerPlate.rotation.y = Math.PI / 2;
    apparatusGroup.add(rulerPlate);

    // Top Rigid Horizontal Support Bracket & Split-Chuck
    const topArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 0.06),
      castIronMat
    );
    topArm.position.set(-0.1, 2.05, 0);
    topArm.castShadow = !isSoftwareGl;
    apparatusGroup.add(topArm);

    // Top Split Chuck (Pin-Vice collet)
    const topChuck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.08, 24),
      polishedBrassMat
    );
    topChuck.position.set(0, 1.98, 0);
    topChuck.castShadow = !isSoftwareGl;
    apparatusGroup.add(topChuck);

    // Dual Knurled Clamping Screws on Chuck
    const clampScrew1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.08, 16), brushedChromeMat);
    clampScrew1.rotation.z = Math.PI / 2;
    clampScrew1.position.set(0, 1.98, 0);
    apparatusGroup.add(clampScrew1);

    // ----------------------------------------------------
    // 4. MULTI-SEGMENT SUSPENSION WIRE WITH VISIBLE TWIST
    // ----------------------------------------------------
    const wireTopY = 1.94;
    // Create cylinder with 32 vertical height segments so we can twist it elastically
    const wireSegments = 32;
    const wireGeom = new THREE.CylinderGeometry(0.0035, 0.0035, 1.0, 16, wireSegments);
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    wireMesh.castShadow = !isSoftwareGl;
    apparatusGroup.add(wireMesh);

    // Store original vertex X/Z coordinates to compute proportional torsion twist
    const posAttr = wireGeom.attributes.position;
    const origPositions = new Float32Array(posAttr.array);

    // ----------------------------------------------------
    // 5. SUSPENDED INERTIA FLYWHEEL DISC ASSEMBLY
    // ----------------------------------------------------
    const rotatingGroup = new THREE.Group();
    apparatusGroup.add(rotatingGroup);

    // Lower Chuck on disc
    const lowerChuck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.07, 24),
      polishedBrassMat
    );
    lowerChuck.position.y = 0.035;
    lowerChuck.castShadow = !isSoftwareGl;
    rotatingGroup.add(lowerChuck);

    // Inertia Disc Flywheel
    const discHeight = 0.028;
    const discSideMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.88,
    });
    const discFaceMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.24,
      metalness: 0.65,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const discMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, discHeight, 64),
      [discSideMat, discFaceMat, discSideMat]
    );
    discMesh.castShadow = !isSoftwareGl;
    discMesh.receiveShadow = !isSoftwareGl;
    rotatingGroup.add(discMesh);

    // Perimeter Reference Index Pointer Mark
    const pointerMark = new THREE.Mesh(
      new THREE.ConeGeometry(0.014, 0.035, 12),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    pointerMark.rotation.z = -Math.PI / 2;
    pointerMark.position.set(0.36, 0.012, 0);
    rotatingGroup.add(pointerMark);

    // Infrared optical flag interrupting the photogate
    const opticalFlag = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, 0.024, 0.015),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    opticalFlag.position.set(0.355, 0.01, 0);
    rotatingGroup.add(opticalFlag);

    // ----------------------------------------------------
    // SEARLE'S AUXILIARY CYLINDRICAL WEIGHTS (Removable)
    // ----------------------------------------------------
    const auxWeightGroup = new THREE.Group();
    rotatingGroup.add(auxWeightGroup);

    const auxMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Solid brass
      roughness: 0.25,
      metalness: 0.85,
    });

    // Mass 1 (right)
    const auxCylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 24), auxMat);
    auxCylinder1.position.set(0.2, discHeight / 2 + 0.025, 0);
    auxCylinder1.castShadow = !isSoftwareGl;
    auxWeightGroup.add(auxCylinder1);

    // Mass 2 (left, symmetrical)
    const auxCylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 24), auxMat);
    auxCylinder2.position.set(-0.2, discHeight / 2 + 0.025, 0);
    auxCylinder2.castShadow = !isSoftwareGl;
    auxWeightGroup.add(auxCylinder2);

    // ----------------------------------------------------
    // 6. OPTICAL LASER PHOTOGATE SENSOR AT EQUILIBRIUM
    // ----------------------------------------------------
    const photogateGroup = new THREE.Group();
    apparatusGroup.add(photogateGroup);

    // Photogate mounting stand & U-shaped sensor head
    const photogateHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.04, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    photogateGroup.add(photogateHead);

    // Infrared beam visual line
    const laserBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.001, 0.03, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8 })
    );
    laserBeam.position.set(0, 0, 0);
    photogateGroup.add(laserBeam);

    // Active beam status LED
    const photogateLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.005, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    photogateLed.position.set(0, 0.022, 0);
    photogateGroup.add(photogateLed);

    // Fixed Acrylic Protractor Reference Ring
    const fixedScaleRing = new THREE.Mesh(
      new THREE.RingGeometry(0.37, 0.46, 64),
      new THREE.MeshBasicMaterial({
        map: protractorTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    fixedScaleRing.rotation.x = -Math.PI / 2;
    apparatusGroup.add(fixedScaleRing);

    // Fixed Station Reference Needle Pointer
    const fixedNeedleArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.008, 0.008),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.8 })
    );
    fixedNeedleArm.position.set(0.48, 0.015, 0);
    apparatusGroup.add(fixedNeedleArm);

    const needleTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.01, 0.025, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    needleTip.rotation.z = Math.PI / 2;
    needleTip.position.set(0.42, 0.015, 0);
    apparatusGroup.add(needleTip);

    // ----------------------------------------------------
    // INTERACTION (Raycasting on Disc & Bench Instruments)
    // ----------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersection = new THREE.Vector3();
    let isUserDragging = false;
    let lastAudioAngle = 0;

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check click on bench instruments
      const hitTool = raycaster.intersectObjects(interactiveObjects, true);
      if (hitTool.length > 0) {
        let parent: THREE.Object3D | null = hitTool[0].object;
        while (parent && !parent.name && parent.parent) {
          parent = parent.parent;
        }
        if (parent && (parent.name === 'screwGauge' || parent.name === 'vernier')) {
          propsRef.current.onOpenInstrumentModal?.(parent.name as 'screwGauge' | 'vernier');
          return;
        }
      }

      // Check click on flywheel disc
      const intersects = raycaster.intersectObject(discMesh);
      if (intersects.length > 0) {
        isUserDragging = true;
        controls.enabled = false;
        propsRef.current.onDiscDragStart?.();
        dragPlane.constant = -rotatingGroup.position.y;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isUserDragging) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
        const angle = Math.atan2(planeIntersection.z, planeIntersection.x);
        propsRef.current.onDiscDragChange?.(angle);

        if (propsRef.current.soundEnabled) {
          if (Math.abs(angle - lastAudioAngle) > (5 * Math.PI) / 180) {
            playRatchetSound(0.08);
            lastAudioAngle = angle;
          }
        }
      }
    };

    const onPointerUp = () => {
      if (isUserDragging) {
        isUserDragging = false;
        controls.enabled = true;
        propsRef.current.onDiscDragEnd?.();
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // ANIMATION & KINEMATICS LOOP
    // ----------------------------------------------------
    let frameId = 0;
    const targetCameraPos = new THREE.Vector3(2.2, 1.8, 2.7);
    const targetLookAt = new THREE.Vector3(0, 0.85, 0);

    let isCameraTransitioning = false;
    let lastPreset = propsRef.current.cameraPreset;

    controls.addEventListener('start', () => {
      isCameraTransitioning = false;
    });

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const {
        currentAngle: angle,
        wireLength: length,
        wireRadius: radius,
        discRadius: dRadius,
        wireColorHex: colorHex,
        cameraPreset: preset,
        showDegreeRing: showRing,
        auxiliaryMasses: aux,
        releaseMode: mode,
        wobbleIntensity: wobble,
      } = propsRef.current;

      const discY = Math.max(wireTopY - length, 0.2);
      const visualWireLen = wireTopY - discY;

      // 1. Wire Mesh position & physical elastic torsion twist
      wireMesh.position.set(0, wireTopY - visualWireLen / 2, 0);
      wireMesh.scale.set(
        Math.max(radius / 0.0006, 0.6),
        visualWireLen,
        Math.max(radius / 0.0006, 0.6)
      );
      wireMat.color.setStyle(colorHex);

      // Procedural vertex twist along height segments:
      // Twist increases linearly from 0 at top (y = 0.5 in local cylinder space) to angle at bottom (y = -0.5)
      const currentPos = wireGeom.attributes.position;
      for (let i = 0; i < currentPos.count; i++) {
        const origX = origPositions[i * 3];
        const origY = origPositions[i * 3 + 1];
        const origZ = origPositions[i * 3 + 2];

        // Fraction: 0 at top (+0.5), 1 at bottom (-0.5)
        const frac = 0.5 - origY;
        const segmentAngle = angle * frac;

        const cosA = Math.cos(segmentAngle);
        const sinA = Math.sin(segmentAngle);

        currentPos.setX(i, origX * cosA - origZ * sinA);
        currentPos.setZ(i, origX * sinA + origZ * cosA);
      }
      currentPos.needsUpdate = true;

      // 2. Flywheel Disc position & scale
      rotatingGroup.position.set(0, discY, 0);
      const discVisualScale = dRadius / 0.10;
      discMesh.scale.set(discVisualScale, 1, discVisualScale);
      pointerMark.position.x = 0.36 * discVisualScale;
      opticalFlag.position.x = 0.355 * discVisualScale;

      // 3. Searle's Auxiliary Masses Visibility and Radial Position
      auxWeightGroup.visible = aux.enabled;
      if (aux.enabled) {
        // Distance d from center (clamped to disc radius)
        const d = Math.min(aux.distanceFromAxis, dRadius * 0.9);
        const visualD = (d / 0.10) * 0.35;
        auxCylinder1.position.x = visualD;
        auxCylinder2.position.x = -visualD;
      }

      // 4. Fixed scale ring & needle pointer
      fixedScaleRing.visible = showRing;
      fixedScaleRing.position.set(0, discY - discHeight / 2 - 0.005, 0);
      fixedScaleRing.scale.set(discVisualScale, discVisualScale, 1);
      fixedNeedleArm.position.set(0.48 * discVisualScale, discY, 0);
      needleTip.position.set(0.42 * discVisualScale, discY, 0);

      // 5. Optical Photogate positioning and LED pulse at equilibrium
      photogateGroup.position.set(0.355 * discVisualScale, discY, 0);
      const isBeamInterrupted = Math.abs(angle % (Math.PI * 2)) < (3 * Math.PI) / 180;
      (photogateLed.material as THREE.MeshBasicMaterial).color.setHex(
        isBeamInterrupted ? 0xef4444 : 0x22c55e
      );
      (timerLed.material as THREE.MeshBasicMaterial).color.setHex(
        isBeamInterrupted ? 0xef4444 : 0x22c55e
      );

      // 6. Disc Rotation with Imperfect Hand Wobble Coupling
      if (mode === 'hand' && wobble > 0) {
        // Subtle coupled pendular wobble (tilt in X and Z)
        const wobbleAngle = wobble * Math.sin(now * 0.004) * 0.025;
        rotatingGroup.rotation.x = wobbleAngle;
        rotatingGroup.rotation.z = wobbleAngle * 0.5;
      } else {
        rotatingGroup.rotation.x = 0;
        rotatingGroup.rotation.z = 0;
      }
      rotatingGroup.rotation.y = angle;

      // 7. Camera Preset Transitions
      if (preset !== lastPreset) {
        lastPreset = preset;
        isCameraTransitioning = true;
      }

      if (preset === 'front') {
        targetCameraPos.set(0, 1.2, 3.2);
        targetLookAt.set(0, 1.0, 0);
      } else if (preset === 'closeup') {
        targetCameraPos.set(0.55, discY + 0.4, 0.75);
        targetLookAt.set(0, discY, 0);
      } else if (preset === 'top') {
        targetCameraPos.set(0.01, discY + 2.3, 0);
        targetLookAt.set(0, discY, 0);
      } else if (preset === 'bench') {
        // Close-up on the workbench metrology tools
        targetCameraPos.set(0.9, 0.45, 0.85);
        targetLookAt.set(0.4, 0.1, 0);
      } else {
        // Perspective default
        targetCameraPos.set(2.2, 1.8, 2.7);
        targetLookAt.set(0, 0.85, 0);
      }

      if (isCameraTransitioning && !isUserDragging) {
        camera.position.lerp(targetCameraPos, Math.min(dt * 3.5, 0.2));
        controls.target.lerp(targetLookAt, Math.min(dt * 3.5, 0.2));
        if (camera.position.distanceTo(targetCameraPos) < 0.02) {
          isCameraTransitioning = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      renderer.dispose();
      controls.dispose();
      woodTexture.dispose();
      wireTwistTexture.dispose();
      dialTexture.dispose();
      protractorTexture.dispose();
      rulerTexture.dispose();
      shadowTexture.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden"
      data-testid="torsional-canvas"
    />
  );
};
