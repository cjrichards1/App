import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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

// Memoized empty state component
const EmptyState = React.memo(() => (
  <div className="text-center py-12">
    <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No cards in this folder</h3>
    <p className="text-gray-500 mb-6">Create some flashcards and assign them to this folder.</p>
  </div>
));

// Memoized card component
const FlashCard = React.memo(({ 
  card,
  onDelete,
  onEdit,
  onExpand,
  isExpanded
}: { 
  card: Flashcard;
  onDelete: () => void;
  onEdit: () => void;
  onExpand: () => void;
  isExpanded: boolean;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {card.isLatex ? (
          <div className="p-2 rounded-lg bg-gradient-to-br from-flashvibe-coral to-rose-600 shadow-sm">
            <CommandLineIcon className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-gradient-to-br from-flashvibe-gray to-gray-200 shadow-sm">
            <DocumentTextIcon className="w-4 h-4 text-gray-600" />
          </div>
        )}
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          card.difficulty === 'easy' 
            ? 'bg-green-100 text-green-800'
            : card.difficulty === 'medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {card.difficulty}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600"
          title="Edit card"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onExpand}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-purple-600"
          title="View details"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
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
          {card.isLatex ? <InlineMath math={card.front} /> : card.front}
        </div>
      </div>

      {isExpanded && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Back</h4>
          <div className="text-gray-900">
            {card.isLatex ? <InlineMath math={card.back} /> : card.back}
          </div>
        </div>
      )}
    </div>
  </div>
));

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
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize filtered cards
  const folderCards = useMemo(() => 
    flashcards.filter(card => card.folderId === folder.id),
    [flashcards, folder.id]
  );

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(prev.end + 10, folderCards.length)
        }));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [folderCards.length]);

  const startEditing = useCallback((card: Flashcard) => {
    setEditingCard(card.id);
    setEditForm({
      front: card.front,
      back: card.back,
      category: card.category,
      difficulty: card.difficulty,
    });
  }, []);

  const saveEdit = useCallback(() => {
    if (editingCard) {
      onUpdateCard(editingCard, editForm);
      setEditingCard(null);
    }
  }, [editingCard, editForm, onUpdateCard]);

  const cancelEdit = useCallback(() => {
    setEditingCard(null);
    setEditForm({
      front: '',
      back: '',
      category: '',
      difficulty: 'medium',
    });
  }, []);

  const handleDelete = useCallback((cardId: string) => {
    if (confirm('Delete this flashcard?')) {
      onDeleteCard(cardId);
    }
  }, [onDeleteCard]);

  const toggleExpand = useCallback((cardId: string) => {
    setExpandedCard(prev => prev === cardId ? null : cardId);
  }, []);

  // Memoize visible cards
  const visibleCards = useMemo(() => 
    folderCards.slice(visibleRange.start, visibleRange.end),
    [folderCards, visibleRange]
  );

  if (folderCards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-8"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
        {visibleCards.map(card => (
          <div key={card.id}>
            {editingCard === card.id ? (
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
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
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <FlashCard
                card={card}
                onDelete={() => handleDelete(card.id)}
                onEdit={() => startEditing(card)}
                onExpand={() => toggleExpand(card.id)}
                isExpanded={expandedCard === card.id}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};