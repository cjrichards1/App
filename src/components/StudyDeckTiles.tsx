import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  CalculatorIcon, 
  BeakerIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  HeartIcon,
  RocketLaunchIcon,
  SparklesIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface StudyDeck {
  id: string;
  name: string;
  cardCount: number;
  category: string;
  gradient: string;
  icon: React.ComponentType<any>;
  progress: number;
  lastStudied?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

interface StudyDeckTilesProps {
  onDeckClick?: (deckId: string) => void;
  onCreateDeck?: () => void;
}

export const StudyDeckTiles: React.FC<StudyDeckTilesProps> = ({
  onDeckClick,
  onCreateDeck
}) => {
  const [hoveredDeck, setHoveredDeck] = useState<string | null>(null);
  const [clickedDeck, setClickedDeck] = useState<string | null>(null);

  const sampleDecks: StudyDeck[] = [
    {
      id: '1',
      name: 'Spanish Vocabulary',
      cardCount: 156,
      category: 'Language',
      gradient: 'from-red-400 via-red-500 to-orange-500',
      icon: GlobeAltIcon,
      progress: 78,
      lastStudied: '2 hours ago',
      difficulty: 'intermediate',
      color: '#ef4444'
    },
    {
      id: '2',
      name: 'Calculus Formulas',
      cardCount: 89,
      category: 'Mathematics',
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      icon: CalculatorIcon,
      progress: 92,
      lastStudied: '1 day ago',
      difficulty: 'advanced',
      color: '#3b82f6'
    },
    {
      id: '3',
      name: 'Chemistry Elements',
      cardCount: 118,
      category: 'Science',
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      icon: BeakerIcon,
      progress: 65,
      lastStudied: '3 hours ago',
      difficulty: 'intermediate',
      color: '#10b981'
    },
    {
      id: '4',
      name: 'JavaScript Concepts',
      cardCount: 203,
      category: 'Programming',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: CodeBracketIcon,
      progress: 45,
      lastStudied: '5 days ago',
      difficulty: 'advanced',
      color: '#f59e0b'
    },
    {
      id: '5',
      name: 'Art History',
      cardCount: 67,
      category: 'Arts',
      gradient: 'from-purple-400 via-pink-500 to-rose-500',
      icon: PaintBrushIcon,
      progress: 33,
      lastStudied: '1 week ago',
      difficulty: 'beginner',
      color: '#8b5cf6'
    },
    {
      id: '6',
      name: 'Music Theory',
      cardCount: 94,
      category: 'Arts',
      gradient: 'from-indigo-400 via-purple-500 to-pink-500',
      icon: MusicalNoteIcon,
      progress: 87,
      lastStudied: '4 hours ago',
      difficulty: 'intermediate',
      color: '#6366f1'
    }
  ];

  const handleDeckClick = (deckId: string) => {
    setClickedDeck(deckId);
    setTimeout(() => setClickedDeck(null), 200);
    onDeckClick?.(deckId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-green-600';
    if (progress >= 60) return 'from-blue-400 to-blue-600';
    if (progress >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  return (
    <div className="study-deck-tiles-container">
      <div className="deck-tiles-header">
        <div className="header-content">
          <div className="header-icon">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="deck-tiles-title">Your Study Decks</h2>
            <p className="deck-tiles-subtitle">Choose a deck to start studying</p>
          </div>
        </div>
        <button
          onClick={onCreateDeck}
          className="create-deck-btn"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Create New Deck</span>
        </button>
      </div>

      <div className="deck-tiles-grid">
        {sampleDecks.map((deck, index) => (
          <div
            key={deck.id}
            className={`deck-tile ${hoveredDeck === deck.id ? 'hovered' : ''} ${
              clickedDeck === deck.id ? 'clicked' : ''
            }`}
            onMouseEnter={() => setHoveredDeck(deck.id)}
            onMouseLeave={() => setHoveredDeck(null)}
            onClick={() => handleDeckClick(deck.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`deck-tile-inner bg-gradient-to-br ${deck.gradient}`}>
              {/* Animated Background Pattern */}
              <div className="deck-tile-pattern">
                <div className="pattern-circle pattern-1"></div>
                <div className="pattern-circle pattern-2"></div>
                <div className="pattern-circle pattern-3"></div>
              </div>

              {/* Content */}
              <div className="deck-tile-content">
                {/* Header */}
                <div className="deck-tile-header">
                  <div className="deck-icon-container">
                    <deck.icon className="deck-icon" />
                  </div>
                  <div className={`difficulty-badge ${getDifficultyColor(deck.difficulty)}`}>
                    {deck.difficulty}
                  </div>
                </div>

                {/* Main Content */}
                <div className="deck-main-content">
                  <h3 className="deck-name">{deck.name}</h3>
                  <div className="deck-stats">
                    <div className="card-count">
                      <span className="count-number">{deck.cardCount}</span>
                      <span className="count-label">cards</span>
                    </div>
                    <div className="category-tag">
                      {deck.category}
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="deck-progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percentage">{deck.progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(deck.progress)}`}
                        style={{ width: `${deck.progress}%` }}
                      >
                        <div className="progress-shine"></div>
                      </div>
                    </div>
                  </div>
                  <div className="last-studied">
                    Last studied: {deck.lastStudied}
                  </div>
                </div>

                {/* Action Button */}
                <div className="deck-action">
                  <button className="study-btn">
                    <PlayIcon className="w-4 h-4" />
                    <span>Study Now</span>
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="deck-glow-effect"></div>
            </div>
          </div>
        ))}

        {/* Add New Deck Tile */}
        <div 
          className="deck-tile add-deck-tile"
          onClick={onCreateDeck}
          style={{ animationDelay: `${sampleDecks.length * 0.1}s` }}
        >
          <div className="add-deck-inner">
            <div className="add-deck-content">
              <div className="add-deck-icon">
                <SparklesIcon className="w-12 h-12" />
              </div>
              <h3 className="add-deck-title">Create New Deck</h3>
              <p className="add-deck-description">Start building your next study collection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};