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
    // Sitodruk emaliami mineralnymi i organicznymi
    fallbackColor: '#1a1a1a',
    accentColor: '#c8a96e',
    textureSrc: '/sitodruk-emaliami.png',
    position: { x: -0.9, y: 0 },
    backgroundColor: '#0a0a0a',
    blob1Color: '#222222',
    blob2Color: '#1a1a1a',
    label: {
      word: 'Sitodruk emaliami',
      spec: 'Mineralne i organiczne',
      color: '#c8a96e',
    },
  },
  {
    // Satynowanie i barwienie butelek
    fallbackColor: '#2a3a4a',
    accentColor: '#8ab0c8',
    textureSrc: '/satynowanie-i-barwienie.png',
    position: { x: 0.8, y: 0 },
    backgroundColor: '#0d1a24',
    blob1Color: '#1a3040',
    blob2Color: '#0a1820',
    label: {
      word: 'Satynowanie',
      spec: 'Barwienie butelek',
      color: '#a8d0e8',
    },
  },
  {
    // Łączenie sitodruku z powlekaniem powierzchni
    fallbackColor: '#1c1c1c',
    accentColor: '#d4a843',
    textureSrc: '/sitodruk-powlekanie.png',
    position: { x: -0.7, y: 0 },
    backgroundColor: '#0e0e0e',
    blob1Color: '#2a2010',
    blob2Color: '#181408',
    label: {
      word: 'Sitodruk + powlekanie',
      spec: 'Technologia hybrydowa',
      color: '#d4a843',
    },
  },
  {
    // Sitodruk UV na powierzchniach o różnych przekrojach
    fallbackColor: '#0a0f1a',
    accentColor: '#4a6aaa',
    textureSrc: '/sitodruk-uv.png',
    position: { x: 1.0, y: 0 },
    backgroundColor: '#060810',
    blob1Color: '#0c1428',
    blob2Color: '#080e1c',
    label: {
      word: 'Sitodruk UV',
      spec: 'Różne przekroje',
      color: '#8aaadd',
    },
  },
  {
    // Powłoki alternatywne dla emalii z metalami szlachetnymi
    fallbackColor: '#1a1408',
    accentColor: '#d4a020',
    textureSrc: '/metale-szlachetne.png',
    position: { x: -0.8, y: 0 },
    backgroundColor: '#0c0a04',
    blob1Color: '#281e08',
    blob2Color: '#1c1404',
    label: {
      word: 'Metale szlachetne',
      spec: 'Powłoki alternatywne',
      color: '#e8c050',
    },
  },
  {
    // Maskowanie selektywne powłok
    fallbackColor: '#141414',
    accentColor: '#909090',
    textureSrc: '/maskowanie-selektywne.png',
    position: { x: 0.9, y: 0 },
    backgroundColor: '#0a0a0a',
    blob1Color: '#1e1e1e',
    blob2Color: '#121212',
    label: {
      word: 'Maskowanie selektywne',
      spec: 'Powłoki częściowe',
      color: '#c0c0c0',
    },
  },
  {
    fallbackColor: '#0a0a14',
    accentColor: '#1313ba',
    textureSrc: '',
    position: { x: 0, y: 0 },
    backgroundColor: '#050510',
    blob1Color: '#0a0a30',
    blob2Color: '#050518',
    label: {
      word: 'cta',
      spec: '',
      color: '#ffffff',
    },
  },
]
