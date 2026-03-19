export type UserGender = 'male' | 'female';

export interface User {
  id: number;
  name: string;
  cityId: number;
  age: number;
  photo: string;
  gender: UserGender;
  registeredAt: string;
  likes: number;
  desiredSubcategoryIds: number[];
  createdSkillIds: number[];
}
