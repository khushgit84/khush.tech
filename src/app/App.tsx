import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from './components/Hero';
import { Vexlora } from './components/Vexlora';
import { About } from './components/About';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Work } from './components/Work';
import { ProjectDetail } from './components/ProjectDetail';
import { Certifications } from './components/Certifications';

const labelFor = (path: string) => {
  if (path.startsWith('/work/')) return 'PROJECT';
  if (path.startsWith('/work')) return 'PROJECTS';
  if (path.startsWith('/vexlora')) return 'VEXLORA';
  if (path.startsWith('/certifications')) return 'CERTIFICATIONS';
  return 'KHUSH.PATEL';
};

// Preloader Component
const Preloader: React.FC<{ label: string }> = ({ label }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[999] bg-white flex items-center justify-center text-black"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4"
    >
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
        {label}
      </h1>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
        className="h-px bg-black/20 w-32"
      />
    </motion.div>
  </motion.div>
);

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Services />
    <Footer />
  </>
);

const VexloraPage = () => (
  <>
    <Vexlora />
    <Footer />
  </>
);

const Shell = () => {
  const { pathname, hash } = useLocation();
  const [loading, setLoading] = useState(true);
  const [shownPath, setShownPath] = useState(pathname);
  const [label, setLabel] = useState(labelFor(pathname));
  const [first, setFirst] = useState(true);

  // Play the intro on first entry and whenever the page (not just the hash) changes
  useEffect(() => {
    if (!first && pathname === shownPath) return;
    setLabel(labelFor(pathname));
    setLoading(true);
    const timer = setTimeout(() => {
      setShownPath(pathname);
      setLoading(false);
      setFirst(false);
    }, first ? 2000 : 1400);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Scroll once the page content is mounted
  useEffect(() => {
    if (loading) return;
    if (hash) {
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [loading, pathname, hash]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key={label + pathname} label={label} />}
      </AnimatePresence>

      {!loading && (
        <div className="relative bg-neutral-950 min-h-screen text-white selection:bg-white/20">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vexlora" element={<VexloraPage />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
          </Routes>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}

export default App;
