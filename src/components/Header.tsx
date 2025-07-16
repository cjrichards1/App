import React, { useState } from 'react';
import {
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
  PlusIcon,
  AcademicCapIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Folder } from '../types/flashcard';

interface HeaderProps {
  folders: Folder[];
  currentView: 'dashboard' | 'create' | 'study' | 'folder';
  onNavigate: (view: 'dashboard' | 'create' | 'study' | 'folder') => void;
  onNavigateToFolder: (folderId: string) => void;
  onAddFolder: (folder: Folder) => void;
  onUpdateFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
}

const folderColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F43F5E', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const Header: React.FC<HeaderProps> = ({
  folders,
  currentView,
  onNavigate,
  onNavigateToFolder,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder
}) => {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(folderColors[0]);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder({ name: newFolderName.trim(), color: newFolderColor });
      setNewFolderName('');
      setNewFolderColor(folderColors[0]);
      setShowAddFolder(false);
    }
  };

  const handleUpdateFolder = (folderId: string) => {
    if (newFolderName.trim()) {
      onUpdateFolder({ id: folderId, name: newFolderName.trim(), color: newFolderColor });
      setEditingFolderId(null);
      setNewFolderName('');
      setNewFolderColor(folderColors[0]);
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
    setNewFolderColor(folder.color);
  };

  const cancelEditing = () => {
    setEditingFolderId(null);
    setNewFolderName('');
    setNewFolderColor(folderColors[0]);
  };

  const getCurrentViewTitle = () => {
    if (currentView === 'folder' && editingFolderId) {
      const folder = folders.find(f => f.id === editingFolderId);
      return folder ? folder.name : 'Folder';
    }
    
    switch (currentView) {
      case 'home': return 'Home';
      case 'create': return 'Create Cards';
      case 'study': return 'Study Mode';
      default: return 'FlashVibe';
    }
  };

  return (
    <header className="bg-gradient-to-r from-flashvibe-blue to-blue-600 shadow-lg px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FlashVibe</h1>
              <p className="text-blue-100 text-sm font-medium">Learn Fast, Vibe Smart</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {/* Main Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMainMenu(!showMainMenu);
                setShowFolderMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 backdrop-blur-sm"
            >
              <Bars3Icon className="w-5 h-5" />
              <span>Menu</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showMainMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-flashvibe-gray transition-colors ${
                    currentView === 'dashboard' ? 'bg-blue-50 text-flashvibe-blue font-semibold' : 'text-flashvibe-slate'
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('create');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-flashvibe-gray transition-colors ${
                    currentView === 'create' ? 'bg-blue-50 text-flashvibe-blue font-semibold' : 'text-flashvibe-slate'
                  }`}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Cards</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('study');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-flashvibe-gray transition-colors ${
                    currentView === 'study' ? 'bg-blue-50 text-flashvibe-blue font-semibold' : 'text-flashvibe-slate'
                  }`}
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  <span>Study Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Folders Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFolderMenu(!showFolderMenu);
                setShowMainMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 backdrop-blur-sm"
            >
              <FolderIcon className="w-5 h-5" />
              <span>Folders</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showFolderMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto animate-scale-in">
                {/* Add Folder Button */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <button
                    onClick={() => setShowAddFolder(!showAddFolder)}
                    className="flex items-center gap-2 text-flashvibe-blue hover:text-blue-700 text-sm font-semibold transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Folder</span>
                  </button>
                </div>

                {/* Add Folder Form */}
                {showAddFolder && (
                  <div className="px-4 py-3 border-b border-gray-100 bg-flashvibe-gray">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-flashvibe-blue focus:border-transparent mb-3 transition-all"
                      autoFocus
                    />
                    <div className="flex gap-2 mb-3">
                      {folderColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            newFolderColor === color ? 'border-gray-400' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddFolder}
                        className="flex-1 px-3 py-1 text-sm bg-flashvibe-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddFolder(false)}
                        className="flex-1 px-3 py-1 text-sm bg-gray-200 text-flashvibe-slate rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Folders List */}
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {folders.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">
                      No folders yet
                    </div>
                  ) : (
                    folders.map((folder) => (
                      <div key={folder.id} className="group">
                        {editingFolderId === folder.id ? (
                          <div className="px-4 py-2 bg-flashvibe-gray">
                            <input
                              type="text"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-flashvibe-blue mb-2 transition-all"
                            />
                            <div className="flex gap-1 mb-2">
                              {folderColors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setNewFolderColor(color)}
                                  className={`w-4 h-4 rounded-full border ${
                                    newFolderColor === color ? 'border-gray-400' : 'border-gray-200'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdateFolder(folder.id)}
                                className="flex-1 px-2 py-1 text-xs bg-flashvibe-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="flex-1 px-2 py-1 text-xs bg-gray-200 text-flashvibe-slate rounded-lg hover:bg-gray-300 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onNavigateToFolder(folder.id);
                              setShowFolderMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-flashvibe-gray transition-colors ${
                              currentView === 'folder' && editingFolderId === folder.id
                                ? 'bg-blue-50 text-flashvibe-blue font-semibold'
                                : 'text-flashvibe-slate'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: folder.color }}
                            />
                            <span className="font-medium truncate flex-1">{folder.name}</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{folder.cardCount}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(folder);
                                }}
                                className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-flashvibe-blue transition-colors"
                                title="Edit folder"
                              >
                                <PencilIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete folder "${folder.name}"? Cards will be moved to "No Folder".`)) {
                                    onDeleteFolder(folder.id);
                                  }
                                }}
                                className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-flashvibe-coral transition-colors"
                                title="Delete folder"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showMainMenu || showFolderMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMainMenu(false);
            setShowFolderMenu(false);
          }}
        />
      )}
    </header>
  );
};