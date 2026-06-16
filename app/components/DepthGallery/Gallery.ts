import * as THREE from 'three'
import { galleryPlaneData, type GalleryPlaneDefinition } from './galleryData'

interface PlaneBlendData {
  currentPlaneIndex: number
  nextPlaneIndex: number
  blend: number
}

interface MoodColors {
  background: string
  blob1: string
  blob2: string
}

interface MoodBlendData {
  currentMood: MoodColors
  nextMood: MoodColors
  blend: number
}

export class Gallery {
  planes: THREE.Mesh[] = []
  private texturesBySource = new Map<string, THREE.Texture>()
  private planeGap = 5
  private desktopPlaneScale = 1
  private mobilePlaneScale = 0.65
  private mobileXSpreadFactor = 0.25
  private mobileBreakpoint = 768
  private planeConfig: GalleryPlaneDefinition[] = galleryPlaneData
  private moodSampleOffset = 1
  private planeFadeSampleOffset = 1
  private planeFadeSmoothing = 0.14

  private parallaxEnabled = true
  private parallaxAmountX = 0.16
  private parallaxAmountY = 0.08
  private parallaxSmoothing = 0.08
  private pointerTarget = new THREE.Vector2(0, 0)
  private pointerCurrent = new THREE.Vector2(0, 0)

  private breathEnabled = true
  private breathTiltAmount = 0.045
  private breathScaleAmount = 0.03
  private breathSmoothing = 0.14
  private breathGain = 1.1
  private breathIntensity = 0
  private targetBreathIntensity = 0

  private gestureParallaxEnabled = true
  private gestureParallaxAmountY = 0.05
  private gestureParallaxSmoothing = 0.05
  private driftCurrent = 0
  private driftTarget = 0
  private isInitialized = false

  private onPointerMove = (event: PointerEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    this.pointerTarget.set(x, -y)
  }
  private onPointerLeave = () => {
    this.pointerTarget.set(0, 0)
  }

  async init(scene: THREE.Scene) {
    if (this.isInitialized) return
    this.setPlanes(scene)
    this.updatePlaneScale()
    this.layoutPlanes()
    this.bindPointerEvents()
    this.isInitialized = true
  }

