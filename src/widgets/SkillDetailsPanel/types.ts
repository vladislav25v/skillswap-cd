import type { ReactNode } from 'react';

export interface SkillDetailsPanelProps {
  headerTitle?: string;
  headerDescription?: string;
  title: string;
  meta?: string;
  description?: string;
  images: string[];
  imageAlt?: string;
  actions?: ReactNode;
  showFavoriteButton?: boolean;
  showTopActions?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  className?: string;
  panelClassName?: string;
  contentClassName?: string;
}
