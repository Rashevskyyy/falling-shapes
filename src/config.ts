export const config = {
  background: 0x11141b,

  spawnRate: { min: 0, max: 20, step: 1, initial: 1 },
  gravity: { min: 1, max: 20, step: 1, initial: 5 },
  // one gravity unit in px/s^2
  gravityScale: 60,

  shapeRadius: { min: 22, max: 42 },
  irregularVertices: { min: 5, max: 14 },
  colorSaturation: { min: 60, max: 90 },
  colorLightness: { min: 50, max: 65 },
} as const;
