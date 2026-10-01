import { ReactiveGlowGrid } from "@/components/ui/reactive-glow-grid";

export default function ReactiveGlowGridDemo() {
  return (
    <ReactiveGlowGrid className="h-screen w-full">
      <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide text-white/70 backdrop-blur">
          Move your cursor
        </span>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Light between the lines
        </h1>
        <p className="max-w-md text-base text-white/60">
          A neon grid that lights up wherever your cursor goes.
        </p>
      </div>
    </ReactiveGlowGrid>
  );
}
