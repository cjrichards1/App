import React, { useState } from 'react';
import { 
  SparklesIcon, 
  CommandLineIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import '../styles/enhanced-animations.css';

interface ModernFlashcardProps {
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLatex?: boolean;
  onAnswer?: (correct: boolean) => void;
  className?: string;
}

interface LaTeXContentProps {
  content: string;
  isLatex?: boolean;
  isBlock?: boolean;
}

interface DifficultyStyles {
  bg: string;
  border: string;
  text: string;
  glow: string;
}

const LaTeXContent = ({ 
  content, 
  isLatex = false,
  isBlock = false 
}: LaTeXContentProps) => {
  if (!isLatex) return <div>{content}</div>;
  return isBlock ? <BlockMath>{content}</BlockMath> : <InlineMath>{content}</InlineMath>;
};

export const ModernFlashcard = ({
  front,
  back,
  category,
  difficulty,
  isLatex = false,
  onAnswer,
  className = ""
}: ModernFlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const getDifficultyStyles = (): DifficultyStyles => {
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

  const handleCardClick = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`flip-card-container ${className}`}>
      <div 
        className={`flip-card hardware-accelerated ${isFlipped ? 'flipped' : ''} ${isAnswered ? 'pulse-gentle' : ''}`}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <div className="flip-card-face hover-lift shine">
          <div className="flashcard-header">
            <div className="flashcard-type-indicator">
              {isLatex ? (
                <div className="type-icon latex-icon pulse-gentle">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="type-icon text-icon pulse-gentle">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span className="badge type-label">Question</span>
            </div>
            
            <div 
              className="badge difficulty-badge hover-scale"
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
            <div className={`content-text ${isLatex ? 'latex-content' : 'flashcard-question'}`}>
              <LaTeXContent content={front} isLatex={isLatex} />
            </div>
          </div>

          <div className="flashcard-footer">
            <div className="category-tag hover-scale">
              {category}
            </div>
            <div className="flip-hint pulse-gentle">
              <SparklesIcon className="icon" />
              <span>Click to reveal</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-face flip-card-back hover-lift shine">
          <div className="flashcard-header">
            <div className="flashcard-type-indicator">
              <div className="type-icon answer-icon pulse-gentle">
                <LightBulbIcon className="icon" />
              </div>
              <span className="type-label">Answer</span>
            </div>
            
            <div className="category-tag-back hover-scale">
              {category}
            </div>
          </div>

          <div className="flashcard-content">
            <div className="content-text">
              <LaTeXContent content={back} isLatex={isLatex} />
            </div>
          </div>

          {onAnswer && (
            <div className="flashcard-actions">
              <button
                className="action-button incorrect-button btn-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
              >
                <XCircleIcon className="button-icon" />
                <span>Incorrect</span>
              </button>
              
              <button
                className="action-button correct-button btn-hover"
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