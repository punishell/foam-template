"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { ArrowUpRight, ArrowDownLeft, Circle } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Table } from "@/components/common/table";
import { formatUsd } from "@/lib/utils";
import { useGetWalletTxs } from "@/lib/api/wallet";

type TransactionTypeProps = "withdrawal" | "deposit";

type TransactionStatusProps =
    | "processing"
    | "pending"
    | "completed"
    | "failed"
    | "reprocessing";

type TransactionStatusColors = {
    [key in TransactionStatusProps]: { bgColor: string; textColor: string };
};

const TRANSACTION_STATUS_COLORS: TransactionStatusColors = {
    failed: { bgColor: "bg-danger", textColor: "text-danger" },
    completed: { bgColor: "bg-success", textColor: "text-success" },
    pending: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
    processing: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
    reprocessing: { bgColor: "bg-yellow-dark", textColor: "text-yellow" },
};

const TransactionStatus = ({
    status,
}: {
    status: TransactionStatusProps;
}): React.JSX.Element => (
    <div
        className={`${
            TRANSACTION_STATUS_COLORS[status].bgColor || "bg-gray-300"
        } flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
    >
        <span
            className={`text-sm ${TRANSACTION_STATUS_COLORS[status].textColor || "text-title"}`}
        >
            {status}
        </span>
    </div>
);

const TransactionType = ({
    type,
}: {
    type: TransactionTypeProps;
}): React.JSX.Element => {
    let color: string;
    let Icon: React.ElementType;

    switch (type) {
        case "deposit":
            color = "success";
            Icon = ArrowDownLeft;
            break;
        case "withdrawal":
            color = "danger";
            Icon = ArrowUpRight;
            break;
        default:
            color = "gray-300";
            Icon = Circle;
            break;
    }

    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}
            >
                <Icon className={`text-${color}`} size={12} />
            </div>
            <span className="text-sm capitalize">{type}</span>
        </div>
    );
};

interface WalletTransactionsProps {
    date: string;
    amount: string;
    description: string;
    coin: string;
    usdValue: string;
    type: TransactionTypeProps;
    status: TransactionStatusProps;
    transactionHash: string;
}

const TABLE_COLUMNS: Array<ColumnDef<WalletTransactionsProps>> = [
    {
        header: "Date",
        accessorFn: (data) => data.date,
    },
    {
        header: "Type",
        accessorFn: (data) => data.type,
        cell: ({ getValue }) => (
            <TransactionType type={getValue<TransactionTypeProps>()} />
        ),
    },
    {
        header: "Description",
        accessorFn: (data) => data.description,
    },
    {
        header: "Amount",
        accessorFn: (data) => data.amount,
    },
    {
        header: "Coin",
        accessorFn: (data) => data.coin,
    },
    {
        header: "USD Value",
        accessorFn: (data) => data.usdValue,
    },
    {
        header: "Status",
        accessorFn: (data) => data.status,
        cell: ({ getValue }) => (
            <TransactionStatus status={getValue<TransactionStatusProps>()} />
        ),
    },
    {
        header: " ",
        accessorFn: (data) => data.transactionHash,
        cell: ({ getValue }) => {
            const transactionHash = getValue();
            return transactionHash !== "" ? (
                <Link
                    href={`${process.env.NEXT_PUBLIC_SNOWTRACE_APP_URL}/tx/${transactionHash as string}`}
                    target="_blank"
                    className="inline-flex h-[22px] w-[124.35px] items-center justify-center gap-[6.45px] rounded-lg border bg-violet-100 px-2 py-0.5"
                >
                    <span className="shrink grow basis-0 text-center text-xs font-medium leading-[18px] tracking-wide text-indigo-600">
                        View On-chain
                    </span>
                    <ArrowUpRight className="relative h-[12.90px] w-[12.90px] text-indigo-600" />
                </Link>
            ) : (
                <div />
            );
        },
    },
];

const dateFormat = "MM/DD/YYYY";
const MAX = 20;

interface TransactionProps {
    createdAt: string;
    type: "withdrawal" | "deposit";
    amount: string;
    description: string;
    currency: string;
    usdValue: number;
    status: "processing" | "pending" | "completed" | "failed" | "reprocessing";
    responseData: string;
}

export const WalletTransactions = (): React.JSX.Element => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 6,
    });
    const {
        data: walletTx,
        refetch: fetchWalletTx,
        // isLoading,
        isFetched: walletFetched,
        isFetching: walletIsFetching,
    } = useGetWalletTxs({
        limit: pageSize,
        page: pageIndex,
        filters: { status: ["processing", "completed", "reprocessing"] },
    });
    const page = parseInt(walletTx?.page ?? "1", 10);
    const pageSizee = parseInt(walletTx?.pages ?? "1", 10);
    const loading = !walletFetched && walletIsFetching;

    const data: WalletTransactionsProps[] = useMemo(
        () =>
            (walletTx?.transactions ?? [])
                .map((tx: TransactionProps) => ({
                    date: dayjs(tx.createdAt).format(dateFormat),
                    type: tx.type,
                    amount: String(tx.amount),
                    description:
                        tx.description && tx.description?.length > MAX
                            ? `${tx.description.slice(0, MAX)}...`
                            : tx.description,
                    coin: tx.currency.toUpperCase(),
                    usdValue: formatUsd(tx.usdValue),
                    status: tx.status,
                    transactionHash:
                        tx.responseData !== null &&
                        tx.responseData !== undefined
                            ? JSON.parse(tx.responseData).data.tx
                                  .transactionHash
                            : "",
                }))
                .sort(
                    (a, b) =>
                        new Date(b?.date).getTime() -
                        new Date(a?.date).getTime()
                ),
        [walletTx]
    );

    const loadPage = async (): Promise<void> => {
        await Promise.all([fetchWalletTx()]);
    };

    useEffect(() => {
        void loadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        void fetchWalletTx();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize]);
    return (
        <div className="flex h-[450px] w-full max-w-full flex-col gap-4 rounded-lg border border-line bg-white px-6 py-6">
            <h3 className="text-base font-semibold">Wallet Transactions</h3>
            <Table
                data={data}
                columns={TABLE_COLUMNS}
                pageCount={pageSizee}
                setPagination={setPagination}
                pagination={{ pageIndex: page, pageSize: pageSizee }}
                loading={loading}
            />
        </div>
    );
};
