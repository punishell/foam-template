"use client";
import React, { useState } from "react";
import "blaze-slider/dist/blaze.css";
import BlazeSlider, { BlazeConfig } from "blaze-slider";
import { useKeenSlider } from "keen-slider/react";

const defaultConfig: BlazeConfig = {
    all: {
        loop: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        transitionDuration: 300,
        slideGap: "10px",
    },
    "(max-width: 500px)": {
        slidesToShow: 1,
        slidesToScroll: 1,
    },
};

export const useBlazeSlider = (config?: BlazeConfig) => {
    const sliderRefIn = React.useRef<BlazeSlider>();
    const elRef = React.useRef<HTMLDivElement>();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lastSlideIndex, setLastSlide] = useState(0);
    const [firstSlideIndex, setFirstSlide] = useState(0);
    const [sliderRef, setSliderRef] = useState<BlazeSlider>();
    const totalSlides = Number(sliderRef?.states.length) - 1;
    React.useEffect(() => {
        if (!sliderRefIn.current && elRef.current) {
            sliderRefIn.current = new BlazeSlider(elRef.current, config || defaultConfig);
            setSliderRef(sliderRefIn.current);
        }
    }, [config]);

    React.useEffect(() => {
        const unsubscribe = sliderRef?.onSlide((pageIndex, firstSlideIndex, lastSlideIndex) => {
            setCurrentSlide(pageIndex);
            setLastSlide(lastSlideIndex);
            setFirstSlide(firstSlideIndex);
        });
        return () => {
            unsubscribe;
        };
    }, [sliderRef]);
    const prevSlide = () => sliderRef?.next();
    const nextSlide = () => sliderRef?.prev();
    return {
        ref: elRef,
        slider: sliderRef,
        currentSlide,
        firstSlide: firstSlideIndex,
        lastSlide: lastSlideIndex,
        totalSlides,
        prevSlide,
        nextSlide,
    };
};

interface CarouselProps {
    elRef: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
}

export const BlazeCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
    return (
        // <div className='relative w-full'>
        <div ref={elRef} className="blaze-slider" style={{ ["--slides-to-show" as any]: 2 }}>
            <div className="blaze-container">
                <div className="blaze-track-container">
                    <div className="blaze-track">{React.Children.map(children, (Child, index) => Child)}</div>
                </div>
            </div>
        </div>
        // </div>
    );
};

export const useKeenSlide = () => {
    const [actualSlide, setActualSlide] = React.useState(0);
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
        {
            mode: "snap",
            slides: {
                perView: 2,
                spacing: 15,
            },
            initial: 0,
            slideChanged(slider) {
                setActualSlide(slider.track.details.rel);
            },
        },
        [],
    );

    const currentSlide = actualSlide;

    const totalSlides = slider.current?.slides.length;

    const prevSlide = () => slider.current?.prev();
    const nextSlide = () => slider.current?.next();
    return { ref: sliderRef, slider: slider, currentSlide, totalSlides, prevSlide, nextSlide };
};

export const KeenCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
    return (
        <div ref={elRef} className="keen-slider">
            <div className="absolute">
                {React.Children.map(children, (Child, index) => (
                    <div key={index} className={`keen-slider__slide number-slide_${index}`}>
                        {Child}
                    </div>
                ))}
            </div>
        </div>
    );
};
