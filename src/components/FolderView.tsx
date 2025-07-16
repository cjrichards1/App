import React, { useState } from 'react';
import { 
  FolderIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CommandLineIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';
import { Flashcard, Folder } from '../types/flashcard';
import 'katex/dist/katex.min.css';

interface FolderViewProps {
  folder: Folder;
  flashcards: Flashcard[];
  onDeleteCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<Flashcard>) => void;
  onMoveCard: (cardId: string, folderId?: string) => void;
  folders: Folder[];
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

export const FolderView: React.FC<FolderViewProps> = ({
  folder,
  flashcards,
  onDeleteCard,
  onUpdateCard,
  onMoveCard,
  folders,
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    front: '',
    back: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const folderCards = flashcards.filter(card => card.folderId === folder.id);

  const startEditing = (card: Flashcard) => {
    setEditingCard(card.id);
    setEditForm({
      front: card.front,
      back: card.back,
      category: card.category,
      difficulty: card.difficulty,
    });
  };

  const saveEdit = () => {
    if (editingCard) {
      onUpdateCard(editingCard, editForm);
      setEditingCard(null);
    }
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setEditForm({
      front: '',
      back: '',
      category: '',
      difficulty: 'medium',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: folder.color }}
            >
              <FolderIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
              <p className="text-gray-600">
                {folderCards.length} {folderCards.length === 1 ? 'card' : 'cards'}
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {folderCards.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards in this folder</h3>
            <p className="text-gray-500 mb-6">Create some flashcards and assign them to this folder.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {folderCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {editingCard === card.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Front
                        </label>
                        <textarea
                          value={editForm.front}
                          onChange={(e) => setEditForm({ ...editForm, front: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Back
                        </label>
                        <textarea
                          value={editForm.back}
                          onChange={(e) => setEditForm({ ...editForm, back: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty
                          </label>
                          <select
                            value={editForm.difficulty}
                            onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {card.isLatex ? (
                            <CommandLineIcon className="w-4 h-4 text-pink-500" />
                          ) : (
                            <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                            {card.difficulty}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            title="View full card"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEditing(card)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            title="Edit card"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this flashcard?')) {
                                onDeleteCard(card.id);
                              }
                            }}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                            title="Delete card"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Front</h4>
                          <div className="text-gray-900 line-clamp-3">
                            <LaTeXContent 
                              content={card.front}
                              isLatex={card.isLatex}
                            />
                          </div>
                        </div>

                        {expandedCard === card.id && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Back</h4>
                            <div className="text-gray-900">
                              <LaTeXContent 
                                content={card.back}
                                isLatex={card.isLatex}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{card.category}</span>
                        <div className="flex items-center gap-4">
                          <span>✓ {card.correctCount}</span>
                          <span>✗ {card.incorrectCount}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};