'use client';

import 'blaze-slider/dist/blaze.css';
import React from 'react';
import { Button } from 'pakt-ui';
import Rating from 'react-rating';
import BlazeSlider, { BlazeConfig } from 'blaze-slider';
import { Briefcase, Star } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';

const useBlazeSlider = (config: BlazeConfig) => {
  const sliderRef = React.useRef<BlazeSlider>();
  const elRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sliderRef.current && elRef.current) {
      sliderRef.current = new BlazeSlider(elRef.current, config);
    }

    return () => {
      if (sliderRef.current) {
        sliderRef.current.destroy();
      }
    };
  }, [config]);

  return elRef;
};

interface SliderProps {
  config?: BlazeConfig;
  children: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({ config, children }) => {
  const defaultConfig: BlazeConfig = {
    all: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  };

  const elRef = useBlazeSlider(config || defaultConfig);

  return (
    <div ref={elRef} className="blaze-slider">
      <div className="blaze-container">
        <div className="blaze-track-container">
          <div className="blaze-track">
            {React.Children.map(children, (child, index) => (
              <div key={index}>{child}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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

          <div className="flex gap-3 items-center max-w-sm w-full">
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

const REVIEWS = [];

interface ReviewsProps {}

const Bio = () => {
  return (
    <div className="flex flex-col bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3>Bio</h3>
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

const Reviews = () => {
  return (
    <div className="flex flex-col bg-primary-gradient p-4 rounded-4 gap-3 rounded-2xl">
      <h3 className="text-white font-medium text-2xl">Reviews</h3>
      <Slider config={{ all: { slidesToShow: 2, slidesToScroll: 2 } }}>
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
      </Slider>
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
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 max-w-[540px]">
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

const Achievements = () => {
  return (
    <div className="bg-[#F8FFF4] py-4 px-6 rounded-2xl gap-4 flex flex-col border border-primary">
      <h3 className="text-center text-title text-lg font-medium">Achievements</h3>
      <div className="flex items-center gap-2"></div>
    </div>
  );
};
