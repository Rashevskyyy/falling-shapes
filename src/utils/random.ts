export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// inclusive on both ends
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
