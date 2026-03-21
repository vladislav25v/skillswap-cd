export interface FiltersState {
  mainFilter: string;
  skills: string[];
  authorGender: string;
  cities: number[];
}

export interface ToggleCategoryPayload {
  categoryId: number;
  subcategoryIds: number[];
  isDeselecting: boolean;
}

export const initialFilterState: FiltersState = {
  mainFilter: 'all',
  skills: [],
  authorGender: '',
  cities: [],
};
