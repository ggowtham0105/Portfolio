import { FaGraduationCap, FaLanguage } from 'react-icons/fa';
import Reveal from './Reveal';

const EDUCATION_ITEMS = [
  {
    degree: 'Bachelor of Technology, Computer Science & Business Systems',
    school: 'SSM Institute of Engineering and Technology, Dindigul',
    period: 'Aug 2023 – Apr 2027',
  },
  {
    degree: 'Higher Secondary Education',
    school: 'Model Higher Secondary School, Tharagampatti',
    period: 'June 2021 – Apr 2023',
  },
];

const Education = () => {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 id="education-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Education
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <div className="space-y-4">
          {EDUCATION_ITEMS.map((item, idx) => (
            <Reveal key={item.degree} delay={idx * 70}>
              <div className="surface-card p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-canvas border border-border-subtle text-accent shrink-0">
                      <FaGraduationCap className="text-xl" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-heading">{item.degree}</h3>
                      <p className="text-accent font-medium mt-1">{item.school}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted shrink-0 sm:pt-1">{item.period}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
            <FaLanguage className="text-base text-accent" aria-hidden="true" />
            <span>Languages: English, Tamil</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Education;
