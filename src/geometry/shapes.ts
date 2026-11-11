// All shapes are built around (0, 0), so the shape position is its center.

const TAU = Math.PI * 2;

// rotation -PI/2 puts the first vertex at the top
export function regularPolygon(sides: number, radius: number, rotation = -Math.PI / 2): number[] {
  const points: number[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = rotation + (i / sides) * TAU;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  return points;
}

// Circles and ellipses are kept as polygons too, so area, clipping and hit testing work the same way
// for every shape. About 6px per segment - not noticeable at these sizes.
export function ellipse(radiusX: number, radiusY: number): number[] {
  const segments = Math.max(24, Math.ceil((TAU * Math.max(radiusX, radiusY)) / 6));
  const points: number[] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * TAU;
    points.push(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY);
  }

  return points;
}

export function star(spikes: number, outerRadius: number, innerRadius: number): number[] {
  const count = spikes * 2;
  const points: number[] = [];

  for (let i = 0; i < count; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (i / count) * TAU;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  return points;
}
