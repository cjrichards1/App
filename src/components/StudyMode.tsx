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
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="gradient-card rounded-3xl shadow-strong p-10 text-center max-w-lg w-full">
          <div className="p-4 rounded-2xl gradient-secondary shadow-colored-secondary mx-auto mb-6 w-fit">
            <Trophy className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gradient">No Cards to Study</h2>
          <p className="mb-8 text-lg" style={{ color: '#6B7280' }}>Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="text-white px-8 py-4 rounded-xl transition-all duration-300 btn-scale shadow-colored-primary text-lg font-semibold"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="gradient-card rounded-3xl shadow-strong p-10 text-center max-w-lg w-full">
          <div className="p-4 rounded-2xl gradient-accent shadow-colored-accent mx-auto mb-6 w-fit float">
            <Trophy className="w-20 h-20 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gradient">Session Complete!</h2>
          <p className="mb-8 text-lg" style={{ color: '#6B7280' }}>Great job studying your flashcards!</p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl shadow-soft" style={{ backgroundColor: '#d1fae5' }}>
              <div className="text-3xl font-bold" style={{ color: '#10B981' }}>{session.correctAnswers}</div>
              <div className="text-sm font-medium" style={{ color: '#10B981' }}>Correct</div>
            </div>
            <div className="p-6 rounded-2xl shadow-soft" style={{ backgroundColor: '#fdf2f8' }}>
              <div className="text-3xl font-bold" style={{ color: '#F43F5E' }}>{session.incorrectAnswers}</div>
              <div className="text-sm font-medium" style={{ color: '#F43F5E' }}>Incorrect</div>
            </div>
            <div className="p-6 rounded-2xl shadow-soft" style={{ backgroundColor: '#dbeafe' }}>
              <div className="text-3xl font-bold" style={{ color: '#3B82F6' }}>{getAccuracy()}%</div>
              <div className="text-sm font-medium" style={{ color: '#3B82F6' }}>Accuracy</div>
            </div>
            <div className="p-6 rounded-2xl shadow-soft" style={{ backgroundColor: '#fbcfe8' }}>
              <div className="text-3xl font-bold" style={{ color: '#F43F5E' }}>{getSessionDuration()}</div>
              <div className="text-sm font-medium" style={{ color: '#F43F5E' }}>Minutes</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetSession}
              className="flex-1 text-white px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 btn-scale shadow-colored-primary font-semibold"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
            >
              <RotateCcw className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 btn-scale shadow-soft font-semibold"
              style={{ backgroundColor: '#F8FAFC', color: '#1F2937' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 btn-scale px-4 py-2 rounded-xl"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Back to Library</span>
          </button>
          
          <div className="flex items-center gap-8 text-lg font-medium" style={{ color: '#6B7280' }}>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold" style={{ color: '#1F2937' }}>
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <span className="text-lg font-medium" style={{ color: '#6B7280' }}>
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-soft">
            <div
              className="h-3 rounded-full progress-bar shadow-colored-primary"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-10">
          <div
            className={`gradient-card rounded-3xl shadow-strong p-10 min-h-[450px] cursor-pointer transition-all duration-500 card-hover ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {currentCard?.isLatex ? (
                  <div className="p-2 rounded-lg gradient-secondary shadow-colored-secondary">
                    <FunctionSquare className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                    <Type className="w-6 h-6" style={{ color: '#6B7280' }} />
                  </div>
                )}
                <span className="text-lg font-semibold" style={{ color: '#6B7280' }}>
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold shadow-soft"
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
                <span className="px-4 py-2 rounded-full text-sm font-semibold shadow-soft" style={{ backgroundColor: '#F8FAFC', color: '#1F2937' }}>
                  {currentCard?.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[250px] text-center">
              <div className="text-2xl leading-relaxed">
                {currentCard && (
                  <LaTeXContent 
                    content={isFlipped ? currentCard.back : currentCard.front}
                    isLatex={currentCard.isLatex}
                    isBlock={true}
                  />
                )}
              </div>
            </div>

            <div className="text-center text-lg font-medium mt-8" style={{ color: '#6B7280' }}>
              {isFlipped ? 'Rate your answer' : 'Click to reveal answer'}
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-3 text-white px-10 py-5 rounded-2xl transition-all duration-300 text-xl font-semibold btn-scale shadow-colored-secondary"
              style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' }}
            >
              <XCircle className="w-7 h-7" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-3 text-white px-10 py-5 rounded-2xl transition-all duration-300 text-xl font-semibold btn-scale shadow-colored-accent"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              <CheckCircle className="w-7 h-7" />
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};