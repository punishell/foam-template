"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { avalanche, avalancheFuji, base, baseGoerli } from "@wagmi/core/chains";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById, usePostJobPaymentDetails } from "@/lib/api/job";
import { type PaymentCoinsProps, useGetPaymentCoins } from "@/lib/api/wallet";
import { cn } from "@/lib/utils";
import { PaymentDetails } from "@/components/jobs/desktop-view/make-deposit";
import { Breadcrumb } from "@/components/common/breadcrumb";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [avalancheFuji, avalanche, base, baseGoerli],
    [publicProvider()]
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
type SUPPORTED_COINS_TYPES = "USDC" | "AVAX";

// const SUPPORTED_COINS = {
//     USDC: "USDC",
//     AVAX: "AVAX",
// };

interface Props {
    params: {
        "job-id": string;
        "talent-id": string;
    };
}

export default function MakeDepositPage({ params }: Props): JSX.Element {
    const jobId = params["job-id"];
    const talentId = params["talent-id"];
    const router = useRouter();
    const {
        data: job,
        isLoading,
        isFetched,
        isError,
    } = useGetJobById({ jobId });
    const mutation = usePostJobPaymentDetails();
    const [paymentCoin, setPaymentCoin] = useState<SUPPORTED_COINS_TYPES>();
    const [contractAddress, setContractAddress] = useState<string>();
    // @ts-expect-error --- Unused variable
    const { data: paymentCoinsData, isLoading: paymentCoinsLoading } =
        useGetPaymentCoins();

    const selectPaymentCoin = (coin: SUPPORTED_COINS_TYPES): void => {
        setPaymentCoin(coin);
        mutation.mutate({ jobId, coin });
    };

    const getCoinIcon = (coin: PaymentCoinsProps): string =>
        coin.icon ?? "/icons/usdc-logo.svg";

    return (
        <WagmiConfig config={wagmiConfig as unknown}>
            <Breadcrumb
                items={[
                    {
                        label: "Talent",
                        action: () => {
                            router.push(`/talents`);
                        },
                    },
                    {
                        label: "Make Payment",
                        active: true,
                        action: () => {
                            router.push(
                                `/jobs/${jobId}/make-deposit?talent-id=${talentId}`
                            );
                        },
                    },
                ]}
            />
            <div className="flex flex-col gap-6 overflow-y-auto">
                <div className="hidden items-center gap-1 sm:flex">
                    <ChevronLeft
                        size={24}
                        strokeWidth={2}
                        onClick={router.back}
                        className="cursor-pointer"
                    />
                    <span className="text-2xl font-medium">Make Deposit</span>
                </div>

                <div className="flex">
                    <div className="flex w-full flex-col gap-6 bg-white p-6 sm:max-w-3xl sm:rounded-3xl sm:border sm:border-line">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold">
                                Escrow Payment
                            </h2>
                            <p className="text-lg text-body">
                                Before an invitation is sent to talent, a client
                                is required to deposit payment into a secure
                                escrow wallet. This payment safely lives on the
                                blockchain and cannot be accessed by Afro.Fund,
                                nor Pakt, nor any third party.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold">
                                Choose Payment Method
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                {(paymentCoinsData ?? [])?.map((coin) => (
                                    <button
                                        key={coin.symbol + coin.contractAddress}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl border-[1.5px] border-line bg-white p-4 duration-200 hover:bg-green-50",
                                            {
                                                "border-secondary bg-green-50":
                                                    paymentCoin === coin.symbol,
                                            }
                                        )}
                                        onClick={() => {
                                            selectPaymentCoin(
                                                coin.symbol as SUPPORTED_COINS_TYPES
                                            );
                                            setContractAddress(
                                                coin.contractAddress
                                            );
                                        }}
                                        type="button"
                                    >
                                        <Image
                                            src={getCoinIcon(coin)}
                                            alt="Coinbase"
                                            width={30}
                                            height={30}
                                        />
                                        <span className="text-lg font-bold">
                                            {coin.symbol.toUpperCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paymentCoin && (
                            <PaymentDetails
                                jobId={jobId}
                                coin={paymentCoin}
                                paymentDetails={mutation.data}
                                isLoading={
                                    mutation.isLoading ||
                                    (!isFetched && isLoading)
                                }
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
