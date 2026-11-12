import { Graphics } from 'pixi.js';
import { clippedArea, polygonArea, polygonBounds, type Box } from '../geometry/polygon';
import type { ShapeData } from './ShapeFactory';

export class Shape extends Graphics {
  velocity = 0;
  // full area of the polygon, calculated once in init()
  surfaceArea = 0;

  private points: number[] = [];
  private readonly box: Box = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  constructor() {
    super();
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  // local bounds, relative to the shape position
  get extent(): Readonly<Box> {
    return this.box;
  }

  init(data: ShapeData): this {
    this.points = data.points;
    this.surfaceArea = polygonArea(data.points);
    polygonBounds(data.points, this.box);
    this.velocity = 0;

    // inner stroke, so nothing is drawn outside the polygon and the area stays exact
    this.clear()
      .poly(data.points)
      .fill(data.color)
      .stroke({ width: 2, color: 0x000000, alpha: 0.25, alignment: 1 });

    return this;
  }

  fall(dt: number, acceleration: number): void {
    // semi-implicit Euler: velocity first, then position
    this.velocity += acceleration * dt;
    this.y += this.velocity * dt;
  }

  isBelow(height: number): boolean {
    return this.y + this.box.minY >= height;
  }

  // Area of the shape inside the (0, 0, width, height) rectangle
  visibleArea(width: number, height: number): number {
    const left = this.x + this.box.minX;
    const right = this.x + this.box.maxX;
    const top = this.y + this.box.minY;
    const bottom = this.y + this.box.maxY;

    if (right <= 0 || left >= width || bottom <= 0 || top >= height) {
      return 0;
    }

    if (left >= 0 && right <= width && top >= 0 && bottom <= height) {
      return this.surfaceArea;
    }

    // only shapes crossing an edge get here; the rect is moved to local space instead of moving the points
    return clippedArea(this.points, -this.x, -this.y, width - this.x, height - this.y);
  }

  reset(): void {
    this.clear();
    this.points = [];
    this.velocity = 0;
    this.surfaceArea = 0;
    this.position.set(0, 0);
  }
}
