import React, { useState, useEffect } from 'react';
import { Submission } from '../types';
import { updateComment, updateGlobalObservations, completeInterview } from '../store';
import { formSchema } from '../schema';
import { ChevronLeft, Save, CheckCircle2, MessageSquare, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  submission: Submission;
  onBack: () => void;
}

export function EntretienView({ submission, onBack }: Props) {
  const [comments, setComments] = useState<Record<string, string>>(submission.comments || {});
  const [globalObs, setGlobalObs] = useState(submission.globalObservations || '');
  const [isCompleted, setIsCompleted] = useState(submission.status === 'completed');

  const handleSaveComment = (questionId: string, text: string) => {
    setComments((prev) => ({ ...prev, [questionId]: text }));
    updateComment(submission.id, questionId, text);
    submission.comments[questionId] = text;
  };

  const handleGlobalObsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGlobalObs(e.target.value);
    updateGlobalObservations(submission.id, e.target.value);
    submission.globalObservations = e.target.value;
  };

  const handleComplete = () => {
    completeInterview(submission.id);
    submission.status = 'completed';
    setIsCompleted(true);
  };

  const renderAnswer = (value: any, type: string) => {
    if (!value) return <span className="text-gray-400 italic text-[15px]">Non renseigné</span>;

    if (type === 'multi-select' && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400 italic text-[15px]">Aucun</span>;
      return (
        <ul className="list-disc pl-5 space-y-1.5">
          {value.map((v, i) => <li key={i} className="text-gray-800 text-[15px] leading-relaxed">{v}</li>)}
        </ul>
      );
    }

    if (type === 'yes-no-details' || type === 'yes-no-who') {
      return (
        <div>
          <span className={`font-semibold text-[15px] ${value.choice === 'Oui' ? 'text-red-500' : 'text-gray-800'}`}>
            {value.choice || 'Non renseigné'}
          </span>
          {value.details && (
            <p className="mt-2 text-[15px] text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
              <span className="font-semibold text-gray-500 text-[11px] uppercase tracking-wider mr-2 block mb-1">Détails</span>
              {value.details}
            </p>
          )}
        </div>
      );
    }

    return <span className="text-gray-800 text-[15px] leading-relaxed">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="text-[#006865] hover:opacity-80 flex items-center font-bold transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-[17px] font-extrabold tracking-tight text-[#006865]">
              Entretien avec {submission.faithfulName}
            </h1>
            <div className="flex items-center justify-center space-x-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isCompleted ? 'Terminé' : 'En cours'}
              </span>
              <span className="text-[11px] font-bold text-[#006865]/60 uppercase tracking-wider flex items-center">
                <User className="w-3 h-3 mr-1" /> {submission.interviewerName}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isCompleted && (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#006865] text-white rounded-xl font-bold text-xs hover:bg-[#005552] transition-all shadow-md shadow-[#006865]/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clôturer l'entretien</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Answers */}
        <div className="lg:col-span-7 space-y-8 h-[calc(100vh-120px)] overflow-y-auto pr-2 pb-10 scrollbar-hide">
          {formSchema.map((section, index) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
            >
              <div className="bg-[#006865]/5 px-6 py-4 border-b border-[#006865]/10 sticky top-0 z-10 backdrop-blur-md">
                <h2 className="text-[16px] font-extrabold tracking-tight text-[#006865]">{section.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {section.questions.map((q) => (
                  <div key={q.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                    <h3 className="text-[14px] font-bold text-[#006865] mb-2 leading-snug">{q.label}</h3>
                    <div className="bg-white border border-gray-200/60 rounded-xl p-3 shadow-sm mb-3">
                      {renderAnswer(submission.answers[q.id], q.type)}
                    </div>
                    
                    {/* Inline specific note for the question */}
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37] absolute top-3 left-3 opacity-60" />
                      <textarea
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50 text-[13px] outline-none focus:ring-[2px] focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] resize-y min-h-[40px] placeholder:text-gray-400 transition-all"
                        placeholder="Note spécifique à cette réponse..."
                        value={comments[q.id] || ''}
                        onChange={(e) => handleSaveComment(q.id, e.target.value)}
                        disabled={isCompleted}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Global Observations */}
        <div className="lg:col-span-5 h-[calc(100vh-120px)] sticky top-24">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#006865] to-[#004d4b] rounded-[2rem] shadow-xl border border-[#006865]/50 overflow-hidden h-full flex flex-col"
          >
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <h2 className="text-xl font-extrabold text-white mb-2 flex items-center">
                <Save className="w-5 h-5 mr-2 opacity-80" />
                Rapport d'Entretien
              </h2>
              <p className="text-[#006865]/30 text-[13px] font-medium mb-6 text-white/70">
                Saisissez ici vos observations générales, points de prière et remarques pour le suivi.
              </p>
              
              <div className="flex-1 relative">
                <textarea
                  className="w-full h-full p-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/20 focus:ring-[3px] focus:ring-white/30 focus:border-white/50 outline-none resize-none transition-all text-[15px] leading-relaxed backdrop-blur-sm"
                  placeholder="Commencez à taper vos observations..."
                  value={globalObs}
                  onChange={handleGlobalObsChange}
                  disabled={isCompleted}
                />
                
                {!isCompleted && (
                  <div className="absolute bottom-4 right-4 text-[11px] font-bold text-white/50 flex items-center bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Sauvegarde automatique
                  </div>
                )}
              </div>
              
              {isCompleted && (
                <div className="mt-4 bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-white/80 text-sm font-semibold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                    Cet entretien est clôturé. Les modifications sont désactivées.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
