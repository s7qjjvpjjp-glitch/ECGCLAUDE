import React from 'react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportViewerProps {
  report: string | null;
  isLoading: boolean;
}

export function ReportViewer({ report, isLoading }: ReportViewerProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Analisando ECG...</h3>
        <p className="text-slate-500 text-center max-w-md">
          O ECG Claude está processando a imagem e aplicando critérios diagnósticos baseados no Atlas de Sukienik. Isso pode levar alguns segundos.
        </p>
      </motion.div>
    );
  }

  if (!report) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-slate-400">
        <FileText size={48} className="mb-4 opacity-50" />
        <p className="text-center max-w-sm">
          O laudo gerado aparecerá aqui após a análise do eletrocardiograma.
        </p>
      </div>
    );
  }

  const isRejection = report.includes("RASCUNHO NÃO REALIZADO") || report.includes("IMAGEM INADEQUADA");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full h-full flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden ${
        isRejection ? 'border-amber-200' : 'border-slate-200'
      }`}
    >
      <div className={`px-6 py-4 border-b flex items-center gap-3 ${
        isRejection ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-slate-50 border-slate-100 text-slate-800'
      }`}>
        {isRejection ? (
          <AlertTriangle className="text-amber-500" size={20} />
        ) : (
          <CheckCircle2 className="text-emerald-500" size={20} />
        )}
        <h2 className="font-semibold text-lg">
          {isRejection ? 'Análise Interrompida' : 'Laudo Sugestivo Gerado'}
        </h2>
      </div>

      <div className="p-6 overflow-y-auto flex-1 prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800">
        <div className="markdown-body">
          <Markdown>{report}</Markdown>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-slate-400" />
        <p>
          <strong>AVISO LEGAL:</strong> Este laudo foi gerado por inteligência artificial como ferramenta de APOIO diagnóstico.
          Não substitui a avaliação do médico especialista. O médico assistente é o único responsável pelo laudo definitivo e pela conduta clínica.
        </p>
      </div>
    </motion.div>
  );
}
