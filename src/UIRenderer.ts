import { Disk, Tower, GameState } from './TowerOfHanoi';

export class UIRenderer {
  private container: HTMLElement;
  private gameState: GameState;
  private onDiskMove: (fromTower: number, toTower: number) => boolean;
  private onReset: () => void;
  private onDifficultyChange: (difficulty: number) => void;
  private draggedDisk: Disk | null = null;
  private draggedFromTower: number | null = null;

  constructor(
    container: HTMLElement,
    onDiskMove: (fromTower: number, toTower: number) => boolean,
    onReset: () => void,
    onDifficultyChange: (difficulty: number) => void
  ) {
    this.container = container;
    this.onDiskMove = onDiskMove;
    this.onReset = onReset;
    this.onDifficultyChange = onDifficultyChange;
    this.gameState = {
      towers: [],
      moves: 0,
      isComplete: false,
      selectedDisk: null
    };
  }

  public render(gameState: GameState, optimalMoves: number): void {
    this.gameState = gameState;
    
    // Check if info modal is currently visible before re-rendering
    const existingModal = document.getElementById('info-modal');
    const wasModalVisible = existingModal && !existingModal.classList.contains('hidden');
    
    this.container.innerHTML = `
      <div class="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 min-h-screen flex flex-col">
        <div class="max-w-6xl mx-auto p-2 md:p-4 flex-1 flex flex-col">
          <!-- Compact Header Bar -->
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 mb-4 border border-white/20 shadow-lg">
            <div class="flex items-center justify-between gap-3 md:gap-6">
              <!-- Title -->
              <h1 class="text-lg md:text-2xl font-bold text-white tracking-wide">
                Tower of Hanoi
              </h1>
              
              <!-- Difficulty Selector -->
              <select id="difficulty-select" class="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-2 py-1.5 font-semibold text-xs md:text-sm shadow-lg hover:bg-white/25 transition-all duration-200 cursor-pointer">
                <option value="3" ${gameState.towers[0].disks.length === 3 ? 'selected' : ''} class="bg-gray-800 text-white">🟢 Easy (3)</option>
                <option value="4" ${gameState.towers[0].disks.length === 4 ? 'selected' : ''} class="bg-gray-800 text-white">🟡 Medium (4)</option>
                <option value="5" ${gameState.towers[0].disks.length === 5 ? 'selected' : ''} class="bg-gray-800 text-white">🟠 Hard (5)</option>
                <option value="6" ${gameState.towers[0].disks.length === 6 ? 'selected' : ''} class="bg-gray-800 text-white">🔴 Expert (6)</option>
              </select>
              
              <!-- Stats -->
              <div class="flex items-center gap-3 md:gap-4">
                <div class="text-center">
                  <div class="text-sm md:text-base font-bold text-yellow-400">${gameState.moves}</div>
                  <div class="text-xs text-white/80">Moves</div>
                </div>
                <div class="w-px h-8 bg-white/30"></div>
                <div class="text-center">
                  <div class="text-sm md:text-base font-bold text-blue-400">${optimalMoves}</div>
                  <div class="text-xs text-white/80">Optimal</div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button id="info-btn" class="bg-blue-500/80 hover:bg-blue-500 backdrop-blur-sm text-white w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border border-blue-400/30 shadow-lg flex items-center justify-center text-sm md:text-base" title="How to Play">
                  ℹ️
                </button>
                <button id="reset-btn" class="bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border border-red-400/30 shadow-lg flex items-center justify-center text-sm md:text-base" title="Reset Game">
                  🔄
                </button>
              </div>
            </div>
          </div>

          <!-- Game Board -->
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl flex-1 flex flex-col">
            <div class="grid grid-cols-3 gap-3 md:gap-6 flex-1">
              ${gameState.towers.map((tower, index) => this.renderTower(tower, index)).join('')}
            </div>
          </div>
        </div>
      </div>

      ${gameState.isComplete ? this.renderWinModal(gameState.moves, optimalMoves) : ''}
      <div id="info-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-50 ${wasModalVisible ? 'flex' : 'hidden'} animate-in fade-in duration-300">
        <div class="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center max-w-lg mx-4 shadow-2xl border border-white/20 text-white animate-in zoom-in duration-500">
          <div class="text-4xl mb-4">🎮</div>
          <h3 class="text-2xl md:text-3xl font-bold mb-6">How to Play</h3>
          <div class="text-left bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-xl">🎯</span>
                <div>
                  <strong class="text-white">Goal:</strong><br>
                  <span class="text-white/80">Move all disks from the left tower to the right tower.</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">📏</span>
                <div>
                  <strong class="text-white">Rules:</strong><br>
                  <span class="text-white/80">• Only move one disk at a time<br>
                  • Only the top disk can be moved<br>
                  • Never place a larger disk on top of a smaller one</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">🎮</span>
                <div>
                  <strong class="text-white">Controls:</strong><br>
                  <span class="text-white/80">• <strong class="text-yellow-400">Click:</strong> Select a disk, then click destination tower<br>
                  • <strong class="text-blue-400">Drag & Drop:</strong> Drag disks directly to towers</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">🏆</span>
                <div>
                  <strong class="text-white">Challenge:</strong><br>
                  <span class="text-white/80">Try to complete it in the minimum number of moves!</span>
                </div>
              </div>
            </div>
          </div>
          <button id="close-info-btn" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm border border-blue-400/30">
            Got it! 🚀
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderTower(tower: Tower, index: number): string {
    const towerLabels = ['Source', 'Auxiliary', 'Destination'];
    const towerIcons = ['🏁', '⚡', '🎯'];
    
    return `
      <div class="text-center h-full flex flex-col">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg h-full flex flex-col">
          <h3 class="text-white text-sm md:text-lg font-bold mb-2 flex items-center justify-center gap-1">
            <span class="text-sm md:text-lg">${towerIcons[index]}</span>
            ${towerLabels[index]}
          </h3>
          <div class="relative flex-1 flex flex-col items-center justify-end">
            <!-- Tower pole -->
            <div class="tower w-4 md:w-6 h-56 md:h-80 relative bg-gradient-to-t from-amber-700 to-amber-600 rounded-full shadow-lg" data-tower-id="${index}">
              <!-- Decorative top -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-amber-500 rounded-full shadow-md border-2 border-amber-400"></div>
              <!-- Disks container -->
              <div class="disk-container">
                ${tower.disks.map((disk, diskIndex) => this.renderDisk(disk, index, diskIndex)).join('')}
              </div>
            </div>
            <!-- Enhanced Base -->
            <div class="w-32 md:w-48 h-6 md:h-8 bg-gradient-to-t from-gray-800 to-gray-700 rounded-2xl mt-2 shadow-xl border-2 border-gray-600"></div>
          </div>
        </div>
      </div>
    `;
  }

  private renderDisk(disk: Disk, towerId: number, position: number): string {
    // Responsive disk sizing
    const baseWidth = window.innerWidth < 768 ? 40 : 60;
    const sizeMultiplier = window.innerWidth < 768 ? 12 : 20;
    const width = baseWidth + (disk.size * sizeMultiplier);
    const height = window.innerWidth < 768 ? 18 : 24;
    const bottom = position * (window.innerWidth < 768 ? 24 : 30) + (window.innerWidth < 768 ? 14 : 16);
    const isTopDisk = position === this.gameState.towers[towerId].disks.length - 1;
    
    // Enhanced visual styling
    const shadowClass = isTopDisk ? 'shadow-lg hover:shadow-xl' : 'shadow-md';
    const scaleClass = isTopDisk ? 'hover:scale-105' : '';
    const borderClass = 'border-2 border-black/20';
    
    return `
      <div 
        class="disk absolute cursor-pointer transition-all duration-200 ${shadowClass} ${scaleClass} ${borderClass} ${isTopDisk ? 'z-10' : 'opacity-90 cursor-not-allowed'} rounded-xl flex items-center justify-center font-bold text-white"
        style="
          width: ${width}px; 
          height: ${height}px; 
          background: linear-gradient(135deg, ${disk.color}, ${this.darkenColor(disk.color)}); 
          bottom: ${bottom}px;
          left: 50%;
          transform: translateX(-50%);
          font-size: ${window.innerWidth < 768 ? '14px' : '18px'};
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        "
        data-disk-id="${disk.id}"
        data-disk-size="${disk.size}"
        data-tower-id="${towerId}"
        data-is-top="${isTopDisk}"
        ${isTopDisk ? 'draggable="true"' : ''}
      >
        ${disk.size}
      </div>
    `;
  }

  private darkenColor(color: string): string {
    // Simple color darkening function
    const colorMap: { [key: string]: string } = {
      '#ef4444': '#dc2626', // red
      '#3b82f6': '#2563eb', // blue  
      '#10b981': '#059669', // green
      '#f59e0b': '#d97706', // yellow
      '#8b5cf6': '#7c3aed', // purple
      '#f97316': '#ea580c'  // orange
    };
    return colorMap[color] || color;
  }

  private renderWinModal(moves: number, optimal: number): string {
    const performance = moves === optimal ? 'Perfect!' : 
                       moves <= optimal * 1.5 ? 'Excellent!' : 
                       moves <= optimal * 2 ? 'Good!' : 'Keep practicing!';
    
    const performanceColor = moves === optimal ? 'text-green-400' : 
                            moves <= optimal * 1.5 ? 'text-blue-400' : 
                            moves <= optimal * 2 ? 'text-yellow-400' : 'text-orange-400';
    
    return `
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div class="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl border border-white/20 text-white animate-in zoom-in duration-500">
          <div class="text-6xl mb-6">🎉</div>
          <h2 class="text-3xl font-bold mb-4">Congratulations!</h2>
          <p class="text-white/80 mb-8 text-lg">You solved the Tower of Hanoi!</p>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <div class="space-y-4">
              <div class="flex justify-between items-center text-lg">
                <span class="font-medium text-white/90">Your Moves:</span>
                <span class="font-bold text-2xl text-yellow-400">${moves}</span>
              </div>
              <div class="flex justify-between items-center text-lg">
                <span class="font-medium text-white/90">Optimal Moves:</span>
                <span class="font-bold text-2xl text-blue-400">${optimal}</span>
              </div>
              <div class="border-t border-white/20 pt-4">
                <div class="flex justify-between items-center text-xl">
                  <span class="font-medium text-white/90">Performance:</span>
                  <span class="font-bold ${performanceColor}">${performance}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button id="play-again-btn" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-lg backdrop-blur-sm border border-blue-400/30">
            🎮 Play Again
          </button>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', this.onReset);
    }

