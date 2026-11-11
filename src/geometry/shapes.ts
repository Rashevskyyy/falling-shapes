// all shapes are built around (0, 0), so the shape position is its center.

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
