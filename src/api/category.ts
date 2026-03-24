import type { Category } from '@/entities/category/types';
import { request } from '@/api/request';

export function getCategories() {
  return request<Category[]>('/categories');
}
