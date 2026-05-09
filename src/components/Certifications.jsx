import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Certifications = () => {
  const certs = [
    {
      title: "Python Certification",
      provider: "GUVI",
      date: "2023",
      skills: "Python, Programming",
      image: "https://thfvnext.bing.com/th/id/OIP.1GKFHuKveAL74MsIYRLktwHaDN?w=327&h=151&c=7&r=0&o=7&cb=thfvnext&dpr=1.4&pid=1.7&rm=3",
      link: "/certificates/GuviCertification - Python.png"
    },
    {
      title: "Network | Network Security Intern",
      provider: "Prompt Infotech",
      date: "2024",
      skills: "Network Security, Computer Networking",
      image: "https://cdn-icons-png.flaticon.com/512/603/603148.png", // Generic logo
      link: "/certificates/Prompt infotech intern.pdf"
    },
    {
      title: "Java Certification",
      provider: "Coursera",
      date: "2024",
      skills: "Java, Object-Oriented Programming",
      image: "https://cdn-icons-png.flaticon.com/512/226/226777.png", // Java logo
      link: "/certificates/Coursera_java.pdf"
    },
    {
      title: "Data Analytics",
      provider: "Certification",
      date: "2025",
      skills: "Data Analysis, Insights",
      image: "https://cdn-icons-png.flaticon.com/512/1541/1541433.png", // Generic analytics logo
      link: "/certificates/Data_analytics.pdf"
    },
    {
      title: "SkillsBuild Completion",
      provider: "IBM SkillsBuild",
      date: "2025",
      skills: "Technology, Professional Skills",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      link: "/certificates/Completion Certificate _ SkillsBuild.pdf"
    },
    {
      title: "Business Analytics",
      provider: "Certification",
      date: "2025",
      skills: "Business Intelligence, Analytics",
      image: "https://cdn-icons-png.flaticon.com/512/2822/2822552.png", // Generic BA logo
      link: "/certificates/BA.pdf"
    },
    {
      title: "Full Stack Development",
      provider: "Crescent InfoTech",
      date: "2026",
      skills: "Frontend, Backend, Web Development",
      image: "https://cdn-icons-png.flaticon.com/512/1336/1336494.png", // Web Dev logo
      link: "/certificates/Full StacK Developement.jpg"
    },
    {
      title: "IoT Cloud Engineer Virtual Internship",
      provider: "Certification",
      date: "2026",
      skills: "Cloud Computing, Internet of Things (IoT)",
      image: "https://cdn-icons-png.flaticon.com/512/4341/4341025.png", // IoT Cloud logo
      link: "/certificates/IoT Cloud Engineer Virtual Internship.pdf"
    },
   
    {
      title: "Introduction to Artificial Intelligence (AI)",
      provider: "Coursera",
      date: "2026",
      skills: "Artificial Intelligence, Machine Learning Concepts",
      image: "https://cdn-icons-png.flaticon.com/512/2103/2103141.png", // AI logo
      link: "/certificates/Introduction to Artificial Intelligence (AI).pdf"
    },
    {
      title: "AWS Cloud Computing",
      provider: "Amazon Web Services (AWS)",
      date: "2026",
      skills: "Cloud Architecture, AWS Services, Storage",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      link: "/certificates/AWS Cloud Computing.pdf"
    },

  ];

  return (
    <section id="certifications" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Licenses & <span className="text-primary">Certifications</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-6 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500"></div>
              
              <div className="h-12 flex items-center justify-start mb-6 bg-white/10 rounded p-2 self-start">
                <img src={cert.image} alt={cert.provider} className="h-full object-contain filter drop-shadow-md" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{cert.title}</h3>
              <p className="text-accent font-medium text-sm mb-4">{cert.provider} • {cert.date}</p>
              
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs text-text-light/60 mb-4 font-medium">Skills: <span className="text-text-light/90">{cert.skills}</span></p>
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 text-sm font-medium bg-secondary/50 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors border border-primary/20 w-full justify-center"
                >
                  View Certificate <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
