import { useState, useEffect, useCallback, useMemo } from 'react';
import { Flashcard, StudySession, FlashcardStats, Folder } from '../types/flashcard';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const STORAGE_KEY = 'flashcards';
const SESSIONS_KEY = 'study-sessions';
const FOLDERS_KEY = 'folders';
const CATEGORIES_KEY = 'categories';
const BATCH_SIZE = 20;

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

  // Memoize storage operations
  const debouncedSave = useMemo(() => 
    debounce((data: unknown, key: string) => {
      localStorage.setItem(key, JSON.stringify(data));
    }, 1000),
    []
  );

  // Progressive loading of flashcards
  const loadFlashcards = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allCards = JSON.parse(stored);
      // Load cards in batches
      for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
        const batch = allCards.slice(i, i + BATCH_SIZE).map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          lastStudied: card.lastStudied ? new Date(card.lastStudied) : undefined,
        }));
        setFlashcards((prev: Flashcard[]) => [...prev, ...batch]);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    loadFlashcards();
    
    const storedSessions = localStorage.getItem(SESSIONS_KEY);
    const storedFolders = localStorage.getItem(FOLDERS_KEY);
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    
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
  }, [loadFlashcards]);

  const saveCategories = useCallback((newCategories: string[]) => {
    debouncedSave(newCategories, CATEGORIES_KEY);
    setCategories(newCategories);
  }, [debouncedSave]);

  const saveFolders = useCallback((newFolders: Folder[]) => {
    debouncedSave(newFolders, FOLDERS_KEY);
    setFolders(newFolders);
  }, [debouncedSave]);

  const saveFlashcards = useCallback((cards: Flashcard[]) => {
    debouncedSave(cards, STORAGE_KEY);
    setFlashcards(cards);
  }, [debouncedSave]);

  const addFlashcard = useCallback((flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'correctCount' | 'incorrectCount'>) => {
    const newCard: Flashcard = {
      ...flashcard,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      correctCount: 0,
      incorrectCount: 0,
    };
    
    setFlashcards((prev: Flashcard[]) => {
      const updated = [...prev, newCard];
      debouncedSave(updated, STORAGE_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
    setFlashcards((prev: Flashcard[]) => {
      const updated = prev.map((card: Flashcard) => 
        card.id === id ? { ...card, ...updates } : card
      );
      debouncedSave(updated, STORAGE_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev: Flashcard[]) => {
      const updated = prev.filter((card: Flashcard) => card.id !== id);
      debouncedSave(updated, STORAGE_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const addFolder = useCallback((name: string, color: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date(),
      cardCount: 0,
    };
    
    setFolders((prev: Folder[]) => {
      const updated = [...prev, newFolder];
      debouncedSave(updated, FOLDERS_KEY);
      return updated;
    });
    return newFolder.id;
  }, [debouncedSave]);

  const updateFolder = useCallback((id: string, updates: Partial<Folder>) => {
    setFolders((prev: Folder[]) => {
      const updated = prev.map((folder: Folder) => 
        folder.id === id ? { ...folder, ...updates } : folder
      );
      debouncedSave(updated, FOLDERS_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const deleteFolder = useCallback((id: string) => {
    // Move all cards from this folder to "uncategorized"
    setFlashcards((prev: Flashcard[]) => {
      const updatedCards = prev.map((card: Flashcard) => 
        card.folderId === id ? { ...card, folderId: undefined } : card
      );
      debouncedSave(updatedCards, STORAGE_KEY);
      return updatedCards;
    });
    
    // Delete the folder
    setFolders((prev: Folder[]) => {
      const updated = prev.filter((folder: Folder) => folder.id !== id);
      debouncedSave(updated, FOLDERS_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const addCategory = useCallback((name: string) => {
    if (!categories.includes(name)) {
      setCategories((prev: string[]) => {
        const updated = [...prev, name];
        debouncedSave(updated, CATEGORIES_KEY);
        return updated;
      });
    }
  }, [categories, debouncedSave]);

  const deleteCategory = useCallback((categoryToDelete: string) => {
    // Move all cards from this category to "general"
    setFlashcards((prev: Flashcard[]) => {
      const updatedCards = prev.map((card: Flashcard) => 
        card.category === categoryToDelete ? { ...card, category: 'general' } : card
      );
      debouncedSave(updatedCards, STORAGE_KEY);
      return updatedCards;
    });
    
    // Delete the category
    setCategories((prev: string[]) => {
      const updated = prev.filter(category => category !== categoryToDelete);
      debouncedSave(updated, CATEGORIES_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const moveCardToFolder = useCallback((cardId: string, folderId?: string) => {
    setFlashcards((prev: Flashcard[]) => {
      const updated = prev.map((card: Flashcard) => 
        card.id === cardId ? { ...card, folderId } : card
      );
      debouncedSave(updated, STORAGE_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const updateFolderCounts = useCallback(() => {
    setFolders((prev: Folder[]) => {
      const updated = prev.map(folder => ({
        ...folder,
        cardCount: flashcards.filter(card => card.folderId === folder.id).length,
      }));
      debouncedSave(updated, FOLDERS_KEY);
      return updated;
    });
  }, [flashcards, debouncedSave]);

  // Update folder counts when flashcards change
  useEffect(() => {
    if (folders.length > 0) {
      updateFolderCounts();
    }
  }, [folders.length, updateFolderCounts]);

  const markAnswer = useCallback((id: string, correct: boolean) => {
    setFlashcards((prev: Flashcard[]) => {
      const updated = prev.map((card: Flashcard) => {
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
      debouncedSave(updated, STORAGE_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const saveStudySession = useCallback((session: StudySession) => {
    setStudySessions((prev: StudySession[]) => {
      const updated = [...prev, session];
      debouncedSave(updated, SESSIONS_KEY);
      return updated;
    });
  }, [debouncedSave]);

  const getStats = useCallback((): FlashcardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const studiedToday = flashcards.filter((card: Flashcard) => 
      card.lastStudied && card.lastStudied >= today
    ).length;

    const totalAttempts = flashcards.reduce((sum: number, card: Flashcard) => 
      sum + card.correctCount + card.incorrectCount, 0
    );
    
    const totalCorrect = flashcards.reduce((sum: number, card: Flashcard) => 
      sum + card.correctCount, 0
    );

    const averageAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    const categoryBreakdown = flashcards.reduce((acc: Record<string, number>, card: Flashcard) => {
      acc[card.category] = (acc[card.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards: flashcards.length,
      studiedToday,
      averageAccuracy,
      categoryBreakdown,
    };
  }, [flashcards]);

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