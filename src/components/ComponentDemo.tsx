import React, { useState } from 'react';
import {
  ArrowPathIcon as TreeIcon,
  ArrowUpIcon as LeafIcon
} from '@heroicons/react/24/outline';
import { ModernFlashcard } from './ModernFlashcard';
import { ForestButton } from './ForestButton';
import { ForestCheckbox } from './ForestCheckbox';
import { Flashcard } from '../types/flashcard';

export const ComponentDemo: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const demoCard: Flashcard = {
    id: 'demo-1',
    front: "What is the process of photosynthesis?",
    back: "Photosynthesis is the process by which plants convert light energy into chemical energy to produce glucose from carbon dioxide and water.",
    difficulty: "medium",
    category: "Biology",
    isLatex: false,
    createdAt: new Date().toISOString(),
    correctCount: 0,
    incorrectCount: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-earth-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            Forest-Themed Components
          </h1>
          <p className="text-earth-700 text-lg">
            A nature-inspired design system for a calming study experience
          </p>
        </div>

        {/* Flashcard Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">
            Flashcards
          </h2>
          <div className="flex justify-center">
            <ModernFlashcard
              card={demoCard}
              onFlip={() => console.log('Card flipped')}
            />
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">
            Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ForestButton
              variant="primary"
              icon={<TreeIcon className="w-5 h-5" />}
            >
              Forest Primary
            </ForestButton>
            <ForestButton
              variant="secondary"
              icon={<LeafIcon className="w-5 h-5" />}
            >
              Earth Secondary
            </ForestButton>
            <ForestButton
              variant="moss"
              size="lg"
            >
              Moss Button
            </ForestButton>
            <ForestButton
              variant="earth"
              size="sm"
            >
              Earth Button
            </ForestButton>
          </div>
        </section>

        {/* Checkboxes Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">
            Checkboxes
          </h2>
          <div className="space-y-4">
            <ForestCheckbox
              checked={isChecked}
              onChange={setIsChecked}
              label="Enable notifications"
            />
            <ForestCheckbox
              checked={true}
              onChange={() => {}}
              label="Always checked"
              disabled
            />
          </div>
        </section>

        {/* Natural Patterns */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">
            Natural Patterns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 rounded-lg texture-paper bg-white shadow-natural" />
            <div className="h-32 rounded-lg texture-bark bg-earth-100 shadow-natural" />
            <div className="h-32 rounded-lg texture-leaves bg-primary-100 shadow-natural" />
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700 mb-6">
            Natural Animations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full animate-float" />
            </div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-earth-500 rounded-full animate-sway" />
            </div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent-moss rounded-full animate-breathe" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Add demo-specific styles
const styles = `
.demo-section {
  border: 1px solid var(--earth-200);
  border-radius: 1rem;
  padding: 2rem;
  background: var(--bg-elevated);
}

.demo-title {
  color: var(--primary-700);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.demo-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 