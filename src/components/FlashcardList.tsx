import React, { useState } from 'react';
import { Trash2, Edit3, BookOpen, Calendar, ChartBarIcon, FunctionSquare, Type, FolderPlus, Folder, FolderOpen, Plus, X } from 'lucide-react';
import { Flashcard, Folder as FolderType } from '../types/flashcard';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FlashcardListProps {
  flashcards: Flashcard[];
  folders: FolderType[];
  categories: string[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Flashcard>) => void;
  onAddFolder: (name: string, color: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveCard: (cardId: string, folderId?: string) => void;
  onDeleteCategory: (category: string) => void;
}


const folderColors = [
  { value: '#3B82F6', label: 'Electric Blue' },
  { value: '#F43F5E', label: 'Vibrant Coral' },
  { value: '#10B981', label: 'Lime Green' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#6B7280', label: 'Gray' },
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

export const FlashcardList: React.FC<FlashcardListProps> = ({ 
  flashcards, 
  folders, 
  categories,
  onDelete, 
  onEdit, 
  onAddFolder, 
  onDeleteFolder, 
  onMoveCard,
  onDeleteCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ front: '', back: '', category: '', difficulty: 'medium' as const });
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [movingCardId, setMovingCardId] = useState<string | null>(null);

  const filteredCards = flashcards.filter(card => {
    const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
    const folderMatch = selectedFolder === null || 
                       (selectedFolder === 'uncategorized' && !card.folderId) ||
                       card.folderId === selectedFolder;
    return categoryMatch && folderMatch;
  });

  const uncategorizedCards = flashcards.filter(card => !card.folderId);

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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor('#3B82F6');
      setShowFolderForm(false);
    }
  };

  const handleMoveCard = (cardId: string, folderId?: string) => {
    onMoveCard(cardId, folderId);
    setMovingCardId(null);
  };

  const getAccuracy = (card: Flashcard) => {
    const total = card.correctCount + card.incorrectCount;
    return total > 0 ? Math.round((card.correctCount / total) * 100) : 0;
  };

  const getFolderCardCount = (folderId: string) => {
    return flashcards.filter(card => card.folderId === folderId).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Flashcard Library</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFolderForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-white"
            style={{ backgroundColor: '#3B82F6' }}
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">{filteredCards.length} cards</span>
          </div>
        </div>
      </div>

      {/* Folder Creation Form */}
      {showFolderForm && (
        <div className="mb-6 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Create New Folder</h3>
            <button
              onClick={() => setShowFolderForm(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Color</label>
              <select
                value={newFolderColor}
                onChange={(e) => setNewFolderColor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {folderColors.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#3B82F6' }}
            >
              Create Folder
            </button>
            <button
              onClick={() => setShowFolderForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folder Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedFolder === null
                ? 'bg-blue-100 text-blue-600 border-blue-600'
                : 'bg-gray-100 text-gray-600 border-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            All Cards ({flashcards.length})
          </button>
          
          <button
            onClick={() => setSelectedFolder('uncategorized')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              selectedFolder === 'uncategorized'
                ? 'bg-blue-100 text-blue-600 border-blue-600'
                : 'bg-gray-100 text-gray-600 border-gray-300'
            }`}
          >
            <Folder className="w-4 h-4" />
            Uncategorized ({uncategorizedCards.length})
          </button>

          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedFolder === folder.id
                    ? 'bg-blue-100 text-blue-600 border-blue-600'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
                {folder.name} ({getFolderCardCount(folder.id)})
              </button>
              <button
                onClick={() => onDeleteFolder(folder.id)}
                className="p-1 hover:bg-red-100 rounded text-red-500"
                title="Delete folder"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
             key={category}
             onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
               selectedCategory === category
                  ? 'bg-blue-100 text-blue-600 border-blue-600'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
            >
             {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2 text-slate-900">No flashcards found</h3>
          <p className="text-gray-500">
            {selectedFolder ? 'This folder is empty.' : 'Create your first flashcard to get started!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              {editingId === card.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-900">Front</label>
                      <textarea
                        value={editForm.front}
                        onChange={(e) => setEditForm({ ...editForm, front: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-900">Back</label>
                      <textarea
                        value={editForm.back}
                        onChange={(e) => setEditForm({ ...editForm, back: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editForm.difficulty}
                      onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90 transition-opacity"
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
                        <Type className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {card.category.charAt(0).toUpperCase() + card.category.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.difficulty === 'easy' 
                          ? 'bg-green-100 text-green-600'
                          : card.difficulty === 'medium' 
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {card.difficulty}
                      </span>
                      {card.folderId && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          📁 {folders.find(f => f.id === card.folderId)?.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          onClick={() => setMovingCardId(movingCardId === card.id ? null : card.id)}
                          className="p-1 hover:opacity-80 transition-opacity text-blue-600"
                          title="Move to folder"
                        >
                          <Folder className="w-4 h-4" />
                        </button>
                        {movingCardId === card.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-48">
                            <button
                              onClick={() => handleMoveCard(card.id, undefined)}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              📂 Uncategorized
                            </button>
                            {folders.map((folder) => (
                              <button
                                key={folder.id}
                                onClick={() => handleMoveCard(card.id, folder.id)}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                              >
                                <span style={{ color: folder.color }}>📁</span> {folder.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-1 hover:opacity-80 transition-opacity text-gray-500"
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
                      <div className="text-sm font-medium mb-1 text-slate-900">Front:</div>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[60px] flex items-center text-slate-900">
                        <LaTeXContent content={card.front} isLatex={card.isLatex} />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1 text-slate-900">Back:</div>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[60px] flex items-center text-slate-900">
                        <LaTeXContent content={card.back} isLatex={card.isLatex} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
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