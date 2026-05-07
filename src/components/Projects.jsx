import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: "AWS End-to-End Data Engineering Pipeline",
      description: "Designed a raw → processed → curated data architecture. Built ETL transformations using Python, handled nulls, deduplication, and schema validation. Converted datasets to Parquet for optimized querying and used partitioning to improve Athena performance. Automated ingestion with Lambda and EventBridge, and implemented CloudWatch monitoring.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tech: ["AWS S3", "AWS Lambda", "AWS Athena", "Python", "SQL", "CloudWatch"],
      github: "https://github.com",
      demo: "https://aws.amazon.com",
      featured: true
    },
    {
      title: "Sales Analytics Dashboard",
      description: "Developed an interactive Power BI dashboard connecting to a SQL database. Performed data modeling, DAX calculations, and created visual insights for monthly sales performance and geographical trends.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tech: ["Power BI", "SQL Server", "Data Modeling", "DAX"],
      github: "https://github.com",
      demo: "#",
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 relative bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-primary">Projects</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`glass-card overflow-hidden group flex flex-col ${project.featured ? 'ring-2 ring-primary/50' : ''}`}
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {project.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-primary text-bg-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-text-light/70 text-sm mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                  <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    <FaGithub className="text-lg" /> Code
                  </a>
                  {project.demo !== "#" && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ml-4">
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
