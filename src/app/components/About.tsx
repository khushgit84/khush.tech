import React, { useRef } from 'react';
import khushPhoto from "../../imports/file_000000002828820787b71cc171ce0618.jpg";
import { motion } from 'motion/react';
import { ReactiveGlowGrid } from './ui/reactive-glow-grid';
import { projects } from '../data/projects';

export const About = () => {
  const containerRef = useRef(null);
  const liveCount = projects.reduce((acc, p) => acc + (Array.isArray(p.live) ? p.live.length : (p.live ? 1 : 0)), 0);

  return (
    <section ref={containerRef} id="about" className="py-32 relative bg-neutral-950 overflow-hidden">
      <ReactiveGlowGrid aria-hidden className="!absolute inset-0" maxDpr={1.5} />
      <div className="absolute inset-0 bg-neutral-950/55 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
      {/* Background Grid - Technical Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header - Consistent Style */}
        <div className="flex items-center gap-6 mb-24">
           <div className="flex items-baseline gap-3">
              <span className="font-serif italic text-lg text-white">02</span>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">About Me</span>
           </div>
           <div className="h-px w-32 bg-gradient-to-r from-white/30 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-start">
          
          {/* Text Content */}
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-medium tracking-tighter mb-12 leading-[0.9]"
            >
              Student. <br />
              <span className="italic font-serif text-neutral-500">Builder.</span> Engineer.
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 text-lg font-light text-neutral-400 leading-relaxed">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6"
              >
                <p>
                  I'm a 2nd-year B.Tech student at Pallavi Engineering College, Hyderabad, working toward becoming a software and AI/ML engineer. I don't stop at what's taught in class.
                </p>
                <p>
                  I have a builder's mindset. When something interests me, I want to know: can I build it, can I make it better, and can it become a real product?
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-6"
              >
                <p>
                  I've built hackathon systems like SafePulse Bharat, the Vexlora brand and events platform, RAG engines and full-stack SaaS. I'm also a prompt engineer: I design the prompts and agent instructions that make LLMs dependable. I follow tech closely, keep learning new AI models as they come out, and run local LLMs on my RTX 4060 to see how AI works under the hood.
                </p>
                <p className="text-white/80">
                  Learn it. Build it. Break it. Fix it. Ship it. Improve it.
                </p>
              </motion.div>
            </div>

            {/* Stats & Trust */}
            <div className="mt-16 pt-16 border-t border-white/5">
               <div className="grid grid-cols-3 gap-8 mb-16">
                 <div className="space-y-2 border-r border-white/5">
                   <h4 className="text-4xl font-light text-white">{projects.length}<span className="text-neutral-600 text-lg">+</span></h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Repos Shipped</p>
                 </div>
                 <div className="space-y-2 border-r border-white/5">
                   <h4 className="text-4xl font-light text-white">{liveCount}<span className="text-neutral-600 text-lg">+</span></h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Live Deployments</p>
                 </div>
                 <div className="space-y-2">
                   <h4 className="text-4xl font-light text-white">2nd</h4>
                   <p className="text-xs uppercase tracking-widest text-neutral-500">Year · B.Tech</p>
                 </div>
               </div>

               {/* Client List - Trust Factor */}
               <div>
                 <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-6">Currently exploring</span>
                 <div className="flex flex-wrap gap-x-12 gap-y-4 text-neutral-400 font-light text-lg">
                   {['Prompt Engineering', 'LLMs', 'Python', 'FastAPI', 'RAG', 'Vector DBs', 'Ollama', 'React', 'TypeScript', 'Flutter', 'Supabase', 'Three.js', 'Arduino'].map((client, i) => (
                     <motion.span 
                       key={client}
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: 1 }}
                       transition={{ delay: 0.5 + (i * 0.1) }}
                       className="hover:text-white transition-colors cursor-default"
                     >
                       {client}
                     </motion.span>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Image Area */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative lg:mt-24"
          >
            <div className="relative z-10">
               <motion.div 
                 whileHover={{ scale: 0.98 }}
                 transition={{ duration: 0.5 }}
                 className="aspect-[4/5] overflow-hidden bg-neutral-900"
               >
                 <img 
                   src={khushPhoto} 
                   alt="Khush Patel" 
                   className="w-full h-full object-cover object-top" 
                 />
                 
               </motion.div>
               
               {/* Decorative Ring */}
               <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-white/10 rounded-full items-center justify-center hidden md:flex" style={{ animation: 'spin 15s linear infinite' }}>
                 <style dangerouslySetInnerHTML={{__html: `
                   @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                 `}} />
                 <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                   <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                   <text className="fill-neutral-500 text-[10px] uppercase tracking-widest font-mono">
                     <textPath href="#circlePath">
                       • AI Builder • Developer • Creator •
                     </textPath>
                   </text>
                 </svg>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
