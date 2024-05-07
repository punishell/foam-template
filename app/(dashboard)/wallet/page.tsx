"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "pakt-ui";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { WalletBalanceChart } from "@/components/wallet/chart";
import { WithdrawalModal } from "@/components/wallet/withdrawal-modal";
import { useGetActiveRPC, useGetWalletDetails } from "@/lib/api/wallet";
import { formatUsd } from "@/lib/utils";
import Kyc from "@/components/kyc";
import { WalletTransactions } from "@/components/wallet/transactions";
import { MobileWalletTransactions } from "@/components/wallet/transactions-mobile";

interface WalletProps {
    _id: string;
    amount: number;
    usdValue: number;
    coin: string;
    icon: string;
}

export default function WalletPage(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const mobile = useMediaQuery("(max-width: 640px)");

    const { data: walletData } = useGetWalletDetails();
    const wallets: WalletProps[] = walletData?.data.data.wallets ?? [];
    const totalWalletBalance =
        walletData?.data.data.totalWalletBalance ?? "0.00";

    const { data: rpcData } = useGetActiveRPC();

    const chainName = rpcData?.rpcName ?? "";

    const getWalletIcon = (wallet: {
        _id: string;
        amount: number;
        usdValue: number;
        coin: string;
        icon: string;
    }): string => {
        return wallet?.icon ?? "/icons/usdc-logo.svg";
    };

    return (
        <div className="flex h-full flex-col overflow-auto lg:gap-6">
            <div className="px-4 pt-4 text-2xl font-bold leading-[31.20px] tracking-wide text-gray-800 sm:hidden">
                Earnings
            </div>
            <Kyc />
            <div className="flex h-full flex-col gap-6">
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6 max-sm:px-4">
                    <div className=" grid grid-rows-2 items-center gap-6 max-sm:mb-4">
                        <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-primary bg-[#ECFCE5] px-6 py-8 text-primary">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm">
                                    Total Wallet Balance
                                </span>
                                <span className="text-3xl font-semibold">
                                    {formatUsd(
                                        parseFloat(totalWalletBalance) ?? 0.0
                                    )}
                                </span>
                            </div>
                            <Button
                                size="md"
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                            >
                                Withdraw
                            </Button>
                            <WithdrawalModal
                                isOpen={isOpen}
                                onChange={setIsOpen}
                                wallets={wallets}
                                network={chainName}
                            />
                        </div>
                        <div className="grid h-full grid-cols-2 gap-6">
                            <div
                                className="flex h-full w-full flex-col items-start gap-2 rounded-lg border border-[#5538EE] bg-[#F9F6FE] p-4 sm:flex-row sm:items-center"
                                style={{
                                    background: "#F9F6FE",
                                    borderColor: "#5538EE",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={getWalletIcon(
                                            wallets[1] as WalletProps
                                        )}
                                        width={75}
                                        height={75}
                                        alt=""
                                        className="h-[32px] w-[32px] rounded-full sm:h-[75px] sm:w-[75px]"
                                    />
                                    <span className="block text-xs text-gray-500 sm:hidden">
                                        {wallets?.[1]?.coin.toUpperCase()}{" "}
                                        Wallet Balance
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="hidden text-sm text-body sm:block">
                                        {wallets?.[1]?.coin.toUpperCase()}{" "}
                                        Wallet Balance
                                    </span>
                                    <span className="text-xl font-semibold text-title sm:text-2xl">
                                        {wallets[0]?.amount ?? "0.00"}
                                    </span>
                                    <span className="mt-auto text-sm text-body">
                                        {formatUsd(
                                            (wallets[1]?.usdValue as number) ??
                                                0.0
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-full w-full flex-col items-start gap-2 rounded-lg border border-[#A05E03] bg-[#FEF4E3] p-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={getWalletIcon(
                                            wallets[0] as WalletProps
                                        )}
                                        width={75}
                                        height={75}
                                        alt=""
                                        className="h-[32px] w-[32px] rounded-full sm:h-[75px] sm:w-[75px]"
                                    />
                                    <span className="block text-xs text-gray-500 sm:hidden">
                                        {wallets[0]?.coin.toUpperCase()} Wallet
                                        Balance
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="hidden text-sm text-body sm:block">
                                        {wallets[0]?.coin.toUpperCase()} Wallet
                                        Balance
                                    </span>
                                    <span className="text-xl font-semibold text-title sm:text-2xl">
                                        {wallets[0]?.amount ?? "0.00"}
                                    </span>
                                    <span className="mt-auto text-sm text-body">
                                        {formatUsd(
                                            (wallets[0]?.usdValue as number) ??
                                                0.0
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <WalletBalanceChart />
                </div>
                <div className="h-auto">
                    {mobile ? (
                        <MobileWalletTransactions />
                    ) : (
                        <WalletTransactions />
                    )}
                </div>
            </div>
        </div>
    );
}
