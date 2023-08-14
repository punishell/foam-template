import Avvvatars from 'avvvatars-react';

interface Props {
  image?: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
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

export const UserAvatar: React.FC<Props> = ({ image, score: paktScore = 0, size = 'md' }) => {
  return (
    <div
      className={`${getAvatarColor(paktScore)} relative h-fit w-fit p-1 flex items-center justify-center rounded-full`}
    >
      <div
        className={`absolute z-10 rounded-full right-2 text-white p-1 top-[0px] w-8 h-8 flex items-center justify-center ${getAvatarColor(
          paktScore,
        )}`}
      >
        {paktScore}
      </div>
      <div
        className="bg-slate-200 text-white flex items-center justify-center rounded-full"
        style={{
          height: size === 'sm' ? 80 : size === 'md' ? 100 : 120,
          width: size === 'sm' ? 80 : size === 'md' ? 100 : 120,
        }}
      >
        <span className="text-2xl uppercase">HE</span>
      </div>
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
