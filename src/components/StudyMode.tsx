import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ChartBarIcon, ClockIcon, CommandLineIcon, DocumentTextIcon, BookOpenIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { Flashcard, StudySession } from '../types/flashcard';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface StudyModeProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
}

// Memoized empty state component
const EmptyState = React.memo(({ onBack }: { onBack: () => void }) => (
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
));

// Memoized flashcard component
const FlashCard = React.memo(({ 
  card, 
  isFlipped, 
  onFlip, 
  onAnswer 
}: { 
  card: Flashcard; 
  isFlipped: boolean; 
  onFlip: () => void;
  onAnswer: (correct: boolean) => void;
}) => (
  <div
    className={`flip-card-container w-96 h-60 sm:w-80 sm:h-48 md:w-96 md:h-60 cursor-pointer ${
      isFlipped ? 'flipped' : ''
    }`}
    onClick={onFlip}
  >
    <div className="flip-card shadow-2xl hover:shadow-3xl transition-all duration-300">
      {/* Front */}
      <div className="flip-card-face flip-card-front p-10 flex flex-col bg-gradient-to-br from-white to-gray-50 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {card.isLatex ? (
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
                card.difficulty === 'easy' 
                  ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }
                  : card.difficulty === 'medium' 
                  ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }
                  : { backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E' }
              }
            >
              {card.difficulty}
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-center">
          <div className="text-2xl font-medium text-flashvibe-slate">
            {card.isLatex ? <InlineMath math={card.front} /> : card.front}
          </div>
        </div>

        <div className="text-center text-sm font-semibold mt-6 text-gray-400 uppercase tracking-wide">
          Front
        </div>
      </div>

      {/* Back */}
      <div className="flip-card-face flip-card-back p-10 flex flex-col bg-gradient-to-br from-white to-blue-50 border border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {card.isLatex ? (
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
            {card.category}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center text-center">
          <div className="text-2xl font-medium text-flashvibe-slate">
            {card.isLatex ? <InlineMath math={card.back} /> : card.back}
          </div>
        </div>

        <div className="text-center text-sm font-semibold mt-6 text-gray-400 uppercase tracking-wide">
          Back
        </div>
      </div>
    </div>
  </div>
));

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

  // Memoize shuffled cards
  useEffect(() => {
    if (flashcards.length > 0) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setSession(prev => ({ ...prev, totalCards: shuffled.length }));
    }
  }, [flashcards]);

  const currentCard = useMemo(() => 
    shuffledCards[currentIndex],
    [shuffledCards, currentIndex]
  );

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!currentCard) return;

    // Batch state updates
    const batchUpdate = () => {
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
        setIsComplete(true);
      }
    };

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(batchUpdate);
  }, [currentCard, currentIndex, shuffledCards.length, onUpdateFlashcard]);

  const resetSession = useCallback(() => {
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
  }, [flashcards]);

  // Memoize stats calculations
  const stats = useMemo(() => {
    const accuracy = session.totalCards > 0 
      ? Math.round((session.correctAnswers / session.totalCards) * 100) 
      : 0;
    
    const duration = Math.round(
      ((session.endTime || new Date()).getTime() - session.startTime.getTime()) / 1000 / 60
    );

    return { accuracy, duration };
  }, [session]);

  if (shuffledCards.length === 0) {
    return <EmptyState onBack={onBack} />;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-white rounded-2xl p-16 text-center max-w-lg w-full shadow-xl">
          <div className="p-8 rounded-3xl mx-auto mb-8 w-fit bg-gradient-to-br from-flashvibe-blue to-blue-600 shadow-lg">
            <TrophyIcon className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-flashvibe-slate">Session Complete!</h2>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-xl bg-blue-50">
              <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
              <div className="text-sm text-blue-600">Accuracy</div>
            </div>
            <div className="p-6 rounded-xl bg-green-50">
              <ClockIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.duration}m</div>
              <div className="text-sm text-green-600">Duration</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Exit
            </button>
            <button
              onClick={resetSession}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Study Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Exit study session"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div className="text-lg font-medium text-gray-600">
          Card {currentIndex + 1} of {shuffledCards.length}
        </div>
      </div>

      {currentCard && (
        <FlashCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};