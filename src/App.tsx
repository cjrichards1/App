import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FlashcardForm } from './components/FlashcardForm';
import { StudyMode } from './components/StudyMode';
import { FolderView } from './components/FolderView';
import { Auth } from './components/Auth';
import { useFlashcards } from './hooks/useFlashcards';
import { Flashcard, Folder } from './types/flashcard';

type View = 'dashboard' | 'create' | 'study' | 'folder';

interface User {
  name?: string;
  email: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  
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

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
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
            onAdd={(flashcard: Flashcard) => {
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
        const selectedFolder = folders.find((f: Folder) => f.id === selectedFolderId);
        const folderFlashcards = flashcards.filter((f: Flashcard) => f.folderId === selectedFolderId);
        return (
          <FolderView
            folder={selectedFolder}
            flashcards={folderFlashcards}
            onBack={handleBackToHome}
            onUpdateFlashcard={updateFlashcard}
            onDeleteFlashcard={deleteFlashcard}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

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
        user={user}
        onLogout={handleLogout}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;