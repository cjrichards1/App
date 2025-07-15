import React, { useState } from 'react';
import { SparklesIcon, BookOpenIcon, PlayIcon, ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useFlashcards } from './hooks/useFlashcards';
import { FlashcardForm } from './components/FlashcardForm';
import { FlashcardList } from './components/FlashcardList';
import { StudyMode } from './components/StudyMode';

type View = 'dashboard' | 'create' | 'library' | 'study';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [successMessage, setSuccessMessage] = useState('');
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, markAnswer, saveStudySession, getStats } = useFlashcards();
  
  const stats = getStats();

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddFlashcard = (flashcard: any) => {
    addFlashcard(flashcard);
    showSuccessMessage('Flashcard created successfully!');
  };

  const renderHeader = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 focus-ring rounded-lg p-2"
            aria-label="Go to dashboard"
          >
            <SparklesIcon className="w-8 h-8 text-blue-600 animate-pulse-glow" />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-blue-600 logo-underline relative">
                FlashVibe
              </h1>
              <p className="text-lg text-gray-600 -mt-1">Learn Fast, Vibe Smart</p>
            </div>
          </button>
          
          <nav className="flex items-center gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
              { id: 'create', label: 'Create', icon: PlusIcon },
              { id: 'library', label: 'Library', icon: BookOpenIcon },
              { id: 'study', label: 'Study', icon: PlayIcon },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as View)}
                disabled={id === 'study' && flashcards.length === 0}
                className={`nav-button flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-ring ${
                  currentView === id
                    ? 'active'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-label={`Navigate to ${label}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg animate-bounce-in">
            <SparklesIcon className="w-16 h-16 text-white" />
          </div>
        </div>
        <h2 className="text-5xl font-bold text-slate-800 mb-4 text-shadow-sm">
          Master Your Learning Journey
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create, study, and master flashcards with our modern, intuitive platform designed for effective learning.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.totalCards}</div>
              <div className="text-sm font-medium text-gray-600">Total Cards</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50">
              <PlayIcon className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.studiedToday}</div>
              <div className="text-sm font-medium text-gray-600">Studied Today</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50">
              <ChartBarIcon className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm font-medium text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800">{Object.keys(stats.categoryBreakdown).length}</div>
              <div className="text-sm font-medium text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        <button
          onClick={() => setCurrentView('create')}
          className="card-hover bg-white rounded-xl p-8 text-left border border-blue-100 focus-ring"
          aria-label="Create new flashcards"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <PlusIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Create Cards</h3>
              <p className="text-gray-600">Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="card-hover bg-white rounded-xl p-8 text-left border border-blue-100 focus-ring"
          aria-label="Browse flashcard library"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Browse Library</h3>
              <p className="text-gray-600">View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="card-hover bg-white rounded-xl p-8 text-left border border-blue-100 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          aria-label="Start studying flashcards"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
              <PlayIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Start Studying</h3>
              <p className="text-gray-600">Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl p-8 border border-blue-100 animate-slide-in">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                <span className="font-semibold capitalize text-slate-800">{category}</span>
                <span className="font-medium text-gray-600 bg-white px-3 py-1 rounded-full text-sm">{count} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="wave-pattern min-h-screen">
      {currentView !== 'study' && renderHeader()}
      
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className="px-6 py-3 rounded-lg shadow-lg success-feedback border-2">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              {successMessage}
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'create' && <FlashcardForm onAdd={handleAddFlashcard} />}
        {currentView === 'library' && (
          <FlashcardList
            flashcards={flashcards}
            onDelete={deleteFlashcard}
            onEdit={updateFlashcard}
          />
        )}
        {currentView === 'study' && (
          <StudyMode
            flashcards={flashcards}
            onBack={() => setCurrentView('dashboard')}
            onMarkAnswer={markAnswer}
            onSaveSession={saveStudySession}
          />
        )}
      </main>
      </div>
    </div>
  );
}

export default App;