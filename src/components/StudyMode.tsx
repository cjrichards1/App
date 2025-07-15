import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, TargetIcon, ClockIcon, CommandLineIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex items-center justify-center p-6">
        <div className="empty-state bg-white rounded-xl p-12 text-center max-w-lg w-full shadow-lg border border-blue-100">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 mx-auto mb-8 w-fit">
            <TrophyIcon className="w-16 h-16 text-white pulse-icon" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">No Cards to Study</h2>
          <p className="mb-8 text-lg text-gray-600">Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="btn-primary px-8 py-4 text-lg font-semibold text-white rounded-lg focus-ring"
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
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-12 text-center max-w-2xl w-full shadow-lg border border-blue-100 animate-bounce-in">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 mx-auto mb-8 w-fit">
            <TrophyIcon className="w-16 h-16 text-white animate-pulse-glow" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Session Complete!</h2>
          <p className="mb-8 text-xl text-gray-600">Excellent work on your study session!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="text-3xl font-bold text-green-600">{session.correctAnswers}</div>
              <div className="text-sm font-medium text-green-600">Correct</div>
            </div>
            <div className="stat-card p-6 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200">
              <div className="text-3xl font-bold text-rose-600">{session.incorrectAnswers}</div>
              <div className="text-sm font-medium text-rose-600">Incorrect</div>
            </div>
            <div className="stat-card p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{getAccuracy()}%</div>
              <div className="text-sm font-medium text-blue-600">Accuracy</div>
            </div>
            <div className="stat-card p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{getSessionDuration()}</div>
              <div className="text-sm font-medium text-purple-600">Minutes</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetSession}
              className="btn-primary flex-1 py-4 px-6 text-white rounded-lg font-semibold flex items-center justify-center gap-3 focus-ring"
              aria-label="Study again"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="btn-secondary flex-1 py-4 px-6 text-white rounded-lg font-semibold flex items-center justify-center gap-3 focus-ring"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-slate-700 hover:bg-gray-50 transition-all duration-300 border border-gray-200 focus-ring"
            aria-label="Back to dashboard"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-8 text-base font-medium text-gray-600">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <TargetIcon className="w-4 h-4" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <ClockIcon className="w-4 h-4" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-slate-800">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
                      <div className="p-2 rounded-lg bg-rose-500">
                        <CommandLineIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-gray-100">
                        <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-600">Question</span>
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
                  <div className="card-content text-xl text-slate-800">
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.front}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-medium text-gray-500 mt-4">
                  Front
                </div>
              </div>

              <div className="flip-card-back p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {currentCard?.isLatex ? (
                      <div className="p-2 rounded-lg bg-rose-500">
                        <CommandLineIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-gray-100">
                        <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-600">Answer</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {currentCard?.category}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="card-content text-xl text-slate-800">
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.back}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-medium text-gray-500 mt-4">
                  Back
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-600">
            {isFlipped ? 'How did you do?' : 'Click the card to reveal the answer'}
          </p>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => handleAnswer(false)}
              className="btn-secondary flex items-center justify-center gap-3 px-8 py-4 text-white rounded-lg transition-all duration-300 text-lg font-semibold focus-ring"
              aria-label="Mark answer as incorrect"
            >
              <XCircleIcon className="w-5 h-5" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-white rounded-lg transition-all duration-300 text-lg font-semibold hover:scale-105 focus-ring"
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