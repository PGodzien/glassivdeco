import * as THREE from 'three'

interface Particle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  lifeRemaining: number
  totalLife: number
}

export class TrailHeadParticles {
  private group = new THREE.Group()
  isEnabled = true
  private maxParticles = 18
  private spawnPerSecond = 20
  private spawnRadius = 0.52
  private speedMin = 0.05
  private speedMax = 0.22
  private lifeMin = 0.25
  private lifeMax = 0.6
  private sizeMin = 0.007
  private sizeMax = 0.02
  private dragPerFrame = 0.94
  private spawnAccumulator = 0
  private nextSpawnIndex = 0
  private sharedGeometry = new THREE.SphereGeometry(1, 5, 4)
  particles: Particle[] = []

  constructor() {
    this.group.renderOrder = 1300
    for (let i = 0; i < this.maxParticles; i++) {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#d0e8f8'), transparent: true, opacity: 0, depthWrite: false, depthTest: false })
      const mesh = new THREE.Mesh(this.sharedGeometry, material)
      mesh.visible = false
      this.group.add(mesh)
      this.particles.push({ mesh, velocity: new THREE.Vector3(), lifeRemaining: 0, totalLife: 0 })
    }
  }

  get object() { return this.group }

  setEnabled(isEnabled: boolean) {
    if (this.isEnabled && !isEnabled) this.clear()
    this.isEnabled = Boolean(isEnabled)
    this.group.visible = this.isEnabled
  }

  update(deltaSeconds: number, headPosition: THREE.Vector3, opacity = 1, shouldSpawn = true) {
    const safeDelta = Math.min(Math.max(deltaSeconds || 0, 0), 0.1)
    if (this.isEnabled && shouldSpawn && safeDelta > 0) {
      this.spawnAccumulator += safeDelta * this.spawnPerSecond
      const spawnCount = Math.floor(this.spawnAccumulator)
      this.spawnAccumulator -= spawnCount
      for (let i = 0; i < spawnCount; i++) this.spawnParticle(headPosition)
    } else {
      this.spawnAccumulator = 0
    }
    const clampedOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
    const drag = Math.pow(this.dragPerFrame, safeDelta * 60)
    this.particles.forEach(p => {
      if (p.lifeRemaining <= 0) return
      p.lifeRemaining -= safeDelta
      if (p.lifeRemaining <= 0) { p.lifeRemaining = 0; p.mesh.visible = false; (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0; return }
      p.velocity.multiplyScalar(drag)
      p.mesh.position.addScaledVector(p.velocity, safeDelta)
      const lifeRatio = p.lifeRemaining / p.totalLife
      ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = lifeRatio * clampedOpacity * 0.75
    })
  }

  private spawnParticle(headPosition: THREE.Vector3) {
    const p = this.particles[this.nextSpawnIndex]
    this.nextSpawnIndex = (this.nextSpawnIndex + 1) % this.particles.length
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * this.spawnRadius
    p.mesh.position.set(headPosition.x + Math.cos(angle) * radius, headPosition.y + (Math.random() - 0.5) * this.spawnRadius * 0.6, headPosition.z + Math.sin(angle) * radius)
    const size = THREE.MathUtils.lerp(this.sizeMin, this.sizeMax, Math.random())
    p.mesh.scale.setScalar(size)
    p.mesh.visible = true
    const speed = THREE.MathUtils.lerp(this.speedMin, this.speedMax, Math.random())
    p.velocity.set((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed * 0.6, (Math.random() - 0.5) * speed)
    p.totalLife = THREE.MathUtils.lerp(this.lifeMin, this.lifeMax, Math.random())
    p.lifeRemaining = p.totalLife
    ;(p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.4
  }

  clear() {
    this.spawnAccumulator = 0
    this.particles.forEach(p => { p.lifeRemaining = 0; p.totalLife = 0; p.mesh.visible = false; (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0 })
  }

  dispose() {
    this.clear()
    this.particles.forEach(p => (p.mesh.material as THREE.MeshBasicMaterial).dispose())
    this.sharedGeometry.dispose()
    this.group.clear()
    this.particles = []
  }
}
