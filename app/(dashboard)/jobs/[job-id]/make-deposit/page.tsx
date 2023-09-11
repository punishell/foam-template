'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { cn } from '@/lib/utils';
import { parseEther } from 'viem';
import QRCode from 'react-qr-code';
import abi from '@/lib/abi/erc20.json';
import { Copy, Loader2, X } from 'lucide-react';
import { Modal } from '@/components/common';
import * as Tabs from '@radix-ui/react-tabs';
import { Spinner } from '@/components/common';
import { useCopyToClipboard } from 'usehooks-ts';

import { avalancheFuji } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

const { chains, publicClient } = configureChains(
  [avalancheFuji],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_ID as string,
    }),
    publicProvider(),
  ],
);

const wagmiConfig = createConfig({
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    // new MetaMaskConnector({
    //   chains,
    // }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Pakt',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
      },
    }),
  ],
  publicClient,
});

const CHAIN_ID = 43113;
const USDC_CONTRACT_ADDRESS = '0xa1ef10416440a13d555b9dc78f81153d13340588';

const WALLET_LOGO: Record<string, string> = {
  MetaMask: '/icons/metamask.svg',
  'Core Wallet': '/icons/core-wallet.svg',
  WalletConnect: '/icons/wallet-connect.svg',
  'Coinbase Wallet': '/icons/coinbase-wallet.svg',
};

interface MakePaymentModalProps {
  appId: string;
  closeModal: () => void;
  gotoNextStep?: () => void;
}

interface Props {
  params: {
    'job-id': string;
  };
}

export default function MakeDepositPage({ params }: Props) {
  const jobId = params['job-id'];
  const [isOpen, setIsOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'usdc' | 'avax' | null>();

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="flex">
        <div className="w-full max-w-3xl bg-white p-6 rounded-3xl gap-6 flex flex-col border border-line">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Escrow Payment</h2>
            <p className="text-body text-lg">
              Every contracted engagement requires payment to be deposited in an escrow wallet prior to commencement of
              work. This payment lives on the blockchain and cannot be accessed by Afro.Fund, nor Pakt, nor any third
              party.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Choose Payment Method</h2>
            <div className="flex gap-2 items-center">
              <button
                className={cn(
                  'p-4 rounded-xl bg-white border-line flex items-center gap-2 border-[1.5px] hover:bg-gray-100 duration-200',
                  {
                    'border-secondary bg-green-50': paymentMethod === 'usdc',
                  },
                )}
                onClick={() => setPaymentMethod('usdc')}
              >
                <Image src="/icons/usdc-logo.svg" alt="Coinbase" width={30} height={30} />
                <span className="font-bold text-lg">USDC</span>
              </button>
              <button
                className={cn(
                  'p-4 rounded-xl bg-white border-line flex items-center gap-2 border-[1.5px] hover:bg-gray-100 duration-200',
                  {
                    'border-secondary bg-green-50': paymentMethod === 'avax',
                  },
                )}
                onClick={() => setPaymentMethod('avax')}
              >
                <Image src="/icons/avax-logo.svg" alt="Coinbase" width={30} height={30} />
                <span className="font-bold text-lg">AVAX</span>
              </button>
            </div>
          </div>

          <div className={cn('bg-[#ECFCE5] border border-[#198155] rounded-lg p-4 flex flex-col gap-4 text-[#198155]')}>
            <h2 className="text-lg font-bold">Payment Details</h2>

            <div className="flex flex-col gap-6 text-lg">
              <div className="flex items-center justify-between">
                <span>Amount</span>
                <span>$7000.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Talent Recieves</span>
                <span>$7000.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transaction Fee</span>
                <span>$350.00(5%)</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span>$7000.00</span>
              </div>
            </div>
          </div>

          <div className="border border-line p-6 bg-[#FCFCFC] rounded-2xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src="/icons/metamask.svg" alt="Coinbase" width={50} height={50} />
              <Image src="/icons/coinbase.svg" alt="Coinbase" width={50} height={50} />
              <Image src="/icons/wallet-connect.svg" alt="Coinbase" width={50} height={50} />
            </div>
            <p className="text-body">Connect your wallet of choice or pay with a deposit address.</p>
          </div>

          <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <MakePaymentModal appId="xxx" closeModal={() => setIsOpen(false)} />
          </Modal>

          <Button fullWidth onClick={() => setIsOpen(true)}>
            Make Deposit
          </Button>
        </div>
      </div>
    </WagmiConfig>
  );
}

