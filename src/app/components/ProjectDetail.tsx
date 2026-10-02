import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import { ProjectCover } from './ProjectCover';
import { Github } from 'lucide-react';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Project not found</h1>
          <Link to="/work" className="text-neutral-500 hover:text-white underline">All Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-32 px-6">
      <div className="container mx-auto">
        <Link to="/work" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> All Projects
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
             <h1 className="text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9]">
               {project.title}
             </h1>
             <span className="font-mono text-sm text-neutral-400 mb-2">{project.category} — {project.year}</span>
          </div>

          <div className="aspect-[16/9] w-full bg-neutral-900 overflow-hidden rounded-sm">
             <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} className="relative w-full h-full"><ProjectCover project={project} /></motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-24 mb-32">
           <div className="space-y-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Context</span>
                <p className="text-xl font-light">{project.client}</p>
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 block mb-2">Role</span>
                <p className="text-xl font-light">{project.role}</p>
              </div>
           </div>

           <div>
              <p className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-300">
                {project.description}
              </p>
              
              <div className="mt-16 pt-16 border-t border-white/10">
                 <p className="text-lg text-neutral-400 leading-relaxed mb-10">{project.details}</p>
                 <div className="flex flex-wrap gap-2 mb-12">
                   {project.stack.map((s) => (
                     <span key={s} className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-neutral-300">{s}</span>
                   ))}
                 </div>
                 <div className="flex flex-wrap gap-4">
                   <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
                     <Github className="w-4 h-4" /> View on GitHub
                   </a>
                   {project.live && (Array.isArray(project.live) ? project.live : [project.live]).map((link, i) => (
                     <a key={link} href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors">
                       Live demo {Array.isArray(project.live) ? i + 1 : ""} <ArrowUpRight className="w-4 h-4" />
                     </a>
                   ))}
                 </div>
              </div>
           </div>
        </div>
        
        {/* Next Project (Simple Link) */}
        <div className="border-t border-white/10 py-24 text-center">
           <Link to="/work" className="group inline-flex flex-col items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Explore</span>
              <span className="text-6xl md:text-8xl font-medium tracking-tighter group-hover:text-neutral-400 transition-colors">
                All Projects
              </span>
           </Link>
        </div>
      </div>
    </div>
  );
};
