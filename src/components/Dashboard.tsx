import React from 'react';
import { FolderIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
  user: { name?: string; email: string };
}

export const Dashboard: React.FC<DashboardProps> = ({
  flashcards,
  folders,
  onNavigateToFolder,
  onCreateCard,
  onCreateFolder,
  onStudy,
  user
}: DashboardProps) => {
  // Calculate statistics
  const totalCards = flashcards.length;
  const studiedCards = flashcards.filter(card => card.correctCount + card.incorrectCount > 0).length;
  const totalAttempts = flashcards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0);
  const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctCount, 0);
  const studyProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const masteredCards = flashcards.filter(card => card.correctCount >= 3).length; // Consider a card mastered if correctly answered 3+ times

  // Get display name - use name if available, otherwise use email
  const displayName = user.name || user.email.split('@')[0];
  return (
    <div className="dashboard-container flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
      {/* FlashVibe Title */}
      <div className="text-center py-4 sm:py-6 lg:py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-flashvibe-blue to-flashvibe-coral bg-clip-text text-transparent">
          FlashVibe
        </h1>
      </div>
      
      {/* Hero Section */}
      <HeroSection
        userName={displayName}
        studyStreak={15}
        totalCards={totalCards}
        cardsStudied={studiedCards}
        accuracy={accuracyRate}
        onCreateCard={onCreateCard}
        onStartStudy={onStudy}
      />
      
      {/* Rest of Dashboard */}
      <div className="section animate-fade-in">
        <div className="container max-w-full">
          {/* Progress Cards Section */}
          {totalCards > 0 && (
            <div className="stack-lg mb-6 sm:mb-8 lg:mb-12">
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
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="p-2 bg-gradient-to-br from-flashvibe-coral to-rose-600 rounded-xl">
                  <FolderIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-flashvibe-slate">Your Folders</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {folders.map((folder) => {
                  const folderCards = flashcards.filter(card => card.folderId === folder.id);
                  return (
                    <button
                      key={folder.id}
                      onClick={() => onNavigateToFolder(folder.id)}
                      className="p-4 sm:p-6 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left group bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-5 h-5 rounded-full mr-3 shadow-sm"
                          style={{ backgroundColor: folder.color }}
                        />
                        <h3 className="font-bold text-flashvibe-slate group-hover:text-flashvibe-blue transition-colors text-base sm:text-lg">
                          {folder.name}
                        </h3>
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">
                        {folderCards.length} card{folderCards.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalCards === 0 && folders.length === 0 && (
            <div className="center-text p-4 sm:p-6">
              <div className="stack gap-md">
                <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Start Your Learning Journey</h2>
                  <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Create your first flashcard or folder to begin studying.</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={onCreateCard}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Create Flashcard
                    </button>
                    <button
                      onClick={onCreateFolder}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Create Folder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};