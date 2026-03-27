import type { City } from '@/entities/city/types';
import { request } from '@/api/request';
import { normalizeEntityId } from '@/api/id-normalizer';

type CityDto = {
  id: number | string;
  name: string;
};

export async function getCities(): Promise<City[]> {
  const cities = await request<CityDto[]>('/cities');

  return cities.map((city) => ({
    rawId: city.id,
    id: normalizeEntityId('cities', city.id),
    name: city.name,
  }));
}
