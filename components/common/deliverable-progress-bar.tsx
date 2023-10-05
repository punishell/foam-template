import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  totalDeliverables: number;
  percentageProgress: number;
}

const InProgress = () => <div className="bg-line rounded-full h-2 flex-1 basis-0" />;

const Completed = () => <div className="bg-[#23C16B] rounded-full h-2 flex-1 basis-0" />;

export const DeliverableProgressBar: React.FC<Props> = ({ percentageProgress, totalDeliverables, className }) => {
  const progressBars = [];

  for (let i = 0; i < totalDeliverables; i++) {
    if (i < percentageProgress / (100 / totalDeliverables)) {
      progressBars.push(<Completed key={i} />);
    } else {
      progressBars.push(<InProgress key={i} />);
    }
  }

  return (
    <div className={cn('flex flex-col gap-2 w-full max-w-[200px] text-xs', className)}>
      <div className="flex gap-2 items-center text-[#6E7191]">
        <span>Job Progress:</span>
        <span>{percentageProgress}%</span>
      </div>
      <div className="flex items-center gap-1 grow">{progressBars}</div>
    </div>
  );
};
