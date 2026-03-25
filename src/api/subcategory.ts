import type { Subcategory } from '@/entities/subcategory/types';
import { request } from '@/api/request';

type SubcategoryDto = {
  id: number | string;
  categoryId: number | string;
  name: string;
};

export async function getSubcategories(): Promise<Subcategory[]> {
  const subcategories = await request<SubcategoryDto[]>('/subcategories');

  return subcategories.map((subcategory) => ({
    id: Number(subcategory.id),
    categoryId: Number(subcategory.categoryId),
    name: subcategory.name,
  }));
}
