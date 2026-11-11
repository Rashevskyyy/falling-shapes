// Polygons are flat arrays [x0, y0, x1, y1, ...] - the same format Graphics.poly() takes.

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Shoelace formula
export function polygonArea(points: readonly number[]): number {
  const length = points.length;
  let sum = 0;

  for (let i = 0; i < length; i += 2) {
    const j = (i + 2) % length;
    sum += points[i] * points[j + 1] - points[j] * points[i + 1];
  }

  return Math.abs(sum) / 2;
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

/**
 * Area of the part of the polygon that lies inside the given rectangle.
 *
 * Sutherland-Hodgman clipping against the four sides of the rectangle.
 * The rectangle is convex, so this also gives the correct area for concave polygons (stars, irregular shapes).
 */
export function clippedArea(
  points: readonly number[],
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): number {
  let result = clipAgainst(points, 0, minX, 1);
  result = clipAgainst(result, 0, maxX, -1);
  result = clipAgainst(result, 1, minY, 1);
  result = clipAgainst(result, 1, maxY, -1);

  // less than 3 vertices - nothing left
  return result.length < 6 ? 0 : polygonArea(result);
}

/**
 * Keeps the part of the polygon on one side of the line `axis = limit`.
 * direction 1 keeps coordinates >= limit, -1 keeps coordinates <= limit.
 */
function clipAgainst(
  input: readonly number[],
  axis: 0 | 1,
  limit: number,
  direction: 1 | -1,
): number[] {
  const output: number[] = [];
  const length = input.length;

  if (length === 0) {
    return output;
  }

  let prevX = input[length - 2];
  let prevY = input[length - 1];
  let prevInside = ((axis === 0 ? prevX : prevY) - limit) * direction >= 0;

  for (let i = 0; i < length; i += 2) {
    const x = input[i];
    const y = input[i + 1];
    const inside = ((axis === 0 ? x : y) - limit) * direction >= 0;

    if (inside !== prevInside) {
      // the edge crosses the line, so the denominator can't be zero here
      const t = axis === 0 ? (limit - prevX) / (x - prevX) : (limit - prevY) / (y - prevY);
      output.push(prevX + (x - prevX) * t, prevY + (y - prevY) * t);
    }

    if (inside) {
      output.push(x, y);
    }

    prevX = x;
    prevY = y;
    prevInside = inside;
  }

  return output;
}
