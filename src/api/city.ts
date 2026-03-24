import type { City } from '@/entities/city/types';
import { request } from '@/api/request';

export function getCities() {
  return request<City[]>('/cities');
}
