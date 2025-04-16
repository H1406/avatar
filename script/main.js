import { Application, Container, Assets } from 'pixi.js';
import { Game } from './game.js';
// Entry point
(async () => {
  const game = new Game();
  await game.init();
})();