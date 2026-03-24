import type { RootState } from '@/app/store/store';
import type { FiltersState } from './types';

export const selectFilters = (state: RootState): FiltersState => state.filters;
export const selectMainFilter = (state: RootState) => state.filters.mainFilter;
export const selectSkills = (state: RootState) => state.filters.skills;
export const selectAuthorGender = (state: RootState) => state.filters.authorGender;
export const selectCities = (state: RootState) => state.filters.cities;

export const selectActiveFiltersCount = (state: RootState) => {
  let count = 0;
  if (state.filters.mainFilter !== 'all') count++;
  count += state.filters.skills.length;
  if (state.filters.authorGender !== '') count++;
  count += state.filters.cities.length;
  return count;
};
