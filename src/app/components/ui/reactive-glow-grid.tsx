"use client";

import * as React from "react";

export interface ReactiveGlowGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Light colors, cycled along the pointer trail. */
  colors?: string[];
  /** Base grid cell in CSS px. Cells merge and split into rectangles around it. */
  cellSize?: number;
  /** How far light reaches into each pane, as a share of the pane's short side. */
  depth?: number;
  /** Exposure of the lights. */
  intensity?: number;
  /** Seconds a trail light takes to fade to ~37%. */
  trailDecay?: number;
  /** Strength of the slow idle lights, 0 to 1. */
  ambient?: number;
  /** Changes the rectangle layout. */
  seed?: number;
  /** Caps the render resolution of the glass pass. */
  maxDpr?: number;
}

type RGB = [number, number, number];

const MAX_LIGHTS = 24;
const AMBIENT = 3;
const FIRST_AMBIENT = 1;
const FIRST_TRAIL = FIRST_AMBIENT + AMBIENT;
/** The light field is smooth, so it renders at a fraction of CSS resolution. */
const LIGHT_SCALE = 0.25;
const DEFAULT_COLORS = ["#ff1f8f", "#ff5a1f", "#ffc21f", "#1fff8a", "#1f8bff", "#7a3cff"];

const VERTEX = /* glsl */ `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Pass 1: accumulate every light into a small texture. This is the only loop over
// lights, and it runs on ~1/16 of the pixels.
const LIGHT_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;
#define MAX_LIGHTS ${MAX_LIGHTS}
uniform vec2 u_size;
uniform vec2 u_texSize;
uniform float u_cell;
uniform float u_encode;
uniform vec3 u_lights[MAX_LIGHTS];
uniform vec3 u_lightColors[MAX_LIGHTS];
out vec4 outColor;

void main() {
  vec2 q = gl_FragCoord.xy / u_texSize * u_size;
  q.y = u_size.y - q.y;
  float r2 = u_cell * u_cell * 0.55;
  vec3 c = vec3(0.0);
  for (int i = 0; i < MAX_LIGHTS; i++) {
    vec3 l = u_lights[i];
    if (l.z < 0.002) continue;
    vec2 d = q - l.xy;
    float x = dot(d, d) / r2;
    float g = exp(-x);
    // Colored body, long soft tail, and a white-hot core.
    c += l.z * (u_lightColors[i] * (g + 0.12 / (1.0 + x * 2.0)) + vec3(0.55) * g * g * g * g);
  }
  outColor = vec4(c * u_encode, 1.0);
}
`;

// Pass 2: full resolution, but only a hash lookup and five texture taps per pixel.
const GLASS_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 u_size;
uniform float u_dpr;
uniform float u_cell;
uniform float u_depth;
uniform float u_intensity;
uniform float u_decode;
uniform float u_seed;
uniform sampler2D u_light;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx + u_seed * 17.13) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Mondrian-style layout: some cells merge into 2x1 slabs, then each rect
// splits up to three times along its longer side.
void tileAt(vec2 p, out vec2 center, out vec2 halfSize, out float id) {
  vec2 cell = floor(p / u_cell);
  vec2 lo = cell * u_cell;
  vec2 hi = lo + u_cell;
  float pair = floor(cell.x * 0.5);
  if (hash(vec2(pair, cell.y) + 91.7) < 0.3) {
    lo.x = pair * 2.0 * u_cell;
    hi.x = lo.x + 2.0 * u_cell;
  }
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 size = hi - lo;
    vec2 key = lo * 0.013 + hi * 0.029 + fi * 7.1;
    if (hash(key) < 0.42 + fi * 0.22) break;
    bool splitX = size.x > size.y * 1.25 ? true : (size.y > size.x * 1.25 ? false : hash(key + 3.7) > 0.5);
    float along = splitX ? size.x : size.y;
    if (along * 0.3 < u_cell * 0.28) break;
    float m = floor(mix(0.3, 0.7, hash(key + 11.3)) * along + 0.5);
    if (splitX) {
      if (p.x < lo.x + m) hi.x = lo.x + m; else lo.x += m;
    } else {
      if (p.y < lo.y + m) hi.y = lo.y + m; else lo.y += m;
    }
  }
  center = (lo + hi) * 0.5;
  halfSize = (hi - lo) * 0.5;
  id = hash(center * 0.07 + 1.3);
}

vec3 lightAt(vec2 q) {
  vec2 uv = vec2(q.x, u_size.y - q.y) / u_size;
  return texture(u_light, uv).rgb * u_decode;
}

