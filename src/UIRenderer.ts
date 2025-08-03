import { Disk, Tower, GameState } from './TowerOfHanoi';

// Constants for better maintainability
const DISK_CONFIG = {
  BASE_WIDTH: 60,
  SIZE_MULTIPLIER: 20,
  HEIGHT: 24,
  SPACING: 26,
  BASE_OFFSET: 16
} as const;

const TOWER_CONFIG = {
  WIDTH: 'w-6',
  HEIGHT: 'h-80',
  TOP_SIZE: 'w-8 h-8',
  BASE_SIZE: 'w-48 h-8'
} as const;

const CSS_CLASSES = {
  GLASS_PANEL: 'bg-white/10 backdrop-blur-sm border border-white/20',
  GLASS_BUTTON: 'backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg',
  TEXT_SECONDARY: 'text-white/80',
  ROUNDED_PANEL: 'rounded-xl',
  ROUNDED_LARGE: 'rounded-3xl'
} as const;

const DISK_COLORS = [
  { base: '#ef4444', dark: '#dc2626' }, // red
  { base: '#3b82f6', dark: '#059669' }, // blue -> teal
  { base: '#10b981', dark: '#059669' }, // green
  { base: '#f59e0b', dark: '#d97706' }, // yellow
  { base: '#8b5cf6', dark: '#ea580c' }, // purple -> orange
  { base: '#f97316', dark: '#ea580c' }  // orange
] as const;

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
    
    // Destructure for cleaner code
    const { moves, isComplete, towers } = gameState;
    const diskCount = towers[0].disks.length;
    
    this.container.innerHTML = `
      <div class="bg-gradient-to-br from-orange-900 via-red-900 to-pink-800 min-h-screen flex flex-col">
        <div class="max-w-6xl mx-auto p-4 flex-1 flex flex-col">
          ${this.renderHeader(diskCount, moves, optimalMoves)}
          ${this.renderGameBoard(towers)}
        </div>
      </div>

      ${isComplete ? this.renderWinModal(moves, optimalMoves) : ''}
      ${this.renderInfoModal(Boolean(wasModalVisible))}
    `;

    this.attachEventListeners();
  }

  private renderHeader(diskCount: number, moves: number, optimalMoves: number): string {
    return `
      <!-- Header Bar -->
      <div class="${CSS_CLASSES.GLASS_PANEL} ${CSS_CLASSES.ROUNDED_PANEL} p-4 mb-4 shadow-lg">
        <div class="flex items-center justify-between gap-6">
          <!-- Title -->
          <h1 class="text-2xl font-bold text-white tracking-wide">
            Tower of Hanoi
          </h1>
          
          <!-- Difficulty Selector -->
          <select id="difficulty-select" class="${CSS_CLASSES.GLASS_PANEL} text-white ${CSS_CLASSES.ROUNDED_PANEL} px-2 py-1.5 font-semibold text-sm shadow-lg hover:bg-white/25 transition-all duration-200 cursor-pointer">
            <option value="3" ${diskCount === 3 ? 'selected' : ''} class="bg-gray-800 text-white">🟢 Easy (3)</option>
            <option value="4" ${diskCount === 4 ? 'selected' : ''} class="bg-gray-800 text-white">🟡 Medium (4)</option>
            <option value="5" ${diskCount === 5 ? 'selected' : ''} class="bg-gray-800 text-white">🟠 Hard (5)</option>
            <option value="6" ${diskCount === 6 ? 'selected' : ''} class="bg-gray-800 text-white">🔴 Expert (6)</option>
          </select>
          
          <!-- Stats -->
          <div class="flex items-center gap-4">
            <div class="text-center">
              <div class="text-base font-bold text-yellow-400" data-moves="${moves}">${this.sanitizeNumber(moves)}</div>
              <div class="text-xs ${CSS_CLASSES.TEXT_SECONDARY}">Moves</div>
            </div>
            <div class="w-px h-8 bg-white/30"></div>
            <div class="text-center">
              <div class="text-base font-bold text-emerald-400" data-optimal="${optimalMoves}">${this.sanitizeNumber(optimalMoves)}</div>
              <div class="text-xs ${CSS_CLASSES.TEXT_SECONDARY}">Optimal</div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button id="info-btn" class="bg-teal-500/80 hover:bg-teal-500 ${CSS_CLASSES.GLASS_BUTTON} text-white w-10 h-10 ${CSS_CLASSES.ROUNDED_PANEL} font-semibold border border-teal-400/30 flex items-center justify-center text-base" title="How to Play">
              ℹ️
            </button>
            <button id="reset-btn" class="bg-red-500/80 hover:bg-red-500 ${CSS_CLASSES.GLASS_BUTTON} text-white w-10 h-10 ${CSS_CLASSES.ROUNDED_PANEL} font-semibold border border-red-400/30 flex items-center justify-center text-base" title="Reset Game">
              🔄
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderGameBoard(towers: Tower[]): string {
    return `
      <!-- Game Board -->
      <div class="bg-white/5 backdrop-blur-sm ${CSS_CLASSES.ROUNDED_LARGE} p-6 border border-white/10 shadow-2xl flex-1 flex flex-col">
        <div class="grid grid-cols-3 gap-6 flex-1">
          ${towers.map((tower, index) => this.renderTower(tower, index)).join('')}
        </div>
      </div>
    `;
  }

  private renderInfoModal(wasVisible: boolean): string {
    return `
      <div id="info-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-50 ${wasVisible ? 'flex' : 'hidden'} animate-in fade-in duration-300">
        <div class="${CSS_CLASSES.GLASS_PANEL} ${CSS_CLASSES.ROUNDED_LARGE} p-8 text-center max-w-lg mx-4 shadow-2xl text-white animate-in zoom-in duration-500">
          <div class="text-4xl mb-4">🎮</div>
          <h3 class="text-3xl font-bold mb-6">How to Play</h3>
          <div class="text-left ${CSS_CLASSES.GLASS_PANEL} rounded-2xl p-6 mb-8">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-xl">🎯</span>
                <div>
                  <strong class="text-white">Goal:</strong><br>
                  <span class="${CSS_CLASSES.TEXT_SECONDARY}">Move all disks from the left tower to the right tower.</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">📏</span>
                <div>
                  <strong class="text-white">Rules:</strong><br>
                  <span class="${CSS_CLASSES.TEXT_SECONDARY}">• Only move one disk at a time<br>
                  • Only the top disk can be moved<br>
                  • Never place a larger disk on top of a smaller one</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">🎮</span>
                <div>
                  <strong class="text-white">Controls:</strong><br>
                  <span class="${CSS_CLASSES.TEXT_SECONDARY}">• <strong class="text-yellow-400">Click:</strong> Select a disk, then click destination tower<br>
                  • <strong class="text-emerald-400">Drag & Drop:</strong> Drag disks directly to towers</span>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <span class="text-xl">🏆</span>
                <div>
                  <strong class="text-white">Challenge:</strong><br>
                  <span class="${CSS_CLASSES.TEXT_SECONDARY}">Try to complete it in the minimum number of moves!</span>
                </div>
              </div>
            </div>
          </div>
          <button id="close-info-btn" class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-2xl font-semibold ${CSS_CLASSES.GLASS_BUTTON} border border-orange-400/30">
            Got it! 🚀
          </button>
        </div>
      </div>
    `;
  }

  private renderTower(tower: Tower, index: number): string {
    const towerLabels = ['Source', 'Auxiliary', 'Destination'];
    const towerIcons = ['🏁', '⚡', '🎯'];
    
    return `
      <div class="text-center h-full flex flex-col">
        <div class="${CSS_CLASSES.GLASS_PANEL} ${CSS_CLASSES.ROUNDED_PANEL} p-3 shadow-lg h-full flex flex-col">
          <h3 class="text-white text-lg font-bold mb-2 flex items-center justify-center gap-1">
            <span class="text-lg">${towerIcons[index]}</span>
            ${towerLabels[index]}
          </h3>
          <div class="relative flex-1 flex flex-col items-center justify-end">
            <!-- Tower pole -->
            <div class="tower ${TOWER_CONFIG.WIDTH} ${TOWER_CONFIG.HEIGHT} relative bg-gradient-to-t from-amber-700 to-amber-600 rounded-full shadow-lg" data-tower-id="${index}">
              <!-- Decorative top -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 ${TOWER_CONFIG.TOP_SIZE} bg-amber-500 rounded-full shadow-md border-2 border-amber-400"></div>
              <!-- Disks container -->
              <div class="disk-container">
                ${tower.disks.map((disk, diskIndex) => this.renderDisk(disk, index, diskIndex)).join('')}
              </div>
            </div>
            <!-- Enhanced Base -->
            <div class="${TOWER_CONFIG.BASE_SIZE} bg-gradient-to-t from-gray-800 to-gray-700 rounded-2xl mt-2 shadow-xl border-2 border-gray-600"></div>
          </div>
        </div>
      </div>
    `;
  }

  private renderDisk(disk: Disk, towerId: number, position: number): string {
    // Use constants for sizing
    const width = DISK_CONFIG.BASE_WIDTH + (disk.size * DISK_CONFIG.SIZE_MULTIPLIER);
    const bottom = position * DISK_CONFIG.SPACING + DISK_CONFIG.BASE_OFFSET;
    
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
          height: ${DISK_CONFIG.HEIGHT}px; 
          background: linear-gradient(135deg, ${disk.color}, ${this.getDarkColor(disk.color)}); 
          bottom: ${bottom}px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          z-index: ${position + 1}; /* Higher position = higher z-index */
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

  private getDarkColor(color: string): string {
    // Use the predefined color mapping for consistency
    const colorEntry = DISK_COLORS.find(c => c.base === color);
    return colorEntry ? colorEntry.dark : color;
  }

  // Security: Sanitize numbers to prevent XSS
  private sanitizeNumber(value: number): string {
    // Ensure the value is actually a number and convert to safe string
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) {
      return '0'; // Fallback for invalid numbers
    }
    return Math.max(0, Math.floor(num)).toString(); // Only positive integers
  }

  // Security: Sanitize HTML to prevent XSS
  private sanitizeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private renderWinModal(moves: number, optimal: number): string {
    const performance = moves === optimal ? 'Perfect!' : 
                       moves <= optimal * 1.5 ? 'Excellent!' : 
                       moves <= optimal * 2 ? 'Good!' : 'Keep practicing!';
    
    const performanceColor = moves === optimal ? 'text-green-400' : 
                            moves <= optimal * 1.5 ? 'text-emerald-400' : 
                            moves <= optimal * 2 ? 'text-yellow-400' : 'text-orange-400';
    
    return `
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div class="${CSS_CLASSES.GLASS_PANEL} ${CSS_CLASSES.ROUNDED_LARGE} p-8 text-center max-w-md mx-4 shadow-2xl text-white animate-in zoom-in duration-500">
          <div class="text-6xl mb-6">🎉</div>
          <h2 class="text-3xl font-bold mb-4">Congratulations!</h2>
          <p class="${CSS_CLASSES.TEXT_SECONDARY} mb-8 text-lg">You solved the Tower of Hanoi!</p>
          
          <div class="${CSS_CLASSES.GLASS_PANEL} rounded-2xl p-6 mb-8">
            <div class="space-y-4">
              <div class="flex justify-between items-center text-lg">
                <span class="font-medium text-white/90">Your Moves:</span>
                <span class="font-bold text-2xl text-yellow-400">${this.sanitizeNumber(moves)}</span>
              </div>
              <div class="flex justify-between items-center text-lg">
                <span class="font-medium text-white/90">Optimal Moves:</span>
                <span class="font-bold text-2xl text-emerald-400">${this.sanitizeNumber(optimal)}</span>
              </div>
              <div class="border-t border-white/20 pt-4">
                <div class="flex justify-between items-center text-xl">
                  <span class="font-medium text-white/90">Performance:</span>
                  <span class="font-bold ${performanceColor}">${this.sanitizeHTML(performance)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button id="play-again-btn" class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold ${CSS_CLASSES.GLASS_BUTTON} text-lg border border-orange-400/30">
            🎮 Play Again
          </button>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Cache DOM elements to reduce queries
    const elements = {
      resetBtn: document.getElementById('reset-btn'),
      playAgainBtn: document.getElementById('play-again-btn'),
      infoBtn: document.getElementById('info-btn'),
      infoModal: document.getElementById('info-modal'),
      closeInfoBtn: document.getElementById('close-info-btn'),
      difficultySelect: document.getElementById('difficulty-select') as HTMLSelectElement
    };

    // Reset button
    elements.resetBtn?.addEventListener('click', this.onReset);

    // Play again button (in win modal)
    elements.playAgainBtn?.addEventListener('click', this.onReset);

    // Info modal handling
    if (elements.infoBtn && elements.infoModal) {
      elements.infoBtn.addEventListener('click', () => {
        elements.infoModal!.classList.remove('hidden');
        elements.infoModal!.classList.add('flex');
      });
    }
    
    if (elements.closeInfoBtn && elements.infoModal) {
      elements.closeInfoBtn.addEventListener('click', () => {
        elements.infoModal!.classList.add('hidden');
        elements.infoModal!.classList.remove('flex');
      });
    }
    
    // Close modal when clicking outside
    elements.infoModal?.addEventListener('click', (e) => {
      if (e.target === elements.infoModal && elements.infoModal) {
        elements.infoModal.classList.add('hidden');
        elements.infoModal.classList.remove('flex');
      }
    });

    // Difficulty selector
    elements.difficultySelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.onDifficultyChange(parseInt(target.value));
    });

    // Disk and tower events
    this.attachGameEvents();
  }

  private attachGameEvents(): void {
    // Disk click events
    document.querySelectorAll('.disk').forEach(diskEl => {
      const isTop = diskEl.getAttribute('data-is-top') === 'true';
      if (isTop) {
        diskEl.addEventListener('click', this.handleDiskClick.bind(this));
        
        // Desktop drag & drop
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
