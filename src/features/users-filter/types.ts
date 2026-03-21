export interface FilterState {
  mainFilter: string;
  skills: string[];
  authorGender: string;
  cities: number[];
}

export const initialFilterState: FilterState = {
  mainFilter: 'all',
  skills: [],
  authorGender: '',
  cities: [],
};

export interface User {
  id: number;
  name: string;
  cityId: number;
  age: number;
  photo: string;
  registeredAt: string;
  likes: number;
  desiredSubcategoryIds: number[];
  createdSkillIds: number[];
  gender: 'male' | 'female';
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}
