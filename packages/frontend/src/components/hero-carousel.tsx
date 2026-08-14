'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop',
    alt: 'Team working',
    title: 'Collaborate seamlessly',
    desc: 'Real‑time sync across your entire team.',
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    alt: 'Analytics dashboard',
    title: 'Data‑driven decisions',
    desc: 'Visualize your business metrics at a glance.',
  },
  {
    src: 'https://images.unsplash.com/photo-1556741533-6e6a4b0b0e9b?w=1200&h=600&fit=crop',
    alt: 'Payment processing',
    title: 'Simplify transactions',
    desc: 'Invoicing, payments, and reconciliation made easy.',
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative overflow-hidden rounded-2xl glass-modern border-white/20">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, idx) => (
            <div key={idx} className="relative min-w-0 flex-[0_0_100%] aspect-[2/1]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{slide.title}</h3>
                <p className="mt-2 text-sm md:text-lg text-white/90 max-w-lg drop-shadow">{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full glass-modern text-white hover:bg-white/20 border-white/30"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full glass-modern text-white hover:bg-white/20 border-white/30"
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === selectedIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}