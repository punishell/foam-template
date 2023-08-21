
import * as Tabs from '@radix-ui/react-tabs';
import { Chart } from '@/components/common/chart';

const CHART_DATA = [
  { amt: 0, date: 'Sunday' },
  { amt: 0, date: 'Monday' },
  { amt: 2400, date: 'Tuesday' },
  { amt: 3000, date: 'Wednesday' },
  { amt: 1400, date: 'Thursday' },
  { amt: 5000, date: 'Friday' },
  { amt: 2400, date: 'Saturday' },
];

export interface chartDataProps {
  weekly: [{ amt: number, date: string }] | [],
  monthly: [{ amt: number, date: string }] | [];
  yearly: [{ amt: number, date: string }] | [];
};

export const WalletBalanceChart = ({ data }: { data: chartDataProps }) => {
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
          <Chart data={data['weekly']} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
        <Tabs.Content value="month" className="h-full">
          <Chart data={data.monthly} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
        <Tabs.Content value="year" className="h-full">
          <Chart data={data.yearly} dataKey="amt" xAxisKey="date" height="md" />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};
