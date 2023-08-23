'use client';

import React from 'react';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { Carousel } from '@/components/common/carousel';
import { UserAvatar } from '@/components/common/user-avatar';

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

export const Reviews = ({ reviews }: { reviews: any[] }) => {
  return (
    <div className="flex flex-col bg-primary-gradient p-4 rounded-4 gap-3 rounded-2xl">
      <h3 className="text-white font-medium text-2xl">Reviews</h3>
      <Carousel>
        {reviews && reviews.length > 0 && reviews.map((_review, i) =>
          <Review
            key={i}
            title="Great work"
            body="I have over 13 years of experience crafting award-winning mobile and web apps at well-known tech companies like Google, Nest, and GE, and have worked and consulted at a variety of startups and companies in Silicon Valley. I&nbsp;believe in designing with intention in both work and life. &nbsp; I thrive in bringing clarity to ambiguity"
            rating={4}
            user={{
              name: 'Cameron Williamson',
              title: 'Full-stack developer',
              afroScore: 100,
            }}
          />
        )}
        {!reviews || reviews.length === 0 &&
          <div className='flex w-full text-white h-[367px] my-auto items-center'>
            <p>No Reviews</p>
          </div>
        }
      </Carousel>
    </div>
  );
};