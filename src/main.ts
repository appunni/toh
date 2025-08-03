import './style.css'
import { TowerOfHanoi } from './TowerOfHanoi'
import { UIRenderer } from './UIRenderer'

// PWA Install Prompt Interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class TowerOfHanoiApp {
  private game: TowerOfHanoi;
  private renderer: UIRenderer;
  private container: HTMLElement;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

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
    this.initializePWA();
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

  // PWA Methods
  private async initializePWA(): Promise<void> {
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup install prompt
    this.setupInstallPrompt();
    
    // Handle URL parameters for app shortcuts
    this.handleURLParameters();
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/toh/sw.js', {
          scope: '/toh/'
        });
        
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
        });
        
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.log('ℹ️ Service Worker not supported');
    }
  }

  private setupInstallPrompt(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('📱 Install prompt available');
      
      // Prevent the default prompt
      e.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Show custom install UI (you can add this to UIRenderer)
      this.showInstallButton();
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA installed successfully!');
      this.deferredPrompt = null;
      this.hideInstallButton();
    });
  }

  private showInstallButton(): void {
    // Add install button to the UI
    const existingBtn = document.getElementById('pwa-install-btn');
    if (existingBtn) return; // Already shown

    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.innerHTML = '📲 Install App';
    installBtn.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg z-50 border border-orange-400/30';
    
    installBtn.addEventListener('click', () => this.handleInstallClick());
    
    document.body.appendChild(installBtn);
  }

  private hideInstallButton(): void {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.remove();
    }
  }

  private async handleInstallClick(): Promise<void> {
    if (!this.deferredPrompt) return;

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('📱 Install prompt result:', outcome);
      
      // Clean up
      this.deferredPrompt = null;
      this.hideInstallButton();
      
    } catch (error) {
      console.error('❌ Install prompt failed:', error);
    }
  }

  private handleURLParameters(): void {
    // Handle app shortcuts (e.g., /?difficulty=5)
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    
    if (difficulty) {
      const diskCount = parseInt(difficulty, 10);
      if (diskCount >= 3 && diskCount <= 6) {
        console.log('🔗 Starting with difficulty from URL:', diskCount);
        this.onDifficultyChange(diskCount);
      }
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TowerOfHanoiApp();
});
