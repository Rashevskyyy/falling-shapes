import type { RangeValue } from '../core/RangeValue';
import { createElement } from './dom';

// "- value +" control bound to a RangeValue
export class Stepper {
  private readonly root: HTMLElement;
  private readonly output: HTMLOutputElement;
  private readonly decreaseButton: HTMLButtonElement;
  private readonly increaseButton: HTMLButtonElement;
  private readonly unsubscribe: () => void;

  constructor(
    container: HTMLElement,
    label: string,
    private readonly range: RangeValue,
  ) {
    this.root = createElement('div', 'stepper');
    this.output = createElement('output', 'stepper__value');
    this.decreaseButton = this.createButton('−', `Decrease ${label}`, () => range.decrement());
    this.increaseButton = this.createButton('+', `Increase ${label}`, () => range.increment());

    const row = createElement('div', 'stepper__row');
    row.append(this.decreaseButton, this.output, this.increaseButton);
    this.root.append(row, createElement('span', 'stepper__label', label));
    container.append(this.root);

    this.unsubscribe = range.subscribe(() => this.render());
    this.render();
  }

  destroy(): void {
    this.unsubscribe();
    this.root.remove();
  }

  private render(): void {
    this.output.value = String(this.range.value);
    this.decreaseButton.disabled = this.range.isMin;
    this.increaseButton.disabled = this.range.isMax;
  }

  private createButton(text: string, ariaLabel: string, onClick: () => void): HTMLButtonElement {
    const button = createElement('button', 'stepper__button', text);
    button.type = 'button';
    button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', onClick);
    return button;
  }
}
