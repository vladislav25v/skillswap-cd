export interface SkillDetailsViewModel {
  id: number;
  title: string;
  meta?: string;
  description?: string;
  images: string[];
  isFavorite?: boolean;
  headerTitle?: string;
  headerDescription?: string;
}
