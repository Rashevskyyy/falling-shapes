// Polygons are flat arrays [x0, y0, x1, y1, ...] - the same format Graphics.poly() takes.

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function polygonBounds(points: readonly number[], out: Box = createBox()): Box {
  out.minX = Infinity;
  out.minY = Infinity;
  out.maxX = -Infinity;
  out.maxY = -Infinity;

  for (let i = 0; i < points.length; i += 2) {
    const x = points[i];
    const y = points[i + 1];

    if (x < out.minX) {
      out.minX = x;
    }
    if (x > out.maxX) {
      out.maxX = x;
    }
    if (y < out.minY) {
      out.minY = y;
    }
    if (y > out.maxY) {
      out.maxY = y;
    }
  }

  return out;
}

function createBox(): Box {
  return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
}
