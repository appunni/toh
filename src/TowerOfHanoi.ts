export interface Disk {
  id: number;
  size: number;
  color: string;
}

export interface Tower {
  id: number;
  disks: Disk[];
}

export interface GameState {
  towers: Tower[];
  moves: number;
  isComplete: boolean;
  selectedDisk: Disk | null;
}

export class TowerOfHanoi {
  private gameState: GameState;
  private diskCount: number;
  private onStateChange: (state: GameState) => void;

  constructor(diskCount: number = 3, onStateChange: (state: GameState) => void) {
    this.diskCount = diskCount;
    this.onStateChange = onStateChange;
    this.gameState = this.initializeGame();
  }

  private initializeGame(): GameState {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];

    const disks: Disk[] = [];
    for (let i = this.diskCount; i >= 1; i--) {
      disks.push({
        id: i,
        size: i,
        color: colors[i - 1] || '#888'
      });
    }

    return {
      towers: [
        { id: 0, disks: disks },
        { id: 1, disks: [] },
        { id: 2, disks: [] }
      ],
      moves: 0,
      isComplete: false,
      selectedDisk: null
    };
  }

  public getState(): GameState {
    return { ...this.gameState };
  }

  public selectDisk(disk: Disk): boolean {
    const tower = this.gameState.towers.find(t => 
      t.disks.length > 0 && t.disks[t.disks.length - 1].id === disk.id
    );
    
    if (!tower) return false;

    this.gameState.selectedDisk = disk;
    this.onStateChange(this.gameState);
    return true;
  }

  public moveDisk(fromTowerId: number, toTowerId: number): boolean {
    const fromTower = this.gameState.towers[fromTowerId];
    const toTower = this.gameState.towers[toTowerId];

    if (!fromTower || !toTower || fromTower.disks.length === 0) {
      return false;
    }

    const diskToMove = fromTower.disks[fromTower.disks.length - 1];
    const topDiskOnDestination = toTower.disks.length > 0 ? 
      toTower.disks[toTower.disks.length - 1] : null;

    // Check if move is valid (smaller disk on top of larger disk)
    if (topDiskOnDestination && diskToMove.size > topDiskOnDestination.size) {
      return false;
    }

    // Move the disk
    fromTower.disks.pop();
    toTower.disks.push(diskToMove);
    this.gameState.moves++;
    this.gameState.selectedDisk = null;

    // Check for win condition
    if (this.gameState.towers[2].disks.length === this.diskCount) {
      this.gameState.isComplete = true;
    }

    this.onStateChange(this.gameState);
    return true;
  }

  public reset(): void {
    this.gameState = this.initializeGame();
    this.onStateChange(this.gameState);
  }

  public getOptimalMoves(): number {
    return Math.pow(2, this.diskCount) - 1;
  }
}
