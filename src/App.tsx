import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FlashcardForm } from './components/FlashcardForm';
import { FolderView } from './components/FolderView';
import { StudyMode } from './components/StudyMode';
import { useFlashcards } from './hooks/useFlashcards';
import './index.css';

type ViewType = 'home' | 'create' | 'study' | 'folder';

function App() {
  const {
    flashcards,
    folders,
    categories,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addFolder,
    updateFolder,
    deleteFolder,
    moveCardToFolder,
    markAnswer,
    saveStudySession,
    getStats,
  } = useFlashcards();

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  const handleViewChange = (view: string, folderId?: string) => {
    setCurrentView(view as ViewType);
    setSelectedFolderId(folderId);
  };

  const handleBackToDashboard = () => {
    setCurrentView('home');
    setSelectedFolderId(undefined);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Dashboard
            stats={getStats()}
            folders={folders}
            onViewChange={handleViewChange}
          />
        );
      case 'create':
        return (
          <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
            <FlashcardForm
              folders={folders}
              categories={categories}
              onAdd={addFlashcard}
            />
          </div>
        );
      case 'study':
        return (
          <StudyMode
            flashcards={flashcards}
            onBack={handleBackToDashboard}
            onMarkAnswer={markAnswer}
            onSaveSession={saveStudySession}
          />
        );
      case 'folder':
        const folder = folders.find(f => f.id === selectedFolderId);
        if (!folder) {
          return (
            <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Folder not found</h2>
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          );
        }
        return (
          <FolderView
            folder={folder}
            flashcards={flashcards}
            onDeleteCard={deleteFlashcard}
            onUpdateCard={updateFlashcard}
            onMoveCard={moveCardToFolder}
            folders={folders}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        folders={folders}
        currentView={currentView}
        selectedFolderId={selectedFolderId}
        onViewChange={handleViewChange}
        onAddFolder={addFolder}
        onUpdateFolder={updateFolder}
        onDeleteFolder={deleteFolder}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;