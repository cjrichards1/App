import React, { useState } from 'react';
import { Plus, Type, FunctionSquare } from 'lucide-react';
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
        { label: 'Nth root', code: '\\sqrt[n]{x}', preview: 'ⁿ√x' },
        { label: 'Power', code: 'x^{2}', preview: 'x²' },
        { label: 'Subscript', code: 'x_{1}', preview: 'x₁' },
      ]
    },
    {
      category: 'Calculus',
      examples: [
        { label: 'Derivative', code: '\\frac{d}{dx}f(x)', preview: 'd/dx f(x)' },
        { label: 'Partial derivative', code: '\\frac{\\partial f}{\\partial x}', preview: '∂f/∂x' },
        { label: 'Integral', code: '\\int f(x) dx', preview: '∫ f(x) dx' },
        { label: 'Definite integral', code: '\\int_{a}^{b} f(x) dx', preview: '∫ᵃᵇ f(x) dx' },
        { label: 'Limit', code: '\\lim_{x \\to a} f(x)', preview: 'lim(x→a) f(x)' },
      ]
    },
    {
      category: 'Greek Letters',
      examples: [
        { label: 'Common', code: '\\alpha, \\beta, \\gamma', preview: 'α, β, γ' },
        { label: 'More', code: '\\delta, \\epsilon, \\theta', preview: 'δ, ε, θ' },
        { label: 'Capital', code: '\\Delta, \\Gamma, \\Theta', preview: 'Δ, Γ, Θ' },
        { label: 'Pi & others', code: '\\pi, \\phi, \\psi, \\omega', preview: 'π, φ, ψ, ω' },
      ]
    },
    {
      category: 'Symbols',
      examples: [
        { label: 'Infinity', code: '\\infty', preview: '∞' },
        { label: 'Plus/minus', code: '\\pm', preview: '±' },
        { label: 'Approximately', code: '\\approx', preview: '≈' },
        { label: 'Not equal', code: '\\neq', preview: '≠' },
        { label: 'Less/greater equal', code: '\\leq, \\geq', preview: '≤, ≥' },
      ]
    },
    {
      category: 'Advanced',
      examples: [
        { label: 'Sum', code: '\\sum_{i=1}^{n} x_i', preview: 'Σᵢ₌₁ⁿ xᵢ' },
        { label: 'Product', code: '\\prod_{i=1}^{n} x_i', preview: 'Πᵢ₌₁ⁿ xᵢ' },
        { label: 'Matrix', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', preview: '[a b; c d]' },
        { label: 'Binomial', code: '\\binom{n}{k}', preview: '(n k)' },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create New Flashcard</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLatex(!isLatex)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
            style={isLatex 
              ? { backgroundColor: '#fbcfe8', color: '#F43F5E', borderColor: '#F43F5E' }
              : { backgroundColor: '#F3F4F6', color: '#1F2937', borderColor: '#D1D5DB' }}
          >
            {isLatex ? <FunctionSquare className="w-4 h-4" /> : <Type className="w-4 h-4" />}
            {isLatex ? 'LaTeX Mode' : 'Text Mode'}
          </button>
          {isLatex && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-2 text-sm font-medium transition-colors"
              style={{ color: '#6B7280' }}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>
      </div>

      {isLatex && (
        <div className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: '#fbcfe8', borderColor: '#F43F5E' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1F2937' }}>LaTeX Guide & Quick Reference</h3>
            <div className="text-xs px-2 py-1 rounded" style={{ color: '#F43F5E', backgroundColor: '#fce7f3' }}>
              Click any example to copy
            </div>
          </div>
          
          <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#fce7f3' }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: '#1F2937' }}>💡 Tips for LaTeX Flashcards:</h4>
            <ul className="text-xs space-y-1" style={{ color: '#1F2937' }}>
              <li>• Use curly braces {} to group expressions: x^{2+3} not x^2+3</li>
              <li>• For multi-character subscripts/superscripts: x_{max} not x_max</li>
              <li>• Use \\ for line breaks in longer expressions</li>
              <li>• Preview your LaTeX before saving to catch syntax errors</li>
            </ul>
          </div>

          <div className="space-y-4">
            {latexExamples.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-sm font-semibold mb-2 border-b pb-1" style={{ color: '#1F2937', borderColor: '#F43F5E' }}>
                  {category.category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {category.examples.map((example, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-2 rounded border cursor-pointer transition-colors hover:shadow-sm"
                      style={{ borderColor: '#F43F5E' }}
                      onClick={() => {
                        navigator.clipboard.writeText(example.code);
                        // You could add a toast notification here
                      }}
                      title="Click to copy"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium" style={{ color: '#F43F5E' }}>{example.label}</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>{example.preview}</span>
                      </div>
                      <code className="text-xs px-2 py-1 rounded block overflow-x-auto" style={{ color: '#F43F5E', backgroundColor: '#fdf2f8' }}>
                        {example.code}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 border rounded-md" style={{ backgroundColor: '#d1fae5', borderColor: '#10B981' }}>
            <h4 className="text-sm font-medium mb-1" style={{ color: '#1F2937' }}>⚠️ Common Mistakes:</h4>
            <div className="text-xs space-y-1" style={{ color: '#1F2937' }}>
              <div>❌ <code>x^2+3</code> → ✅ <code>x^{2+3}</code> (for x²⁺³)</div>
              <div>❌ <code>\frac12</code> → ✅ <code>\frac{1}{2}</code> (always use braces)</div>
              <div>❌ <code>\sqrt x+1</code> → ✅ <code>\sqrt{x+1}</code> (group the expression)</div>
            </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
              style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
              style={{ '--tw-ring-color': '#3B82F6' } as React.CSSProperties}
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
          className="w-full text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
          style={{ backgroundColor: '#3B82F6' }}
        >
          <Plus className="w-5 h-5" />
          Add Flashcard
        </button>
      </form>
    </div>
  );
};