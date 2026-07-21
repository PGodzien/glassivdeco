import type { Gallery } from './Gallery'

export class Label {
  private gallery: Gallery
  private overlayElement: HTMLElement | null = null
  private indexElement: HTMLElement | null = null
  private wordElement: HTMLElement | null = null
  private chipElement: HTMLElement | null = null
  private specElement: HTMLElement | null = null
  private ctaElement: HTMLElement | null = null
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
      <div class="depth-label-cta" style="
        display: none;
        position: absolute;
        inset: 0;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 32px;
        pointer-events: none;
      ">
        <p style="
          font-family: var(--font-syncopate), sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          text-align: center;
          line-height: 1.1;
        ">Zapraszamy do<br/>kontaktu z nami</p>
        <a href="#kontakt" style="
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-family: var(--font-inter), sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          pointer-events: auto;
        ">
          <svg width="14" height="8" viewBox="0 0 16 9" fill="none">
            <path d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z" fill="white"/>
          </svg>
          Skontaktuj się
        </a>
      </div>
    `
    this.overlayElement = el
    this.indexElement = el.querySelector('.depth-label-index')
    this.wordElement = el.querySelector('.depth-label-word')
    this.chipElement = el.querySelector('.depth-label-chip')
    this.specElement = el.querySelector('.depth-label-spec')
    this.ctaElement = el.querySelector('.depth-label-cta')
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
    const isCTA = label.word === 'cta'

    const leftEl = this.overlayElement?.querySelector('.depth-label-left') as HTMLElement | null
    const rightEl = this.overlayElement?.querySelector('.depth-label-right') as HTMLElement | null

    if (isCTA) {
      if (leftEl) leftEl.style.display = 'none'
      if (rightEl) rightEl.style.display = 'none'
      if (this.ctaElement) this.ctaElement.style.display = 'flex'
    } else {
      if (leftEl) leftEl.style.display = ''
      if (rightEl) rightEl.style.display = ''
      if (this.ctaElement) this.ctaElement.style.display = 'none'
      if (this.indexElement) this.indexElement.textContent = String(planeIndex + 1).padStart(2, '0')
      if (this.wordElement) this.wordElement.textContent = label.word || ''
      if (this.chipElement) (this.chipElement as HTMLElement).style.backgroundColor = plane.userData.accentColor || ''
      if (this.specElement) this.specElement.textContent = label.spec || ''
      if (this.overlayElement) this.overlayElement.style.color = label.color || ''
    }

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
    this.ctaElement = null
    this.activePlaneIndex = -1
  }
}
