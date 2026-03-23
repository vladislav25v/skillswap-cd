import React from 'react';
import { CardsGridContainer } from '@/shared/ui/CardsGridContainer';

export interface ProfileFavoritesProps {
  className?: string;
}

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ className }) => {
  return (
    <CardsGridContainer className={className}>
      <div>каточка 1</div>
      <div>каточка 2</div>
      <div>каточка 3</div>
      <div>каточка 4</div>
      <div>каточка 5</div>
      <div>каточка 6</div>
    </CardsGridContainer>
  );
};

export default ProfileFavorites;
