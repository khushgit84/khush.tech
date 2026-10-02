import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BotFace } from './BotFace';

const roles = ['AI/ML', 'Prompt Engineering', 'RAG', 'LLMs', 'Backend', 'Web', 'Hackathons'];

export const Hero = () => {
  // One robot instance only: inline under the name on phones/tablets, right column on desktop
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-28 pb-16 bg-neutral-950">
      {/* Static atmosphere: no blur animation, no scroll listeners */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(124,58,237,0.18),transparent_70%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(34,211,238,0.10),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto relative z-10 grid lg:grid-cols-[1fr_1.15fr] gap-8 items-center [&>*]:min-w-0">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-10 max-w-full rounded-full border border-white/10 bg-white/5 text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-widest uppercase text-neutral-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Founder · Vexlora — open to internships
          </motion.div>

          <h1 className="text-7xl md:text-[9rem] font-medium tracking-tighter leading-[0.85] mb-10">
            {['Khush', 'Patel'].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={`block ${i === 1 ? 'italic font-serif bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent' : ''}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {!isDesktop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[460px] sm:h-[580px] my-4"
            >
              <BotFace className="absolute inset-0" />
              <div className="absolute bottom-3 right-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Tap anywhere ↗</div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl font-light text-neutral-400 max-w-xl leading-relaxed mb-8"
          >
            Founder of Vexlora. Software & AI/ML engineer and prompt engineer. B.Tech student at Pallavi Engineering College, Hyderabad, building RAG systems, AI agents and full-stack products, and always learning how the latest AI models work.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } } }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {roles.map((r) => (
              <motion.span
                key={r}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                className="px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300"
              >
                {r}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/work" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors">
              View Projects <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </Link>
            {[
              { icon: Github, href: 'https://github.com/khushgit84', label: 'GitHub' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/khush-patel-52b249296', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:vexloraindia@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/40 hover:-translate-y-0.5 transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </div>

        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[min(680px,72vh)] mt-16"
          >
            <BotFace className="absolute inset-0" />
            <div className="absolute bottom-6 right-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Move your cursor ↗
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
