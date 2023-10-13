import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  isCancelled?: boolean;
  totalDeliverables: number;
  percentageProgress: number;
}

const InProgress = () => <div className="bg-line rounded-full h-2 flex-1 basis-0" />;

interface CompletedProps {
  isCancelled?: boolean;
}
const Completed: React.FC<CompletedProps> = ({ isCancelled }) => (
  <div
    className="rounded-full h-2 flex-1 basis-0"
    style={{
      backgroundColor: isCancelled ? '#FF5247' : '#23C16B',
    }}
  />
);

export const DeliverableProgressBar: React.FC<Props> = ({
  percentageProgress,
  totalDeliverables,
  isCancelled,
  className,
}) => {
  const progressBars = [];

  for (let i = 0; i < totalDeliverables; i++) {
    if (i < percentageProgress / (100 / totalDeliverables)) {
      progressBars.push(<Completed key={i} isCancelled={isCancelled} />);
    } else {
      progressBars.push(<InProgress key={i} />);
    }
  }

  return (
    <div className={cn('flex flex-col gap-2 w-full max-w-[200px] text-xs', className)}>
      {isCancelled ? (
        <div className="flex gap-1 items-center text-[#FF5247]">
          <span>Job Cancelled. Progress:</span>
          <span>{percentageProgress}%</span>
        </div>
      ) : (
        <div className="flex gap-1 items-center text-[#6E7191]">
          <span>Job Progress:</span>
          <span>{percentageProgress}%</span>
        </div>
      )}
      <div className="flex items-center gap-1 grow">{progressBars}</div>
    </div>
  );
};
