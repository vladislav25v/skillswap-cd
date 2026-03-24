import type { Subcategory } from '@/entities/subcategory/types';
import { request } from '@/api/request';

export function getSubcategories() {
  return request<Subcategory[]>('/subcategories');
}
