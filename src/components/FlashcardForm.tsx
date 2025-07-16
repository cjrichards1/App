import React, { useState } from 'react';
import { PlusIcon, CommandLineIcon, DocumentTextIcon, SparklesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { InlineMath, BlockMath } from 'react-katex';
import { Folder } from '../types/flashcard';
import 'katex/dist/katex.min.css';

interface FlashcardFormProps {
  folders: Folder[];
  categories: string[];
  onBack: () => void;
  onAdd: (flashcard: {
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isLatex: boolean;
    folderId?: string;
  }) => void;
}


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

export const FlashcardForm: React.FC<FlashcardFormProps> = ({ folders, categories, onBack, onAdd }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLatex, setIsLatex] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onAdd({
        front: front.trim(),
        back: back.trim(),
        category,
        difficulty,
        isLatex,
        folderId: selectedFolder || undefined,
      });
      setFront('');
      setBack('');
      setSelectedFolder('');
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
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-white shadow-lg hover:shadow-xl text-flashvibe-slate border border-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

      <div className="rounded-2xl shadow-xl p-10 bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-flashvibe-blue to-blue-600 shadow-lg">
              <PlusIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-flashvibe-slate">Create New Flashcard</h2>
              <p className="text-lg text-gray-600 font-medium">Build your knowledge, one card at a time ✨</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsLatex(!isLatex)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                isLatex 
                  ? 'text-white'
                  : ''
              }`}
              style={isLatex 
                ? { background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' }
                : { backgroundColor: '#F3F4F6', color: '#1F2937' }
              }
            >
              {isLatex ? <CommandLineIcon className="w-5 h-5" /> : <DocumentTextIcon className="w-5 h-5" />}
              {isLatex ? 'LaTeX Mode' : 'Text Mode'}
            </button>
            
            {isLatex && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-4 rounded-xl font-semibold transition-all duration-300 bg-blue-50 text-flashvibe-blue hover:bg-blue-100 shadow-lg hover:shadow-xl"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
          </div>
        </div>

        {isLatex && (
          <div className="mb-12 p-8 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100 animate-slide-in shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-flashvibe-coral to-rose-600 rounded-xl shadow-lg">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-flashvibe-slate">LaTeX Quick Reference</h3>
              </div>
              <div className="text-sm px-4 py-2 rounded-lg font-bold bg-rose-100 text-flashvibe-coral">
                Click any example to copy
              </div>
            </div>
            
            <div className="mb-8 p-6 rounded-xl bg-rose-100 border border-rose-200 shadow-sm">
              <h4 className="text-lg font-bold mb-4 text-flashvibe-slate">💡 LaTeX Tips:</h4>
              <ul className="text-sm space-y-2 text-gray-700 font-medium">
                <li>• Use curly braces {} to group expressions: x^{2+3} not x^2+3</li>
                <li>• For multi-character subscripts/superscripts: x_{'{max}'} not x_max</li>
                <li>• Preview your LaTeX before saving to catch syntax errors</li>
              </ul>
            </div>

            <div className="space-y-6">
              {latexExamples.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-lg font-bold mb-4 pb-3 border-b border-rose-300 text-flashvibe-slate">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-xl border border-rose-200 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white hover:bg-rose-50"
                        onClick={() => {
                          navigator.clipboard.writeText(example.code);
                        }}
                        title="Click to copy"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-flashvibe-coral">{example.label}</span>
                          <span className="text-sm text-gray-600 font-medium">{example.preview}</span>
                        </div>
                        <code className="text-sm px-3 py-2 rounded-lg block overflow-x-auto font-mono bg-rose-50 text-flashvibe-coral font-medium">
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

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-lg font-bold mb-4 text-flashvibe-slate">
                Front (Question)
              </label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder={isLatex ? "Enter LaTeX: \\frac{d}{dx}[x^2] = ?" : "Enter your question..."}
                className="w-full p-6 rounded-xl resize-none border-2 border-gray-200 focus:border-flashvibe-blue focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-mono text-lg shadow-sm"
                rows={8}
                required
              />
              {isLatex && showPreview && front && (
                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                  <div className="text-sm font-bold mb-3 text-gray-700">Preview:</div>
                  <div className="text-xl">
                    <LaTeXPreview content={front} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-lg font-bold mb-4 text-flashvibe-slate">
                Back (Answer)
              </label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder={isLatex ? "Enter LaTeX: 2x" : "Enter your answer..."}
                className="w-full p-6 rounded-xl resize-none border-2 border-gray-200 focus:border-flashvibe-green focus:ring-4 focus:ring-green-100 transition-all duration-300 font-mono text-lg shadow-sm"
                rows={8}
                required
              />
              {isLatex && showPreview && back && (
                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm">
                  <div className="text-sm font-bold mb-3 text-gray-700">Preview:</div>
                  <div className="text-xl">
                    <LaTeXPreview content={back} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-lg font-bold mb-4 text-flashvibe-slate">
                Folder (Optional)
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-flashvibe-coral focus:ring-4 focus:ring-rose-100 transition-all duration-300 text-lg shadow-sm font-semibold"
              >
                <option value="">No Folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    📁 {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold mb-4 text-flashvibe-slate">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg shadow-sm font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-10">
            <div>
              <label className="block text-lg font-bold mb-4 text-flashvibe-slate">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full p-6 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-lg shadow-sm font-semibold"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-6 px-8 rounded-xl text-xl font-bold flex items-center justify-center gap-4 transition-all duration-300 bg-gradient-to-r from-flashvibe-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-6 h-6" />
            Create Flashcard
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};