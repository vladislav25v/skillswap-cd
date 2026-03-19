import { NavLink, type NavLinkProps } from 'react-router-dom';
import styles from './AsideLink.module.css';
import React from 'react';

export type AsideLinkProps = NavLinkProps & {
  icon?: React.ReactNode;
};

const AsideLink: React.FC<AsideLinkProps> = ({ icon, children, ...rest }) => {
  return (
    <NavLink
      {...rest}
      className={({ isActive }) => {
        return [styles.asideLink, isActive && styles.asideLinkActive].join(' ');
      }}
    >
      {(props) => {
        return (
          <>
            {icon}
            {typeof children === 'function' ? children(props) : children}
          </>
        );
      }}
    </NavLink>
  );
};

export default AsideLink;
