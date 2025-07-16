import React from 'react';
import { 
  HomeIcon, 
  PlusIcon, 
  BookOpenIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Folder } from '../types/flashcard';

interface User {
  name?: string;
  email: string;
}

type View = 'dashboard' | 'create' | 'study' | 'folder';

interface HeaderProps {
  currentView: View;
  folders: Folder[];
  onNavigate: (view: View) => void;
  onNavigateToFolder: (folderId: string) => void;
  onAddFolder: (folder: Folder) => void;
  onUpdateFolder: (folder: Folder) => void;
  onDeleteFolder: (id: string) => void;
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  folders,
  onNavigate,
  onNavigateToFolder,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
  user,
  onLogout,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('create')}
              className={`nav-button ${currentView === 'create' ? 'active' : ''}`}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create</span>
            </button>

            <button
              onClick={() => onNavigate('study')}
              className={`nav-button ${currentView === 'study' ? 'active' : ''}`}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Study</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </p>
                {user.name && (
                  <p className="text-xs text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};