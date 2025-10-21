'use client';

import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/data/placeholder-images';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  description: string;
  image?: ImagePlaceholder | { imageUrl: string; description: string; imageHint: string };
  github?: string;
  demo?: string;
  icon?: React.ReactNode;
}

interface ProjectsCarouselProps {
  items: Project[];
  isGamerSide?: boolean;
}

export function ProjectsCarousel({ items, isGamerSide = false }: ProjectsCarouselProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const cardClasses = 'bg-white/5 border-white/10 backdrop-blur-lg text-white';
    
  const buttonClasses = isGamerSide 
    ? 'text-white hover:text-primary bg-black/20 hover:bg-black/40 border-white/20' 
    : 'text-white hover:text-primary';

  return (
    <Carousel
      opts={{
        align: 'center',
        loop: true,
      }}
      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-lg mx-auto"
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="p-1">
              <Card className={`${cardClasses} h-full flex flex-col w-full`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">{item.icon} {item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-2 md:p-4">
                  {item.image && (
                    <Image
                      src={item.image.imageUrl}
                      alt={item.image.description}
                      width={600}
                      height={400}
                      priority={true}
                      className="rounded-lg object-cover w-full h-auto max-h-32 md:max-h-48"
                      data-ai-hint={item.image.imageHint}
                    />
                  )}
                </CardContent>
                {(item.github || item.demo) && (
                  <CardFooter className="flex justify-end gap-2 pt-4">
                    {item.github && !isGamerSide && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.github} target="_blank" rel="noopener noreferrer">
                          <Github /> <span className="sr-only">GitHub</span>
                        </a>
                      </Button>
                    )}
                    {item.demo && (
                      <Button variant="ghost" size="sm" asChild className={isGamerSide ? 'text-white' : ''}>
                        <a href={item.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink /> <span className="sr-only">Demo</span>
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                )}
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`${buttonClasses} opacity-0 md:opacity-100 md:flex`} />
      <CarouselNext className={`${buttonClasses} opacity-0 md:opacity-100 md:flex`} />
    </Carousel>
  );
}
