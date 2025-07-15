import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ChartBarIcon, ClockIcon, CommandLineIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Flashcard, StudySession } from '../types/flashcard';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface StudyModeProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onMarkAnswer: (id: string, correct: boolean) => void;
  onSaveSession: (session: StudySession) => void;
}

const LaTeXContent: React.FC<{ content: string; isLatex: boolean; isBlock?: boolean }> = ({ 
  content, 
  isLatex, 
  isBlock = false 
}) => {
  if (!isLatex) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  try {
    if (isBlock) {
      return <BlockMath math={content} />;
    }
    return <InlineMath math={content} />;
  } catch (error) {
    return <span className="text-red-500">Invalid LaTeX: {content}</span>;
  }
};

export const StudyMode: React.FC<StudyModeProps> = ({ 
  flashcards, 
  onBack, 
  onMarkAnswer, 
  onSaveSession 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [session, setSession] = useState<StudySession>({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: new Date(),
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setSession(prev => ({ ...prev, totalCards: shuffled.length }));
    }
  }, [flashcards]);

  const currentCard = shuffledCards[currentIndex];

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    onMarkAnswer(currentCard.id, correct);
    setSession(prev => ({
      ...prev,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: correct ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
    }));

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      const completedSession = {
        ...session,
        correctAnswers: correct ? session.correctAnswers + 1 : session.correctAnswers,
        incorrectAnswers: correct ? session.incorrectAnswers : session.incorrectAnswers + 1,
        endTime: new Date(),
      };
      onSaveSession(completedSession);
      setIsComplete(true);
    }
  };

  const resetSession = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    setSession({
      totalCards: shuffled.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      startTime: new Date(),
    });
  };

  const getAccuracy = () => {
    const total = session.correctAnswers + session.incorrectAnswers;
    return total > 0 ? Math.round((session.correctAnswers / total) * 100) : 0;
  };

  const getSessionDuration = () => {
    const start = session.startTime;
    const end = session.endTime || new Date();
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);
    return duration;
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="empty-state rounded-xl p-12 text-center max-w-lg w-full shadow-lg border-2 border-gradient" 
             style={{ backgroundColor: '#FFFFFF' }}>
          <div className="p-6 rounded-2xl mx-auto mb-8 w-fit" 
               style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' }}>
            <TrophyIcon className="w-16 h-16 pulse-icon" style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F2937' }}>No Cards to Study</h2>
          <p className="mb-8 text-lg" style={{ color: '#6B7280' }}>Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="px-8 py-4 text-lg font-semibold rounded-lg focus-ring transition-all duration-300 flex items-center gap-3"
            style={{ 
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
              color: '#FFFFFF',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
            aria-label="Go back to dashboard"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="rounded-xl p-12 text-center max-w-2xl w-full shadow-lg border-2 border-gradient animate-bounce-in" 
             style={{ backgroundColor: '#FFFFFF' }}>
          <div className="p-6 rounded-2xl mx-auto mb-8 w-fit" 
               style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
            <TrophyIcon className="w-16 h-16 animate-pulse-glow" style={{ color: '#FFFFFF' }} />
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>Session Complete!</h2>
          <p className="mb-8 text-xl" style={{ color: '#6B7280' }}>Excellent work on your study session!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card p-6 rounded-xl border" 
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))', 
                   borderColor: 'rgba(16, 185, 129, 0.2)' 
                 }}>
              <div className="text-3xl font-bold" style={{ color: '#10B981' }}>{session.correctAnswers}</div>
              <div className="text-sm font-medium" style={{ color: '#10B981' }}>Correct</div>
            </div>
            <div className="stat-card p-6 rounded-xl border" 
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05), rgba(244, 63, 94, 0.1))', 
                   borderColor: 'rgba(244, 63, 94, 0.2)' 
                 }}>
              <div className="text-3xl font-bold" style={{ color: '#F43F5E' }}>{session.incorrectAnswers}</div>
              <div className="text-sm font-medium" style={{ color: '#F43F5E' }}>Incorrect</div>
            </div>
            <div className="stat-card p-6 rounded-xl border" 
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))', 
                   borderColor: 'rgba(59, 130, 246, 0.2)' 
                 }}>
              <div className="text-3xl font-bold" style={{ color: '#3B82F6' }}>{getAccuracy()}%</div>
              <div className="text-sm font-medium" style={{ color: '#3B82F6' }}>Accuracy</div>
            </div>
            <div className="stat-card p-6 rounded-xl border" 
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.1))', 
                   borderColor: 'rgba(139, 92, 246, 0.2)' 
                 }}>
              <div className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>{getSessionDuration()}</div>
              <div className="text-sm font-medium" style={{ color: '#8B5CF6' }}>Minutes</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetSession}
              className="flex-1 py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 focus-ring transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
              aria-label="Study again"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 focus-ring transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', 
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)'
              }}
              aria-label="Back to dashboard"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border-2 focus-ring"
            style={{ 
              backgroundColor: '#FFFFFF', 
              color: '#1F2937', 
              borderColor: '#E5E7EB' 
            }}
            aria-label="Back to dashboard"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-8 text-base font-medium" style={{ color: '#6B7280' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2" 
                 style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <ChartBarIcon className="w-4 h-4" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2" 
                 style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <ClockIcon className="w-4 h-4" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold" style={{ color: '#1F2937' }}>
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <div className="rounded-full px-3 py-1 text-sm" 
                 style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </div>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
            <div
              className="progress-bar h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-12 flex justify-center">
          <div
            className={`flip-card w-96 h-60 sm:w-80 sm:h-48 md:w-96 md:h-60 cursor-pointer ${
              isFlipped ? 'flipped' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
            aria-label={`Flashcard: ${isFlipped ? 'showing answer' : 'showing question'}. Press Enter or Space to flip.`}
          >
            <div className="flip-card-inner border-gradient shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flip-card-front p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {currentCard?.isLatex ? (
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#F43F5E' }}>
                        <CommandLineIcon className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                        <DocumentTextIcon className="w-5 h-5" style={{ color: '#6B7280' }} />
                      </div>
                    )}
                    <span className="text-sm font-semibold" style={{ color: '#6B7280' }}>Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={
                        currentCard?.difficulty === 'easy' 
                          ? { backgroundColor: '#dcfce7', color: '#16a34a' }
                          : currentCard?.difficulty === 'medium' 
                          ? { backgroundColor: '#fef3c7', color: '#ca8a04' }
                          : { backgroundColor: '#fce7f3', color: '#e11d48' }
                      }
                    >
                      {currentCard?.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="card-content text-xl" style={{ color: '#1F2937' }}>
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.front}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-medium mt-4" style={{ color: '#9CA3AF' }}>
                  Front
                </div>
              </div>

              <div className="flip-card-back p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {currentCard?.isLatex ? (
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#F43F5E' }}>
                        <CommandLineIcon className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                        <DocumentTextIcon className="w-5 h-5" style={{ color: '#6B7280' }} />
                      </div>
                    )}
                    <span className="text-sm font-semibold" style={{ color: '#6B7280' }}>Answer</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" 
                        style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                    {currentCard?.category}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="card-content text-xl" style={{ color: '#1F2937' }}>
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.back}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-medium mt-4" style={{ color: '#9CA3AF' }}>
                  Back
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium" style={{ color: '#6B7280' }}>
            {isFlipped ? 'How did you do?' : 'Click the card to reveal the answer'}
          </p>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg transition-all duration-300 text-lg font-semibold focus-ring"
              style={{ 
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', 
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)'
              }}
              aria-label="Mark answer as incorrect"
            >
              <XCircleIcon className="w-5 h-5" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg transition-all duration-300 text-lg font-semibold hover:scale-105 focus-ring"
              style={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              aria-label="Mark answer as correct"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};