import type { Subcategory } from '@/entities/subcategory/types';
import { request } from '@/api/request';
import { normalizeEntityId } from '@/api/id-normalizer';

type SubcategoryDto = {
  id: number | string;
  categoryId: number | string;
  name: string;
};

export async function getSubcategories(): Promise<Subcategory[]> {
  const subcategories = await request<SubcategoryDto[]>('/subcategories');

  return subcategories.map((subcategory) => ({
    rawId: subcategory.id,
    id: normalizeEntityId('subcategories', subcategory.id),
    categoryId: normalizeEntityId('categories', subcategory.categoryId),
    name: subcategory.name,
  }));
}
