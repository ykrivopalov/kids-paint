# Kids Paint 🎨

An interactive, responsive, and kid-friendly web drawing and coloring application built with **React 19** and **Vite**.

🌐 **Live Demo:** [https://ykrivopalov.github.io/kids-paint/](https://ykrivopalov.github.io/kids-paint/)

---

## ✨ Features

- **🖌️ Drawing Tools:**
  - **Brush (Кисть)**: Smooth, continuous freehand drawing.
  - **Spray (Распылитель)**: Realistic airbrush / spray particle effect.
  - **Eraser (Ластик)**: Easy touch-up eraser tool.
- **⭐ Stamps (Штампики):**
  - **Star (Звезда)**, **Heart (Сердце)**, **Flower (Цветок)**, **Circle (Круг)**, **Poo (Какашка)**, and **Sparkles (Блёстки)** stamps with one-click or continuous drag-stamping anywhere on the canvas.
  - Full color customization (palette + Rainbow mode).
  - Scalable with brush size controls.
- **🌈 Rich Palette & Rainbow Mode:**
  - 24+ vibrant preset colors.
  - Dynamic **Rainbow mode** that continuously shifts hue as you draw or stamp.
- **📏 Adjustable Brush & Stamp Sizes:**
  - Three convenient size presets (Small, Medium, Large).
- **🖼️ Coloring Templates (Раскраски):**
  - Overlay outlines including Star, Heart, Flower, Car, Cat, House, Rocket, Tree, and Sun.
  - Blank canvas mode for free drawing.
- **🛡️ Accidental Clear Protection:**
  - Confirmation modal before clearing the drawing to prevent accidental loss of art.
- **📱 Touch & Pointer Support:**
  - Works seamlessly across desktop mice, touch screens, and styluses via HTML5 Pointer Events (`touch-action: none`).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React 19](https://react.dev/)
- **Bundler & Dev Server:** [Vite 5](https://vite.dev/)
- **Canvas Rendering:** HTML5 2D Canvas API
- **Deployment:** GitHub Pages via [`gh-pages`](https://www.npmjs.com/package/gh-pages)

### Project Structure

```
kids-paint/
├── public/
├── src/
│   ├── assets/
│   │   └── templates/       # SVG vector coloring outlines (car, cat, star, etc.)
│   ├── components/
│   │   ├── Canvas.jsx       # Core HTML5 Canvas drawing logic & pointer handlers
│   │   ├── Modal.jsx        # Clear confirmation modal
│   │   ├── TemplateSelector.jsx # Template picker panel
│   │   └── Toolbar.jsx      # Tools, colors, size selection, and action buttons
│   ├── App.jsx              # Main app state and layout coordination
│   ├── App.css              # Layout & UI component styling
│   ├── index.css            # Base stylesheet
│   └── main.jsx             # React entry point
├── vite.config.js           # Vite configuration with base path for GitHub Pages
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ykrivopalov/kids-paint.git
   cd kids-paint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/kids-paint/
```

### Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

---

## 📄 License

This project is licensed under the terms included in the [LICENSE](LICENSE) file.
