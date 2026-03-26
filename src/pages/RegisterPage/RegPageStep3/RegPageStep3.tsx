import React, { useState } from 'react';
import { AuthLayout } from '@/app/layouts/auth-layout';
import AuthInfoCard from '@/widgets/AuthInfoCard';
import schoolBoard from '@/assets/school-board.svg';
import RegStep3Form, { type SkillFormDataToApprove } from '@/widgets/RegStep3Form';
import RegApproveSkillModal from '@/widgets/RegApproveSkillModal';

export const RegPageStep3: React.FC = () => {
  const [isModalOpen, setIModalOpen] = useState(false);
  const [skillData, setSkillData] = useState<SkillFormDataToApprove | null>(null);

  const handleFormSubmit = (data: SkillFormDataToApprove) => {
    setSkillData(data);
    setIModalOpen(true);
  };

  const handleModalBack = () => {
    setIModalOpen(false);
  };

  const handleModalApprove = () => {
    alert('TODO: Ваше предложение создано \nТеперь вы можете предложить обмен');
  };

  return (
    <>
      <AuthLayout
        stepInfo={{
          current: 3,
          total: 3,
        }}
        leftSlot={<RegStep3Form onSubmit={handleFormSubmit} />}
        rightSlot={
          <AuthInfoCard
            title="Укажите, чем вы готовы поделиться"
            text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
            picture={schoolBoard}
            pictureAlt="Доска"
          />
        }
      />

      {skillData && (
        <RegApproveSkillModal
          isOpen={isModalOpen}
          data={skillData}
          onBack={handleModalBack}
          onApprove={handleModalApprove}
        />
      )}
    </>
  );
};

export default RegPageStep3;
