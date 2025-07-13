# 🏗️ Tower of Hanoi

A beautiful, modern implementation of the classic Tower of Hanoi puzzle game built with **Vite**, **TypeScript**, and **Tailwind CSS**.

![Tower of Hanoi Game](https://img.shields.io/badge/Game-Tower%20of%20Hanoi-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.0--alpha.26-38B2AC)

## ✨ Features

- 🎮 **Interactive Gameplay**: Click-to-select or drag-and-drop mechanics
- 🎨 **Modern Design**: Glassmorphism UI with beautiful gradients and animations
- 📱 **Responsive**: Optimized for both desktop and mobile devices
- 🎯 **Multiple Difficulty Levels**: Easy (3 disks), Medium (4 disks), Hard (5 disks), Expert (6 disks)
- 📊 **Performance Tracking**: Move counter and optimal solution comparison
- ℹ️ **Tutorial System**: Built-in help modal with game rules and controls
- 🔄 **Reset Functionality**: Start over anytime with the reset button
- 🏆 **Achievement System**: Performance ratings (Perfect, Excellent, Good)

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
   Navigate to `http://localhost:3000` to play the game!

## 🎯 How to Play

### Goal
Move all disks from the **Source** tower to the **Destination** tower.

### Rules
- ✅ Only move one disk at a time
- ✅ Only the top disk can be moved
- ❌ Never place a larger disk on top of a smaller one

### Controls
- **Click**: Select a disk, then click the destination tower
- **Drag & Drop**: Drag disks directly to towers

### Challenge
Try to complete the puzzle in the minimum number of moves!

## 🛠️ Technology Stack

- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies for core game logic

## 📁 Project Structure

```
toh/
├── src/
│   ├── TowerOfHanoi.ts      # Core game logic
│   ├── UIRenderer.ts        # UI rendering and interactions
│   ├── main.ts             # Application entry point
│   └── style.css           # Additional styling
├── public/                 # Static assets
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 Design Features

- **Glassmorphism**: Modern translucent design with backdrop blur effects
- **Smooth Animations**: Hover effects, transitions, and modal animations
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Consistent Theme**: Unified color palette and design language
- **Accessibility**: Proper contrast ratios and interactive feedback

## 📱 Responsive Design

The game is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop computers (1024px+)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript compiler check

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Game Rules Reference

### Optimal Solutions
- **3 disks**: 7 moves
- **4 disks**: 15 moves  
- **5 disks**: 31 moves
- **6 disks**: 63 moves

### Performance Ratings
- **Perfect**: Solved in optimal moves
- **Excellent**: Within 150% of optimal
- **Good**: Within 200% of optimal
- **Keep practicing**: More than 200% of optimal

## 🌟 Acknowledgments

- Classic Tower of Hanoi puzzle by Édouard Lucas (1883)
- Modern web technologies and open-source community
- Tailwind CSS for the amazing utility-first approach

---

**Enjoy playing the Tower of Hanoi! 🎮**
