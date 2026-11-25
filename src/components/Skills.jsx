import {
  FaPython,
  FaJs,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaChartBar,
  FaFileExcel,
} from 'react-icons/fa';
import {
  SiMysql,
  SiTypescript,
  SiTailwindcss,
  SiPandas,
  SiNumpy,
  SiFirebase,
  SiSupabase,
} from 'react-icons/si';
import { usePortfolio } from '../context/portfolioContext';
import Reveal from './Reveal';

function getSkillIcon(name) {
  const key = name.trim().toLowerCase();
  if (key === 'python') return <FaPython aria-hidden="true" />;
  if (key === 'sql' || key === 'mysql') return <SiMysql aria-hidden="true" />;
  if (key === 'javascript (es6+)') return <FaJs aria-hidden="true" />;
  if (key === 'typescript') return <SiTypescript aria-hidden="true" />;
  if (key === 'node.js') return <FaNodeJs aria-hidden="true" />;
  if (key === 'html') return <FaHtml5 aria-hidden="true" />;
  if (key === 'css') return <FaCss3Alt aria-hidden="true" />;
  if (key === 'tailwind css') return <SiTailwindcss aria-hidden="true" />;
  if (key === 'excel') return <FaFileExcel aria-hidden="true" />;
  if (key === 'pandas') return <SiPandas aria-hidden="true" />;
  if (key === 'numpy') return <SiNumpy aria-hidden="true" />;
  if (key === 'power bi') return <FaChartBar aria-hidden="true" />;
  if (key === 'git/github') return <FaGitAlt aria-hidden="true" />;
  if (key === 'firebase') return <SiFirebase aria-hidden="true" />;
  if (key === 'supabase') return <SiSupabase aria-hidden="true" />;
  return null;
}

const Skills = () => {
  const { skills } = usePortfolio();

  const grouped = [];
  const groupMap = new Map();
  for (const item of skills) {
    const groupTitle = item.group_name || 'Other';
    if (!groupMap.has(groupTitle)) {
      const entry = { title: groupTitle, items: [] };
      groupMap.set(groupTitle, entry);
      grouped.push(entry);
    }
    groupMap.get(groupTitle).items.push(item);
  }

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 id="skills-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Skills &amp; Technologies
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {grouped.map((group, groupIdx) => (
            <Reveal key={group.title} delay={groupIdx * 70} className="h-full">
              <div className="surface-card p-6 sm:p-7 flex flex-col h-full">
                <h3 className="text-lg font-bold text-heading mb-4">{group.title}</h3>
                <ul className="flex flex-wrap gap-2.5 content-start flex-1">
                  {group.items.map((skill, chipIdx) => {
                    const icon = getSkillIcon(skill.name);
                    return (
                      <li key={skill.id || `${group.title}-${skill.name}`}>
                        <Reveal delay={chipIdx * 70}>
                          <div className="group inline-flex items-center gap-2 px-3 py-2 bg-canvas rounded-lg border border-border-subtle hover:border-accent transition-colors">
                            {icon && (
                              <span className="text-base text-muted group-hover:text-heading transition-colors">
                                {icon}
                              </span>
                            )}
                            <span className="text-sm font-medium text-heading">{skill.name}</span>
                          </div>
                        </Reveal>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
