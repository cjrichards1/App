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
          <h1 className="text-4xl font-bold text-gray-900">FlashVibe</h1>
        </div>
        <p className="text-xl text-gray-600">Learn Fast, Vibe Smart</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>{stats.totalCards}</div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Total Cards</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#d1fae5' }}>
              <Play className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>{stats.studiedToday}</div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Studied Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#fbcfe8' }}>
              <BarChart3 className="w-6 h-6" style={{ color: '#F43F5E' }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Accuracy</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <Brain className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>{Object.keys(stats.categoryBreakdown).length}</div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Categories</div>
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
            <div className="p-3 rounded-lg transition-colors" style={{ backgroundColor: '#dbeafe' }}>
              <Plus className="w-8 h-8" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Create Cards</h3>
              <p style={{ color: '#6B7280' }}>Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg transition-colors" style={{ backgroundColor: '#d1fae5' }}>
              <BookOpen className="w-8 h-8" style={{ color: '#10B981' }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Browse Library</h3>
              <p style={{ color: '#6B7280' }}>View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg transition-colors" style={{ backgroundColor: '#fbcfe8' }}>
              <Play className="w-8 h-8" style={{ color: '#F43F5E' }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#1F2937' }}>Start Studying</h3>
              <p style={{ color: '#6B7280' }}>Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize" style={{ color: '#1F2937' }}>{category}</span>
                <span style={{ color: '#6B7280' }}>{count} cards</span>
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
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: '#3B82F6' }}
          >
            <Brain className="w-6 h-6" />
            <span className="font-semibold">FlashVibe</span>
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
                    ? 'text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={currentView === id ? { backgroundColor: '#3B82F6' } : { color: '#1F2937' }}
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
    <div className="min-h-screen bg-gray-100" style={{ backgroundColor: '#F3F4F6' }}>
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