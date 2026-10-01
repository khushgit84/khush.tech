import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, Project } from '../data/projects';
import { ProjectCover } from './ProjectCover';

export const Projects = () => {
  // Use first 4 projects for home
  const featuredProjects = projects.slice(0, 6);

  return (
    <section id="work" className="py-32 px-6 bg-neutral-950">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="font-serif italic text-lg text-white">01</span>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Selected Projects</span>
              </div>
              <div className="h-px w-32 bg-gradient-to-r from-white/30 to-transparent" />
            </div>
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
              Things I've <br />
              <span className="italic font-serif text-neutral-500">Built</span>
            </h2>
          </div>
          <div className="hidden md:block mb-2">
             <Link to="/work" className="text-xs font-mono uppercase tracking-widest border-b border-white/30 pb-2 hover:text-neutral-300 transition-colors inline-block">
               View All Projects
             </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-y-32">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group cursor-pointer ${!isEven ? 'md:mt-32' : ''}`}
    >
      <Link to={`/work/${project.slug}`}>
        <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-8 bg-neutral-900">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }} className="absolute inset-0"><ProjectCover project={project} /></motion.div>
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-[0.16,1,0.3,1]">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-end border-t border-white/10 pt-6">
          <div>
            <h3 className="text-3xl font-medium tracking-tight mb-2 group-hover:text-neutral-400 transition-colors">{project.title}</h3>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">{project.category}</p>
          </div>
          <span className="font-mono text-xs text-neutral-600">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
};
