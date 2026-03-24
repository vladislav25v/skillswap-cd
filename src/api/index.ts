export { API_BASE_URL } from '@/api/config';
export { request } from '@/api/request';

export {
  ACCOUNT_API_PATH,
  createAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
} from '@/api/account';
export type { CreateAccountPayload } from '@/api/account';

export {
  USER_API_PATH,
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from '@/api/user';
export type { CreateUserPayload, UpdateUserPayload } from '@/api/user';

export { getSkills } from '@/api/skill';
export { getCategories } from '@/api/category';
export { getSubcategories } from '@/api/subcategory';
export { getCities } from '@/api/city';
