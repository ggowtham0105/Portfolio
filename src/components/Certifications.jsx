import { useState } from 'react';
import { FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { usePortfolio } from '../context/portfolioContext';
import Reveal from './Reveal';

// TODO: Verify issuer names against the certificate files in public/certificates/.
const CertificateCard = ({ cert, delay = 0 }) => (
  <Reveal delay={delay} className="h-full">
    <article className="surface-card p-6 flex flex-col h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
        {cert.provider} · {cert.date}
      </p>
      <h3 className="text-lg font-bold text-heading mb-3">{cert.title}</h3>
      {cert.skills && (
        <p className="text-xs text-muted mb-5">
          Skills: <span className="text-body">{cert.skills}</span>
        </p>
      )}
      <div className="mt-auto pt-4 border-t border-border-subtle">
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center justify-center gap-2 text-sm px-4 py-2 w-full"
        >
          <span>View Certificate</span>
          <FaExternalLinkAlt className="text-xs text-muted btn-arrow" aria-hidden="true" />
        </a>
      </div>
    </article>
  </Reveal>
);

const Certifications = () => {
  const [showMore, setShowMore] = useState(false);
  const { certifications } = usePortfolio();

  const featuredCerts = certifications.filter((cert) => cert.featured);
  const moreCerts = certifications.filter((cert) => !cert.featured);

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="py-16 md:py-20 border-t border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 id="certifications-heading" className="text-3xl md:text-4xl font-bold text-heading mb-3">
              Licenses &amp; Certifications
            </h2>
          </Reveal>
          <Reveal variant="bar" delay={80}>
            <div className="heading-accent-bar" aria-hidden="true" />
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {featuredCerts.map((cert, idx) => (
            <CertificateCard key={cert.id || cert.title} cert={cert} delay={idx * 70} />
          ))}
        </div>

        {moreCerts.length > 0 && (
          <>
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
                aria-expanded={showMore}
                aria-controls="more-certificates-list"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
              >
                <span>More certificates ({moreCerts.length})</span>
                {showMore ? (
                  <FaChevronUp className="text-xs text-muted" aria-hidden="true" />
                ) : (
                  <FaChevronDown className="text-xs text-muted" aria-hidden="true" />
                )}
              </button>
            </div>

            {showMore && (
              <div
                id="more-certificates-list"
                className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
              >
                {moreCerts.map((cert, idx) => (
                  <CertificateCard key={cert.id || cert.title} cert={cert} delay={idx * 70} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Certifications;
