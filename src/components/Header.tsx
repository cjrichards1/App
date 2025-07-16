import React, { useState } from 'react';
import { 
  FolderIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { Folder } from '../types/flashcard';

interface HeaderProps {
  folders: Folder[];
  currentView: string;
  selectedFolderId?: string;
  onViewChange: (view: string, folderId?: string) => void;
  onAddFolder: (name: string, color: string) => void;
  onUpdateFolder: (id: string, updates: Partial<Folder>) => void;
  onDeleteFolder: (id: string) => void;
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
  selectedFolderId,
  onViewChange,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
}) => {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(folderColors[0]);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor(folderColors[0]);
      setShowAddFolder(false);
    }
  };

  const handleUpdateFolder = (folderId: string) => {
    if (newFolderName.trim()) {
      onUpdateFolder(folderId, { name: newFolderName.trim(), color: newFolderColor });
      setEditingFolder(null);
      setNewFolderName('');
      setNewFolderColor(folderColors[0]);
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
    setNewFolderColor(folder.color);
  };

  const cancelEditing = () => {
    setEditingFolder(null);
    setNewFolderName('');
    setNewFolderColor(folderColors[0]);
  };

  const getCurrentViewTitle = () => {
    if (currentView === 'folder' && selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">FlashVibe</h1>
          <span className="text-gray-400">•</span>
          <span className="text-lg text-gray-600">{getCurrentViewTitle()}</span>
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Bars3Icon className="w-5 h-5" />
              <span>Menu</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showMainMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    onViewChange('home');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentView === 'home' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('create');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentView === 'create' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Cards</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('study');
                    setShowMainMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentView === 'study' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FolderIcon className="w-5 h-5" />
              <span>Folders</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {showFolderMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                {/* Add Folder Button */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <button
                    onClick={() => setShowAddFolder(!showAddFolder)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Folder</span>
                  </button>
                </div>

                {/* Add Folder Form */}
                {showAddFolder && (
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
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
                        className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddFolder(false)}
                        className="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Folders List */}
                <div className="max-h-64 overflow-y-auto">
                  {folders.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No folders yet
                    </div>
                  ) : (
                    folders.map((folder) => (
                      <div key={folder.id} className="group">
                        {editingFolder === folder.id ? (
                          <div className="px-4 py-2 bg-gray-50">
                            <input
                              type="text"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
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
                                className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="flex-1 px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onViewChange('folder', folder.id);
                              setShowFolderMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                              currentView === 'folder' && selectedFolderId === folder.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: folder.color }}
                            />
                            <span className="font-medium truncate flex-1">{folder.name}</span>
                            <span className="text-xs text-gray-500">{folder.cardCount}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(folder);
                                }}
                                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
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
                                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-600"
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