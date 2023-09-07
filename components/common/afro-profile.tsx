import React from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AfroProfileProps {
  size: Size;
  score: number;
  image: string;
}

const SIZE_TO_PX: Record<Size, number> = {
  sm: 60,
  md: 110,
  lg: 150,
  xl: 200,
};

export const AfroProfile: React.FC<AfroProfileProps> = ({ image, score, size }) => {
  const sizeInPx = SIZE_TO_PX[size];
  const STROKE_WIDTH = sizeInPx * 0.15;

  // calculate circumference based on sizeInPx
  const circumference = sizeInPx * 2 * Math.PI;

  // calculate inactive stroke-dashoffset based on score
  const offset = ((100 - score) / 100) * circumference;

  return (
    <div className="rounded-full">
      <svg width={sizeInPx} height={sizeInPx} viewBox={`0 0 ${sizeInPx} ${sizeInPx}`}>
        <defs>
          <pattern id="paktscore" patternUnits="userSpaceOnUse" height={sizeInPx} width={sizeInPx}>
            <image x="0" y="0" height={sizeInPx} width={sizeInPx} xlinkHref="/images/paktscore-gradient.png"></image>
          </pattern>
        </defs>

        {/* track circle  */}
        <circle
          stroke="#ccc"
          cx={sizeInPx / 2}
          cy={sizeInPx / 2}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          r={sizeInPx / 2 - STROKE_WIDTH / 2}
        ></circle>

        {/* progress circle */}
        <circle
          id="progressCircle"
          cx={sizeInPx / 2}
          cy={sizeInPx / 2}
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          stroke-linecap="round"
          stroke="url(#paktscore)"
          strokeDashoffset={offset}
          strokeDasharray={circumference}
          r={sizeInPx / 2 - STROKE_WIDTH / 2}
        ></circle>

        {/* white background circle  */}
        <circle cx={sizeInPx / 2} cy={sizeInPx / 2} r={sizeInPx / 2 - STROKE_WIDTH / 2} fill="white"></circle>
      </svg>
    </div>
  );
};
