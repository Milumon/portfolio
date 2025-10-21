'use client';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/components/common/motion-div';
import { getDevTools } from '@/lib/services/firestore';
import { useState, useEffect } from 'react';

export function TechStackList() {
  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const devTools = await getDevTools();
        setTechnologies(devTools);
      } catch (error) {
        console.error('Error loading technologies:', error);
        setTechnologies([]);
      }
    };

    loadTechnologies();
  }, []);


  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  if (technologies.length <= 4) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {technologies.map((tech) => (
          <MotionDiv variants={item} key={tech}>
            <Badge
              variant="outline"
              className="bg-white/10 border-white/20 text-white backdrop-blur-sm px-3 py-1 text-sm font-medium"
            >
              {tech}
            </Badge>
          </MotionDiv>
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex gap-2 animate-scroll">
        {[...technologies, ...technologies].map((tech, index) => (
          <MotionDiv variants={item} key={`${tech}-${index}`}>
            <Badge
              variant="outline"
              className="bg-white/10 border-white/20 text-white backdrop-blur-sm px-3 py-1 text-sm font-medium whitespace-nowrap"
            >
              {tech}
            </Badge>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
