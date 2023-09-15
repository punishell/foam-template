'use client';
import React from "react";
import * as z from 'zod';
import { X } from 'lucide-react';
import Image from "next/image";
import { Button, Select, Input, Checkbox } from 'pakt-ui';
import { SubmitHandler, useForm } from 'react-hook-form';

import { SideModal } from '@/components/common/side-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { avax, usdc } from "@/images/coins";
import { useWithdraw } from "@/lib/api/withdraw";
import { Spinner } from "../common";

const withdrawFormSchema = z.object({
  coin: z.string().min(1, 'Password is required'),
  address: z.string().min(1, 'Address is required'),
  amount: z.number().min(1, 'Amount is required'),
  password: z.string().min(1, "password is required"),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
});

type withdrawFormValues = z.infer<typeof withdrawFormSchema>;

export const WithdrawalModal = ({ isOpen, onChange, wallets }: { isOpen: boolean; onChange: (state: boolean) => void, wallets: any[], }) => {
  const withdraw = useWithdraw();
  const form = useForm<withdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
  });

  const onSubmit: SubmitHandler<withdrawFormValues> = (values) => {
    // withdraw.mutate(values, {
    //   onSuccess: (data) => {
    //     if (data.isVerified) {
    //       // @ts-ignore
    //       setUser(data);
    //       setCookie(AUTH_TOKEN_KEY, data.token);
    //       return router.push('/overview');
    //     }

    //     router.push(
    //       `/signup/verify?${createQueryStrings([
    //         { name: 'email', value: data.email },
    //         { name: 'token', value: data.tempToken?.token || '' },
    //       ])}`,
    //     );
    //   },
    // });
  };

  const renderOption = (coin: string, balance: string) => (<div className="flex flex-row text-lg"><Image width={25} height={25} className="w-[25px] h-[25px] mr-4" src={coin == "avax" ? avax : usdc} alt={`logo for currency`} />{coin.toUpperCase()} (${balance})</div>)

  console.log("vaa", form.getValues(), form.formState.errors, withdraw.isLoading, !form.formState.isValid)

  return (
    <SideModal isOpen={isOpen} onOpenChange={onChange} className="gap-9">
      <div className="flex gap-2 bg-primary-gradient items-center py-6 px-4 text-white">
        <button className="bg-white bg-opacity-10 h-10 w-10 border border-white border-opacity-25 rounded-lg flex items-center justify-center" onClick={() => onChange(false)}>
          <X size={24} />
        </button>
        <div className="flex flex-col grow text-center">
          <h3 className="text-2xl font-bold">Withdrawal</h3>
          <p>Withdraw funds to another wallet</p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6">
        <Select
          // @ts-ignore
          options={wallets.map((s: any) => {
            return {
              label: renderOption(s.coin, s.usdValue),
              value: s.coin.toUpperCase(),
            }
          })}
          label="Select Asset"
          placeholder="Choose Asset"
          onChange={(e) => form.setValue("coin", e)}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Wallet Address</span>
            <span className="text-title font-medium">Network: Avax C-Chain</span>
          </div>

          <div className="relative">
            <Input type="text" {...form.register('address')} />
          </div>

          <span className="text-info text-left text-sm">
            Ensure you are sending to the right wallet address and on the Avax C-Chain. Sending to a wrong address or
            network can result in loss of funds
          </span>
        </div>

        <div className="relative">
          <NumericInput value="" onChange={(e) => form.setValue("amount", Number(e))} />
        </div>

        <div className="relative">
          <Input type="text" label="Password"  {...form.register('password')} />
        </div>

        <div className="my-2 flex cursor-pointer items-center gap-2">
          <Checkbox id="confirm-withdrawal"
            checked={form.getValues().confirm}
            // @ts-ignore
            onCheckedChange={(e) => form.setValue("confirm", e)} />
          <label htmlFor="confirm-withdrawal" className="cursor-pointer text-sm">
            I understand that I will be charged a 0.5% fee for this transaction
          </label>
        </div>

        <Button disabled={withdraw.isLoading || !form.formState.isValid} fullWidth>{withdraw.isLoading ? <Spinner /> : "Withdraw Funds"}</Button>
      </div>
    </SideModal>
  );
};

const NumericInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [inputValue, setInputValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(/^[0-9]*[.,]?[0-9]*$/)) {
      setInputValue(value);
      onChange(value);
    }
  };

  return (
    <Input
      type="text"
      label="Amount"
      autoCorrect="off"
      autoComplete="off"
      spellCheck="false"
      value={inputValue}
      onChange={handleChange}
    />
  );
};
