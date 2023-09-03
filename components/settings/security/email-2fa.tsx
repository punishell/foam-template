import { zodResolver } from "@hookform/resolvers/zod";
import { InputErrorMessage, Modal, OtpInput, SlideItemProps, Slider, Spinner } from "@/components/common";
// import { useActivateEmailOTP, useDeactivateEmailOTP, useIssueEmailOTP, useSendEmailOTP } from "@/lib/api";
import { useEmail2FAState } from "@/lib/store";
import Image from "next/image";
import { Button, Checkbox, Text } from "pakt-ui";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Timer, XCircleIcon } from "lucide-react";

interface Email2FAProps {
  isEnabled: boolean;
}

export const Email2FA = ({ isEnabled }: Email2FAProps) => {
  const { isModalOpen, closeModal, openModal } = useEmail2FAState();

  return (
    <React.Fragment>
      <button
        onClick={openModal}
        className="relative flex shrink grow basis-0 cursor-pointer flex-col items-center gap-6 rounded-md border-transparent bg-[#F2F2F2] px-7 py-9"
      >
        <div className="absolute right-4 top-4">
          <Checkbox checked={isEnabled} />
        </div>
        <div className="flex h-[75px] items-center">
          <Image src="/icons/email-auth.svg" width={76} height={76} alt="" />
        </div>
        <Text.p size="lg">Email Auth</Text.p>
      </button>

      <Modal isOpen={isModalOpen} onOpenChange={closeModal} className="bg-white rounded-2xl p-6">
        {isEnabled ? (
          <Slider
            items={[
              { SlideItem: InitiateDeactivateOTP },
              { SlideItem: VerifyDeactivateOTP },
              { SlideItem: OTPDeactivateSuccess },
            ]}
          />
        ) : (
          <Slider
            items={[
              { SlideItem: InitiateActivateOTP },
              { SlideItem: VerifyActivateOTP },
              { SlideItem: OTPActivateSuccess },
            ]}
          />
        )}
      </Modal>
    </React.Fragment>
  );
};

const InitiateActivateOTP = ({ goToNextSlide }: SlideItemProps) => {
  // const { userEmail } = useAuthState();
  // const { mutateAsync, isLoading } = useIssueEmailOTP();

  const handleInitiateOtp = async () => {
    try {
      // const { status } = await mutateAsync();
      // if (status === 200) {
        goToNextSlide();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col gap-2 text-center">
        <Text.h3 size="xs">Email Authentication</Text.h3>
        <Text.p size="base">
          An OTP will be sent to <span className="text-success">{"userEmail"}</span>
        </Text.p>
      </div>
      <div className="m-auto flex items-center">
        <Image src="/icons/email-auth.svg" width={150} height={210} alt="" />
      </div>

      <Button onClick={handleInitiateOtp} className="w-full" fullWidth>
        {/* {isLoading ? <Spinner /> : "Send OTP"} */}
        Next
      </Button>
    </div>
  );
};

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

const VerifyActivateOTP = ({ goToNextSlide, goToPreviousSlide }: SlideItemProps) => {
  // const { userEmail } = useAuthState();
  // const { mutateAsync, isLoading } = useActivateEmailOTP();
  const { closeModal } = useEmail2FAState();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EmailOtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
    try {
      // const { status } = await mutateAsync({ token: otp });
      // if (status === 200) {
        goToNextSlide();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8">
      <div className="flex flex-col gap-2 text-center w-full">
        <div className="flex flex-row justify-between w-full">
          <ChevronLeft className="cursor-pointer" onClick={goToPreviousSlide} />
          <Text.h3 size="xs">Email Authentication</Text.h3>
          <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
        </div>
        <Text.p size="base">
          Enter the 6 digit code sent to <span className="text-success">{"userEmail"}</span>
        </Text.p>
      </div>

      <form className="flex flex-col items-center gap-8 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value } }) => <OtpInput value={value} onChange={onChange} numInputs={6} />}
          />
          <div className="flex justify-center text-center my-2"><InputErrorMessage message={errors.otp?.message} /></div>
        </div>

        <Button type="submit" className="w-full" fullWidth>
          {/* {isLoading ? <Spinner /> : "Activate"} */}
          Confirm
        </Button>
        <Text.p>0:45</Text.p>
        <Button type="button" variant="outline" className="!border-body !rounded-xl" size="xs" disabled={true} >
          <div className="flex flex-row gap-2"><Timer size={15} /> Resend OTP</div>
        </Button>
      </form>
    </div>
  );
};

const OTPActivateSuccess = () => {
  const { closeModal } = useEmail2FAState();

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-4">
      <div className="flex flex-col gap-2 text-center">
        <Text.h3 size="xs">Email Authentication</Text.h3>
        <Text.p size="sm">You have successfully secured your account with 2FA.</Text.p>
      </div>

      <Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
      <Button className="w-full" onClick={closeModal} fullWidth>
        Done
      </Button>
    </div>
  );
};

// DEACTIVATION

const InitiateDeactivateOTP = ({ goToNextSlide }: SlideItemProps) => {
  // const { userEmail } = useAuthState();
  // const { mutateAsync, isLoading } = useSendEmailOTP();

  const handleInitiateOtp = async () => {
    try {
    //   const { status } = await mutateAsync({ reason: "deactivate" });
    //   if (status === 200) {
    //     goToNextSlide();
    //   }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8">
      <div className="flex flex-col gap-2 text-center">
        <Text.h3 size="xs">Deactivate Email OTP</Text.h3>
        <Text.p size="sm">
          An OTP will be sent to <span className="text-success">{"userEmail"}</span>
        </Text.p>
      </div>

      <Button onClick={handleInitiateOtp} className="w-full">
        {/* {isLoading ? <Spinner /> : "Send OTP"} */}
      </Button>
    </div>
  );
};

const VerifyDeactivateOTP = ({ goToNextSlide }: SlideItemProps) => {
  // const { userEmail } = useAuthState();
  // const { mutateAsync, isLoading } = useDeactivateEmailOTP();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EmailOtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
    try {
      // const { status } = await mutateAsync({ token: otp });
      // if (status === 200) {
      //   goToNextSlide();
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-8">
      <div className="flex flex-col gap-2 text-center">
        <Text.h3 size="xs">Email</Text.h3>
        <Text.p size="sm">
          Enter the 6 digit code sent to <span className="text-success">{"userEmail"}</span>
        </Text.p>
      </div>

      <form className="flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value } }) => <OtpInput value={value} onChange={onChange} numInputs={6} />}
          />
          <InputErrorMessage message={errors.otp?.message} />
        </div>

        <Button type="submit" className="w-full">
          {/* {isLoading ? <Spinner /> : "Deactivate"} */}
        </Button>
      </form>
    </div>
  );
};

const OTPDeactivateSuccess = () => {
  const { closeModal } = useEmail2FAState();

  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-4">
      <div className="flex flex-col gap-2 text-center">
        <Text.h3 size="xs">Email</Text.h3>
        <Text.p size="sm">You have successfully deactivated Email OTP.</Text.p>
      </div>

      <Button className="w-full" onClick={closeModal}>
        Done
      </Button>
    </div>
  );
};
