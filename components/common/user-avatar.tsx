type Size = 'xs' | 'sm' | 'md' | 'lg';

const sizesToPx: { [K in Size]: number } = {
  xs: 54,
  sm: 108,
  md: 162,
  lg: 195,
};

const sizesToPositions: { [K in Size]: number } = {
  xs: 2,
  sm: 10,
  md: 24,
  lg: 34,
};

interface Props {
  size?: Size;
  image?: string;
  score?: number;
}

function getAvatarColor(paktScore: number) {
  if (paktScore <= 20) {
    return 'bg-red-gradient';
  }
  if (paktScore <= 40) {
    return 'bg-yellow-gradient';
  }
  if (paktScore <= 60) {
    return 'bg-orange-gradient';
  }
  if (paktScore <= 80) {
    return 'bg-blue-gradient ';
  }
  return 'bg-green-gradient';
}

export const UserAvatar: React.FC<Props> = ({ image, score = 0, size = 'md' }) => {
  return (
    <div className={`${getAvatarColor(score)} relative h-fit w-fit p-1 flex items-center justify-center rounded-full`}>
      <div
        className={`absolute z-10 rounded-full text-white p-1 top-[0px] w-8 h-8 flex items-center justify-center ${getAvatarColor(
          score,
        )}`}
        style={{
          right: sizesToPositions[size],
          width: size === 'xs' ? 20 : 30,
          height: size === 'xs' ? 20 : 30,
        }}
      >
        {score}
      </div>
      <div
        className="bg-white text-white flex items-center justify-center rounded-full"
        style={{
          width: sizesToPx[size],
          height: sizesToPx[size],
        }}
      ></div>
    </div>
  );
};

export const UserAvatar2: React.FC<Props> = ({ image, size = 'md' }) => {
  return (
    <div
      className="bg-slate-200 text-white flex items-center justify-center rounded-full"
      style={{
        height: size === 'sm' ? 80 : size === 'md' ? 100 : 120,
        width: size === 'sm' ? 80 : size === 'md' ? 100 : 120,
      }}
    >
      <span className="text-2xl uppercase">HE</span>
    </div>
  );
};
