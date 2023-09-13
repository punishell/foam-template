import { getAchievementData } from "@/lib/utils";

type AchievementType = 'review' | 'referral' | 'five-star' | 'squad' | string;

interface Achievement {
  value: number;
  maxValue: number;
  minValue: number;
  type: AchievementType;
}

type AchievementTypeMap = {
  [key in AchievementType]: {
    textColor: string;
    borderColor: string;
    barColor: string;
    barIndicatorColor: string;
    outerBackgroundColor: string;
    innerBackgroundColor: string;
  };
};

const ACHIEVEMENT_STYLES: AchievementTypeMap = {
  review: {
    textColor: '#198155',
    borderColor: '#198155',

    innerBackgroundColor: '#F0FFF2',
    outerBackgroundColor: '#ECFCE5',

    barColor: '#D2FFBE',
    barIndicatorColor: '#7DDE86',
  },
  referral: {
    textColor: '#0065D0',
    borderColor: '#0065D0',

    innerBackgroundColor: '#E1F5FF',
    outerBackgroundColor: '#C9F0FF',

    barColor: '#C0EEFF',
    barIndicatorColor: '#9BDCFD',
  },
  ["five-star"]: {
    textColor: '#287B7B',
    borderColor: '#287B7B',

    innerBackgroundColor: '#E0F5F5',
    outerBackgroundColor: '#F0FAFA',

    barColor: '#B5E3E3',
    barIndicatorColor: '#487E7E',
  },
  squad: {
    textColor: '#5538EE',
    borderColor: '#5538EE',

    innerBackgroundColor: '#F0EFFF',
    outerBackgroundColor: '#E7E7FF)',

    barColor: '#E0E0FF',
    barIndicatorColor: '#C6C4FF',
  },
};

interface AchievementBarProps {
  title: string;
  achievement: Achievement;
}

const AchievementBar: React.FC<AchievementBarProps> = ({ achievement, title }) => {
  const styles = ACHIEVEMENT_STYLES[achievement.type];
  const percentage = (achievement.value / achievement.maxValue) * 100;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="p-2 rounded-3xl w-[120px]"
        style={{
          border: `2px solid ${styles.borderColor}`,
          backgroundColor: styles.outerBackgroundColor,
        }}
      >
        <div
          className="flex flex-col gap-2 justify-between items-center p-3 rounded-3xl"
          style={{
            color: styles.textColor,
            backgroundColor: styles.innerBackgroundColor,
          }}
        >
          <span className="text-2xl">
            {achievement.value}/{achievement.maxValue}
          </span>

          <div className="w-full h-5 rounded-full overflow-hidden" style={{ backgroundColor: styles.barColor }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: styles.barIndicatorColor,
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-body text-lg">{title}</span>
    </div>
  );
};


export const Achievements = ({ achievements }: { achievements: { title: string, type: string, total: number, value: number, }[] }) => {
  return (
    <div className="bg-primary-gradient p-[4px] rounded-2xl">
      <div className="bg-[#F8FFF4] py-4 px-6 rounded-xl gap-4 flex flex-col w-fit shrink-0">
        <h3 className="text-center text-title text-lg font-medium">Achievements</h3>
        <div className="grid grid-cols-4 gap-2 w-full">
          {achievements && achievements.length > 0 && achievements.map((ach, i) => {
            const typeData = getAchievementData(ach.type);
            return (<AchievementBar
              key={i}
              title={typeData?.title ?? ""}
              achievement={{
                type: ach.type,
                maxValue: ach.total,
                minValue: 0,
                value: ach.value,
              }}
            />)
          }
          )}
          {!achievements || achievements.length < 1 &&
            <>
              <AchievementBar
                title="Reviews"
                achievement={{
                  type: 'reviews',
                  maxValue: 60,
                  minValue: 0,
                  value: 10,
                }}
              />
              <AchievementBar
                title="Referrals"
                achievement={{
                  type: 'referrals',
                  maxValue: 20,
                  minValue: 0,
                  value: 10,
                }}
              />
              <AchievementBar
                title="5 Star Jobs"
                achievement={{
                  type: 'jobs',
                  maxValue: 10,
                  minValue: 0,
                  value: 8,
                }}
              />
              <AchievementBar
                title="Squad"
                achievement={{
                  type: 'squads',
                  maxValue: 10,
                  minValue: 0,
                  value: 5,
                }}
              />

            </>
          }
        </div>
      </div>
    </div>
  );
};