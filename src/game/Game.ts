import { Application, type Ticker } from 'pixi.js';
import { config } from '../config';
import { regularPolygon } from '../geometry/shapes';
import { Playfield } from '../view/Playfield';
import { ShapeManager } from './ShapeManager';
import { Spawner } from './Spawner';

export class Game {
  private readonly app = new Application();
  private readonly playfield = new Playfield();
  private readonly shapes = new ShapeManager(this.playfield.layer);
  private readonly spawner = new Spawner(() => this.spawnFromTop());

  constructor(private readonly stage: HTMLElement) {}

  async start(): Promise<void> {
    const { stage } = this;

    await this.app.init({
      width: stage.clientWidth,
      height: stage.clientHeight,
      background: config.background,
      antialias: true,
    });

    stage.prepend(this.app.canvas);
    this.app.stage.addChild(this.playfield);
    this.resize(stage.clientWidth, stage.clientHeight);

    const resizeObserver = new ResizeObserver(([entry]) => {
      this.resize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(stage);

    this.app.ticker.add(this.update);
  }

  private readonly update = (ticker: Ticker): void => {
    const dt = ticker.deltaMS / 1000;

    this.spawner.update(dt, config.spawnRate);
    this.shapes.update(dt, config.gravity, this.playfield.areaHeight);
  };

  private spawnFromTop(): void {
    const { min, max } = config.shapeRadius;
    const radius = min + Math.random() * (max - min);

    this.shapes.spawnAbove(regularPolygon(3, radius), 0x7aa2ff, this.playfield.areaWidth);
  }

  private resize(width: number, height: number): void {
    const w = Math.floor(width);
    const h = Math.floor(height);

    this.app.renderer.resize(w, h);
    this.playfield.resize(w, h);
  }
}
