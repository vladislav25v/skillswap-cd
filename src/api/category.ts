import type { Category } from '@/entities/category/types';
import { request } from '@/api/request';

type CategoryDto = {
  id: number | string;
  name: string;
};

const normalizeCategory = (category: CategoryDto): Category => ({
  id: Number(category.id),
  name: category.name,
});

export async function getCategories(): Promise<Category[]> {
  const categories = await request<CategoryDto[]>('/categories');

  return categories.map(normalizeCategory);
}
