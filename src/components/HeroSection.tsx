import React, { useState, useEffect } from 'react';
import { 
  FireIcon, 
  BookOpenIcon, 
  TrophyIcon, 
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  userName?: string;
  studyStreak?: number;
  totalCards?: number;
  cardsStudied?: number;
  accuracy?: number;
  onCreateCard?: () => void;
  onStartStudy?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userName = "Student",
  studyStreak = 15,
  totalCards = 247,
  cardsStudied = 89,
  accuracy = 87,
  onCreateCard,
  onStartStudy
}) => {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [animatedCards, setAnimatedCards] = useState(0);
  const [animatedStudied, setAnimatedStudied] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animate counters on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Animate study streak
    const streakInterval = setInterval(() => {
      setAnimatedStreak(prev => {
        if (prev >= studyStreak) {
          clearInterval(streakInterval);
          return studyStreak;
        }
        return prev + 1;
      });
    }, 100);

    // Animate total cards
    const cardsInterval = setInterval(() => {
      setAnimatedCards(prev => {
        if (prev >= totalCards) {
          clearInterval(cardsInterval);
          return totalCards;
        }
        return prev + Math.ceil(totalCards / 50);
      });
    }, 50);

    // Animate cards studied
    const studiedInterval = setInterval(() => {
      setAnimatedStudied(prev => {
        if (prev >= cardsStudied) {
          clearInterval(studiedInterval);
          return cardsStudied;
        }
        return prev + Math.ceil(cardsStudied / 30);
      });
    }, 80);

    // Animate accuracy
    const accuracyInterval = setInterval(() => {
      setAnimatedAccuracy(prev => {
        if (prev >= accuracy) {
          clearInterval(accuracyInterval);
          return accuracy;
        }
        return prev + Math.ceil(accuracy / 25);
      });
    }, 70);

    return () => {
      clearInterval(streakInterval);
      clearInterval(cardsInterval);
      clearInterval(studiedInterval);
      clearInterval(accuracyInterval);
    };
  }, [studyStreak, totalCards, cardsStudied, accuracy]);

  return (
    <div className="hero-section">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="container">
          {/* Welcome Message */}
          <div className={`hero-welcome ${isVisible ? 'animate-in' : ''}`}>
            <h1 className="welcome-title">
              Welcome back, <span className="name-highlight">{userName}</span>!
            </h1>
            <p className="welcome-subtitle">
              Ready to continue your learning journey? You're doing amazing! ✨
            </p>
          </div>

          {/* Study Streak Card */}
          <div className={`streak-card glass-card ${isVisible ? 'animate-in delay-200' : ''}`}>
            <div className="streak-content">
              <div className="streak-icon">
                <FireIcon className="icon fire-icon" />
              </div>
              <div className="streak-info">
                <div className="streak-number">
                  {animatedStreak}
                  <span className="streak-unit">days</span>
                </div>
                <div className="streak-label">Study Streak</div>
                <div className="streak-message">
                  {studyStreak >= 7 ? "You're on fire! 🔥" : "Keep it up! 💪"}
                </div>
              </div>
              <div className="streak-visual">
                <div className="flame-animation">
                  <div className="flame flame-1"></div>
                  <div className="flame flame-2"></div>
                  <div className="flame flame-3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`stats-grid ${isVisible ? 'animate-in delay-400' : ''}`}>
            <div className="stat-card glass-card pulse-metric">
              <div className="stat-icon">
                <BookOpenIcon className="icon" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedCards}</div>
                <div className="stat-label">Total Cards</div>
              </div>
            </div>

            <div className="stat-card glass-card pulse-metric delay-100">
              <div className="stat-icon">
                <AcademicCapIcon className="icon" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedStudied}</div>
                <div className="stat-label">Cards Studied</div>
              </div>
            </div>

            <div className="stat-card glass-card pulse-metric delay-200">
              <div className="stat-icon">
                <TrophyIcon className="icon" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedAccuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`hero-actions ${isVisible ? 'animate-in delay-600' : ''}`}>
            <button 
              className="action-btn primary-btn"
              onClick={onStartStudy}
            >
              <AcademicCapIcon className="btn-icon" />
              <span>Continue Studying</span>
              <div className="btn-glow"></div>
            </button>
            
            <button 
              className="action-btn secondary-btn"
              onClick={onCreateCard}
            >
              <BookOpenIcon className="btn-icon" />
              <span>Create New Card</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          {/* Achievement Badge */}
          {studyStreak >= 7 && (
            <div className={`achievement-badge ${isVisible ? 'animate-in delay-800' : ''}`}>
              <div className="badge-content glass-card">
                <StarIcon className="badge-icon" />
                <span className="badge-text">
                  {studyStreak >= 30 ? 'Study Master!' : 
                   studyStreak >= 14 ? 'Consistency Champion!' : 
                   'Week Warrior!'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};