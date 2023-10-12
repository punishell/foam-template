'use client';
import React, { useState } from 'react';
import 'blaze-slider/dist/blaze.css';
import BlazeSlider, { BlazeConfig } from 'blaze-slider';

const defaultConfig: BlazeConfig = {
  all: {
    loop: false,
    slidesToShow: 2,
    slidesToScroll: 2,
    transitionDuration: 300,
    slideGap: '20px',
  },
  '(max-width: 500px)': {
    slidesToShow: 1,
    slidesToScroll: 1,
  },
};

export const useBlazeSlider = (config?: BlazeConfig) => {
  const sliderRefIn = React.useRef<BlazeSlider>();
  const elRef = React.useRef<HTMLDivElement>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState<BlazeSlider>();
  React.useEffect(() => {
    if (!sliderRefIn.current && elRef.current) {
      sliderRefIn.current = new BlazeSlider(elRef.current, config || defaultConfig);
      setSliderRef(sliderRefIn.current);
    }
  }, [config]);

  React.useEffect(() => {
    const unsubscribe = sliderRef?.onSlide((pageIndex) => {
      setCurrentSlide(pageIndex);
    });
    return () => { unsubscribe };
  }, [sliderRef])

  return { ref: elRef, slider: sliderRef, currentSlide };
};

interface CarouselProps {
  elRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const BlazeCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
  return (
    <div className='relative w-full px-2'>
      <div
        ref={elRef}
        className="blaze-slider"
        style={{ ['--slides-to-show' as any]: 2 }}
      >
        <div className="blaze-container">
          <div className="blaze-track-container">
            <div className="blaze-track">
              {React.Children.map(children, (Child, index) => Child)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
