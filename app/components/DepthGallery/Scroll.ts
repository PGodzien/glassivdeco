import * as THREE from 'three'
import type { Gallery } from './Gallery'

export class Scroll {
  velocity = 0
  velocityMax = 1.5
  maxCameraZ = 0
  minCameraZ = 0

  private camera: THREE.PerspectiveCamera
  private gallery: Gallery
  private scrollTarget = 0
  private scrollCurrent = 0
  private scrollSmoothing = 0.08
  private scrollToWorldFactor = 0.01
  private previousScrollCurrent = 0
  private rawVelocity = 0
  private velocityDamping = 0.12
  private velocityStopThreshold = 0.0001
  private firstPlaneViewOffset = 5
  private lastPlaneViewOffset = 5
  private cameraStartZ = 0
  private isInitialized = false

  private scrollerEl: HTMLElement
  private stickyEl: HTMLElement
  private scrollerTop = 0
  private scrollTravel = 0

  private cacheLayout = () => {
    this.scrollerTop = this.scrollerEl.getBoundingClientRect().top + window.scrollY
    this.scrollTravel = this.scrollerEl.offsetHeight - this.stickyEl.offsetHeight
  }

  // Last 15% of scroll travel holds at final slide (gives it time to settle before next section)
  private readonly holdFraction = 0.15

  private onScroll = () => {
    if (this.scrollTravel <= 0) return
    const rawProgress = THREE.MathUtils.clamp(
      (window.scrollY - this.scrollerTop) / this.scrollTravel,
      0, 1
    )
    const animProgress = THREE.MathUtils.clamp(rawProgress / (1 - this.holdFraction), 0, 1)
    const minimumScroll = this.scrollFromCameraZ(this.maxCameraZ)
    const maximumScroll = this.scrollFromCameraZ(this.minCameraZ)
    this.scrollTarget = minimumScroll + animProgress * (maximumScroll - minimumScroll)
  }

  constructor(camera: THREE.PerspectiveCamera, gallery: Gallery, scrollerEl: HTMLElement, stickyEl: HTMLElement) {
    this.camera = camera
    this.gallery = gallery
    this.scrollerEl = scrollerEl
    this.stickyEl = stickyEl
  }

  init() {
    if (this.isInitialized) return
    this.updateCameraBounds()
    this.cameraStartZ = this.maxCameraZ
    this.camera.position.z = this.cameraStartZ
    this.scrollTarget = 0
    this.scrollCurrent = 0
    this.previousScrollCurrent = this.scrollCurrent
    this.rawVelocity = 0
    this.velocity = 0
    this.isInitialized = true
  }

  bindEvents() {
    this.cacheLayout()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.cacheLayout, { passive: true })
  }

  private updateCameraBounds() {
    const depthRange = this.gallery.getDepthRange()
    this.maxCameraZ = depthRange.nearestZ + this.firstPlaneViewOffset
    this.minCameraZ = depthRange.deepestZ + this.lastPlaneViewOffset
    if (this.minCameraZ > this.maxCameraZ) this.minCameraZ = this.maxCameraZ
  }

  private cameraZFromScroll(scrollAmount: number) {
    return this.cameraStartZ - scrollAmount * this.scrollToWorldFactor
  }

  private scrollFromCameraZ(cameraZ: number) {
    if (this.scrollToWorldFactor === 0) return 0
    return (this.cameraStartZ - cameraZ) / this.scrollToWorldFactor
  }

  private updateVelocity() {
    this.rawVelocity = this.scrollCurrent - this.previousScrollCurrent
    this.velocity = THREE.MathUtils.lerp(this.velocity, this.rawVelocity, this.velocityDamping)
    this.velocity = THREE.MathUtils.clamp(this.velocity, -this.velocityMax, this.velocityMax)
    if (Math.abs(this.velocity) < this.velocityStopThreshold) this.velocity = 0
    this.previousScrollCurrent = this.scrollCurrent
  }

  update() {
    this.updateCameraBounds()
    this.scrollCurrent = THREE.MathUtils.lerp(this.scrollCurrent, this.scrollTarget, this.scrollSmoothing)
    const minimumScroll = this.scrollFromCameraZ(this.maxCameraZ)
    const maximumScroll = this.scrollFromCameraZ(this.minCameraZ)
    this.scrollTarget = THREE.MathUtils.clamp(this.scrollTarget, minimumScroll, maximumScroll)
    this.scrollCurrent = THREE.MathUtils.clamp(this.scrollCurrent, minimumScroll, maximumScroll)
    this.updateVelocity()
    this.camera.position.z = THREE.MathUtils.clamp(this.cameraZFromScroll(this.scrollCurrent), this.minCameraZ, this.maxCameraZ)
  }

  dispose() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.cacheLayout)
  }
}
