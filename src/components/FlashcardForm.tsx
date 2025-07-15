import React, { useState } from 'react';
import { PlusIcon, CommandLineIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FlashcardFormProps {
  onAdd: (flashcard: {
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isLatex: boolean;
  }) => void;
}

const categories = [
  { value: 'general', label: 'General' },
  { value: 'language', label: 'Language' },
  { value: 'science', label: 'Science' },
  { value: 'math', label: 'Mathematics' },
  { value: 'history', label: 'History' },
];

const LaTeXPreview: React.FC<{ content: string; isBlock?: boolean }> = ({ content, isBlock = false }) => {
  try {
    if (isBlock) {
      return <BlockMath math={content} />;
    }
    return <InlineMath math={content} />;
  } catch (error) {
    return <span className="text-red-500 text-sm">Invalid LaTeX syntax</span>;
  }
};

export const FlashcardForm: React.FC<FlashcardFormProps> = ({ onAdd }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLatex, setIsLatex] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onAdd({
        front: front.trim(),
        back: back.trim(),
        category,
        difficulty,
        isLatex,
      });
      setFront('');
      setBack('');
    }
  };

  const latexExamples = [
    { 
      category: 'Basic Operations',
      examples: [
        { label: 'Fraction', code: '\\frac{a}{b}', preview: 'a/b' },
        { label: 'Square root', code: '\\sqrt{x}', preview: '√x' },
        { label: 'Power', code: 'x^{2}', preview: 'x²' },
        { label: 'Subscript', code: 'x_{1}', preview: 'x₁' },
      ]
    },
    {
      category: 'Calculus',
      examples: [
        { label: 'Derivative', code: '\\frac{d}{dx}f(x)', preview: 'd/dx f(x)' },
        { label: 'Integral', code: '\\int f(x) dx', preview: '∫ f(x) dx' },
        { label: 'Limit', code: '\\lim_{x \\to a} f(x)', preview: 'lim(x→a) f(x)' },
      ]
    },
    {
      category: 'Greek Letters',
      examples: [
        { label: 'Common', code: '\\alpha, \\beta, \\gamma', preview: 'α, β, γ' },
        { label: 'Pi & others', code: '\\pi, \\phi, \\omega', preview: 'π, φ, ω' },
      ]
    }
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="rounded-xl shadow-md p-8 border-gradient bg-white">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
              <PlusIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#1F2937' }}>Create New Flashcard</h2>
              <p style={{ color: '#6B7280' }}>Build your knowledge, one card at a time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsLatex(!isLatex)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 focus-ring ${
                isLatex 
                  ? 'text-white'
                  : ''
              }`}
              style={isLatex 
                ? { background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', borderColor: '#F43F5E', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)' }
                : { backgroundColor: '#F3F4F6', color: '#1F2937', borderColor: '#E5E7EB' }
              }
              aria-label={`Switch to ${isLatex ? 'text' : 'LaTeX'} mode`}
            >
              {isLatex ? <CommandLineIcon className="w-4 h-4" /> : <DocumentTextIcon className="w-4 h-4" />}
              {isLatex ? 'LaTeX Mode' : 'Text Mode'}
            </button>
            
            {isLatex && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 focus-ring"
                style={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  color: '#3B82F6', 
                  borderColor: 'rgba(59, 130, 246, 0.2)' 
                }}
                aria-label={`${showPreview ? 'Hide' : 'Show'} LaTeX preview`}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
          </div>
        </div>

        {isLatex && (
          <div className="mb-10 p-6 rounded-xl border-2 animate-slide-in" 
               style={{ 
                 borderColor: 'rgba(244, 63, 94, 0.2)', 
                 background: 'linear-gradient(to right, rgba(244, 63, 94, 0.05), rgba(244, 63, 94, 0.1))' 
               }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6" style={{ color: '#F43F5E' }} />
                <h3 className="text-xl font-bold" style={{ color: '#1F2937' }}>LaTeX Quick Reference</h3>
              </div>
              <div className="text-sm px-3 py-1 rounded-lg font-medium" 
                   style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E' }}>
                Click any example to copy
              </div>
            </div>
            
            <div className="mb-6 p-4 rounded-lg border" 
                 style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
              <h4 className="text-base font-semibold mb-3" style={{ color: '#1F2937' }}>💡 LaTeX Tips:</h4>
              <ul className="text-sm space-y-1" style={{ color: '#374151' }}>
                <li>• Use curly braces {} to group expressions: x^{2+3} not x^2+3</li>
                <li>• For multi-character subscripts/superscripts: x_{max} not x_max</li>
                <li>• Preview your LaTeX before saving to catch syntax errors</li>
              </ul>
            </div>

            <div className="space-y-6">
              {latexExamples.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-base font-bold mb-3 pb-2 border-b" 
                      style={{ color: '#1F2937', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all duration-200 focus-ring bg-white"
                        style={{ borderColor: 'rgba(244, 63, 94, 0.2)' }}
                        onClick={() => {
                          navigator.clipboard.writeText(example.code);
                        }}
                        title="Click to copy"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigator.clipboard.writeText(example.code);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-semibold" style={{ color: '#F43F5E' }}>{example.label}</span>
                          <span className="text-sm" style={{ color: '#6B7280' }}>{example.preview}</span>
                        </div>
                        <code className="text-sm px-2 py-1 rounded block overflow-x-auto font-mono" 
                              style={{ backgroundColor: 'rgba(244, 63, 94, 0.05)', color: '#F43F5E' }}>
                          {example.code}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-semibold mb-3" style={{ color: '#1F2937' }}>
                Front (Question)
              </label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder={isLatex ? "Enter LaTeX: \\frac{d}{dx}[x^2] = ?" : "Enter your question..."}
                className="input-enhanced w-full p-4 rounded-lg resize-none focus-ring"
                rows={6}
                required
                aria-label="Flashcard front content"
              />
              {isLatex && showPreview && front && (
                <div className="mt-4 p-4 rounded-lg border" 
                     style={{ 
                       background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))', 
                       borderColor: 'rgba(59, 130, 246, 0.2)' 
                     }}>
                  <div className="text-sm font-medium mb-2" style={{ color: '#374151' }}>Preview:</div>
                  <div className="card-content text-lg">
                    <LaTeXPreview content={front} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold mb-3" style={{ color: '#1F2937' }}>
                Back (Answer)
              </label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder={isLatex ? "Enter LaTeX: 2x" : "Enter your answer..."}
                className="input-enhanced w-full p-4 rounded-lg resize-none focus-ring"
                rows={6}
                required
                aria-label="Flashcard back content"
              />
              {isLatex && showPreview && back && (
                <div className="mt-4 p-4 rounded-lg border" 
                     style={{ 
                       background: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))', 
                       borderColor: 'rgba(16, 185, 129, 0.2)' 
                     }}>
                  <div className="text-sm font-medium mb-2" style={{ color: '#374151' }}>Preview:</div>
                  <div className="card-content text-lg">
                    <LaTeXPreview content={back} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-semibold mb-3" style={{ color: '#1F2937' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-enhanced w-full p-4 rounded-lg focus-ring"
                aria-label="Select flashcard category"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold mb-3" style={{ color: '#1F2937' }}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="input-enhanced w-full p-4 rounded-lg focus-ring"
                aria-label="Select flashcard difficulty"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-lg text-base font-semibold flex items-center justify-center gap-3 focus-ring transition-all duration-300 btn-primary"
            aria-label="Create flashcard"
          >
            <PlusIcon className="w-5 h-5" />
            Create Flashcard
          </button>
        </form>
      </div>
    </div>
  );
};