    // Play again button (in win modal)
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', this.onReset);
    }

    // Info button
    const infoBtn = document.getElementById('info-btn');
    const infoModal = document.getElementById('info-modal');
    const closeInfoBtn = document.getElementById('close-info-btn');
    
    if (infoBtn && infoModal) {
      infoBtn.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
        infoModal.classList.add('flex');
      });
    }
    
    if (closeInfoBtn && infoModal) {
      closeInfoBtn.addEventListener('click', () => {
        infoModal.classList.add('hidden');
        infoModal.classList.remove('flex');
      });
    }
    
    // Close modal when clicking outside
    if (infoModal) {
      infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
          infoModal.classList.add('hidden');
          infoModal.classList.remove('flex');
        }
      });
    }

    // Difficulty selector
    const difficultySelect = document.getElementById('difficulty-select') as HTMLSelectElement;
    if (difficultySelect) {
      difficultySelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.onDifficultyChange(parseInt(target.value));
      });
    }

    // Disk click events
    document.querySelectorAll('.disk').forEach(diskEl => {
      const isTop = diskEl.getAttribute('data-is-top') === 'true';
      if (isTop) {
        diskEl.addEventListener('click', this.handleDiskClick.bind(this));
        diskEl.addEventListener('dragstart', this.handleDragStart.bind(this));
        diskEl.addEventListener('dragend', this.handleDragEnd.bind(this));
      }
    });

    // Tower drop events
    document.querySelectorAll('.tower').forEach(towerEl => {
      towerEl.addEventListener('click', this.handleTowerClick.bind(this));
      towerEl.addEventListener('dragover', this.handleDragOver.bind(this));
      towerEl.addEventListener('drop', this.handleDrop.bind(this));
      towerEl.addEventListener('dragenter', this.handleDragEnter.bind(this));
      towerEl.addEventListener('dragleave', this.handleDragLeave.bind(this));
    });
  }

  private handleDiskClick(event: Event): void {
    const diskEl = event.target as HTMLElement;
    const diskId = parseInt(diskEl.getAttribute('data-disk-id') || '0');
    const towerId = parseInt(diskEl.getAttribute('data-tower-id') || '0');
    
    if (this.gameState.selectedDisk) {
      // Try to move the selected disk to this tower
      const fromTower = this.gameState.towers.findIndex(t => 
        t.disks.some(d => d.id === this.gameState.selectedDisk!.id)
      );
      this.onDiskMove(fromTower, towerId);
    } else {
      // Select this disk
      const disk = this.gameState.towers[towerId].disks.find(d => d.id === diskId);
      if (disk) {
        this.gameState.selectedDisk = disk;
        diskEl.classList.add('ring-4', 'ring-yellow-400');
      }
    }
  }

  private handleTowerClick(event: Event): void {
    if (this.gameState.selectedDisk) {
      const towerEl = event.currentTarget as HTMLElement;
      const towerId = parseInt(towerEl.getAttribute('data-tower-id') || '0');
      const fromTower = this.gameState.towers.findIndex(t => 
        t.disks.some(d => d.id === this.gameState.selectedDisk!.id)
      );
      this.onDiskMove(fromTower, towerId);
    }
  }

  private handleDragStart(event: Event): void {
    const dragEvent = event as DragEvent;
    const diskEl = dragEvent.target as HTMLElement;
    const diskId = parseInt(diskEl.getAttribute('data-disk-id') || '0');
    const towerId = parseInt(diskEl.getAttribute('data-tower-id') || '0');
    
    this.draggedDisk = this.gameState.towers[towerId].disks.find(d => d.id === diskId) || null;
    this.draggedFromTower = towerId;
    
    diskEl.classList.add('dragging');
  }

  private handleDragEnd(event: Event): void {
    const diskEl = event.target as HTMLElement;
    diskEl.classList.remove('dragging');
    
    document.querySelectorAll('.tower').forEach(tower => {
      tower.classList.remove('drag-over', 'invalid-drop');
    });
  }

  private handleDragOver(event: Event): void {
    event.preventDefault();
  }

  private handleDragEnter(event: Event): void {
    const towerEl = event.currentTarget as HTMLElement;
    const towerId = parseInt(towerEl.getAttribute('data-tower-id') || '0');
    
    if (this.draggedDisk && this.draggedFromTower !== null) {
      const tower = this.gameState.towers[towerId];
      const topDisk = tower.disks[tower.disks.length - 1];
      
      if (!topDisk || this.draggedDisk.size < topDisk.size) {
        towerEl.classList.add('drag-over');
      } else {
        towerEl.classList.add('invalid-drop');
      }
    }
  }

  private handleDragLeave(event: Event): void {
    const towerEl = event.currentTarget as HTMLElement;
    towerEl.classList.remove('drag-over', 'invalid-drop');
  }

  private handleDrop(event: Event): void {
    event.preventDefault();
    const towerEl = event.currentTarget as HTMLElement;
    const towerId = parseInt(towerEl.getAttribute('data-tower-id') || '0');
    
    if (this.draggedFromTower !== null) {
      this.onDiskMove(this.draggedFromTower, towerId);
    }
    
    this.draggedDisk = null;
    this.draggedFromTower = null;
  }
}
