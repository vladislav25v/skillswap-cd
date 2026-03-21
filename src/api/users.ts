const API_BASE_URL = 'http://localhost:3001';

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

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

export interface Skill {
  id: number;
  title: string;
  subcategoryId: number;
  description: string;
  images: string[];
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON but got ${contentType}`);
  }

  return response.json();
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(response);
};

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const response = await fetch(`${API_BASE_URL}/subcategories`);
  return handleResponse(response);
};

export const getCities = async (): Promise<City[]> => {
  const response = await fetch(`${API_BASE_URL}/cities`);
  return handleResponse(response);
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse(response);
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await fetch(`${API_BASE_URL}/skills`);
  return handleResponse(response);
};
