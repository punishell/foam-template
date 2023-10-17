import React from 'react';
import { arc } from 'd3-shape';
import Image from 'next/image';
import { DefaultAvatar } from '@/components/common/default-avatar';
import Link from 'next/link';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const SIZE_TO_PX: Record<Size, number> = {
  sm: 60,
  md: 110,
  lg: 150,
  xl: 180,
  '2xl': 200,
  '3xl': 220,
};

interface AfroScoreProps {
  size: Size;
  score: number;
  children?: React.ReactNode;
}

const progressToColor = (progress: number) => {
  if (progress <= 24) {
    return '#fa0832';
  } else if (progress <= 49) {
    return '#ffbf04';
  } else if (progress <= 74) {
    return '#649ff9';
  } else {
    return '#17a753';
  }
};

export const AfroScore: React.FC<AfroScoreProps> = ({ size, score: initialScore = 63, children }) => {
  const id = React.useId();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const sizeInPx = SIZE_TO_PX[size];
  const thickness = sizeInPx / 11;
  const knobRadius = thickness * 1.2;
  const radius = (sizeInPx - thickness) / 2;
  const [score, setScore] = React.useState(initialScore);
  const progressAngle = (score / 100) * 2 * Math.PI;

  const bgArcGenerator = arc()
    .startAngle(0)
    .outerRadius(radius)
    .endAngle(2 * Math.PI)
    .innerRadius(radius - thickness);

  const progressArcGenerator = arc()
    .startAngle(0)
    .outerRadius(radius)
    .endAngle(progressAngle)
    .innerRadius(radius - thickness)
    .cornerRadius(666);

  // @ts-ignore
  const bgArcPath = bgArcGenerator();
  // @ts-ignore
  const progressArcPath = progressArcGenerator();

  // Add a knob to the progress arc
  const knobX = (radius - thickness / 2) * Math.cos(progressAngle - Math.PI / 2);
  const knobY = (radius - thickness / 2) * Math.sin(progressAngle - Math.PI / 2);

  const [knobPosition, setKnobPosition] = React.useState({ x: knobX, y: knobY });

  const onDrag = (event: MouseEvent) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();

    const newKnobPosition = {
      x: event.clientX - svgRect.left - radius,
      y: event.clientY - svgRect.top - radius,
    };

    setKnobPosition(newKnobPosition);

    // Calculate the new score based on the knob position
    const angle = Math.atan2(newKnobPosition.y, newKnobPosition.x);
    let newScore = (((angle + Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 100;
    setScore(newScore);
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        style={{
          height: radius * 2,
          width: radius * 2,
          borderRadius: '666',
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        {children}
      </div>
      <svg
        ref={svgRef}
        width={sizeInPx + knobRadius}
        height={sizeInPx + knobRadius}
        viewBox={`0 0 ${sizeInPx + knobRadius} ${sizeInPx + knobRadius}`}
        style={{
          transform: 'rotate(180deg)',
        }}
      >
        <style type="text/css">
          {`
            .progress-gradient {
              background-image: conic-gradient(
                from 0deg at 50% 50%,
                #fc2533,
                #fc2533,
                #ffc005,
                #ffc005,
                #ffc005,
                #649ff9,
                #649ff9,
                #649ff9,
                #04a82a,
                #04a82a
              );
            }

          `}
        </style>

        <g transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}>
          <clipPath id={id}>
            <path
              d={progressArcPath}
              transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
            />
          </clipPath>
          <path d={bgArcPath} fill="#e3e5e5" />
        </g>
        <foreignObject
          x="0"
          y="0"
          width={sizeInPx + knobRadius}
          height={sizeInPx + knobRadius}
          clipPath={`url(#${id})`}
        >
          <div
            className="progress-gradient"
            style={{
              width: sizeInPx + knobRadius,
              height: sizeInPx + knobRadius,
              borderRadius: 999,
            }}
          />
        </foreignObject>

        {/* KNOB */}
        <g className="cursor-grab">
          <circle
            style={{
              display: score === 0 ? 'none' : 'block',
            }}
            // onMouseDown={(e) => {
            //   e.preventDefault();
            //   console.log('mouse down');
            //   window.addEventListener('mousemove', onDrag);
            //   window.addEventListener('mouseup', () => {
            //     window.removeEventListener('mousemove', onDrag);
            //   });
            // }}
            cx={knobPosition.x}
            cy={knobPosition.y}
            r={knobRadius}
            fill={progressToColor(score)}
            transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
          ></circle>

          <text
            className="select-none"
            style={{
              display: score === 0 ? 'none' : 'block',
            }}
            x={knobPosition.x + (sizeInPx + knobRadius) / 2}
            y={knobPosition.y + (sizeInPx + knobRadius) / 2}
            dy=".3em"
            textAnchor="middle"
            fill="white"
            fontWeight={700}
            transform={`rotate(180, ${knobPosition.x + (sizeInPx + knobRadius) / 2}, ${knobPosition.y + (sizeInPx + knobRadius) / 2
              })`}
            fontSize={Math.round(sizeInPx / 10)}
          >
            {`${Math.round(score)}`}
          </text>
        </g>
      </svg>
    </div>
  );
};

type AfroProfileProps = Omit<AfroScoreProps, 'children'> & {
  src?: string;
  url?: string;
};

export const AfroProfile: React.FC<AfroProfileProps> = ({ size, score, src, url }) => {
  return (
    <Link href={url || ""} className='flex relative items-center'>
      <AfroScore score={score} size={size}>
        {src ? (
          <Image src={src} alt="profile" fill className="scale-95 rounded-full" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="h-full w-full rounded-full scale-95">
            <DefaultAvatar />
          </div>
        )}
      </AfroScore>
    </Link>
  );
};
