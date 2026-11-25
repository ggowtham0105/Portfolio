import { useEffect, useRef, useState } from 'react';

const FINE_HOVER_QUERY = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function canEnableEffects() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return (
    window.matchMedia(FINE_HOVER_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/**
 * Custom accent cursor (7px dot + 36px lerped ring), magnetic buttons,
 * card spotlight (--sx/--sy), and hero photo parallax (--px/--py).
 * Disabled automatically on touch devices or when prefers-reduced-motion is set.
 */
const CursorEffects = () => {
  const [enabled, setEnabled] = useState(canEnableEffects);
  const dotRef = useRef(null);
  const ringWrapRef = useRef(null);
  const ringInnerRef = useRef(null);

  useEffect(() => {
    const fineMq = window.matchMedia(FINE_HOVER_QUERY);
    const motionMq = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setEnabled(fineMq.matches && !motionMq.matches);

    fineMq.addEventListener('change', sync);
    motionMq.addEventListener('change', sync);
    return () => {
      fineMq.removeEventListener('change', sync);
      motionMq.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove('cursor-enhanced');
      return undefined;
    }

    root.classList.add('cursor-enhanced');

    let visible = false;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastTarget = null;
    let rafId = 0;
    let moveDirty = false;
    const activeMagnetic = new Set();

    const setVisibility = (show) => {
      visible = show;
      const op = show ? '1' : '0';
      if (dotRef.current) dotRef.current.style.opacity = op;
      if (ringWrapRef.current) ringWrapRef.current.style.opacity = op;
    };

    const resetInteractive = () => {
      for (const btn of activeMagnetic) {
        btn.style.removeProperty('--mx');
        btn.style.removeProperty('--my');
      }
      activeMagnetic.clear();
      const photo = document.querySelector('[data-hero-photo]');
      if (photo) {
        photo.style.setProperty('--px', '0px');
        photo.style.setProperty('--py', '0px');
      }
      if (ringInnerRef.current) {
        ringInnerRef.current.classList.remove('is-hover', 'is-down');
      }
    };

    const updateFrame = () => {
      rafId = 0;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3.5}px, ${mouseY - 3.5}px, 0)`;
      }

      if (moveDirty) {
        moveDirty = false;

        // Ring hover state over links, buttons, or cards
        if (ringInnerRef.current) {
          const isInteractive = Boolean(
            lastTarget &&
              typeof lastTarget.closest === 'function' &&
              lastTarget.closest('a, button, .surface-card')
          );
          ringInnerRef.current.classList.toggle('is-hover', isInteractive);
        }

        // Card spotlight (--sx, --sy)
        const card =
          lastTarget && typeof lastTarget.closest === 'function'
            ? lastTarget.closest('.surface-card')
            : null;
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--sx', `${mouseX - rect.left}px`);
          card.style.setProperty('--sy', `${mouseY - rect.top}px`);
        }

        // Magnetic buttons (25% pull within 90px of center)
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        for (const btn of buttons) {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = mouseX - cx;
          const dy = mouseY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < 90) {
            btn.style.setProperty('--mx', `${(dx * 0.25).toFixed(2)}px`);
            btn.style.setProperty('--my', `${(dy * 0.25).toFixed(2)}px`);
            activeMagnetic.add(btn);
          } else if (activeMagnetic.has(btn)) {
            btn.style.removeProperty('--mx');
            btn.style.removeProperty('--my');
            activeMagnetic.delete(btn);
          }
        }

        // Hero photo parallax (max 7px)
        const photo = document.querySelector('[data-hero-photo]');
        if (photo && window.innerWidth > 0 && window.innerHeight > 0) {
          const nx = Math.max(-1, Math.min(1, (mouseX / window.innerWidth - 0.5) * 2));
          const ny = Math.max(-1, Math.min(1, (mouseY / window.innerHeight - 0.5) * 2));
          photo.style.setProperty('--px', `${(nx * 7).toFixed(2)}px`);
          photo.style.setProperty('--py', `${(ny * 7).toFixed(2)}px`);
        }
      }

      // Smooth lerp for ring
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;

      if (ringWrapRef.current) {
        ringWrapRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      }

      if (visible && (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15)) {
        rafId = window.requestAnimationFrame(updateFrame);
      }
    };

    const scheduleFrame = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFrame);
      }
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastTarget = e.target;
      moveDirty = true;

      if (!visible) {
        ringX = mouseX;
        ringY = mouseY;
        setVisibility(true);
      }

      scheduleFrame();
    };

    const handleMouseDown = () => {
      if (ringInnerRef.current) {
        ringInnerRef.current.classList.add('is-down');
      }
    };

    const handleMouseUp = () => {
      if (ringInnerRef.current) {
        ringInnerRef.current.classList.remove('is-down');
      }
    };

    const handleMouseLeave = () => {
      setVisibility(false);
      resetInteractive();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    return () => {
      root.classList.remove('cursor-enhanced');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
      resetInteractive();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringWrapRef}
        aria-hidden="true"
        className="custom-cursor-ring-wrap"
        style={{ opacity: 0 }}
      >
        <div ref={ringInnerRef} className="custom-cursor-ring" />
      </div>
    </>
  );
};

export default CursorEffects;

