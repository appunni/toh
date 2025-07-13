# Tower of Hanoi - AI Coding Agent Instructions

## Project Overview
A modern TypeScript-based Tower of Hanoi puzzle game using Vite, Tailwind CSS v4, and vanilla DOM manipulation. **The current architecture requires complete modernization for production readiness.**

## Current Architecture Issues & Modernization Plan

### 🚨 Critical Problems in Current Codebase
- **Monolithic UIRenderer**: Single class handles DOM manipulation, event handling, templating, and responsive logic
- **No Component Separation**: Everything rendered as massive innerHTML strings instead of modular components
- **Mixed Responsibilities**: UI logic, game state, and event handling tightly coupled
- **Primitive Responsiveness**: CSS scaling instead of adaptive layouts for different device classes
- **Basic State Management**: Simple observer pattern lacks modern reactive capabilities

### 🎯 Modern Production-Ready Architecture

#### Component-Based Architecture
Implement proper component separation using Web Components or lightweight framework:

```typescript
// Component Structure
src/
├── components/
│   ├── game/
│   │   ├── GameBoard.ts        // Main game container
│   │   ├── TowerContainer.ts   // All towers wrapper
│   │   ├── Tower.ts           // Individual tower logic
│   │   └── Disk.ts            // Individual disk component
│   ├── layout/
│   │   ├── MobileLayout.ts     // Mobile-specific layout
│   │   ├── TabletLayout.ts     // Tablet-specific layout
│   │   └── DesktopLayout.ts    // Desktop-specific layout
│   └── ui/
│       ├── GameHeader.ts       // Title, controls, stats
│       ├── InfoModal.ts        // Help modal
│       └── CompletionModal.ts  // Victory modal
├── stores/
│   ├── GameStore.ts           // Reactive game state
│   └── UIStore.ts             // UI-specific state
├── utils/
│   ├── DeviceDetection.ts     // Viewport detection
│   └── PerformanceUtils.ts    // Optimization helpers
└── types/
    └── GameTypes.ts           // Centralized type definitions
```

#### Modern State Management
Replace observer pattern with reactive store architecture:

```typescript
// Reactive Store Pattern
interface GameStore {
  state: GameState;
  actions: GameActions;
  subscribe: (listener: StateListener) => Unsubscribe;
  getSnapshot: () => GameState;
}

// Component-level reactive patterns
class Tower extends HTMLElement {
  private store: GameStore;
  private unsubscribe: Unsubscribe;
  
  connectedCallback() {
    this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));
  }
  
  disconnectedCallback() {
    this.unsubscribe?.();
  }
}
```

#### Device-Adaptive Layouts
Replace CSS scaling with completely different layouts per device class:

**Mobile Strategy (< 768px):**
- Portrait: Vertical tower stacking with swipe gestures
- Touch-first interactions with haptic feedback
- Bottom sheet modals, essential controls only
- Larger touch targets (min 44px)

**Tablet Strategy (768px - 1024px):**
- Hybrid interaction model (touch + precision)
- Adaptive UI density based on orientation
- Split-screen friendly design
- Enhanced gesture support

**Desktop Strategy (> 1024px):**
- Traditional horizontal layout
- Hover states, tooltips, keyboard shortcuts
- Context menus, multi-monitor awareness
- Mouse-optimized interactions

#### Performance & Production Features
```typescript
// Code Splitting Example
const MobileLayout = lazy(() => import('./components/layout/MobileLayout.js'));
const DesktopLayout = lazy(() => import('./components/layout/DesktopLayout.js'));

// Performance Monitoring
class PerformanceMonitor {
  trackGameInteraction(action: string, duration: number) { }
  reportError(error: Error) { }
  measureRenderTime(component: string) { }
}

// Progressive Web App
class ServiceWorkerManager {
  registerSW(): Promise<void> { }
  handleOfflineMode(): void { }
  cacheGameAssets(): Promise<void> { }
}
```

## Migration Strategy (5 Phases)

### Phase 1: Component Extraction
- Extract Disk, Tower, GameHeader components from UIRenderer
- Implement base component class with lifecycle methods
- Maintain existing functionality during transition

### Phase 2: Modern State Management
- Replace observer pattern with reactive store
- Implement proper state persistence and hydration
- Add undo/redo capabilities and state snapshots

### Phase 3: Device-Adaptive Layouts
- Implement device detection and layout switching
- Create mobile/tablet/desktop specific components
- Add gesture recognition and touch optimizations

### Phase 4: Performance Optimization
- Implement code splitting and lazy loading
- Add virtual scrolling for large disk counts
- Optimize animations with requestAnimationFrame
- Add error boundaries and monitoring

### Phase 5: Production Deployment
- Implement CI/CD pipeline with automated testing
- Add feature flags and A/B testing capabilities
- Set up monitoring, analytics, and error reporting
- Implement security headers and PWA features

## Development Workflows

### Essential Commands
```bash
npm run dev     # Development server on :3000 with auto-reload
npm run build   # TypeScript compilation + Vite build  
npm run test    # Unit and integration tests
npm run e2e     # End-to-end testing
npm run lint    # TypeScript type checking + ESLint
npm run deploy  # Production deployment
```

### Testing Strategy
```typescript
// Component Testing
describe('Tower Component', () => {
  it('should handle disk placement correctly', () => { });
  it('should prevent invalid moves', () => { });
});

// E2E Testing
test('complete game flow on mobile', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-testid="difficulty-easy"]').click();
  // ... complete game interaction
});
```

## Current Legacy Patterns (To Replace)

### Avoid These Current Patterns
- ❌ Massive innerHTML string rendering
- ❌ Single monolithic UIRenderer class
- ❌ CSS-only responsive scaling approach
- ❌ Manual DOM event listener management
- ❌ Direct state mutation without reactive updates

### Modern Alternatives
- ✅ Component-based rendering with encapsulation
- ✅ Reactive state management with subscriptions
- ✅ Device-specific adaptive layouts
- ✅ Declarative event handling patterns
- ✅ Immutable state updates with proper change detection

## Critical Integration Points

### Build System Modernization
```typescript
// vite.config.ts enhancements
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lit', 'zustand'],
          mobile: ['./src/components/layout/MobileLayout.ts'],
          desktop: ['./src/components/layout/DesktopLayout.ts']
        }
      }
    }
  },
  server: { port: 3000, open: true },
  base: '/toh/'
});
```

### Accessibility & Modern Standards
- WCAG 2.1 AA compliance with proper ARIA labels
- Keyboard navigation support for all interactions
- Screen reader compatibility with semantic markup
- High contrast mode and reduced motion preferences
- Internationalization (i18n) support for global reach

## File Modification Priorities for Modernization
1. **Phase 1**: Extract components from `UIRenderer.ts`, create base component classes
2. **Phase 2**: Implement reactive stores, replace `TowerOfHanoi.ts` state management
3. **Phase 3**: Create device-specific layouts, replace CSS scaling in `style.css`
4. **Phase 4**: Add performance monitoring, testing infrastructure
5. **Phase 5**: Production deployment features, CI/CD pipeline

**Note**: This modernization transforms a prototype into a scalable, maintainable, production-ready application suitable for enterprise deployment.