// Each channel reaches a little further than the last, so rims split like a prism.
vec3 falloff(float d, float reach) {
  return exp(-d / (reach * vec3(1.2, 1.0, 0.84))) * 0.8 + exp(-d / 1.8) * 0.9;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;
  vec2 c, b;
  float id;
  tileAt(p, c, b, id);
  vec2 lp = p - c;

  // Distance to each of the four edges.
  float dl = lp.x + b.x;
  float dr = b.x - lp.x;
  float dt = lp.y + b.y;
  float db = b.y - lp.y;

  // Every edge carries the light found just past it, falling off into the pane.
  // Summing all four edges keeps the glow continuous, with no seams where the
  // nearest edge changes, and corners facing a light turn hot on their own.
  float reach = clamp(min(b.x, b.y) * u_depth, 8.0, 140.0);
  float leak = 3.0;
  vec3 glow =
      lightAt(vec2(c.x - b.x - leak, p.y)) * falloff(dl, reach)
    + lightAt(vec2(c.x + b.x + leak, p.y)) * falloff(dr, reach)
    + lightAt(vec2(p.x, c.y - b.y - leak)) * falloff(dt, reach)
    + lightAt(vec2(p.x, c.y + b.y + leak)) * falloff(db, reach);

  vec3 here = lightAt(p);
  float edge = min(min(dl, dr), min(dt, db));
  float seam = exp(-edge / 0.55);

  vec3 col = glow * mix(0.8, 1.15, id) + here * 0.025 + (here * 1.2 + 0.012) * seam;
  col = 1.0 - exp(-col * u_intensity);
  // Dither to hide banding in the long dark gradients.
  col += (hash(gl_FragCoord.xy) - 0.5) / 128.0;
  outColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function samplePalette(palette: RGB[], t: number): RGB {
  const count = palette.length;
  const x = ((t % count) + count) % count;
  const i = Math.floor(x);
  const f = x - i;
  const s = f * f * (3 - 2 * f);
  const a = palette[i];
  const b = palette[(i + 1) % count];
  return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
}

function createProgram(gl: WebGL2RenderingContext, fragment: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("ReactiveGlowGrid shader error:", gl.getShaderInfoLog(shader));
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "a_pos");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ReactiveGlowGrid link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function uniforms<T extends string>(gl: WebGL2RenderingContext, program: WebGLProgram, names: readonly T[]) {
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<
    T,
    WebGLUniformLocation | null
  >;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

interface TrailPoint {
  x: number;
  y: number;
  born: number;
  color: RGB;
}

export const ReactiveGlowGrid = React.forwardRef<HTMLDivElement, ReactiveGlowGridProps>(function ReactiveGlowGrid(
  {
    colors = DEFAULT_COLORS,
    cellSize = 170,
    depth = 0.42,
    intensity = 1.3,
    trailDecay = 1,
    ambient = 0.5,
    seed = 3,
    maxDpr = 2,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef,
) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = React.useState(true);
  // Bumped when the GPU restores a lost context, which rebuilds the whole pipeline.
  const [contextGeneration, setContextGeneration] = React.useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const palette = React.useMemo(() => (colors.length ? colors : DEFAULT_COLORS).map(hexToRgb), [colors]);
  const options = useLatest({ palette, cellSize, depth, intensity, trailDecay, ambient, seed, maxDpr, reducedMotion });

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
    const lightProgram = gl && createProgram(gl, LIGHT_FRAGMENT);
    const glassProgram = gl && createProgram(gl, GLASS_FRAGMENT);
    if (!gl || !lightProgram || !glassProgram) {
      setSupported(false);
      return;
    }

    // Half-float keeps the light field HDR so hot cores don't clip before tone mapping;
    // without it, store a quarter of the value in 8 bits and scale back up.
    const halfFloat = !!gl.getExtension("EXT_color_buffer_float") || !!gl.getExtension("EXT_color_buffer_half_float");
    const encode = halfFloat ? 1 : 0.25;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const lightTexture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();

    const lu = uniforms(gl, lightProgram, ["u_size", "u_texSize", "u_cell", "u_encode", "u_lights", "u_lightColors"] as const);
    const gu = uniforms(gl, glassProgram, [
      "u_size", "u_dpr", "u_cell", "u_depth", "u_intensity", "u_decode", "u_seed", "u_light",
    ] as const);

    const lights = new Float32Array(MAX_LIGHTS * 3);
    const lightColors = new Float32Array(MAX_LIGHTS * 3);

    const size = { width: 1, height: 1, dpr: 1, texW: 1, texH: 1 };
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, hover: 0, target: 0 };
    const trail: TrailPoint[] = [];
    let lastPush = { x: -1e4, y: -1e4 };
    let hueStep = 0;
    let hue = 0;
    let visible = true;
    let frame = 0;
    let last = performance.now();
    let clock = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      size.width = Math.max(1, rect.width);
      size.height = Math.max(1, rect.height);
      size.dpr = Math.min(window.devicePixelRatio || 1, options.current.maxDpr);
      canvas.width = Math.round(size.width * size.dpr);
      canvas.height = Math.round(size.height * size.dpr);
      size.texW = Math.max(1, Math.ceil(size.width * LIGHT_SCALE));
      size.texH = Math.max(1, Math.ceil(size.height * LIGHT_SCALE));

      gl.bindTexture(gl.TEXTURE_2D, lightTexture);
      if (halfFloat) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, size.texW, size.texH, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, size.texW, size.texH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, lightTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    // The grid sits behind content, so listen on window and hit-test ourselves.
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && pointer.hover < 0.05) {
        pointer.x = x;
        pointer.y = y;
        pointer.vx = pointer.vy = 0;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.target = inside ? 1 : 0;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };

    const updateLights = (now: number, dt: number) => {
      const opts = options.current;

      // Critically damped spring so the light glides instead of jittering with the cursor.
      const stiffness = opts.reducedMotion ? 900 : 140;
      const damping = 2 * Math.sqrt(stiffness);
      pointer.vx += (stiffness * (pointer.tx - pointer.x) - damping * pointer.vx) * dt;
      pointer.vy += (stiffness * (pointer.ty - pointer.y) - damping * pointer.vy) * dt;
      pointer.x += pointer.vx * dt;
      pointer.y += pointer.vy * dt;
      pointer.hover += (pointer.target - pointer.hover) * (1 - Math.exp(-dt * 6));

      if (
        !opts.reducedMotion &&
        pointer.hover > 0.3 &&
        Math.hypot(pointer.x - lastPush.x, pointer.y - lastPush.y) > opts.cellSize * 0.3
      ) {
        hueStep += 0.45;
        trail.push({ x: pointer.x, y: pointer.y, born: now, color: samplePalette(opts.palette, hueStep) });
        if (trail.length > MAX_LIGHTS - FIRST_TRAIL) trail.shift();
        lastPush = { x: pointer.x, y: pointer.y };
      }

      // Ease the head color toward the trail so it never pops between palette stops.
      hue += (hueStep - hue) * (1 - Math.exp(-dt * 3));
      lights.set([pointer.x, pointer.y, pointer.hover * 1.6], 0);
      lightColors.set(samplePalette(opts.palette, hue + 0.45), 0);

      // Idle lights wander on slow Lissajous paths so the glass breathes without input.
      for (let i = 0; i < AMBIENT; i++) {
        const t = clock * (0.05 + i * 0.015) + i * 2.4;
        const slot = (FIRST_AMBIENT + i) * 3;
        lights[slot] = size.width * (0.5 + 0.48 * Math.sin(t * 1.3 + i));
        lights[slot + 1] = size.height * (0.5 + 0.46 * Math.cos(t * 0.9 + i * 1.7));
        lights[slot + 2] = opts.ambient * (0.7 + 0.3 * Math.sin(clock * 0.35 + i * 2.1));
        lightColors.set(samplePalette(opts.palette, i * 2 + clock * 0.04), slot);
      }

      for (let i = FIRST_TRAIL; i < MAX_LIGHTS; i++) {
        const point = trail[trail.length - 1 - (i - FIRST_TRAIL)];
        if (!point) {
          lights[i * 3 + 2] = 0;
          continue;
        }
        const age = (now - point.born) / 1000;
        // Fade in on spawn and out near the end of the buffer so lights never pop.
        const attack = 1 - Math.exp(-age / 0.14);
        const tail = Math.min(1, (MAX_LIGHTS - i) / 5);
        lights.set([point.x, point.y, 1.3 * attack * tail * Math.exp(-age / opts.trailDecay)], i * 3);
        lightColors.set(point.color, i * 3);
      }
    };

    const render = () => {
      const opts = options.current;

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, size.texW, size.texH);
      gl.useProgram(lightProgram);
      gl.uniform2f(lu.u_size, size.width, size.height);
      gl.uniform2f(lu.u_texSize, size.texW, size.texH);
      gl.uniform1f(lu.u_cell, opts.cellSize);
      gl.uniform1f(lu.u_encode, encode);
      gl.uniform3fv(lu.u_lights, lights);
      gl.uniform3fv(lu.u_lightColors, lightColors);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(glassProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, lightTexture);
      gl.uniform1i(gu.u_light, 0);
      gl.uniform2f(gu.u_size, size.width, size.height);
      gl.uniform1f(gu.u_dpr, size.dpr);
      gl.uniform1f(gu.u_cell, opts.cellSize);
      gl.uniform1f(gu.u_depth, opts.depth);
      gl.uniform1f(gu.u_intensity, opts.intensity);
      gl.uniform1f(gu.u_decode, 1 / encode);
      gl.uniform1f(gu.u_seed, opts.seed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!visible) return;
      if (!options.current.reducedMotion) clock += dt;
      updateLights(now, dt);
      render();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      render();
    });
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
    };
    const onContextRestored = () => setContextGeneration((generation) => generation + 1);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    resize();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(lightTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(lightProgram);
      gl.deleteProgram(glassProgram);
    };
  }, [options, contextGeneration]);

  return (
    <div
      ref={setRefs}
      className={["relative isolate overflow-hidden bg-black", className].filter(Boolean).join(" ")}
      style={style}
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      {!supported && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(40% 50% at 30% 40%, rgba(255,31,143,.22), transparent), radial-gradient(40% 50% at 70% 60%, rgba(31,139,255,.22), transparent)",
          }}
        />
      )}
      {children != null && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
});
