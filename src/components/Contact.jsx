import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaPaperPlane, FaCopy, FaCheck, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { supabase } from '../supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('gowthamrajb.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Make sure we have the required keys
    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert("Please connect your Supabase database first! Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.");
      setStatus('idle');
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In <span className="text-primary">Touch</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-text-light/70 max-w-2xl mx-auto">
            Open to internships, freelance work, and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="glass-card p-8 h-full">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-light/60">Email</h4>
                    <div className="flex items-center gap-3">
                      <a href="mailto:gowthamrajb.dev@gmail.com" className="text-lg font-medium hover:text-primary transition-colors">
                        gowthamrajb.dev@gmail.com
                      </a>
                      <button 
                        onClick={copyToClipboard}
                        className="text-text-light/60 hover:text-primary transition-colors p-1"
                        title="Copy Email"
                      >
                        {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-light/60">Location</h4>
                    <p className="text-lg font-medium">
                      Karur ,Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-sm font-medium text-text-light/60 mb-4">Social Profiles</h4>
                <div className="flex gap-4">
                  <a href="https://github.com/ggowtham0105" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                    <FaGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/bgowthamraj08" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-light/80 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-light/80 mb-2">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder=""
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-text-light/80 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                  placeholder="How can I help you?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className={`w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 transform ${status !== 'loading' && 'hover:-translate-y-1'} ${status === 'loading' && 'opacity-70 cursor-not-allowed'} mb-4`}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'} <FaPaperPlane />
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-lg flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-xl flex-shrink-0" />
                    <p className="font-medium">Message sent successfully! I'll get back to you soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
