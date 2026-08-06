import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGithub, 
  FaPaperPlane, 
  FaCopy, 
  FaCheck, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaRegSmile,
  FaSpinner
} from 'react-icons/fa';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Validation logic
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNameValid = (name) => name.trim().length >= 2;
  const isMessageValid = (msg) => msg.trim().length >= 10;

  const errors = {
    name: touched.name && !isNameValid(formData.name) ? 'Please enter your name (at least 2 characters).' : '',
    email: touched.email && !isEmailValid(formData.email) ? 'Please enter a valid email address.' : '',
    message: touched.message && !isMessageValid(formData.message) ? 'Message must be at least 10 characters long.' : ''
  };

  const isFormValid = isNameValid(formData.name) && isEmailValid(formData.email) && isMessageValid(formData.message);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('gowthamrajb.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });

    if (!isFormValid) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      alert("Opening your email client to send your message directly...");
      window.location.href = `mailto:gowthamrajb.dev@gmail.com?subject=${encodeURIComponent(`Portfolio Contact from ${formData.name}`)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`)}`;
      setStatus('idle');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: formData.name,
          subject: `Portfolio Message from ${formData.name}`
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTouched({ name: false, email: false, message: false });
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage(error.message || 'Unable to send message. Please try again or copy my email directly.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-secondary/10 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-text-light/70 max-w-2xl mx-auto">
            Open to internships, freelance work, and collaborations. Send a message below or reach out directly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="glass-card p-8 h-full flex flex-col justify-between border border-white/10 rounded-2xl shadow-xl">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaRegSmile className="text-primary" /> Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-text-light/60">Direct Email</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <a 
                          href="mailto:gowthamrajb.dev@gmail.com" 
                          className="text-base font-semibold hover:text-primary transition-colors break-all"
                        >
                          gowthamrajb.dev@gmail.com
                        </a>
                        <button
                          onClick={copyToClipboard}
                          className="text-text-light/60 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-white/10"
                          title="Copy Email"
                          aria-label="Copy Email address"
                        >
                          {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                        </button>
                      </div>
                      {copied && <span className="text-xs text-green-400 mt-1 block">Copied to clipboard!</span>}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-text-light/60">Location</h4>
                      <p className="text-base font-semibold text-white mt-1">
                        Karur, Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-text-light/60 mb-4">Social Profiles</h4>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/ggowtham0105" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-md"
                    aria-label="GitHub Profile"
                  >
                    <FaGithub className="text-lg" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/bgowthamraj08" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-white hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1 shadow-md"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <div className="glass-card p-8 border border-white/10 rounded-2xl shadow-xl relative">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 px-4"
                  >
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Delivered!</h3>
                    <p className="text-text-light/80 max-w-md mx-auto mb-8">
                      Thank you for reaching out. Your message has been sent successfully, and I will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/30"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form key="contact-form" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Name Input */}
                      <div>
                        <label htmlFor="name" className="block text-xs uppercase tracking-wider font-semibold text-text-light/80 mb-2">
                          Your Name <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full bg-secondary/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${
                              touched.name
                                ? isNameValid(formData.name)
                                  ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50'
                                  : 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                                : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
                            }`}
                            placeholder="John Doe"
                          />
                          {touched.name && (
                            <div className="absolute right-3 top-3.5 text-sm">
                              {isNameValid(formData.name) ? (
                                <FaCheck className="text-green-400" />
                              ) : (
                                <FaExclamationCircle className="text-red-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                            <FaExclamationCircle /> {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Input */}
                      <div>
                        <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-text-light/80 mb-2">
                          Your Email <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full bg-secondary/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${
                              touched.email
                                ? isEmailValid(formData.email)
                                  ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50'
                                  : 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                                : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
                            }`}
                            placeholder="john@example.com"
                          />
                          {touched.email && (
                            <div className="absolute right-3 top-3.5 text-sm">
                              {isEmailValid(formData.email) ? (
                                <FaCheck className="text-green-400" />
                              ) : (
                                <FaExclamationCircle className="text-red-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                            <FaExclamationCircle /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="message" className="block text-xs uppercase tracking-wider font-semibold text-text-light/80">
                          Message <span className="text-primary">*</span>
                        </label>
                        <span className={`text-xs ${formData.message.trim().length >= 10 ? 'text-text-light/50' : 'text-amber-400/80'}`}>
                          {formData.message.trim().length} / 10+ chars
                        </span>
                      </div>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={`w-full bg-secondary/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all resize-none ${
                            touched.message
                              ? isMessageValid(formData.message)
                                ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50'
                                : 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50'
                              : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
                          }`}
                          placeholder="Tell me about your project, timeline, or inquiry details..."
                        ></textarea>
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <FaExclamationCircle /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Error Banner */}
                    {status === 'error' && (
                      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                        <FaExclamationCircle className="text-lg flex-shrink-0" />
                        <span>{errorMessage || 'Failed to submit form. Please check your network connection.'}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full py-4 bg-gradient-to-r from-primary via-blue-500 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-300 transform ${
                        status !== 'loading' ? 'hover:-translate-y-0.5 active:translate-y-0' : 'opacity-70 cursor-not-allowed'
                      }`}
                    >
                      {status === 'loading' ? (
                        <>
                          <FaSpinner className="animate-spin text-lg" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message <FaPaperPlane className="text-sm transform group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
