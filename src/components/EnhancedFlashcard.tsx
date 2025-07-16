import React, { useState } from 'react';
import { 
  SparklesIcon, 
  CommandLineIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface EnhancedFlashcardProps {
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLatex?: boolean;
  onAnswer?: (correct: boolean) => void;
  className?: string;
}

const LaTeXContent: React.FC<{ content: string; isLatex: boolean }> = ({ content, isLatex }) => {
  if (!isLatex) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  try {
    const isBlockMath = content.includes('\\[') || content.includes('\\begin{') || content.includes('$$');
    
    if (isBlockMath) {
      return <BlockMath math={content} />;
    }
    return <InlineMath math={content} />;
  } catch (error) {
    return <span className="text-red-500 text-sm">Invalid LaTeX: {content}</span>;
  }
};

export const EnhancedFlashcard: React.FC<EnhancedFlashcardProps> = ({
  front,
  back,
  category,
  difficulty,
  isLatex = false,
  onAnswer,
  className = ""
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);

  const getDifficultyStyles = () => {
    switch (difficulty) {
      case 'easy':
        return {
          bg: 'from-green-400 to-green-600',
          text: 'text-green-700',
          border: 'border-green-200',
          glow: 'shadow-green-500/30'
        };
      case 'medium':
        return {
          bg: 'from-yellow-400 to-orange-500',
          text: 'text-orange-700',
          border: 'border-orange-200',
          glow: 'shadow-orange-500/30'
        };
      case 'hard':
        return {
          bg: 'from-red-400 to-red-600',
          text: 'text-red-700',
          border: 'border-red-200',
          glow: 'shadow-red-500/30'
        };
      default:
        return {
          bg: 'from-blue-400 to-blue-600',
          text: 'text-blue-700',
          border: 'border-blue-200',
          glow: 'shadow-blue-500/30'
        };
    }
  };

  const difficultyStyles = getDifficultyStyles();

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    setAnswerResult(correct ? 'correct' : 'incorrect');
    onAnswer?.(correct);
    
    // Reset after animation
    setTimeout(() => {
      setIsAnswered(false);
      setAnswerResult(null);
      setIsFlipped(false);
    }, 2000);
  };

  const handleCardClick = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className={`enhanced-flashcard-container ${className}`}>
      <div className="flip-card-container perspective-1000">
        <div 
          className={`flip-card-enhanced cursor-pointer transition-all duration-700 ${
            isFlipped ? 'flipped' : ''
          } ${isAnswered ? (answerResult === 'correct' ? 'animate-success' : 'animate-error') : ''}`}
          onClick={handleCardClick}
        >
          {/* Front of Card */}
          <div className="flip-card-face absolute w-full h-full backface-hidden">
            <div className="card-hover bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-100 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${isLatex ? 'from-pink-500 to-rose-600' : 'from-blue-500 to-blue-600'} shadow-lg`}>
                    {isLatex ? (
                      <CommandLineIcon className="w-5 h-5 text-white" />
                    ) : (
                      <DocumentTextIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Question</span>
                    <div className="text-sm text-gray-600">{isLatex ? 'LaTeX' : 'Text'}</div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${difficultyStyles.bg} text-white shadow-lg`}>
                  {difficulty}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center text-center">
                <div className="text-xl font-medium text-gray-800 leading-relaxed">
                  <LaTeXContent content={front} isLatex={isLatex} />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold capitalize shadow-md">
                  {category}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <SparklesIcon className="w-4 h-4 animate-sparkle" />
                  <span>Click to flip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="flip-card-face absolute w-full h-full backface-hidden transform rotate-y-180">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-xl border border-blue-100 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <LightBulbIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Answer</span>
                    <div className="text-sm text-gray-600">Solution</div>
                  </div>
                </div>
                
                <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-semibold capitalize shadow-md">
                  {category}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center text-center">
                <div className="text-xl font-medium text-gray-800 leading-relaxed">
                  <LaTeXContent content={back} isLatex={isLatex} />
                </div>
              </div>

              {/* Answer Buttons */}
              {onAnswer && !isAnswered && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold btn-hover-lift focus-ring"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Incorrect
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold btn-hover-lift focus-ring"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Correct
                  </button>
                </div>
              )}

              {/* Result Display */}
              {isAnswered && (
                <div className={`flex items-center justify-center gap-2 mt-6 p-4 rounded-xl ${
                  answerResult === 'correct' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {answerResult === 'correct' ? (
                    <>
                      <CheckCircleIcon className="w-6 h-6 animate-success-checkmark" />
                      <span className="font-bold">Correct! Well done!</span>
                      <StarIcon className="w-5 h-5 animate-sparkle" />
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-6 h-6" />
                      <span className="font-bold">Try again next time!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};