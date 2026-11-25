const Footer = ({ onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-canvas py-8 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          onDoubleClick={onOpenAdmin}
          className="text-lg font-bold text-heading tracking-tight"
        >
          Gowtham Raj B
        </span>
        <p className="text-sm text-muted">
          © {currentYear} Gowtham Raj B. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
