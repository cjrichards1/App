import React from 'react';
import {
  PlusIcon,
  PlayIcon,
  UserIcon,
  FireIcon
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
    <div className="hero-section">
      <div className="hero-content">
        <div className="welcome-section">
          <div className="user-info">
            <div className="avatar">
              <UserIcon className="avatar-icon" />
            </div>
            <div className="user-details">
              <h1>Welcome back, {userName}!</h1>
              <div className="streak-info">
                <FireIcon className="streak-icon" />
                <span>{studyStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Cards</h3>
            <p>{totalCards}</p>
          </div>
          <div className="stat-card">
            <h3>Cards Studied</h3>
            <p>{cardsStudied}</p>
          </div>
          <div className="stat-card">
            <h3>Accuracy</h3>
            <p>{accuracy}%</p>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={onCreateCard} className="create-button">
            <PlusIcon className="button-icon" />
            <span>Create Card</span>
          </button>
          <button onClick={onStartStudy} className="study-button">
            <PlayIcon className="button-icon" />
            <span>Start Studying</span>
          </button>
        </div>
      </div>
    </div>
  );
};