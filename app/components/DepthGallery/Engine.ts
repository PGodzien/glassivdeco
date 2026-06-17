import * as THREE from 'three'
import { Gallery } from './Gallery'
import { Background } from './Background'
import { Label } from './Label'
import { TrailController } from './TrailController'
import { Scroll } from './Scroll'

export class Engine {
  private canvas: HTMLCanvasElement
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private gallery: Gallery
  private background: Background
  private label: Label
  private trailController: TrailController
  private scroll: Scroll
  private animationFrameId: number | null = null
  private isRunning = false
  private isInitialized = false
  private isDisposed = false
  private isVisible = true
  private intersectionObserver: IntersectionObserver | null = null

  private container: HTMLElement

  constructor(canvas: HTMLCanvasElement, stickyEl: HTMLElement, scrollerEl: HTMLElement) {
    this.container = stickyEl
    this.canvas = canvas
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(0, 0, 6)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.autoClear = false
    this.gallery = new Gallery()
    this.background = new Background()
    this.label = new Label(this.gallery, this.container)
    this.trailController = new TrailController({ gallery: this.gallery })
    this.scroll = new Scroll(this.camera, this.gallery, scrollerEl, stickyEl)
  }

  async init() {
    if (this.isInitialized || this.isDisposed) return

    const textureSources = this.gallery.getTextureSources()
    const textureLoader = new THREE.TextureLoader()
    const loadedTextures = new Map<string, THREE.Texture>()

    await Promise.allSettled(
      textureSources.map(async (src) => {
        try {
          const texture = await textureLoader.loadAsync(src)
          texture.colorSpace = THREE.SRGBColorSpace
          loadedTextures.set(src, texture)
        } catch {
          // skip failed textures
        }
      })
    )

    if (this.isDisposed) return

    this.gallery.setPreloadedTextures(loadedTextures)
    await this.gallery.init(this.scene)

    if (this.isDisposed) return

    this.label.init()
    this.background.init()
    this.trailController.init(this.scene, this.camera)
    this.scroll.init()

    this.resize()
    window.addEventListener('resize', this.onResize)
    this.scroll.bindEvents()

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true
        if (this.isVisible && this.isInitialized && !this.isRunning && !this.isDisposed) {
          this.isRunning = true
          this.loop()
        }
      },
      { threshold: 0 }
    )
    this.intersectionObserver.observe(this.container)

    this.isInitialized = true
    this.start()
  }

  private start() {
    if (!this.isInitialized || this.isRunning || this.isDisposed) return
    this.isRunning = true
    this.loop()
  }

  private loop = () => {
    if (!this.isRunning) return
    if (!this.isVisible) {
      this.isRunning = false
      return
    }
    this.animationFrameId = requestAnimationFrame(this.loop)
    const time = performance.now()
    this.scroll.update()

    // Gallery + label
    this.gallery.update(this.camera, this.scroll)
    this.label.update(this.camera)

    // Camera-driven background
    const planeBlendData = this.gallery.getPlaneBlendData(this.camera.position.z)
    const moodBlendData = this.gallery.getMoodBlendData(this.camera.position.z)
    if (moodBlendData) this.background.setMoodBlend(moodBlendData)
    const depthProgress = this.gallery.getDepthProgress(this.camera.position.z)
    const velocityIntensity = THREE.MathUtils.clamp(Math.abs(this.scroll.velocity) / Math.max(this.scroll.velocityMax, 0.0001), 0, 1)
    let stabilizedVelocity = velocityIntensity
    if (planeBlendData) {
      const distFromCenter = Math.abs(planeBlendData.blend - 0.5) * 2
      stabilizedVelocity = velocityIntensity * THREE.MathUtils.smoothstep(distFromCenter, 0.35, 1)
    }
    this.background.setMotionResponse({ depthProgress, velocityIntensity: stabilizedVelocity })
    this.background.update(time)

    // Trail
    this.trailController.update(this.camera, this.scroll, time)

    // Render
    this.renderer.clear(true, true, true)
    this.background.render(this.renderer)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)
    this.label.render()
  }

  private resize = () => {
    const width = this.canvas.clientWidth || window.innerWidth || 1
    const height = this.canvas.clientHeight || window.innerHeight || 1
    if (width <= 0 || height <= 0) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.gallery.updatePlaneScale()
    this.gallery.layoutPlanes()
  }

  private onResize = () => this.resize()

  dispose() {
    if (this.isDisposed) return
    this.isDisposed = true
    this.isRunning = false
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId)
    this.intersectionObserver?.disconnect()
    window.removeEventListener('resize', this.onResize)
    this.scroll.dispose()
    this.trailController.dispose()
    this.gallery.dispose()
    this.label.dispose()
    this.background.dispose()
    this.renderer.dispose()
  }
}
