"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Circle, Loader } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatUsd } from "@/lib/utils";
import { useGetWalletTxsInfinitely } from "@/lib/api/wallet";

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
}): JSX.Element => (
    <div
        className={`${
            TRANSACTION_STATUS_COLORS[status].bgColor || "bg-gray-300"
        } flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
    >
        <span
            className={`text-xs ${TRANSACTION_STATUS_COLORS[status].textColor || "text-title"}`}
        >
            {status}
        </span>
    </div>
);

const TransactionType = ({
    type,
}: {
    type: TransactionTypeProps;
}): JSX.Element => {
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

const TransactionHash = ({ hash }: { hash: string }): JSX.Element =>
    hash !== "" ? (
        <Link
            href={`${process.env.NEXT_PUBLIC_SNOWTRACE_APP_URL}/tx/${hash}`}
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

const TransactionItem = ({
    transaction,
}: {
    transaction: WalletTransactionsProps;
}): JSX.Element => (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg border border-gray-200 bg-neutral-50 p-4">
        <div className="flex w-full items-center justify-between">
            <span className="text-sm leading-[21px] tracking-wide text-zinc-500">
                {transaction.date}
            </span>
            <TransactionType type={transaction.type} />
        </div>
        <div className="inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg">
            <div className="h-[0px] self-stretch border border-gray-200" />
            <h4 className=" self-stretch text-base font-medium leading-normal tracking-wide text-gray-800">
                {transaction.description}
            </h4>
            <h4 className=" text-lg font-bold leading-[27px] tracking-wide text-gray-800">
                {transaction.usdValue}
            </h4>
        </div>
        <div className="flex w-full items-center justify-between">
            <TransactionStatus status={transaction.status} />
            <TransactionHash hash={transaction.transactionHash} />
        </div>
    </div>
);

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

const dateFormat = "MMMM DD, YYYY";
const MAX = 50;
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

export const MobileWalletTransactions = (): React.JSX.Element => {
    // @ts-expect-error --- Unused variable
    const [currentPage, setCurrentPage] = useState(1);
    // @ts-expect-error --- Unused variable
    const [prevPage, setPrevPage] = useState(0);
    const [currentData, setCurrentData] = useState([]);
    const [observe, setObserve] = useState(false);

    const {
        data: walletTx,
        refetch: fetchWalletTx,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetWalletTxsInfinitely({
        limit: 10,
        page: currentPage,
        filters: { status: ["processing", "completed", "reprocessing"] },
    });
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchMore = (): void => {
        setObserve(false);
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    };

    useEffect(() => {
        const currentTarget = observerTarget.current;
        if (!currentTarget) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) setObserve(true);
            },
            { threshold: 0.5 }
        );

        observer.observe(currentTarget);

        return () => {
            observer.unobserve(currentTarget);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observerTarget.current]);

    useEffect(() => {
        if (!isLoading && !isFetchingNextPage && prevPage !== currentPage) {
            void fetchWalletTx();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        if (observe) {
            fetchMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observe]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let totalData: any = [];
        // if (timelineData?.pages) {
        if (walletTx && Array.isArray(walletTx.pages)) {
            for (let i = 0; i < walletTx.pages.length; i++) {
                const walletTxData = walletTx.pages[i]?.transactions;
                if (Array.isArray(walletTxData)) {
                    totalData = [...totalData, ...walletTxData];
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newData = totalData.sort((a: any, b: any) => {
            if (a && b) {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            }
            return 0;
        });
        setCurrentData(newData);
        // }
    }, [walletTx, walletTx?.pages]);

    const data: WalletTransactionsProps[] = useMemo(
        () =>
            (currentData ?? [])
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
        [currentData]
    );

    return (
        <div className="flex h-[600px] w-full max-w-full flex-col gap-4 rounded-lg border border-line bg-white px-6 py-6">
            <h3 className="text-base font-semibold">Wallet Transactions</h3>
            <div className="flex h-[600px] w-full flex-col gap-4 overflow-y-scroll">
                {data.map((transaction) => (
                    <TransactionItem
                        transaction={transaction}
                        key={transaction.transactionHash}
                    />
                ))}
                {isFetchingNextPage && (
                    <div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
                        <Loader
                            size={25}
                            className="animate-spin text-center text-black"
                        />
                    </div>
                )}
                <span ref={observerTarget} />
            </div>
        </div>
    );
};
