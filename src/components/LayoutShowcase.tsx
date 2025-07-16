import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  SwatchIcon,
  CubeIcon,
  BoltIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TabletIcon
} from '@heroicons/react/24/outline';

export const LayoutShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('backgrounds');
  const [currentTheme, setCurrentTheme] = useState('theme-focus');
  const [viewportSize, setViewportSize] = useState('desktop');

  const demoSections = [
    { id: 'backgrounds', label: 'Animated Backgrounds', icon: SwatchIcon },
    { id: 'layouts', label: 'Grid Layouts', icon: CubeIcon },
    { id: 'animations', label: 'Floating Elements', icon: BoltIcon },
    { id: 'themes', label: 'Dynamic Themes', icon: EyeIcon },
    { id: 'responsive', label: 'Responsive Design', icon: DevicePhoneMobileIcon },
  ];

  const themes = [
    { id: 'theme-focus', name: 'Focus Blue', color: '#3B82F6' },
    { id: 'theme-success', name: 'Success Green', color: '#10B981' },
    { id: 'theme-creative', name: 'Creative Purple', color: '#8B5CF6' },
    { id: 'theme-energy', name: 'Energy Orange', color: '#F59E0B' },
  ];

  const sampleCards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Sample Card ${i + 1}`,
    content: `This is sample content for card ${i + 1}. It demonstrates the layout system.`,
    type: ['text', 'math', 'image'][i % 3],
  }));

  return (
    <div className={`layout-showcase min-h-screen theme-transition ${currentTheme} bg-gradient-mesh relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="bg-floating-shapes absolute inset-0" />
      
      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 section-fade-enter-active">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 glass-card rounded-2xl float-gentle">
                <SparklesIcon className="w-12 h-12 theme-adaptive-text pulse-glow" />
              </div>
              <h1 className="text-5xl font-bold theme-adaptive-text">
                Dynamic Layout System
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience engaging backgrounds, smooth transitions, and responsive design
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {demoSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 interactive-hover ${
                  activeDemo === section.id
                    ? 'theme-adaptive text-white shadow-lg'
                    : 'glass-card text-gray-700 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="section-fade-enter-active">
            {/* Animated Backgrounds Demo */}
            {activeDemo === 'backgrounds' && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Background Patterns</h2>
                
                <div className="dynamic-grid">
                  <div className="dynamic-grid-item bg-gradient-mesh p-8 min-h-48">
                    <h3 className="text-xl font-bold mb-4">Gradient Mesh</h3>
                    <p className="text-gray-600">Animated gradient background with smooth color transitions</p>
                  </div>
                  
                  <div className="dynamic-grid-item bg-floating-shapes p-8 min-h-48 relative">
                    <h3 className="text-xl font-bold mb-4">Floating Shapes</h3>
                    <p className="text-gray-600">Geometric shapes that float and rotate in the background</p>
                  </div>
                  
                  <div className="dynamic-grid-item bg-waves p-8 min-h-48">
                    <h3 className="text-xl font-bold mb-4">Wave Pattern</h3>
                    <p className="text-gray-600">Subtle wave patterns that move across the background</p>
                  </div>
                  
                  <div className="dynamic-grid-item bg-particles p-8 min-h-48 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-4">Particle System</h3>
                    <p className="text-gray-600">Floating particles that create depth and movement</p>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="particle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 8}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid Layouts Demo */}
            {activeDemo === 'layouts' && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Grid Layout Systems</h2>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-6">Dynamic Grid</h3>
                  <div className="dynamic-grid">
                    {sampleCards.slice(0, 6).map((card, index) => (
                      <div key={card.id} className="dynamic-grid-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <h4 className="text-lg font-bold mb-3">{card.title}</h4>
                        <p className="text-gray-600 mb-4">{card.content}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            card.type === 'text' ? 'bg-blue-100 text-blue-800' :
                            card.type === 'math' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {card.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">Masonry Layout</h3>
                  <div className="masonry-grid">
                    {sampleCards.map((card, index) => (
                      <div key={card.id} className="masonry-item" style={{ animationDelay: `${index * 0.05}s` }}>
                        <h4 className="text-lg font-bold mb-2">{card.title}</h4>
                        <p className="text-gray-600 text-sm">{card.content}</p>
                        {index % 3 === 0 && (
                          <div className="mt-3 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Animations Demo */}
            {activeDemo === 'animations' && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Floating Animations</h2>
                
                <div className="dynamic-grid">
                  <div className="dynamic-grid-item text-center">
                    <div className="float-gentle mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                        <SparklesIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Gentle Float</h3>
                    <p className="text-gray-600">Subtle floating animation for elegant elements</p>
                  </div>
                  
                  <div className="dynamic-grid-item text-center">
                    <div className="float-medium mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center pulse-soft">
                        <BoltIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Medium Float + Pulse</h3>
                    <p className="text-gray-600">Combined floating and pulsing effects</p>
                  </div>
                  
                  <div className="dynamic-grid-item text-center">
                    <div className="float-strong mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center rotate-slow">
                        <CubeIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Strong Float + Rotate</h3>
                    <p className="text-gray-600">Dynamic floating with rotation animation</p>
                  </div>
                  
                  <div className="dynamic-grid-item text-center">
                    <div className="pulse-glow mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center">
                        <EyeIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Glow Pulse</h3>
                    <p className="text-gray-600">Glowing effect that pulses with light</p>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Themes Demo */}
            {activeDemo === 'themes' && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Dynamic Color Themes</h2>
                
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-600 mb-6">Click a theme to see the entire layout adapt</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setCurrentTheme(theme.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-500 interactive-hover ${
                          currentTheme === theme.id
                            ? 'text-white shadow-lg scale-105'
                            : 'glass-card text-gray-700'
                        }`}
                        style={{
                          backgroundColor: currentTheme === theme.id ? theme.color : undefined
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.color }}
                        />
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dynamic-grid">
                  <div className="theme-adaptive p-8 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-3">Adaptive Background</h3>
                    <p>This element adapts its background to the current theme</p>
                  </div>
                  
                  <div className="dynamic-grid-item theme-adaptive-border">
                    <h3 className="text-xl font-bold mb-3 theme-adaptive-text">Adaptive Border</h3>
                    <p className="text-gray-600">Border and text color change with the theme</p>
                  </div>
                  
                  <div className="dynamic-grid-item">
                    <h3 className="text-xl font-bold mb-3">Theme Variables</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded theme-adaptive" />
                        <span>Primary Color</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--secondary-color)' }} />
                        <span>Secondary Color</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent-color)' }} />
                        <span>Accent Color</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Design Demo */}
            {activeDemo === 'responsive' && (
              <div className="space-y-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Responsive Design</h2>
                
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-600 mb-6">Simulate different viewport sizes</p>
                  <div className="flex justify-center gap-4">
                    {[
                      { id: 'mobile', icon: DevicePhoneMobileIcon, label: 'Mobile' },
                      { id: 'tablet', icon: TabletIcon, label: 'Tablet' },
                      { id: 'desktop', icon: ComputerDesktopIcon, label: 'Desktop' },
                    ].map((viewport) => (
                      <button
                        key={viewport.id}
                        onClick={() => setViewportSize(viewport.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                          viewportSize === viewport.id
                            ? 'theme-adaptive text-white'
                            : 'glass-card text-gray-700'
                        }`}
                      >
                        <viewport.icon className="w-5 h-5" />
                        {viewport.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`mx-auto transition-all duration-500 ${
                  viewportSize === 'mobile' ? 'max-w-sm' :
                  viewportSize === 'tablet' ? 'max-w-2xl' :
                  'max-w-7xl'
                }`}>
                  <div className="dynamic-grid">
                    {sampleCards.slice(0, 6).map((card, index) => (
                      <div key={card.id} className="dynamic-grid-item">
                        <h4 className="text-lg font-bold mb-3">{card.title}</h4>
                        <p className="text-gray-600">{card.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Responsive Features</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Mobile:</strong> Single column, larger touch targets
                    </div>
                    <div>
                      <strong>Tablet:</strong> Two columns, optimized spacing
                    </div>
                    <div>
                      <strong>Desktop:</strong> Multi-column, hover effects
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};