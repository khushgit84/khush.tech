import React from 'react';
import { motion } from 'motion/react';
import { Award, ExternalLink } from 'lucide-react';
import { Footer } from './Footer';

const certificates = [
  {
    title: "Databricks Fundamentals",
    issuer: "Databricks Academy",
    date: "Sept 6, 2026",
    image: "/certificates/databricks-fundamentals.png"
  },
  {
    title: "Generative AI Fundamentals",
    issuer: "Databricks Academy",
    date: "Mar 12, 2026",
    image: "/certificates/databricks-genai.png"
  },
  {
    title: "AI Agent Fundamentals",
    issuer: "Databricks Academy",
    date: "Sept 6, 2026",
    image: "/certificates/databricks-ai-agent.png"
  },
  {
    title: "What Is Generative AI?",
    issuer: "LinkedIn Learning",
    date: "Aug 09, 2025",
    image: "/certificates/linkedin-genai.png"
  },
  {
    title: "Claude Code in Action",
    issuer: "Anthropic",
    date: "Mar 12, 2026",
    image: "/certificates/claude-code-in-action.png",
    description: "Certified in Anthropic's Claude Code — building, debugging, and shipping with AI-native development workflows."
  },
  {
    title: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    date: "2026",
    image: "/certificates/ai-fluency-framework.png"
  },
  {
    title: "AI Fluency for Creative Work",
    issuer: "Claude Academy",
    date: "Aug 29, 2026",
    image: "/certificates/ai-fluency-creative.png"
  },
  {
    title: "AI Capabilities and Limitations",
    issuer: "Claude Academy",
    date: "Aug 29, 2026",
    image: "/certificates/ai-capabilities.png"
  },
  {
    title: "Azure Fundamentals",
    issuer: "Microsoft & Simplilearn",
    date: "Apr 25, 2026",
    image: "/certificates/azure-fundamentals.png"
  },
  {
    title: "ML with Python Internship",
    issuer: "Internship Certification",
    date: "2024"
  }
];

export const Certifications = () => {
  return (
    <>
      <div className="pt-32 pb-20 min-h-[80vh]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">
              Certifications
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl font-light leading-relaxed">
              Verified credentials across AI, cloud, and machine learning. Continuous learning to stay at the frontier of modern tech.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  {cert.image && (
                    <div className="mb-6 overflow-hidden rounded-lg border border-white/10">
                      <img src={cert.image} alt={cert.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-8 h-8 text-neutral-400" />
                    <span className="text-xs font-mono text-neutral-500 border border-white/10 px-3 py-1 rounded-full">{cert.date}</span>
                  </div>
                  <h3 className="text-xl font-light mb-2 group-hover:text-white transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">
                    {cert.issuer}
                  </p>
                  {cert.description && (
                    <p className="text-sm text-neutral-400 font-light leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
