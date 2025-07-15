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
    <div className="space-y-10 page-transition">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 rounded-2xl gradient-primary shadow-colored-primary pulse-glow">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient">FlashVibe</h1>
        </div>
        <p className="text-2xl font-light" style={{ color: '#6B7280' }}>Learn Fast, Vibe Smart</p>
        <div className="w-24 h-1 gradient-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-8">
        <div className="gradient-card rounded-2xl shadow-soft border-0 p-8 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl gradient-primary shadow-colored-primary">
              <BookOpen className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.totalCards}</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Total Cards</div>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-2xl shadow-soft border-0 p-8 card-hover-accent">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl gradient-accent shadow-colored-accent">
              <Play className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.studiedToday}</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Studied Today</div>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-2xl shadow-soft border-0 p-8 card-hover-secondary">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl gradient-secondary shadow-colored-secondary">
              <BarChart3 className="w-6 h-6" style={{ color: '#F43F5E' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>Accuracy</div>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-2xl shadow-soft border-0 p-8 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl gradient-primary shadow-colored-primary">
              <Brain className="w-6 h-6" style={{ color: '#3B82F6' }} />
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
          className="gradient-card rounded-2xl shadow-soft border-0 p-10 text-left group card-hover btn-scale"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl gradient-primary shadow-colored-primary group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>Create Cards</h3>
              <p className="text-lg" style={{ color: '#6B7280' }}>Add new flashcards with text or LaTeX</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('library')}
          className="gradient-card rounded-2xl shadow-soft border-0 p-10 text-left group card-hover-accent btn-scale"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl gradient-accent shadow-colored-accent group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>Browse Library</h3>
              <p className="text-lg" style={{ color: '#6B7280' }}>View and manage your flashcards</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('study')}
          disabled={flashcards.length === 0}
          className="gradient-card rounded-2xl shadow-soft border-0 p-10 text-left group card-hover-secondary btn-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl gradient-secondary shadow-colored-secondary group-hover:scale-110 transition-transform duration-300">
              <Play className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>Start Studying</h3>
              <p className="text-lg" style={{ color: '#6B7280' }}>Begin a study session</p>
            </div>
          </div>
        </button>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="gradient-card rounded-2xl shadow-soft border-0 p-8">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>Cards by Category</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 rounded-xl card-hover" style={{ backgroundColor: '#F8FAFC' }}>
                <span className="font-semibold capitalize text-lg" style={{ color: '#1F2937' }}>{category}</span>
                <span className="font-medium" style={{ color: '#6B7280' }}>{count} cards</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNavigation = () => (
    <nav className="glass backdrop-blur-md shadow-medium border-b-0 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 btn-scale"
            style={{ color: '#3B82F6' }}
          >
            <div className="p-2 rounded-xl gradient-primary shadow-colored-primary">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-xl text-gradient">FlashVibe</span>
          </button>
          
          <div className="flex items-center gap-2">
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
                    ? 'text-white shadow-colored-primary'
                    : 'hover:bg-white hover:bg-opacity-20'
                }`}
                style={currentView === id 
                  ? { background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' } 
                  : { color: '#1F2937' }
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen gradient-bg">
      {currentView !== 'study' && renderNavigation()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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