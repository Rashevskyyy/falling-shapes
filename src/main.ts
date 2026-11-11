import './styles.css';
import { Game } from './game/Game';

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element #${id} not found`);
  }
  return element;
}

const game = new Game({
  stage: getElement('stage'),
  stats: getElement('stats'),
});

game.start().catch((err) => console.error(err));
