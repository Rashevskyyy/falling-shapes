import type { Container } from 'pixi.js';
import { Shape } from '../shapes/Shape';

export class ShapeManager {
  private readonly active = new Set<Shape>();

  constructor(private readonly layer: Container) {}

  // fully above the top edge, at a random x where the whole shape fits horizontally
  spawnAbove(points: number[], color: number, width: number): Shape {
    const shape = new Shape(points, color);
    const { minX, maxX, maxY } = shape.extent;
    const from = -minX;
    const to = Math.max(from, width - maxX);

    shape.position.set(from + Math.random() * (to - from), -maxY);
    this.layer.addChild(shape);
    this.active.add(shape);
    return shape;
  }

  remove(shape: Shape): void {
    if (this.active.delete(shape)) {
      shape.destroy();
    }
  }

  update(dt: number, acceleration: number, height: number): void {
    // deleting the current item while iterating a Set is safe
    for (const shape of this.active) {
      shape.fall(dt, acceleration);

      if (shape.isBelow(height)) {
        this.remove(shape);
      }
    }
  }
}
