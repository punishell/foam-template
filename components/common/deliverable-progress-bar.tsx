interface Props {
  totalDeliverables: number;
  percentageProgress: number;
}

const InProgress = () => <div className="bg-line rounded-full h-2 w-[30px] lg:w-[60px]" />;

const Completed = () => <div className="bg-primary-gradient rounded-full h-2 w-[30px] lg:w-[60px]" />;

export const DeliverableProgressBar: React.FC<Props> = ({ percentageProgress, totalDeliverables }) => {
  const progressBars = [];

  for (let i = 0; i < totalDeliverables; i++) {
    if (i < percentageProgress / (100 / totalDeliverables)) {
      progressBars.push(<Completed key={i} />);
    } else {
      progressBars.push(<InProgress key={i} />);
    }
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
