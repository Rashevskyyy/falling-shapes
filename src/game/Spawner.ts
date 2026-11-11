// calls onSpawn `rate` times per second.
// progress is counted in "shapes", not seconds, so changing the rate doesn't cause a burst of spawns.
export class Spawner {
  private progress = 0;

  constructor(private readonly onSpawn: () => void) {}

  update(dt: number, rate: number): void {
    this.progress += dt * rate;

    while (this.progress >= 1) {
      this.progress -= 1;
      this.onSpawn();
    }
  }
}
