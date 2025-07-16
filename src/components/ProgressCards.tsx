import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  CheckCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  unit?: string;
  icon: React.ComponentType<any>;
  gradient: string;
  description: string;
  delay?: number;
}

interface ProgressCardsProps {
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  accuracyRate: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  maxValue,
  unit = '',
  icon: Icon,
  gradient,
  description,
  delay = 0
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const percentage = Math.min((value / maxValue) * 100, 100);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate the value counter
      const valueInterval = setInterval(() => {
        setAnimatedValue(prev => {
          if (prev >= value) {
            clearInterval(valueInterval);
            return value;
          }
          return prev + Math.ceil(value / 30);
        });
      }, 50);

      // Animate the progress bar
      const progressInterval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= percentage) {
            clearInterval(progressInterval);
            return percentage;
          }
          return prev + 3;
        });
      }, 30);

      return () => {
        clearInterval(valueInterval);
        clearInterval(progressInterval);
      };
    }, delay);

    return () => clearTimeout(timer);
  }, [value, percentage, delay]);

  return (
    <div className={`modern-card-gradient ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-3 ${gradient}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {animatedValue}
            <span className="text-sm font-medium text-gray-500 ml-1">
              {unit}
              {maxValue !== 100 && ` / ${maxValue}`}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${gradient}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {percentage >= 80 ? (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">Excellent!</span>
            </>
          ) : percentage >= 60 ? (
            <>
              <StarIcon className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-blue-600">Good Progress</span>
            </>
          ) : percentage >= 40 ? (
            <>
              <FlagIcon className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-yellow-600">Keep Going</span>
            </>
          ) : (
            <>
              <FlagIcon className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-orange-600">Needs Focus</span>
            </>
          )}
        </div>
        <span className="text-sm font-medium text-gray-500">
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  );
};

export const ProgressCards: React.FC<ProgressCardsProps> = ({
  totalCards,
  studiedCards,
  masteredCards,
  accuracyRate
}) => {
  const studyProgress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;
  const masteryRate = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

  const progressData = [
    {
      title: 'Study Progress',
      value: studiedCards,
      maxValue: totalCards,
      unit: ' cards',
      icon: BookOpenIcon,
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'Cards you\'ve studied'
    },
    {
      title: 'Accuracy Rate',
      value: accuracyRate,
      maxValue: 100,
      unit: '%',
      icon: TrophyIcon,
      gradient: 'bg-gradient-to-r from-green-500 to-green-600',
      description: 'Correct answers percentage'
    },
    {
      title: 'Cards Mastered',
      value: masteredCards,
      maxValue: totalCards,
      unit: ' cards',
      icon: AcademicCapIcon,
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      description: 'Cards you\'ve mastered'
    },
    {
      title: 'Mastery Rate',
      value: Math.round(masteryRate),
      maxValue: 100,
      unit: '%',
      icon: StarIcon,
      gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      description: 'Percentage of mastered cards'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {progressData.map((card, index) => (
        <ProgressCard
          key={card.title}
          {...card}
          delay={index * 100}
        />
      ))}
    </div>
  );
};