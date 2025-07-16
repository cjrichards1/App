import React, { useState } from 'react';
import { 
  PlusIcon, 
  HeartIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookmarkIcon,
  ShareIcon,
  DownloadIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

export const ButtonShowcase: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleLoading = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: !prev[buttonId] }));
    
    // Auto-reset loading state after 3 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 3000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="button-showcase">
      {/* Header */}
      <div className="showcase-header">
        <div className="showcase-title">
          <SparklesIcon className="title-icon" />
          <h1>Modern Button Components</h1>
        </div>
        
        <button 
          className="btn btn-outline btn-md"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      {/* Button Variants Section */}
      <section className="showcase-section">
        <h2>Button Variants</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Primary Buttons</h3>
            <div className="button-row">
              <button className="btn btn-primary btn-sm">
                <PlusIcon className="w-4 h-4" />
                Small
              </button>
              <button className="btn btn-primary btn-md">
                <CheckIcon className="w-4 h-4" />
                Medium
              </button>
              <button className="btn btn-primary btn-lg">
                <ArrowRightIcon className="w-5 h-5" />
                Large
              </button>
              <button className="btn btn-primary btn-xl">
                <SparklesIcon className="w-6 h-6" />
                Extra Large
              </button>
            </div>
          </div>

          <div className="button-demo">
            <h3>Secondary Buttons</h3>
            <div className="button-row">
              <button className="btn btn-secondary btn-sm">
                <HeartIcon className="w-4 h-4" />
                Small
              </button>
              <button className="btn btn-secondary btn-md">
                <BookmarkIcon className="w-4 h-4" />
                Medium
              </button>
              <button className="btn btn-secondary btn-lg">
                <ShareIcon className="w-5 h-5" />
                Large
              </button>
              <button className="btn btn-secondary btn-xl">
                <DownloadIcon className="w-6 h-6" />
                Extra Large
              </button>
            </div>
          </div>

          <div className="button-demo">
            <h3>Success & Error</h3>
            <div className="button-row">
              <button className="btn btn-success btn-md">
                <CheckIcon className="w-4 h-4" />
                Success
              </button>
              <button className="btn btn-error btn-md">
                <XMarkIcon className="w-4 h-4" />
                Error
              </button>
              <button className="btn btn-success btn-md" disabled>
                <CheckIcon className="w-4 h-4" />
                Disabled
              </button>
              <button className="btn btn-error btn-md" disabled>
                <TrashIcon className="w-4 h-4" />
                Disabled
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Outline Buttons Section */}
      <section className="showcase-section">
        <h2>Outline Buttons</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Outline Variants</h3>
            <div className="button-row">
              <button className="btn btn-outline btn-md">
                <PlusIcon className="w-4 h-4" />
                Primary
              </button>
              <button className="btn btn-outline btn-outline-secondary btn-md">
                <HeartIcon className="w-4 h-4" />
                Secondary
              </button>
              <button className="btn btn-outline btn-outline-success btn-md">
                <CheckIcon className="w-4 h-4" />
                Success
              </button>
              <button className="btn btn-outline btn-outline-error btn-md">
                <TrashIcon className="w-4 h-4" />
                Error
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ghost & Text Buttons Section */}
      <section className="showcase-section">
        <h2>Ghost & Text Buttons</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Ghost Buttons</h3>
            <div className="button-row">
              <button className="btn btn-ghost btn-md">
                <BookmarkIcon className="w-4 h-4" />
                Ghost
              </button>
              <button className="btn btn-ghost btn-md">
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
              <button className="btn btn-ghost btn-md" disabled>
                <DownloadIcon className="w-4 h-4" />
                Disabled
              </button>
            </div>
          </div>

          <div className="button-demo">
            <h3>Text Buttons</h3>
            <div className="button-row">
              <button className="btn btn-text">Learn More</button>
              <button className="btn btn-text">Cancel</button>
              <button className="btn btn-text" disabled>Disabled</button>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Buttons Section */}
      <section className="showcase-section">
        <h2>Icon Buttons</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Icon Button Sizes</h3>
            <div className="button-row">
              <button className="btn btn-primary btn-icon btn-icon-sm">
                <PlusIcon className="w-4 h-4" />
              </button>
              <button className="btn btn-primary btn-icon">
                <HeartIcon className="w-5 h-5" />
              </button>
              <button className="btn btn-primary btn-icon btn-icon-lg">
                <SparklesIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="button-demo">
            <h3>Media Controls</h3>
            <div className="button-row">
              <button className="btn btn-success btn-icon">
                <PlayIcon className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary btn-icon">
                <PauseIcon className="w-5 h-5" />
              </button>
              <button className="btn btn-error btn-icon">
                <StopIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive States Section */}
      <section className="showcase-section">
        <h2>Interactive States</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Loading States</h3>
            <div className="button-row">
              <button 
                className={`btn btn-primary btn-md ${loadingStates.primary ? 'btn-loading' : ''}`}
                onClick={() => toggleLoading('primary')}
              >
                {!loadingStates.primary && <CheckIcon className="w-4 h-4" />}
                Primary Loading
              </button>
              <button 
                className={`btn btn-outline btn-md ${loadingStates.outline ? 'btn-loading' : ''}`}
                onClick={() => toggleLoading('outline')}
              >
                {!loadingStates.outline && <DownloadIcon className="w-4 h-4" />}
                Outline Loading
              </button>
              <button 
                className={`btn btn-ghost btn-md ${loadingStates.ghost ? 'btn-loading' : ''}`}
                onClick={() => toggleLoading('ghost')}
              >
                {!loadingStates.ghost && <ShareIcon className="w-4 h-4" />}
                Ghost Loading
              </button>
            </div>
          </div>

          <div className="button-demo">
            <h3>Special Effects</h3>
            <div className="button-row">
              <button className="btn btn-primary btn-md btn-pulse">
                <SparklesIcon className="w-4 h-4" />
                Pulse Effect
              </button>
              <button className="btn btn-secondary btn-md">
                <ArrowRightIcon className="w-4 h-4" />
                Hover Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Button Groups Section */}
      <section className="showcase-section">
        <h2>Button Groups</h2>
        <div className="button-grid">
          <div className="button-demo">
            <h3>Grouped Actions</h3>
            <div className="button-row">
              <div className="btn-group">
                <button className="btn btn-outline">
                  <PlayIcon className="w-4 h-4" />
                  Play
                </button>
                <button className="btn btn-outline">
                  <PauseIcon className="w-4 h-4" />
                  Pause
                </button>
                <button className="btn btn-outline">
                  <StopIcon className="w-4 h-4" />
                  Stop
                </button>
              </div>
            </div>
          </div>

          <div className="button-demo">
            <h3>Toggle Group</h3>
            <div className="button-row">
              <div className="btn-group">
                <button className="btn btn-primary">Active</button>
                <button className="btn btn-outline">Inactive</button>
                <button className="btn btn-outline">Inactive</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <button className="btn-fab">
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};