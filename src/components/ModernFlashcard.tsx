import React, { useState, useCallback, useMemo } from 'react';
import { 
  SparklesIcon, 
  CommandLineIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ArrowPathIcon
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

// Memoized difficulty styles
const useDifficultyStyles = (difficulty: 'easy' | 'medium' | 'hard') => {
  return useMemo(() => {
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
  }, [difficulty]);
};

// Memoized content component
const CardContent = React.memo(({ content, isLatex }: { content: string; isLatex: boolean }) => (
  <div className="text-xl font-medium text-gray-800">
    {isLatex ? <InlineMath math={content} /> : content}
  </div>
));

// Memoized icon component
const CardIcon = React.memo(({ isLatex }: { isLatex: boolean }) => (
  isLatex ? (
    <div className="type-icon latex-icon pulse-gentle">
      <CommandLineIcon className="icon" />
    </div>
  ) : (
    <div className="type-icon text-icon pulse-gentle">
      <DocumentTextIcon className="icon" />
    </div>
  )
));

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
  const [isFlipping, setIsFlipping] = useState(false);

  const difficultyStyles = useDifficultyStyles(difficulty);

  const handleCardClick = useCallback(() => {
    if (!isAnswered) {
      setIsFlipping(true);
      setIsFlipped(!isFlipped);
      // Reset flipping state after animation completes
      setTimeout(() => setIsFlipping(false), 800);
    }
  }, [isAnswered, isFlipped]);

  const handleAnswer = useCallback((correct: boolean) => {
    // Batch state updates
    const batchUpdate = () => {
      setIsAnswered(true);
      onAnswer?.(correct);
      
      // Reset after animation
      setTimeout(() => {
        setIsAnswered(false);
        setIsFlipped(false);
      }, 1500);
    };

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(batchUpdate);
  }, [onAnswer]);

  return (
    <div 
      className={`flip-card-container ${className} ${isFlipping ? 'no-hover' : ''}`}
      role="button"
      aria-label={isFlipped ? "Click to see question" : "Click to see answer"}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div 
        className={`flip-card hardware-accelerated ${isFlipped ? 'flipped' : ''} ${isAnswered ? 'pulse-gentle' : ''}`}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <div className="flip-card-face hover-lift shine">
          <div className="flashcard-header">
            <div className="flashcard-type-indicator">
              <CardIcon isLatex={isLatex} />
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
            <CardContent content={front} isLatex={isLatex} />
          </div>

          <div className="flashcard-footer">
            <div className="category-tag hover-scale">
              {category}
            </div>
            <div className="flip-hint pulse-gentle">
              <ArrowPathIcon className="icon rotate-animation" />
              <span>Tap to flip</span>
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
            <CardContent content={back} isLatex={isLatex} />
          </div>

          <div className="flashcard-footer">
            <div className="flip-hint pulse-gentle">
              <ArrowPathIcon className="icon rotate-animation" />
              <span>Tap to flip back</span>
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