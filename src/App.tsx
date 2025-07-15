import React, { useState } from 'react';
import { SparklesIcon, PlusIcon, BookOpenIcon, AcademicCapIcon, FolderIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { FlashcardForm } from './components/FlashcardForm';
import { FlashcardList } from './components/FlashcardList';
import { StudyMode } from './components/StudyMode';
import { useFlashcards } from './hooks/useFlashcards';
import type { Flashcard, Folder } from './types/flashcard';

type View = 'home' | 'create' | 'library' | 'study';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  
  const { 
    flashcards, 
    folders,
    addFlashcard, 
    deleteFlashcard, 
    updateFlashcard,
    addFolder,
    deleteFolder,
    moveCardToFolder
  } = useFlashcards();

  const categories = [
    'Mathematics',
    'Science',
    'History',
    'Language',
    'Programming',
    'Art',
    'Music',
    'Geography',
    'Literature',
    'Philosophy'
  ];

  const folderColors = [
    '#3B82F6', // Electric Blue
    '#F43F5E', // Vibrant Coral
    '#10B981', // Lime Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
  ];

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({
        id: Date.now().toString(),
        name: newFolderName.trim(),
        color: newFolderColor,
        createdAt: new Date()
      });
      setNewFolderName('');
      setNewFolderColor('#3B82F6');
      setShowFolderForm(false);
    }
  };

  const filteredCards = flashcards.filter(card => {
    const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
    const folderMatch = selectedFolder === 'all' || 
                       (selectedFolder === 'uncategorized' && !card.folderId) ||
                       card.folderId === selectedFolder;
    return categoryMatch && folderMatch;
  });

  const renderNavigation = () => (
    <nav className="flex justify-center items-center gap-1 sm:gap-2 py-3 border-t border-white/20">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
          currentView === 'home'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <SparklesIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Home</span>
      </button>
      
      <button
        onClick={() => setCurrentView('create')}
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
          currentView === 'create'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <PlusIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Create</span>
      </button>
      
      <button
        onClick={() => setCurrentView('library')}
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
          currentView === 'library'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <BookOpenIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Library</span>
      </button>
      
      <button
        onClick={() => setCurrentView('study')}
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
          currentView === 'study'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <AcademicCapIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Study</span>
      </button>
    </nav>
  );

  const renderHome = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Master Your Learning with FlashVibe
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create, organize, and study flashcards with our intuitive platform. 
          Track your progress and boost your retention with spaced repetition.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div 
          onClick={() => setCurrentView('create')}
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="bg-white/20 rounded-lg p-3 w-fit mb-4">
            <PlusIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Create Cards</h3>
          <p className="text-white/80">
            Build your flashcard collection with our easy-to-use creator
          </p>
        </div>

        <div 
          onClick={() => setCurrentView('library')}
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="bg-white/20 rounded-lg p-3 w-fit mb-4">
            <BookOpenIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Library</h3>
          <p className="text-white/80">
            Organize and manage your flashcard collections
          </p>
        </div>

        <div 
          onClick={() => setCurrentView('study')}
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="bg-white/20 rounded-lg p-3 w-fit mb-4">
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Study Mode</h3>
          <p className="text-white/80">
            Practice with your cards and track your progress
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl p-6 shadow-lg border border-gradient-to-r from-blue-200 to-rose-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{flashcards.length}</div>
            <div className="text-sm text-slate-600">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-500">{folders.length}</div>
            <div className="text-sm text-slate-600">Folders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">{categories.length}</div>
            <div className="text-sm text-slate-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {flashcards.filter(card => card.difficulty === 'hard').length}
            </div>
            <div className="text-sm text-slate-600">Hard Cards</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Your Library</h2>
        <button
          onClick={() => setShowFolderForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <FolderPlusIcon className="w-5 h-5" />
          New Folder
        </button>
      </div>

      {showFolderForm && (
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-gradient-to-r from-blue-200 to-rose-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Folder</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              {folderColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewFolderColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newFolderColor === color ? 'border-slate-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateFolder}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Create
              </button>
              <button
                onClick={() => setShowFolderForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedFolder('all')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            selectedFolder === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          All Cards ({flashcards.length})
        </button>
        
        <button
          onClick={() => setSelectedFolder('uncategorized')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            selectedFolder === 'uncategorized'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          Uncategorized ({flashcards.filter(card => !card.folderId).length})
        </button>

        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              selectedFolder === folder.id
                ? 'text-white'
                : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
            }`}
            style={{
              backgroundColor: selectedFolder === folder.id ? folder.color : undefined
            }}
          >
            <FolderIcon className="w-4 h-4" style={{ color: selectedFolder === folder.id ? 'white' : folder.color }} />
            {folder.name} ({flashcards.filter(card => card.folderId === folder.id).length})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <FlashcardList
        flashcards={filteredCards}
        folders={folders}
        onDelete={deleteFlashcard}
        onUpdate={updateFlashcard}
        onDeleteFolder={deleteFolder}
        onMoveCard={moveCardToFolder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 relative">
      <SparklesIcon className="fixed inset-0 w-screen h-screen text-blue-500 opacity-10 pointer-events-none z-0" />
      
      <div className="relative z-10">
        <header className="w-full sm:max-w-7xl sm:mx-auto px-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="text-center py-6 border-b border-white/20">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
              Flash<span className="underline decoration-white/50">Vibe</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-lg">Smart Learning, Simplified</p>
          </div>
          
          {renderNavigation()}
        </header>

        <main>
          {currentView === 'home' && renderHome()}
          {currentView === 'create' && (
            <div className="max-w-2xl mx-auto px-4 py-8">
              <FlashcardForm 
                onSubmit={addFlashcard} 
                categories={categories}
                folders={folders}
              />
            </div>
          )}
          {currentView === 'library' && renderLibrary()}
          {currentView === 'study' && (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <StudyMode flashcards={filteredCards} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;