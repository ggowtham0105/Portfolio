import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="text-primary font-medium tracking-wide mb-2">Hello, I'm</h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Gowtham Raj B
            </h1>
            <div className="text-2xl md:text-3xl font-medium text-text-light/80 mb-6 h-12">
              <TypeAnimation
                sequence={[
                  'Aspiring Data Engineer',
                  2000,
                  'Building Scalable Data Solutions',
                  2000,
                  'Transforming Data into Insights',
                  2000,
                  'Cloud • Data • Engineering',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
            <p className="text-lg text-text-light/70 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
              I'm a 3rd-year B.Tech student specializing in Data Engineering with Python, SQL, and AWS. I love building scalable pipelines and turning complex data into actionable insights.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-medium hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              >
                Hire Me
              </a>
              <a 
                href="/resume.pdf" 
                target="_blank"
                className="px-8 py-3 glass text-text-light rounded-full font-medium hover:bg-white/10 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaDownload /> Resume
              </a>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-light/60 hover:text-primary text-2xl transition-colors duration-300">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-light/60 hover:text-primary text-2xl transition-colors duration-300">
                <FaLinkedin />
              </a>
              <a href="mailto:gowtham@example.com" className="text-text-light/60 hover:text-primary text-2xl transition-colors duration-300">
                <FaEnvelope />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-tr from-primary via-accent to-blue-500">
              <div className="absolute inset-0 bg-bg-dark rounded-full m-1"></div>
              <img 
                src="/IMG_0048.jpg" 
                alt="Gowtham Raj B" 
                className="rounded-full w-full h-full object-cover relative z-10 p-2 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              />
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass px-4 py-2 rounded-xl flex items-center gap-2 z-20"
              >
                <span className="text-2xl">🐍</span>
                <span className="font-semibold text-sm">Python</span>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-10 -left-8 glass px-4 py-2 rounded-xl flex items-center gap-2 z-20"
              >
                <span className="text-2xl">☁️</span>
                <span className="font-semibold text-sm">AWS</span>
              </motion.div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
