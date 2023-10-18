import { zodResolver } from '@hookform/resolvers/zod';
import { InputErrorMessage, Modal, OtpInput, SlideItemProps, Slider, Spinner } from '@/components/common';
// import { useActivateAuthApp2FA, useDeactivateAuthApp2FA, useInitializeAuthApp2FA } from "@/lib/api";
import { useAuthApp2FAState } from '@/lib/store';
import Image from 'next/image';
import { Button, Checkbox, CopyToClipboard, Text } from 'pakt-ui';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, XCircleIcon } from 'lucide-react';
import { useActivate2FA, useDeActivate2FA, useGetAccount, useInitialize2FA } from '@/lib/api/account';
import { TWO_FA_CONSTANTS } from '@/lib/constants';
import { toast } from '@/components/common/toaster';

interface AuthApp2FA {
  isEnabled: boolean;
  disabled?: boolean;
}

export const AuthApp2FA = ({ isEnabled, disabled }: AuthApp2FA) => {
  const { isModalOpen, closeModal, openModal } = useAuthApp2FAState();
  const [isActive, _setIsActive] = useState(isEnabled);
  useEffect(() => {
    if (!isModalOpen) _setIsActive(isEnabled);
  }, [isEnabled]);

  useEffect(() => {
    if (!isModalOpen) _setIsActive(isEnabled);
  }, [isModalOpen]);

  return (
    <React.Fragment>
      <button
        onClick={openModal}
        className="relative flex shrink grow basis-0 cursor-pointer flex-col items-center gap-6 rounded-md border-transparent bg-[#F2F2F2] px-7 py-9 disabled:opacity-[0.5] disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <div className="absolute right-4 top-4">
          <Checkbox checked={isEnabled} />
        </div>
        <div className="flex h-[75px] items-center">
          <Image src="/icons/authenticator-app.svg" width={76} height={76} alt="" />
        </div>
        <Text.p size="lg">Authenticator app</Text.p>
      </button>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        className="bg-white h-fit rounded-2xl p-6"
        disableClickOutside
      >
        {isActive ? (
          <Slider items={[{ SlideItem: VerifyDeactivateAuthApp }, { SlideItem: DeactivateAuthAppSuccess }]} />
        ) : (
          <Slider
            items={[
              { SlideItem: InitiateAuthApp },
              { SlideItem: ScanAuthApp },
              { SlideItem: VerifyActivateAuthApp },
              { SlideItem: ActivateAuthAppSuccess },
            ]}
          />
        )}
      </Modal>
    </React.Fragment>
  );
};

