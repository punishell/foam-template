import React from "react";
import { X } from 'lucide-react';
import { Button, Select, Input, Checkbox } from 'pakt-ui';
import { SideModal } from '@/components/common/side-modal';

export const WithdrawalModal = ({ isOpen, onChange }: { isOpen: boolean; onChange: (state: boolean) => void }) => {
  return (
    <SideModal isOpen={isOpen} onOpenChange={onChange} className="gap-9">
      <div className="flex gap-2 bg-primary-gradient items-center py-6 px-4 text-white">
        <button className="bg-white bg-opacity-10 h-10 w-10 border border-white border-opacity-25 rounded-lg flex items-center justify-center">
          <X size={24} />
        </button>
        <div className="flex flex-col grow text-center">
          <h3 className="text-2xl font-bold">Withdrawal</h3>
          <p>Withdraw funds to another wallet</p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6">
        <Select
          options={[
            { label: 'USDC', value: 'usdc' },
            { label: 'AVAX', value: 'avax' },
          ]}
          onChange={(value) => { }}
          label="Select Asset"
          placeholder="Choose Asset"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Wallet Address</span>
            <span className="text-title font-medium">Network: Avax C-Chain</span>
          </div>

          <div className="relative">
            <Input type="text" />
          </div>

          <span className="text-info text-left text-sm">
            Ensure you are sending to the right wallet address and on the Avax C-Chain. Sending to a wrong address or
            network can result in loss of funds
          </span>
        </div>

        <div className="relative">
          <NumericInput value="" onChange={() => { }} />
        </div>

        <div className="relative">
          <Input type="text" label="Password" />
        </div>

        <div className="my-2 flex cursor-pointer items-center gap-2">
          <Checkbox id="confirm-withdrawal" checked={true} onCheckedChange={() => { }} />
          <label htmlFor="confirm-withdrawal" className="cursor-pointer text-sm">
            I understand that I will be charged a 0.5% fee for this transaction
          </label>
        </div>

        <Button>Withdraw Funds</Button>
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
