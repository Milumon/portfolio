import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedData = async () => {
  try {
    // Seed projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration, admin dashboard, and real-time inventory management.',
        github: 'https://github.com/milumon/ecommerce-platform',
        demo: 'https://ecommerce-demo.vercel.app',
      },
      {
        title: 'Task Management App',
        description: 'Collaborative project management tool with real-time updates, drag-and-drop interface, and team analytics.',
        github: 'https://github.com/milumon/task-manager',
        demo: 'https://taskmanager-demo.vercel.app',
      },
      {
        title: 'Weather Dashboard',
        description: 'Interactive weather application with location-based forecasts, historical data, and customizable widgets.',
        github: 'https://github.com/milumon/weather-dashboard',
        demo: 'https://weather-demo.vercel.app',
      },
    ];

    for (const project of projects) {
      await addDoc(collection(db, 'projects'), project);
    }

    // Seed social links
    const socialLinks = [
      {
        title: 'Instagram',
        description: 'Follow my latest posts and stories.',
        demo: 'https://instagram.com',
        icon: 'Instagram',
      },
      {
        title: 'TikTok',
        description: 'Check out my latest videos and trends.',
        demo: 'https://tiktok.com',
        icon: 'TikTokIcon',
      },
      {
        title: 'YouTube',
        description: 'Watch my latest streams and videos.',
        demo: 'https://youtube.com',
        icon: 'Youtube',
      },
    ];

    for (const link of socialLinks) {
      await addDoc(collection(db, 'socialLinks'), link);
    }

    // Seed creator tools
    const creatorTools = [
      'CapCut',
      'OBS Studio',
      'Photoshop',
      'Premiere Pro',
      'After Effects',
      'DaVinci Resolve',
      'Audacity',
      'Streamlabs',
      'Discord',
      'Canva',
    ];

    for (const tool of creatorTools) {
      await addDoc(collection(db, 'creatorTools'), { name: tool });
    }

    // Seed dev tools
    const devTools = [
      'React',
      'Next.js',
      'TypeScript',
      'Firebase',
      'Tailwind CSS',
      'Framer Motion',
    ];

    for (const tool of devTools) {
      await addDoc(collection(db, 'devTools'), { name: tool });
    }

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};