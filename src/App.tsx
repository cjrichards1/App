import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FlashcardForm } from './components/FlashcardForm';
import { StudyMode } from './components/StudyMode';
import { FolderView } from './components/FolderView';
import { useFlashcards } from './hooks/useFlashcards';
import { ColorSystemDemo } from './components/ColorSystemDemo';

type View = 'dashboard' | 'create' | 'study' | 'folder' | 'demo';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  
  const {
    flashcards,
    folders,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    addFolder,
    updateFolder,
    deleteFolder,
    categories
  } = useFlashcards();

  const handleNavigateToFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setCurrentView('folder');
  };

  const handleBackToHome = () => {
    setCurrentView('dashboard');
    setSelectedFolderId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            flashcards={flashcards}
            folders={folders}
            onNavigateToFolder={handleNavigateToFolder}
            onCreateCard={() => setCurrentView('create')}
            onStudy={() => setCurrentView('study')}
          />
        );
      case 'create':
        return (
          <FlashcardForm
            folders={folders}
            categories={categories}
            onBack={handleBackToHome}
            onAdd={(flashcard) => {
              addFlashcard(flashcard);
              handleBackToHome();
            }}
          />
        );
      case 'study':
        return (
          <StudyMode
            flashcards={flashcards}
            onBack={handleBackToHome}
            onUpdateFlashcard={updateFlashcard}
          />
        );
      case 'folder':
        const selectedFolder = folders.find(f => f.id === selectedFolderId);
        const folderFlashcards = flashcards.filter(f => f.folderId === selectedFolderId);
        return (
          <FolderView
            folder={selectedFolder}
            flashcards={folderFlashcards}
            onBack={handleBackToHome}
            onUpdateFlashcard={updateFlashcard}
            onDeleteFlashcard={deleteFlashcard}
          />
        );
      case 'demo':
        return <ColorSystemDemo />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header
        currentView={currentView}
        folders={folders}
        onNavigate={setCurrentView}
        onNavigateToFolder={handleNavigateToFolder}
        onAddFolder={addFolder}
        onUpdateFolder={updateFolder}
        onDeleteFolder={deleteFolder}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;