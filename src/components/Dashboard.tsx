import React from 'react';
import { FolderIcon, SparklesIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { HeroSection } from './HeroSection';
import { ProgressCards } from './ProgressCards';
import { Flashcard, Folder } from '../types/flashcard';

interface DashboardProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onNavigateToFolder: (folderId: string) => void;
  onCreateCard: () => void;
  onCreateFolder: () => void;
  onStudy: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  flashcards,
  folders,
  onNavigateToFolder,
  onCreateCard,
  onCreateFolder,
  onStudy
}: DashboardProps) => {
  // Calculate statistics
  const totalCards = flashcards.length;
  const studiedCards = flashcards.filter(card => card.correctCount + card.incorrectCount > 0).length;
  const totalAttempts = flashcards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0);
  const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctCount, 0);
  const studyProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const masteredCards = flashcards.filter(card => card.correctCount >= 3).length;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <HeroSection
        userName="Alex"
        studyStreak={15}
        totalCards={totalCards}
        cardsStudied={studiedCards}
        accuracy={accuracyRate}
        onCreateCard={onCreateCard}
        onStartStudy={onStudy}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Cards Section */}
        {totalCards > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mr-3">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
            </div>
            <ProgressCards
              totalCards={totalCards}
              studiedCards={studiedCards}
              masteredCards={masteredCards}
              accuracyRate={accuracyRate}
            />
          </div>
        )}

        {/* Folders Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3">
                <FolderIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Study Folders</h2>
            </div>
            <button
              onClick={onCreateFolder}
              className="btn-modern btn-primary"
            >
              <FolderIcon className="w-4 h-4 mr-2" />
              New Folder
            </button>
          </div>
          
          {folders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => {
                const folderCardCount = flashcards.filter(card => card.folderId === folder.id).length;
                return (
                  <div
                    key={folder.id}
                    onClick={() => onNavigateToFolder(folder.id)}
                    className="modern-card cursor-pointer group"
                  >
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md"
                        style={{ backgroundColor: folder.color }}
                      >
                        <FolderIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {folderCardCount} cards
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: folderCardCount > 0 ? '60%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <FolderIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No folders yet</h3>
              <p className="text-gray-500 mb-4">Create your first folder to organize your flashcards</p>
              <button
                onClick={onCreateFolder}
                className="btn-modern btn-primary"
              >
                <FolderIcon className="w-4 h-4 mr-2" />
                Create First Folder
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="modern-card-gradient">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Study</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Jump right into studying with a random selection of cards
            </p>
            <button
              onClick={onStudy}
              className="btn-modern btn-success w-full"
            >
              Start Quick Study
            </button>
          </div>
          
          <div className="modern-card-gradient">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mr-3">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Create Card</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Add new flashcards to expand your knowledge base
            </p>
            <button
              onClick={onCreateCard}
              className="btn-modern btn-primary w-full"
            >
              Create New Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};