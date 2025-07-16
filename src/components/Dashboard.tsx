import React from 'react';
import { PlusIcon, BookOpenIcon, FolderIcon, AcademicCapIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
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
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-flashvibe-blue to-blue-600 rounded-2xl shadow-lg">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-flashvibe-slate mb-2">Welcome to FlashVibe</h1>
              <p className="text-xl text-gray-600 font-medium">Learn Fast, Vibe Smart ✨</p>
            </div>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your personal flashcard learning companion designed to make studying engaging and effective
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-flashvibe-blue hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-xl mr-4">
                <BookOpenIcon className="w-8 h-8 text-flashvibe-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Cards</p>
                <p className="text-3xl font-bold text-flashvibe-slate">{totalCards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-flashvibe-green hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-xl mr-4">
                <TrophyIcon className="w-8 h-8 text-flashvibe-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Study Progress</p>
                <p className="text-3xl font-bold text-flashvibe-slate">{studyProgress}%</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-flashvibe-green to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${studyProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-flashvibe-coral hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center">
              <div className="p-3 bg-rose-50 rounded-xl mr-4">
                <FolderIcon className="w-8 h-8 text-flashvibe-coral" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Folders</p>
                <p className="text-3xl font-bold text-flashvibe-slate">{folders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={onCreateCard}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-flashvibe-blue/30 group card-hover"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-flashvibe-blue to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
                <PlusIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-flashvibe-slate mb-3 group-hover:text-flashvibe-blue transition-colors">Create New Card</h3>
            <p className="text-gray-600 text-lg">Add a new flashcard to your collection and start learning</p>
          </button>

          <button
            onClick={onStudy}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-flashvibe-green/30 group card-hover"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-flashvibe-green to-green-600 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 shadow-lg">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-flashvibe-slate mb-3 group-hover:text-flashvibe-green transition-colors">Study Mode</h3>
            <p className="text-gray-600 text-lg">Review your flashcards and test your knowledge</p>
          </button>
        </div>

        {/* Folders Section */}
        {folders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-flashvibe-coral to-rose-600 rounded-xl">
                <FolderIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-flashvibe-slate">Your Folders</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => {
                const folderCards = flashcards.filter(card => card.folderId === folder.id);
                return (
                  <button
                    key={folder.id}
                    onClick={() => onNavigateToFolder(folder.id)}
                    className="p-6 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left group bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-center mb-3">
                      <div 
                        className="w-5 h-5 rounded-full mr-3 shadow-sm"
                        style={{ backgroundColor: folder.color }}
                      />
                      <h3 className="font-bold text-flashvibe-slate group-hover:text-flashvibe-blue transition-colors text-lg">
                        {folder.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 font-medium">
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
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-fit mx-auto mb-6">
              <BookOpenIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-flashvibe-slate mb-3">No flashcards yet</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">Get started by creating your first flashcard and begin your learning journey</p>
            <button
              onClick={onCreateCard}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-flashvibe-blue to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
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