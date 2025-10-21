import { GamerSide } from '@/components/portfolio/hero-gaming-section';
import { DevSide } from '@/components/portfolio/hero-dev-section';
import { MotionDiv } from '@/components/common/motion-div';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      <GamerSide />
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="from-primary/10 via-transparent to-secondary/10 hidden md:block absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b shadow-[0_0_10px_1px_hsl(var(--primary)_/_0.2)]"
      ></MotionDiv>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="hidden md:block absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-secondary/30 to-primary/20 blur-sm"
      ></MotionDiv>
      <DevSide />
    </main>
  );
}
