import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createDeveloperStation, DeveloperStationComponents } from './models/DeveloperStation';
import {
  ViewpointMode,
  MoodLighting,
  FpsMetrics,
  KeyboardSwitchType,
  ScreenTerminalMode,
  InteractiveHoverTarget,
  InteractiveObjectType
} from '../types/portfolio';
import { MOOD_PRESETS, PROJECTS_DATA } from '../data/portfolioData';
import { getViewpointCameraTarget } from '../utils/portfolioLogic';
import { soundManager } from '../audio/soundEffects';

// Pre-allocated scratch helpers at module scope (Zero GC in render loop)
const _scratchVec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2(-999, -999);

export interface SceneManagerOptions {
  container: HTMLDivElement;
  onProjectSelect?: (projectId: string) => void;
  onProgress?: (progress: number, stage: string) => void;
  onReady?: () => void;
  onFpsUpdate?: (metrics: FpsMetrics) => void;
  onScreenModeChange?: (mode: ScreenTerminalMode) => void;
  onHoverTarget?: (target: InteractiveHoverTarget | null) => void;
  onPointerClickEffect?: (e: { x: number; y: number; type?: string }) => void;
  onStickyNoteSelect?: (noteId: string) => void;
  switchType?: KeyboardSwitchType;
  screenMode?: ScreenTerminalMode;
  bloomIntensity?: number;
  fogEnabled?: boolean;
  fogDensity?: number;
  immediate?: boolean;
}

export class SceneManager {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private station!: DeveloperStationComponents;

  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.HemisphereLight;
  private rimLight!: THREE.PointLight;
  private deskFloorLight!: THREE.PointLight;

  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  private isAutoRotating: boolean = false;
  private isUserInteracting: boolean = false;
  private currentViewpoint: ViewpointMode = 'overview';
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3(4.8, 3.6, 5.8);
  private targetControlsTarget: THREE.Vector3 = new THREE.Vector3(0, 0.9, 0);

  private hoveredBeaconId: string | null = null;
  private onProjectSelect?: (projectId: string) => void;
  private onFpsUpdate?: (metrics: FpsMetrics) => void;
  private onScreenModeChange?: (mode: ScreenTerminalMode) => void;
  private onHoverTarget?: (target: InteractiveHoverTarget | null) => void;
  private onPointerClickEffect?: (e: { x: number; y: number; type?: string }) => void;
  private onStickyNoteSelect?: (noteId: string) => void;
  private lastFpsMeasureTime: number = typeof performance !== 'undefined' ? performance.now() : 0;
  private framesThisSample: number = 0;
  private frameHistory: number[] = [60, 60, 60, 60, 60];

  // Post-processing pipeline (Unreal Bloom Pass)
  private composer?: EffectComposer;
  private renderPass?: RenderPass;
  private bloomPass?: UnrealBloomPass;
  private outputPass?: OutputPass;
  private bloomIntensity: number = 1.25;

  // Volumetric atmospheric fog state
  private fogEnabled: boolean = true;
  private fogDensity: number = 0.055;
  private currentFogColor: number = 0x08090d;

  // Smooth mood lighting & fog color interpolation targets
  private targetKeyColor: THREE.Color = new THREE.Color(0x38bdf8);
  private targetFillColor: THREE.Color = new THREE.Color(0x1e1b4b);
  private targetGroundColor: THREE.Color = new THREE.Color(0x090d16);
  private targetRimColor: THREE.Color = new THREE.Color(0xf43f5e);
  private targetFogColor: THREE.Color = new THREE.Color(0x08090d);
  private targetBloomIntensity: number = 1.25;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;
    this.onProjectSelect = options.onProjectSelect;
    this.onFpsUpdate = options.onFpsUpdate;
    this.onScreenModeChange = options.onScreenModeChange;
    this.onHoverTarget = options.onHoverTarget;
    this.onPointerClickEffect = options.onPointerClickEffect;
    this.onStickyNoteSelect = options.onStickyNoteSelect;
    if (typeof options.bloomIntensity === 'number') {
      this.bloomIntensity = Math.max(0, options.bloomIntensity);
    }
    if (typeof options.fogEnabled === 'boolean') {
      this.fogEnabled = options.fogEnabled;
    }
    if (typeof options.fogDensity === 'number') {
      this.fogDensity = Math.max(0.005, options.fogDensity);
    }

