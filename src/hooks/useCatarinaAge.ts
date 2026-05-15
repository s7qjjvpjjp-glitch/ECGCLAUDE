import { useState, useEffect } from 'react';
import type { CatarinaAge } from '../types';
import { getCatarinaAge } from '../lib/ageUtils';

export function useCatarinaAge(): CatarinaAge {
  const [age, setAge] = useState<CatarinaAge>(getCatarinaAge);

  useEffect(() => {
    const id = setInterval(() => setAge(getCatarinaAge()), 60_000);
    return () => clearInterval(id);
  }, []);

  return age;
}
