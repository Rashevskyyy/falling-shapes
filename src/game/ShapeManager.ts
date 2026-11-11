import type { Container } from 'pixi.js';
import { Shape } from '../shapes/Shape';
import type { ShapeData } from '../shapes/ShapeFactory';
import { randomRange } from '../utils/random';

export class ShapeManager {
  private readonly active = new Set<Shape>();

  constructor(private readonly layer: Container) {}

  spawnAt(data: ShapeData, x: number, y: number): Shape {
    const shape = new Shape(data);
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
