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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900">FlashCard Master</h1>
        </div>
        <p className="text-xl text-gray-600">Master any subject with intelligent flashcards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCards}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.studiedToday}</div>
              <div className="text-sm text-gray-600">Studied Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Brain className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{Object.keys(stats.categoryBreakdown).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentView('create')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Create Cards</h3>
              <p className="text-gray-600">Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Browse Library</h3>
              <p className="text-gray-600">View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Play className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Start Studying</h3>
              <p className="text-gray-600">Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">{category}</span>
                <span className="text-gray-600">{count} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Brain className="w-6 h-6" />
            <span className="font-semibold">FlashCard Master</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentView === id
                    ? 'bg-indigo-100 text-indigo-700'
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
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'study' && renderNavigation()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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