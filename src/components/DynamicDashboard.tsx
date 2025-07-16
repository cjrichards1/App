import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  FolderIcon,
  PlusIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { Flashcard, Folder } from '../types/flashcard';

interface DynamicDashboardProps {
  flashcards: Flashcard[];
  folders: Folder[];
  onNavigateToFolder: (folderId: string) => void;
  onCreateCard: () => void;
  onStudy: () => void;
}

export const DynamicDashboard: React.FC<DynamicDashboardProps> = ({
  flashcards,
  folders,
  onNavigateToFolder,
  onCreateCard,
  onStudy
}) => {
  const [currentTheme, setCurrentTheme] = useState('theme-focus');
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  // Generate particles for background
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8
    }));
    setParticles(newParticles);
  }, []);

  // Dynamic theme based on activity
  useEffect(() => {
    const themes = ['theme-focus', 'theme-success', 'theme-creative', 'theme-energy'];
    const interval = setInterval(() => {
      setCurrentTheme(themes[Math.floor(Math.random() * themes.length)]);
    }, 10000); // Change theme every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const totalCards = flashcards.length;
  const studiedCards = flashcards.filter(card => card.lastStudied).length;
  const studyProgress = totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  const stats = [
    {
      icon: BookOpenIcon,
      label: 'Total Cards',
      value: totalCards,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      delay: '0s'
    },
    {
      icon: TrophyIcon,
      label: 'Study Progress',
      value: `${studyProgress}%`,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      delay: '0.1s'
    },
    {
      icon: FolderIcon,
      label: 'Folders',
      value: folders.length,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      delay: '0.2s'
    },
    {
      icon: ClockIcon,
      label: 'This Week',
      value: studiedCards,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      delay: '0.3s'
    }
  ];

  return (
    <div className={`min-h-screen theme-transition ${currentTheme} bg-gradient-mesh relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="bg-floating-shapes absolute inset-0" />
      
      {/* Particles */}
      <div className="bg-particles absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 section-fade-enter-active">
            <div className="float-gentle inline-block mb-6">
              <div className="p-6 glass-card inline-flex items-center justify-center">
                <SparklesIcon className="w-16 h-16 theme-adaptive-text pulse-glow" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-4 theme-adaptive-text">
              Welcome to FlashVibe
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your dynamic learning companion with engaging animations and modern design
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 glass-card rounded-full text-sm font-semibold theme-adaptive-text">
                ✨ Modern Design
              </div>
              <div className="px-4 py-2 glass-card rounded-full text-sm font-semibold theme-adaptive-text">
                🚀 Smooth Animations
              </div>
              <div className="px-4 py-2 glass-card rounded-full text-sm font-semibold theme-adaptive-text">
                📱 Responsive Layout
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dynamic-grid mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="dynamic-grid-item float-gentle"
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} rotate-slow`}>
                    <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800 pulse-soft">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
                {stat.label === 'Study Progress' && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${studyProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="dynamic-grid mb-16">
            <div className="dynamic-grid-item interactive-hover interactive-press" onClick={onCreateCard}>
              <div className="text-center">
                <div className="float-medium mb-6">
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 inline-flex items-center justify-center shadow-lg pulse-glow">
                    <PlusIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Create New Card</h3>
                <p className="text-gray-600 text-lg">Add a new flashcard to your collection and start learning</p>
              </div>
            </div>

            <div className="dynamic-grid-item interactive-hover interactive-press" onClick={onStudy}>
              <div className="text-center">
                <div className="float-strong mb-6">
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 inline-flex items-center justify-center shadow-lg pulse-glow">
                    <AcademicCapIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Study Mode</h3>
                <p className="text-gray-600 text-lg">Review your flashcards and test your knowledge</p>
              </div>
            </div>

            <div className="dynamic-grid-item">
              <div className="text-center">
                <div className="float-gentle mb-6">
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 inline-flex items-center justify-center shadow-lg pulse-soft">
                    <ChartBarIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Analytics</h3>
                <p className="text-gray-600 text-lg">Track your learning progress and performance</p>
              </div>
            </div>
          </div>

          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="glass-card p-8 mb-16 section-zoom-enter-active">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 rotate-medium">
                  <FolderIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Your Folders</h2>
              </div>
              
              <div className="masonry-grid">
                {folders.map((folder, index) => {
                  const folderCards = flashcards.filter(card => card.folderId === folder.id);
                  return (
                    <div
                      key={folder.id}
                      className="masonry-item interactive-hover interactive-press cursor-pointer"
                      onClick={() => onNavigateToFolder(folder.id)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-6 h-6 rounded-full mr-3 pulse-soft"
                          style={{ backgroundColor: folder.color }}
                        />
                        <h3 className="font-bold text-gray-800 text-lg">
                          {folder.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 font-medium">
                        {folderCards.length} card{folderCards.length !== 1 ? 's' : ''}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 5) + 1} stars
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalCards === 0 && (
            <div className="glass-card p-16 text-center section-fade-enter-active">
              <div className="float-gentle mb-8">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-400 to-gray-500 inline-flex items-center justify-center">
                  <BookOpenIcon className="w-16 h-16 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No flashcards yet</h3>
              <p className="text-gray-600 mb-8 text-xl max-w-md mx-auto">
                Get started by creating your first flashcard and begin your learning journey
              </p>
              <button
                onClick={onCreateCard}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg interactive-hover"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Card
              </button>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="mt-16 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose FlashVibe?</h2>
            <div className="dynamic-grid">
              <div className="dynamic-grid-item text-center">
                <div className="float-gentle mb-6">
                  <BoltIcon className="w-12 h-12 mx-auto theme-adaptive-text pulse-glow" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
                <p className="text-gray-600">Optimized performance with smooth animations</p>
              </div>
              
              <div className="dynamic-grid-item text-center">
                <div className="float-medium mb-6">
                  <HeartIcon className="w-12 h-12 mx-auto theme-adaptive-text pulse-soft" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">User Friendly</h3>
                <p className="text-gray-600">Intuitive design that makes learning enjoyable</p>
              </div>
              
              <div className="dynamic-grid-item text-center">
                <div className="float-strong mb-6">
                  <StarIcon className="w-12 h-12 mx-auto theme-adaptive-text rotate-slow" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                <p className="text-gray-600">Professional-grade features and design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};