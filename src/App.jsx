import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  Bars3Icon, 
  XMarkIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';

const STORAGE_KEY = 'flashvibe-cards';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isLatexMode, setIsLatexMode] = useState(false);

  // Load flashcards from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFlashcards(JSON.parse(stored));
    }
  }, []);

  // Save flashcards to localStorage whenever flashcards change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
  }, [flashcards]);

  const createFlashcard = () => {
    if (!frontText.trim() || !backText.trim()) return;

    const newCard = {
      id: Date.now(),
      front: frontText.trim(),
      back: backText.trim(),
      isLatex: isLatexMode,
      createdAt: new Date().toISOString()
    };

    setFlashcards(prev => [...prev, newCard]);
    setFrontText('');
    setBackText('');
    
    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const deleteFlashcard = (id) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
    if (studyMode && flashcards.length <= 1) {
      setStudyMode(false);
    } else if (studyMode && currentCardIndex >= flashcards.length - 1) {
      setCurrentCardIndex(0);
    }
  };

  const startStudyMode = () => {
    if (flashcards.length === 0) return;
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const LaTeXRenderer = ({ content, isLatex, className = "" }) => {
    if (!isLatex) {
      return <div className={`whitespace-pre-wrap ${className}`}>{content}</div>;
    }

    try {
      return (
        <div className={className}>
          <BlockMath math={content} />
        </div>
      );
    } catch (error) {
      return <div className={`text-red-500 ${className}`}>Invalid LaTeX: {content}</div>;
    }
  };

  const LaTeXPreview = ({ content, isLatex }) => {
    if (!content || !isLatex) return null;

    try {
      return (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border">
          <div className="text-xs text-gray-500 mb-1">LaTeX Preview:</div>
          <BlockMath math={content} />
        </div>
      );
    } catch (error) {
      return (
        <div className="mt-2 p-3 bg-red-50 rounded-md border border-red-200">
          <div className="text-xs text-red-500">Invalid LaTeX syntax</div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-50 animate-fade-in">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md focus-ring"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 w-80 h-full bg-white shadow-md
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col custom-scrollbar overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <SparklesIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FlashVibe</h1>
              <p className="text-base text-gray-600">Learn Fast, Vibe Smart</p>
            </div>
          </div>

          {/* Create Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Flashcard</h2>
            
            {/* LaTeX Toggle */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="latex-mode"
                checked={isLatexMode}
                onChange={(e) => setIsLatexMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="latex-mode" className="text-sm text-gray-700">
                LaTeX Mode
              </label>
            </div>

            {/* Front Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front (Question)
              </label>
              <textarea
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder={isLatexMode ? "Enter LaTeX: \\frac{d}{dx}[x^2] = ?" : "Enter question (text or LaTeX)"}
                className="w-full p-3 border border-gray-300 rounded-md focus-ring resize-none font-mono"
                rows={3}
              />
              <LaTeXPreview content={frontText} isLatex={isLatexMode} />
            </div>

            {/* Back Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back (Answer)
              </label>
              <textarea
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder={isLatexMode ? "Enter LaTeX: 2x" : "Enter answer (text or LaTeX)"}
                className="w-full p-3 border border-gray-300 rounded-md focus-ring resize-none font-mono"
                rows={3}
              />
              <LaTeXPreview content={backText} isLatex={isLatexMode} />
            </div>

            {/* Create Button */}
            <button
              onClick={createFlashcard}
              disabled={!frontText.trim() || !backText.trim()}
              className={`
                w-full px-6 py-3 rounded-md text-white font-semibold
                btn-primary focus-ring disabled:opacity-50 disabled:cursor-not-allowed
                ${showSuccess ? 'animate-success' : ''}
              `}
              aria-label="Create flashcard"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Create Flashcard
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setSidebarOpen(false);
                setStudyMode(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus-ring"
            >
              <EyeIcon className="h-5 w-5 inline mr-2" />
              View All Cards
            </button>
            
            <button
              onClick={() => {
                startStudyMode();
                setSidebarOpen(false);
              }}
              disabled={flashcards.length === 0}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AcademicCapIcon className="h-5 w-5 inline mr-2" />
              Study Mode
            </button>
          </div>

          {/* Stats */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Cards:</span>
                <span className="font-semibold">{flashcards.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        {studyMode ? (
          /* Study Modal */
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setStudyMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus-ring"
              >
                <XMarkIcon className="h-5 w-5 inline mr-2" />
                Close Study
              </button>
              
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
            </div>

            {/* Study Card */}
            <div className="mb-8">
              <div 
                className={`flip-card w-full h-72 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
                onClick={flipCard}
              >
                <div className="flip-card-inner gradient-border shadow-lg">
                  <div className="flip-card-front">
                    <LaTeXRenderer
                      content={flashcards[currentCardIndex]?.front}
                      isLatex={flashcards[currentCardIndex]?.isLatex}
                      className="latex-content text-center"
                    />
                  </div>
                  <div className="flip-card-back">
                    <LaTeXRenderer
                      content={flashcards[currentCardIndex]?.back}
                      isLatex={flashcards[currentCardIndex]?.isLatex}
                      className="latex-content text-center"
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-center text-gray-600 mt-4">
                Click card to flip • Use arrow keys to navigate
              </p>
            </div>

            {/* Study Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={prevCard}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus-ring"
                aria-label="Previous card"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Delete this flashcard?')) {
                    deleteFlashcard(flashcards[currentCardIndex].id);
                  }
                }}
                className="px-6 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors focus-ring"
                aria-label="Delete card"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextCard}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus-ring"
                aria-label="Next card"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Card Grid */
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Flashcards</h2>
              <p className="text-gray-600">
                {flashcards.length === 0 
                  ? "No flashcards yet? Start your first FlashVibe set!" 
                  : `${flashcards.length} card${flashcards.length !== 1 ? 's' : ''} ready to study`
                }
              </p>
            </div>

            {flashcards.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-600 mb-6">No flashcards yet? Start your first FlashVibe set!</h3>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-6 py-3 btn-secondary text-white rounded-md font-semibold focus-ring"
                >
                  <PlusIcon className="h-5 w-5 inline mr-2" />
                  Create Your First Card
                </button>
              </div>
            ) : (
              /* Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id}
                    className="w-full h-36 bg-white rounded-xl shadow-md gradient-border card-hover animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                          #{index + 1}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('Delete this flashcard?')) {
                              deleteFlashcard(card.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors focus-ring rounded"
                          aria-label="Delete card"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <LaTeXRenderer
                          content={card.front}
                          isLatex={card.isLatex}
                          className="text-sm text-slate-800 font-mono line-clamp-3"
                        />
                      </div>
                      
                      {card.isLatex && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                            LaTeX
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard navigation for study mode */}
      {studyMode && (
        <div className="hidden">
          <input
            autoFocus
            onKeyDown={(e) => {
              if (e.code === 'Space') {
                e.preventDefault();
                flipCard();
              } else if (e.code === 'ArrowLeft') {
                prevCard();
              } else if (e.code === 'ArrowRight') {
                nextCard();
              } else if (e.code === 'Escape') {
                setStudyMode(false);
              }
            }}
            className="opacity-0 absolute -top-10"
          />
        </div>
      )}
    </div>
  );
}

export default App;