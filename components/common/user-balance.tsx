"use client";

import React, { useEffect } from "react";
import { cn, formatUsd } from "@/lib/utils";
import { useWalletState } from "@/lib/store/wallet";
import { useGetWalletDetails } from "@/lib/api/wallet";

interface Props {
    className?: string;
}

export const UserBalance: React.FC<Props> = ({ className }) => {
    const { totalWalletBalance } = useWalletState();
    const { refetch } = useGetWalletDetails();
    useEffect(() => {
        refetch();
    }, []);
    return <span className={cn("text-3xl text-body", className)}>{formatUsd(parseFloat(totalWalletBalance))}</span>;
};
