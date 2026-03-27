import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectIsRegisterStep1Valid,
  selectIsRegisterStep2Valid,
  selectRegisterMeta,
  setCurrentStep,
  setStep3Field,
  submitRegistration,
} from '@/features/auth/register-draft';
import { fileToBase64 } from '@/shared/lib/file/fileToBase64';
import { AuthLayout } from '@/app/layouts/auth-layout';
import AuthInfoCard from '@/widgets/AuthInfoCard';
import schoolBoard from '@/assets/school-board.svg';
import RegStep3Form, { type SkillFormDataToApprove } from '@/widgets/RegStep3Form';
import RegApproveSkillModal from '@/widgets/RegApproveSkillModal';
import SkillCreatedSuccessNotificationModal from '@/widgets/SkillCreatedSuccessNotificationModal';

export const RegPageStep3: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { restoreSession } = useAuth();
  const canOpenStep1 = useAppSelector(selectIsRegisterStep1Valid);
  const canOpenStep2 = useAppSelector(selectIsRegisterStep2Valid);
  const meta = useAppSelector(selectRegisterMeta);
  const [isModalOpen, setIModalOpen] = useState(false);
  const [skillData, setSkillData] = useState<SkillFormDataToApprove | null>(null);
  const [isSkillCreatedSuccessModalOpen, setIsSkillCreatedSuccessModalOpen] = useState(false);
  const [hasCompletedRegistration, setHasCompletedRegistration] = useState(false);
  const [redirectPathAfterSuccess, setRedirectPathAfterSuccess] = useState('/');

  useEffect(() => {
    dispatch(setCurrentStep(3));
  }, [dispatch]);

  if (!hasCompletedRegistration && !canOpenStep1) {
    return <Navigate to="/register" replace />;
  }

  if (!hasCompletedRegistration && !canOpenStep2) {
    return <Navigate to="/register/step-2" replace />;
  }

  const handleFormSubmit = async (data: SkillFormDataToApprove) => {
    const pictures = await Promise.all(data.pictures.map((picture) => fileToBase64(picture)));

    dispatch(setStep3Field({ field: 'teachingSkillTitle', value: data.name }));
    dispatch(setStep3Field({ field: 'teachingCategoryId', value: data.categoryId }));
    dispatch(setStep3Field({ field: 'teachingSubcategoryId', value: data.subcategoryId }));
    dispatch(setStep3Field({ field: 'description', value: data.description }));
    dispatch(setStep3Field({ field: 'pictures', value: pictures }));

    setSkillData(data);
    setIModalOpen(true);
  };

  const handleModalBack = () => {
    setIModalOpen(false);
  };

  const handleModalApprove = async () => {
    if (!skillData || meta.isSubmitting) {
      return;
    }

    try {
      const nextRedirectPath = meta.redirectPath || '/';
      const resultAction = await dispatch(submitRegistration());
      unwrapResult(resultAction);
      await restoreSession();
      setRedirectPathAfterSuccess(nextRedirectPath);
      setHasCompletedRegistration(true);
      setIModalOpen(false);
      setIsSkillCreatedSuccessModalOpen(true);
    } catch {
      // submitError is stored in redux
    }
  };

  const handleSkillCreatedSuccessApprove = () => {
    setIsSkillCreatedSuccessModalOpen(false);
    navigate(redirectPathAfterSuccess, { replace: true });
  };

  return (
    <>
      <AuthLayout
        stepInfo={{
          current: 3,
          total: 3,
        }}
        leftSlot={<RegStep3Form onSubmit={(data) => void handleFormSubmit(data)} />}
        rightSlot={
          <AuthInfoCard
            title="Укажите, чем вы готовы поделиться"
            text="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
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
          onApprove={() => void handleModalApprove()}
          error={meta.submitError}
          isSubmitting={meta.isSubmitting}
        />
      )}

      <SkillCreatedSuccessNotificationModal
        isOpen={isSkillCreatedSuccessModalOpen}
        onClickBtn={handleSkillCreatedSuccessApprove}
      />
    </>
  );
};

export default RegPageStep3;
