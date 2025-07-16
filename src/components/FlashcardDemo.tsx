import React, { useState } from 'react';
import { ModernFlashcard } from './ModernFlashcard';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const FlashcardDemo: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const sampleCards = [
    {
      front: "What is the derivative of x²?",
      back: "2x",
      category: "calculus",
      difficulty: "easy" as const,
      isLatex: false
    },
    {
      front: "\\int x^2 \\, dx = ?",
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
      front: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = ?",
      back: "1",
      category: "calculus",
      difficulty: "hard" as const,
      isLatex: true
    },
    {
      front: "What does HTML stand for?",
      back: "HyperText Markup Language",
      category: "programming",
      difficulty: "easy" as const,
      isLatex: false
    },
    {
      front: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = ?",
      back: "\\frac{\\pi^2}{6}",
      category: "mathematics",
      difficulty: "hard" as const,
      isLatex: true
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % sampleCards.length);
  };

  const handleAnswer = (correct: boolean) => {
    console.log(`Answer: ${correct ? 'Correct' : 'Incorrect'}`);
    // In a real app, you would track the answer here
  };

  return (
    <div className="flashcard-demo">
      <div className="demo-header">
        <div className="demo-title">
          <SparklesIcon className="title-icon" />
          <h1>Modern Flashcard Demo</h1>
        </div>
        <p className="demo-subtitle">
          Interactive flashcards with smooth animations and LaTeX support
        </p>
      </div>

      <div className="demo-content">
        <div className="card-container">
          <ModernFlashcard
            {...sampleCards[currentCard]}
            onAnswer={handleAnswer}
          />
        </div>

        <div className="demo-controls">
          <button 
            className="btn btn-primary btn-lg"
            onClick={nextCard}
          >
            <ArrowPathIcon className="w-5 h-5" />
            Next Card ({currentCard + 1}/{sampleCards.length})
          </button>
        </div>

        <div className="demo-info">
          <div className="info-grid">
            <div className="info-card">
              <h3>🎯 Interactive</h3>
              <p>Click cards to flip and reveal answers</p>
            </div>
            <div className="info-card">
              <h3>📐 LaTeX Support</h3>
              <p>Beautiful mathematical expressions</p>
            </div>
            <div className="info-card">
              <h3>📱 Responsive</h3>
              <p>Works perfectly on all devices</p>
            </div>
            <div className="info-card">
              <h3>✨ Smooth Animations</h3>
              <p>Fluid 3D flip transitions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};