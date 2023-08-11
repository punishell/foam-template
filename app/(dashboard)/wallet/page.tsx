'use client';

import React from 'react';
import Image from 'next/image';
import { Bell, X } from 'lucide-react';
import { Button, Select, Input, Checkbox } from 'pakt-ui';
import { formatUsd } from '@/lib/utils';
import * as Tabs from '@radix-ui/react-tabs';
import { Table } from '@/components/common/table';
import { Chart } from '@/components/common/chart';
import { SideModal } from '@/components/common/side-modal';
import { ArrowUpRight, ArrowDownLeft, Circle } from 'lucide-react';
import { ColumnDef, PaginationState } from '@tanstack/react-table';

export default function Wallet() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-3xl text-title font-bold">Wallet</div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 text-3xl text-title">
            <UserBalance />
            <span>|</span> <span className="text-body">Balance</span>
          </div>
          <button className="flex gap-2 items-center text-primary text-sm font-bold bg-[#008D6C1A] p-3 rounded-full">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="gap-6 flex flex-col">
        <div className="grid grid-cols-2 gap-6">
          <div className=" gap-6 items-center grid grid-rows-2">
            <div className="bg-[#ECFCE5] text-primary items-center w-full border border-primary rounded-lg px-6 py-8 flex gap-2 justify-between">
              <div className="flex-col gap-2 flex">
                <span className="text-sm">Total Wallet Balance</span>
                <span className="text-3xl font-semibold">{formatUsd(5000)}</span>
              </div>
              <Button size="md" onClick={() => setIsOpen(true)}>
                Withdraw
              </Button>
              <WithdrawalModal isOpen={isOpen} onChange={setIsOpen} />
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-[#F9F6FE] p-4 w-full h-full rounded-lg border border-[#5538EE] flex gap-2 items-center">
                <Image src="/icons/usdc-logo.svg" width={75} height={75} alt="" />

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-body text-sm">USDC Wallet Balance</span>
                    <span className="text-2xl text-title font-semibold">14,250</span>
                  </div>

                  <span className="mt-auto text-body text-sm">{formatUsd(500)}</span>
                </div>
              </div>
              <div className="bg-[#FEF4E3] p-4 w-full h-full rounded-lg border-[#A05E03] border flex gap-2 items-center">
                <Image src="/icons/avax-logo.svg" width={75} height={75} alt="" />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-body text-sm">Avax Wallet Balance</span>
                    <span className="text-2xl text-title font-semibold">14,250</span>
                  </div>

                  <span className="mt-auto text-body text-sm">{formatUsd(500)}</span>
                </div>
              </div>
            </div>
          </div>
          <WalletBalanceChart />
        </div>
        <WalletTransactions />
      </div>
    </div>
  );
}

import { UserBalance } from '@/components/common/user-balance';

const CHART_DATA = [
  { amt: 0, date: 'Sunday' },
  { amt: 0, date: 'Monday' },
  { amt: 2400, date: 'Tuesday' },
  { amt: 3000, date: 'Wednesday' },
  { amt: 1400, date: 'Thursday' },
  { amt: 5000, date: 'Friday' },
  { amt: 2400, date: 'Saturday' },
];

