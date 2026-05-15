import { useState, useCallback } from 'react';
import type { Material } from '../types';
import { loadState, updateMaterials } from '../lib/storage';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>(() => loadState().materials);

  const addMaterial = useCallback((item: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newItem: Material = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setMaterials((prev) => {
      const updated = [newItem, ...prev];
      updateMaterials(updated);
      return updated;
    });
  }, []);

  const removeMaterial = useCallback((id: string) => {
    setMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      updateMaterials(updated);
      return updated;
    });
  }, []);

  const editMaterial = useCallback((id: string, changes: Partial<Omit<Material, 'id' | 'createdAt'>>) => {
    setMaterials((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, ...changes, updatedAt: new Date().toISOString() } : m
      );
      updateMaterials(updated);
      return updated;
    });
  }, []);

  return { materials, addMaterial, removeMaterial, editMaterial };
}
