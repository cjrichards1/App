import React, { useState } from 'react';
import { Trash2, Edit3, BookOpen, Calendar, Target, FunctionSquare, Type } from 'lucide-react';
import { Flashcard } from '../types/flashcard';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Flashcard>) => void;
}

const categories = [
  { value: 'all', label: 'All Categories', color: 'bg-gray-100 text-gray-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
  { value: 'language', label: 'Language', color: 'bg-blue-100 text-blue-800' },
  { value: 'science', label: 'Science', color: 'bg-green-100 text-green-800' },
  { value: 'math', label: 'Mathematics', color: 'bg-purple-100 text-purple-800' },
  { value: 'history', label: 'History', color: 'bg-yellow-100 text-yellow-800' },
];

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

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

export const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards, onDelete, onEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ front: '', back: '', category: '', difficulty: 'medium' as const });

  const filteredCards = flashcards.filter(card => 
    selectedCategory === 'all' || card.category === selectedCategory
  );

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
        <h2 className="text-xl font-semibold text-gray-900">Flashcard Library</h2>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">{filteredCards.length} cards</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
          <p className="text-gray-600">Create your first flashcard to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {editingId === card.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Front</label>
                      <textarea
                        value={editForm.front}
                        onChange={(e) => setEditForm({ ...editForm, front: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Back</label>
                      <textarea
                        value={editForm.back}
                        onChange={(e) => setEditForm({ ...editForm, back: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
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
                        <FunctionSquare className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Type className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        categories.find(c => c.value === card.category)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {categories.find(c => c.value === card.category)?.label || card.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[card.difficulty]}`}>
                        {card.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(card.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Front:</div>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
                        <LaTeXContent content={card.front} isLatex={card.isLatex} />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Back:</div>
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
                        <LaTeXContent content={card.back} isLatex={card.isLatex} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
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
                      <Target className="w-4 h-4" />
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