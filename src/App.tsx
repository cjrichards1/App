import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FlashcardForm } from './components/FlashcardForm';
import { StudyMode } from './components/StudyMode';
import { FolderView } from './components/FolderView';
import { Auth } from './components/Auth';
import { useFlashcards } from './hooks/useFlashcards';
import { Flashcard, Folder, NewFlashcard } from './types/flashcard';
import { authService } from './services/authService';

type View = 'dashboard' | 'create' | 'study' | 'folder';

interface User {
  name?: string;
  email: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({
            name: currentUser.name,
            email: currentUser.email
          });
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateFolder = () => {
    // Implement folder creation logic
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleAddFolder = (folder: Folder) => {
    addFolder(folder.name, folder.color);
  };

  const handleUpdateFolder = (folder: Folder) => {
    updateFolder(folder.id, { name: folder.name, color: folder.color });
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
            onCreateFolder={handleCreateFolder}
            user={user}
          />
        );
      case 'create':
        return (
          <FlashcardForm
            folders={folders}
            categories={categories}
            onBack={handleBackToHome}
            onAdd={(flashcard: NewFlashcard) => {
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
        if (!selectedFolder) return null;
        
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header
        currentView={currentView}
        folders={folders}
        onNavigate={handleNavigate}
        onNavigateToFolder={handleNavigateToFolder}
        onAddFolder={handleAddFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={deleteFolder}
        user={user}
        onLogout={handleLogout}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;