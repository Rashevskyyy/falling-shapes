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
  private readonly shapes = new ShapeManager(this.playfield.layer, config.poolLimit);
  private readonly factory = new ShapeFactory();
  private readonly spawner = new Spawner(() => this.spawnFromTop());
  private readonly stats: StatsPanel;
  private readonly steppers: Stepper[];
  private readonly resizeObserver: ResizeObserver;
  private statsTimer = 0;
  private started = false;

  constructor(private readonly elements: GameElements) {
    this.stats = new StatsPanel(elements.stats);
    this.steppers = [
      new Stepper(elements.controls, 'Shapes / sec', this.spawnRate),
      new Stepper(elements.controls, 'Gravity', this.gravity),
    ];
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.resize(entry.contentRect.width, entry.contentRect.height);
    });
  }

  async start(): Promise<void> {
    const { stage } = this.elements;
    const pixelRatio = window.devicePixelRatio || 1;

    await this.app.init({
      width: stage.clientWidth,
      height: stage.clientHeight,
      background: config.background,
      // above 2x the difference isn't visible, but the fill cost on phones is
      resolution: Math.min(pixelRatio, config.maxResolution),
      autoDensity: true,
      // high-dpi screens look smooth without MSAA
      antialias: pixelRatio < 2,
      eventFeatures: { globalMove: false, wheel: false },
    });
    this.started = true;

    stage.prepend(this.app.canvas);
    this.app.stage.addChild(this.playfield);
    this.resize(stage.clientWidth, stage.clientHeight);

    this.playfield.on('pointerdown', this.onPointerDown);
    this.resizeObserver.observe(stage);
    this.app.ticker.add(this.update);
  }

  destroy(): void {
    this.resizeObserver.disconnect();
    this.steppers.forEach((stepper) => stepper.destroy());
    this.stats.destroy();
    this.shapes.destroy();

    if (this.started) {
      this.app.destroy(true, { children: true });
    }
  }

  private readonly update = (ticker: Ticker): void => {
    // deltaMS is capped by ticker.minFPS (100ms by default), so after switching tabs nothing jumps
    const dt = ticker.deltaMS / 1000;
    const { areaWidth, areaHeight } = this.playfield;

    this.spawner.update(dt, this.spawnRate.value);
    this.shapes.update(dt, this.gravity.value * config.gravityScale, areaWidth, areaHeight);

    // the text doesn't need to change 60 times per second
    this.statsTimer += dt;
    if (this.statsTimer >= config.statsInterval) {
      this.statsTimer = 0;
      this.stats.update(this.shapes.visibleCount, this.shapes.visibleArea);
    }
  };

  // pointerdown instead of pointertap: a falling shape can move away between down and up
  private readonly onPointerDown = (event: FederatedPointerEvent): void => {
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
