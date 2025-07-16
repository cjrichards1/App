import React, { useState } from 'react';
import { 
  SparklesIcon, 
  CommandLineIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface ModernFlashcardProps {
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLatex?: boolean;
  onAnswer?: (correct: boolean) => void;
}

export const ModernFlashcard: React.FC<ModernFlashcardProps> = ({
  front,
  back,
  category,
  difficulty,
  isLatex = false,
  onAnswer
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const getDifficultyStyles = () => {
    switch (difficulty) {
      case 'easy':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'var(--success)',
          text: 'var(--success-dark)',
          glow: 'shadow-glow-success'
        };
      case 'medium':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'var(--warning)',
          text: 'var(--warning-dark)',
          glow: 'shadow-glow-secondary'
        };
      case 'hard':
        return {
          bg: 'rgba(244, 63, 94, 0.1)',
          border: 'var(--error)',
          text: 'var(--error-dark)',
          glow: 'shadow-glow-error'
        };
      default:
        return {
          bg: 'rgba(14, 165, 233, 0.1)',
          border: 'var(--primary-500)',
          text: 'var(--primary-700)',
          glow: 'shadow-glow-primary'
        };
    }
  };

  const difficultyStyles = getDifficultyStyles();

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    onAnswer?.(correct);
    
    // Reset after animation
    setTimeout(() => {
      setIsAnswered(false);
      setIsFlipped(false);
    }, 1500);
  };

  return (
    <div className="modern-flashcard-container">
      <div 
        className={`modern-flashcard ${isFlipped ? 'flipped' : ''} ${isAnswered ? 'answered' : ''}`}
        onClick={() => !isAnswered && setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div className="flashcard-face flashcard-front">
          <div className="flashcard-header">
            <div className="flashcard-type-indicator">
              {isLatex ? (
                <div className="type-icon latex-icon">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="type-icon text-icon">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span className="type-label">Question</span>
            </div>
            
            <div 
              className="difficulty-badge"
              style={{
                backgroundColor: difficultyStyles.bg,
                borderColor: difficultyStyles.border,
                color: difficultyStyles.text
              }}
            >
              {difficulty}
            </div>
          </div>

          <div className="flashcard-content">
            <div className="content-text">
              {front}
            </div>
          </div>

          <div className="flashcard-footer">
            <div className="category-tag">
              {category}
            </div>
            <div className="flip-hint">
              <SparklesIcon className="hint-icon" />
              <span>Click to reveal</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-header">
            <div className="flashcard-type-indicator">
              <div className="type-icon answer-icon">
                <LightBulbIcon className="icon" />
              </div>
              <span className="type-label">Answer</span>
            </div>
            
            <div className="category-tag-back">
              {category}
            </div>
          </div>

          <div className="flashcard-content">
            <div className="content-text">
              {back}
            </div>
          </div>

          {onAnswer && (
            <div className="flashcard-actions">
              <button
                className="action-button incorrect-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
              >
                <XCircleIcon className="button-icon" />
                <span>Incorrect</span>
              </button>
              
              <button
                className="action-button correct-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
              >
                <CheckCircleIcon className="button-icon" />
                <span>Correct</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};