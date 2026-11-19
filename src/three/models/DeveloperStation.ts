import * as THREE from 'three';
import {
  createLiveCodeTexture,
  createVerticalTerminalTexture,
  createRadialContactShadowTexture,
  createCarbonFiberTexture
} from '../proceduralTextures';
import { KeyboardSwitchType, ScreenTerminalMode, StickyNote } from '../../types/portfolio';
import { STICKY_NOTES_DATA } from '../../data/portfolioData';
import {
  mapCharToKeyboardKey,
  calculateVaporParticle,
  calculateSucculentMotion,
  calculateLeafFlex
} from '../../utils/portfolioLogic';
import { soundManager } from '../../audio/soundEffects';

export interface DeveloperStationComponents {
  group: THREE.Group;
  update: (delta: number, time: number) => void;
  setExploded: (progress: number) => void;
  interactiveObjects: THREE.Object3D[];
  onProjectClick?: (projectId: string) => void;
  triggerKeyPress: (char?: string) => void;
  cycleScreenMode: () => ScreenTerminalMode;
  setScreenMode: (mode: ScreenTerminalMode) => void;
  getScreenMode: () => ScreenTerminalMode;
  setSwitchType: (type: KeyboardSwitchType) => void;
  getSwitchType: () => KeyboardSwitchType;
  puffCoffeeSteam: () => void;
  nudgeSucculent: () => void;
  setHoveredNoteId?: (id: string | null) => void;
  cleanup: () => void;
}

