import React, { useState } from 'react';
import { Brain, BookOpen, Play, BarChart3, Plus } from 'lucide-react';
import { useFlashcards } from './hooks/useFlashcards';
import { FlashcardForm } from './components/FlashcardForm';
import { FlashcardList } from './components/FlashcardList';
import { StudyMode } from './components/StudyMode';

type View = 'dashboard' | 'create' | 'library' | 'study';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, markAnswer, saveStudySession, getStats } = useFlashcards();
  
  const stats = getStats();

  const renderDashboard = () => (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-colored-primary">
            <Brain className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-6xl font-black heading-primary bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            FlashVibe
          </h1>
        </div>
        <p className="text-2xl font-medium text-muted mb-4">Learn Fast, Vibe Smart</p>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-xl bg-blue-50">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalCards}</div>
              <div className="text-sm font-medium text-muted">Total Cards</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-xl bg-green-50">
              <Play className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.studiedToday}</div>
              <div className="text-sm font-medium text-muted">Studied Today</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-xl bg-pink-50">
              <BarChart3 className="w-7 h-7 text-pink-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm font-medium text-muted">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-5">
            <div className="p-3 rounded-xl bg-purple-50">
              <Brain className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{Object.keys(stats.categoryBreakdown).length}</div>
              <div className="text-sm font-medium text-muted">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentView('create')}
          className="card-quizlet p-8 text-left group transition-all duration-200 hover:shadow-medium"
        >
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 rounded-xl bg-blue-500 group-hover:bg-blue-600 transition-colors duration-200">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold heading-secondary mb-1">Create Cards</h3>
              <p className="text-muted">Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="card-quizlet p-8 text-left group transition-all duration-200 hover:shadow-medium"
        >
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 rounded-xl bg-green-500 group-hover:bg-green-600 transition-colors duration-200">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold heading-secondary mb-1">Browse Library</h3>
              <p className="text-muted">View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="card-quizlet p-8 text-left group transition-all duration-200 hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-soft disabled:hover:transform-none"
        >
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 rounded-xl bg-pink-500 group-hover:bg-pink-600 transition-colors duration-200">
              <Play className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold heading-secondary mb-1">Start Studying</h3>
              <p className="text-muted">Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="card-quizlet p-8">
          <h3 className="text-2xl font-bold heading-secondary mb-6">Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-semibold capitalize text-gray-900">{category}</span>
                <span className="font-medium text-muted">{count} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNavigation = () => (
    <nav className="nav-modern sticky top-0 z-50 mb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-blue-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              FlashVibe
            </span>
          </button>
          
          <div className="flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'create', label: 'Create', icon: Plus },
              { id: 'library', label: 'Library', icon: BookOpen },
              { id: 'study', label: 'Study', icon: Play },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as View)}
                disabled={id === 'study' && flashcards.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentView === id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen" style={{ background: '#FAFBFC' }}>
      {currentView !== 'study' && renderNavigation()}
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'create' && <FlashcardForm onAdd={addFlashcard} />}
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
      </div>
    </div>
  );
}

export default App;