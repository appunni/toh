# 🏗️ Tower of Hanoi

A beautiful, modern implementation of the classic Tower of Hanoi puzzle game built with **Vite**, **TypeScript**, and **Tailwind CSS v4**. Features a desktop-optimized experience with comprehensive security hardening and PWA capabilities.

![Tower of Hanoi Game](https://img.shields.io/badge/Game-Tower%20of%20Hanoi-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0--alpha.26-38B2AC) ![Security](https://img.shields.io/badge/Security-Hardened-green) ![PWA](https://img.shields.io/badge/PWA-Ready-blue)

## ✨ Features

- 🖥️ **Desktop-Optimized**: Clean, focused desktop experience with optimized interactions
- 🎮 **Interactive Gameplay**: Intuitive drag-and-drop mechanics
- 🎨 **Modern Design**: Glassmorphism UI with beautiful gradients and animations
- 🎯 **Multiple Difficulty Levels**: Easy (3 disks), Medium (4 disks), Hard (5 disks), Expert (6 disks)
- 📊 **Performance Tracking**: Move counter and optimal solution comparison
- ℹ️ **Tutorial System**: Built-in help modal with game rules and controls
- 🔄 **Reset Functionality**: Start over anytime with the reset button
- 🏆 **Achievement System**: Performance ratings (Perfect, Excellent, Good)
- 🔒 **Security Hardened**: XSS prevention, input validation, and CSP headers
- 📱 **PWA Ready**: Progressive Web App with service worker and offline support

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/appunni/toh.git
   cd toh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000/toh/` to play the game!

## 🎯 How to Play

### Goal
Move all disks from the **Source** tower to the **Destination** tower.

### Rules
- ✅ Only move one disk at a time
- ✅ Only the top disk can be moved
- ❌ Never place a larger disk on top of a smaller one

### Controls (Desktop Optimized)
- **Drag & Drop**: Drag disks directly to towers with visual feedback
- **Mouse Hover**: Visual indicators show valid/invalid drop zones

### Challenge
Try to complete the puzzle in the minimum number of moves!

## 🛠️ Technology Stack

- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Next-generation utility-first CSS framework
- **PWA Features** - Service worker, offline support, and app installation
- **Security Hardened** - XSS prevention, CSP headers, and input validation
- **Vanilla JavaScript** - No framework dependencies for core game logic

## 📁 Project Structure

```
toh/
├── src/
│   ├── TowerOfHanoi.ts      # Core game logic and state management
│   ├── UIRenderer.ts        # UI rendering, events, and security
│   ├── main.ts             # Application entry point and PWA setup
│   └── style.css           # Additional custom styling
├── public/                 # Static assets and PWA files
│   ├── icons/             # App icons for PWA
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker for offline support
├── index.html             # Main HTML file with security headers
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration with Tailwind CSS v4
```

## 🎨 Design Features

- **Glassmorphism**: Modern translucent design with backdrop blur effects
- **Smooth Animations**: Hover effects, transitions, and modal animations
- **Desktop-First**: Optimized for desktop interaction patterns
- **Consistent Theme**: Unified color palette and design language
- **Accessibility**: Proper contrast ratios and interactive feedback
- **Component Architecture**: Modular, maintainable code structure

## 🔒 Security Features

- **XSS Prevention**: Input sanitization and HTML escaping
- **Content Security Policy**: Comprehensive CSP headers
- **Input Validation**: Secure URL parameter and localStorage handling
- **Service Worker Security**: Origin validation and request restrictions
- **Security Headers**: X-Frame-Options, X-XSS-Protection, and more

## 📱 PWA Features

- **Offline Support**: Service worker for offline gameplay
- **App Installation**: Install as native app on desktop/mobile
- **App Icons**: Complete icon set for all platforms
- **Manifest**: Full PWA manifest with proper metadata
- **Caching Strategy**: Optimized asset caching for performance

## 🚀 Performance Optimizations

- **Code Splitting**: Optimized bundle size with modern build tools
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed and optimized static assets
- **DOM Optimization**: Efficient rendering and event handling
- **TypeScript**: Compile-time optimizations and type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with TypeScript compilation
- `npm run preview` - Preview production build locally
- `npm run lint` - Run TypeScript type checking

### Code Quality Features

- **TypeScript**: Full type safety and compile-time error checking
- **Optimized Constants**: Centralized configuration for easy maintenance
- **Template Separation**: Modular UI rendering with focused methods
- **Event Optimization**: Efficient DOM event handling and caching
- **Security Best Practices**: Input validation and XSS prevention

---

**Enjoy playing the Tower of Hanoi! 🎮**

*Desktop-optimized • Security-hardened • PWA-ready*
