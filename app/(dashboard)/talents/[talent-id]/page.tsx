'use client';

import React from 'react';
import { Button } from 'pakt-ui';
import Rating from 'react-rating';
import { Briefcase, Star } from 'lucide-react';
import { Carousel } from '@/components/common/carousel';
import { UserAvatar } from '@/components/common/user-avatar';

export default function TalentDetails() {
  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
      <Header />

      <div className="flex gap-6">
        <Bio />
        <Achievements />
      </div>
      <Reviews />
    </div>
  );
}

const Header = () => {
  return (
    <div className="w-full flex bg-white p-6 rounded-2xl gap-6 border border-line">
      <div className="shrink-0">
        <UserAvatar score={100} size="lg" />
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="flex gap-2 w-full justify-between border-b pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-title">Cameron Williamson</h1>
            <div className="flex gap-2 items-center text-body">
              <Briefcase size={16} />
              <span>Full-stack developer</span>
            </div>
          </div>

          <div className="flex gap-3 items-center max-w-[300px] w-full">
            <Button fullWidth variant="secondary" size={'sm'}>
              Message
            </Button>
            <Button fullWidth variant="primary" size={'sm'}>
              Invite to Job
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill.name}
              className="bg-white rounded-full px-6 py-1.5 text-sm font-medium text-[#090A0A]"
              style={{ backgroundColor: skill.backgroundColor }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BIO = `I'm a full-stack developer with 5 years of experience.
I have worked with multiple technologies and frameworks like React, Vue, Angular, Node, Express, Laravel, Django, etc.`;

const SKILLS = [
  {
    name: 'React',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Vue',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Angular',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9DBAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9DBAA',
  },
  {
    name: 'Angular',
    backgroundColor: '#E9DBAA',
  },
  {
    name: 'Angular',
    backgroundColor: '#E9DBAA',
  },
];

const Bio = () => {
  return (
    <div className="flex flex-col bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>
        <div>
          I have over 13 years of experience crafting award-winning mobile and web apps at well-known tech companies
          like Google, Nest, and GE, and have worked and consulted at a variety of startups and companies in Silicon
          Valley. I&nbsp;believe in designing with intention in both work and life. &nbsp; I thrive in bringing clarity
          to ambiguity
        </div>
      </div>
    </div>
  );
};

const Achievements = () => {
  return (
    <div className="bg-[#F8FFF4] py-4 px-6 rounded-2xl gap-4 flex flex-col border-2 border-primary w-fit shrink-0">
      <h3 className="text-center text-title text-lg font-medium">Achievements</h3>
      <div className="grid grid-cols-4 gap-2 w-full">
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
      </div>
    </div>
  );
};

const Reviews = () => {
  return (
    <div className="flex flex-col bg-primary-gradient p-4 rounded-4 gap-3 rounded-2xl">
      <h3 className="text-white font-medium text-2xl">Reviews</h3>
      <Carousel>
        <Review
          title="Great work"
          body="I have over 13 years of experience crafting award-winning mobile and web apps at well-known tech companies like Google, Nest, and GE, and have worked and consulted at a variety of startups and companies in Silicon Valley. I&nbsp;believe in designing with intention in both work and life. &nbsp; I thrive in bringing clarity to ambiguity"
          rating={4}
          user={{
            name: 'Cameron Williamson',
            title: 'Full-stack developer',
            afroScore: 100,
          }}
        />
        <Review
          title="Great work"
          body="I have over 13 years of experience crafting award-winning mobile and web apps at well-known tech companies like Google, Nest, and GE, and have worked and consulted at a variety of startups and companies in Silicon Valley. I&nbsp;believe in designing with intention in both work and life. &nbsp; I thrive in bringing clarity to ambiguity"
          rating={4}
          user={{
            name: 'Cameron Williamson',
            title: 'Full-stack developer',
            afroScore: 100,
          }}
        />
        <Review
          title="Great work"
          body="I have over 13 years of experience crafting award-winning mobile and web apps at well-known tech companies like Google, Nest, and GE, and have worked and consulted at a variety of startups and companies in Silicon Valley. I&nbsp;believe in designing with intention in both work and life. &nbsp; I thrive in bringing clarity to ambiguity"
          rating={4}
          user={{
            name: 'Cameron Williamson',
            title: 'Full-stack developer',
            afroScore: 100,
          }}
        />
      </Carousel>
    </div>
  );
};

interface ReviewProps {
  body: string;
  title: string;
  rating: number;
  user: {
    name: string;
    title: string;
    afroScore: number;
  };
}

const Review: React.FC<ReviewProps> = ({ body, title, rating, user }) => {
  return (
    <div className="bg-white min-h-full rounded-2xl p-4 flex flex-col gap-4 w-full select-none cursor-grab">
      <div>
        <span className="text-xl font-medium text-title">{title}</span>
      </div>
      <div className="text-body">{body}</div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <UserAvatar size="xs" />
          <div className="flex flex-col">
            <span className="text-sm text-title font-medium">{user.name}</span>
            <span className="text-sm text-body">{user.title}</span>
          </div>
        </div>
        {/* @ts-ignore */}
        <Rating
          initialRating={2.5}
          fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
          emptySymbol={<Star fill="transparent" color="#15D28E" />}
          readonly
        />
      </div>
    </div>
  );
};

type AchievementType = 'reviews' | 'referrals' | 'jobs' | 'squads';

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
  reviews: {
    textColor: '#198155',
    borderColor: '#198155',

    innerBackgroundColor: '#F0FFF2',
    outerBackgroundColor: '#ECFCE5',

    barColor: '#D2FFBE',
    barIndicatorColor: '#7DDE86',
  },
  referrals: {
    textColor: '#0065D0',
    borderColor: '#0065D0',

    innerBackgroundColor: '#E1F5FF',
    outerBackgroundColor: '#C9F0FF',

    barColor: '#C0EEFF',
    barIndicatorColor: '#9BDCFD',
  },
  jobs: {
    textColor: '#287B7B',
    borderColor: '#287B7B',

    innerBackgroundColor: '#E0F5F5',
    outerBackgroundColor: '#F0FAFA',

    barColor: '#B5E3E3',
    barIndicatorColor: '#487E7E',
  },
  squads: {
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
