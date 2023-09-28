interface Props {
  totalDeliverables: number;
  completedDeliverables: number;
}

const InProgress = () => <div className="bg-line rounded-full h-2 w-[60px]" />;

const Completed = () => <div className="bg-primary rounded-full h-2 w-[60px]" />;

export const DeliverableProgressBar: React.FC<Props> = ({ completedDeliverables, totalDeliverables }) => {
  const progressBars = [];

  const percentageProgress = (completedDeliverables / totalDeliverables) * 100;

  for (let i = 0; i < completedDeliverables; i++) {
    progressBars.push(<Completed key={i} />);
  }

  for (let i = completedDeliverables; i < totalDeliverables; i++) {
    progressBars.push(<InProgress key={i} />);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center text-[#6E7191] text-xs">
        <span>Progress</span>
        <span>{percentageProgress}%</span>
      </div>
      <div className="flex items-center gap-1">{progressBars}</div>
    </div>
  );
};
