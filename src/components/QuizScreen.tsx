import React, { useState } from 'react';
import { HelpCircle, Plus, Sparkles, RotateCw, CheckCircle2, XCircle, Heart, Award, ArrowRight, Play, Check, Flame, Trophy, Trash2 } from 'lucide-react';
import { QuizCard, QuizSet, QuizMcqQuestion } from '../types';

interface QuizScreenProps {
  cards: QuizCard[];
  quizSets: QuizSet[];
  onAddCard?: (card: Omit<QuizCard, 'id'>) => void;
  onAddQuizSet: (set: Omit<QuizSet, 'id' | 'completedByPartner' | 'score'>) => void;
  onCompleteQuizSet: (setId: string, score: number) => void;
  onDeleteQuizSet?: (setId: string) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  cards,
  quizSets,
  onAddCard,
  onAddQuizSet,
  onCompleteQuizSet,
  onDeleteQuizSet
}) => {
  const [activeQuizSet, setActiveQuizSet] = useState<QuizSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Modal State for creating new 4-Question Quiz
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<QuizSet['category']>('Favorites');
  const [createdBy, setCreatedBy] = useState<'sofs' | 'mumu'>('sofs');
  const [targetFor, setTargetFor] = useState<'sofs' | 'mumu'>('mumu');

  // 4 Questions Form State
  const [qForms, setQForms] = useState<Array<{
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    memoryDetail: string;
  }>>([
    { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
    { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
    { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
    { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' }
  ]);

  // Start taking a quiz
  const handleStartQuiz = (set: QuizSet) => {
    setActiveQuizSet(set);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setQuizScore(0);
    setIsQuizFinished(false);
  };

  // Select an option during quiz play
  const handleSelectOption = (optionIndex: number) => {
    if (selectedOptionIndex !== null || !activeQuizSet) return; // already answered

    setSelectedOptionIndex(optionIndex);
    const currentQ = activeQuizSet.questions[currentQuestionIndex];
    
    if (optionIndex === currentQ.correctOptionIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Next question handler
  const handleNextQuestion = () => {
    if (!activeQuizSet) return;

    if (currentQuestionIndex < activeQuizSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      // Quiz finished!
      setIsQuizFinished(true);
      onCompleteQuizSet(activeQuizSet.id, quizScore);
    }
  };

  // Create new 4-Question quiz submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const formattedQuestions: QuizMcqQuestion[] = qForms.map((q, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      question: q.question || `Question ${idx + 1}`,
      options: q.options.map((opt, oIdx) => opt || `Choice ${oIdx + 1}`),
      correctOptionIndex: q.correctIndex,
      memoryDetail: q.memoryDetail || 'A sweet memory from our journey.'
    }));

    onAddQuizSet({
      title: newTitle,
      category: newCategory,
      createdBy,
      targetFor,
      questions: formattedQuestions
    });

    // Reset form
    setNewTitle('');
    setQForms([
      { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
      { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
      { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' },
      { question: '', options: ['', '', '', ''], correctIndex: 0, memoryDetail: '' }
    ]);
    setIsCreateModalOpen(false);
  };

  const updateQForm = (qIdx: number, field: string, value: any) => {
    const updated = [...qForms];
    if (field === 'question') updated[qIdx].question = value;
    if (field === 'correctIndex') updated[qIdx].correctIndex = value;
    if (field === 'memoryDetail') updated[qIdx].memoryDetail = value;
    setQForms(updated);
  };

  const updateQOption = (qIdx: number, optIdx: number, value: string) => {
    const updated = [...qForms];
    updated[qIdx].options[optIdx] = value;
    setQForms(updated);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Flamingo Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#24131d] via-[#1a1324] to-[#131724] border border-[#ff6b8b]/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 text-xs text-[#ff6b8b] mb-1">
            <Flame className="w-4 h-4 text-[#ff6b8b]" />
            <span className="uppercase tracking-widest font-semibold">Flamingo Cards Format</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Relationship MCQ Quizzes</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Set custom 4-question MCQ card packs for each other! How well does Mumu know Sofs, and Sofs know Mumu?
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff6b8b] via-[#f48fb1] to-[#d4af37] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#ff6b8b]/30 flex items-center space-x-2 cursor-pointer shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Create 4-Question Quiz</span>
        </button>
      </div>

      {/* ACTIVE QUIZ PLAYER (IF A QUIZ IS OPEN) */}
      {activeQuizSet ? (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-[#ff6b8b]/40 shadow-2xl space-y-6 bg-gradient-to-b from-[#1c1219]/95 to-[#121018]/95 max-w-3xl mx-auto animate-fade-in relative">
          
          {/* Top Bar / Close Button */}
          <div className="flex items-center justify-between border-b border-[#ff6b8b]/20 pb-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-[#ff6b8b]/20 text-[#ff6b8b] text-xs font-bold uppercase border border-[#ff6b8b]/30">
                🦩 Flamingo Card
              </span>
              <h3 className="text-lg font-display font-semibold text-[#fff8e7]">{activeQuizSet.title}</h3>
            </div>

            <button
              onClick={() => setActiveQuizSet(null)}
              className="text-xs text-[#a39780] hover:text-[#fff8e7] underline cursor-pointer"
            >
              Exit Quiz
            </button>
          </div>

          {!isQuizFinished ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-[#ff6b8b] font-semibold">
                  <span>Question {currentQuestionIndex + 1} of {activeQuizSet.questions.length}</span>
                  <span>Score: {quizScore} / {activeQuizSet.questions.length}</span>
                </div>
                <div className="w-full bg-[#121018] h-2 rounded-full overflow-hidden border border-[#ff6b8b]/20">
                  <div 
                    className="bg-gradient-to-r from-[#ff6b8b] to-[#d4af37] h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuizSet.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="p-6 rounded-2xl bg-[#16121b] border border-[#ff6b8b]/30 text-center space-y-2">
                <span className="text-[10px] text-[#d4af37] font-mono uppercase tracking-widest block">
                  Question for {activeQuizSet.targetFor === 'mumu' ? 'Mumu 💙' : 'Sofs 💖'}
                </span>
                <p className="text-xl sm:text-2xl font-display font-semibold text-[#fff8e7] leading-relaxed">
                  "{activeQuizSet.questions[currentQuestionIndex].question}"
                </p>
              </div>

              {/* MCQ Choices Grid (A, B, C, D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuizSet.questions[currentQuestionIndex].options.map((option, optIdx) => {
                  const currentQ = activeQuizSet.questions[currentQuestionIndex];
                  const isSelected = selectedOptionIndex === optIdx;
                  const isCorrect = optIdx === currentQ.correctOptionIndex;
                  const isAnswered = selectedOptionIndex !== null;

                  let cardStyle = "bg-[#14121c] border-[#ff6b8b]/20 text-[#f3e7c4] hover:border-[#ff6b8b]/60";
                  if (isAnswered) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold shadow-lg shadow-emerald-500/20";
                    } else if (isSelected && !isCorrect) {
                      cardStyle = "bg-rose-950/80 border-rose-500 text-rose-200 font-semibold";
                    } else {
                      cardStyle = "bg-[#100e16] border-transparent opacity-40";
                    }
                  }

                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition duration-300 flex items-start space-x-3 cursor-pointer ${cardStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 text-xs ${
                        isAnswered && isCorrect ? 'bg-emerald-400 text-[#0c0d12]' : isAnswered && isSelected && !isCorrect ? 'bg-rose-500 text-white' : 'bg-[#241a22] text-[#ff6b8b]'
                      }`}>
                        {optionLetters[optIdx]}
                      </span>
                      <span className="mt-0.5 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Memory Note Box (Revealed after answering) */}
              {selectedOptionIndex !== null && (
                <div className="p-4 rounded-2xl bg-[#1b1522] border border-[#ff6b8b]/30 space-y-2 animate-fade-in text-xs text-[#c8bfab]">
                  <div className="flex items-center space-x-2 text-[#ff6b8b] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#ff6b8b]" />
                    <span>Memory Detail &amp; Secret:</span>
                  </div>
                  <p className="font-serif italic text-sm text-[#fff8e7]">
                    "{activeQuizSet.questions[currentQuestionIndex].memoryDetail}"
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b8b] to-[#d4af37] text-[#0c0d12] font-semibold text-xs hover:brightness-110 cursor-pointer flex items-center space-x-2 shadow-lg"
                    >
                      <span>{currentQuestionIndex < activeQuizSet.questions.length - 1 ? 'Next Question' : 'See Final Results'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* QUIZ FINISHED CELEBRATION CARD */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#ff6b8b] to-[#d4af37] p-1 mx-auto shadow-xl">
                <div className="w-full h-full bg-[#0c0d12] rounded-full flex items-center justify-center text-3xl">
                  🏆
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-display font-semibold text-[#fff8e7]">Quiz Completed!</h3>
                <p className="text-[#ff6b8b] font-semibold text-lg">
                  You scored {quizScore} out of {activeQuizSet.questions.length}!
                </p>
                <p className="text-xs text-[#c8bfab] font-serif italic max-w-md mx-auto pt-2">
                  {quizScore === 4 
                    ? "Perfect score! You know every single secret, date, and detail of our hearts! 💖✨"
                    : quizScore >= 2
                    ? "Pretty awesome score! Our memories are so deep and full of laughter! 💕"
                    : "A fun attempt! Time for a warm cup of chai and a cozy story night! ☕"}
                </p>
              </div>

              <div className="pt-4 flex justify-center space-x-3">
                <button
                  onClick={() => handleStartQuiz(activeQuizSet)}
                  className="px-5 py-2.5 rounded-xl bg-[#1c1926] border border-[#ff6b8b]/30 text-[#fff8e7] text-xs font-semibold hover:border-[#ff6b8b] transition cursor-pointer flex items-center space-x-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>

                <button
                  onClick={() => setActiveQuizSet(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b8b] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Back to All Quizzes
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ALL QUIZ SETS LIST (CARD DECK / FLAMINGO FORMAT) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizSets.map((quizSet) => {
            const isCompleted = quizSet.completedByPartner;

            return (
              <div
                key={quizSet.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#ff6b8b]/30 hover:border-[#ff6b8b]/60 transition duration-300 relative group flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#1f131c]/90 to-[#141018]/90 shadow-xl"
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ff6b8b]/20 text-[#ff6b8b] text-[10px] font-bold uppercase tracking-wider border border-[#ff6b8b]/30">
                    🦩 Flamingo Pack • {quizSet.questions.length} MCQ Questions
                  </span>

                  {isCompleted && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Score: {quizSet.score}/4</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-semibold text-[#fff8e7] group-hover:text-[#ff6b8b] transition">
                    {quizSet.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-[#a39780]">
                    <span>Created by: <strong className="text-[#d4af37]">{quizSet.createdBy === 'sofs' ? 'Sofs 💖' : 'Mumu 💙'}</strong></span>
                    <span>•</span>
                    <span>For: <strong className="text-[#ff6b8b]">{quizSet.targetFor === 'mumu' ? 'Mumu 💙' : 'Sofs 💖'}</strong></span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-[#ff6b8b]/15 flex items-center justify-between">
                  <button
                    onClick={() => handleStartQuiz(quizSet)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff6b8b] via-[#f48fb1] to-[#d4af37] text-[#0c0d12] font-semibold text-xs hover:brightness-110 transition cursor-pointer flex items-center space-x-2 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-[#0c0d12]" />
                    <span>{isCompleted ? 'Retake Quiz' : 'Take 4-Question Quiz'}</span>
                  </button>

                  {onDeleteQuizSet && (
                    <button
                      onClick={() => onDeleteQuizSet(quizSet.id)}
                      title="Delete Quiz Set"
                      className="p-2 rounded-xl text-[#a39780] hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE 4-QUESTION QUIZ MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-2xl w-full max-h-[90vh] flex flex-col p-6 sm:p-8 rounded-3xl border border-[#ff6b8b]/40 shadow-2xl relative my-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#fff8e7] text-xl font-bold cursor-pointer z-10"
            >
              &times;
            </button>

            <div className="mb-4 shrink-0">
              <span className="text-xs text-[#ff6b8b] font-semibold uppercase tracking-widest block">Flamingo Cards Creator</span>
              <h3 className="text-2xl font-display text-[#fff8e7]">Set a New 4-Question Quiz</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin scrollbar-thumb-[#ff6b8b]/30">
                {/* Quiz Pack Metadata */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#14101a] border border-[#ff6b8b]/20">
                  <div>
                    <label className="block text-xs font-medium text-[#a39780] mb-1">Quiz Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. How Well Do You Know My Morning Routine?"
                      className="w-full px-3 py-2 rounded-xl bg-[#0b090f] border border-[#ff6b8b]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#ff6b8b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#a39780] mb-1">Created By</label>
                      <select
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b090f] border border-[#ff6b8b]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#ff6b8b]"
                      >
                        <option value="sofs">Sofs 💖</option>
                        <option value="mumu">Mumu 💙</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#a39780] mb-1">Target Partner to Take It</label>
                      <select
                        value={targetFor}
                        onChange={(e) => setTargetFor(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0b090f] border border-[#ff6b8b]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#ff6b8b]"
                      >
                        <option value="mumu">Mumu (For Mumu to answer)</option>
                        <option value="sofs">Sofs (For Sofs to answer)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4 Questions Builder */}
                <div className="space-y-6">
                  <span className="text-xs font-semibold text-[#ff6b8b] uppercase tracking-wider block">
                    Fill Out 4 MCQ Questions:
                  </span>

                  {[0, 1, 2, 3].map((qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-[#14101a] border border-[#ff6b8b]/20 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#ff6b8b] font-bold">
                        <span>Question {qIdx + 1} of 4</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={qForms[qIdx].question}
                          onChange={(e) => updateQForm(qIdx, 'question', e.target.value)}
                          placeholder={`Question ${qIdx + 1}: e.g. What is my favorite tea snack?`}
                          className="w-full px-3 py-2 rounded-xl bg-[#0b090f] border border-[#ff6b8b]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#ff6b8b]"
                        />
                      </div>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((optIdx) => (
                          <div key={optIdx} className="flex items-center space-x-1.5">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={qForms[qIdx].correctIndex === optIdx}
                              onChange={() => updateQForm(qIdx, 'correctIndex', optIdx)}
                              title="Mark as correct answer"
                              className="accent-[#ff6b8b] cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={qForms[qIdx].options[optIdx]}
                              onChange={(e) => updateQOption(qIdx, optIdx, e.target.value)}
                              placeholder={`Choice ${['A', 'B', 'C', 'D'][optIdx]}`}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b090f] border border-[#ff6b8b]/20 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#ff6b8b]"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={qForms[qIdx].memoryDetail}
                          onChange={(e) => updateQForm(qIdx, 'memoryDetail', e.target.value)}
                          placeholder="Memory Detail / Explanation (revealed when answered)"
                          className="w-full px-3 py-1.5 rounded-xl bg-[#0b090f] border border-[#ff6b8b]/20 text-xs text-[#c8bfab] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-[#ff6b8b]/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#fff8e7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b8b] to-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer shadow-lg"
                >
                  Save Quiz Pack
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
