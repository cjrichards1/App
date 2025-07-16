import React, { useState } from 'react';
import { ProgressCards } from './ProgressCards';
import { 
  ArrowPathIcon, 
  SparklesIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export const ProgressDemo: React.FC = () => {
  const [demoData, setDemoData] = useState({
    studyProgress: 75,
    accuracyRate: 87,
    dailyGoal: 20,
    dailyCompleted: 15,
    weeklyStreak: 5,
    totalCards: 150,
    masteredCards: 112,
    studyTime: 45,
    targetStudyTime: 60
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const resetAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const randomizeData = () => {
    setDemoData({
      studyProgress: Math.floor(Math.random() * 40) + 60, // 60-100%
      accuracyRate: Math.floor(Math.random() * 30) + 70, // 70-100%
      dailyGoal: 20,
      dailyCompleted: Math.floor(Math.random() * 20) + 5, // 5-25
      weeklyStreak: Math.floor(Math.random() * 7) + 1, // 1-7
      totalCards: 150,
      masteredCards: Math.floor(Math.random() * 50) + 100, // 100-150
      studyTime: Math.floor(Math.random() * 40) + 30, // 30-70
      targetStudyTime: 60
    });
    resetAnimation();
  };

  const presetScenarios = [
    {
      name: 'Beginner',
      data: {
        studyProgress: 25,
        accuracyRate: 65,
        dailyGoal: 10,
        dailyCompleted: 3,
        weeklyStreak: 2,
        totalCards: 50,
        masteredCards: 12,
        studyTime: 15,
        targetStudyTime: 30
      }
    },
    {
      name: 'Intermediate',
      data: {
        studyProgress: 60,
        accuracyRate: 78,
        dailyGoal: 15,
        dailyCompleted: 12,
        weeklyStreak: 4,
        totalCards: 100,
        masteredCards: 60,
        studyTime: 35,
        targetStudyTime: 45
      }
    },
    {
      name: 'Advanced',
      data: {
        studyProgress: 90,
        accuracyRate: 94,
        dailyGoal: 25,
        dailyCompleted: 23,
        weeklyStreak: 7,
        totalCards: 200,
        masteredCards: 180,
        studyTime: 55,
        targetStudyTime: 60
      }
    }
  ];

  return (
    <div className="progress-demo min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <ChartBarIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Progress Cards Demo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beautiful, animated progress cards with glassmorphism effects and smooth transitions
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={randomizeData}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Randomize Data
          </button>

          <button
            onClick={resetAnimation}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            <SparklesIcon className="w-5 h-5" />
            Replay Animation
          </button>
        </div>

        {/* Preset Scenarios */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="flex items-center gap-2 text-gray-600 font-semibold">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            Quick Scenarios:
          </span>
          {presetScenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => {
                setDemoData(scenario.data);
                resetAnimation();
              }}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-gray-200"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Cards */}
      <div key={isAnimating ? 'animating' : 'static'}>
        <ProgressCards {...demoData} />
      </div>

      {/* Features List */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Features Showcase</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Animated Counters</h3>
              <p className="text-gray-600 text-sm">Values count up smoothly when cards load</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Progress Bars</h3>
              <p className="text-gray-600 text-sm">Smooth filling animation with shimmer effects</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <ArrowPathIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Color Coding</h3>
              <p className="text-gray-600 text-sm">Dynamic colors based on progress levels</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Glassmorphism</h3>
              <p className="text-gray-600 text-sm">Modern frosted glass effects with blur</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hover Effects</h3>
              <p className="text-gray-600 text-sm">Smooth scale and shadow transitions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Responsive</h3>
              <p className="text-gray-600 text-sm">Adapts beautifully to all screen sizes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Usage Example
          </h3>
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`<ProgressCards
  studyProgress={75}
  accuracyRate={87}
  dailyGoal={20}
  dailyCompleted={15}
  weeklyStreak={5}
  totalCards={150}
  masteredCards={112}
  studyTime={45}
  targetStudyTime={60}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};