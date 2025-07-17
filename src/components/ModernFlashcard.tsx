import React, { useState } from 'react';
import {
  DocumentTextIcon,
  CommandLineIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { InlineMath } from 'react-katex';
import { Flashcard } from '../types/flashcard';

// Custom icon components with proper typing
const LeafIcon: React.FC<{ className?: string }> = (props) => <ArrowPathIcon {...props} />;

interface ModernFlashcardProps {
  card: Flashcard;
  onFlip?: () => void;
}

export const ModernFlashcard: React.FC<ModernFlashcardProps> = ({
  card,
  onFlip
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div 
      className={`flashcard-container ${isFlipped ? 'is-flipped' : ''}`}
      onClick={handleClick}
    >
      <div className="flashcard card-stack texture-grain animate-sway">
        {/* Front */}
        <div className="flashcard-face flashcard-front border-organic">
          <div className="flashcard-header">
            <div className="flashcard-type">
              {card.isLatex ? (
                <div className="icon-container bg-gradient-forest shadow-glow-forest">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="icon-container bg-gradient-earth shadow-glow-earth">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span className="text-gradient-forest">Question</span>
            </div>
            <div className={`difficulty-tag border-pebble ${
              card.difficulty === 'easy' ? 'bg-gradient-moss' :
              card.difficulty === 'medium' ? 'bg-gradient-earth' :
              'bg-gradient-forest'
            }`}>
              {getDifficultyLabel(card.difficulty)}
            </div>
          </div>

          <div className="flashcard-content texture-paper">
            {card.isLatex ? (
              <InlineMath math={card.front} />
            ) : (
              <div className="content-text">{card.front}</div>
            )}
          </div>

          <div className="flashcard-footer">
            <div className="category-tag bg-gradient-moss shadow-natural">
              {card.category}
            </div>
            <div className="flip-hint animate-float">
              <LeafIcon className="w-4 h-4" />
              <span>Flip to reveal</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flashcard-face flashcard-back border-organic">
          <div className="flashcard-header">
            <div className="flashcard-type">
              {card.isLatex ? (
                <div className="icon-container bg-gradient-forest shadow-glow-forest">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="icon-container bg-gradient-earth shadow-glow-earth">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span className="text-gradient-earth">Answer</span>
            </div>
          </div>

          <div className="flashcard-content texture-paper">
            {card.isLatex ? (
              <InlineMath math={card.back} />
            ) : (
              <div className="content-text">{card.back}</div>
            )}
          </div>

          <div className="flashcard-footer">
            <div className="answer-actions">
              <button 
                className="action-btn bg-gradient-moss shadow-natural border-pebble"
                type="button"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Correct</span>
              </button>
              <button 
                className="action-btn bg-gradient-earth shadow-natural border-pebble"
                type="button"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add forest-inspired styles
const styles = `
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  height: 280px;
  margin: 0 auto;
}

.flashcard {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.is-flipped .flashcard {
  transform: rotateY(180deg);
}

.flashcard-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.flashcard-back {
  transform: rotateY(180deg);
}

.flashcard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.flashcard-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-container {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 1rem;
  height: 1rem;
  color: var(--text-inverse);
}

.difficulty-tag {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-inverse);
  border-radius: 1rem;
}

.flashcard-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.content-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.flashcard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-tag {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-inverse);
  border-radius: 1rem;
}

.flip-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.answer-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-inverse);
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.98);
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}