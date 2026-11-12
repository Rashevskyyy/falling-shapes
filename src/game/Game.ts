import { Application, type FederatedPointerEvent, type Ticker } from 'pixi.js';
import { config } from '../config';
import { RangeValue } from '../core/RangeValue';
import { Shape } from '../shapes/Shape';
import { ShapeFactory } from '../shapes/ShapeFactory';
import { StatsPanel } from '../ui/StatsPanel';
import { Stepper } from '../ui/Stepper';
import { Playfield } from '../view/Playfield';
import { ShapeManager } from './ShapeManager';
import { Spawner } from './Spawner';

export interface GameElements {
  stage: HTMLElement;
  stats: HTMLElement;
  controls: HTMLElement;
}

export class Game {
  private readonly spawnRate = new RangeValue(config.spawnRate);
  private readonly gravity = new RangeValue(config.gravity);
  private readonly app = new Application();
  private readonly playfield = new Playfield();
  private readonly shapes = new ShapeManager(this.playfield.layer);
  private readonly factory = new ShapeFactory();
  private readonly spawner = new Spawner(() => this.spawnFromTop());
  private readonly stats: StatsPanel;

  constructor(private readonly elements: GameElements) {
    this.stats = new StatsPanel(elements.stats);
    new Stepper(elements.controls, 'Shapes / sec', this.spawnRate);
    new Stepper(elements.controls, 'Gravity', this.gravity);
  }

  async start(): Promise<void> {
    const { stage } = this.elements;

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
    const { areaWidth, areaHeight } = this.playfield;

    this.spawner.update(dt, this.spawnRate.value);
    this.shapes.update(dt, this.gravity.value * config.gravityScale, areaWidth, areaHeight);
    this.stats.update(this.shapes.visibleCount, this.shapes.visibleArea);
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
