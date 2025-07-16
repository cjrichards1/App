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
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FlashMaster
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`nav-button-modern ${currentView === 'dashboard' ? 'active' : ''}`}
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => onNavigate('create')}
                className={`nav-button-modern ${currentView === 'create' ? 'active' : ''}`}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create</span>
              </button>
              <button
                onClick={() => onNavigate('study')}
                className={`nav-button-modern ${currentView === 'study' ? 'active' : ''}`}
              >
                <BookOpenIcon className="h-5 w-5" />
                <span>Study</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
              <UserCircleIcon className="h-6 w-6 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                {user.name || user.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};