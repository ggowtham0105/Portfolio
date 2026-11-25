import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { name: 'Skills', id: 'skills', href: '#skills' },
  { name: 'Projects', id: 'projects', href: '#projects' },
  { name: 'Experience', id: 'experience', href: '#experience' },
  { name: 'Education', id: 'education', href: '#education' },
  { name: 'Certifications', id: 'certifications', href: '#certifications' },
  { name: 'Contact', id: 'contact', href: '#contact' },
];

const Navbar = ({ onOpenAdmin }) => {
  const [activeId, setActiveId] = useState('');
  const progressBarRef = useRef(null);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? Math.min(1, Math.max(0, totalScroll / windowHeight)) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Fixed 2px scroll progress bar at top of viewport */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[60] pointer-events-none"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />

      <header className="sticky top-0 z-50 bg-canvas border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <a
              href="#home"
              onDoubleClick={(e) => {
                if (onOpenAdmin) {
                  e.preventDefault();
                  onOpenAdmin();
                }
              }}
              className="shrink-0 text-lg sm:text-xl font-bold text-heading tracking-tight rounded-md"
            >
              Gowtham Raj B
            </a>

            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-6 lg:gap-8"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveId(link.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`nav-link text-sm font-medium py-1 transition-colors ${
                      isActive
                        ? 'nav-link-active text-accent'
                        : 'text-muted hover:text-heading'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </nav>

            <a href="#contact" className="shrink-0 btn-primary px-4 py-2 text-sm">
              Get in touch
            </a>
          </div>

          {/* Horizontally scrollable sticky nav strip on mobile */}
          <nav
            aria-label="Mobile section navigation"
            className="md:hidden flex items-center gap-5 overflow-x-auto no-scrollbar pb-2.5 pt-1 border-t border-border-subtle"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveId(link.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`nav-link shrink-0 whitespace-nowrap text-sm font-medium py-1 transition-colors ${
                    isActive
                      ? 'nav-link-active text-accent'
                      : 'text-muted hover:text-heading'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
