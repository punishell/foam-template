'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React from 'react';
import { axios } from '@/lib/axios';
import { RaceBy } from '@uiball/loaders';
import { getCookie } from 'cookies-next';
import { AUTH_TOKEN_KEY } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

const Loader = () => {
  return (
    <div aria-live="polite" aria-busy="true" className="flex h-screen w-screen items-center justify-center">
      <RaceBy />
    </div>
  );
};

export default function OnboardingLayout({ children }: Props) {
  const router = useRouter();
  const token = getCookie(AUTH_TOKEN_KEY);
  const [isTokenSet, setIsTokenSet] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setIsTokenSet(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return () => {
      axios.defaults.headers.common['Authorization'] = '';
    };
  }, [router, token]);

  if (!isTokenSet) {
    return <Loader />;
  }

  return (
    <div className="h-screen w-screen">
      <div className="relative grow ">
        <div className="absolute z-[1] inset-0">
          <div className="isolate">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 989" fill="none">
              <g filter="url(#filter0_f_4656_140202)">
                <path
                  d="M1008.86 223.475L841.933 115.026L749.197 169.251C728.59 187.326 687.374 230.983 687.374 261.015C687.374 298.555 684.283 361.121 687.374 381.977C690.465 402.832 841.933 473.741 875.936 469.57C909.939 465.399 1030.49 494.597 1079.95 548.821C1129.41 603.045 1132.5 628.072 1243.79 682.296C1355.07 736.52 1367.43 665.612 1407.62 628.072C1447.8 590.532 1475.62 448.714 1503.45 361.121C1531.27 273.528 1481.81 223.475 1475.63 169.251C1470.68 125.871 1413.8 115.026 1385.98 115.026L1243.79 90L1008.86 223.475Z"
                  fill="#BCF78C"
                  fillOpacity="0.5"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_4656_140202"
                  x="-79.7596"
                  y="-675.76"
                  width="2357.39"
                  height="2143.52"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="382.88" result="effect1_foregroundBlur_4656_140202" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
        <div className="absolute bg-repeat opacity-50 inset-0 bg-[url(/images/rain.png)]" />
        <div className="relative h-screen p-5 px-8 z-10 flex-col w-full isolate flex items-center justify-center">
          <div className="flex flex-col gap-4 max-w-4xl w-full">
            {/* <div className="grid grid-cols-3 content-center items-center justify-between gap-2">
              <Button variant="secondary" onClick={router.back}>
                <div className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  <span>Go Back</span>
                </div>
              </Button>
              <div className="">
                <Image src="/images/logo-dark.svg" alt="Logo" width={250} height={60} />
              </div>
            </div> */}
            <div className="mx-auto">
              <Image src="/images/logo-dark.svg" alt="Logo" width={250} height={60} />
            </div>
            <div className="bg-white rounded-2xl border p-8 w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
