import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Server, LayoutDashboard, Palette, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import vexBg from '../../imports/image-3.png';
import khushImg from '../../imports/file_000000002828820787b71cc171ce0618-1.jpg';
import joshiImg from '../../imports/IMG-20261001-WA0210.jpg';
import kushiImg from '../../imports/IMG-20260822-WA0007.jpg';

const team = [
  {
    name: 'Khush Patel',
    role: 'Founder · Product & Backend',
    photo: khushImg,
    pos: 'object-top',
    icon: Server,
    focus: ['Product direction', 'Backend', 'Databases', 'AI/RAG', 'APIs', 'Architecture'],
    bio: 'Leads product direction and the core technical architecture, connecting the AI, backend, database and application layers into working systems.',
    accent: 'from-violet-500 to-fuchsia-400',
  },
  {
    name: 'Joshi Namburu',
    role: 'Web Development',
    photo: joshiImg,
    pos: 'object-[50%_8%]',
    icon: LayoutDashboard,
    focus: ['Frontend', 'Web apps', 'Dashboards', 'UX'],
    bio: 'Builds the web side of our projects, turning backend systems into interfaces people can actually use.',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'Kushi Saini',
    role: 'UI/UX & Creative',
    photo: kushiImg,
    pos: 'object-[50%_35%]',
    icon: Palette,
    focus: ['UI/UX', 'Visual design', 'Animation', 'Creative direction'],
    bio: 'Shapes the visual and creative side of Vexlora, making technical ideas engaging and easy to understand.',
    accent: 'from-pink-400 to-orange-300',
  },
];

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export const Vexlora = () => (
  <section id="vexlora" className="relative py-32 px-6 bg-neutral-950 overflow-hidden">
    <div aria-hidden className="absolute inset-x-0 top-0 h-[900px] pointer-events-none">
      <img src={vexBg} alt="" className="w-full h-full object-cover object-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/50 to-neutral-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/40" />
    </div>
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_15%_20%,rgba(139,92,246,0.14),transparent_70%),radial-gradient(ellipse_40%_35%_at_85%_80%,rgba(34,211,238,0.10),transparent_70%)]" />

    <div className="container mx-auto relative z-10">
      {/* Founder intro */}
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 mb-28">
        <motion.div {...fade} transition={{ duration: 0.8 }}>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-violet-300 block mb-6">The Venture</span>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] mb-8">
            Founder of{' '}
            <span className="italic font-serif bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Vexlora</span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Founder & Product Lead. At Vexlora I turn ambitious ideas into working products, across product strategy, backend, databases, AI/RAG systems, API architecture and technical direction, while coordinating the team.
          </p>
        </motion.div>

        <motion.div {...fade} transition={{ duration: 0.8, delay: 0.15 }} className="space-y-6 text-neutral-300 text-lg leading-relaxed lg:pt-16">
          <p>
            I'm passionate about practical technology that combines AI, software engineering, automation and modern user experience. I'd rather turn ideas into real products than only learn the theory.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
              <span className="font-medium text-white">SafePulse</span>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">In development</span>
            </div>
            <p className="text-neutral-400 text-base">
              An AI-assisted campus safety and incident-response platform for Indian colleges, hostels and events. Technology that is innovative, practical and built around real problems.
            </p>
            <Link to="/work/safepulse-bharat" className="inline-flex items-center gap-1 mt-4 text-sm text-cyan-300 hover:text-white transition-colors">
              View project <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Vision */}
      <motion.div {...fade} transition={{ duration: 0.8 }} className="relative mb-28 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 p-10 md:p-16">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 block mb-6">My vision</span>
        <p className="text-2xl md:text-4xl font-light leading-snug tracking-tight text-white max-w-4xl">
          Grow Vexlora into a venture where students and young developers build ambitious ideas, instead of waiting for the "perfect" opportunity.
        </p>
        <p className="mt-8 text-neutral-400 max-w-2xl">
          Being a founder isn't just having an idea. It's building, experimenting, failing, learning and bringing people together to make it real.
        </p>
        <p className="mt-10 font-mono text-sm uppercase tracking-[0.3em] bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
          Build. Experiment. Learn. Repeat.
        </p>
      </motion.div>

      {/* Team */}
      <motion.div {...fade} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h3 className="text-4xl md:text-5xl font-medium tracking-tighter">The Vexlora team</h3>
        <p className="text-neutral-400 max-w-md">Each member brings a different strength, from architecture to interfaces to creative direction.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-28">
        {team.map((m, i) => (
          <motion.div
            key={m.name}
            {...fade}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl border border-white/10 bg-neutral-900/60 p-8 pt-0 overflow-hidden"
          >
            <div className="relative -mx-8 mb-6 h-72 overflow-hidden">
              <img src={m.photo} alt={m.name} className={`w-full h-full object-cover ${m.pos} transition-transform duration-700 group-hover:scale-105`} />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent" />
              <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r ${m.accent}`} />
            </div>
            <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${m.accent} opacity-10 blur-3xl group-hover:opacity-25 transition-opacity duration-500`} />
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${m.accent}`} />
              <div>
                <p className="text-lg font-medium text-white">{m.name}</p>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">{m.role}</p>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed mb-6">{m.bio}</p>
            <div className="flex flex-wrap gap-2">
              {m.focus.map((f) => (
                <span key={f} className="px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-300">
                  {f}
                </span>
              ))}
            </div>
            <m.icon className="absolute bottom-6 right-6 w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Closing */}
      <motion.div {...fade} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
        <p className="text-neutral-400 mb-6">
          Together we're exploring AI-powered products, intelligent applications, developer-focused solutions and technology experiments.
        </p>
        <blockquote className="text-3xl md:text-5xl font-medium tracking-tighter leading-tight mb-6">
          Build technology that starts as an idea and becomes something <span className="italic font-serif text-violet-300">real.</span>
        </blockquote>
        <p className="text-neutral-500">
          We're not trying to simply call ourselves a startup. <span className="text-white">We're trying to build one.</span>
        </p>
      </motion.div>
    </div>
  </section>
);
