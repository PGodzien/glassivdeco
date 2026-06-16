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
  private touchY = 0
  private isInitialized = false

  private onWheel = (event: WheelEvent) => {
    event.preventDefault()
    this.scrollTarget += this.normalizeWheelDelta(event)
  }
  private onTouchStart = (event: TouchEvent) => {
    this.touchY = event.touches[0]?.clientY ?? 0
  }
  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault()
    const currentTouchY = event.touches[0]?.clientY ?? this.touchY
    const deltaY = this.touchY - currentTouchY
    this.scrollTarget += deltaY * 1.8
    this.touchY = currentTouchY
  }

  private target: HTMLElement | Window

  constructor(camera: THREE.PerspectiveCamera, gallery: Gallery, target?: HTMLElement) {
    this.camera = camera
    this.gallery = gallery
    this.target = target ?? window
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
    this.target.addEventListener('wheel', this.onWheel as EventListener, { passive: false })
    this.target.addEventListener('touchstart', this.onTouchStart as EventListener, { passive: true })
    this.target.addEventListener('touchmove', this.onTouchMove as EventListener, { passive: false })
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

  private normalizeWheelDelta(event: WheelEvent) {
    if (event.deltaMode === 1) return event.deltaY * 16
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight
    return event.deltaY
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
    this.target.removeEventListener('wheel', this.onWheel as EventListener)
    this.target.removeEventListener('touchstart', this.onTouchStart as EventListener)
    this.target.removeEventListener('touchmove', this.onTouchMove as EventListener)
  }
}
