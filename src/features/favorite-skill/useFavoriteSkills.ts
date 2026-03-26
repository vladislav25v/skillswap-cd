import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import { buildRedirectPath } from '@/features/auth/navigation';

export const useFavoriteSkills = () => {
  const { isAuthenticated, user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const favoriteSkillIds = user?.favoriteSkillIds ?? [];

  const isSkillFavorite = (skillId: number) => favoriteSkillIds.includes(skillId);

  const toggleSkillFavorite = async (skillId: number) => {
    if (!isAuthenticated || !user) {
      navigate('/login', {
        state: {
          from: buildRedirectPath(location),
        },
      });
      return false;
    }

    const nextFavoriteSkillIds = isSkillFavorite(skillId)
      ? favoriteSkillIds.filter((id) => id !== skillId)
      : [...favoriteSkillIds, skillId];

    const result = await updateUserData({
      favoriteSkillIds: nextFavoriteSkillIds,
    });

    return result.ok;
  };

  return {
    favoriteSkillIds,
    isSkillFavorite,
    toggleSkillFavorite,
  };
};
