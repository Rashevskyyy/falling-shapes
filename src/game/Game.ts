import { Application, type FederatedPointerEvent, type Ticker } from 'pixi.js';
import { config } from '../config';
import { Shape } from '../shapes/Shape';
import { ShapeFactory } from '../shapes/ShapeFactory';
import { Playfield } from '../view/Playfield';
import { ShapeManager } from './ShapeManager';
import { Spawner } from './Spawner';

export class Game {
  private readonly app = new Application();
  private readonly playfield = new Playfield();
  private readonly shapes = new ShapeManager(this.playfield.layer);
  private readonly factory = new ShapeFactory();
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

    this.playfield.on('pointertap', this.onTap);

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

  private readonly onTap = (event: FederatedPointerEvent): void => {
    if (event.target instanceof Shape) {
      this.shapes.remove(event.target);
      return;
    }

    const { x, y } = event.getLocalPosition(this.playfield);
    this.shapes.spawnAt(this.factory.createIrregular(), x, y);
  };

  private spawnFromTop(): void {
    this.shapes.spawnAbove(this.factory.createRandom(), this.playfield.areaWidth);
  }

  private resize(width: number, height: number): void {
    const w = Math.floor(width);
    const h = Math.floor(height);

    this.app.renderer.resize(w, h);
    this.playfield.resize(w, h);
  }
}
