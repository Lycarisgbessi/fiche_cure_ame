import React, { useState, useEffect } from 'react';
import { getSubmissions, updateComment, startInterview, assignInterview } from '../store';
import { Submission } from '../types';
import { formSchema } from '../schema';
import { format } from 'date-fns';
import { ChevronLeft, ChevronDown, MessageSquare, User, Calendar, CheckCircle, Lock, Unlock, Eye, EyeOff, FileText, Download, Share2, Mail, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EntretienView } from './EntretienView';

const exportToExcel = async (data: Submission[], isSingle: boolean = false) => {
  if (data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Cure d\'Âme');

  const primaryColor = '006865';
  const goldColor = 'D4AF37';
  
  const baseHeaders = [
    { header: 'Date', key: 'date', width: 22 },
    { header: 'Fidèle', key: 'fid', width: 35 },
    { header: 'Pasteur', key: 'pastor', width: 25 },
    { header: 'Statut', key: 'status', width: 15 },
    { header: 'Observations Globales', key: 'globalObs', width: 50 }
  ];

  const columns: Partial<ExcelJS.Column>[] = [...baseHeaders];

  formSchema.forEach(section => {
    section.questions.forEach(q => {
      columns.push({ header: `${section.title}\n${q.label}`, key: q.id, width: 40 });
      columns.push({ header: `Notes Conducteur: ${q.label}`, key: `${q.id}_note`, width: 40 });
    });
  });

  worksheet.columns = columns;

  worksheet.getRow(1).height = 45;
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryColor } };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: goldColor } },
      bottom: { style: 'thin', color: { argb: goldColor } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  });

  data.forEach(sub => {
    const rowData: Record<string, any> = {
      date: format(new Date(sub.date), 'dd/MM/yyyy HH:mm'),
      fid: sub.faithfulName,
      pastor: sub.interviewerName || '',
      status: sub.status === 'completed' ? 'Terminé' : sub.status === 'interviewing' ? 'En cours' : 'Nouveau',
      globalObs: sub.globalObservations || ''
    };

    formSchema.forEach(section => {
      section.questions.forEach(q => {
        const answer = sub.answers[q.id];
        let formatted = "";
        if (Array.isArray(answer)) formatted = answer.join("\n- ");
        else if (typeof answer === 'object' && answer !== null) formatted = `${answer.choice || ""}${answer.details ? `\n(Détails : ${answer.details})` : ""}`;
        else formatted = answer || "";
        
        rowData[q.id] = formatted;
        rowData[`${q.id}_note`] = sub.comments[q.id] || "";
      });
    });

    const row = worksheet.addRow(rowData);
    row.alignment = { vertical: 'top', wrapText: true };
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'dotted', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'dotted', color: { argb: 'FFDDDDDD' } },
        left: { style: 'dotted', color: { argb: 'FFDDDDDD' } },
        right: { style: 'dotted', color: { argb: 'FFDDDDDD' } },
      };
      if (row.number % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFA' } };
      }
    });
  });

  worksheet.views = [{ state: 'frozen', xSplit: 2, ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = isSingle 
    ? `Fiche_${data[0].faithfulName.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`
    : `Toutes_Les_Fiches_${format(new Date(), 'yyyyMMdd')}.xlsx`;
  
  saveAs(new Blob([buffer]), filename);
};

const exportToPDF = (data: Submission[], isSingle: boolean = false) => {
  if (data.length === 0) return;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  const primaryColor: [number, number, number] = [0, 104, 101]; // #006865
  const goldColor: [number, number, number] = [212, 175, 55]; // #D4AF37

  data.forEach((sub, subIndex) => {
    if (subIndex > 0) doc.addPage();
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Assemblée Metanoia - Vases d'Honneur", 105, 14, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...goldColor);
    doc.text("DÉPARTEMENT MRES - FICHE DE CURE D'ÂME", 105, 22, { align: 'center' });

    // Faithful Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(sub.faithfulName.toUpperCase(), 14, 42);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Soumise le : ${format(new Date(sub.date), 'dd/MM/yyyy à HH:mm')}`, 14, 48);
    if (sub.interviewerName) {
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Entretien conduit par : ${sub.interviewerName}`, 14, 54);
      if (sub.interviewDate) {
        doc.text(`Date d'entretien : ${format(new Date(sub.interviewDate), 'dd/MM/yyyy à HH:mm')}`, 14, 59);
      }
    }
    let startY = sub.interviewerName ? 65 : 55;
    if (sub.globalObservations) {
      doc.setFillColor(245, 245, 245);
      doc.rect(14, startY, 182, 20, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Observations Globales:', 16, startY + 6);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      const splitObs = doc.splitTextToSize(sub.globalObservations, 178);
      doc.text(splitObs, 16, startY + 12);
      startY += 10 + (splitObs.length * 4);
    }

    formSchema.forEach((section) => {
      const sectionRows: any[] = [];
      
      section.questions.forEach(q => {
        const answer = sub.answers[q.id];
        let txt = "";
        if (Array.isArray(answer)) txt = answer.join("\n- ");
        else if (typeof answer === 'object' && answer !== null) txt = `${answer.choice || ""}${answer.details ? `\nDétails : ${answer.details}` : ""}`;
        else txt = answer || "Non renseigné";
        
        const comm = sub.comments[q.id] || "";
        
        sectionRows.push(["Question", q.label]);
        sectionRows.push(["Réponse", Array.isArray(answer) && answer.length > 0 ? `- ${txt}` : txt]);
        if (comm) sectionRows.push(["Notes Conducteur", comm]);
        sectionRows.push(["", ""]); // Spacers
      });

      autoTable(doc, {
        head: [[{ content: section.title.toUpperCase(), colSpan: 2, styles: { fillColor: primaryColor, textColor: 255, halign: 'center', fontStyle: 'bold' } }]],
        body: sectionRows,
        startY: startY,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: primaryColor, cellWidth: 40 },
          1: { cellWidth: 140, textColor: 50 }
        },
        didParseCell: (data) => {
          if (data.row.raw[0] === "Notes Conducteur") {
            data.cell.styles.textColor = [160, 130, 40]; // Darker gold
            data.cell.styles.fontStyle = 'italic';
            if (data.column.index === 0) data.cell.styles.textColor = [160, 130, 40];
          }
          if (data.row.raw[0] === "" && data.row.raw[1] === "") {
             data.cell.styles.cellPadding = 0.5;
             data.cell.styles.minCellHeight = 2;
          } else if (data.row.raw[0] === "Question") {
             data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      });
      startY = (doc as any).lastAutoTable.finalY + 8;
      
      // Page break check
      if (startY > 260 && section !== formSchema[formSchema.length - 1]) {
        doc.addPage();
        startY = 20;
      }
    });
  });

  // Adding page numbers globally
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${(doc as any).internal.getCurrentPageInfo().pageNumber} / ${pageCount}`, 105, 290, { align: 'center' });
  }

  const filename = isSingle 
    ? `Fiche_${data[0].faithfulName.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`
    : `Toutes_Les_Fiches_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(filename);
};

export function ConducteurView({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pastorName, setPastorName] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'detail' | 'entretien'>('dashboard');
  const [activeTab, setActiveTab] = useState<'new' | 'interviewing' | 'completed'>('new');

  const loadData = async () => {
    const data = await getSubmissions();
    setSubmissions(data);
  };
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, viewMode]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={(name) => { setPastorName(name); setIsAuthenticated(true); }} onBack={onBack} />;
  }

  if (viewMode === 'detail' && selectedSubmission) {
    return (
      <SubmissionDetail 
        submission={selectedSubmission} 
        onBack={() => { setViewMode('dashboard'); setSelectedSubmission(null); loadData(); }} 
        onStartInterview={() => {
          if (selectedSubmission.status === 'new' || !selectedSubmission.status) {
            startInterview(selectedSubmission.id, pastorName);
            selectedSubmission.status = 'interviewing';
            selectedSubmission.interviewerName = pastorName;
            selectedSubmission.interviewDate = new Date().toISOString();
          }
          setViewMode('entretien');
        }}
        onAssign={(newPastor) => {
          assignInterview(selectedSubmission.id, newPastor);
          selectedSubmission.interviewerName = newPastor;
          if (selectedSubmission.status === 'new' || !selectedSubmission.status) {
            selectedSubmission.status = 'interviewing';
          }
          loadData();
        }}
      />
    );
  }

  if (viewMode === 'entretien' && selectedSubmission) {
    return (
      <EntretienView 
        submission={selectedSubmission} 
        onBack={() => { setViewMode('dashboard'); setSelectedSubmission(null); loadData(); }} 
      />
    );
  }

  const filteredSubmissions = submissions.filter(s => (s.status || 'new') === activeTab);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="text-[#006865] hover:opacity-80 flex items-center font-bold transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-[17px] font-extrabold tracking-tight text-[#006865]">
              Espace Conducteur
            </h1>
            <p className="text-[11px] font-bold text-[#006865]/60 uppercase tracking-wider mt-0.5">
              Connecté : {pastorName}
            </p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
            <div className="flex bg-gray-200/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-lg font-bold text-[13px] transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-[#006865]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Nouvelles ({submissions.filter(s => (s.status || 'new') === 'new').length})
              </button>
              <button 
                onClick={() => setActiveTab('interviewing')}
                className={`px-4 py-2 rounded-lg font-bold text-[13px] transition-all ${activeTab === 'interviewing' ? 'bg-white shadow-sm text-[#006865]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                En cours ({submissions.filter(s => s.status === 'interviewing').length})
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-lg font-bold text-[13px] transition-all ${activeTab === 'completed' ? 'bg-white shadow-sm text-[#006865]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Terminés ({submissions.filter(s => s.status === 'completed').length})
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => exportToExcel(submissions, false)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#006865] text-white rounded-xl font-bold text-xs hover:bg-[#005552] transition-all shadow-md shadow-[#006865]/10"
                disabled={submissions.length === 0}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Tous (Excel)</span>
              </button>
              <button
                onClick={() => exportToPDF(submissions, false)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-white rounded-xl font-bold text-xs hover:bg-[#b5952f] transition-all shadow-md shadow-[#D4AF37]/10"
                disabled={submissions.length === 0}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Tous (PDF)</span>
              </button>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-[15px]">Aucune fiche dans cette catégorie.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredSubmissions.map((sub, index) => (
                  <motion.li 
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between group"
                    onClick={() => { setSelectedSubmission(sub); setViewMode('detail'); }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#006865]/10 p-3 rounded-2xl text-[#006865] group-hover:scale-105 transition-transform">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-[#006865]">{sub.faithfulName}</p>
                        <div className="flex items-center text-[13px] text-[#006865]/60 mt-1 font-semibold space-x-3">
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {format(new Date(sub.date), 'dd/MM/yyyy HH:mm')}</span>
                          {sub.interviewerName && <span className="flex items-center text-[#D4AF37]"><User className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {sub.interviewerName}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-[#006865] font-bold text-[15px] transition-colors">
                      <span className="hidden sm:inline mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeTab === 'new' ? 'Consulter' : "Ouvrir l'entretien"}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function LoginScreen({ onLogin, onBack }: { onLogin: (name: string) => void; onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mot de passe temporaire codé en dur
  const ADMIN_PASSWORD = 'vases';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastorName.trim()) {
      setError('Veuillez entrer votre nom.');
      return;
    }
    if (password === ADMIN_PASSWORD) {
      onLogin(pastorName.trim());
    } else {
      setError('Mot de passe incorrect. Accès refusé.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#006865]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white overflow-hidden relative z-10"
      >
        <div className="p-8 sm:p-10">
          <button 
            onClick={onBack}
            className="text-[#006865]/60 hover:text-[#006865] flex items-center text-sm font-bold mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#006865] to-[#004d4b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#006865]/20 mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#006865] tracking-tight mb-2">Accès Conducteur</h1>
            <p className="text-[15px] text-gray-500 font-medium">
              Veuillez vous identifier pour accéder aux fiches.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={pastorName}
                onChange={(e) => {
                  setPastorName(e.target.value);
                  setError('');
                }}
                placeholder="Votre nom (ex: Pasteur Jean)"
                className={`w-full px-5 py-4 bg-gray-50 border ${error && !pastorName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-[#006865] focus:ring-[#006865]/20'} rounded-2xl text-[16px] transition-all outline-none focus:ring-[3px] focus:bg-white`}
                autoFocus
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Entrez le mot de passe"
                  className={`w-full pl-5 pr-12 py-4 bg-gray-50 border ${error && password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-[#006865] focus:ring-[#006865]/20'} rounded-2xl text-[16px] transition-all outline-none focus:ring-[3px] focus:bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006865] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm font-bold mt-3 pl-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={!password || !pastorName}
              className="w-full flex items-center justify-center p-4 bg-[#D4AF37] text-white rounded-2xl font-bold text-[16px] hover:bg-[#b5952f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20 mt-2"
            >
              <Unlock className="w-5 h-5 mr-2" />
              Déverrouiller l'accès
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function SubmissionDetail({ submission, onBack, onStartInterview, onAssign }: { submission: Submission; onBack: () => void; onStartInterview: () => void; onAssign: (p: string) => void }) {
  const [comments, setComments] = useState<Record<string, string>>(submission.comments || {});
  const [showAssignPrompt, setShowAssignPrompt] = useState(false);
  const [newPastorName, setNewPastorName] = useState('');

  const handleShareWhatsApp = () => {
    const text = `Fiche de cure d'âme: *${submission.faithfulName}*\nSoumise le: ${format(new Date(submission.date), 'dd/MM/yyyy HH:mm')}\n\nVeuillez vous connecter à la plateforme pour consulter les détails ou générer le PDF.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Fiche de cure d'âme: ${submission.faithfulName}`;
    const body = `Bonjour,\n\nUne fiche de cure d'âme a été soumise par ${submission.faithfulName} le ${format(new Date(submission.date), 'dd/MM/yyyy HH:mm')}.\n\nStatut: ${submission.status || 'Nouveau'}\n\nPour des raisons de confidentialité, veuillez vous connecter à la plateforme pour générer et joindre le PDF complet.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSaveComment = (questionId: string, text: string) => {
    setComments((prev) => ({ ...prev, [questionId]: text }));
    updateComment(submission.id, questionId, text);
    submission.comments[questionId] = text;
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
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="text-[#006865] hover:opacity-80 flex items-center font-bold transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Retour aux fiches</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-[17px] font-extrabold tracking-tight text-[#006865]">{submission.faithfulName}</h1>
            <p className="text-[11px] font-bold text-[#006865]/60 uppercase tracking-wider mt-0.5">
              {format(new Date(submission.date), 'dd/MM/yyyy • HH:mm')}
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            {(submission.status === 'new' || submission.status === 'interviewing' || !submission.status) && (
              <>
                <button
                  onClick={() => setShowAssignPrompt(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all border border-gray-200 mr-2"
                  title="Assigner / Transférer"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Transférer</span>
                </button>
                <button
                  onClick={onStartInterview}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF37] text-white rounded-xl font-bold text-xs hover:bg-[#b5952f] transition-all shadow-md shadow-[#D4AF37]/20 mr-2"
                >
                  <span>{(!submission.status || submission.status === 'new') ? "Démarrer l'entretien" : "Continuer l'entretien"}</span>
                </button>
              </>
            )}
            
            {/* Partage */}
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-100 transition-all border border-green-200"
              title="Partager via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareEmail}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all border border-blue-200"
              title="Partager par Email"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Exports */}
            <button
              onClick={() => exportToExcel([submission], true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#006865]/10 text-[#006865] rounded-xl font-bold text-xs hover:bg-[#006865]/20 transition-all border border-[#006865]/10 ml-2"
              title="Exporter cette fiche en Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={() => exportToPDF([submission], true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl font-bold text-xs hover:bg-[#D4AF37]/20 transition-all border border-[#D4AF37]/10"
              title="Exporter cette fiche en PDF"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Assignation */}
      <AnimatePresence>
        {showAssignPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-bold text-[#006865] mb-2">Transférer à un pasteur</h3>
              <p className="text-sm text-gray-500 mb-4">Entrez le nom du pasteur qui prendra en charge cet entretien.</p>
              <input
                type="text"
                autoFocus
                placeholder="Nom du pasteur"
                value={newPastorName}
                onChange={(e) => setNewPastorName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#006865] outline-none transition-colors mb-4"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowAssignPrompt(false)}
                  className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    if(newPastorName.trim()){
                      onAssign(newPastorName.trim());
                      setShowAssignPrompt(false);
                    }
                  }}
                  className="px-4 py-2 bg-[#006865] text-white font-bold rounded-lg hover:bg-[#005552] transition-colors"
                >
                  Assigner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {formSchema.map((section, index) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
          >
            <div className="bg-[#006865]/5 px-8 py-5 border-b border-[#006865]/10">
              <h2 className="text-lg font-extrabold tracking-tight text-[#006865]">{section.title}</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {section.questions.map((q) => (
                <QuestionRow 
                  key={q.id}
                  q={q}
                  submission={submission}
                  comments={comments}
                  handleSaveComment={handleSaveComment}
                  renderAnswer={renderAnswer}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}

function QuestionRow({ q, submission, comments, handleSaveComment, renderAnswer }: any) {
  const hasComment = !!comments[q.id] && comments[q.id].trim() !== '';
  const [isCommentOpen, setIsCommentOpen] = useState(hasComment);

  return (
    <div className="p-6 sm:p-8 hover:bg-gray-50/50 transition-colors flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-[#006865] mb-3 leading-snug">{q.label}</h3>
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 sm:p-5 shadow-sm">
            {renderAnswer(submission.answers[q.id], q.type)}
          </div>
        </div>
        
        <div className="lg:mt-0 flex-shrink-0 flex lg:justify-end">
          <button 
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all duration-300 ${
              isCommentOpen 
                ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20 scale-105' 
                : hasComment 
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#006865] hover:border-[#006865]/30'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{hasComment ? 'Voir/Modifier le commentaire' : 'Ajouter un commentaire'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCommentOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isCommentOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-5 sm:p-6 relative shadow-inner">
                {/* Decorative triangle pointing up */}
                <div className="hidden lg:block absolute -top-2.5 right-24 w-5 h-5 bg-[#D4AF37]/10 border-t border-l border-[#D4AF37]/20 transform rotate-45" />
                
                <label className="text-[14px] font-bold text-[#b5952f] mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notes du conducteur
                </label>
                <textarea
                  className="w-full p-4 border border-[#D4AF37]/30 rounded-xl focus:bg-white focus:ring-[3px] focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-white/60 min-h-[120px] text-[15px] transition-all duration-200 outline-none resize-y placeholder:text-[#D4AF37]/40 text-gray-800 shadow-sm"
                  placeholder="Saisissez vos observations, remarques ou notes d'entretien concernant cette réponse..."
                  value={comments[q.id] || ''}
                  onChange={(e) => handleSaveComment(q.id, e.target.value)}
                  autoFocus={!hasComment}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[12px] font-medium text-[#b5952f]/70 italic">
                    Ces notes sont confidentielles et réservées à l'équipe pastorale.
                  </span>
                  <span className="text-[12px] font-bold text-[#006865]/50 flex items-center bg-white/50 px-2 py-1 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[#006865]/40" /> Sauvegarde auto
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
