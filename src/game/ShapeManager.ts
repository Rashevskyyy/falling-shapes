import type { Container } from 'pixi.js';
import { Pool } from '../core/Pool';
import { Shape } from '../shapes/Shape';
import type { ShapeData } from '../shapes/ShapeFactory';
import { randomRange } from '../utils/random';

export class ShapeManager {
  private readonly active = new Set<Shape>();
  private readonly pool: Pool<Shape>;
  private count = 0;
  private area = 0;

  constructor(
    private readonly layer: Container,
    poolLimit: number,
  ) {
    this.pool = new Pool(
      () => new Shape(),
      (shape) => shape.destroy(),
      poolLimit,
    );
  }

  // shapes that are at least partly inside the rectangle, updated every frame
  get visibleCount(): number {
    return this.count;
  }

  get visibleArea(): number {
    return this.area;
  }

  spawnAt(data: ShapeData, x: number, y: number): Shape {
    const shape = this.pool.get().init(data);
    shape.position.set(x, y);
    this.layer.addChild(shape);
    this.active.add(shape);
    return shape;
  }

  // Fully above the top edge, at a random x where the whole shape fits horizontally
  spawnAbove(data: ShapeData, width: number): Shape {
    const shape = this.spawnAt(data, 0, 0);
    const { minX, maxX, maxY } = shape.extent;
    const from = -minX;
    const to = Math.max(from, width - maxX);

    shape.position.set(randomRange(from, to), -maxY);
    return shape;
  }

  remove(shape: Shape): void {
    if (!this.active.delete(shape)) {
      return;
    }

    this.layer.removeChild(shape);
    shape.reset();
    this.pool.release(shape);
  }

  update(dt: number, acceleration: number, width: number, height: number): void {
    let count = 0;
    let area = 0;

    // deleting the current item while iterating a Set is safe
    for (const shape of this.active) {
      shape.fall(dt, acceleration);

      if (shape.isBelow(height)) {
        this.remove(shape);
        continue;
      }

      const visible = shape.visibleArea(width, height);
      if (visible > 0) {
        count++;
        area += visible;
      }
    }

    this.count = count;
    this.area = area;
  }

  destroy(): void {
    for (const shape of this.active) {
      shape.destroy();
    }
    this.active.clear();
    this.pool.clear();
  }
}
