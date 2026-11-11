import { Graphics } from 'pixi.js';
import { polygonBounds, type Box } from '../geometry/polygon';

export class Shape extends Graphics {
  velocity = 0;

  private readonly box: Box = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  constructor(points: number[], color: number) {
    super();
    polygonBounds(points, this.box);

    this.poly(points).fill(color).stroke({ width: 2, color: 0x000000, alpha: 0.25, alignment: 1 });
  }

  // local bounds, relative to the shape position
  get extent(): Readonly<Box> {
    return this.box;
  }

  fall(dt: number, acceleration: number): void {
    // semi-implicit Euler: velocity first, then position
    this.velocity += acceleration * dt;
    this.y += this.velocity * dt;
  }

  isBelow(height: number): boolean {
    return this.y + this.box.minY >= height;
  }
}
