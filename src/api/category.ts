import type { Category } from '@/entities/category/types';
import { request } from '@/api/request';
import { normalizeEntityId } from '@/api/id-normalizer';

type CategoryDto = {
  id: number | string;
  name: string;
};

const normalizeCategory = (category: CategoryDto): Category => ({
  rawId: category.id,
  id: normalizeEntityId('categories', category.id),
  name: category.name,
});

export async function getCategories(): Promise<Category[]> {
  const categories = await request<CategoryDto[]>('/categories');

  return categories.map(normalizeCategory);
}
