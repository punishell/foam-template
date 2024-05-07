"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import moment from "moment";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Chart } from "@/components/common/chart";
import { fetchWalletStats } from "@/lib/api/wallet";

export interface TransformedData {
    date: string;
    amt: number;
    // [key: string]: string | number;
}

interface ChartData {
    _id: string;
    count: number;
}

export interface ChartDataProps {
    weekly: TransformedData[];
    monthly: TransformedData[];
    yearly: TransformedData[];
}

export const WalletBalanceChart = (): React.JSX.Element => {
    const [data, setData] = useState<ChartDataProps>({
        weekly: [],
        monthly: [],
        yearly: [],
    });
    const getChartData = async (): Promise<void> => {
        const response = await Promise.all([
            fetchWalletStats({ format: "weekly" }),
            fetchWalletStats({ format: "monthly" }),
            fetchWalletStats({ format: "yearly" }),
        ]);

        // ===== Weekly ===== //
        const weeklyStats: TransformedData[] = response[0]
            .sort(
                (a: ChartData, b: ChartData) =>
                    new Date(a._id).getTime() - new Date(b._id).getTime()
            )
            .map((c: ChartData) => {
                return {
                    date: moment(c._id).utc().format("ddd"),
                    amt: c.count,
                };
            });
        // ===== Weekly ===== //

        // ===== Monthly ===== //

        const monthlyStats = response[1]
            .sort(
                (a: ChartData, b: ChartData) =>
                    new Date(a._id).getTime() - new Date(b._id).getTime()
            )
            .map((c: ChartData) => {
                return {
                    date: moment(c._id).utc().format("DD MMM"),
                    amt: c.count,
                };
            });

        // ===== Monthly ===== //
        const yearlyStats = response[2]
            .sort(
                (a: ChartData, b: ChartData) =>
                    new Date(a._id).getTime() - new Date(b._id).getTime()
            )
            .map((c: ChartData) => {
                return {
                    date: moment(c._id).utc().format("MMM YY"),
                    amt: c.count,
                };
            });

        const chartData = {
            weekly: weeklyStats,
            monthly: monthlyStats,
            yearly: yearlyStats,
        };

        setData(chartData);
    };

    const loadPage = async (): Promise<void> => {
        await Promise.all([getChartData()]);
    };

    useEffect(() => {
        void loadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const modifiedWeeklyData = [...data.weekly];
    const modifiedMonthlyData = [...data.monthly];
    const modifiedYearlyData = [...data.yearly];

    if (modifiedWeeklyData.length > 0) {
        const lastData = modifiedWeeklyData[
            modifiedWeeklyData.length - 1
        ] as TransformedData;
        const additionalDataPoint = { date: "", amt: lastData.amt };
        modifiedWeeklyData.push(additionalDataPoint);
    }

    if (modifiedMonthlyData.length > 0) {
        const lastData = modifiedMonthlyData[
            modifiedMonthlyData.length - 1
        ] as TransformedData;
        const additionalDataPoint = { date: "", amt: lastData.amt };
        modifiedMonthlyData.push(additionalDataPoint);
    }

    if (modifiedYearlyData.length > 0) {
        const lastData = modifiedYearlyData[
            modifiedYearlyData.length - 1
        ] as TransformedData;
        const additionalDataPoint = { date: "", amt: lastData.amt };
        modifiedYearlyData.push(additionalDataPoint);
    }

    return (
        <Tabs.Root
            defaultValue="week"
            className="flex flex-col gap-2 rounded-lg border border-line bg-white p-2 max-sm:h-[250px]"
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-medium text-title">Balance</span>

                <Tabs.List className="flex gap-1 rounded-lg bg-[#F0F2F5] p-1 px-2 text-xs text-[#828A9B]">
                    <Tabs.Trigger
                        className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                        value="week"
                    >
                        7 Days
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                        value="month"
                    >
                        30 Days
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="rounded-lg p-1 px-2 duration-200 hover:bg-white radix-state-active:bg-white"
                        value="year"
                    >
                        1 Year
                    </Tabs.Trigger>
                </Tabs.List>
            </div>
            <div className="h-full">
                <Tabs.Content value="week" className="h-full">
                    <Chart
                        data={modifiedWeeklyData}
                        dataKey="amt"
                        xAxisKey="date"
                        height="md"
                    />
                </Tabs.Content>
                <Tabs.Content value="month" className="h-full">
                    <Chart
                        data={modifiedMonthlyData}
                        dataKey="amt"
                        xAxisKey="date"
                        height="md"
                        isMonth
                    />
                </Tabs.Content>
                <Tabs.Content value="year" className="h-full">
                    <Chart
                        data={modifiedYearlyData}
                        dataKey="amt"
                        xAxisKey="date"
                        height="md"
                    />
                </Tabs.Content>
            </div>
        </Tabs.Root>
    );
};
