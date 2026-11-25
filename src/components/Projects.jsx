import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { usePortfolio } from '../context/portfolioContext';
import Reveal from './Reveal';

const Projects = () => {
  const { projects } = usePortfolio();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Featured Projects
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {projects.map((project, idx) => {
            const bullets =
              Array.isArray(project.bullets) && project.bullets.length > 0
                ? project.bullets
                : project.description
                  ? [project.description]
                  : [];

            return (
              <Reveal key={project.id || project.title} delay={idx * 70} className="h-full">
                <article className="surface-card overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-canvas border-b border-border-subtle flex items-center justify-center">
                    {project.architecture_image ? (
                      <img
                        src={project.architecture_image}
                        alt={project.architecture_alt || project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 px-6 text-center text-muted">
                        <FaCode className="text-2xl text-accent" aria-hidden="true" />
                        <span className="text-xs font-medium tracking-wide uppercase">
                          Project Preview
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold text-heading mb-4">
                      {project.title}
                    </h3>

                    {bullets.length > 0 && (
                      <ul className="list-disc list-inside text-muted text-sm sm:text-base mb-6 space-y-2 leading-relaxed flex-1">
                        {bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {Array.isArray(project.tech) && project.tech.length > 0 && (
                      <ul className="flex flex-wrap gap-2 mb-6" aria-label="Technologies used">
                        {project.tech.map((tech) => (
                          <li
                            key={tech}
                            className="text-xs font-medium text-heading bg-canvas px-2.5 py-1 rounded-lg border border-border-subtle"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
                      {project.demo && project.demo !== '#' && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                        >
                          <span>Live demo</span>
                          <FaExternalLinkAlt className="text-xs btn-arrow" aria-hidden="true" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                        >
                          <FaGithub className="text-base text-muted" aria-hidden="true" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
