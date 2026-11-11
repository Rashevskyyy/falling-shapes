import { createElement } from './dom';

const numberFormat = new Intl.NumberFormat('en-US');

export class StatsPanel {
  private readonly countValue: HTMLElement;
  private readonly areaValue: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.countValue = this.addField('Shapes');
    this.areaValue = this.addField('Area');
    this.update(0, 0);
  }

  update(count: number, area: number): void {
    this.countValue.textContent = String(count);
    this.areaValue.textContent = `${numberFormat.format(Math.round(area))} px²`;
  }

  private addField(label: string): HTMLElement {
    const field = createElement('div', 'stat');
    const value = createElement('span', 'stat__value');

    field.append(createElement('span', 'stat__label', label), value);
    this.root.append(field);

    return value;
  }
}