const WalletBalanceChart = () => {
  return (
    <Tabs.Root defaultValue="week" className="bg-white rounded-lg border border-line p-2 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg text-title font-medium">Balance</span>

        <Tabs.List className="flex gap-1 rounded-lg bg-[#F0F2F5] p-1 px-2 text-xs text-[#828A9B]">
          <Tabs.Trigger
            className="radix-state-active:bg-white rounded-lg p-1 px-2 duration-200 hover:bg-white"
            value="week"
          >
            1 Week
          </Tabs.Trigger>
          <Tabs.Trigger
            className="radix-state-active:bg-white rounded-lg p-1 px-2 duration-200 hover:bg-white"
            value="month"
          >
            1 Month
          </Tabs.Trigger>
          <Tabs.Trigger
            className="radix-state-active:bg-white rounded-lg p-1 px-2 duration-200 hover:bg-white"
            value="year"
          >
            1 Year
          </Tabs.Trigger>
        </Tabs.List>
      </div>
      <div className="h-full">
        <Tabs.Content value="week" className="h-full">
          <Chart data={CHART_DATA} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
        <Tabs.Content value="month" className="h-full">
          <Chart data={CHART_DATA} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
        <Tabs.Content value="year" className="h-full">
          <Chart data={CHART_DATA} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

type TransactionType = 'withdrawal' | 'deposit';
type TransactionStatus = 'processing' | 'pending' | 'completed' | 'failed';
interface WalletTransactions {
  date: string;
  amount: string;
  description: string;
  coin: string;
  usdValue: string;
  type: TransactionType;
  status: TransactionStatus;
}

const TABLE_COLUMNS: ColumnDef<WalletTransactions>[] = [
  {
    header: 'Date',
    accessorFn: (data) => data.date,
  },
  {
    header: 'Type',
    accessorFn: (data) => data.type,
    cell: ({ getValue }) => <TransactionType type={getValue<TransactionType>()} />,
  },
  {
    header: 'Amount',
    accessorFn: (data) => data.amount,
  },
  {
    header: 'Description',
    accessorFn: (data) => data.description,
  },
  {
    header: 'Coin',
    accessorFn: (data) => data.coin,
  },
  {
    header: 'USD Value',
    accessorFn: (data) => data.usdValue,
  },
  {
    header: 'Status',
    accessorFn: (data) => data.status,
    cell: ({ getValue }) => <TransactionStatus status={getValue<TransactionStatus>()} />,
  },
];

const TRANSACTION_DATA: WalletTransactions[] = [
  {
    date: '12/12/2021',
    amount: '0.00000',
    description: 'Deposit',
    coin: 'USDC',
    usdValue: '0.00',
    type: 'deposit',
    status: 'completed',
  },
  {
    date: '12/12/2021',
    amount: '0.000',
    description: 'Withdrawal',
    coin: 'USDC',
    usdValue: '0.00',
    type: 'withdrawal',
    status: 'pending',
  },
  {
    date: '12/12/2021',
    amount: '0.00000',
    description: 'Withdrawal',
    coin: 'USDC',
    usdValue: '0.00',
    type: 'withdrawal',
    status: 'processing',
  },
  {
    date: '12/12/2021',
    amount: '0.00000',
    description: 'Deposit',
    coin: 'USDC',
    usdValue: '0.00',
    type: 'deposit',
    status: 'completed',
  },
  {
    date: '12/12/2021',
    amount: '0.000',
    description: 'Withdrawal',
    coin: 'USDC',
    usdValue: '0.00',
    type: 'withdrawal',
    status: 'pending',
  },
];

const WalletTransactions = () => {
  return (
    <div className="border-line flex flex-col gap-4 rounded-lg border bg-white px-6 py-6 w-full max-w-full">
      <h3 className="text-base font-semibold">Wallet Transactions</h3>

      <Table
        data={TRANSACTION_DATA}
        columns={TABLE_COLUMNS}
        pageCount={1}
        setPagination={() => {}}
        pagination={{ pageIndex: 1, pageSize: 1 }}
      />
    </div>
  );
};

type TransactionStatusColors = { [key in TransactionStatus]: { bgColor: string; textColor: string } };

const TRANSACTION_STATUS_COLORS: TransactionStatusColors = {
  failed: { bgColor: 'bg-danger', textColor: 'text-danger' },
  completed: { bgColor: 'bg-success', textColor: 'text-success' },
  pending: { bgColor: 'bg-yellow-500', textColor: 'text-yellow-700' },
  processing: { bgColor: 'bg-yellow-500', textColor: 'text-yellow-700' },
};

const TransactionStatus = ({ status }: { status: TransactionStatus }) => (
  <div
    className={`${
      TRANSACTION_STATUS_COLORS[status].bgColor || 'bg-gray-300'
    } flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
  >
    <span className={`text-sm ${TRANSACTION_STATUS_COLORS[status].textColor || 'text-title'}`}>{status}</span>
  </div>
);

const TransactionType = ({ type }: { type: TransactionType }) => {
  let color: string;
  let Icon: React.ElementType;

  switch (type) {
    case 'deposit':
      color = 'success';
      Icon = ArrowUpRight;
      break;
    case 'withdrawal':
      color = 'danger';
      Icon = ArrowDownLeft;
      break;
    default:
      color = 'gray-300';
      Icon = Circle;
      break;
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}>
        <Icon className={`text-${color}`} size={12} />
      </div>
      <span className="capitalize text-sm">{type}</span>
    </div>
  );
};

const WithdrawalModal = ({ isOpen, onChange }: { isOpen: boolean; onChange: (state: boolean) => void }) => {
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
          onChange={(value) => {}}
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
          <NumericInput value="" onChange={() => {}} />
        </div>

        <div className="relative">
          <Input type="text" label="Password" />
        </div>

        <div className="my-2 flex cursor-pointer items-center gap-2">
          <Checkbox id="confirm-withdrawal" checked={true} onCheckedChange={() => {}} />
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
