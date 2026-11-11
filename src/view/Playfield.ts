import { Container, Graphics, Rectangle } from 'pixi.js';

// The rectangle the shapes fall through.
export class Playfield extends Container {
  readonly layer = new Container();

  private readonly maskShape = new Graphics();
  private readonly rect = new Rectangle();

  constructor() {
    super();
    this.layer.mask = this.maskShape;
    this.addChild(this.layer, this.maskShape);
  }

  get areaWidth(): number {
    return this.rect.width;
  }

  get areaHeight(): number {
    return this.rect.height;
  }

  resize(width: number, height: number): void {
    this.rect.width = width;
    this.rect.height = height;
    this.maskShape.clear().rect(0, 0, width, height).fill(0xffffff);
  }
}
