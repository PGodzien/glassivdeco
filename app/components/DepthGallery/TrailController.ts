import * as THREE from 'three'
import { Trail } from './Trail'
import { TrailHeadParticles } from './TrailHeadParticles'
import type { Gallery } from './Gallery'
import type { Scroll } from './Scroll'

const FULL_CIRCLE_RADIANS = Math.PI * 2

export class TrailController {
  private trail = new Trail()
  private trailHeadParticles = new TrailHeadParticles()
  private gallery: Gallery
  private trailHeadPosition = new THREE.Vector3()
  private prevTime: number | null = null

  private config = {
    isEnabled: true,
    pathSettings: {
      startXPosition: -0.96,
      startYPosition: -1.05,
      horizontalWidth: 3,
      horizontalCycles: 1.85,
      verticalAmplitude: 0.78,
      verticalCycles: 2.1,
      distanceAheadOfCamera: 1.65,
      baseDepthOffset: 4.78,
      depthSpan: 6.52,
      progressDepthOffset: -0.1,
    },
    responsiveSettings: { mobileBreakpoint: 768, mobileWidthScale: 0.35, mobileStartXOffset: 0.35 },
    pointSettings: { minimumPointCount: 14, maximumPointCount: 220, reverseLengthScale: 0.55, initialSeedPointCount: 10, initialSeedStepZ: 0.12, trimPerFrameForward: 4, trimPerFrameReverse: 32 },
    opacitySettings: { baseOpacity: 0.51, idleOpacityAtStart: 0.55, idleProgressThreshold: 0.01, startVisibilityBias: 0.1, edgeFadeStart: 0.04, edgeFadeEnd: 0.2, opacitySmoothing: 0.12 },
    directionChangeEpsilon: 0.0005,
  }

  private state = {
    hasSeededInitialPoints: false,
    hasUserMovedFromStart: false,
    previousProgress: null as number | null,
    previousDirection: 0,
    currentOpacity: 0.51,
  }

  constructor({ gallery }: { gallery: Gallery }) {
    this.gallery = gallery
  }

  init(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    scene.add(this.trail.object)
    scene.add(this.trailHeadParticles.object)
    this.seedInitialPoints(camera)
  }

  update(camera: THREE.PerspectiveCamera | null, scroll: Scroll | null, time: number) {
    if (!camera) return

    const delta = this.prevTime !== null ? Math.min((time - this.prevTime) / 1000, 0.1) : 0.016
    this.prevTime = time

    this.trail.object.visible = this.config.isEnabled
    this.trailHeadParticles.setEnabled(this.config.isEnabled)
    if (!this.config.isEnabled) return

    const currentProgress = this.getProgress(camera, scroll)
    if (currentProgress > this.config.opacitySettings.idleProgressThreshold) this.state.hasUserMovedFromStart = true

    const currentDirection = this.getDirection(currentProgress)
    const hasDirectionReversed = currentDirection !== 0 && this.state.previousDirection !== 0 && currentDirection !== this.state.previousDirection

    this.updateLength(currentProgress, currentDirection || this.state.previousDirection)
    const headPos = this.computeHeadPosition(camera.position.z, currentProgress)
    this.updateOpacity(currentProgress)

    if (hasDirectionReversed) {
      this.trail.reset()
      const restartLead = headPos.clone()
      restartLead.z += currentDirection * this.config.pointSettings.initialSeedStepZ
      this.trail.addPoint(restartLead)
    }

    this.trail.addPoint(headPos)
    if (currentDirection !== 0) this.state.previousDirection = currentDirection
    this.state.previousProgress = currentProgress
    this.trailHeadParticles.update(delta, headPos, this.state.currentOpacity, true)
  }

