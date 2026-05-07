import { motion } from 'framer-motion';
import { 
  FaPython, FaLinux, FaAws, FaGitAlt, FaGithub, FaChartBar
} from 'react-icons/fa';
import { SiMysql, SiApacheairflow, SiDatabricks, SiApachespark } from 'react-icons/si';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming & OS",
      skills: [
        { name: "Python", icon: <FaPython className="text-[#3776AB]" /> },
        { name: "SQL", icon: <SiMysql className="text-[#4479A1]" /> },
        { name: "Linux", icon: <FaLinux className="text-white" /> },
      ]
    },
    {
      title: "Data Engineering",
      skills: [
        { name: "ETL/ELT Pipelines", icon: <span className="text-2xl">🔄</span> },
        { name: "PySpark", icon: <SiApachespark className="text-[#E25A1C]" /> },
        { name: "Apache Airflow", icon: <SiApacheairflow className="text-[#017CEE]" /> },
        { name: "Databricks", icon: <SiDatabricks className="text-[#FF3621]" /> },
      ]
    },
    {
      title: "Cloud & AWS",
      skills: [
        { name: "AWS S3", icon: <FaAws className="text-[#FF9900]" /> },
        { name: "AWS Glue", icon: <FaAws className="text-[#FF9900]" /> },
        { name: "AWS Lambda", icon: <FaAws className="text-[#FF9900]" /> },
        { name: "AWS Athena", icon: <FaAws className="text-[#FF9900]" /> },
        { name: "AWS Redshift", icon: <FaAws className="text-[#FF9900]" /> },
      ]
    },
    {
      title: "Tools",
      skills: [
        { name: "Power BI", icon: <FaChartBar className="text-[#F2C811]" /> },
        { name: "Git", icon: <FaGitAlt className="text-[#F05032]" /> },
        { name: "GitHub", icon: <FaGithub className="text-white" /> },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="skills" className="py-20 relative bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & <span className="text-primary">Technologies</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="glass-card p-8"
            >
              <h3 className="text-xl font-bold text-accent mb-6">{category.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {category.skills.map((skill, sIdx) => (
                  <motion.div 
                    key={sIdx}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="flex flex-col items-center justify-center p-4 bg-bg-dark/50 rounded-xl border border-white/5 hover:border-primary/50 transition-all group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <span className="text-sm text-center font-medium text-text-light/80 group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
