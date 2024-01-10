"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ChevronLeft, Copy, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import QRCode from "react-qr-code";
import { useCopyToClipboard } from "usehooks-ts";
import { parseEther, parseUnits } from "viem";
import {
    configureChains,
    type Connector,
    createConfig,
    useAccount,
    useConnect,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    usePrepareSendTransaction,
    useSendTransaction,
    useSwitchNetwork,
    WagmiConfig,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import * as Tabs from "@radix-ui/react-tabs";
import { RaceBy } from "@uiball/loaders";
import { erc20ABI } from "@wagmi/core";
import { avalanche, avalancheFuji, base, baseGoerli } from "@wagmi/core/chains";

import { Spinner } from "@/components/common";
import { Modal } from "@/components/common/headless-modal";
import {
    type PostJobPaymentDetailsResponse,
    useConfirmJobPayment,
    useGetJobById,
    useInviteTalentToJob,
    usePostJobPaymentDetails,
} from "@/lib/api/job";
import { type PaymentCoinsProps, useGetPaymentCoins } from "@/lib/api/wallet";
import { type Job } from "@/lib/types";
import { cn } from "@/lib/utils";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [avalancheFuji, avalanche, base, baseGoerli],
    [publicProvider()],
);

const wagmiConfig = createConfig({
    connectors: [
        // new MetaMaskConnector({ chains }),
        new InjectedConnector({
            chains,
            options: {
                shimDisconnect: true,
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "",
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
});

const WALLET_LOGO: Record<string, string> = {
    MetaMask: "/icons/metamask.svg",
    "Core Wallet": "/icons/core-wallet.svg",
    WalletConnect: "/icons/wallet-connect.svg",
    "Coinbase Wallet": "/icons/coinbase-wallet.svg",
};

type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

// const SUPPORTED_COINS = {
//     USDC: "USDC",
//     AVAX: "AVAX",
// };

interface DepositToAddressProps {
    jobId: string;
    job: Job;
    amount: number;
    coin: SUPPORTED_COINS_TYPES;
    depositAddress: string;
    closeModel: () => void;
}

const DepositToAddress = ({
    amount,
    depositAddress,
    jobId,
    job,
    closeModel,
    coin,
}: DepositToAddressProps): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [value, copy] = useCopyToClipboard();
    const confirmPayment = useConfirmJobPayment();
    const talentId = searchParams.get("talent-id") ?? "";
    const inviteTalent = useInviteTalentToJob({ talentId, job });

    return (
        <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-[#87898E]">
                Copy the wallet address or scan QR code to make payment. Click I have made transfer to continue.
            </p>

            <div className="flex justify-between gap-2 rounded-2xl border border-primary bg-[#ECFCE5] px-4 py-6 text-primary">
                <span className="text-lg">Total Amount:</span>
                <span className="text-lg font-bold">
                    {amount} {coin}
                </span>
            </div>

            <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4">
                <span className="max-w-[250px] break-words text-sm">{depositAddress}</span>

                <button
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-primary !border-opacity-80 bg-[#ECFCE5] px-3 py-2 text-xs text-primary !text-opacity-80"
                    onClick={async () => copy(depositAddress)}
                    type="button"
                >
                    <Copy size={14} strokeWidth={2} />
                    <span>
                        {value !== undefined ? (
                            <span className="animate-pulse">Copied</span>
                        ) : (
                            <span className="animate-pulse">Copy</span>
                        )}
                    </span>
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-[#fcfcfc] px-4 py-4">
                <QRCode value={depositAddress} size={150} />
            </div>

            <Button
                onClick={() => {
                    confirmPayment.mutate(
                        { jobId },
                        {
                            onSuccess: () => {
                                if (talentId !== "") {
                                    inviteTalent.mutate(
                                        {
                                            jobId,
                                            talentId,
                                        },
                                        {
                                            onSuccess: () => {
                                                router.push(`/overview`);
                                            },
                                        },
                                    );
                                }
                                closeModel();
                                router.push(`/overview`);
                            },
                            onError: () => {},
                        },
                    );
                }}
                fullWidth
            >
                {confirmPayment.isLoading || inviteTalent.isLoading ? <Spinner /> : "I have made transfer"}
            </Button>
        </div>
    );
};

const WalletConnectorList: React.FC = () => {
    const { isConnected, connector: activeConnector } = useAccount();
    const { connect, connectors, isLoading, pendingConnector } = useConnect();
    return (
        <div className="flex flex-col gap-6">
            {/* @ts-expect-error -- Connector can't be used as types */}
            {connectors.map((connector: Connector) => {
                const isActive = isConnected && activeConnector?.id === connector.id;
                const logo = WALLET_LOGO[connector.name];

                return (
                    <button
                        key={connector.name}
                        type="button"
                        disabled={!connector.ready}
                        onClick={() => {
                            connect({ connector });
                        }}
                        className={`flex items-center justify-between rounded-2xl border border-[#DFDFE6] p-1 px-4 py-3 text-left duration-300 hover:border-primary hover:!border-opacity-30 ${
                            isActive ? "border-primary !border-opacity-60 bg-green-50" : "border-[#DFDFE6]"
                        }`}
                    >
                        <span className="flex w-full items-center gap-2">
                            <span>{connector.name}</span>
                            {isLoading && pendingConnector?.id === connector.id && (
                                <span className="animate-spin">
                                    <Loader2 size={16} />
                                </span>
                            )}
                        </span>

                        <span>{logo != null && <Image src={logo} width={20} height={20} alt="" />}</span>
                    </button>
                );
            })}
        </div>
    );
};

interface WalletDepositProps {
    jobId: string;
    amount: number;
    depositAddress: string;
    job: Job;
    chainId: number;
    // eslint-disable-next-line react/no-unused-prop-types
    closeModel: () => void;
    // eslint-disable-next-line react/no-unused-prop-types
    contractAddress?: string;
}

const DepositAvax = ({ depositAddress, amount, jobId, job, chainId }: WalletDepositProps): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const confirmPayment = useConfirmJobPayment();
    const talentId = searchParams.get("talent-id") ?? "";
    const inviteTalent = useInviteTalentToJob({ talentId, job });

    const { config } = usePrepareSendTransaction({
        chainId,
        to: depositAddress,
        value: parseEther(amount.toString()),
    });

    const { sendTransaction, isLoading } = useSendTransaction({
        ...config,
        onSuccess() {
            confirmPayment.mutate(
                { jobId },
                {
                    onSuccess: () => {
                        if (talentId !== "") {
                            inviteTalent.mutate(
                                {
                                    jobId,
                                    talentId,
                                },
                                {
                                    onSuccess: () => {
                                        router.push(`/overview`);
                                    },
                                },
                            );
                        }
                    },
                },
            );
        },
        onError(error) {
            console.error("send transaction error:", error);
        },
    });

    return (
        <div>
            <Button
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- !sendTransaction is not undefined
                disabled={!sendTransaction || isLoading || confirmPayment.isLoading}
                onClick={() => {
                    sendTransaction?.();
                }}
                fullWidth
            >
                <div className="flex items-center justify-center gap-2">
                    <span> Make Payment</span> <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};

const DepositUSDC = ({
    amount,
    depositAddress,
    jobId,
    job,
    contractAddress,
    chainId,
}: WalletDepositProps): React.JSX.Element => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const talentId = searchParams.get("talent-id") ?? "";
    const confirmPayment = useConfirmJobPayment();
    const inviteTalent = useInviteTalentToJob({ talentId, job });
    const [showReconfirmButton, setShowReconfirmButton] = useState(false);
    const amountToPay = parseUnits(amount.toString(), 6);
    const { config } = usePrepareContractWrite({
        abi: erc20ABI,
        chainId,
        functionName: "transfer",
        address: `0x${contractAddress?.substring(2)}`,
        args: [`0x${depositAddress.substring(2)}`, amountToPay],
    });

    const { write, isError, isLoading } = useContractWrite({
        ...config,
        onSuccess() {
            confirmPayment.mutate(
                { jobId, delay: 6000 },
                {
                    onSuccess: () => {
                        if (talentId !== "") {
                            inviteTalent.mutate(
                                {
                                    jobId,
                                    talentId,
                                },
                                {
                                    onSuccess: () => {
                                        router.push(`/overview`);
                                    },
                                },
                            );
                        }
                    },
                    onError: () => {
                        setShowReconfirmButton(true);
                    },
                },
            );
        },
        onError(error) {
            console.error("write error:", error);
        },
    });

    return (
        <div className="flex flex-col gap-2">
            {isError && (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500">
                    <span>An error occurred while making payment.</span>
                </div>
            )}

            {showReconfirmButton && (
                <Button
                    fullWidth
                    disabled={confirmPayment.isLoading}
                    onClick={() => {
                        confirmPayment.mutate(
                            { jobId, delay: 6000 },
                            {
                                onSuccess: () => {
                                    if (talentId !== "") {
                                        inviteTalent.mutate(
                                            {
                                                jobId,
                                                talentId,
                                            },
                                            {
                                                onSuccess: () => {
                                                    router.push(`/overview`);
                                                },
                                            },
                                        );
                                    }
                                },
                                onError: () => {
                                    setShowReconfirmButton(true);
                                },
                            },
                        );
                    }}
                >
                    {confirmPayment.isLoading ? <Spinner /> : "Confirm Payment"}
                </Button>
            )}

            <Button
                fullWidth
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- !write is not undefined
                disabled={!write || isLoading || confirmPayment.isLoading}
                onClick={() => {
                    write?.();
                }}
            >
                <div className="flex items-center justify-center gap-2">
                    <span> {confirmPayment.isLoading ? "Confirming Payment" : "Make Payment"}</span>{" "}
                    <span>{(isLoading || confirmPayment.isLoading) && <Spinner />}</span>
                </div>
            </Button>
        </div>
    );
};

interface PayWithWalletProps {
    jobId: string;
    job: Job;
    amount: number;
    coin: SUPPORTED_COINS_TYPES;
    depositAddress: string;
    contractAddress?: string;
    chainId: number;
    closeModel: () => void;
}

const PayWithWallet = ({
    amount,
    depositAddress,
    jobId,
    closeModel,
    coin,
    job,
    contractAddress,
    chainId,
}: PayWithWalletProps): React.JSX.Element => {
    const { chain } = useNetwork();
    const { isConnected } = useAccount();
    const isWrongChain = chain?.id !== chainId;

    const { switchNetwork } = useSwitchNetwork({ chainId });

    // switch network if wrong chain
    useEffect(() => {
        if (isWrongChain && switchNetwork != null) {
            switchNetwork();
        }
    }, [isConnected, isWrongChain, switchNetwork]);

    return (
        <div className="flex flex-col gap-8">
            <p className="text-center text-sm text-[#87898E]">
                By connecting a wallet, you agree to
                <span className="text-[#3772FF]"> Terms of Service </span>
                and acknowledge that you have read and understand the{" "}
                <span className="text-[#3772FF]">disclaimer.</span>
            </p>

            <WalletConnectorList />

            {coin === "AVAX" && (
                <DepositAvax
                    jobId={jobId}
                    amount={amount}
                    depositAddress={depositAddress}
                    closeModel={closeModel}
                    job={job}
                    chainId={chainId}
                />
            )}
            {coin === "USDC" && (
                <DepositUSDC
                    jobId={jobId}
                    amount={amount}
                    depositAddress={depositAddress}
                    closeModel={closeModel}
                    job={job}
                    contractAddress={contractAddress}
                    chainId={chainId}
                />
            )}
        </div>
    );
};

interface MakePaymentModalProps {
    jobId: string;
    job: Job;
    coinAmount: number;
    depositAddress: string;
    closeModal: () => void;
    coin: SUPPORTED_COINS_TYPES;
    chainId: number;
    contractAddress?: string;
}

const MakePaymentModal = ({
    closeModal,
    depositAddress,
    jobId,
    job,
    coinAmount,
    coin,
    contractAddress,
    chainId,
}: MakePaymentModalProps): React.JSX.Element => {
    return (
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6 rounded-2xl border bg-white p-6">
            <div className="flex w-full items-center justify-between">
                <h2 className="text-2xl font-bold text-title">Make Payment</h2>

                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label -- Error makes no sense for a button */}
                <button
                    className="rounded-full border border-[#DFDFE6] p-2 text-black duration-200 hover:border-danger hover:text-danger"
                    onClick={closeModal}
                    type="button"
                >
                    <X size={16} strokeWidth={2} />
                </button>
            </div>

            <div className="flex grow flex-col items-center justify-center">
                <Tabs.Root defaultValue="connect-wallet" className="flex flex-col gap-6">
                    <Tabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B]">
                        <Tabs.Trigger
                            className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                            value="connect-wallet"
                        >
                            Connect Wallet
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className="rounded-lg p-2 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                            value="deposit-to-address"
                        >
                            Deposit To Address
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="connect-wallet">
                        <PayWithWallet
                            jobId={jobId}
                            closeModel={closeModal}
                            amount={coinAmount}
                            depositAddress={depositAddress}
                            coin={coin}
                            contractAddress={contractAddress}
                            chainId={chainId}
                            job={job}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="deposit-to-address">
                        <DepositToAddress
                            jobId={jobId}
                            job={job}
                            coin={coin}
                            closeModel={closeModal}
                            amount={coinAmount}
                            depositAddress={depositAddress}
                        />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};

interface PaymentDetailsProps {
    jobId: string;
    job?: Job;
    coin: SUPPORTED_COINS_TYPES;
    paymentDetails?: PostJobPaymentDetailsResponse;
    isLoading: boolean;
    isError: boolean;
    errMsg?: string;
    contractAddress?: string;
}

const PaymentDetails = ({
    coin,
    jobId,
    isLoading,
    isError,
    errMsg,
    paymentDetails,
    job,
    contractAddress,
}: PaymentDetailsProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    if (isLoading)
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-line bg-slate-50">
                <RaceBy />
            </div>
        );

    if (isError || paymentDetails == null || job == null)
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle size={45} strokeWidth={2} />
                    <span>{errMsg ?? "Something went wrong. Please try again later."}</span>
                </div>
            </div>
        );
    const depositAddress = paymentDetails.address;

    return (
        <div className="flex w-full flex-col  gap-6">
            <div
                className={cn("flex flex-col gap-4 rounded-lg border border-[#198155] bg-[#ECFCE5] p-4 text-[#198155]")}
            >
                <h2 className="text-lg font-bold">Payment Details</h2>

                <div className="flex flex-col gap-6 text-lg">
                    <div className="flex items-center justify-between">
                        <span>Amount</span>
                        <span>${paymentDetails?.collectionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Talent Receives</span>
                        <span>${paymentDetails?.collectionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Transaction Fee</span>
                        <span>
                            ${Number(paymentDetails?.usdFee).toFixed(2)} ({paymentDetails?.feePercentage}%)
                        </span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                        <span>Total</span>
                        <span>
                            {paymentDetails?.amountToPay} {coin}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-[#FCFCFC] p-6">
                <div className="flex items-center gap-4">
                    <Image src="/icons/metamask.svg" alt="Coinbase" width={50} height={50} />
                    <Image src="/icons/coinbase.svg" alt="Coinbase" width={50} height={50} />
                    <Image src="/icons/wallet-connect.svg" alt="Coinbase" width={50} height={50} />
                </div>
                <p className="text-body">Connect your wallet of choice or pay with a deposit address.</p>
            </div>

            <Modal
                isOpen={isOpen}
                closeModal={() => {
                    setIsOpen(false);
                }}
                disableClickOutside
            >
                <MakePaymentModal
                    depositAddress={depositAddress}
                    job={job}
                    jobId={jobId}
                    closeModal={() => {
                        setIsOpen(false);
                    }}
                    coin={coin}
                    coinAmount={paymentDetails?.amountToPay}
                    contractAddress={contractAddress}
                    chainId={Number(paymentDetails?.chainId)}
                />
            </Modal>

            <Button
                fullWidth
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                Make Deposit
            </Button>
        </div>
    );
};

interface Props {
    params: {
        "job-id": string;
    };
}

export default function MakeDepositPage({ params }: Props): JSX.Element {
    const jobId = params["job-id"];
    const router = useRouter();
    const { data: job, isLoading, isFetched, isError } = useGetJobById({ jobId });
    const mutation = usePostJobPaymentDetails();
    const [paymentCoin, setPaymentCoin] = useState<SUPPORTED_COINS_TYPES>();
    const [contractAddress, setContractAddress] = useState<string>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: paymentCoinsData, isLoading: paymentCoinsLoading } = useGetPaymentCoins();

    const selectPaymentCoin = (coin: SUPPORTED_COINS_TYPES): void => {
        setPaymentCoin(coin);
        mutation.mutate({ jobId, coin });
    };

    const getCoinIcon = (coin: PaymentCoinsProps): string => coin.icon ?? "/icons/usdc-logo.svg";

    return (
        <WagmiConfig config={wagmiConfig as unknown}>
            <div className="flex flex-col gap-6 overflow-y-auto">
                <div>
                    <div className="flex items-center gap-1">
                        <ChevronLeft size={24} strokeWidth={2} onClick={router.back} className="cursor-pointer" />
                        <span className="text-2xl font-medium">Make Deposit</span>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-line bg-white p-6">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold">Escrow Payment</h2>
                            <p className="text-lg text-body">
                                Before an invitation is sent to talent, a client is required to deposit payment into a
                                secure escrow wallet. This payment safely lives on the blockchain and cannot be accessed
                                by Afro.Fund, nor Pakt, nor any third party.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold">Choose Payment Method</h2>
                            <div className="flex items-center gap-2">
                                {(paymentCoinsData ?? [])?.map((coin) => (
                                    <button
                                        key={coin.symbol + coin.contractAddress}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl border-[1.5px] border-line bg-white p-4 duration-200 hover:bg-green-50",
                                            {
                                                "border-secondary bg-green-50": paymentCoin === coin.symbol,
                                            },
                                        )}
                                        onClick={() => {
                                            selectPaymentCoin(coin.symbol as SUPPORTED_COINS_TYPES);
                                            setContractAddress(coin.contractAddress);
                                        }}
                                        type="button"
                                    >
                                        <Image src={getCoinIcon(coin)} alt="Coinbase" width={30} height={30} />
                                        <span className="text-lg font-bold">{coin.symbol.toUpperCase()}</span>
                                    </button>
                                ))}
                                {/* <button
                  className={cn(
                    'p-4 rounded-xl bg-white border-line flex items-center gap-2 border-[1.5px] hover:bg-green-50 duration-200',
                    {
                      'border-secondary bg-green-50': paymentCoin === 'AVAX',
                    },
                  )}
                  onClick={() => selectPaymentCoin('AVAX')}
                >
                  <Image src="/icons/avax-logo.svg" alt="Coinbase" width={30} height={30} />
                  <span className="font-bold text-lg">AVAX</span>
                </button> */}
                            </div>
                        </div>

                        {paymentCoin && (
                            <PaymentDetails
                                jobId={jobId}
                                coin={paymentCoin}
                                paymentDetails={mutation.data}
                                isLoading={mutation.isLoading || (!isFetched && isLoading)}
                                isError={mutation.isError || isError}
                                errMsg={mutation.error?.message}
                                contractAddress={contractAddress}
                                job={job}
                            />
                        )}
                    </div>
                </div>
            </div>
        </WagmiConfig>
    );
}
