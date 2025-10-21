'use client';
import { useState, useEffect } from 'react';

import { PlaceHolderImages } from '@/lib/data/placeholder-images';
import { TechStackList } from './tech-stack-grid';
import { WireframeOverlay } from '@/components/common/wireframe-overlay';
import { MotionDiv } from '@/components/common/motion-div';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectsCarousel } from './projects-carousel';
import { getProjects } from '@/lib/services/firestore';
import type { ImagePlaceholder } from '@/lib/data/placeholder-images';

interface Project {
  title: string;
  description: string;
  image?: ImagePlaceholder | { imageUrl: string; description: string; imageHint: string };
  github?: string;
  demo?: string;
  icon?: React.ReactNode;
}

const projectImages = [
  PlaceHolderImages.find((p) => p.id === 'dev-project-1'),
  PlaceHolderImages.find((p) => p.id === 'dev-project-2'),
  PlaceHolderImages.find((p) => p.id === 'dev-project-3'),
].filter(Boolean);

export function DevSide() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await getProjects();
        // Map Firestore projects to the format expected by ProjectsCarousel
        const formattedProjects = projectsData.map((project, index) => ({
          title: project.title,
          description: project.description,
          image: project.image ? { imageUrl: project.image, description: project.title, imageHint: 'Project image' } : (projectImages[index] || projectImages[0]), // Use custom image if available, fallback to placeholder
          github: project.github,
          demo: project.demo,
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Show empty state if Firestore fails - no fallback data
        setProjects([]);
      }
    };

    loadProjects();
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
    <section className="relative flex w-full flex-col items-center justify-start pt-48 pb-8 px-8 md:w-1/2 min-h-[100svh] text-center transition-all duration-500 md:transform md:hover:scale-[1.02] md:hover:-translate-x-2">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 via-background/10 to-primary/20" />
        <div className="absolute inset-0 bg-neutral-900/40" />
        <WireframeOverlay />
      </div>


      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <MotionDiv variants={itemVariants} className="flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-white tracking-tight hover:text-secondary transition-colors duration-300">Milumon</h2>
          <p className="mt-2 text-lg text-slate-300 hover:text-slate-200 transition-colors duration-300">Web Developer</p>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="w-full max-w-lg">
          <TechStackList />
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="w-full max-w-lg">
            <ProjectsCarousel items={projects} />
        </MotionDiv>
        

        <MotionDiv variants={itemVariants} className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-secondary text-secondary bg-transparent backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300 shadow-[0_0_8px_hsl(var(--secondary)),inset_0_0_8px_hsl(var(--secondary))] hover:shadow-[0_0_12px_hsl(var(--secondary)),inset_0_0_12px_hsl(var(--secondary))] hover:scale-105 hover:-translate-y-1"
              >
                Download CV
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background/80 backdrop-blur-sm border-white/10 text-white">
              <DropdownMenuItem>ENG</DropdownMenuItem>
              <DropdownMenuItem>ESP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="border-secondary text-secondary bg-transparent backdrop-blur-sm hover:bg-secondary/20 transition-all duration-300 shadow-[0_0_8px_hsl(var(--secondary)),inset_0_0_8px_hsl(var(--secondary))] hover:shadow-[0_0_12px_hsl(var(--secondary)),inset_0_0_12px_hsl(var(--secondary))] hover:scale-105 hover:-translate-y-1"
          >
            Linkedin
          </Button>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
