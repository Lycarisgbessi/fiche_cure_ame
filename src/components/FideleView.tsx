import React, { useState, useEffect } from 'react';
import { formSchema } from '../schema';
import { addSubmission } from '../store';
import { Submission } from '../types';
import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { QuestionRenderer } from './QuestionRenderer';
import { motion, AnimatePresence } from 'motion/react';

export function FideleView({ onBack }: { onBack: () => void }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  const currentSection = formSchema[currentSectionIndex];
  const isLastSection = currentSectionIndex === formSchema.length - 1;

  const handleNext = () => {
    if (!isLastSection) {
      setDirection(1);
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setDirection(-1);
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const nom = answers['nom'] || '';
    const prenom = answers['prenom'] || '';
    const faithfulName = `${nom} ${prenom}`.trim() || 'Fidèle Anonyme';

    const submission = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      faithfulName,
      answers,
      comments: {},
      status: 'new' as const,
    };

    await addSubmission(submission);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#F5F5F7]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#006865]/20 rounded-full blur-3xl pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white max-w-md w-full text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <CheckCircle2 className="w-20 h-20 text-[#006865] mx-auto mb-6" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#006865] mb-3">Fiche Envoyée !</h2>
          <p className="text-[#006865]/80 font-semibold mb-10 leading-relaxed">
            Votre fiche de cure d'âme a été enregistrée avec succès. Que le Seigneur vous accorde sa grâce.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full bg-[#006865] text-white py-4 px-6 rounded-full font-bold hover:bg-[#005552] transition-colors shadow-lg shadow-[#006865]/20"
          >
            Retour à l'accueil
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = ((currentSectionIndex + 1) / formSchema.length) * 100;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="text-[#006865] hover:opacity-80 flex items-center font-bold transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#006865] text-center flex-1">
            Cure d'Âme
          </h1>
          <div className="w-16 text-right text-xs font-bold text-[#006865]/60">
            {currentSectionIndex + 1} / {formSchema.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1">
          <motion.div 
            className="bg-[#D4AF37] h-1 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSectionIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10"
          >
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#006865] mb-4">
                {currentSection.title}
              </h2>
              {currentSection.description && (
                <div className="text-[#006865]/80 font-semibold text-[15px] leading-relaxed space-y-4">
                  {Array.isArray(currentSection.description) 
                    ? currentSection.description.map((p, i) => <p key={i}>{p}</p>)
                    : <p>{currentSection.description}</p>}
                </div>
              )}
            </div>

            <div className="space-y-8">
              {currentSection.questions.map((q) => (
                <QuestionRenderer
                  key={q.id}
                  question={q}
                  value={answers[q.id]}
                  onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 p-4 pb-safe z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSectionIndex === 0}
            className={`flex items-center px-5 py-3 rounded-full font-bold transition-all ${
              currentSectionIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-[#006865] hover:bg-[#006865]/5 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Précédent
          </button>

          {isLastSection ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center px-8 py-3 bg-[#D4AF37] text-white rounded-full font-bold hover:bg-[#C19B2E] transition-colors shadow-lg shadow-[#D4AF37]/20"
            >
              Soumettre
              <Send className="w-4 h-4 ml-2" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center px-8 py-3 bg-[#006865] text-white rounded-full font-bold hover:bg-[#005552] transition-colors shadow-lg shadow-[#006865]/20"
            >
              Suivant
              <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
