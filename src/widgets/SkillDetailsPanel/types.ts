import type { ReactNode } from 'react';

export interface SkillDetailsPanelProps {
  headerTitle?: string;
  headerDescription?: string;
  title: string;
  meta?: string;
  description?: string;
  images: string[];
  actions?: ReactNode;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  topActions?: ReactNode;
  className?: string;
}
