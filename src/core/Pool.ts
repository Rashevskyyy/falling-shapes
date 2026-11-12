export class Pool<T> {
  private readonly free: T[] = [];

  constructor(
    private readonly create: () => T,
    private readonly dispose: (item: T) => void,
    private readonly limit = Infinity,
  ) {}

  get size(): number {
    return this.free.length;
  }

  get(): T {
    return this.free.pop() ?? this.create();
  }

  // the caller resets the item before giving it back
  release(item: T): void {
    if (this.free.length < this.limit) {
      this.free.push(item);
    } else {
      this.dispose(item);
    }
  }

  clear(): void {
    for (const item of this.free) {
      this.dispose(item);
    }
    this.free.length = 0;
  }
}
