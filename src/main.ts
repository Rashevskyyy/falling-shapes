import { Application } from 'pixi.js';
import './styles.css';

async function init(): Promise<void> {
  const stage = document.getElementById('stage');
  if (!stage) {
    throw new Error('Element #stage not found');
  }

  const app = new Application();
  await app.init({ resizeTo: stage, background: 0x11141b, antialias: true });
  stage.appendChild(app.canvas);
}

init().catch((error: unknown) => {
  console.error('Failed to start', error);
});
