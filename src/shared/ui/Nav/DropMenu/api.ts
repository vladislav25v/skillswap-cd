import type { Category } from '@/entities/category/types';
import type { Subcategory } from '@/entities/subcategory/types';

// временый api слой для получения моковоых данных в меню

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('Не удалось загрузить категории навыков.');
  }

  return response.json() as Promise<Category[]>;
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const response = await fetch(`${API_BASE_URL}/subcategories`);

  if (!response.ok) {
    throw new Error('Не удалось загрузить подкатегории навыков.');
  }

  return response.json() as Promise<Subcategory[]>;
}
