import React, { useState } from 'react';
import { Trash2, Edit3, BookOpen, Calendar, ChartBarIcon, FunctionSquare, Type, FolderPlus, Folder as FolderIcon, Move } from 'lucide-react';
import { Flashcard, Folder } from '../types/flashcard';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FlashcardListProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Flashcard>) => void;
  onAddFolder: (name: string, color: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveCard: (cardId: string, folderId?: string) => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'language', label: 'Language' },
  { value: 'science', label: 'Science' },
  { value: 'math', label: 'Mathematics' },
  { value: 'history', label: 'History' },
];

const LaTeXContent: React.FC<{ content: string; isLatex: boolean }> = ({ content, isLatex }) => {
  if (!isLatex) {
    return <span>{content}</span>;
  }

  try {
    return <InlineMath math={content} />;
  } catch (error) {
    return <span className="text-red-500">Invalid LaTeX: {content}</span>;
  }
};

const folderColors = [
  '#3B82F6', // Electric Blue
  '#F43F5E', // Vibrant Coral
  '#10B981', // Lime Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export const FlashcardList: React.FC<FlashcardListProps> = ({ 
  flashcards, 
  folders, 
  onDelete, 
  onEdit, 
  onAddFolder, 
  onDeleteFolder, 
  onMoveCard 
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ front: '', back: '', category: '', difficulty: 'medium' as const });
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(folderColors[0]);
  const [movingCardId, setMovingCardId] = useState<string | null>(null);

  const filteredCards = flashcards.filter(card => {
    if (selectedFolder === 'all') return true;
    if (selectedFolder === 'uncategorized') return !card.folderId;
    return card.folderId === selectedFolder;
  });

  const uncategorizedCount = flashcards.filter(card => !card.folderId).length;

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor(folderColors[0]);
      setShowNewFolderForm(false);
    }
  };

  const handleMoveCard = (cardId: string, folderId?: string) => {
    onMoveCard(cardId, folderId);
    setMovingCardId(null);
  };

  const getCurrentFolderName = () => {
    if (selectedFolder === 'all') return 'All Cards';
    if (selectedFolder === 'uncategorized') return 'Uncategorized';
    const folder = folders.find(f => f.id === selectedFolder);
    return folder ? folder.name : 'Unknown Folder';
  };

  const getCurrentFolderColor = () => {
    if (selectedFolder === 'all' || selectedFolder === 'uncategorized') return '#6B7280';
    const folder = folders.find(f => f.id === selectedFolder);
    return folder ? folder.color : '#6B7280';
  };

  const folderOptions = [
    { id: 'all', name: 'All Cards', count: flashcards.length, color: '#6B7280' },
    { id: 'uncategorized', name: 'Uncategorized', count: uncategorizedCount, color: '#6B7280' },
    ...folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      count: flashcards.filter(card => card.folderId === folder.id).length,
      color: folder.color,
    }))
  ];

  const handleEdit = (card: Flashcard) => {
    setEditingId(card.id);
    setEditForm({
      front: card.front,
      back: card.back,
      category: card.category,
      difficulty: card.difficulty,
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEdit(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ front: '', back: '', category: '', difficulty: 'medium' });
  };

  const getAccuracy = (card: Flashcard) => {
    const total = card.correctCount + card.incorrectCount;
    return total > 0 ? Math.round((card.correctCount / total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Flashcard Library</h2>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-sm" style={{ color: '#6B7280' }}>{filteredCards.length} cards</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className="px-3 py-1 rounded-full text-sm font-medium transition-colors border"
              style={selectedCategory === category.value
                ? { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderColor: '#3B82F6' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280', borderColor: '#D1D5DB' }
              }
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: '#1F2937' }}>No flashcards yet</h3>
          <p style={{ color: '#6B7280' }}>Create your first flashcard to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              {editingId === card.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Front</label>
                      <textarea
                        value={editForm.front}
                        onChange={(e) => setEditForm({ ...editForm, front: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Back</label>
                      <textarea
                        value={editForm.back}
                        onChange={(e) => setEditForm({ ...editForm, back: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editForm.difficulty}
                      onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#3B82F6' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#6B7280', color: '#FFFFFF' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {card.isLatex ? (
                        <FunctionSquare className="w-4 h-4" style={{ color: '#F43F5E' }} />
                      ) : (
                        <Type className="w-4 h-4" style={{ color: '#6B7280' }} />
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium" 
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        {categories.find(c => c.value === card.category)?.label || card.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                            style={
                              card.difficulty === 'easy' 
                                ? { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }
                                : card.difficulty === 'medium' 
                                ? { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }
                                : { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E' }
                            }>
                        {card.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-1 hover:opacity-80 transition-opacity"
                        style={{ color: '#6B7280' }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(card.id)}
                        className="p-1 hover:opacity-80 transition-opacity"
                        style={{ color: '#F43F5E' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Front:</div>
                      <div className="p-3 rounded-md min-h-[60px] flex items-center" style={{ backgroundColor: '#F9FAFB', color: '#1F2937' }}>
                        <LaTeXContent content={card.front} isLatex={card.isLatex} />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Back:</div>
                      <div className="p-3 rounded-md min-h-[60px] flex items-center" style={{ backgroundColor: '#F9FAFB', color: '#1F2937' }}>
                        <LaTeXContent content={card.back} isLatex={card.isLatex} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm" style={{ color: '#6B7280' }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {card.createdAt.toLocaleDateString()}</span>
                      </div>
                      {card.lastStudied && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Last studied: {card.lastStudied.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <ChartBarIcon className="w-4 h-4" />
                      <span>Accuracy: {getAccuracy(card)}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};