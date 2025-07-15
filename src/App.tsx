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
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200 w-full">
      {/* Centralized FlashVibe Title */}
      <div className="w-full px-4 py-6 text-center border-b border-gray-100">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="inline-flex items-center gap-3 hover:opacity-80 transition-all duration-300 focus-ring rounded-lg p-2 relative"
          aria-label="Go to dashboard"
        >
          <SparklesIcon 
            className="w-8 h-8 md:w-8 md:h-8 sm:fixed sm:inset-0 sm:w-screen sm:h-screen sm:z-0 sm:opacity-10 sm:pointer-events-none animate-pulse-glow" 
            style={{ color: '#3B82F6' }}
          />
          <div className="text-center relative z-10">
            <h1 className="text-3xl sm:text-5xl font-bold logo-underline relative" style={{ color: '#3B82F6' }}>
              FlashVibe
            </h1>
            <p className="text-sm sm:text-lg -mt-1" style={{ color: '#1F2937' }}>Learn Fast, Vibe Smart</p>
          </div>
        </button>
      </div>
      
      {/* Navigation */}
      <div className="w-full px-4 py-3 sm:max-w-7xl sm:mx-auto sm:px-6">
        <nav className="flex items-center justify-center gap-1 sm:gap-2">
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
                currentView === id ? 'active' : ''
              }`}
              aria-label={`Navigate to ${label}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );

  const renderDashboard = () => (
    <div className="animate-fade-in space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="p-6 rounded-2xl shadow-lg animate-bounce-in" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
            <SparklesIcon className="w-16 h-16 text-white" />
          </div>
        </div>
        <h2 className="text-5xl font-bold mb-4 text-shadow-sm" style={{ color: '#1F2937' }}>
          Master Your Learning Journey
        </h2>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
          Create, study, and master flashcards with our modern, intuitive platform designed for effective learning.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <BookOpenIcon className="w-8 h-8" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.totalCards}</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Total Cards</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <PlayIcon className="w-8 h-8" style={{ color: '#10B981' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.studiedToday}</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Studied Today</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
              <ChartBarIcon className="w-8 h-8" style={{ color: '#F43F5E' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Accuracy</div>
            </div>
          </div>
        </div>

        <div className="stat-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <SparklesIcon className="w-8 h-8" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{Object.keys(stats.categoryBreakdown).length}</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        <button
          onClick={() => setCurrentView('create')}
          className="card-hover rounded-xl p-8 text-left focus-ring"
          aria-label="Create new flashcards"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
              <PlusIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>Create Cards</h3>
              <p style={{ color: '#6B7280' }}>Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="card-hover rounded-xl p-8 text-left focus-ring"
          aria-label="Browse flashcard library"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>Browse Library</h3>
              <p style={{ color: '#6B7280' }}>View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="card-hover rounded-xl p-8 text-left focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          aria-label="Start studying flashcards"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' }}>
              <PlayIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>Start Studying</h3>
              <p style={{ color: '#6B7280' }}>Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 animate-slide-in">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 rounded-lg transition-all duration-300" style={{ background: 'linear-gradient(to right, #F3F4F6, rgba(59, 130, 246, 0.05))' }}>
                <span className="font-semibold capitalize" style={{ color: '#1F2937' }}>{category}</span>
                <span className="font-medium bg-white px-3 py-1 rounded-full text-sm" style={{ color: '#6B7280' }}>{count} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50">
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