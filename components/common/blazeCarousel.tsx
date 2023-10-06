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
  },
  '(max-width: 500px)': {
    slidesToShow: 1,
    slidesToScroll: 1,
  },
};

export const useBlazeSlider = (config?: BlazeConfig) => {
  const sliderRef = React.useRef<BlazeSlider>();
  const elRef = React.useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  React.useEffect(() => {
    if (!sliderRef.current && elRef.current) {
      sliderRef.current = new BlazeSlider(elRef.current, config || defaultConfig);
    }
  }, [config]);

  React.useEffect(() => {
    const unsubscribe = sliderRef.current?.onSlide((pageIndex, firstVisibleSlideIndex, lastVisibleSlideIndex) => {
      setCurrentSlide(pageIndex);
    });
    return () => { unsubscribe };
  }, [sliderRef])

  return { ref: elRef, slider: sliderRef.current, currentSlide };
};

interface CarouselProps {
  elRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const BlazeCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
  return (
    <div
      ref={elRef}
      className="blaze-slider"
      style={{
        ['--slides-to-show' as any]: 2,
      }}
    >
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