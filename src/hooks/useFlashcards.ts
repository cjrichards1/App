import { useState, useEffect } from 'react';
import { Flashcard, StudySession, FlashcardStats } from '../types/flashcard';

const STORAGE_KEY = 'flashcards';
const SESSIONS_KEY = 'study-sessions';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      setFlashcards(parsed.map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        lastStudied: card.lastStudied ? new Date(card.lastStudied) : undefined,
      })));
    }
    
    if (storedSessions) {
      const parsed = JSON.parse(storedSessions);
      setStudySessions(parsed.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      })));
    }
  }, []);

  const saveFlashcards = (cards: Flashcard[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    setFlashcards(cards);
  };

  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'correctCount' | 'incorrectCount'>) => {
    const newCard: Flashcard = {
      ...flashcard,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      correctCount: 0,
      incorrectCount: 0,
    };
    
    const updated = [...flashcards, newCard];
    saveFlashcards(updated);
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    const updated = flashcards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    saveFlashcards(updated);
  };

  const deleteFlashcard = (id: string) => {
    const updated = flashcards.filter(card => card.id !== id);
    saveFlashcards(updated);
  };

  const markAnswer = (id: string, correct: boolean) => {
    const updated = flashcards.map(card => {
      if (card.id === id) {
        return {
          ...card,
          lastStudied: new Date(),
          correctCount: correct ? card.correctCount + 1 : card.correctCount,
          incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1,
        };
      }
      return card;
    });
    saveFlashcards(updated);
  };

  const saveStudySession = (session: StudySession) => {
    const updated = [...studySessions, session];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    setStudySessions(updated);
  };

  const getStats = (): FlashcardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const studiedToday = flashcards.filter(card => 
      card.lastStudied && card.lastStudied >= today
    ).length;

    const totalAttempts = flashcards.reduce((sum, card) => 
      sum + card.correctCount + card.incorrectCount, 0
    );
    
    const totalCorrect = flashcards.reduce((sum, card) => 
      sum + card.correctCount, 0
    );

    const averageAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    const categoryBreakdown = flashcards.reduce((acc, card) => {
      acc[card.category] = (acc[card.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards: flashcards.length,
      studiedToday,
      averageAccuracy,
      categoryBreakdown,
    };
  };

  return {
    flashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    markAnswer,
    saveStudySession,
    getStats,
  };
};