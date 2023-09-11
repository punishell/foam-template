import { zodResolver } from "@hookform/resolvers/zod";
import { InputErrorMessage, Modal, SlideItemProps, Slider, Spinner } from "@/components/common";
// import { useAnswerSecurityQuestion, useGetSecurityQuestions, useSetUserSecurityQuestion } from "@/lib/api";
import { useSecurityQuestion2FAState } from "@/lib/store";
import Image from "next/image";
import { Button, Checkbox, Input, Select, Text } from "pakt-ui";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { XCircleIcon } from "lucide-react";
import { useDeActivate2FA, useGetSecurityQuestion, useInitialize2FA } from "@/lib/api/account";
import { TWO_FA_CONSTANTS } from "@/lib/constants";
import { toast } from "@/components/common/toaster";

interface SecurityQuestion2FA {
  isEnabled: boolean;
}

export const SecurityQuestion2FA = ({ isEnabled }: SecurityQuestion2FA) => {
  const { isModalOpen, closeModal, openModal } = useSecurityQuestion2FAState();

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
          <Image src="/icons/security-question.svg" width={50} height={70} alt="" />
        </div>
        <Text.p size="lg">Security Question</Text.p>
      </button>

      <Modal isOpen={isModalOpen} onOpenChange={closeModal} className="bg-white rounded-xl p-8">
        {isEnabled ? (
          <Slider items={[{ SlideItem: DeactivateSecurityQuestion }, { SlideItem: DeactivateSecuritySuccess }]} />
        ) : (
          <Slider items={[{ SlideItem: ActivateSecurityQuestion }, { SlideItem: ActivateSecuritySuccess }]} />
        )}
      </Modal>
    </React.Fragment>
  );
};

interface Option {
  label: string;
  value: string;
}

const securityQuestionsSchema = z
  .object({
    question: z.string().nonempty("Select a question"),
    answer: z.string().nonempty("Answer cannot be empty"),
    confirmAnswer: z.string().nonempty("Confirm answer cannot be empty"),
  })
  .refine((data) => data.answer === data.confirmAnswer, {
    path: ["confirmAnswer"],
    message: "Answers do not match",
  });

type SecurityQuestionFormValues = z.infer<typeof securityQuestionsSchema>;

const ActivateSecurityQuestion = ({ goToNextSlide }: SlideItemProps) => {
  const { closeModal } = useSecurityQuestion2FAState();
  const { data: securityQuestionsResponse, refetch, isFetched, isFetching } = useGetSecurityQuestion();
  const { mutateAsync: setSecurityQuestion, isLoading } = useInitialize2FA();

  const questionOptions = useMemo(() => (securityQuestionsResponse || []).map((s: string) => ({
    label: s,
    value: s,
  })), [securityQuestionsResponse])

  const {
    register,
    handleSubmit,

    formState: { errors },
    control,
  } = useForm<SecurityQuestionFormValues>({
    resolver: zodResolver(securityQuestionsSchema),
  });

  useEffect(() => {
    if (!isFetched) refetch();
  }, [isFetched])

  const onSubmit: SubmitHandler<SecurityQuestionFormValues> = async ({ answer, question }) => {
    await setSecurityQuestion({ type: TWO_FA_CONSTANTS.SECURITY_QUESTION, securityQuestion: question, securityAnswer: answer });
    toast.success("Two FA Security Successfully Activate")
    goToNextSlide();
  };

  return (
    <div className="flex flex-col shrink-0 w-full items-center gap-6">
      <div className="flex flex-col gap-2 text-center">
        <div className="flex flex-row justify-between w-full">
          <Text.h3 size="xs">Security Question</Text.h3>
          <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
        </div>
        <Text.p size="base">
          Your security question is asked and you&lsquo;ll provide the matching answer whenever you want to sign in
        </Text.p>
      </div>

      {isFetched ? <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <Controller
            // name="question"
            control={control}
            {...register("question")}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  label="Select Question"
                  placeholder="Select Question"
                  options={questionOptions}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              );
            }}
          />
          <InputErrorMessage message={errors.question?.message} />
        </div>

        <div className="relative">
          <Input label="Enter Answer" placeholder="Enter your answer" {...register("answer")} />
          <InputErrorMessage message={errors.answer?.message} />
        </div>

        <div className="relative">
          <Input label="Confirm Answer" placeholder="Type Your Answer Again" {...register("confirmAnswer")} />
          <InputErrorMessage message={errors.confirmAnswer?.message} />
        </div>

        <Button className="w-full" type="submit" fullWidth>
          {isLoading ? <Spinner /> : "Set Security Question"}
        </Button>
      </form> :
        <div className="flex min-h-[500px] w-full items-center justify-center">
        </div>}
    </div>
  );
};

const ActivateSecuritySuccess = ({ }: SlideItemProps) => {
  const { closeModal } = useSecurityQuestion2FAState();
  return (
    <div className="flex w-full shrink-0 flex-col items-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Security Question</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>

      <Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
      <Text.p size="base" className="text-center">
        You have successfully secured your account with 2FA. You will be asked to input the answer to your security question
      </Text.p>
      <Button className="mt-auto w-full" onClick={closeModal} fullWidth>
        Done
      </Button>
    </div>
  );
};

const DeactivateSecurityQuestion = ({ goToNextSlide }: SlideItemProps) => {
  const { closeModal } = useSecurityQuestion2FAState();
  const { mutateAsync, isLoading } = useDeActivate2FA();
  const [answer, setAnswer] = useState("");

  const handleDeactivate = async () => {
    if (!answer || answer == "") return toast.error("Answer is required");
    await mutateAsync({ code: answer });
    goToNextSlide();
  };

  return (
    <div className="flex flex-col shrink-0 w-full items-center gap-6">
      <div className="flex flex-row justify-between w-full" >
        <Text.h3 size="xs">Deactivate Security Question</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>
      <Text.p size="sm">
        Your security question is asked and you&lsquo;ll provide the matching answer whenever you want to sign in
      </Text.p>

      <div className="flex w-full max-w-full flex-col gap-6">
        <Input label="Enter Answer" placeholder="Enter your answer" onChange={(e) => setAnswer(e.target.value)} />
      </div>
      <Button className="w-full" onClick={handleDeactivate} fullWidth>
        {isLoading ? <Spinner /> : "Deactivate"}
      </Button>
    </div >
  );
};

const DeactivateSecuritySuccess = ({ goToNextSlide }: SlideItemProps) => {
  const { closeModal } = useSecurityQuestion2FAState();
  return (
    <div className="flex w-full shrink-0 flex-col items-center">
      <div className="flex flex-row justify-between w-full">
        <Text.h3 size="xs">Security Question</Text.h3>
        <XCircleIcon className="text-body my-auto cursor-pointer" onClick={closeModal} />
      </div>

      <Image src="/icons/success.gif" className="my-auto" width={230} height={230} alt="" />
      <Text.p size="base" className="text-center">
        You have successfully deactivate your account with 2FA.
      </Text.p>
      <Button className="mt-auto w-full" onClick={closeModal} fullWidth>
        Done
      </Button>
    </div>
  );
};
