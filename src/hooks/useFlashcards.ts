import { useState, useEffect } from 'react';
import { Flashcard, StudySession, FlashcardStats, Folder } from '../types/flashcard';

const STORAGE_KEY = 'flashcards';
const SESSIONS_KEY = 'study-sessions';
const FOLDERS_KEY = 'folders';
const CATEGORIES_KEY = 'categories';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'general',
    'language', 
    'science',
    'math',
    'history'
  ]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    const storedFolders = localStorage.getItem(FOLDERS_KEY);
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    
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
    
    if (storedFolders) {
      const parsed = JSON.parse(storedFolders);
      setFolders(parsed.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
      })));
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  const saveCategories = (newCategories: string[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    setCategories(newCategories);
  };
  const saveFolders = (newFolders: Folder[]) => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(newFolders));
    setFolders(newFolders);
  };

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

  const addFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date(),
      cardCount: 0,
    };
    
    const updated = [...folders, newFolder];
    saveFolders(updated);
    return newFolder.id;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    const updated = folders.map(folder => 
      folder.id === id ? { ...folder, ...updates } : folder
    );
    saveFolders(updated);
  };

  const deleteFolder = (id: string) => {
    // Move all cards from this folder to "uncategorized"
    const updatedCards = flashcards.map(card => 
      card.folderId === id ? { ...card, folderId: undefined } : card
    );
    saveFlashcards(updatedCards);
    
    // Delete the folder
    const updated = folders.filter(folder => folder.id !== id);
    saveFolders(updated);
  };

  const addCategory = (name: string) => {
    if (!categories.includes(name)) {
      const updated = [...categories, name];
      saveCategories(updated);
    }
  };

  const deleteCategory = (categoryToDelete: string) => {
    // Move all cards from this category to "general"
    const updatedCards = flashcards.map(card => 
      card.category === categoryToDelete ? { ...card, category: 'general' } : card
    );
    saveFlashcards(updatedCards);
    
    // Delete the category
    const updated = categories.filter(category => category !== categoryToDelete);
    saveCategories(updated);
  };
  const moveCardToFolder = (cardId: string, folderId?: string) => {
    const updated = flashcards.map(card => 
      card.id === cardId ? { ...card, folderId } : card
    );
    saveFlashcards(updated);
    
    // Update folder card counts
    updateFolderCounts();
  };

  const updateFolderCounts = () => {
    const updated = folders.map(folder => ({
      ...folder,
      cardCount: flashcards.filter(card => card.folderId === folder.id).length,
    }));
    saveFolders(updated);
  };

  // Update folder counts whenever flashcards change
  useEffect(() => {
    if (folders.length > 0) {
      updateFolderCounts();
    }
  }, [flashcards.length]);

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
    folders,
    categories,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addFolder,
    updateFolder,
    deleteFolder,
    moveCardToFolder,
    addCategory,
    deleteCategory,
    markAnswer,
    saveStudySession,
    getStats,
  };
};