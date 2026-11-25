import { FaGithub, FaLinkedin, FaDownload, FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/portfolioContext';

const Hero = ({ onOpenAdmin }) => {
  const { settings } = usePortfolio();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex-1 text-center md:text-left">
            <p
              className="hero-stagger inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-surface text-heading border border-border-subtle mb-5"
              style={{ '--hero-delay': '0ms' }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: 'var(--accent)' }}
                aria-hidden="true"
              />
              <span>{settings.hero_badge}</span>
            </p>

            <h1
              id="hero-heading"
              onDoubleClick={onOpenAdmin}
              className="hero-stagger text-4xl sm:text-5xl lg:text-6xl font-bold text-heading mb-3"
              style={{ '--hero-delay': '80ms' }}
            >
              {settings.hero_name}
            </h1>

            <p
              className="hero-stagger text-lg sm:text-xl lg:text-2xl font-medium mb-2"
              style={{ color: 'var(--accent)', '--hero-delay': '160ms' }}
            >
              {settings.hero_subtitle}
            </p>

            <p
              className="hero-stagger text-sm sm:text-base font-medium text-muted mb-5"
              style={{ '--hero-delay': '240ms' }}
            >
              {settings.hero_skills_line || 'Python · SQL · Node.js'}
            </p>

            <p
              className="hero-stagger text-base sm:text-lg text-muted max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed"
              style={{ '--hero-delay': '320ms' }}
            >
              {settings.hero_bio}
            </p>

            <div
              className="hero-stagger flex flex-wrap items-center justify-center md:justify-start gap-3.5"
              style={{ '--hero-delay': '400ms' }}
            >
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base"
              >
                <span>Get in touch</span>
                <FaArrowRight className="text-sm btn-arrow" aria-hidden="true" />
              </a>

              <a
                href={settings.resume_url || '/resume.pdf'}
                download="Gowtham_Raj_B_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base"
              >
                <FaDownload className="text-sm text-muted" aria-hidden="true" />
                <span>Download résumé</span>
              </a>

              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="btn-secondary inline-flex items-center gap-2 px-4 py-3 text-sm"
              >
                <FaGithub className="text-lg text-muted" aria-hidden="true" />
                <span>GitHub</span>
              </a>

              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="btn-secondary inline-flex items-center gap-2 px-4 py-3 text-sm"
              >
                <FaLinkedin className="text-lg text-muted" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="shrink-0 flex justify-center">
            <div
              data-hero-photo
              className="hero-photo-in hero-photo-parallax w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
              style={{
                backgroundColor: 'var(--photo-bg)',
                border: '3px solid var(--accent)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              }}
            >
              <img
                src={settings.profile_image_url || '/profile.png'}
                alt="Gowtham Raj B"
                width={320}
                height={320}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'top center' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
