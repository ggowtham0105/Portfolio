import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';

const Experience = () => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work <span className="text-primary">Experience</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="relative border-l-2 border-primary/30 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 relative md:flex md:justify-between md:items-center w-full"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] md:left-1/2 md:-translate-x-1/2 bg-primary w-5 h-5 rounded-full border-4 border-bg-dark z-10 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
            
            <div className="md:w-5/12 order-1 md:text-right md:pr-10">
              <h3 className="text-xl font-bold text-white mb-1">Software Engineer Intern</h3>
              <h4 className="text-accent font-medium mb-2">Crescent Infotech</h4>
              <p className="flex items-center md:justify-end gap-2 text-sm text-text-light/60 mb-4">
                <FaCalendarAlt /> July 2025 – August 2025
              </p>
            </div>
            
            <div className="md:w-5/12 order-2 md:pl-10 mt-4 md:mt-0">
              <div className="glass-card p-6 relative group">
                {/* Arrow */}
                <div className="hidden md:block absolute top-6 -left-3 w-3 h-3 bg-secondary/50 border-t border-l border-white/5 rotate-[-45deg] group-hover:border-primary/30 transition-colors"></div>
                
                <ul className="list-disc list-inside text-text-light/80 text-sm space-y-2 leading-relaxed">
                  <li>Built and optimized ETL pipelines using Python and SQL.</li>
                  <li>Automated data extraction and transformation workflows.</li>
                  <li>Performed data cleaning, validation, deduplication, and schema checks.</li>
                  <li>Wrote optimized SQL queries using joins, CTEs, and aggregations.</li>
                  <li>Managed AWS S3 raw-to-curated storage architecture.</li>
                  <li>Monitored cloud pipelines using AWS CloudWatch and Linux log analysis.</li>
                  <li>Improved reporting efficiency and reduced manual processing efforts.</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Experience;
