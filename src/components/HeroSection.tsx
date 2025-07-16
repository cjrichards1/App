import React from 'react';
import {
  PlusIcon,
  PlayIcon,
  UserIcon,
  FireIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  userName: string;
  studyStreak: number;
  totalCards: number;
  cardsStudied: number;
  accuracy: number;
  onCreateCard: () => void;
  onStartStudy: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  studyStreak,
  totalCards,
  cardsStudied,
  accuracy,
  onCreateCard,
  onStartStudy
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, <span className="text-yellow-300">{userName}</span>!
          </h1>
          <p className="text-xl text-indigo-100 mb-6">
            Ready to expand your knowledge? Let's continue your learning journey.
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <FireIcon className="w-5 h-5 text-orange-300 mr-2" />
            <span className="text-sm font-medium">
              {studyStreak} day streak - Keep it up!
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/30 rounded-xl mb-3">
              <ChartBarIcon className="w-6 h-6 text-indigo-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalCards}</h3>
            <p className="text-indigo-200 text-sm">Total Cards</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/30 rounded-xl mb-3">
              <PlayIcon className="w-6 h-6 text-purple-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{cardsStudied}</h3>
            <p className="text-purple-200 text-sm">Cards Studied</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500/30 rounded-xl mb-3">
              <SparklesIcon className="w-6 h-6 text-pink-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{accuracy}%</h3>
            <p className="text-pink-200 text-sm">Accuracy</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onCreateCard}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Card
          </button>
          <button 
            onClick={onStartStudy}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <PlayIcon className="w-5 h-5 mr-2" />
            Start Studying
          </button>
        </div>
      </div>
    </div>
  );
};