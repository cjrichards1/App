import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ChartBarIcon, ClockIcon, CommandLineIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Flashcard, StudySession } from '../types/flashcard';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface StudyModeProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
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
  onUpdateFlashcard
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

    onUpdateFlashcard(currentCard.id, {
      lastStudied: new Date(),
      correctCount: correct ? currentCard.correctCount + 1 : currentCard.correctCount,
      incorrectCount: correct ? currentCard.incorrectCount : currentCard.incorrectCount + 1,
    });
    
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
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-white rounded-2xl p-16 text-center max-w-lg w-full shadow-xl">
          <div className="p-8 rounded-3xl mx-auto mb-8 w-fit bg-gradient-to-br from-flashvibe-coral to-rose-600 shadow-lg">
            <BookOpenIcon className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-flashvibe-slate">No Cards to Study</h2>
          <p className="mb-10 text-xl text-gray-600">Create some flashcards first to start your learning journey!</p>
          <button
            onClick={onBack}
            className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto bg-gradient-to-r from-flashvibe-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
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
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-white rounded-2xl p-16 text-center max-w-3xl w-full shadow-xl animate-scale-in">
          <div className="p-8 rounded-3xl mx-auto mb-8 w-fit bg-gradient-to-br from-flashvibe-green to-green-600 shadow-lg">
            <TrophyIcon className="w-20 h-20 text-white animate-pulse" />
          </div>
          <h2 className="text-5xl font-bold mb-4 text-flashvibe-slate">Session Complete!</h2>
          <p className="mb-10 text-2xl text-gray-600">Excellent work on your study session! 🎉</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-sm">
              <div className="text-4xl font-bold text-flashvibe-green mb-1">{session.correctAnswers}</div>
              <div className="text-sm font-semibold text-flashvibe-green uppercase tracking-wide">Correct</div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl border border-rose-200 shadow-sm">
              <div className="text-4xl font-bold text-flashvibe-coral mb-1">{session.incorrectAnswers}</div>
              <div className="text-sm font-semibold text-flashvibe-coral uppercase tracking-wide">Incorrect</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
              <div className="text-4xl font-bold text-flashvibe-blue mb-1">{getAccuracy()}%</div>
              <div className="text-sm font-semibold text-flashvibe-blue uppercase tracking-wide">Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-1">{getSessionDuration()}</div>
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Minutes</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={resetSession}
              className="flex-1 py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-flashvibe-green to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl text-lg"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-4 px-8 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-flashvibe-coral to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-lg hover:shadow-xl text-lg"
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
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 bg-white shadow-lg hover:shadow-xl text-flashvibe-slate font-semibold border border-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-6 text-base font-semibold">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-lg border border-gray-100">
              <ChartBarIcon className="w-5 h-5 text-flashvibe-blue" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-lg border border-gray-100">
              <ClockIcon className="w-5 h-5 text-flashvibe-green" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold text-flashvibe-slate">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <div className="rounded-full px-4 py-2 text-sm bg-white shadow-lg font-semibold text-gray-600">
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </div>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden bg-gray-200 shadow-inner">
            <div
              className="h-4 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-flashvibe-blue to-blue-600 shadow-sm"
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-16 flex justify-center">
          <div
            className={`flip-card w-96 h-60 sm:w-80 sm:h-48 md:w-96 md:h-60 cursor-pointer ${
              isFlipped ? 'flipped' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flip-card-front p-10 flex flex-col bg-gradient-to-br from-white to-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {currentCard?.isLatex ? (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-flashvibe-coral to-rose-600 shadow-lg">
                        <CommandLineIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-flashvibe-gray to-gray-200 shadow-lg">
                        <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={
                        currentCard?.difficulty === 'easy' 
                          ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }
                          : currentCard?.difficulty === 'medium' 
                          ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }
                          : { backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E' }
                      }
                    >
                      {currentCard?.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-2xl font-medium text-flashvibe-slate">
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.front}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-semibold mt-6 text-gray-400 uppercase tracking-wide">
                  Front
                </div>
              </div>

              <div className="flip-card-back p-10 flex flex-col bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {currentCard?.isLatex ? (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-flashvibe-coral to-rose-600 shadow-lg">
                        <CommandLineIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-flashvibe-gray to-gray-200 shadow-lg">
                        <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Answer</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-flashvibe-blue uppercase tracking-wide">
                    {currentCard?.category}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-2xl font-medium text-flashvibe-slate">
                    {currentCard && (
                      <LaTeXContent 
                        content={currentCard.back}
                        isLatex={currentCard.isLatex}
                        isBlock={true}
                      />
                    )}
                  </div>
                </div>

                <div className="text-center text-sm font-semibold mt-6 text-gray-400 uppercase tracking-wide">
                  Back
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-12">
          <p className="text-xl font-semibold text-gray-600">
            {isFlipped ? 'How did you do?' : 'Click the card to reveal the answer'}
          </p>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-xl transition-all duration-300 text-xl font-bold bg-gradient-to-r from-flashvibe-coral to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-lg hover:shadow-xl"
            >
              <XCircleIcon className="w-6 h-6" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-xl transition-all duration-300 text-xl font-bold bg-gradient-to-r from-flashvibe-green to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
            >
              <CheckCircleIcon className="w-6 h-6" />
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};