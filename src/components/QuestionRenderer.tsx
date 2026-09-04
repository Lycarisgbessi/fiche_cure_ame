import React from 'react';
import { Question } from '../types';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  question: Question;
  value: any;
  onChange: (val: any) => void;
}

export function QuestionRenderer({ question, value, onChange }: Props) {
  const inputBaseClasses = "w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-[3px] focus:ring-[#006865]/20 focus:border-[#006865] transition-all duration-200 outline-none text-[15px] text-gray-900 placeholder:text-gray-400";
  const labelClasses = "block text-[16px] font-bold text-[#006865] mb-2.5";

  if (question.type === 'text') {
    return (
      <div className="mb-8">
        <label className={labelClasses}>{question.label}</label>
        <input
          type="text"
          className={inputBaseClasses}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || "Votre réponse..."}
        />
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <div className="mb-8">
        <label className={labelClasses}>{question.label}</label>
        <textarea
          className={`${inputBaseClasses} min-h-[120px] resize-y`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || "Votre réponse détaillée..."}
        />
      </div>
    );
  }

  if (question.type === 'radio') {
    return (
      <div className="mb-8">
        <label className={labelClasses}>{question.label}</label>
        <div className="flex flex-wrap gap-3">
          {question.options?.map((opt) => {
            const isSelected = value === opt;
            return (
              <label 
                key={opt} 
                className={`relative flex items-center px-4 py-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#006865]/5 border-[#006865] text-[#006865]' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={isSelected}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${
                  isSelected ? 'border-[#006865]' : 'border-gray-300'
                }`}>
                  <motion.div 
                    initial={false}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-2.5 h-2.5 bg-[#006865] rounded-full"
                  />
                </div>
                <span className="text-[15px] font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'multi-select') {
    const selectedOptions = Array.isArray(value) ? value : [];
    
    const toggleOption = (opt: string) => {
      if (selectedOptions.includes(opt)) {
        onChange(selectedOptions.filter((o) => o !== opt));
      } else {
        onChange([...selectedOptions, opt]);
      }
    };

    return (
      <div className="mb-8 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
        <label className={labelClasses}>{question.label}</label>
        <div className="space-y-2 mt-4">
          {question.options?.map((opt) => {
            const isSelected = selectedOptions.includes(opt);
            return (
              <label 
                key={opt} 
                className={`flex items-start space-x-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                  isSelected ? 'bg-white shadow-sm border border-gray-200/60' : 'hover:bg-gray-100/50 border border-transparent'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5 relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggleOption(opt)}
                  />
                  <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors duration-200 ${
                    isSelected ? 'bg-[#006865] border-[#006865]' : 'bg-white border-gray-300'
                  }`}>
                    <motion.div
                      initial={false}
                      animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </motion.div>
                  </div>
                </div>
                <span className={`text-[15px] leading-snug ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'yes-no-details' || question.type === 'yes-no-who') {
    const valObj = value || { choice: '', details: '' };
    const detailsLabel = question.type === 'yes-no-who' ? 'Si OUI, pour (ou par) qui ? quoi ?' : 'Donnez plus de détails';

    return (
      <div className="mb-8 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
        <label className={labelClasses}>{question.label}</label>
        <div className="flex flex-wrap gap-3 mb-5 mt-4">
          {['Oui', 'Non', 'Ne sais pas'].map((opt) => {
            const isSelected = valObj.choice === opt;
            return (
              <label 
                key={opt} 
                className={`relative flex items-center px-4 py-2.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-white border-[#006865] shadow-sm text-[#006865]' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`${question.id}-choice`}
                  value={opt}
                  checked={isSelected}
                  onChange={(e) => onChange({ ...valObj, choice: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2.5 transition-colors ${
                  isSelected ? 'border-[#006865]' : 'border-gray-300'
                }`}>
                  <motion.div 
                    initial={false}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-2 h-2 bg-[#006865] rounded-full"
                  />
                </div>
                <span className="text-[14px] font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
        
        <AnimatePresence>
          {valObj.choice === 'Oui' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <label className="block text-[13px] font-bold text-[#006865]/80 mb-2 uppercase tracking-wide">
                  {detailsLabel}
                </label>
                <input
                  type="text"
                  className={inputBaseClasses}
                  value={valObj.details || ''}
                  onChange={(e) => onChange({ ...valObj, details: e.target.value })}
                  placeholder="Précisez ici..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}
