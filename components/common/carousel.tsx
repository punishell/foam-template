'use client';
import React from 'react';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { KeenSliderHooks, KeenSliderInstance } from 'keen-slider';

interface SliderProps {
  ref: (node: HTMLElement | null) => void;
  slider: React.MutableRefObject<KeenSliderInstance<{}, {}, KeenSliderHooks> | null>
  currentSlide?: number;
  loaded: boolean;
}

export const useCarousel = (newSliderRef?: SliderProps): SliderProps => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [loaded, setLoaded] = React.useState(false)
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: "free",
    slides: {
      perView: 2,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })
  return newSliderRef ? newSliderRef : { ref: sliderRef, slider: instanceRef, currentSlide, loaded };
};

interface CarouselProps {
  elRef: SliderProps;
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ elRef, children }) => {
  return (
    <div ref={elRef.ref} className="keen-slider shrink max-w-[40%] border-2 border-black">
      {React.Children.map(children, (child, index) => (
        <div className={'keen-slider__slide item_' + index} key={index}>
          {child}
        </div>
      ))}
    </div>
  );
};
