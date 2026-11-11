import './styles.css';
import { Game } from './game/Game';

const stage = document.getElementById('stage');
if (!stage) {
  throw new Error('Element #stage not found');
}

const game = new Game(stage);

game.start().catch((err) => console.error(err));
