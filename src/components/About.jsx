import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="text-primary">Me</span></h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="glass-card p-8 md:p-12">
            <p className="text-lg text-text-light/80 leading-relaxed mb-6">
              I am a 3rd-year engineering student focused on Data Engineering, Cloud Computing, and scalable backend systems. I enjoy building projects that transform raw data into meaningful insights and solving complex data challenges.
            </p>
            <p className="text-lg text-text-light/80 leading-relaxed mb-6">
              Currently pursuing my B.Tech in Computer Science & Business Systems, I have hands-on experience with Python, SQL, AWS, and ETL workflows. I am actively expanding my expertise by building robust data pipelines and earning industry-recognized certifications.
            </p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="border border-white/10 rounded-xl p-4 bg-secondary/30">
                <h3 className="text-primary font-bold mb-1">Education</h3>
                <p className="text-text-light/70 text-sm">B.Tech - CSBS (2023 - 2027)</p>
              </div>
              <div className="border border-white/10 rounded-xl p-4 bg-secondary/30">
                <h3 className="text-primary font-bold mb-1">Location</h3>
                <p className="text-text-light/70 text-sm">Karur, Tamil Nadu, India</p>
              </div>
              <div className="border border-white/10 rounded-xl p-4 bg-secondary/30">
                <h3 className="text-primary font-bold mb-1">Interests</h3>
                <p className="text-text-light/70 text-sm">Data Engineer, Cloud Computing, Data Analytics</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
