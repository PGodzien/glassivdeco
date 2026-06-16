import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform vec3 uBackgroundColor;
uniform vec3 uBlob1Color;
uniform vec3 uBlob2Color;
uniform float uNoiseStrength;
uniform float uBlobRadius;
uniform float uBlobRadiusSecondary;
uniform float uBlobStrength;
uniform float uTime;
uniform float uVelocityIntensity;

float random(vec2 coord) {
  return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec3 color = uBackgroundColor;
  float animTime = uTime * 0.00028;
  vec2 blob1Center = vec2(
    0.50 + sin(animTime * 1.000) * 0.13 + sin(animTime * 1.618) * 0.05,
    0.48 + cos(animTime * 0.794) * 0.09 + cos(animTime * 1.272) * 0.03
  );
  vec2 blob2Center = vec2(
    0.35 + cos(animTime * 0.927) * 0.11 + cos(animTime * 1.414) * 0.04,
    0.55 + sin(animTime * 1.175) * 0.07 + sin(animTime * 0.618) * 0.03
  );
  float blob1 = smoothstep(uBlobRadius, 0.0, distance(vUv, blob1Center));
  float blob2 = smoothstep(uBlobRadiusSecondary, 0.0, distance(vUv, blob2Center));
  vec3 blob1SoftColor = mix(uBlob1Color, uBackgroundColor, 0.35);
  vec3 blob2SoftColor = mix(uBlob2Color, uBackgroundColor, 0.35);
  color = mix(color, blob1SoftColor, blob1 * uBlobStrength);
  color = mix(color, blob2SoftColor, blob2 * uBlobStrength);
  color += uVelocityIntensity * 0.10;
  float grain = random(vUv * vec2(1387.13, 947.91)) - 0.5;
  color += grain * uNoiseStrength;
  color = clamp(color, 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`

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

interface MotionResponse {
  depthProgress: number
  velocityIntensity: number
}

export class Background {
  private scene: THREE.Scene | null = null
  private camera: THREE.OrthographicCamera | null = null
  private material: THREE.ShaderMaterial | null = null
  private mesh: THREE.Mesh | null = null
  private isInitialized = false

  private backgroundColor = new THREE.Color('#e8f4fc')
  private blob1Color = new THREE.Color('#a8d8f0')
  private blob2Color = new THREE.Color('#c8e8f8')
  private nextBackgroundColor = new THREE.Color()
  private nextBlob1Color = new THREE.Color()
  private nextBlob2Color = new THREE.Color()

  private baseBlobRadius = 0.65
  private secondaryBlobRadiusRatio = 0.78
  private baseBlobStrength = 0.9
  private depthToRadiusAmount = 0.08
  private velocityToStrengthAmount = 0.1
  private motionSmoothing = 0.1
  private motionDepthProgress = 0
  private motionVelocityIntensity = 0
  private smoothedDepthProgress = 0
  private smoothedVelocityIntensity = 0
  private blobRadius = 0.65
  private blobStrength = 0.9
  private noiseStrength = 0.04

  init() {
    if (this.isInitialized) return
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uBackgroundColor: { value: this.backgroundColor },
        uBlob1Color: { value: this.blob1Color },
        uBlob2Color: { value: this.blob2Color },
        uNoiseStrength: { value: this.noiseStrength },
        uBlobRadius: { value: this.blobRadius },
        uBlobRadiusSecondary: { value: this.blobRadius * this.secondaryBlobRadiusRatio },
        uBlobStrength: { value: this.blobStrength },
        uTime: { value: 0 },
        uVelocityIntensity: { value: 0 },
      },
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.scene.add(this.mesh)
    this.applyMotionToBlob()
    this.isInitialized = true
  }

  setMoodBlend({ currentMood, nextMood, blend }: MoodBlendData) {
    if (!currentMood) return
    const safeBlend = THREE.MathUtils.clamp(blend ?? 0, 0, 1)
    if (!nextMood || safeBlend <= 0) {
      if (currentMood.background) this.backgroundColor.set(currentMood.background)
      if (currentMood.blob1) this.blob1Color.set(currentMood.blob1)
      if (currentMood.blob2) this.blob2Color.set(currentMood.blob2)
      this.updateUniformColors()
      return
    }
    this.backgroundColor.set(currentMood.background).lerp(this.nextBackgroundColor.set(nextMood.background), safeBlend)
    this.blob1Color.set(currentMood.blob1).lerp(this.nextBlob1Color.set(nextMood.blob1), safeBlend)
    this.blob2Color.set(currentMood.blob2).lerp(this.nextBlob2Color.set(nextMood.blob2), safeBlend)
    this.updateUniformColors()
  }

  private updateUniformColors() {
    if (!this.material) return
    this.material.uniforms.uBackgroundColor.value.copy(this.backgroundColor)
    this.material.uniforms.uBlob1Color.value.copy(this.blob1Color)
    this.material.uniforms.uBlob2Color.value.copy(this.blob2Color)
    this.material.uniforms.uNoiseStrength.value = this.noiseStrength
  }

  private updateBlobUniforms() {
    if (!this.material) return
    this.material.uniforms.uBlobRadius.value = this.blobRadius
    this.material.uniforms.uBlobRadiusSecondary.value = this.blobRadius * this.secondaryBlobRadiusRatio
    this.material.uniforms.uBlobStrength.value = this.blobStrength
  }

  setMotionResponse({ depthProgress, velocityIntensity }: MotionResponse) {
    if (Number.isFinite(depthProgress)) this.motionDepthProgress = THREE.MathUtils.clamp(depthProgress, 0, 1)
    if (Number.isFinite(velocityIntensity)) this.motionVelocityIntensity = THREE.MathUtils.clamp(velocityIntensity, 0, 1)
  }

  private applyMotionToBlob() {
    const nextBlobRadius = this.baseBlobRadius + this.smoothedDepthProgress * this.depthToRadiusAmount
    const nextBlobStrength = this.baseBlobStrength + this.smoothedVelocityIntensity * this.velocityToStrengthAmount
    this.blobRadius = THREE.MathUtils.clamp(nextBlobRadius, 0.05, 1)
    this.blobStrength = THREE.MathUtils.clamp(nextBlobStrength, 0, 1)
    this.updateBlobUniforms()
  }

  update(time: number = 0) {
    this.smoothedDepthProgress = THREE.MathUtils.lerp(this.smoothedDepthProgress, this.motionDepthProgress, this.motionSmoothing)
    this.smoothedVelocityIntensity = THREE.MathUtils.lerp(this.smoothedVelocityIntensity, this.motionVelocityIntensity, this.motionSmoothing)
    if (this.material) {
      this.material.uniforms.uTime.value = time
      this.material.uniforms.uVelocityIntensity.value = this.smoothedVelocityIntensity
    }
    this.applyMotionToBlob()
  }

  render(renderer: THREE.WebGLRenderer) {
    if (!this.isInitialized || !this.scene || !this.camera) return
    renderer.render(this.scene, this.camera)
  }

  dispose() {
    if (!this.isInitialized) return
    this.mesh?.geometry.dispose()
    this.material?.dispose()
    this.scene?.clear()
    this.scene = null
    this.camera = null
    this.mesh = null
    this.material = null
    this.isInitialized = false
  }
}
