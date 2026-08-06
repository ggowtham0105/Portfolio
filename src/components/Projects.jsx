import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: "Resume-to-Portfolio Generator",
      description: "Transform your resume into a modern, responsive portfolio website in seconds. Simply upload your resume, and the AI automatically extracts your skills, experience, education, and projects to generate a professional portfolio with a clean design. Customize your content, preview changes in real time, and deploy your portfolio instantly with a shareable link—no coding or design experience required. Built for students, developers, freelancers, and job seekers who want to establish a strong online presence quickly and efficiently.",
      image: "/resume-to-portfolio.png",
      tech: ["AI / LLM", "Cloudflare Workers", "React", "Tailwind CSS", "Instant Deployment"],
      github: "https://github.com/ggowtham0105",
      demo: "https://resume-to-portfolio.gauthamisnot08.workers.dev/",
      featured: true
    }
  ];

  return (
    <section id="projects" className="py-20 relative bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-primary">Project</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className={`grid grid-cols-1 ${projects.length === 1 ? 'max-w-4xl mx-auto' : 'lg:grid-cols-2'} gap-10`}>
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`glass-card overflow-hidden group flex flex-col ${project.featured ? 'ring-2 ring-primary/50' : ''}`}
            >
              <div className="relative h-72 md:h-80 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {project.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-primary text-bg-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Featured Project
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-text-light/80 text-sm md:text-base mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-6 mt-auto pt-4 border-t border-white/10">
                  <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    <FaGithub className="text-lg" /> Code / Repository
                  </a>
                  {project.demo !== "#" && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition-all">
                      <FaExternalLinkAlt className="text-sm" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
