import React, { useState } from 'react';
import {
  DocumentTextIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { InlineMath } from 'react-katex';
import { Flashcard } from '../types/flashcard';

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

  return (
    <div
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={handleClick}
    >
      <div className="flip-card">
        {/* Front */}
        <div className="flip-card-face flip-card-front">
          <div className="card-header">
            <div className="card-type">
              {card.isLatex ? (
                <div className="latex-icon">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="text-icon">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span>Question</span>
            </div>
            <div className="difficulty-badge" data-difficulty={card.difficulty}>
              {card.difficulty}
            </div>
          </div>

          <div className="card-content">
            {card.isLatex ? (
              <InlineMath math={card.front} />
            ) : (
              card.front
            )}
          </div>

          <div className="card-footer">
            Front
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back">
          <div className="card-header">
            <div className="card-type">
              {card.isLatex ? (
                <div className="latex-icon">
                  <CommandLineIcon className="icon" />
                </div>
              ) : (
                <div className="text-icon">
                  <DocumentTextIcon className="icon" />
                </div>
              )}
              <span>Answer</span>
            </div>
            <div className="category-badge">
              {card.category}
            </div>
          </div>

          <div className="card-content">
            {card.isLatex ? (
              <InlineMath math={card.back} />
            ) : (
              card.back
            )}
          </div>

          <div className="card-footer">
            Back
          </div>
        </div>
      </div>
    </div>
  );
};