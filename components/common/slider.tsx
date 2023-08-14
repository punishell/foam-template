import { motion } from "framer-motion";
import React from "react";

export interface SlideItemProps {
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
}

interface SliderProps {
  items: {
    SlideItem: React.FC<{ goToNextSlide: () => void, goToPreviousSlide: () => void }>;
  }[];
}

export const Slider = ({ items }: SliderProps) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const wrapperWidth = wrapperRef.current?.clientWidth ?? 0;

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handleNext = () => {
    if (currentSlide === items.length - 1) return;
    setCurrentSlide((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentSlide === 0) return;
    setCurrentSlide((prev) => prev - 1);
  };

  return (
    <div ref={wrapperRef} className="relative flex h-full flex-col overflow-hidden">
      <motion.div className="flex h-full grow items-stretch " animate={{ translateX: -currentSlide * wrapperWidth }}>
        {items.map(({ SlideItem }, index) => {
          return <SlideItem goToNextSlide={handleNext} goToPreviousSlide={handlePrevious} key={index} />;
        })}
      </motion.div>
    </div>
  );
};
