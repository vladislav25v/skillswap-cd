import React from 'react';
import AsideLink from '@/shared/ui/AsideLink';
import { Heart, Lightbulb, Mail, MessageSquareText, UserRound } from 'lucide-react';
import styles from './AsideNav.module.css';
import clsx from 'clsx';

export interface AsideNavProps {
  className?: string;
}

const AsideNav: React.FC<AsideNavProps> = ({ className }) => {
  return (
    <ul className={clsx(styles.nav, className)}>
      <li>
        <AsideLink to={'requests'} icon={<Mail className={styles.icon} />}>
          Заявки
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'exchanges'} icon={<MessageSquareText className={styles.icon} />}>
          Мои обмены
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'favorites'} icon={<Heart className={styles.icon} />}>
          Избранное
        </AsideLink>
      </li>
      <li>
        <AsideLink to={'skills'} icon={<Lightbulb className={styles.icon} />}>
          Мои навыки
        </AsideLink>
      </li>
      <li>
        <AsideLink to={''} end icon={<UserRound className={styles.icon} />}>
          Личные данные
        </AsideLink>
      </li>
    </ul>
  );
};

export default AsideNav;