// Activate
const InitiateAuthApp = ({ goToNextSlide }: SlideItemProps) => {
  const { mutateAsync, isLoading } = useInitialize2FA();
  const { setSecret, setQrCode, closeModal } = useAuthApp2FAState();

  const handleInitiateAuthApp = async () => {
    try {
      const data = await mutateAsync({ type: TWO_FA_CONSTANTS.AUTHENTICATOR });
      console.log(data);
      if (data.qrCodeUrl) {
        setSecret(data?.secret || 'A5treyQJHS-JHFNKE-OPJ0unekVyt');
        setQrCode(data.qrCodeUrl);
        goToNextSlide();
      } else toast.error('An Error Occurred, Try Again!!!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-14 text-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Authenticator App</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>
      <Text.p size="base" className="max-w-xs">
        To begin, you will need to install an Authenticator app on your phone.
      </Text.p>
      <div className="my-auto flex -translate-x-7 items-center">
        <Image src="/icons/authenticator-app.svg" width={150} height={210} alt="" />
      </div>
      <Button onClick={handleInitiateAuthApp} className="mt-auto w-full" fullWidth>
        {isLoading ? <Spinner /> : 'Next'}
      </Button>
    </div>
  );
};

const ScanAuthApp = ({ goToNextSlide }: SlideItemProps) => {
  const { secret, qrCode, closeModal } = useAuthApp2FAState();
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8 text-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Authenticator App</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>
      <Text.p size="base">Scan this QR in your Authenticator application</Text.p>
      <Image src={qrCode} width={200} height={200} alt="" />
      <div className="flex flex-col gap-2">
        <Text.p size="sm">Or copy this key</Text.p>
        <CopyToClipboard text={secret} />
      </div>
      <Button className="mt-auto w-full" onClick={goToNextSlide} fullWidth>
        Next
      </Button>
    </div>
  );
};

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

type AuthAppOtpFormValues = z.infer<typeof otpSchema>;

const VerifyActivateAuthApp = ({ goToNextSlide, goToPreviousSlide }: SlideItemProps) => {
  const { closeModal } = useAuthApp2FAState();
  const { mutate, isLoading } = useActivate2FA();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AuthAppOtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<AuthAppOtpFormValues> = async ({ otp }) => {
    return mutate(
      { code: otp },
      {
        onSuccess: () => goToNextSlide(),
      },
    );
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center text-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between w-full">
          <ChevronLeft className="cursor-pointer" onClick={goToPreviousSlide} />
          <Text.h3 size="xs">Authenticator App</Text.h3>
          <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
        </div>
        <Text.p size="base">Enter the 6 digit code generated by your Authenticator app</Text.p>
      </div>

      <form className="flex grow flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative m-auto translate-y-10">
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value } }) => <OtpInput value={value} onChange={onChange} numInputs={6} />}
          />
          <div className="flex justify-center text-center my-2">
            <InputErrorMessage message={errors.otp?.message} />
          </div>
        </div>

        <Button className="mt-auto w-full justify-end self-end justify-self-end" fullWidth>
          {isLoading ? <Spinner /> : 'Activate'}
        </Button>
      </form>
    </div>
  );
};

const ActivateAuthAppSuccess = () => {
  const { closeModal } = useAuthApp2FAState();
  const { refetch: fetchAccount, isFetching } = useGetAccount();
  const Close = async () => {
    if (!isFetching) fetchAccount();
    return closeModal();
  };
  return (
    <div className="flex w-full shrink-0 flex-col items-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Authenticator App</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={Close} />
      </div>

      <Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
      <Text.p size="base" className="text-center">
        You have successfully secured your account with 2FA. You will input your Authentication App’s generated code
        each time you want to login or make a withdrawal.
      </Text.p>
      <Button className="mt-auto w-full" onClick={Close} fullWidth>
        Done
      </Button>
    </div>
  );
};

// Deactivate
const VerifyDeactivateAuthApp = ({ goToNextSlide }: SlideItemProps) => {
  const { closeModal } = useAuthApp2FAState();
  const { mutate, isLoading } = useDeActivate2FA();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AuthAppOtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<AuthAppOtpFormValues> = async ({ otp }) => {
    return mutate(
      { code: otp },
      {
        onSuccess: () => goToNextSlide(),
      },
    );
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8 text-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Authenticator App</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>
      <Text.p size="base">Enter the 6 digit code </Text.p>
      <form className="flex grow flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative translate-y-10">
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value } }) => <OtpInput value={value} onChange={onChange} numInputs={6} />}
          />
          <InputErrorMessage message={errors.otp?.message} />
        </div>

        <Button className="mt-auto w-full justify-end self-end justify-self-end" fullWidth>
          {isLoading ? <Spinner /> : 'Deactivate'}
        </Button>
      </form>
    </div>
  );
};

const DeactivateAuthAppSuccess = () => {
  const { closeModal } = useAuthApp2FAState();
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-4">
      <div className="flex flex-row gap-2 text-center">
        <Text.h3 size="xs">Authenticator App</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>
      <Text.p size="sm">You have successfully deactivated Auth 2FA.</Text.p>

      <Image src="/icons/success.gif" className="my-auto" width={200} height={200} alt="" />

      <Button className="mt-auto w-full" onClick={closeModal} fullWidth>
        Done
      </Button>
    </div>
  );
};
