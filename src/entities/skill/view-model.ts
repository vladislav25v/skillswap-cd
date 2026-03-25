import type { UserCardViewModel } from '@/entities/user/view-model';

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

export interface SkillPageViewModel {
  skillId: number;
  ownerUserId: number;
  details: SkillDetailsViewModel;
  ownerCard: UserCardViewModel;
  similarUserCards: UserCardViewModel[];
}
