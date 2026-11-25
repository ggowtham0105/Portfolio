import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/portfolioContext';
import Reveal from './Reveal';

const Contact = () => {
  const { settings } = usePortfolio();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Reveal>
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Get In Touch
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="surface-card p-8 sm:p-10">
            <p className="text-base sm:text-lg text-muted leading-relaxed mb-8">
              {settings.contact_copy}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={`mailto:${settings.contact_email}`}
                className="btn-primary inline-flex items-center gap-2.5 px-6 py-3 text-sm sm:text-base"
              >
                <FaEnvelope aria-hidden="true" />
                <span>Email me</span>
                <FaArrowRight className="text-xs btn-arrow" aria-hidden="true" />
              </a>

              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2.5 px-5 py-3 text-sm sm:text-base"
              >
                <FaLinkedin className="text-muted" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>

              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2.5 px-5 py-3 text-sm sm:text-base"
              >
                <FaGithub className="text-muted" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>
                Direct email:{' '}
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-accent hover:underline font-medium"
                >
                  {settings.contact_email}
                </a>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-accent" aria-hidden="true" />
                <span>{settings.contact_location || 'Karur, Tamil Nadu'}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