    this.detectSoftwareGl();
    this.initRenderer();
    this.initScene();
    this.initCameraAndControls();
    this.initLightingAndEnvironment();
    this.initStation();
    if (options.switchType) {
      this.station.setSwitchType(options.switchType);
    }
    if (options.screenMode) {
      this.station.setScreenMode(options.screenMode);
    }
    this.initPostProcessing();
    this.initEventListeners();
    this.startLoop();

    if (options.immediate) {
      options.onProgress?.(100, 'Developer workspace loaded');
      options.onReady?.();
      return;
    }

    // Progressive loading pipeline
    options.onProgress?.(18, 'Probing GPU capabilities & initializing WebGL2 context...');

    setTimeout(() => {
      options.onProgress?.(45, 'Synthesizing procedural textures, syntax maps & carbon weaves...');

      setTimeout(() => {
        options.onProgress?.(72, 'Assembling 12-part developer workstation & mechanical geometries...');

        setTimeout(() => {
          options.onProgress?.(92, 'Generating PMREM studio reflections & baking contact shadows...');
          try {
            if (!this.isSoftwareGl) {
              this.renderer.compile(this.scene, this.camera);
            }
          } catch {}

          setTimeout(() => {
            options.onProgress?.(100, 'Developer workspace loaded successfully');
            options.onReady?.();
          }, 180);
        }, 180);
      }, 180);
    }, 150);
  }

  private detectSoftwareGl() {
    this.isSoftwareGl = (() => {
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
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentFogColor);
    if (this.fogEnabled) {
      this.scene.fog = new THREE.FogExp2(this.currentFogColor, this.fogDensity);
    } else {
      this.scene.fog = null;
    }
  }

  private initCameraAndControls() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(4.8, 3.6, 5.8);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 14;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // prevent going below floor
    this.controls.target.set(0, 0.9, 0);

    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
    });
  }

  private initLightingAndEnvironment() {
    // Studio Environment map via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // fallback to ambient light if PMREM fails
    }

    // 1. Warm Directional Key Light (with tight shadow frustum)
    this.keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    this.keyLight.position.set(4.5, 6.0, 3.5);
    this.keyLight.castShadow = !this.isSoftwareGl;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 1.0;
    this.keyLight.shadow.camera.far = 16.0;
    const d = 3.8;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    // 2. Cool Hemisphere Light Fill
    this.fillLight = new THREE.HemisphereLight(0x1e1b4b, 0x090d16, 1.2);
    this.scene.add(this.fillLight);

    // 3. Rim / Accent Backlight
    this.rimLight = new THREE.PointLight(0xf43f5e, 2.5, 10, 1.5);
    this.rimLight.position.set(-3.5, 3.5, -3.0);
    this.scene.add(this.rimLight);

    // 4. Subtle under-desk glow light
    this.deskFloorLight = new THREE.PointLight(0x38bdf8, 1.2, 5, 2.0);
    this.deskFloorLight.position.set(0, 0.4, 0);
    this.scene.add(this.deskFloorLight);

    // Grid Floor on ground
    const gridHelper = new THREE.GridHelper(24, 48, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.4;
    this.scene.add(gridHelper);
  }

  private initStation() {
    this.station = createDeveloperStation(this.renderer, (projectId) => {
      this.onProjectSelect?.(projectId);
    });
    this.scene.add(this.station.group);
  }

  private initPostProcessing() {
    try {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.composer = new EffectComposer(this.renderer);
      this.renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);

      // UnrealBloomPass: resolution, strength, radius, threshold
      // Carefully calibrated for cyber-neon glow on emissive displays, monitors & LED accents
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        this.bloomIntensity,
        0.42,
        0.22
      );
      this.composer.addPass(this.bloomPass);

      this.outputPass = new OutputPass();
      this.composer.addPass(this.outputPass);
    } catch (err) {
      console.warn('Post-processing Bloom setup fallback:', err);
    }
  }

  private initEventListeners() {
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('mousemove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerleave', this.onPointerLeave);
    this.renderer.domElement.addEventListener('mouseleave', this.onPointerLeave);
  }

  private onPointerLeave = () => {
    if (this.hoveredBeaconId !== null) {
      this.hoveredBeaconId = null;
      this.renderer.domElement.style.cursor = 'none';
      this.onHoverTarget?.(null);
    }
  };

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.composer) {
      this.composer.setSize(width, height);
    }
    if (this.bloomPass) {
      this.bloomPass.resolution.set(width, height);
    }
  };

  private onPointerMove = (e: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, this.camera);
    const intersects = _raycaster.intersectObjects(this.station.interactiveObjects, true);

    if (intersects.length > 0) {
      const topObj = intersects[0].object;
      const pid = topObj.userData.projectId;
      const type = topObj.userData.interactiveType || (pid ? 'project' : undefined);

      if (pid || type) {
        const targetIdentifier = pid || topObj.userData.noteId || type;
        if (targetIdentifier !== this.hoveredBeaconId) {
          this.hoveredBeaconId = targetIdentifier;
          this.renderer.domElement.style.cursor = 'none';
          if (pid) {
            soundManager.playClick();
          } else if (type === 'sticky-note') {
            soundManager.playPaperRustle();
            this.station.setHoveredNoteId?.(topObj.userData.noteId || null);
          } else {
            this.station.setHoveredNoteId?.(null);
          }

          const projectItem = pid ? PROJECTS_DATA.find((p) => p.id === pid) : null;
          this.onHoverTarget?.({
            type: (type as InteractiveObjectType) || (pid ? 'project' : 'screen'),
            id: pid || topObj.userData.noteId,
            title: projectItem?.title || topObj.userData.title,
            label: projectItem ? projectItem.title : topObj.userData.label,
            actionHint: topObj.userData.actionHint,
            point: { x: e.clientX, y: e.clientY }
          });
        }
      } else if (this.hoveredBeaconId !== null) {
        this.hoveredBeaconId = null;
        this.station.setHoveredNoteId?.(null);
        this.renderer.domElement.style.cursor = 'none';
        this.onHoverTarget?.(null);
      }
    } else {
      if (this.hoveredBeaconId !== null) {
        this.hoveredBeaconId = null;
        this.station.setHoveredNoteId?.(null);
        this.renderer.domElement.style.cursor = 'none';
        this.onHoverTarget?.(null);
      }
    }
  };

  private onPointerDown = (e: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, this.camera);
    const intersects = _raycaster.intersectObjects(this.station.interactiveObjects, true);

    if (intersects.length > 0) {
      const topObj = intersects[0].object;
      const pid = topObj.userData.projectId;
      const type = topObj.userData.interactiveType || (pid ? 'project' : undefined);

      this.onPointerClickEffect?.({
        x: e.clientX,
        y: e.clientY,
        type: (type as string) || (pid ? 'project' : undefined)
      });

      if (pid) {
        soundManager.playWarp();
        this.onProjectSelect?.(pid);
        return;
      }

      if (type === 'sticky-note') {
        const noteId = topObj.userData.noteId || 'note-arch';
        soundManager.playPaperRustle();
        this.onStickyNoteSelect?.(noteId);
        return;
      }

      if (type === 'screen') {
        const nextMode = this.station.cycleScreenMode();
        soundManager.playClick();
        this.onScreenModeChange?.(nextMode);
      } else if (type === 'keyboard') {
        this.station.triggerKeyPress();
      } else if (type === 'coffee') {
        this.station.puffCoffeeSteam();
        soundManager.playClick();
      } else if (type === 'succulent') {
        this.station.nudgeSucculent();
        soundManager.playChime();
      }
    } else {
      this.onPointerClickEffect?.({ x: e.clientX, y: e.clientY, type: 'ambient' });
    }
  };

  public setViewpoint(mode: ViewpointMode) {
    this.currentViewpoint = mode;
    this.isUserInteracting = false;
    soundManager.playWarp();

    const target = getViewpointCameraTarget(mode);
    this.targetCameraPos.set(...target.position);
    this.targetControlsTarget.set(...target.target);
  }

  public setMood(moodId: MoodLighting) {
    const preset = MOOD_PRESETS.find(p => p.id === moodId);
    if (!preset) return;
    if (!this.keyLight || !this.fillLight || !this.rimLight || !this.deskFloorLight) return;

    soundManager.playChime();

    // Smoothly target preset light colors
    this.targetKeyColor.setHex(preset.keyLight);
    this.targetFillColor.setHex(preset.fillLight);
    this.targetGroundColor.setHex(preset.groundLight);
    this.targetRimColor.setHex(preset.rimLight);
    this.targetFogColor.setHex(preset.fogColor);
    this.currentFogColor = preset.fogColor;

    if (this.scene) {
      if (!this.scene.background) {
        this.scene.background = new THREE.Color(preset.fogColor);
      }
      if (this.fogEnabled) {
        if (!this.scene.fog) {
          this.scene.fog = new THREE.FogExp2(preset.fogColor, this.fogDensity);
        }
      } else {
        this.scene.fog = null;
      }
    }

    if (typeof preset.bloomIntensity === 'number') {
      this.targetBloomIntensity = preset.bloomIntensity;
      this.bloomIntensity = preset.bloomIntensity;
    }
  }

  public setFog(enabled: boolean, density?: number) {
    this.fogEnabled = enabled;
    if (typeof density === 'number') {
      this.fogDensity = Math.max(0.005, density);
    }
    if (!this.scene) return;

    if (this.fogEnabled) {
      if (this.scene.fog instanceof THREE.FogExp2) {
        this.scene.fog.density = this.fogDensity;
        this.scene.fog.color.setHex(this.currentFogColor);
      } else {
        this.scene.fog = new THREE.FogExp2(this.currentFogColor, this.fogDensity);
      }
    } else {
      this.scene.fog = null;
    }
  }

  public getFogState(): { enabled: boolean; density: number } {
    return { enabled: this.fogEnabled, density: this.fogDensity };
  }

  public setExploded(progress: number) {
    if (this.station) {
      this.station.setExploded(progress);
    }
  }

  public setAutoRotate(enabled: boolean) {
    this.isAutoRotating = enabled;
  }

  public getAutoRotate(): boolean {
    return this.isAutoRotating;
  }

  public setBloomIntensity(intensity: number) {
    this.bloomIntensity = Math.max(0, intensity);
    if (this.bloomPass) {
      this.bloomPass.strength = this.bloomIntensity;
    }
  }

  public getBloomIntensity(): number {
    return this.bloomIntensity;
  }

  public triggerKeyPress(char?: string) {
    this.station?.triggerKeyPress(char);
  }

  public cycleScreenMode(): ScreenTerminalMode {
    const nextMode = this.station?.cycleScreenMode() || 'code';
    this.onScreenModeChange?.(nextMode);
    return nextMode;
  }

  public setScreenMode(mode: ScreenTerminalMode) {
    this.station?.setScreenMode(mode);
  }

  public getScreenMode(): ScreenTerminalMode {
    return this.station?.getScreenMode() || 'code';
  }

  public setSwitchType(type: KeyboardSwitchType) {
    this.station?.setSwitchType(type);
  }

  public getSwitchType(): KeyboardSwitchType {
    return this.station?.getSwitchType() || 'blue';
  }

  public puffCoffeeSteam() {
    this.station?.puffCoffeeSteam();
  }

  public nudgeSucculent() {
    this.station?.nudgeSucculent();
  }

  // Continuous animation loop with software WebGL guard
  private startLoop() {
    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      const frameStart = typeof performance !== 'undefined' ? performance.now() : 0;
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      // Camera smooth exponential damping towards target viewpoint when not manually orbiting
      if (!this.isUserInteracting) {
        this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCameraPos.x, 3.5, delta);
        this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCameraPos.y, 3.5, delta);
        this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCameraPos.z, 3.5, delta);

        this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.targetControlsTarget.x, 3.5, delta);
        this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.targetControlsTarget.y, 3.5, delta);
        this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.targetControlsTarget.z, 3.5, delta);
      }

      // Auto-orbit if toggled on
      if (this.isAutoRotating && !this.isUserInteracting) {
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
      } else {
        this.controls.autoRotate = false;
      }

      this.controls.update();

      // Update 3D Developer Station
      this.station.update(delta, time);

      // Smooth lighting, background, and fog color interpolation for cinematic mood transitions
      if (this.keyLight && this.fillLight && this.rimLight && this.deskFloorLight) {
        const lerpFactor = Math.min(1.0, delta * 3.5);
        this.keyLight.color.lerp(this.targetKeyColor, lerpFactor);
        this.fillLight.color.lerp(this.targetFillColor, lerpFactor);
        this.fillLight.groundColor.lerp(this.targetGroundColor, lerpFactor);
        this.rimLight.color.lerp(this.targetRimColor, lerpFactor);
        this.deskFloorLight.color.lerp(this.targetKeyColor, lerpFactor);

        if (this.scene.background instanceof THREE.Color) {
          this.scene.background.lerp(this.targetFogColor, lerpFactor);
        }
        if (this.fogEnabled && this.scene.fog instanceof THREE.FogExp2) {
          this.scene.fog.color.lerp(this.targetFogColor, lerpFactor);
        }
      }

      if (this.bloomPass && Math.abs(this.bloomPass.strength - this.targetBloomIntensity) > 0.01) {
        this.bloomPass.strength = THREE.MathUtils.damp(
          this.bloomPass.strength,
          this.targetBloomIntensity,
          3.5,
          delta
        );
      }

      // Render via post-processing bloom composer when enabled, or direct renderer fallback
      if (this.bloomIntensity > 0 && this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      // Measure FPS and frame time accurately
      const now = typeof performance !== 'undefined' ? performance.now() : 0;
      const frameDuration = Math.max(0.1, now - frameStart);
      this.framesThisSample++;

      if (now - this.lastFpsMeasureTime >= 280) {
        const elapsedSec = Math.max(0.001, (now - this.lastFpsMeasureTime) / 1000);
        const measuredFps = Math.min(240, Math.max(1, Math.round(this.framesThisSample / elapsedSec)));
        this.frameHistory.push(measuredFps);
        if (this.frameHistory.length > 16) {
          this.frameHistory.shift();
        }

        this.onFpsUpdate?.({
          fps: measuredFps,
          frameTimeMs: frameDuration,
          isSoftwareGl: this.isSoftwareGl,
          frameHistory: [...this.frameHistory]
        });

        this.framesThisSample = 0;
        this.lastFpsMeasureTime = now;
      }

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  }

  public dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.removeEventListener('mousemove', this.onPointerMove);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointerleave', this.onPointerLeave);
    this.renderer.domElement.removeEventListener('mouseleave', this.onPointerLeave);

    if (this.isSoftwareGl) {
      clearTimeout(this.frameId);
    } else {
      cancelAnimationFrame(this.frameId);
    }

    if (this.bloomPass) {
      this.bloomPass.dispose();
    }
    if (this.composer) {
      this.composer.dispose();
    }

    if (this.station) {
      this.station.cleanup();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}
