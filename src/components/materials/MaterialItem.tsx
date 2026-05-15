import type { Material } from '../../types';

interface MaterialItemProps {
  material: Material;
  onDelete: (id: string) => void;
}

export function MaterialItem({ material, onDelete }: MaterialItemProps) {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{material.type === 'link' ? '🔗' : '📝'}</span>
            <p className="font-semibold text-gray-800 text-sm truncate">{material.title}</p>
          </div>
          {material.type === 'link' ? (
            <a
              href={material.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-rose-500 hover:underline break-all"
            >
              {material.content}
            </a>
          ) : (
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{material.content}</p>
          )}
          <p className="text-xs text-gray-300 mt-1.5">
            {new Date(material.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <button
          onClick={() => onDelete(material.id)}
          className="text-gray-300 hover:text-red-400 text-xl leading-none shrink-0 mt-0.5"
          aria-label="Remover"
        >
          ×
        </button>
      </div>
    </div>
  );
}
