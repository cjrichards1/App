import React from 'react';
import { StudyDeckTiles } from './StudyDeckTiles';
import { SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export const StudyDeckDemo: React.FC = () => {
  const handleDeckClick = (deckId: string) => {
    console.log(`Clicked deck: ${deckId}`);
    // In a real app, this would navigate to the study session
  };

  const handleCreateDeck = () => {
    console.log('Create new deck clicked');
    // In a real app, this would open the deck creation form
  };

  return (
    <div className="study-deck-demo min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Demo Header */}
      <div className="demo-header-section">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <AcademicCapIcon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interactive Study Deck Tiles
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform boring study lists into engaging, interactive tiles with vibrant gradients and smooth animations
            </p>
            
            {/* Features List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Vibrant Gradients</h3>
                <p className="text-gray-600 text-sm">Each deck has unique gradient backgrounds</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Smooth Animations</h3>
                <p className="text-gray-600 text-sm">Hover effects with scale and glow</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">Visual progress bars with animations</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Responsive Design</h3>
                <p className="text-gray-600 text-sm">Perfect on all screen sizes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Deck Tiles */}
      <StudyDeckTiles 
        onDeckClick={handleDeckClick}
        onCreateDeck={handleCreateDeck}
      />

      {/* Code Example */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Usage Example
          </h3>
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`<StudyDeckTiles 
  onDeckClick={(deckId) => navigateToStudy(deckId)}
  onCreateDeck={() => openCreateForm()}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};