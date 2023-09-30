'use client';

import React from 'react';
import Rating from 'react-rating';
import { ArrowLeftCircle, ArrowRightCircle, Star } from 'lucide-react';
import { Carousel } from '@/components/common/carousel';
import { AfroProfile } from '@/components/common/afro-profile';
import { Spinner } from '@/components/common/';
import { ProfileImage } from '../overview/ProfileImage';

interface ReviewProps {
  body: string;
  title: string;
  rating: number;
  user: {
    name: string;
    title: string;
    afroScore: number;
    avatar: string;
  };
}

const Review: React.FC<ReviewProps> = ({ body, title, rating, user }) => {
  return (
    <div className="bg-white min-h-full rounded-2xl p-4 flex flex-col gap-4 w-full select-none cursor-grab">
      <div>
        <span className="text-xl font-medium text-title">{title}</span>
      </div>
      <div className="text-body min-h-[72px]">{body}</div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <ProfileImage size="sm" score={user.afroScore} imageUrl={user?.avatar} />
          <div className="flex flex-col">
            <span className="text-sm text-title font-medium">{user.name}</span>
            <span className="text-sm text-body">{user.title}</span>
          </div>
        </div>
        {/* @ts-ignore */}
        <Rating
          initialRating={rating}
          fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
          emptySymbol={<Star fill="transparent" color="#15D28E" />}
          readonly
        />
      </div>
    </div>
  );
};

export const Reviews = ({ reviews, loading }: { reviews: ReviewProps[]; loading: boolean }) => {
  return (
    <div className="flex flex-col bg-primary-gradient p-4 rounded-4 gap-3 rounded-2xl">
      <div className='flex flex-row justify-between'>
        <h3 className="text-white font-medium text-2xl">Reviews</h3>
        <div className='flex flex-row gap-2'>
          <ArrowLeftCircle size={32} className='text-white' />
          <ArrowRightCircle size={32} className='text-white' />
        </div>
      </div>

      {loading ? (
        <div className="flex  min-h-[307px] w-full text-white my-auto items-center justify-center z-20">
          <Spinner />
        </div>
      ) : (
        <Carousel>
          {reviews &&
            reviews.length > 0 &&
            reviews.map((_review, i) => (
              <Review
                key={i}
                title={_review.title}
                body={_review.body}
                rating={_review.rating}
                user={_review.user}
              />
            ))}
          {!reviews ||
            (reviews.length === 0 && (
              <div className="flex w-full text-white min-h-[307px] my-auto items-center">
                <p>No Reviews</p>
              </div>
            ))}
        </Carousel>
      )}
    </div>
  );
};
