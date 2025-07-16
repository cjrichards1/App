import React, { useState } from 'react';
import { 
  FolderIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Folder } from '../types/flashcard';

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  currentView,
  selectedFolderId,
  onViewChange,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
}) => {
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

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">FlashVibe</h1>
        <p className="text-sm text-gray-600 mt-1">Organize your learning</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => onViewChange('home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => onViewChange('create')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'create'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Create Cards</span>
            </button>

            <button
              onClick={() => onViewChange('study')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'study'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5" />
              <span className="font-medium">Study Mode</span>
            </button>
          </div>

          {/* Folders Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Folders
              </h3>
              <button
                onClick={() => setShowAddFolder(true)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                title="Add folder"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Add Folder Form */}
            {showAddFolder && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
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
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="group">
                  {editingFolder === folder.id ? (
                    <div className="p-2 bg-gray-50 rounded-lg border">
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
                      onClick={() => onViewChange('folder', folder.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentView === 'folder' && selectedFolderId === folder.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
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
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};