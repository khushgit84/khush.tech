import { motion } from "motion/react";

export function AnimatedTitleFM({ open = true, title = "Glow Horizon", subtitle = "Light breaking over the edge" }: { open?: boolean; title?: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={open ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-medium tracking-tighter text-white"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={open ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.4 }}
        className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
