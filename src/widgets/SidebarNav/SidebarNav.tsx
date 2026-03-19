import React from 'react';
import AsideLink from '@/shared/ui/AsideLink';
import { Heart, Lightbulb, Mail, MessageSquareText, UserRound } from 'lucide-react';
import styles from './SidebarNav.module.css';

export interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  return (
    <ul className={[styles.nav, className].filter(Boolean).join(' ')}>
      <li>
        <AsideLink to={'empty'} icon={<Mail className={styles.icon} />}>
          Заявки
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'empty'} icon={<MessageSquareText className={styles.icon} />}>
          Мои обмены
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'favorites'} icon={<Heart className={styles.icon} />}>
          Избранное
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'empty'} icon={<Lightbulb className={styles.icon} />}>
          Мои навыки
        </AsideLink>
      </li>
      <li>
        <AsideLink to={''} icon={<UserRound className={styles.icon} />}>
          Личные данные
        </AsideLink>
      </li>
    </ul>
  );
};

export default SidebarNav;
