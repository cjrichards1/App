import { useState, useEffect, useCallback } from 'react';
import { Flashcard, StudySession, Folder, NewFlashcard } from '../types/flashcard';
import { supabase } from '../config/supabase';

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories] = useState<string[]>([
    'general',
    'language', 
    'science',
    'math',
    'history'
  ]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load flashcards
        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*');
        
        if (flashcardsError) throw flashcardsError;
        setFlashcards(flashcardsData || []);

        // Load folders
        const { data: foldersData, error: foldersError } = await supabase
          .from('folders')
          .select('*');
        
        if (foldersError) throw foldersError;
        setFolders(foldersData || []);

        // Load study sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*');
        
        if (sessionsError) throw sessionsError;
        setStudySessions(sessionsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const addFlashcard = useCallback(async (flashcard: NewFlashcard) => {
    try {
      const newCard = {
        ...flashcard,
        created_at: new Date().toISOString(),
        correct_count: 0,
        incorrect_count: 0,
      };

      const { data, error } = await supabase
        .from('flashcards')
        .insert([newCard])
        .select()
        .single();

      if (error) throw error;
      
      setFlashcards(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding flashcard:', error);
      throw error;
    }
  }, []);

  const updateFlashcard = useCallback(async (id: string, updates: Partial<Flashcard>) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(card => card.id === id ? data : card)
      );
      return data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  }, []);

  const deleteFlashcard = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFlashcards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  }, []);

  const addFolder = useCallback(async (name: string, color: string) => {
    try {
      const newFolder = {
        name,
        color,
        created_at: new Date().toISOString(),
        card_count: 0,
      };

      const { data, error } = await supabase
        .from('folders')
        .insert([newFolder])
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
      return data.id;
    } catch (error) {
      console.error('Error adding folder:', error);
      throw error;
    }
  }, []);

  const updateFolder = useCallback(async (id: string, updates: Partial<Folder>) => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => 
        prev.map(folder => folder.id === id ? data : folder)
      );
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  }, []);

  const deleteFolder = useCallback(async (id: string) => {
    try {
      // First update all flashcards in this folder
      await supabase
        .from('flashcards')
        .update({ folder_id: null })
        .eq('folder_id', id);

      // Then delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(card => card.folderId === id ? { ...card, folderId: undefined } : card)
      );
      setFolders(prev => prev.filter(folder => folder.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  }, []);

  const moveCardToFolder = useCallback(async (cardId: string, folderId?: string) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update({ folder_id: folderId })
        .eq('id', cardId)
        .select()
        .single();

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(card => card.id === cardId ? data : card)
      );
    } catch (error) {
      console.error('Error moving card to folder:', error);
      throw error;
    }
  }, []);

  const markAnswer = useCallback(async (id: string, correct: boolean) => {
    try {
      const flashcard = flashcards.find(card => card.id === id);
      if (!flashcard) return;

      const updates = {
        last_studied: new Date().toISOString(),
        correct_count: correct ? (flashcard.correctCount + 1) : flashcard.correctCount,
        incorrect_count: correct ? flashcard.incorrectCount : (flashcard.incorrectCount + 1),
      };

      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFlashcards(prev => 
        prev.map(card => card.id === id ? data : card)
      );
    } catch (error) {
      console.error('Error marking answer:', error);
      throw error;
    }
  }, [flashcards]);

  return {
    flashcards,
    folders,
    categories,
    studySessions,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addFolder,
    updateFolder,
    deleteFolder,
    moveCardToFolder,
    markAnswer,
  };
};