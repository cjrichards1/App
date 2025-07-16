import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  HeartIcon,
  StarIcon,
  BoltIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export const AnimationDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('cards');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress bar animation
  useEffect(() => {
    if (activeDemo === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 1000);
  };

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const resetProgress = () => {
    setProgress(0);
  };

  const demoSections = [
    { id: 'cards', label: 'Card Animations', icon: SparklesIcon },
    { id: 'buttons', label: 'Button Effects', icon: PlayIcon },
    { id: 'feedback', label: 'Feedback Animations', icon: CheckCircleIcon },
    { id: 'loading', label: 'Loading States', icon: ArrowPathIcon },
    { id: 'transitions', label: 'State Transitions', icon: BoltIcon },
  ];

  return (
    <div className="animation-demo min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-float">
              <RocketLaunchIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Animation Showcase
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore engaging animations and micro-interactions that bring your flashcard app to life
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {demoSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveDemo(section.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 animate-slide-in-left delay-${index * 100} ${
                activeDemo === section.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:scale-105'
              }`}
            >
              <section.icon className="w-5 h-5" />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto">
        {/* Card Animations */}
        {activeDemo === 'cards' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Card Flip Animations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Basic Flip Card */}
              <div className="flip-card-container">
                <div 
                  className={`flip-card ${isFlipped ? 'flipped' : ''} cursor-pointer`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className="flip-card-face flip-card-front bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <SparklesIcon className="w-12 h-12 mx-auto mb-4 animate-sparkle" />
                      <h3 className="text-xl font-bold mb-2">Click to Flip!</h3>
                      <p className="text-blue-100">Basic flip animation</p>
                    </div>
                  </div>
                  <div className="flip-card-face flip-card-back bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <CheckCircleIcon className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Flipped!</h3>
                      <p className="text-purple-100">Smooth 3D transition</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Hover Card */}
              <div className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Hover Effect</h3>
                  <p className="text-gray-600">Lift and scale on hover</p>
                </div>
              </div>

              {/* Bounce In Card */}
              <div className="animate-bounce-in bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Bounce In</h3>
                  <p className="text-gray-600">Elastic entrance animation</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Button Effects */}
        {activeDemo === 'buttons' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Button Hover Effects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Lift Effect</h3>
                <button className="btn-hover-lift w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Hover Me
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Scale Effect</h3>
                <button className="interactive-scale w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Scale on Hover
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Glow Effect</h3>
                <button className="animate-glow w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Glowing Button
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Ripple Effect</h3>
                <button className="ripple w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Click for Ripple
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Shimmer Effect</h3>
                <button className="shimmer w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Shimmer Button
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Gradient Animation</h3>
                <button className="gradient-animate w-full text-white px-6 py-3 rounded-xl font-semibold">
                  Animated Gradient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Animations */}
        {activeDemo === 'feedback' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Feedback Animations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Success Feedback</h3>
                <div className="space-y-4">
                  <button
                    onClick={triggerSuccess}
                    className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all ${
                      showSuccess ? 'animate-success' : ''
                    }`}
                  >
                    {showSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 animate-success-checkmark" />
                        Success!
                      </span>
                    ) : (
                      'Trigger Success'
                    )}
                  </button>
                  <div className="text-sm text-gray-600">
                    Click to see success pulse animation
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Error Feedback</h3>
                <div className="space-y-4">
                  <button
                    onClick={triggerError}
                    className={`w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all ${
                      showError ? 'animate-error' : ''
                    }`}
                  >
                    {showError ? (
                      <span className="flex items-center justify-center gap-2">
                        <XCircleIcon className="w-5 h-5" />
                        Error!
                      </span>
                    ) : (
                      'Trigger Error'
                    )}
                  </button>
                  <div className="text-sm text-gray-600">
                    Click to see error shake animation
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading States */}
        {activeDemo === 'loading' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Loading Animations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Spinner</h3>
                <div className="flex justify-center mb-4">
                  <div className="loading-spinner"></div>
                </div>
                <button
                  onClick={triggerLoading}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="loading-spinner"></div>
                      Loading...
                    </span>
                  ) : (
                    'Start Loading'
                  )}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Loading Dots</h3>
                <div className="flex justify-center mb-4">
                  <div className="loading-dots text-blue-500">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="text-center text-gray-600">
                  Animated loading dots
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Progress Bar</h3>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="progress-animated h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {progress}% Complete
                  </div>
                </div>
                <button
                  onClick={resetProgress}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State Transitions */}
        {activeDemo === 'transitions' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">State Transitions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Page Transitions</h3>
                <div className="space-y-4">
                  <div className="page-transition-enter-active bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                    <p className="text-gray-700">This content slides in smoothly</p>
                  </div>
                  <div className="animate-slide-in-left bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                    <p className="text-gray-700">Left slide animation</p>
                  </div>
                  <div className="animate-slide-in-right bg-gradient-to-r from-pink-100 to-yellow-100 p-4 rounded-lg">
                    <p className="text-gray-700">Right slide animation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Staggered Animations</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item, index) => (
                    <div
                      key={item}
                      className={`animate-fade-in delay-${index * 100} bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-lg`}
                    >
                      <p className="text-gray-700">Item {item} - Delayed animation</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            CSS Animation Examples
          </h3>
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`/* Card Flip Animation */
.flip-card {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card.flipped {
  transform: rotateY(180deg);
}

/* Button Hover Effect */
.btn-hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-hover-lift:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Success Animation */
@keyframes success-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};