  private getProgress(camera: THREE.PerspectiveCamera, scroll: Scroll | null): number {
    const scrollRange = (scroll?.maxCameraZ ?? 0) - (scroll?.minCameraZ ?? 0)
    if (Number.isFinite(scrollRange) && scrollRange > 0) {
      return THREE.MathUtils.clamp(((scroll?.maxCameraZ ?? camera.position.z) - camera.position.z) / scrollRange, 0, 1)
    }
    const blend = this.gallery.getPlaneBlendData(camera.position.z)
    if (blend) {
      const lastIndex = Math.max(this.gallery.planes.length - 1, 1)
      return THREE.MathUtils.clamp((blend.currentPlaneIndex + blend.blend) / lastIndex, 0, 1)
    }
    return this.gallery.getDepthProgress(camera.position.z)
  }

  private computeHeadPosition(cameraZ: number, progress: number): THREE.Vector3 {
    const p = THREE.MathUtils.clamp(progress, 0, 1)
    const { pathSettings, responsiveSettings } = this.config
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= responsiveSettings.mobileBreakpoint
    const startX = pathSettings.startXPosition + (isMobile ? responsiveSettings.mobileStartXOffset : 0)
    const width = pathSettings.horizontalWidth * (isMobile ? responsiveSettings.mobileWidthScale : 1)
    const x = startX + Math.sin(p * FULL_CIRCLE_RADIANS * Math.max(pathSettings.horizontalCycles, 0.0001)) * width
    const y = pathSettings.startYPosition + Math.sin(p * FULL_CIRCLE_RADIANS * Math.max(pathSettings.verticalCycles, 0.0001)) * pathSettings.verticalAmplitude
    const depthProgress = pathSettings.progressDepthOffset + p * (1 - pathSettings.progressDepthOffset)
    const z = cameraZ + pathSettings.distanceAheadOfCamera - (pathSettings.baseDepthOffset + depthProgress * pathSettings.depthSpan)
    this.trailHeadPosition.set(x, y, z)
    return this.trailHeadPosition
  }

  private seedInitialPoints(camera: THREE.PerspectiveCamera) {
    if (this.state.hasSeededInitialPoints || !camera) return
    const startPos = this.computeHeadPosition(camera.position.z, 0).clone()
    for (let i = this.config.pointSettings.initialSeedPointCount; i >= 0; i--) {
      const seed = startPos.clone()
      seed.z -= i * this.config.pointSettings.initialSeedStepZ
      this.trail.addPoint(seed)
    }
    this.state.hasSeededInitialPoints = true
  }

  private getDirection(progress: number): number {
    if (this.state.previousProgress === null) return 0
    const delta = progress - this.state.previousProgress
    if (Math.abs(delta) <= this.config.directionChangeEpsilon) return 0
    return Math.sign(delta)
  }

  private updateLength(progress: number, direction: number) {
    const ps = this.config.pointSettings
    const lp = direction < 0 ? progress * ps.reverseLengthScale : progress
    this.trail.maxPoints = Math.round(THREE.MathUtils.lerp(ps.minimumPointCount, ps.maximumPointCount, THREE.MathUtils.clamp(lp, 0, 1)))
    this.trail.maxTrimPerFrame = direction < 0 ? ps.trimPerFrameReverse : ps.trimPerFrameForward
  }

  private updateOpacity(progress: number) {
    const os = this.config.opacitySettings
    const startDistance = THREE.MathUtils.clamp(progress + os.startVisibilityBias, 0, 1)
    const endDistance = 1 - progress
    const closestEdge = Math.min(startDistance, endDistance)
    const edgeVisibility = THREE.MathUtils.smoothstep(closestEdge, os.edgeFadeStart, os.edgeFadeEnd)
    const startupVisibility = !this.state.hasUserMovedFromStart && progress <= os.idleProgressThreshold ? os.idleOpacityAtStart : 0
    const visibility = Math.max(edgeVisibility, startupVisibility)
    const targetOpacity = os.baseOpacity * visibility
    this.state.currentOpacity = THREE.MathUtils.lerp(this.state.currentOpacity, targetOpacity, os.opacitySmoothing)
    this.trail.material.opacity = this.state.currentOpacity
  }

  dispose() {
    this.trail.dispose()
    this.trailHeadParticles.dispose()
    this.state.hasSeededInitialPoints = false
    this.state.hasUserMovedFromStart = false
    this.state.previousProgress = null
    this.state.previousDirection = 0
  }
}
