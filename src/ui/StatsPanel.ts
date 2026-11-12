import { createElement } from './dom';

const numberFormat = new Intl.NumberFormat('en-US');

export class StatsPanel {
  private readonly countValue: HTMLElement;
  private readonly areaValue: HTMLElement;
  private count = -1;
  private area = -1;

  constructor(private readonly root: HTMLElement) {
    this.countValue = this.addField('Shapes');
    this.areaValue = this.addField('Area');
    this.update(0, 0);
  }

  // touches the DOM only when a value really changed
  update(count: number, area: number): void {
    const roundedArea = Math.round(area);

    if (count !== this.count) {
      this.count = count;
      this.countValue.textContent = String(count);
    }

    if (roundedArea !== this.area) {
      this.area = roundedArea;
      this.areaValue.textContent = `${numberFormat.format(roundedArea)} px²`;
    }
  }

  destroy(): void {
    this.root.replaceChildren();
  }

  private addField(label: string): HTMLElement {
    const field = createElement('div', 'stat');
    const value = createElement('span', 'stat__value');

    field.append(createElement('span', 'stat__label', label), value);
    this.root.append(field);

    return value;
  }
}
