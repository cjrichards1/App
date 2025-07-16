import React, { useState, useCallback } from 'react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CommandLineIcon,
  DocumentTextIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { InlineMath } from 'react-katex';
import { Flashcard } from '../types/flashcard';

interface StudyModeProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onUpdateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  flashcards,
  onBack,
  onUpdateFlashcard
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studySession, setStudySession] = useState({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: new Date().toISOString()
  });

  const handleAnswer = useCallback((correct: boolean) => {
    const card = flashcards[currentIndex];
    onUpdateFlashcard(card.id, {
      correctCount: card.correctCount + (correct ? 1 : 0),
      incorrectCount: card.incorrectCount + (correct ? 0 : 1),
      lastStudied: new Date().toISOString()
    });

    setStudySession(prev => ({
      ...prev,
      totalCards: prev.totalCards + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (correct ? 0 : 1)
    }));

    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  }, [currentIndex, flashcards, onUpdateFlashcard]);

  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudySession({
      totalCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      startTime: new Date().toISOString()
    });
  }, []);

  if (flashcards.length === 0) {
    return (
      <div className="study-mode-container">
        <div className="empty-state">
          <DocumentTextIcon className="icon-large text-gray-400" />
          <h2>No Flashcards Available</h2>
          <p>Create some flashcards to start studying!</p>
          <button onClick={onBack} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const accuracy = studySession.totalCards > 0
    ? Math.round((studySession.correctAnswers / studySession.totalCards) * 100)
    : 0;

  return (
    <div className="study-mode-container">
      <div className="study-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="study-stats">
          <div className="stat">
            <DocumentTextIcon className="w-5 h-5" />
            <span>{currentIndex + 1}/{flashcards.length}</span>
          </div>
          <div className="stat">
            <ChartBarIcon className="w-5 h-5" />
            <span>{accuracy}%</span>
          </div>
          <button onClick={resetSession} className="reset-button">
            <ArrowPathIcon className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            {currentCard.isLatex ? (
              <InlineMath math={currentCard.front} />
            ) : (
              currentCard.front
            )}
          </div>
          <div className="flashcard-back">
            {currentCard.isLatex ? (
              <InlineMath math={currentCard.back} />
            ) : (
              currentCard.back
            )}
          </div>
        </div>
      </div>

      <div className="answer-buttons">
        <button
          onClick={() => handleAnswer(false)}
          className="btn-incorrect"
          disabled={!isFlipped}
        >
          Incorrect
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="btn-correct"
          disabled={!isFlipped}
        >
          Correct
        </button>
      </div>
    </div>
  );
};