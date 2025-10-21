'use client';
import { useState, useEffect } from 'react';

import { PlaceHolderImages } from '@/lib/data/placeholder-images';
import { MotionDiv } from '@/components/common/motion-div';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WireframeOverlay } from '@/components/common/wireframe-overlay';
import { ProjectsCarousel } from './projects-carousel';
import { Instagram, Youtube } from 'lucide-react';
import { TikTokIcon } from '../icons/tiktok';
import { getSocialLinks, getCreatorTools } from '@/lib/services/firestore';
import type { ImagePlaceholder } from '@/lib/data/placeholder-images';

const socialImages = [
  PlaceHolderImages.find((p) => p.id === 'social-instagram'),
  PlaceHolderImages.find((p) => p.id === 'social-tiktok'),
  PlaceHolderImages.find((p) => p.id === 'social-youtube'),
].filter(Boolean);

interface SocialProject {
  title: string;
  description: string;
  image?: ImagePlaceholder | { imageUrl: string; description: string; imageHint: string };
  demo?: string;
  icon?: React.ReactNode;
}

export function GamerSide() {
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [creatorTools, setCreatorTools] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [socialLinksData, creatorToolsData] = await Promise.all([
          getSocialLinks(),
          getCreatorTools(),
        ]);

        // Map social links to the format expected by ProjectsCarousel
        const formattedSocialProjects = socialLinksData.map((link, index) => ({
          title: link.title,
          description: link.description,
          image: link.image ? { imageUrl: link.image, description: link.title, imageHint: `${link.title} social media` } : socialImages[index] || socialImages[0], // Use Firestore image or fallback
          demo: link.demo,
          icon: link.icon === 'Instagram' ? <Instagram /> :
                link.icon === 'TikTokIcon' ? <TikTokIcon /> :
                link.icon === 'Youtube' ? <Youtube /> : null,
        }));

        setSocialProjects(formattedSocialProjects);
        setCreatorTools(creatorToolsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Show empty state if Firestore fails - no fallback data
        setSocialProjects([]);
        setCreatorTools([]);
      }
    };

    loadData();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative flex w-full flex-col items-center justify-start pt-48 pb-8 px-8 md:w-1/2 min-h-[100svh] text-center text-white transition-all duration-500 md:transform md:hover:scale-[1.02] md:hover:translate-x-2">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <WireframeOverlay />


      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <MotionDiv variants={itemVariants} className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-white hover:text-primary transition-colors duration-300">Milumon</h2>
          <p className="mt-2 text-lg text-slate-200 hover:text-slate-100 transition-colors duration-300">Gaming Content Creator</p>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="w-full max-w-lg">
          {creatorTools.length <= 4 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {creatorTools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white backdrop-blur-sm px-3 py-1 text-sm font-medium"
                  >
                    {tool}
                  </Badge>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-2 animate-scroll">
                {[...creatorTools, ...creatorTools].map((tool, index) => (
                  <Badge
                    key={`${tool}-${index}`}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white backdrop-blur-sm px-3 py-1 text-sm font-medium whitespace-nowrap"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </MotionDiv>
        
        <MotionDiv variants={itemVariants} className="w-full max-w-lg">
            <ProjectsCarousel items={socialProjects} isGamerSide={true} />
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="flex gap-4">
          <Button
            variant="outline"
            className="border-white/30 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3),inset_0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(255,255,255,0.4),inset_0_0_12px_rgba(255,255,255,0.2)] hover:scale-105 hover:-translate-y-1"
          >
            Let&apos;s Collaborate!
          </Button>
        </MotionDiv>

      </MotionDiv>
    </section>
  );
}
