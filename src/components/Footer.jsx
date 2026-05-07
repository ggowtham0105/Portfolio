const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/30 py-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-space font-bold text-gradient">Gowtham Raj B</span>
        </div>
        
        <p className="text-text-light/60 text-sm text-center md:text-left mb-4 md:mb-0">
          © {currentYear} Gowtham Raj B. All rights reserved.
        </p>
  
      </div>
    </footer>
  );
};

export default Footer;
