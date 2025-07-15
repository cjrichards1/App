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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAFBFC' }}>
        <div className="card-quizlet p-12 text-center max-w-lg w-full">
          <div className="p-6 rounded-2xl bg-pink-500 mx-auto mb-8 w-fit">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold heading-primary mb-4">No Cards to Study</h2>
          <p className="mb-8 text-lg text-muted">Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="btn-primary px-8 py-4 text-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAFBFC' }}>
        <div className="card-quizlet p-12 text-center max-w-lg w-full">
          <div className="p-6 rounded-2xl bg-green-500 mx-auto mb-8 w-fit">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold heading-primary mb-4">Session Complete!</h2>
          <p className="mb-8 text-lg text-muted">Great job studying your flashcards!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-green-50 border border-green-200">
              <div className="text-3xl font-bold text-green-600">{session.correctAnswers}</div>
              <div className="text-sm font-medium text-green-600">Correct</div>
            </div>
            <div className="p-6 rounded-xl bg-pink-50 border border-pink-200">
              <div className="text-3xl font-bold text-pink-600">{session.incorrectAnswers}</div>
              <div className="text-sm font-medium text-pink-600">Incorrect</div>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{getAccuracy()}%</div>
              <div className="text-sm font-medium text-blue-600">Accuracy</div>
            </div>
            <div className="p-6 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{getSessionDuration()}</div>
              <div className="text-sm font-medium text-purple-600">Minutes</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetSession}
              className="btn-primary flex-1 py-3 font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="btn-secondary flex-1 py-3 font-semibold"
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
    <div className="min-h-screen p-6" style={{ background: '#FAFBFC' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Library</span>
          </button>
          
          <div className="flex items-center gap-8 text-base font-medium text-muted">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{getAccuracy()}% accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getSessionDuration()} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <span className="text-base font-medium text-muted">
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-12">
          <div
            className={`flashcard-modern p-12 cursor-pointer ${
              isFlipped ? 'transform rotateY-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                {currentCard?.isLatex ? (
                  <div className="p-2 rounded-lg bg-pink-500">
                    <FunctionSquare className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Type className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <span className="text-base font-semibold text-muted">
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
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
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {currentCard?.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[200px] text-center">
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

            <div className="text-center text-base font-medium mt-8 text-muted">
              {isFlipped ? 'Rate your answer' : 'Click to reveal answer'}
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        {isFlipped && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-3 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-xl transition-all duration-200 text-lg font-semibold"
            >
              <XCircle className="w-5 h-5" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl transition-all duration-200 text-lg font-semibold"
            >
              <CheckCircle className="w-5 h-5" />
              Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};