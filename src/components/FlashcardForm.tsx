import React, { useState } from 'react';
import { Plus, Type, Function } from 'lucide-react';
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
    { label: 'Fraction', code: '\\frac{a}{b}' },
    { label: 'Square root', code: '\\sqrt{x}' },
    { label: 'Integral', code: '\\int_{a}^{b} f(x) dx' },
    { label: 'Sum', code: '\\sum_{i=1}^{n} x_i' },
    { label: 'Greek letters', code: '\\alpha, \\beta, \\gamma' },
    { label: 'Superscript', code: 'x^2' },
    { label: 'Subscript', code: 'x_1' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create New Flashcard</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLatex(!isLatex)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLatex
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {isLatex ? <Function className="w-4 h-4" /> : <Type className="w-4 h-4" />}
            {isLatex ? 'LaTeX Mode' : 'Text Mode'}
          </button>
          {isLatex && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>
      </div>

      {isLatex && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-900 mb-3">LaTeX Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {latexExamples.map((example, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-purple-700 font-medium">{example.label}:</span>
                <code className="text-purple-600 bg-white px-2 py-1 rounded mt-1">{example.code}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front (Question)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder={isLatex ? "Enter LaTeX: \\frac{d}{dx}[x^2] = ?" : "Enter your question..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            {isLatex && showPreview && front && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Preview:</div>
                <LaTeXPreview content={front} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back (Answer)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder={isLatex ? "Enter LaTeX: 2x" : "Enter your answer..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            {isLatex && showPreview && back && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-600 mb-1">Preview:</div>
                <LaTeXPreview content={back} />
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Flashcard
        </button>
      </form>
    </div>
  );
};