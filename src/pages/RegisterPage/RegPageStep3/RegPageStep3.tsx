import React from 'react';
import { AuthLayout } from '@/app/layouts/auth-layout';
import AuthInfoCard from '@/widgets/AuthInfoCard';
import schoolBoard from '@/assets/school-board.svg';
import RegStep3Form from '@/widgets/RegStep3Form';

export const RegPageStep3: React.FC = () => {
  return (
    <AuthLayout
      stepInfo={{
        current: 3,
        total: 3,
      }}
      leftSlot={<RegStep3Form />}
      rightSlot={
        <AuthInfoCard
          title="Укажите, чем вы готовы поделиться"
          text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
          picture={schoolBoard}
          pictureAlt="Лампочка SkillSwap"
        />
      }
    />
  );
};

export default RegPageStep3;
