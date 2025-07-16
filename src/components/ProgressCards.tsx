import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  BoltIcon,
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
  color: string;
  description: string;
  target?: number;
  streak?: number;
}

interface ProgressCardsProps {
  studyProgress: number;
  accuracyRate: number;
  dailyGoal: number;
  dailyCompleted: number;
  weeklyStreak: number;
  totalCards: number;
  masteredCards: number;
  studyTime: number;
  targetStudyTime: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  maxValue,
  unit = '',
  icon: Icon,
  gradient,
  color,
  description,
  target,
  streak
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const getProgressBg = () => {
    if (percentage >= 80) return 'bg-green-50';
    if (percentage >= 60) return 'bg-blue-50';
    if (percentage >= 40) return 'bg-yellow-50';
    return 'bg-orange-50';
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Animate the value counter
    const valueInterval = setInterval(() => {
      setAnimatedValue(prev => {
        if (prev >= value) {
          clearInterval(valueInterval);
          return value;
        }
        return prev + Math.ceil(value / 50);
      });
    }, 30);

    // Animate the progress bar
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= percentage) {
          clearInterval(progressInterval);
          return percentage;
        }
        return prev + 2;
      });
    }, 20);

    return () => {
      clearInterval(valueInterval);
      clearInterval(progressInterval);
    };
  }, [value, percentage]);

  return (
    <div className={`progress-card ${isVisible ? 'animate-in' : ''}`}>
      <div className="progress-card-inner">
        {/* Header */}
        <div className="progress-header">
          <div className="progress-icon-container">
            <div className={`progress-icon bg-gradient-to-br ${gradient}`}>
              <Icon className="icon" />
            </div>
            {streak && streak > 0 && (
              <div className="streak-badge">
                <FireIcon className="streak-icon" />
                <span>{streak}</span>
              </div>
            )}
          </div>
          <div className="progress-info">
            <h3 className="progress-title">{title}</h3>
            <p className="progress-description">{description}</p>
          </div>
        </div>

        {/* Value Display */}
        <div className="progress-value-section">
          <div className="progress-main-value">
            <span className="progress-number">{animatedValue}</span>
            <span className="progress-unit">{unit}</span>
            {maxValue !== 100 && (
              <span className="progress-max">/ {maxValue}</span>
            )}
          </div>
          {target && (
            <div className="progress-target">
              <FlagIcon className="target-icon" />
              <span>Target: {target}{unit}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className={`progress-bar-bg ${getProgressBg()}`}>
            <div 
              className={`progress-bar-fill bg-gradient-to-r ${getProgressColor()}`}
              style={{ width: `${animatedProgress}%` }}
            >
              <div className="progress-bar-shine"></div>
            </div>
          </div>
          <div className="progress-percentage">
            <span>{Math.round(animatedProgress)}%</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="progress-status">
          {percentage >= 80 ? (
            <div className="status-excellent">
              <CheckCircleIcon className="status-icon" />
              <span>Excellent!</span>
            </div>
          ) : percentage >= 60 ? (
            <div className="status-good">
              <StarIcon className="status-icon" />
              <span>Good Progress</span>
            </div>
          ) : percentage >= 40 ? (
            <div className="status-okay">
              <BoltIcon className="status-icon" />
              <span>Keep Going</span>
            </div>
          ) : (
            <div className="status-needs-work">
              <FlagIcon className="status-icon" />
              <span>Needs Focus</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProgressCards: React.FC<ProgressCardsProps> = ({
  studyProgress,
  accuracyRate,
  dailyGoal,
  dailyCompleted,
  weeklyStreak,
  totalCards,
  masteredCards,
  studyTime,
  targetStudyTime
}) => {
  const progressData = [
    {
      title: 'Study Progress',
      value: studyProgress,
      maxValue: 100,
      unit: '%',
      icon: BookOpenIcon,
      gradient: 'from-blue-500 to-blue-600',
      color: 'blue',
      description: 'Overall learning progress',
      streak: weeklyStreak
    },
    {
      title: 'Accuracy Rate',
      value: accuracyRate,
      maxValue: 100,
      unit: '%',
      icon: TrophyIcon,
      gradient: 'from-green-500 to-green-600',
      color: 'green',
      description: 'Correct answers percentage'
    },
    {
      title: 'Daily Goal',
      value: dailyCompleted,
      maxValue: dailyGoal,
      unit: ' cards',
      icon: FlagIcon,
      gradient: 'from-purple-500 to-purple-600',
      color: 'purple',
      description: 'Today\'s study target',
      target: dailyGoal
    },
    {
      title: 'Cards Mastered',
      value: masteredCards,
      maxValue: totalCards,
      unit: '',
      icon: AcademicCapIcon,
      gradient: 'from-indigo-500 to-indigo-600',
      color: 'indigo',
      description: 'Cards you\'ve mastered'
    },
    {
      title: 'Study Time',
      value: studyTime,
      maxValue: targetStudyTime,
      unit: ' min',
      icon: ClockIcon,
      gradient: 'from-orange-500 to-orange-600',
      color: 'orange',
      description: 'Time spent studying today',
      target: targetStudyTime
    },
    {
      title: 'Weekly Streak',
      value: weeklyStreak,
      maxValue: 7,
      unit: ' days',
      icon: FireIcon,
      gradient: 'from-red-500 to-red-600',
      color: 'red',
      description: 'Consecutive study days'
    }
  ];

  return (
    <div className="progress-cards-container">
      <div className="progress-cards-header">
        <h2 className="progress-cards-title">Your Progress</h2>
        <p className="progress-cards-subtitle">Track your learning journey</p>
      </div>
      
      <div className="progress-cards-grid">
        {progressData.map((card, index) => (
          <ProgressCard
            key={card.title}
            {...card}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};