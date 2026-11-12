export interface RangeOptions {
  min: number;
  max: number;
  step: number;
  initial: number;
}

type Listener = (value: number) => void;

// A number limited to [min, max] that notifies subscribers when it changes.
export class RangeValue {
  readonly min: number;
  readonly max: number;
  readonly step: number;

  private current: number;
  private readonly listeners = new Set<Listener>();

  constructor({ min, max, step, initial }: RangeOptions) {
    this.min = min;
    this.max = max;
    this.step = step;
    this.current = this.clamp(initial);
  }

  get value(): number {
    return this.current;
  }

  set value(next: number) {
    const value = this.clamp(next);
    if (value === this.current) {
      return;
    }

    this.current = value;
    this.listeners.forEach((listener) => listener(value));
  }

  get isMin(): boolean {
    return this.current <= this.min;
  }

  get isMax(): boolean {
    return this.current >= this.max;
  }

  increment(): void {
    this.value = this.current + this.step;
  }

  decrement(): void {
    this.value = this.current - this.step;
  }

  // returns a function that removes the listener
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private clamp(value: number): number {
    return Math.min(this.max, Math.max(this.min, value));
  }
}
