import { FaCalendarAlt } from 'react-icons/fa';
import { usePortfolio } from '../context/portfolioContext';
import Reveal from './Reveal';

const Experience = () => {
  const { experiences } = usePortfolio();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 id="experience-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Work Experience
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <ol className="space-y-6">
          {experiences.map((exp, idx) => (
            <li key={exp.id || `${exp.role}-${exp.organization}`}>
              <Reveal delay={idx * 70}>
                <div className="surface-card p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-heading">{exp.role}</h3>
                      <p className="text-accent font-medium">{exp.organization}</p>
                    </div>
                    <p className="inline-flex items-center gap-2 text-sm text-muted shrink-0">
                      <FaCalendarAlt aria-hidden="true" />
                      <span>{exp.period}</span>
                    </p>
                  </div>

                  {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-muted text-sm sm:text-base space-y-2 leading-relaxed">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