  private setPlanes(scene: THREE.Scene) {
    const planeGeometry = new THREE.PlaneGeometry(3, 3)
    this.planeConfig.forEach((plane, index) => {
      const texture = this.texturesBySource.get(plane.textureSrc) || null
      const textureImage = texture?.image as HTMLImageElement | undefined
      const aspectRatio = textureImage && textureImage.width > 0 && textureImage.height > 0
        ? textureImage.width / textureImage.height
        : 1
      const isCTA = plane.label.word === 'cta'
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: texture ? '#ffffff' : plane.fallbackColor,
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        opacity: isCTA ? 0 : (index === 0 ? 1 : 0),
      })
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
      planeMesh.userData.basePosition = plane.position
      planeMesh.userData.baseColor = plane.fallbackColor
      planeMesh.userData.accentColor = plane.accentColor
      planeMesh.userData.backgroundColor = plane.backgroundColor
      planeMesh.userData.blob1Color = plane.blob1Color
      planeMesh.userData.blob2Color = plane.blob2Color
      planeMesh.userData.label = plane.label
      planeMesh.userData.texture = texture
      planeMesh.userData.aspectRatio = aspectRatio
      scene.add(planeMesh)
      this.planes.push(planeMesh)
    })
  }

  setPreloadedTextures(texturesBySource: Map<string, THREE.Texture>) {
    this.texturesBySource = texturesBySource instanceof Map ? texturesBySource : new Map()
  }

  getTextureSources(): string[] {
    return [...new Set(this.planeConfig.map(p => p.textureSrc).filter(Boolean))]
  }

  updatePlaneScale() {
    const isMobile = window.innerWidth <= this.mobileBreakpoint
    const scale = isMobile ? this.mobilePlaneScale : this.desktopPlaneScale
    this.planes.forEach(plane => {
      const ar = plane.userData.aspectRatio || 1
      plane.scale.set(scale * ar, scale, 1)
    })
  }

  layoutPlanes() {
    const xSpread = window.innerWidth <= this.mobileBreakpoint ? this.mobileXSpreadFactor : 1
    this.planes.forEach((plane, index) => {
      const bp = plane.userData.basePosition || { x: 0, y: 0 }
      plane.position.set(bp.x * xSpread, bp.y, -index * this.planeGap)
    })
  }

  getDepthRange() {
    if (!this.planes.length) return { nearestZ: 0, deepestZ: 0 }
    const zPositions = this.planes.map(p => p.position.z)
    return { nearestZ: Math.max(...zPositions), deepestZ: Math.min(...zPositions) }
  }

  getDepthProgress(cameraZ: number) {
    const { nearestZ, deepestZ } = this.getDepthRange()
    const span = nearestZ - deepestZ
    if (span <= 0) return 0
    return THREE.MathUtils.clamp((nearestZ - cameraZ) / span, 0, 1)
  }

  getPlaneBlendData(cameraZ: number): PlaneBlendData | null {
    if (!this.planes.length) return null
    const planeGap = Math.max(this.planeGap, 0.0001)
    const firstPlaneZ = this.planes[0].position.z
    const lastPlaneIndex = this.planes.length - 1
    const sampledZ = cameraZ - planeGap * this.planeFadeSampleOffset
    const normalizedDepth = THREE.MathUtils.clamp((firstPlaneZ - sampledZ) / planeGap, 0, lastPlaneIndex)
    const currentPlaneIndex = Math.floor(normalizedDepth)
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex)
    const blend = normalizedDepth - currentPlaneIndex
    return { currentPlaneIndex, nextPlaneIndex, blend }
  }

  getMoodBlendData(cameraZ: number): MoodBlendData | null {
    if (!this.planes.length) return null
    const safeCameraZ = Number.isFinite(cameraZ) ? cameraZ : this.planes[0].position.z
    const moodSampleZ = safeCameraZ - this.planeGap * this.moodSampleOffset
    const lastPlaneIndex = this.planes.length - 1
    if (lastPlaneIndex === 0 || this.planeGap <= 0) {
      const p = this.planes[0]
      const mood = { background: p.userData.backgroundColor, blob1: p.userData.blob1Color, blob2: p.userData.blob2Color }
      return { currentMood: mood, nextMood: mood, blend: 0 }
    }
    const firstPlaneZ = this.planes[0].position.z
    const normalizedDepth = THREE.MathUtils.clamp((firstPlaneZ - moodSampleZ) / this.planeGap, 0, lastPlaneIndex)
    const currentPlaneIndex = Math.floor(normalizedDepth)
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex)
    const blend = normalizedDepth - currentPlaneIndex
    const getColors = (i: number): MoodColors | null => {
      const p = this.planes[i]
      if (!p || !p.userData.backgroundColor) return null
      return { background: p.userData.backgroundColor, blob1: p.userData.blob1Color, blob2: p.userData.blob2Color }
    }
    const currentMood = getColors(currentPlaneIndex)
    const nextMood = getColors(nextPlaneIndex) || currentMood
    if (!currentMood || !nextMood) return null
    return { currentMood, nextMood, blend }
  }

  private bindPointerEvents() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true })
  }

  private updatePlaneVisibility(cameraZ: number) {
    const blendData = this.getPlaneBlendData(cameraZ)
    if (!blendData) return
    const { currentPlaneIndex, nextPlaneIndex, blend } = blendData
    this.planes.forEach((plane, index) => {
      if (plane.userData.label?.word === 'cta') return
      let targetOpacity = 0
      if (index === currentPlaneIndex) targetOpacity = 1 - blend
      if (index === nextPlaneIndex) targetOpacity = Math.max(targetOpacity, blend)
      const mat = plane.material as THREE.MeshBasicMaterial
      const cur = Number.isFinite(mat.opacity) ? mat.opacity : 0
      mat.opacity = THREE.MathUtils.lerp(cur, targetOpacity, this.planeFadeSmoothing)
      mat.needsUpdate = true
    })
  }

  private updatePlaneMotion(scroll: { velocity: number; velocityMax: number } | null) {
    this.pointerCurrent.lerp(this.pointerTarget, this.parallaxSmoothing)
    const velocityMax = Math.max(scroll?.velocityMax || 1, 0.0001)
    const velocityNormalized = THREE.MathUtils.clamp(Math.abs(scroll?.velocity || 0) / velocityMax, 0, 1)
    const scrollDrift = THREE.MathUtils.clamp((scroll?.velocity || 0) / velocityMax, -1, 1)
    this.targetBreathIntensity = this.breathEnabled ? THREE.MathUtils.clamp(velocityNormalized * this.breathGain, 0, 1) : 0
    this.breathIntensity = THREE.MathUtils.lerp(this.breathIntensity, this.targetBreathIntensity, this.breathSmoothing)
    this.driftTarget = this.gestureParallaxEnabled ? scrollDrift : 0
    this.driftCurrent = THREE.MathUtils.lerp(this.driftCurrent, this.driftTarget, this.gestureParallaxSmoothing)
    const xSpread = window.innerWidth <= this.mobileBreakpoint ? this.mobileXSpreadFactor : 1
    const isMobile = window.innerWidth <= this.mobileBreakpoint
    const baseScale = isMobile ? this.mobilePlaneScale : this.desktopPlaneScale

    this.planes.forEach((plane, index) => {
      const bp = plane.userData.basePosition || { x: 0, y: 0 }
      const mat = plane.material as THREE.MeshBasicMaterial
      const opacity = Number.isFinite(mat.opacity) ? mat.opacity : 0
      const depthInfluence = 1 + index * 0.05
      const parallaxInfluence = this.parallaxEnabled ? opacity * depthInfluence : 0
      plane.position.x = bp.x * xSpread + this.pointerCurrent.x * this.parallaxAmountX * parallaxInfluence
      plane.position.y = bp.y + this.pointerCurrent.y * this.parallaxAmountY * parallaxInfluence + this.driftCurrent * this.gestureParallaxAmountY
      plane.position.z = -index * this.planeGap
      const breathInfluence = this.breathEnabled ? this.breathIntensity * opacity : 0
      plane.rotation.x = -this.pointerCurrent.y * this.breathTiltAmount * breathInfluence
      plane.rotation.y = this.pointerCurrent.x * this.breathTiltAmount * breathInfluence
      plane.rotation.z = 0
      const ar = plane.userData.aspectRatio || 1
      const scalePulse = 1 + this.breathScaleAmount * breathInfluence
      plane.scale.x = baseScale * ar * scalePulse
      plane.scale.y = baseScale * scalePulse
      plane.scale.z = 1
    })
  }

  update(camera: THREE.Camera | null, scroll: { velocity: number; velocityMax: number } | null) {
    if (!camera) return
    this.updatePlaneVisibility(camera.position.z)
    this.updatePlaneMotion(scroll)
  }

  dispose() {
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerleave', this.onPointerLeave)
  }
}
