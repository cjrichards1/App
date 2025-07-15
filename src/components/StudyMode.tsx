import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Trophy, Target, Clock, FunctionSquare, Type } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>No Cards to Study</h2>
          <p className="mb-6" style={{ color: '#6B7280' }}>Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#3B82F6' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: '#10B981' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>Session Complete!</h2>
          <p className="mb-6" style={{ color: '#6B7280' }}>Great job studying your flashcards!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#d1fae5' }}>
              <div className="text-2xl font-bold" style={{ color: '#10B981' }}>{session.correctAnswers}</div>
              <div className="text-sm" style={{ color: '#10B981' }}>Correct</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fdf2f8' }}>
              <div className="text-2xl font-bold" style={{ color: '#F43F5E' }}>{session.incorrectAnswers}</div>
              <div className="text-sm" style={{ color: '#F43F5E' }}>Incorrect</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>{getAccuracy()}%</div>
              <div className="text-sm" style={{ color: '#3B82F6' }}>Accuracy</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fbcfe8' }}>
              <div className="text-2xl font-bold" style={{ color: '#F43F5E' }}>{getSessionDuration()}</div>
              <div className="text-sm" style={{ color: '#F43F5E' }}>Minutes</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetSession}
              className="flex-1 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <RotateCcw className="w-4 h-4" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>
          
          <div className="flex items-center gap-6 text-sm" style={{ color: '#6B7280' }}>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#1F2937' }}>
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <span className="text-sm" style={{ color: '#6B7280' }}>
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: '#3B82F6' }}
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-8">
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 min-h-[400px] cursor-pointer transition-transform duration-300 ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {currentCard?.isLatex ? (
                  <FunctionSquare className="w-5 h-5" style={{ color: '#F43F5E' }} />
                ) : (
                  <Type className="w-5 h-5" style={{ color: '#6B7280' }} />
                )}
                <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={
                    currentCard?.difficulty === 'easy' 
                      ? { backgroundColor: '#d1fae5', color: '#10B981' }
                      : currentCard?.difficulty === 'medium' 
                      ? { backgroundColor: '#fef3c7', color: '#f59e0b' }
                      : { backgroundColor: '#fdf2f8', color: '#F43F5E' }
                  }
                >
                  {currentCard?.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}>
                  {currentCard?.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[250px] text-center">
              <div className="text-xl leading-relaxed">
                {currentCard && (
                  <LaTeXContent 
                    content={isFlipped ? currentCard.back : currentCard.front}
                    isLatex={currentCard.isLatex}
                    isBlock={true}
                  />
                )}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              {isFlipped ? 'Rate your answer' : 'Click to reveal answer'}
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-2 text-white px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg font-medium"
              style={{ backgroundColor: '#F43F5E' }}
            >
              <XCircle className="w-6 h-6" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-2 text-white px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg font-medium"
              style={{ backgroundColor: '#10B981' }}
            >
              <CheckCircle className="w-6 h-6" />
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};