interface MakePaymentModalProps {
  appId: string;
  closeModal: () => void;
}

const MakePaymentModal = ({ appId, closeModal }: MakePaymentModalProps) => {
  // const { data: depositDetails, isLoading } = useGetDepositDetails({ appUUID: appId });

  return (
    <div className="flex w-full flex-col gap-6 bg-white p-6 border rounded-2xl max-w-[400px] mx-auto">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold text-title">Make Payment</h2>

        <button className="rounded-full border border-[#DFDFE6] p-2 text-black">
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="flex grow flex-col items-center justify-center">
        <Tabs.Root defaultValue="connect-wallet" className="flex flex-col gap-6">
          <Tabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
            <Tabs.Trigger
              className="radix-state-active:bg-white rounded-lg p-2 px-2 duration-200 hover:bg-white"
              value="connect-wallet"
            >
              Connect Wallet
            </Tabs.Trigger>
            <Tabs.Trigger
              className="radix-state-active:bg-white rounded-lg p-2 px-2 duration-200 hover:bg-white"
              value="deposit-to-address"
            >
              Deposit To Address
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="connect-wallet">
            <PayWithWallet appId={appId} closeModel={closeModal} amount={500} depositAddress={'xxx'} />
          </Tabs.Content>
          <Tabs.Content value="deposit-to-address">
            <DepositToAddress appId={appId} closeModel={closeModal} amount={500} depositAddress={'xxx'} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

interface DepositToAddressProps {
  appId: string;
  amount: number;
  depositAddress: string;
  closeModel: () => void;
}

const DepositToAddress = ({ amount, depositAddress, appId, closeModel }: DepositToAddressProps) => {
  const [value, copy] = useCopyToClipboard();
  //   const { mutateAsync: confirmDeposit, isLoading: isConfirming } = useConfirmDeposit();

  //   const handleConfirmDeposit = async () => {
  //     try {
  //       const { data } = await confirmDeposit({ appUUID: appId, amount: amount, depositingAddress: depositAddress });
  //       if (data?.status === 'success') {
  //         gotoNextStep && gotoNextStep();
  //         closeModel();
  //       }
  //     } catch (error) {
  //       console.log('::error::', error);
  //     }
  //   };

  // TODO
  const isConfirming = false;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-[#87898E]">
        Copy the wallet address or scan QR code to make payment. Click I have made transfer to continue.
      </p>

      <div className="border-primary text-primary flex justify-between gap-2 rounded-2xl border bg-[#ECFCE5] px-4 py-6">
        <span className="text-lg">Total Amount:</span>
        <span className="text-2xl font-bold">${amount}</span>
      </div>

      <div className="border-line flex w-full items-center justify-between gap-2 rounded-2xl border bg-[#fcfcfc] px-4 py-4">
        <span className="max-w-[250px] break-words text-sm">{depositAddress}</span>

        <button
          className="text-primary border-primary flex shrink-0 items-center gap-1 rounded-lg border !border-opacity-80 bg-[#ECFCE5] px-3 py-2 text-xs !text-opacity-80"
          onClick={() => copy(depositAddress)}
        >
          <Copy size={14} strokeWidth={2} />
          <span>
            {value ? <span className="animate-pulse">Copied</span> : <span className="animate-pulse">Copy</span>}
          </span>
        </button>
      </div>

      <div className="border-line flex items-center justify-center gap-2 rounded-2xl border bg-[#fcfcfc] px-4 py-4">
        <QRCode value={depositAddress} size={150} />
      </div>

      <Button
        onClick={
          () => {}
          //   handleConfirmDeposit
        }
        fullWidth
      >
        {isConfirming ? <Spinner /> : 'I have made transfer'}
      </Button>
    </div>
  );
};

interface PayWithWalletProps {
  amount: number;
  depositAddress: string;
  appId: string;
  closeModel: () => void;
  gotoNextStep?: () => void;
}

const PayWithWallet = ({ amount, depositAddress, appId, gotoNextStep, closeModel }: PayWithWalletProps) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    chainId: CHAIN_ID,
  });
  const isWrongChain = chain?.unsupported;
  const { isConnected, connector: activeConnector } = useAccount();
  // const { mutateAsync: confirmDeposit, isLoading: isConfirming } = useConfirmDeposit();
  const { connect, connectors, isLoading: isConnecting, pendingConnector } = useConnect();

  React.useEffect(() => {
    if (isWrongChain && switchNetwork) {
      switchNetwork();
    }
  }, [isConnected, isWrongChain, switchNetwork]);

  //   const handleConfirmDeposit = async () => {
  //     try {
  //       const { data } = await confirmDeposit({ appUUID: appId, amount: amount, depositingAddress: depositAddress });
  //       if (data?.status === 'success') {
  //         gotoNextStep && gotoNextStep();
  //         closeModel();
  //       }
  //     } catch (error) {
  //       console.log('::error::', error);
  //     }
  //   };

  //   const { config, error } = usePrepareContractWrite({
  //     abi: contract.abi,
  //     address: CONTRACT_ADDRESS,
  //     functionName: 'transfer',
  //     chainId: CHAIN_ID,
  //     args: [depositAddress, parseEther(`${amount}`, 'wei')],
  //   });

  //   const { write, isSuccess, isLoading } = useContractWrite(config);

  // useeffect to confirm deposit
  //   React.useEffect(() => {
  //     if (isSuccess) {
  //       handleConfirmDeposit();
  //     }
  //   }, [isSuccess]);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-sm text-[#87898E]">
        By connecting a wallet, you agree to
        <span className="text-[#3772FF]"> Terms of Service </span>
        and acknowledge that you have read and understand the <span className="text-[#3772FF]">disclaimer.</span>
      </p>

      <div className="flex flex-col gap-6">
        {connectors.map((connector: Connector) => {
          const isActive = isConnected && activeConnector?.id === connector.id;
          const logo = WALLET_LOGO[connector.name];

          return (
            <button
              key={connector.name}
              type="button"
              disabled={!connector.ready}
              onClick={() => connect({ connector })}
              className={`hover:border-primary flex items-center justify-between rounded-2xl border border-[#DFDFE6] p-1 px-4 py-3 text-left duration-300 hover:!border-opacity-30 ${
                isActive ? 'border-primary !border-opacity-60' : 'border-[#DFDFE6]'
              }`}
            >
              <span className="flex w-full items-center gap-2">
                <span>{connector.name}</span>
                {isConnecting && pendingConnector?.id === connector.id && (
                  <span className="animate-spin">{<Loader2 size={16} />}</span>
                )}
              </span>

              <span>{logo && <Image src={logo} width={20} height={20} alt="" />}</span>
            </button>
          );
        })}
      </div>
      <div>
        {
          //   <Button disabled={!write || isConfirming || isLoading} onClick={write} fullWidth>
          //     {isConfirming ? <Spinner /> : 'Make Payment'}
          //   </Button>
        }

        <Button fullWidth>Make Payment</Button>
        {/* {isSuccess && (
            <Button onClick={handleConfirmDeposit} fullWidth>
              {isConfirming ? <Spinner /> : "Confirm Deposit"}
            </Button>
          )} */}
      </div>
    </div>
  );
};
