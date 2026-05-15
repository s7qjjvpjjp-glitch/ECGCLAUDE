import { useState } from 'react';
import { Modal } from '../ui/Modal';
import type { MaterialType } from '../../types';

interface AddMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: { type: MaterialType; title: string; content: string }) => void;
}

export function AddMaterialModal({ open, onClose, onAdd }: AddMaterialModalProps) {
  const [type, setType] = useState<MaterialType>('link');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAdd({ type, title: title.trim(), content: content.trim() });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Adicionar material">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
          <div className="flex gap-2">
            {(['link', 'note'] as MaterialType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  type === t
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {t === 'link' ? '🔗 Link' : '📝 Anotação'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'link' ? 'Ex: Exames do pediatra' : 'Ex: Consulta 6 meses'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {type === 'link' ? 'Link' : 'Anotação'}
          </label>
          {type === 'link' ? (
            <input
              type="url"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva aqui suas anotações..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={!title.trim() || !content.trim()}
          className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl disabled:opacity-40 active:bg-rose-600"
        >
          Salvar
        </button>
      </form>
    </Modal>
  );
}
