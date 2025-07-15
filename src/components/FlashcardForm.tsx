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
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
  { value: 'language', label: 'Language', color: 'bg-blue-100 text-blue-800' },
  { value: 'science', label: 'Science', color: 'bg-green-100 text-green-800' },
  { value: 'math', label: 'Mathematics', color: 'bg-purple-100 text-purple-800' },
  { value: 'history', label: 'History', color: 'bg-yellow-100 text-yellow-800' },
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
      <div className="bg-white rounded-xl shadow-md p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <PlusIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Create New Flashcard</h2>
              <p className="text-gray-600">Build your knowledge, one card at a time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsLatex(!isLatex)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 btn-scale border-2 focus-ring ${
                isLatex 
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-500 shadow-lg' 
                  : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
              }`}
              aria-label={`Switch to ${isLatex ? 'text' : 'LaTeX'} mode`}
            >
              {isLatex ? <CommandLineIcon className="w-4 h-4" /> : <DocumentTextIcon className="w-4 h-4" />}
              {isLatex ? 'LaTeX Mode' : 'Text Mode'}
            </button>
            
            {isLatex && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all duration-300 border border-blue-200 focus-ring"
                aria-label={`${showPreview ? 'Hide' : 'Show'} LaTeX preview`}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
          </div>
        </div>

        {isLatex && (
          <div className="mb-10 p-6 rounded-xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-rose-600" />
                <h3 className="text-xl font-bold text-slate-800">LaTeX Quick Reference</h3>
              </div>
              <div className="text-sm px-3 py-1 rounded-lg font-medium bg-rose-100 text-rose-700">
                Click any example to copy
              </div>
            </div>
            
            <div className="mb-6 p-4 rounded-lg bg-rose-100 border border-rose-200">
              <h4 className="text-base font-semibold mb-3 text-slate-800">💡 LaTeX Tips:</h4>
              <ul className="text-sm space-y-1 text-slate-700">
                <li>• Use curly braces {} to group expressions: x^{2+3} not x^2+3</li>
                <li>• For multi-character subscripts/superscripts: x_{max} not x_max</li>
                <li>• Preview your LaTeX before saving to catch syntax errors</li>
              </ul>
            </div>

            <div className="space-y-6">
              {latexExamples.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-base font-bold mb-3 pb-2 border-b border-rose-300 text-slate-800">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-3 rounded-lg border border-rose-200 cursor-pointer hover:border-rose-300 hover:shadow-sm transition-all duration-200 focus-ring"
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
                          <span className="text-sm font-semibold text-rose-600">{example.label}</span>
                          <span className="text-sm text-gray-600">{example.preview}</span>
                        </div>
                        <code className="text-sm px-2 py-1 rounded bg-rose-50 text-rose-600 block overflow-x-auto font-mono">
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
              <label className="block text-base font-semibold mb-3 text-slate-800">
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
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <div className="text-sm font-medium mb-2 text-slate-700">Preview:</div>
                  <div className="card-content text-lg">
                    <LaTeXPreview content={front} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold mb-3 text-slate-800">
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
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <div className="text-sm font-medium mb-2 text-slate-700">Preview:</div>
                  <div className="card-content text-lg">
                    <LaTeXPreview content={back} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-semibold mb-3 text-slate-800">
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
              <label className="block text-base font-semibold mb-3 text-slate-800">
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
            className="btn-primary w-full py-4 px-6 text-white rounded-lg text-base font-semibold flex items-center justify-center gap-3 focus-ring"
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