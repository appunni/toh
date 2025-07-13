import './style.css'
import { TowerOfHanoi } from './TowerOfHanoi'
import { UIRenderer } from './UIRenderer'

class TowerOfHanoiApp {
  private game: TowerOfHanoi;
  private renderer: UIRenderer;
  private container: HTMLElement;

  constructor() {
    this.container = document.querySelector<HTMLDivElement>('#app')!;
    
    // Initialize with 3 disks by default
    this.game = new TowerOfHanoi(3, this.onGameStateChange.bind(this));
    
    this.renderer = new UIRenderer(
      this.container,
      this.onDiskMove.bind(this),
      this.onReset.bind(this),
      this.onDifficultyChange.bind(this)
    );

    this.render();
  }

  private onGameStateChange(): void {
    this.render();
  }

  private onDiskMove(fromTower: number, toTower: number): boolean {
    return this.game.moveDisk(fromTower, toTower);
  }

  private onReset(): void {
    this.game.reset();
  }

  private onDifficultyChange(diskCount: number): void {
    this.game = new TowerOfHanoi(diskCount, this.onGameStateChange.bind(this));
    this.render();
  }

  private render(): void {
    const state = this.game.getState();
    const optimalMoves = this.game.getOptimalMoves();
    
    this.renderer.render(state, optimalMoves);
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TowerOfHanoiApp();
});
