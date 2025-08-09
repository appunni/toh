import './style.css';
import { TowerOfHanoi } from './TowerOfHanoi';
import { UIRenderer } from './UIRenderer';
import { observeViewport } from './utils/viewport';

class App {
  private game: TowerOfHanoi;
  private ui: UIRenderer;
  private root: HTMLElement;

  constructor() {
    this.root = document.getElementById('app')!;
    this.game = new TowerOfHanoi(3, () => this.render());

    this.ui = new UIRenderer(
      this.root,
      (fromTower, toTower) => this.game.move(fromTower, toTower),
      () => this.game.reset(),
      (diskCount) => this.setDifficulty(diskCount)
    );

    observeViewport(() => this.render());

    this.render();
  }

  private render() {
    this.ui.render(this.game.getState(), this.game.optimalMoves());
  }

  private setDifficulty(diskCount: number) {
    this.game = new TowerOfHanoi(diskCount, () => this.render());
    this.render();
  }
}

new App();
