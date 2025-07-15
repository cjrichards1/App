import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Trophy, Target, Clock, Function, Type } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cards to Study</h2>
          <p className="text-gray-600 mb-6">Create some flashcards first to start studying!</p>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
          <p className="text-gray-600 mb-6">Great job studying your flashcards!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{session.correctAnswers}</div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{session.incorrectAnswers}</div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{getAccuracy()}%</div>
              <div className="text-sm text-blue-700">Accuracy</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{getSessionDuration()}</div>
              <div className="text-sm text-purple-700">Minutes</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetSession}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Study Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
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
            <span className="text-sm font-medium text-gray-700">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <span className="text-sm text-gray-600">
              {session.correctAnswers} correct, {session.incorrectAnswers} incorrect
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
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
                  <Function className="w-5 h-5 text-purple-600" />
                ) : (
                  <Type className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentCard?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentCard?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentCard?.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
              className="flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl hover:bg-red-600 transition-colors text-lg font-medium"
            >
              <XCircle className="w-6 h-6" />
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-colors text-lg font-medium"
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