import React from 'react';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { FlashcardStats, Folder } from '../types/flashcard';

interface DashboardProps {
  stats: FlashcardStats;
  folders: Folder[];
  onViewChange: (view: string, folderId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, folders, onViewChange }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and manage your flashcards</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Studied Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.studiedToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className={`text-3xl font-bold ${getAccuracyColor(stats.averageAccuracy)}`}>
                  {Math.round(stats.averageAccuracy)}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Folders</p>
                <p className="text-3xl font-bold text-gray-900">{folders.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FolderIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onViewChange('create')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Flashcards</h3>
                <p className="text-gray-600">Add new cards to your collection</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onViewChange('study')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <AcademicCapIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Study Mode</h3>
                <p className="text-gray-600">Practice with your flashcards</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Folders */}
        {folders.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Folders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.slice(0, 6).map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => onViewChange('folder', folder.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: folder.color }}
                  >
                    <FolderIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{folder.name}</h4>
                    <p className="text-sm text-gray-500">
                      {folder.cardCount} {folder.cardCount === 1 ? 'card' : 'cards'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(stats.categoryBreakdown).length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cards by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};