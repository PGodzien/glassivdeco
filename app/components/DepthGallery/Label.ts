import type { Gallery } from './Gallery'

export class Label {
  private gallery: Gallery
  private overlayElement: HTMLElement | null = null
  private indexElement: HTMLElement | null = null
  private wordElement: HTMLElement | null = null
  private chipElement: HTMLElement | null = null
  private specElement: HTMLElement | null = null
  private activePlaneIndex = -1

  private container: HTMLElement

  constructor(gallery: Gallery, container: HTMLElement = document.body) {
    this.gallery = gallery
    this.container = container
  }

  init() {
    if (this.overlayElement) return
    const el = document.createElement('section')
    el.className = 'depth-label-overlay'
    el.innerHTML = `
      <div class="depth-label-left">
        <p class="depth-label-index"></p>
        <p class="depth-label-word"></p>
        <span class="depth-label-chip"></span>
      </div>
      <div class="depth-label-right">
        <p class="depth-label-spec"></p>
      </div>
    `
    this.overlayElement = el
    this.indexElement = el.querySelector('.depth-label-index')
    this.wordElement = el.querySelector('.depth-label-word')
    this.chipElement = el.querySelector('.depth-label-chip')
    this.specElement = el.querySelector('.depth-label-spec')
    this.overlayElement.style.opacity = '0'
    this.container.append(el)
  }

  private getTargetPlaneIndex(cameraZ: number): number {
    const blendData = this.gallery.getPlaneBlendData(cameraZ)
    if (!blendData) return -1
    return blendData.blend >= 0.5 ? blendData.nextPlaneIndex : blendData.currentPlaneIndex
  }

  private applyPlaneContent(planeIndex: number) {
    const plane = this.gallery.planes[planeIndex]
    if (!plane || this.activePlaneIndex === planeIndex) return
    const label = plane.userData.label || {}
    if (this.indexElement) this.indexElement.textContent = String(planeIndex + 1).padStart(2, '0')
    if (this.wordElement) this.wordElement.textContent = label.word || ''
    if (this.chipElement) (this.chipElement as HTMLElement).style.backgroundColor = plane.userData.accentColor || ''
    if (this.specElement) this.specElement.textContent = label.spec || ''
    if (this.overlayElement) this.overlayElement.style.color = label.color || ''
    this.activePlaneIndex = planeIndex
  }

  resize(_width?: number, _height?: number) {}

  update(camera: { position: { z: number } } | null) {
    if (!camera || !this.overlayElement) return
    const targetIndex = this.getTargetPlaneIndex(camera.position.z)
    if (targetIndex < 0) { this.overlayElement.style.opacity = '0'; return }
    this.applyPlaneContent(targetIndex)
    this.overlayElement.style.opacity = '1'
  }

  render() {}

  dispose() {
    this.overlayElement?.remove()
    this.overlayElement = null
    this.indexElement = null
    this.wordElement = null
    this.chipElement = null
    this.specElement = null
    this.activePlaneIndex = -1
  }
}
