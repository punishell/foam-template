import React from 'react';
import Image from 'next/image';

interface Props {
  size?: number;
  score?: number;
}

export const PaktScore = ({ score = 0, size = 150 }: Props) => {
  // Calculate the percentage of the size
  const xPercentOfSize = (x: number) => (x / 100) * size;

  const strokeWidth = xPercentOfSize(10);
  const circleOffset = xPercentOfSize(5);

  // Calculate the circumference of the circle
  const radius = size / 2 - circleOffset;
  const circumference = 2 * Math.PI * radius;

  // Calculate the offset needed to display the progress bar
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white flex items-center justify-center p-4 flex-col gap-3 w-[280px] border border-line rounded-2xl">
      <div className="relative w-fit rounded-full flex items-center justify-center">
        <div className="absolute inset-0">
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#EFF0F6"
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDashoffset={0}
              strokeDasharray={circumference}
            />
          </svg>
        </div>
        <Image
          width={300}
          height={300}
          src="/images/paktscore-bg.png"
          className="absolute z-[2] inset-0 bg-pakt-score-gradient rounded-full"
          alt=""
        />
        <div className="absolute z-[2] inset-4 bg-white rounded-full"></div>

        <div className=" rounded-full">
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="transparent"
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDashoffset={offset}
              strokeDasharray={circumference}
              transform={`rotate(90, ${size / 2}, ${size / 2})`}
            />
          </svg>
        </div>
        <div className="absolute z-20 flex h-full w-full items-center justify-center gap-0 border border-transparent">
          <span className="text-4xl">{Math.trunc(score)}</span>
        </div>
      </div>
      <span className="text-2xl font-bold text-title">Afroscore</span>
    </div>
  );
};
