import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsModalProps {
  onAccept: () => void;
}

export function TermsModal({ onAccept }: TermsModalProps) {
  const [isProfessional, setIsProfessional] = useState(false);
  const [understandAI, setUnderstandAI] = useState(false);
  const [agreeNoClinicalDecision, setAgreeNoClinicalDecision] = useState(false);

  const canAccept = isProfessional && understandAI && agreeNoClinicalDecision;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-full shrink-0">
            <AlertTriangle className="text-amber-600" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Aviso Importante de Uso</h2>
            <p className="text-sm text-slate-600">
              Para utilizar o ECG Claude, você deve ler e concordar com os termos abaixo. Esta ferramenta não é um dispositivo médico.
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="pt-0.5">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                checked={isProfessional}
                onChange={(e) => setIsProfessional(e.target.checked)}
              />
            </div>
            <div>
              <span className="block font-semibold text-slate-800 mb-1">Sou um profissional de saúde qualificado.</span>
              <span className="block text-sm text-slate-600">Confirmo que possuo registro profissional ativo e estou apto a interpretar eletrocardiogramas.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="pt-0.5">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                checked={understandAI}
                onChange={(e) => setUnderstandAI(e.target.checked)}
              />
            </div>
            <div>
              <span className="block font-semibold text-slate-800 mb-1">Compreendo a natureza da ferramenta.</span>
              <span className="block text-sm text-slate-600">Entendo que esta aplicação utiliza Inteligência Artificial apenas para fins educacionais, de pesquisa e como assistente de rascunho administrativo.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="pt-0.5">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                checked={agreeNoClinicalDecision}
                onChange={(e) => setAgreeNoClinicalDecision(e.target.checked)}
              />
            </div>
            <div>
              <span className="block font-semibold text-slate-800 mb-1">Não utilizarei para decisão clínica direta.</span>
              <span className="block text-sm text-slate-600">Concordo que os textos gerados NÃO são laudos médicos, NÃO substituem meu julgamento clínico e DEVEM ser integralmente revisados e validados por mim antes de qualquer uso.</span>
            </div>
          </label>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onAccept}
            disabled={!canAccept}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              canAccept
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={20} />
            Concordar e Acessar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
