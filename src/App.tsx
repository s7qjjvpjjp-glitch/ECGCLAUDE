import { useState, useEffect } from 'react';
import { Heart, Send, AlertCircle, RefreshCcw, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUploader } from './components/ImageUploader';
import { ReportViewer } from './components/ReportViewer';
import { MedicalChat } from './components/MedicalChat';
import { TermsModal } from './components/TermsModal';
import { analyzeECGImage, createMedicalChat } from './services/geminiService';
import { Chat } from '@google/genai';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [clinicalContext, setClinicalContext] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    const termsAccepted = localStorage.getItem('ecgclaude_terms_accepted') === 'true';
    setHasAcceptedTerms(termsAccepted);
    const chat = createMedicalChat();
    setChatSession(chat);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('ecgclaude_terms_accepted', 'true');
    setHasAcceptedTerms(true);
  };

  const handleImageSelected = (file: File | null) => {
    setSelectedImage(file);
    if (!file) {
      setReport(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("A imagem é muito grande. Por favor, envie uma imagem com menos de 5MB.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Image = base64data.split(',')[1];

        try {
          const result = await analyzeECGImage(
            base64Image,
            selectedImage.type,
            clinicalContext
          );
          setReport(result);
        } catch (err: any) {
          setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Erro ao ler o arquivo de imagem.");
        setIsLoading(false);
      };
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setClinicalContext('');
    setReport(null);
    setError(null);
    setChatSession(createMedicalChat());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence>
        {!hasAcceptedTerms && <TermsModal onAccept={handleAcceptTerms} />}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 p-2 rounded-lg text-white shadow-sm">
              <Heart size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900">ECG Claude</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Análise de Eletrocardiograma</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full font-semibold">
              <BookOpen size={14} />
              <span>Atlas Sukienik Integrado</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                1. Envie o Eletrocardiograma
              </h2>
              <ImageUploader
                onImageSelected={handleImageSelected}
                selectedImage={selectedImage}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                2. Contexto Clínico <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Opcional</span>
              </h2>
              <textarea
                value={clinicalContext}
                onChange={(e) => setClinicalContext(e.target.value)}
                placeholder="Idade, sexo, queixa principal, comorbidades, medicações em uso, etc."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none text-sm"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white transition-all shadow-sm ${
                  !selectedImage || isLoading
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 hover:shadow-md active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Analisar ECG
                  </>
                )}
              </button>

              {(report || error) && (
                <button
                  onClick={resetForm}
                  className="p-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                  title="Nova análise"
                >
                  <RefreshCcw size={20} />
                </button>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Output & Chat */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Aviso Importante: Ferramenta de Apoio</p>
                <p>O laudo gerado abaixo é uma <strong>sugestão</strong> criada por Inteligência Artificial. Ele <strong>NÃO substitui o julgamento clínico</strong> e não deve ser usado para tomada de decisão sem a validação integral de um médico especialista.</p>
              </div>
            </div>

            <div className="h-[600px]">
              <ReportViewer report={report} isLoading={isLoading} />
            </div>

            {report && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MedicalChat chat={chatSession} />
              </motion.div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
