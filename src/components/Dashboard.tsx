import React from 'react';
import { PlusIcon, BookOpenIcon, FolderIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Flashcard, Folder } from '../types/flashcard';

interface DashboardProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onNavigateToFolder: (folderId: string) => void;
  onCreateCard: () => void;
  onStudy: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  flashcards,
  folders,
  onNavigateToFolder,
  onCreateCard,
  onStudy
}) => {
  const totalCards = flashcards.length;
  const studiedCards = flashcards.filter(card => card.lastStudied).length;
  const studyProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to FlashVibe</h1>
          <p className="text-xl text-gray-600">Your personal flashcard learning companion</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <BookOpenIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <AcademicCapIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Study Progress</p>
                <p className="text-2xl font-bold text-gray-900">{studyProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <FolderIcon className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Folders</p>
                <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={onCreateCard}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <PlusIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Card</h3>
            <p className="text-gray-600">Add a new flashcard to your collection</p>
          </button>

          <button
            onClick={onStudy}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200 group"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                <BookOpenIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Study Mode</h3>
            <p className="text-gray-600">Review your flashcards and test your knowledge</p>
          </button>
        </div>

        {/* Folders Section */}
        {folders.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => {
                const folderCards = flashcards.filter(card => card.folderId === folder.id);
                return (
                  <button
                    key={folder.id}
                    onClick={() => onNavigateToFolder(folder.id)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center mb-2">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: folder.color }}
                      />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {folder.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {folderCards.length} card{folderCards.length !== 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalCards === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No flashcards yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first flashcard</p>
            <button
              onClick={onCreateCard}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};