export function createDeveloperStation(
  renderer?: THREE.WebGLRenderer,
  onProjectClick?: (projectId: string) => void
): DeveloperStationComponents {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'DeveloperStationRoot';

  const interactiveObjects: THREE.Object3D[] = [];

  // Procedural Textures
  const codeScreen = createLiveCodeTexture(renderer);
  const verticalScreen = createVerticalTerminalTexture(renderer);
  const contactShadowTex = createRadialContactShadowTexture();
  const carbonTex = createCarbonFiberTexture();

  // Common Reusable Materials (PBR calibrated)
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x181a20,
    roughness: 0.6,
    metalness: 0.2,
    map: carbonTex
  });

  const legSteelMat = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.3,
    metalness: 0.85
  });

  const monitorBezelMat = new THREE.MeshStandardMaterial({
    color: 0x0f1115,
    roughness: 0.35,
    metalness: 0.4
  });

  const standArmMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.25,
    metalness: 0.9
  });

  const primaryScreenMat = new THREE.MeshStandardMaterial({
    map: codeScreen.texture,
    roughness: 0.18,
    metalness: 0.05,
    emissive: 0x1e293b,
    emissiveIntensity: 0.35
  });

  const verticalScreenMat = new THREE.MeshStandardMaterial({
    map: verticalScreen.texture,
    roughness: 0.18,
    metalness: 0.05,
    emissive: 0x0f172a,
    emissiveIntensity: 0.4
  });

  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.85
  });

  const keycapDarkMat = new THREE.MeshStandardMaterial({
    color: 0x1e222d,
    roughness: 0.4,
    metalness: 0.1
  });

  const keycapAccentMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.2,
    emissive: 0x0284c7,
    emissiveIntensity: 0.2
  });

  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.15,
    metalness: 0.05
  });

  const coffeeMat = new THREE.MeshStandardMaterial({
    color: 0x261408,
    roughness: 0.25,
    metalness: 0.1
  });

  const serverChassisMat = new THREE.MeshStandardMaterial({
    color: 0x11141c,
    roughness: 0.3,
    metalness: 0.7
  });

  const glowingLedCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const glowingLedEmerald = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const glowingLedAmber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

  // -------------------------------------------------------------
  // 1. DESK & GROUNDING CONTACT SHADOW
  // -------------------------------------------------------------
  const deskGroup = new THREE.Group();
  deskGroup.name = 'DeskAssembly';

  // Soft contact shadow base
  const shadowGeo = new THREE.PlaneGeometry(6.2, 4.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: contactShadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0, 0.01, 0);
  rootGroup.add(shadowPlane);

  // Desk surface (chamfered multi-part desk)
  const deskTopGeo = new THREE.BoxGeometry(4.0, 0.09, 2.0);
  const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
  deskTop.position.set(0, 0.95, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  // Desk chamfered front ergonomic rest
  const restGeo = new THREE.BoxGeometry(3.6, 0.03, 0.18);
  const restMat = new THREE.MeshStandardMaterial({
    color: 0x0d0f14,
    roughness: 0.8,
    metalness: 0.1
  });
  const rest = new THREE.Mesh(restGeo, restMat);
  rest.position.set(0, 0.97, 0.85);
  deskGroup.add(rest);

  // Modern dual T-frame motorized legs
  const legPositions = [
    [-1.6, 0.47, 0],
    [1.6, 0.47, 0]
  ];
  legPositions.forEach(([lx, ly, lz]) => {
    // Vertical column
    const colGeo = new THREE.BoxGeometry(0.12, 0.95, 0.16);
    const col = new THREE.Mesh(colGeo, legSteelMat);
    col.position.set(lx, ly, lz);
    col.castShadow = true;
    deskGroup.add(col);

    // Floor foot base
    const footGeo = new THREE.BoxGeometry(0.16, 0.04, 1.4);
    const foot = new THREE.Mesh(footGeo, legSteelMat);
    foot.position.set(lx, 0.02, lz);
    foot.castShadow = true;
    deskGroup.add(foot);

    // Top bracket
    const bracketGeo = new THREE.BoxGeometry(0.16, 0.04, 1.2);
    const bracket = new THREE.Mesh(bracketGeo, legSteelMat);
    bracket.position.set(lx, 0.92, lz);
    deskGroup.add(bracket);
  });

  // Cable management tray under desk
  const cableTrayGeo = new THREE.BoxGeometry(2.8, 0.12, 0.35);
  const cableTray = new THREE.Mesh(cableTrayGeo, legSteelMat);
  cableTray.position.set(0, 0.85, -0.4);
  deskGroup.add(cableTray);

  rootGroup.add(deskGroup);

  // -------------------------------------------------------------
  // 2. CURVED PRIMARY DISPLAY & DUAL ARTICULATED ARM
  // -------------------------------------------------------------
  const monitorGroup = new THREE.Group();
  monitorGroup.name = 'MonitorAssembly';

  // Desk clamp base
  const clampGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 24);
  const clamp = new THREE.Mesh(clampGeo, standArmMat);
  clamp.position.set(0, 0.99, -0.65);
  clamp.castShadow = true;
  monitorGroup.add(clamp);

  // Vertical pole
  const poleGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.72, 20);
  const pole = new THREE.Mesh(poleGeo, standArmMat);
  pole.position.set(0, 1.36, -0.65);
  pole.castShadow = true;
  monitorGroup.add(pole);

  // Horizontal articulated arm extension connecting pole to screen
  const arm1Geo = new THREE.BoxGeometry(0.045, 0.04, 0.42);
  const arm1 = new THREE.Mesh(arm1Geo, standArmMat);
  arm1.position.set(0, 1.58, -0.44);
  arm1.castShadow = true;
  monitorGroup.add(arm1);

  // VESA Mount bracket plate
  const vesaGeo = new THREE.BoxGeometry(0.14, 0.14, 0.025);
  const vesa = new THREE.Mesh(vesaGeo, standArmMat);
  vesa.position.set(0, 1.62, -0.24);
  monitorGroup.add(vesa);

  // Primary Ultra-wide 34" Curved Screen Group
  const mainScreenGroup = new THREE.Group();
  mainScreenGroup.position.set(0, 1.62, -0.22);

  // Screen housing back chassis (curved)
  const bezelWidth = 1.58;
  const bezelHeight = 0.76;
  const screenSegs = 32;

  // Curved chassis back panel
  const backGeo = new THREE.PlaneGeometry(bezelWidth, bezelHeight, screenSegs, 1);
  const backPos = backGeo.attributes.position;
  for (let i = 0; i < backPos.count; i++) {
    const x = backPos.getX(i);
    backPos.setZ(i, (x * x) * 0.08 - 0.02);
  }
  backGeo.computeVertexNormals();
  const backMesh = new THREE.Mesh(backGeo, monitorBezelMat);
  backMesh.rotation.y = Math.PI; // facing backwards
  backMesh.castShadow = true;
  mainScreenGroup.add(backMesh);

  // Screen display surface (gently curved inward towards user)
  const screenDisplayGeo = new THREE.PlaneGeometry(bezelWidth - 0.04, bezelHeight - 0.04, screenSegs, 1);
  const dispPos = screenDisplayGeo.attributes.position;
  for (let i = 0; i < dispPos.count; i++) {
    const x = dispPos.getX(i);
    dispPos.setZ(i, (x * x) * 0.08);
  }
  screenDisplayGeo.computeVertexNormals();

  const screenMesh = new THREE.Mesh(screenDisplayGeo, primaryScreenMat);
  screenMesh.name = 'CurvedMonitorDisplay';
  screenMesh.position.set(0, 0, 0.002);
  screenMesh.castShadow = false;
  screenMesh.receiveShadow = true;
  screenMesh.userData = { interactiveType: 'screen' };
  interactiveObjects.push(screenMesh);
  mainScreenGroup.add(screenMesh);

  // Monitor accent RGB backlight bar on the rear
  const lightBarGeo = new THREE.BoxGeometry(1.2, 0.025, 0.02);
  const lightBarMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
  lightBar.position.set(0, 0, -0.03);
  mainScreenGroup.add(lightBar);

  monitorGroup.add(mainScreenGroup);

  // -------------------------------------------------------------
  // 3. SECONDARY VERTICAL DISPLAY (PORTRAIT MONITOR)
  // -------------------------------------------------------------
  const verticalScreenGroup = new THREE.Group();
  verticalScreenGroup.position.set(1.18, 1.64, -0.16);
  verticalScreenGroup.rotation.y = -0.38; // angled inward towards developer

  // Bezel
  const vBezelGeo = new THREE.BoxGeometry(0.64, 1.08, 0.035);
  const vBezel = new THREE.Mesh(vBezelGeo, monitorBezelMat);
  vBezel.castShadow = true;
  verticalScreenGroup.add(vBezel);

  // Screen
  const vScreenGeo = new THREE.PlaneGeometry(0.60, 1.04);
  const vScreen = new THREE.Mesh(vScreenGeo, verticalScreenMat);
  vScreen.position.set(0, 0, 0.02);
  verticalScreenGroup.add(vScreen);

  // Articulated Arm connection to main pole
  const vArmGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.38);
  const vArm = new THREE.Mesh(vArmGeo, standArmMat);
  vArm.rotation.z = Math.PI / 2;
  vArm.position.set(-0.25, 0, -0.1);
  verticalScreenGroup.add(vArm);

  monitorGroup.add(verticalScreenGroup);
  rootGroup.add(monitorGroup);

  // -------------------------------------------------------------
  // 4. MECHANICAL KEYBOARD & MOUSE
  // -------------------------------------------------------------
  const inputGroup = new THREE.Group();
  inputGroup.name = 'InputAssembly';
  inputGroup.position.set(-0.15, 1.0, 0.35);

  // Keyboard Desk Mat
  const deskMatGeo = new THREE.BoxGeometry(1.8, 0.008, 0.8);
  const deskMatMesh = new THREE.Mesh(
    deskMatGeo,
    new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.9,
      metalness: 0.05
    })
  );
  deskMatMesh.position.set(0.15, 0, 0.05);
  deskMatMesh.receiveShadow = true;
  inputGroup.add(deskMatMesh);

  // Mechanical Keyboard Case (75% aluminum beveled case)
  const kbGroup = new THREE.Group();
  kbGroup.position.set(-0.18, 0.015, 0.08);

  const kbCaseGeo = new THREE.BoxGeometry(0.85, 0.035, 0.32);
  const kbCase = new THREE.Mesh(kbCaseGeo, aluminumMat);
  kbCase.castShadow = true;
  kbCase.userData = { interactiveType: 'keyboard' };
  interactiveObjects.push(kbCase);
  kbGroup.add(kbCase);

  // RGB diffuser strip along the keyboard front
  const rgbStripGeo = new THREE.BoxGeometry(0.82, 0.008, 0.01);
  const rgbStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const rgbStrip = new THREE.Mesh(rgbStripGeo, rgbStripMat);
  rgbStrip.position.set(0, 0.01, 0.16);
  kbGroup.add(rgbStrip);

  // Procedural Keycaps Matrix (grouped rows for performance)
  const rows = 5;
  const cols = 14;
  const keyWidth = 0.05;
  const keyDepth = 0.05;
  const keyHeight = 0.02;

  const keyGeo = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
  const totalKeys = rows * cols;
  const keyInstMesh = new THREE.InstancedMesh(keyGeo, keycapDarkMat, totalKeys);
  keyInstMesh.castShadow = true;
  keyInstMesh.userData = { interactiveType: 'keyboard' };
  interactiveObjects.push(keyInstMesh);

  // Interactive mechanical keycap depress and RGB ripple states
  let currentSwitchType: KeyboardSwitchType = 'blue';
  const baseKeyPositions: Array<{ x: number; y: number; z: number }> = [];
  const baseKeyColors: THREE.Color[] = [];
  const keyDepressOffsets = new Float32Array(totalKeys);

  interface KeyboardRipple {
    originR: number;
    originC: number;
    startTime: number;
    color: THREE.Color;
  }
  const activeRipples: KeyboardRipple[] = [];

  const dummy = new THREE.Object3D();
  let keyIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const kx = (c - cols / 2 + 0.5) * (keyWidth + 0.008);
      const kz = (r - rows / 2 + 0.5) * (keyDepth + 0.008);
      const ky = 0.025;

      baseKeyPositions.push({ x: kx, y: ky, z: kz });

      dummy.position.set(kx, ky, kz);
      dummy.rotation.x = -0.05; // slight ergonomic tilt
      dummy.updateMatrix();
      keyInstMesh.setMatrixAt(keyIndex, dummy.matrix);

      // Color accent keys (Enter, Esc, Space, Arrows)
      const isAccent =
        (r === 0 && c === 0) || // Esc
        (r === 2 && c === cols - 1) || // Enter
        (r === 4 && (c >= 4 && c <= 8)); // Space
      const baseCol = isAccent ? new THREE.Color(0x38bdf8) : new THREE.Color(0x1e222d);
      baseKeyColors.push(baseCol);
      keyInstMesh.setColorAt(keyIndex, baseCol);

      keyIndex++;
    }
  }
  keyInstMesh.instanceMatrix.needsUpdate = true;
  if (keyInstMesh.instanceColor) keyInstMesh.instanceColor.needsUpdate = true;
  kbGroup.add(keyInstMesh);

  // Coiled keyboard custom aviator cable
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.015, -0.15),
    new THREE.Vector3(-0.35, 0.015, -0.35),
    new THREE.Vector3(-0.25, 0.015, -0.45),
    new THREE.Vector3(0, 0.015, -0.55)
  ]);
  const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.008, 8, false);
  const cableMesh = new THREE.Mesh(cableGeo, standArmMat);
  kbGroup.add(cableMesh);

  inputGroup.add(kbGroup);

  // Ergonomic Wireless Mouse
  const mouseGroup = new THREE.Group();
  mouseGroup.position.set(0.58, 0.02, 0.1);

  const mouseBodyGeo = new THREE.SphereGeometry(0.065, 16, 12);
  mouseBodyGeo.scale(0.85, 0.5, 1.4);
  const mouseBody = new THREE.Mesh(mouseBodyGeo, aluminumMat);
  mouseBody.position.set(0, 0.015, 0);
  mouseBody.castShadow = true;
  mouseBody.userData = { interactiveType: 'keyboard' };
  interactiveObjects.push(mouseBody);
  mouseGroup.add(mouseBody);

  // Mouse wheel
  const wheelGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12);
  const wheel = new THREE.Mesh(wheelGeo, keycapAccentMat);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(0, 0.038, -0.035);
  mouseGroup.add(wheel);

  inputGroup.add(mouseGroup);
  rootGroup.add(inputGroup);

  // -------------------------------------------------------------
  // 5. DEVELOPER LAPTOP (OPEN ON ANGLED ALUMINUM STAND)
  // -------------------------------------------------------------
  const laptopGroup = new THREE.Group();
  laptopGroup.name = 'LaptopAssembly';
  laptopGroup.position.set(-1.42, 1.0, 0.08);
  laptopGroup.rotation.y = 0.45; // Angled inward towards developer

  // Stand base & arms
  const standBaseGeo = new THREE.BoxGeometry(0.35, 0.02, 0.32);
  const standBase = new THREE.Mesh(standBaseGeo, aluminumMat);
  standBase.position.set(0, 0.01, 0);
  laptopGroup.add(standBase);

  const riserGeo = new THREE.BoxGeometry(0.04, 0.16, 0.22);
  const riser = new THREE.Mesh(riserGeo, aluminumMat);
  riser.position.set(0, 0.08, -0.06);
  riser.rotation.x = -0.3;
  laptopGroup.add(riser);

  // Laptop Base chassis
  const laptopBaseGeo = new THREE.BoxGeometry(0.55, 0.016, 0.38);
  const laptopBase = new THREE.Mesh(laptopBaseGeo, aluminumMat);
  laptopBase.position.set(0, 0.16, 0.02);
  laptopBase.rotation.x = 0.24; // inclined
  laptopBase.castShadow = true;
  laptopGroup.add(laptopBase);

  // Laptop Trackpad
  const trackpadGeo = new THREE.PlaneGeometry(0.18, 0.11);
  const trackpadMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.2,
    metalness: 0.8
  });
  const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
  trackpad.rotation.x = -Math.PI / 2;
  trackpad.position.set(0, 0.009, 0.11);
  laptopBase.add(trackpad);

  // Laptop keyboard recess
  const kbRecessGeo = new THREE.PlaneGeometry(0.48, 0.2);
  const kbRecess = new THREE.Mesh(kbRecessGeo, keycapDarkMat);
  kbRecess.rotation.x = -Math.PI / 2;
  kbRecess.position.set(0, 0.009, -0.05);
  laptopBase.add(kbRecess);

  // Laptop Display Lid (open at ~115 degrees)
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.008, -0.19);
  lidGroup.rotation.x = -1.75; // opened back

  const lidGeo = new THREE.BoxGeometry(0.55, 0.012, 0.38);
  const lid = new THREE.Mesh(lidGeo, aluminumMat);
  lid.position.set(0, 0, 0.19);
  lid.castShadow = true;
  lidGroup.add(lid);

  // Laptop Screen
  const lScreenGeo = new THREE.PlaneGeometry(0.51, 0.34);
  const lScreenMat = new THREE.MeshBasicMaterial({
    map: codeScreen.texture
  });
  const lScreen = new THREE.Mesh(lScreenGeo, lScreenMat);
  lScreen.rotation.x = Math.PI / 2;
  lScreen.position.set(0, -0.007, 0.19);
  lidGroup.add(lScreen);

  laptopBase.add(lidGroup);
  rootGroup.add(laptopGroup);

  // -------------------------------------------------------------
  // 6. HIGH-DENSITY SERVER TOWER & CLOUD RACK
  // -------------------------------------------------------------
  const serverGroup = new THREE.Group();
  serverGroup.name = 'ServerTowerAssembly';
  serverGroup.position.set(1.55, 0.58, -0.65);

  // Main server chassis
  const chassisGeo = new THREE.BoxGeometry(0.52, 1.15, 0.75);
  const chassis = new THREE.Mesh(chassisGeo, serverChassisMat);
  chassis.castShadow = true;
  serverGroup.add(chassis);

  // Front ventilated mesh grille
  const grilleGeo = new THREE.PlaneGeometry(0.48, 1.08);
  const grilleMat = new THREE.MeshStandardMaterial({
    color: 0x090b0e,
    roughness: 0.8,
    metalness: 0.4
  });
  const grille = new THREE.Mesh(grilleGeo, grilleMat);
  grille.position.set(0, 0, 0.376);
  serverGroup.add(grille);

  // Hot-swappable Drive bays (4 bays with status LEDs)
  for (let b = 0; b < 4; b++) {
    const bayGeo = new THREE.BoxGeometry(0.42, 0.12, 0.02);
    const bay = new THREE.Mesh(bayGeo, standArmMat);
    bay.position.set(0, 0.32 - b * 0.16, 0.38);
    serverGroup.add(bay);

    // Status LED
    const ledGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const ledMat = b === 2 ? glowingLedAmber : glowingLedEmerald;
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.18, 0.32 - b * 0.16, 0.395);
    serverGroup.add(led);
  }

  // Glowing fiber optic tubes emerging from top into desk cable tray
  const fiberCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.58, 0),
    new THREE.Vector3(0, 0.75, 0.1),
    new THREE.Vector3(-0.4, 0.82, 0.2),
    new THREE.Vector3(-0.9, 0.85, 0.25)
  ]);
  const fiberGeo = new THREE.TubeGeometry(fiberCurve, 20, 0.012, 8, false);
  const fiberMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const fiberMesh = new THREE.Mesh(fiberGeo, fiberMat);
  serverGroup.add(fiberMesh);

  rootGroup.add(serverGroup);

  // -------------------------------------------------------------
  // 7. CERAMIC DEVELOPER COFFEE MUG
  // -------------------------------------------------------------
  const mugGroup = new THREE.Group();
  mugGroup.name = 'CoffeeMugAssembly';
  mugGroup.position.set(0.95, 1.0, 0.25);

  // Mug Body using LatheGeometry for authentic ceramic profile
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.065, 0));
  points.push(new THREE.Vector2(0.07, 0.02));
  points.push(new THREE.Vector2(0.075, 0.14));
  points.push(new THREE.Vector2(0.078, 0.16));
  points.push(new THREE.Vector2(0.072, 0.16));
  points.push(new THREE.Vector2(0.068, 0.02));
  points.push(new THREE.Vector2(0, 0.02));
  const mugGeo = new THREE.LatheGeometry(points, 24);
  const mugMesh = new THREE.Mesh(mugGeo, ceramicMat);
  mugMesh.castShadow = true;
  mugMesh.userData = { interactiveType: 'coffee' };
  interactiveObjects.push(mugMesh);
  mugGroup.add(mugMesh);

  // Mug Torus Handle
  const handleGeo = new THREE.TorusGeometry(0.045, 0.012, 12, 24, Math.PI * 1.1);
  const handleMesh = new THREE.Mesh(handleGeo, ceramicMat);
  handleMesh.position.set(0.078, 0.08, 0);
  handleMesh.rotation.y = Math.PI / 2;
  handleMesh.rotation.z = -Math.PI / 2;
  mugGroup.add(handleMesh);

  // Coffee liquid level
  const coffeeGeo = new THREE.CircleGeometry(0.066, 24);
  const coffeeMesh = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffeeMesh.rotation.x = -Math.PI / 2;
  coffeeMesh.position.set(0, 0.14, 0);
  coffeeMesh.userData = { interactiveType: 'coffee' };
  interactiveObjects.push(coffeeMesh);
  mugGroup.add(coffeeMesh);

  // Volumetric Steam particle field rising from mug with soft radial puff texture
  const steamTexCanvas = document.createElement('canvas');
  steamTexCanvas.width = 64;
  steamTexCanvas.height = 64;
  const sCtx = steamTexCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sGrad.addColorStop(0.3, 'rgba(240, 245, 255, 0.55)');
  sGrad.addColorStop(0.65, 'rgba(220, 230, 245, 0.15)');
  sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 64, 64);
  const steamTex = new THREE.CanvasTexture(steamTexCanvas);

  const steamCount = 48;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(steamCount * 3);
  const steamColors = new Float32Array(steamCount * 3);
  for (let s = 0; s < steamCount; s++) {
    const p = calculateVaporParticle(0, s, steamCount);
    steamPositions[s * 3] = p.x;
    steamPositions[s * 3 + 1] = p.y;
    steamPositions[s * 3 + 2] = p.z;
    steamColors[s * 3] = 0.95;
    steamColors[s * 3 + 1] = 0.96;
    steamColors[s * 3 + 2] = 0.98;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
  steamGeo.setAttribute('color', new THREE.BufferAttribute(steamColors, 3));
  const steamMat = new THREE.PointsMaterial({
    map: steamTex,
    size: 0.048,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.45,
    blending: THREE.NormalBlending,
    depthWrite: false,
    vertexColors: true
  });
  const steamPoints = new THREE.Points(steamGeo, steamMat);
  mugGroup.add(steamPoints);
  let steamPuffBoost = 0;

  rootGroup.add(mugGroup);

  // -------------------------------------------------------------
  // 7b. COZY PROCEDURAL POTTED SUCCULENT ASSEMBLY (Echeveria Jade)
  // -------------------------------------------------------------
  const succulentGroup = new THREE.Group();
  succulentGroup.name = 'PottedSucculentAssembly';
  succulentGroup.position.set(-0.85, 1.0, 0.28);

  // Pot Soft Contact Shadow underneath
  const potShadowGeo = new THREE.PlaneGeometry(0.24, 0.24);
  const potShadowMat = new THREE.MeshBasicMaterial({
    map: contactShadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const potShadow = new THREE.Mesh(potShadowGeo, potShadowMat);
  potShadow.rotation.x = -Math.PI / 2;
  potShadow.position.y = 0.001;
  succulentGroup.add(potShadow);

  // Modern Scandinavian faceted / tapered ceramic pot
  const potGeo = new THREE.CylinderGeometry(0.065, 0.046, 0.09, 16);
  const potMat = new THREE.MeshStandardMaterial({
    color: 0xded8cc,
    roughness: 0.65,
    metalness: 0.08
  });
  const potMesh = new THREE.Mesh(potGeo, potMat);
  potMesh.position.y = 0.045;
  potMesh.castShadow = true;
  potMesh.receiveShadow = true;
  potMesh.userData = { interactiveType: 'succulent' };
  interactiveObjects.push(potMesh);
  succulentGroup.add(potMesh);

  // Ceramic pot rim bevel
  const rimGeo = new THREE.TorusGeometry(0.065, 0.006, 8, 24);
  const rimMesh = new THREE.Mesh(rimGeo, potMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.09;
  succulentGroup.add(rimMesh);

  // Dark rich organic soil bed inside pot
  const soilGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.015, 16);
  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x241810,
    roughness: 0.95,
    metalness: 0.02
  });
  const soilMesh = new THREE.Mesh(soilGeo, soilMat);
  soilMesh.position.y = 0.083;
  succulentGroup.add(soilMesh);

  // Scattered decorative white river pebbles in the soil
  for (let p = 0; p < 7; p++) {
    const pebbleAngle = (p / 7) * Math.PI * 2 + (p % 3) * 0.3;
    const pebbleRadius = 0.042 + (p % 2) * 0.012;
    const pebbleGeo = new THREE.DodecahedronGeometry(0.0055, 0);
    const pebbleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.1
    });
    const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
    pebble.position.set(
      Math.cos(pebbleAngle) * pebbleRadius,
      0.091,
      Math.sin(pebbleAngle) * pebbleRadius
    );
    pebble.rotation.set(p * 0.4, p * 0.8, p * 0.2);
    succulentGroup.add(pebble);
  }

  // Rosette Group (Echeveria Jade succulent with layered spiraling fleshy leaves)
  const rosetteGroup = new THREE.Group();
  rosetteGroup.name = 'SucculentRosette';
  rosetteGroup.position.set(0, 0.092, 0);

  // Multi-tier succulent PBR materials (jade green to blushing rose tips)
  const leafOuterMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.32,
    metalness: 0.05,
    emissive: 0x064e3b,
    emissiveIntensity: 0.2
  });
  const leafMidMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.3,
    metalness: 0.05,
    emissive: 0x047857,
    emissiveIntensity: 0.22
  });
  const leafInnerMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    roughness: 0.28,
    metalness: 0.05,
    emissive: 0x15803d,
    emissiveIntensity: 0.25
  });
  const leafHeartMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.35,
    metalness: 0.05,
    emissive: 0x9d174d,
    emissiveIntensity: 0.3
  });

  // Reusable leaf geometry: flattened curved teardrop succulent leaf
  const leafBaseGeo = new THREE.SphereGeometry(0.024, 12, 10);
  leafBaseGeo.scale(0.62, 0.32, 1.35);
  leafBaseGeo.translate(0, 0, 0.022);

  interface SucculentLeafData {
    mesh: THREE.Mesh;
    baseRotX: number;
    baseRotY: number;
    baseRotZ: number;
    tier: number;
    index: number;
  }
  const succulentLeaves: SucculentLeafData[] = [];

  const tierConfigs = [
    { count: 8, radius: 0.024, tilt: 0.65, scale: 1.05, height: 0.003, mat: leafOuterMat },
    { count: 7, radius: 0.018, tilt: 0.48, scale: 0.88, height: 0.012, mat: leafMidMat },
    { count: 5, radius: 0.012, tilt: 0.32, scale: 0.72, height: 0.022, mat: leafInnerMat },
    { count: 3, radius: 0.006, tilt: 0.16, scale: 0.52, height: 0.031, mat: leafHeartMat }
  ];

  let leafGlobalIdx = 0;
  tierConfigs.forEach((tier, tIdx) => {
    const angleOffset = tIdx * 0.55;
    for (let i = 0; i < tier.count; i++) {
      const angle = (i / tier.count) * Math.PI * 2 + angleOffset;
      const leafMesh = new THREE.Mesh(leafBaseGeo, tier.mat);
      leafMesh.castShadow = true;
      leafMesh.receiveShadow = true;
      leafMesh.userData = { interactiveType: 'succulent' };
      interactiveObjects.push(leafMesh);

      leafMesh.position.set(
        Math.cos(angle) * tier.radius,
        tier.height,
        Math.sin(angle) * tier.radius
      );

      const rotY = -angle + Math.PI / 2;
      const rotX = tier.tilt;
      leafMesh.rotation.set(rotX, rotY, 0, 'YXZ');
      leafMesh.scale.set(tier.scale, tier.scale, tier.scale);

      rosetteGroup.add(leafMesh);
      succulentLeaves.push({
        mesh: leafMesh,
        baseRotX: rotX,
        baseRotY: rotY,
        baseRotZ: 0,
        tier: tIdx,
        index: leafGlobalIdx++
      });
    }
  });

  succulentGroup.add(rosetteGroup);
  rootGroup.add(succulentGroup);

  let succulentJiggle = 0;

  // -------------------------------------------------------------
  // 7c. TACTILE INTERACTIVE DESK STICKY NOTES & SCRATCHPAD
  // -------------------------------------------------------------
  function createCurledStickyNoteGeometry(width = 0.21, height = 0.21): THREE.PlaneGeometry {
    const geo = new THREE.PlaneGeometry(width, height, 8, 8);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curl bottom right corner upwards
      const normX = (x + width / 2) / width;
      const normY = (height / 2 - y) / height;
      if (normX > 0.55 && normY > 0.55) {
        const curlAmount = (normX - 0.55) * (normY - 0.55) * 5.0;
        pos.setZ(i, curlAmount * 0.016);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  function createStickyNoteCanvasTexture(note: StickyNote): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 1. Paper background
    ctx.fillStyle = note.color;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle paper grain noise
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // 2. Top glue strip
    ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
    ctx.fillRect(0, 0, 256, 32);

    // 3. Category badge / pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(18, 44, 98, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(note.badge, 24, 59);

    // Date
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(note.date, 172, 59);

    // 4. Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(note.title, 18, 94);

    // Separator line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(18, 106);
    ctx.lineTo(238, 106);
    ctx.stroke();

    // 5. Note content body
    ctx.fillStyle = '#1e293b';
    ctx.font = '12px sans-serif';
    const words = note.content.split(' ');
    let line = '';
    let y = 128;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 220 && n > 0) {
        ctx.fillText(line, 18, y);
        line = words[n] + ' ';
        y += 18;
        if (y > 212) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 18, y);

    // 6. Action prompt hint
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.font = 'italic 11px monospace';
    ctx.fillText('Tap to read // scratchpad', 18, 238);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  const stickyNotesGroup = new THREE.Group();
  stickyNotesGroup.name = 'StickyNotesAssembly';

  const noteTextures: THREE.CanvasTexture[] = [];
  interface NoteMeshEntry {
    id: string;
    mesh: THREE.Mesh;
    baseY: number;
    currentLift: number;
  }
  const noteMeshEntries: NoteMeshEntry[] = [];
  let hoveredNoteId: string | null = null;

  const noteBaseGeo = createCurledStickyNoteGeometry(0.21, 0.21);

  STICKY_NOTES_DATA.forEach((note) => {
    const noteTexture = createStickyNoteCanvasTexture(note);
    noteTextures.push(noteTexture);

    const noteMat = new THREE.MeshStandardMaterial({
      map: noteTexture,
      roughness: 0.75,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    const noteMesh = new THREE.Mesh(noteBaseGeo, noteMat);
    noteMesh.castShadow = true;
    noteMesh.receiveShadow = true;
    noteMesh.rotation.x = -Math.PI / 2;
    noteMesh.rotation.z = note.rotation;
    noteMesh.position.set(note.position[0], note.position[1], note.position[2]);

    // Top pushpin
    const pinGeo = new THREE.SphereGeometry(0.008, 10, 10);
    const pinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(note.pinColor),
      roughness: 0.25,
      metalness: 0.85
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(0, 0.092, 0.007);
    noteMesh.add(pinMesh);

    // Subtle drop shadow underneath paper
    const shadowGeo = new THREE.PlaneGeometry(0.22, 0.22);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0.004, -0.004, -0.001);
    noteMesh.add(shadowMesh);

    noteMesh.userData = {
      interactiveType: 'sticky-note',
      noteId: note.id,
      title: note.title,
      label: note.badge,
      actionHint: 'CLICK TO INSPECT NOTE // SCRATCHPAD'
    };
    interactiveObjects.push(noteMesh);
    stickyNotesGroup.add(noteMesh);

    noteMeshEntries.push({
      id: note.id,
      mesh: noteMesh,
      baseY: note.position[1],
      currentLift: 0
    });
  });

  rootGroup.add(stickyNotesGroup);

  // -------------------------------------------------------------
  // 8. INTERACTIVE 3D PROJECT HOLOGRAPHIC BEACONS
  // -------------------------------------------------------------
  // 3 Floating holographic beacons representing featured projects
  const beaconsGroup = new THREE.Group();
  beaconsGroup.name = 'ProjectBeacons';

  const beaconConfigs = [
    { id: 'omniflow', title: 'OmniFlow', color: 0x38bdf8, pos: [-1.1, 2.3, 0.2] },
    { id: 'apex3d-studio', title: 'Apex3D', color: 0xa855f7, pos: [0, 2.45, 0.1] },
    { id: 'kubepulse', title: 'KubePulse', color: 0x10b981, pos: [1.1, 2.3, 0.2] }
  ];

  const beaconMeshes: THREE.Mesh[] = [];

  beaconConfigs.forEach((cfg) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);

    // Outer revolving wireframe diamond
    const diamondGeo = new THREE.OctahedronGeometry(0.14, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: cfg.color,
      emissiveIntensity: 0.6
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.userData = { projectId: cfg.id, isBeacon: true };
    bGroup.add(diamond);
    beaconMeshes.push(diamond);
    interactiveObjects.push(diamond);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: cfg.color });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.userData = { projectId: cfg.id, isBeacon: true, interactiveType: 'project' };
    bGroup.add(core);
    interactiveObjects.push(core);

    // Glowing base projection ring
    const ringGeo = new THREE.RingGeometry(0.08, 0.12, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, -0.25, 0);
    bGroup.add(ring);

    beaconsGroup.add(bGroup);
  });

  rootGroup.add(beaconsGroup);

  // -------------------------------------------------------------
  // 9. AMBIENT DATA PARTICLES & MATRIX ORBIT
  // -------------------------------------------------------------
  const particleCount = 220;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let p = 0; p < particleCount; p++) {
    const radius = 2.5 + Math.random() * 3.5;
    const angle = Math.random() * Math.PI * 2;
    const y = 0.2 + Math.random() * 3.8;
    particlePositions[p * 3] = Math.cos(angle) * radius;
    particlePositions[p * 3 + 1] = y;
    particlePositions[p * 3 + 2] = Math.sin(angle) * radius;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.035,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  const dataParticles = new THREE.Points(particleGeo, particleMat);
  rootGroup.add(dataParticles);

  // -------------------------------------------------------------
  // EXPLODED VIEW COORDINATES STATE
  // -------------------------------------------------------------
  // Original neutral positions
  const originalPositions = {
    desk: deskGroup.position.clone(),
    monitors: monitorGroup.position.clone(),
    input: inputGroup.position.clone(),
    laptop: laptopGroup.position.clone(),
    server: serverGroup.position.clone(),
    mug: mugGroup.position.clone(),
    succulent: succulentGroup.position.clone(),
    beacons: beaconsGroup.position.clone(),
    notes: stickyNotesGroup.position.clone()
  };

  let currentExploded = 0;
  let targetExploded = 0;

  function setExploded(val: number) {
    targetExploded = Math.max(0, Math.min(1, val));
  }

  // -------------------------------------------------------------
  // UPDATE LOOP (DAMPED ANIMATION)
  // -------------------------------------------------------------
  function update(delta: number, time: number) {
    // 1. Update procedural canvas textures
    codeScreen.update(time);
    verticalScreen.update(time);

    // 2. Rotate & pulse project beacons
    beaconMeshes.forEach((mesh, idx) => {
      mesh.rotation.y += delta * (0.8 + idx * 0.2);
      mesh.rotation.x += delta * 0.4;
      const parent = mesh.parent;
      if (parent) {
        parent.position.y = beaconConfigs[idx].pos[1] + Math.sin(time * 2.2 + idx * 1.5) * 0.04;
      }
    });

    // 3. Mechanical Keyboard Keycaps Depression & Dynamic RGB Ripple Animation
    let hasActiveKeysOrRipples = activeRipples.length > 0;
    for (let i = 0; i < totalKeys; i++) {
      if (keyDepressOffsets[i] > 0.0001) {
        keyDepressOffsets[i] = Math.max(0, keyDepressOffsets[i] - delta * 0.08);
        hasActiveKeysOrRipples = true;
      }
    }

    if (hasActiveKeysOrRipples) {
      const tempColor = new THREE.Color();
      for (let i = 0; i < totalKeys; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;

        dummy.position.set(baseKeyPositions[i].x, baseKeyPositions[i].y - keyDepressOffsets[i], baseKeyPositions[i].z);
        dummy.rotation.x = -0.05;
        dummy.updateMatrix();
        keyInstMesh.setMatrixAt(i, dummy.matrix);

        tempColor.copy(baseKeyColors[i]);
        for (let ripIdx = 0; ripIdx < activeRipples.length; ripIdx++) {
          const rip = activeRipples[ripIdx];
          const age = time - rip.startTime;
          const dist = Math.sqrt((r - rip.originR) ** 2 + (c - rip.originC) ** 2);
          const waveFront = age * 16.0;
          const waveThickness = 2.2;
          const proximity = Math.abs(dist - waveFront);
          if (proximity < waveThickness) {
            const intensity = (1 - proximity / waveThickness) * Math.max(0, 1 - age / 0.85);
            tempColor.lerp(rip.color, intensity * 0.95);
          }
        }
        keyInstMesh.setColorAt(i, tempColor);
      }
      keyInstMesh.instanceMatrix.needsUpdate = true;
      if (keyInstMesh.instanceColor) keyInstMesh.instanceColor.needsUpdate = true;

      // Clean up finished ripples
      for (let ripIdx = activeRipples.length - 1; ripIdx >= 0; ripIdx--) {
        if (time - activeRipples[ripIdx].startTime > 0.85) {
          activeRipples.splice(ripIdx, 1);
        }
      }
    }

    // RGB diffuser strip color decay back to cyber cyan
    rgbStripMat.color.lerp(new THREE.Color(0x38bdf8), delta * 4.0);

    // 4. Volumetric Steam rising from coffee mug with curling vortex noise
    const sPos = steamGeo.attributes.position.array as Float32Array;
    const sCol = steamGeo.attributes.color.array as Float32Array;
    const steamSpeed = 1.0 + steamPuffBoost * 0.8;
    for (let s = 0; s < steamCount; s++) {
      const p = calculateVaporParticle(time * steamSpeed, s, steamCount);
      sPos[s * 3] = p.x;
      sPos[s * 3 + 1] = p.y;
      sPos[s * 3 + 2] = p.z;
      const lum = Math.max(0.2, p.alpha * 2.2) + steamPuffBoost * 0.3;
      sCol[s * 3] = lum;
      sCol[s * 3 + 1] = lum * 1.02;
      sCol[s * 3 + 2] = lum * 1.05;
    }
    steamGeo.attributes.position.needsUpdate = true;
    steamGeo.attributes.color.needsUpdate = true;
    if (steamPuffBoost > 0.01) {
      steamPuffBoost = Math.max(0, steamPuffBoost - delta * 0.8);
    }
    steamMat.opacity = 0.42 + steamPuffBoost * 0.35;

    // 4b. Cozy Botanical Succulent Animation: Perlin noise swaying & gentle breathing
    const succMotion = calculateSucculentMotion(time, succulentJiggle);
    rosetteGroup.rotation.x = succMotion.swayX + succMotion.jiggleAngle * 0.6;
    rosetteGroup.rotation.z = succMotion.swayZ + succMotion.jiggleAngle * 0.8;
    rosetteGroup.scale.set(
      succMotion.breathingScale,
      succMotion.breathingScale,
      succMotion.breathingScale
    );

    // Micro-flex per individual succulent leaf tier
    for (let li = 0; li < succulentLeaves.length; li++) {
      const l = succulentLeaves[li];
      const flex = calculateLeafFlex(time, l.index, l.tier);
      l.mesh.rotation.x = l.baseRotX + flex.pitch;
      l.mesh.rotation.z = l.baseRotZ + flex.roll;
      l.mesh.scale.set(flex.scale, flex.scale, flex.scale);
    }

    if (succulentJiggle > 0.001) {
      succulentJiggle = Math.max(0, succulentJiggle - delta * 3.2);
    }

    // 5. Subtle rotation of ambient data particles
    dataParticles.rotation.y = time * 0.03;

    // 6. Smooth hover elevation on interactive sticky notes
    noteMeshEntries.forEach((entry) => {
      const isTarget = hoveredNoteId === entry.id;
      const targetLift = isTarget ? 0.016 : 0;
      entry.currentLift = THREE.MathUtils.damp(entry.currentLift, targetLift, 8.0, delta);
      entry.mesh.position.y = entry.baseY + entry.currentLift;
    });

    // 7. Smoothly damp exploded view separation
    currentExploded = THREE.MathUtils.damp(currentExploded, targetExploded, 4.5, delta);

    if (Math.abs(currentExploded - targetExploded) > 0.001 || currentExploded > 0.001) {
      // Monitors separate up and back
      monitorGroup.position.y = originalPositions.monitors.y + currentExploded * 0.65;
      monitorGroup.position.z = originalPositions.monitors.z - currentExploded * 0.45;

      // Input devices separate down and forward
      inputGroup.position.y = originalPositions.input.y + currentExploded * 0.25;
      inputGroup.position.z = originalPositions.input.z + currentExploded * 0.45;

      // Laptop slides left and elevates
      laptopGroup.position.x = originalPositions.laptop.x - currentExploded * 0.55;
      laptopGroup.position.y = originalPositions.laptop.y + currentExploded * 0.35;

      // Server tower slides right and back
      serverGroup.position.x = originalPositions.server.x + currentExploded * 0.65;
      serverGroup.position.y = originalPositions.server.y + currentExploded * 0.3;

      // Coffee mug elevates
      mugGroup.position.y = originalPositions.mug.y + currentExploded * 0.4;

      // Potted succulent slides left and elevates slightly
      succulentGroup.position.y = originalPositions.succulent.y + currentExploded * 0.35;
      succulentGroup.position.x = originalPositions.succulent.x - currentExploded * 0.45;

      // Sticky notes elevate and drift slightly
      stickyNotesGroup.position.y = originalPositions.notes.y + currentExploded * 0.45;
      stickyNotesGroup.position.z = originalPositions.notes.z - currentExploded * 0.15;

      // Beacons expand outwards
      beaconsGroup.position.y = originalPositions.beacons.y + currentExploded * 0.8;
    }
  }

  function triggerKeyPress(char?: string) {
    const { row, col, index } = mapCharToKeyboardKey(char || ' ');
    keyDepressOffsets[index] = 0.012; // compress downwards

    // Generate cycling dynamic RGB ripple color
    const now = typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000;
    const rippleHue = ((now * 0.5) + (index % 12) * 0.08) % 1;
    const rippleColor = new THREE.Color().setHSL(rippleHue, 1.0, 0.65);

    activeRipples.push({
      originR: row,
      originC: col,
      startTime: now,
      color: rippleColor
    });
    if (activeRipples.length > 8) activeRipples.shift();

    rgbStripMat.color.copy(rippleColor);
    soundManager.playKey(currentSwitchType);
  }

  function cleanup() {
    codeScreen.texture.dispose();
    verticalScreen.texture.dispose();
    contactShadowTex.dispose();
    carbonTex.dispose();
    noteTextures.forEach((t) => t.dispose());
    noteBaseGeo.dispose();
    rootGroup.clear();
  }

  return {
    group: rootGroup,
    update,
    setExploded,
    interactiveObjects,
    onProjectClick,
    triggerKeyPress,
    cycleScreenMode: () => codeScreen.cycleMode(),
    setScreenMode: (mode: ScreenTerminalMode) => codeScreen.setMode(mode),
    getScreenMode: () => codeScreen.getMode(),
    setSwitchType: (type: KeyboardSwitchType) => {
      currentSwitchType = type;
    },
    getSwitchType: () => currentSwitchType,
    puffCoffeeSteam: () => {
      steamPuffBoost = 1.0;
    },
    nudgeSucculent: () => {
      succulentJiggle = 0.25;
    },
    setHoveredNoteId: (id: string | null) => {
      hoveredNoteId = id;
    },
    cleanup
  };
}
