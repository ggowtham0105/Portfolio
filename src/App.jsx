import { lazy, Suspense, useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorEffects from './components/CursorEffects';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function isAdminLocation() {
  return window.location.pathname === '/admin' || window.location.hash === '#admin';
}

function PortfolioApp() {
  const [isAdmin, setIsAdmin] = useState(isAdminLocation);

  useEffect(() => {
    const syncRoute = () => setIsAdmin(isAdminLocation());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname !== path || window.location.hash) {
      window.history.pushState({}, '', path);
    }
    setIsAdmin(path === '/admin');
    window.scrollTo(0, 0);
  };

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-canvas flex items-center justify-center text-body">
            Loading admin...
          </div>
        }
      >
        <AdminDashboard onBack={() => navigateTo('/')} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 btn-primary"
      >
        Skip to main content
      </a>
      <Navbar onOpenAdmin={() => navigateTo('/admin')} />
      <main id="main-content">
        <Hero onOpenAdmin={() => navigateTo('/admin')} />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer onOpenAdmin={() => navigateTo('/admin')} />
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <CursorEffects />
      <PortfolioApp />
    </PortfolioProvider>
  );
}

export default App;
