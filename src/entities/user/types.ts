export type UserGender = 'male' | 'female';

export interface User {
  id: number;
  rawId: string | number;
  name: string;
  birthDate: string;
  cityId: number;
  photo: string;
  about: string;
  gender: UserGender;
  registeredAt: string;
  likes: number;
  desiredSubcategoryIds: number[];
  createdSkillIds: number[];
  favoriteSkillIds: number[];
}
