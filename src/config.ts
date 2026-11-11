export const config = {
  background: 0x11141b,

  // shapes per second
  spawnRate: 1,
  // px/s^2
  gravity: 300,

  shapeRadius: { min: 22, max: 42 },
  irregularVertices: { min: 5, max: 14 },
  colorSaturation: { min: 60, max: 90 },
  colorLightness: { min: 50, max: 65 },
} as const;
