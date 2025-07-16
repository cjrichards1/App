import React, { useState } from 'react';
import { ModernFlashcard } from './ModernFlashcard';
import { SunIcon, MoonIcon, SwatchIcon } from '@heroicons/react/24/outline';

export const ColorSystemDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const sampleCards = [
    {
      front: "What is the derivative of x²?",
      back: "2x",
      category: "calculus",
      difficulty: "easy" as const,
      isLatex: false
    },
    {
      front: "\\int x^2 dx = ?",
      back: "\\frac{x^3}{3} + C",
      category: "mathematics",
      difficulty: "medium" as const,
      isLatex: true
    },
    {
      front: "What is the capital of France?",
      back: "Paris",
      category: "geography",
      difficulty: "easy" as const,
      isLatex: false
    },
    {
      front: "Solve: \\lim_{x \\to 0} \\frac{\\sin x}{x}",
      back: "1",
      category: "calculus",
      difficulty: "hard" as const,
      isLatex: true
    }
  ];

  return (
    <div className="color-system-demo">
      {/* Theme Toggle */}
      <div className="demo-header">
        <div className="demo-title">
          <SwatchIcon className="title-icon" />
          <h1>Modern Color System Demo</h1>
        </div>
        
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? (
            <>
              <SunIcon className="theme-icon" />
              <span>Light Mode</span>
            </>
          ) : theme === 'dark' ? (
            <>
              <MoonIcon className="theme-icon" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <SwatchIcon className="theme-icon" />
              <span>Auto Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Color Palette Display */}
      <div className="color-palette">
        <div className="palette-section">
          <h3>Primary Colors</h3>
          <div className="color-row">
            <div className="color-swatch primary-500"></div>
            <div className="color-swatch primary-600"></div>
            <div className="color-swatch primary-700"></div>
          </div>
        </div>
        
        <div className="palette-section">
          <h3>Secondary Colors</h3>
          <div className="color-row">
            <div className="color-swatch secondary-400"></div>
            <div className="color-swatch secondary-500"></div>
            <div className="color-swatch secondary-600"></div>
          </div>
        </div>
        
        <div className="palette-section">
          <h3>Accent Colors</h3>
          <div className="color-row">
            <div className="color-swatch accent-emerald"></div>
            <div className="color-swatch accent-rose"></div>
            <div className="color-swatch accent-violet"></div>
            <div className="color-swatch accent-amber"></div>
          </div>
        </div>
      </div>

      {/* Gradient Examples */}
      <div className="gradient-examples">
        <h3>Gradient Examples</h3>
        <div className="gradient-row">
          <div className="gradient-sample bg-gradient-primary">Primary</div>
          <div className="gradient-sample bg-gradient-secondary">Secondary</div>
          <div className="gradient-sample bg-gradient-sunset">Sunset</div>
          <div className="gradient-sample bg-gradient-ocean">Ocean</div>
        </div>
      </div>

      {/* Sample Flashcards */}
      <div className="flashcard-samples">
        <h3>Sample Flashcards</h3>
        <div className="cards-grid">
          {sampleCards.map((card, index) => (
            <ModernFlashcard
              key={index}
              {...card}
              onAnswer={(correct) => console.log(`Card ${index + 1}: ${correct ? 'Correct' : 'Incorrect'}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};