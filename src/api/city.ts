import type { City } from '@/entities/city/types';
import { request } from '@/api/request';

type CityDto = {
  id: number | string;
  name: string;
};

export async function getCities(): Promise<City[]> {
  const cities = await request<CityDto[]>('/cities');

  return cities.map((city) => ({
    id: Number(city.id),
    name: city.name,
  }));
}
