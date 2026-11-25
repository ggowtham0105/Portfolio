import { useEffect, useRef, useState } from 'react';

/**
 * Reveals children once when entering the viewport (IntersectionObserver threshold 0.15).
 * Relies on CSS `.js-enabled .reveal` so content remains visible if JS fails.
 */
const Reveal = ({ children, delay = 0, variant = 'up', className = '' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const baseClass = variant === 'bar' ? 'reveal-bar' : 'reveal';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default Reveal;

