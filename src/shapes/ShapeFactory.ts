import { Color } from 'pixi.js';
import { config } from '../config';
import { ellipse, irregularPolygon, regularPolygon, star } from '../geometry/shapes';
import { pick, randomInt, randomRange } from '../utils/random';

export type ShapeKind =
  'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle' | 'ellipse' | 'star' | 'irregular';

export interface ShapeData {
  kind: ShapeKind;
  color: number;
  points: number[];
}

// kinds used by the automatic spawner, irregular shapes come from clicks only
const RANDOM_KINDS: readonly ShapeKind[] = [
  'triangle',
  'square',
  'pentagon',
  'hexagon',
  'circle',
  'ellipse',
  'star',
];

export class ShapeFactory {
  // Record<ShapeKind, ...> makes TS complain if a new kind is added without a builder
  private readonly builders: Record<ShapeKind, (radius: number) => number[]> = {
    triangle: (r) => regularPolygon(3, r),
    square: (r) => regularPolygon(4, r, -Math.PI / 4),
    pentagon: (r) => regularPolygon(5, r),
    hexagon: (r) => regularPolygon(6, r),
    circle: (r) => ellipse(r, r),
    ellipse: (r) => ellipse(r, r * randomRange(0.45, 0.7)),
    star: (r) => star(5, r, r * 0.45),
    irregular: (r) => {
      const { min, max } = config.irregularVertices;
      return irregularPolygon(randomInt(min, max), r);
    },
  };

  create(kind: ShapeKind): ShapeData {
    const { min, max } = config.shapeRadius;

    return {
      kind,
      color: this.randomColor(),
      points: this.builders[kind](randomRange(min, max)),
    };
  }

  createRandom(): ShapeData {
    return this.create(pick(RANDOM_KINDS));
  }

  createIrregular(): ShapeData {
    return this.create('irregular');
  }

  // random hue, but saturation and lightness in a range, so the shapes stay bright on the dark background
  private randomColor(): number {
    const { colorSaturation, colorLightness } = config;

    return new Color({
      h: randomRange(0, 360),
      s: randomRange(colorSaturation.min, colorSaturation.max),
      l: randomRange(colorLightness.min, colorLightness.max),
    }).toNumber();
  }
}
