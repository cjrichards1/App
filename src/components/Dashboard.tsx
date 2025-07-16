import React from 'react';
import { PlusIcon, BookOpenIcon, FolderIcon, AcademicCapIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { HeroSection } from './HeroSection';
import { Flashcard, Folder } from '../types/flashcard';
import { ProgressCards } from './ProgressCards';

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
  
  // Calculate additional metrics for progress cards
  const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctCount, 0);
  const totalAttempts = flashcards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0);
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  
  const masteredCards = flashcards.filter(card => {
    const attempts = card.correctCount + card.incorrectCount;
    return attempts >= 3 && (card.correctCount / attempts) >= 0.8;
  }).length;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <HeroSection
        userName="Alex"
        studyStreak={15}
        totalCards={totalCards}
        cardsStudied={studiedCards}
        accuracy={85}
        onCreateCard={onCreateCard}
        onStartStudy={onStudy}
      />
      
      {/* Rest of Dashboard */}
      <div className="p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">

        {/* Progress Cards Section */}
        {totalCards > 0 && (
          <div className="mb-12">
            <ProgressCards
              studyProgress={studyProgress}
              accuracyRate={accuracyRate}
              dailyGoal={20}
              dailyCompleted={Math.min(studiedCards, 20)}
              weeklyStreak={5}
              totalCards={totalCards}
              masteredCards={masteredCards}
              studyTime={35}
              targetStudyTime={60}
            />
          </div>
        )}

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
    </div>
  );
};