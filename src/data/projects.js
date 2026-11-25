/**
 * Data-driven list of portfolio projects.
 * Each project supports:
 * - title: string
 * - tech: string[]
 * - bullets: string[]
 * - architectureImage?: string
 * - architectureAlt?: string
 * - github: string
 * - demo: string
 */
export const PROJECTS = [
  {
    title: 'Namma TN Guide – Tamil Nadu Tourist Guide Generator',
    tech: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'Supabase/PostgreSQL',
      'Crew AI Cloud',
      'Marked.js',
      'DOMPurify',
      'Google Maps API',
    ],
    bullets: [
      'Developed a website that helps users explore Tamil Nadu by generating personalized travel plans based on their interests.',
      'Created a simple, mobile-friendly design that makes it easy for users to explore tourist destinations.',
      'Connected Google Maps to help users find places and plan their trips more easily.',
      'Used AI to generate travel suggestions and organize useful destination information in one place.',
    ],
    architectureImage: '',
    architectureAlt: 'Namma TN Guide – Tamil Nadu Tourist Guide Generator',
    github: 'https://github.com/ggowtham0105/tourist_family',
    demo: 'https://tourist-family-i6za.vercel.app/',
  },
  {
    title: 'SkinTrack – Track Your Skin Progress Over Time',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'SQLite',
      'Firebase',
      'REST APIs',
      'JWT',
    ],
    bullets: [
      'Developed a web application that helps users track skin changes over time by uploading and comparing photos.',
      'Created an easy-to-use dashboard where users can view their photos and track their progress.',
      'Added secure login and registration to protect user accounts and personal information.',
      'Included photo storage and email notifications to make tracking and managing progress easier.',
    ],
    architectureImage: '',
    architectureAlt: 'SkinTrack – Track Your Skin Progress Over Time',
    github: 'https://github.com/ggowtham0105/SkinTracker',
    demo: 'https://skintracker.pages.dev/',
  },
];
