import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ReactiveGlowGrid } from './ui/reactive-glow-grid';
import { Brain, Server, Globe, Cpu, Smartphone, Trophy, Code2, Rocket, MessageSquareCode, Newspaper, Database, Cloud } from 'lucide-react';

const services = [
  { icon: Brain, title: "AI & Generative AI", description: "LLM apps, RAG pipelines, embeddings, vector databases, AI agents, and local models via Ollama and LM Studio." },
  { icon: MessageSquareCode, title: "Prompt Engineering", description: "Designing system prompts, few-shot examples, structured outputs and agent instructions that make LLMs reliable in real products." },
  { icon: Newspaper, title: "AI Models & Tech Insight", description: "Keeping up with new models, papers and tools, testing them hands-on, and comparing GPT, Claude, Gemini, Llama and open-source LLMs." },
  { icon: Server, title: "Backend & APIs", description: "Python, FastAPI, Node/Express, OpenAPI contracts, and database design with SQL, Supabase and MongoDB." },
  { icon: Globe, title: "Web Development", description: "React and TypeScript front ends with cinematic motion and premium, dark, futuristic UI." },
  { icon: Cpu, title: "Hardware + AI", description: "Arduino, sensors, and computer-vision prototypes that connect software to the real world." },
  { icon: Smartphone, title: "Mobile Apps", description: "Flutter apps for real users, like the student and responder clients in SafePulse Bharat." },
  { icon: Trophy, title: "Hackathons", description: "Product direction, architecture and team coordination, taking ideas to working demos fast." },
  { icon: Code2, title: "Programming", description: "Python, C, JavaScript/TypeScript, Git, and DBMS, Discrete Maths and core CS fundamentals." },
  { icon: Rocket, title: "Freelance Builds", description: "Websites and AI tools for clients and students, shipped quickly and properly." },
  { icon: Database, title: "Data & ML Workflows", description: "Data cleaning, embeddings, model fine-tuning experiments and evaluation with Python, Pandas, NumPy and Hugging Face." },
  { icon: Cloud, title: "Deployment & DevOps", description: "Shipping to Vercel and the cloud with Git, GitHub workflows, environment configs and Docker basics." },
];

export const Services = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} id="services" className="py-32 px-6 bg-neutral-950 relative overflow-hidden">
      <ReactiveGlowGrid aria-hidden className="!absolute inset-0" maxDpr={1.5} />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
       {/* Dynamic Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-32 grid md:grid-cols-2 gap-16 items-end">
          <div>
            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-baseline gap-3">
                  <span className="font-serif italic text-lg text-white">03</span>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">/ Skills</span>
               </div>
               <div className="h-px w-32 bg-gradient-to-r from-white/30 to-transparent" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-9xl font-medium tracking-tighter leading-none"
            >
              Skills & <br />
              <span className="italic font-serif text-neutral-500">Stack</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="md:pl-12 border-l border-white/10 relative"
          >
            <div className="absolute top-0 left-[-1px] h-12 w-[1px] bg-gradient-to-b from-white to-transparent" />
            <p className="text-xl md:text-2xl font-light text-neutral-300 leading-relaxed">
              I think in Problem → Product → Users → Technology → Cost → Revenue, not just technology for its own sake.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 group/list">
          {services.map((service, index) => (
            <motion.div
               key={index}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1, duration: 0.8 }}
               className={`
                 relative 
                 ${index % 2 === 1 ? 'lg:mt-32' : ''} 
                 transition-all duration-500 ease-out
                 hover:!opacity-100 group-hover/list:opacity-20
               `}
            >
               {/* Editorial Decorative Corners */}
               <div className="absolute -top-6 -left-6 w-3 h-3 border-t border-l border-white/20 transition-all duration-500 group-hover:w-[calc(100%+3rem)] group-hover:h-[calc(100%+3rem)] group-hover:border-white/10 pointer-events-none" />
               <div className="absolute -bottom-6 -right-6 w-3 h-3 border-b border-r border-white/20 transition-all duration-500 group-hover:w-[calc(100%+3rem)] group-hover:h-[calc(100%+3rem)] group-hover:border-white/10 pointer-events-none" />
               
               <ServiceCard service={service} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index }: { service: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group p-8 rounded-2xl bg-black/70 border border-white/10 hover:border-white/30 hover:bg-black/80 transition-all duration-500"
    >
      <div className="mb-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500">
        <service.icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-medium mb-4 tracking-tight">{service.title}</h3>
      <p className="text-neutral-400 font-light leading-relaxed group-hover:text-neutral-300 transition-colors">
        {service.description}
      </p>
    </motion.div>
  );
};
