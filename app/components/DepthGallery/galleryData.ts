export interface GalleryPlaneDefinition {
  fallbackColor: string
  accentColor: string
  textureSrc: string
  position: { x: number; y: number }
  backgroundColor: string
  blob1Color: string
  blob2Color: string
  label: {
    word: string
    spec: string
    color: string
  }
}

export const galleryPlaneData: GalleryPlaneDefinition[] = [
  {
    fallbackColor: '#a8c8e8',
    accentColor: '#7eb8d8',
    textureSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    position: { x: -0.9, y: 0 },
    backgroundColor: '#0a0a0a',
    blob1Color: '#222222',
    blob2Color: '#1a1a1a',
    label: {
      word: 'Hartowane',
      spec: 'ESG 8mm',
      color: '#1a2a3a',
    },
  },
  {
    fallbackColor: '#2c4a6e',
    accentColor: '#3a6090',
    textureSrc: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    position: { x: 0.8, y: 0 },
    backgroundColor: '#1a2a3a',
    blob1Color: '#2c4a6e',
    blob2Color: '#4a7090',
    label: {
      word: 'Laminowane',
      spec: 'VSG 10.76mm',
      color: '#e8f4fc',
    },
  },
  {
    fallbackColor: '#c8d8e0',
    accentColor: '#90b0c0',
    textureSrc: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    position: { x: -0.7, y: 0 },
    backgroundColor: '#f0f4f8',
    blob1Color: '#c0d8e8',
    blob2Color: '#d8eaf4',
    label: {
      word: 'Matowe',
      spec: 'Acid-etched 6mm',
      color: '#2a3a4a',
    },
  },
  {
    fallbackColor: '#1a3a5c',
    accentColor: '#2a5080',
    textureSrc: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    position: { x: 1, y: 0 },
    backgroundColor: '#0a1a2c',
    blob1Color: '#1a4070',
    blob2Color: '#0a2a50',
    label: {
      word: 'Antirefleks',
      spec: 'AR Coating 4mm',
      color: '#c8e0f8',
    },
  },
  {
    fallbackColor: '#e0e8f0',
    accentColor: '#b0c8d8',
    textureSrc: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    position: { x: -0.7, y: 0 },
    backgroundColor: '#d8e8f4',
    blob1Color: '#b8d0e8',
    blob2Color: '#c8dced',
    label: {
      word: 'Float',
      spec: 'Clear 4-19mm',
      color: '#1a2a3a',
    },
  },
]
