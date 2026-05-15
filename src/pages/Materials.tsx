import { useState } from 'react';
import { useMaterials } from '../hooks/useMaterials';
import { MaterialItem } from '../components/materials/MaterialItem';
import { AddMaterialModal } from '../components/materials/AddMaterialModal';
import type { MaterialType } from '../types';

export function Materials() {
  const { materials, addMaterial, removeMaterial } = useMaterials();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-rose-600">Materiais 📎</h1>
          <p className="text-sm text-gray-500">Links e anotações da Catarina</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-sm active:bg-rose-600"
        >
          + Adicionar
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-gray-500 font-medium">Nenhum material ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            Adicione links do Google Drive, anotações do pediatra, receituários e muito mais
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 bg-rose-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            Adicionar primeiro material
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => (
            <MaterialItem key={m.id} material={m} onDelete={removeMaterial} />
          ))}
        </div>
      )}

      <AddMaterialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(item) => addMaterial(item as { type: MaterialType; title: string; content: string })}
      />
    </div>
  );
}
