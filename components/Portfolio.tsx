import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Terminal,
  Zap,
  Database,
  ArrowRight,
  Code,
  TrendingUp,
  Clock,
  ExternalLink,
  Github,
  LucideIcon,
  CheckCircle
} from 'lucide-react';

/**
 * --- TYPES ---
 */

interface Metric {
  value: string;
  label: string;
}

interface CaseStudyProps {
  title: string;
  category: string;
  metrics: Metric[];
  description: string;
  stack: string[];
  impact: string;
  side: 'left' | 'right';
  githubLink?: boolean;
  media?: React.ReactNode;
  demoUrl?: string;
}

interface OfferCardProps {
  role: string;
  salary: string;
  location: string;
  blurred?: boolean;
}

interface MetricBadgeProps {
  icon: LucideIcon;
  text: string;
}

interface ConstellationProps {
  mouse: React.MutableRefObject<number[]>;
}

/**
 * --- UTILS & CONSTANTS ---
 */
const COLORS = {
  primary: '#00ff41', // Matrix/Cyberpunk Green
  bg: '#000000',
  text: '#ffffff',
  accent: '#3b82f6'
};

// Random generator for particles
const generateParticles = (count = 2000) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorObj = new THREE.Color(COLORS.primary);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;     // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z

    // Slight color variation
    colors[i * 3] = colorObj.r;
    colors[i * 3 + 1] = colorObj.g + (Math.random() * 0.2);
    colors[i * 3 + 2] = colorObj.b + (Math.random() * 0.5);
  }
  return { positions, colors };
};

/**
 * --- 3D COMPONENTS (R3F) ---
 */

function Constellation({ mouse }: ConstellationProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const points = useRef<any>();
  const { positions, colors } = useMemo(() => generateParticles(1200), []);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();
    // Gentle rotation
    points.current.rotation.x = time * 0.05;
    points.current.rotation.y = time * 0.03;

    // Mouse interaction parallax
    const targetX = (mouse.current[0] * 0.5);
    const targetY = (mouse.current[1] * 0.5);

    points.current.rotation.x += (targetY - points.current.rotation.x) * 0.05;
    points.current.rotation.y += (targetX - points.current.rotation.y) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HeroScene({ mouse }: { mouse: React.MutableRefObject<number[]> }) {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <fog attach="fog" args={['black', 2, 7]} />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Constellation mouse={mouse} />
          </Float>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}


/**
 * --- UI COMPONENTS ---
 */

const MetricBadge: React.FC<MetricBadgeProps> = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-gray-300 hover:bg-white/10 transition-colors cursor-default">
    <Icon size={14} className="text-green-400" />
    <span>{text}</span>
  </div>
);

const CaseStudy: React.FC<CaseStudyProps> = ({ title, category, metrics, description, stack, impact, side, githubLink, media, demoUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full py-20 border-b border-white/10 last:border-0"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className={`space-y-6 ${side === 'right' ? 'md:order-2' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-sm">
              {category}
            </span>
            <span className="text-green-400 text-xs font-mono flex items-center gap-1">
              <TrendingUp size={12} />
              {impact}
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
            {title}
          </h3>

          <p className="text-gray-400 text-lg leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-4 my-6">
            {metrics.map((m, i) => (
              <div key={i} className="border-l-2 border-green-500/50 pl-4">
                <div className="text-2xl font-bold text-white">{m.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {stack.map(tech => (
              <span key={tech} className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors text-sm md:text-base">
              Ver producción
              <ExternalLink size={16} />
            </button>
            {githubLink && (
              <button className="flex items-center gap-2 px-6 py-3 font-bold text-white border border-white/20 hover:bg-white/10 transition-colors group text-sm md:text-base">
                PR Review
                <Github size={16} className="group-hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Simulated Interactive Playground/Preview */}
        <div className={`relative aspect-video bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden group ${side === 'right' ? 'md:order-1' : ''}`}>
          {media ? (
            media
          ) : (
            <>
              <div className="absolute top-0 left-0 w-full h-8 bg-[#1a1a1a] flex items-center px-3 gap-2 border-b border-white/5 z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 text-[10px] text-gray-500 font-mono truncate max-w-[200px]">
                  {demoUrl ? new URL(demoUrl).hostname : 'preview.vercel.app'}
                </div>
              </div>

              {demoUrl ? (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 pt-8 bg-[#0a0a0a] group hover:brightness-110 transition-all cursor-pointer"
                >
                  {/* Screenshot Preview */}
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                    alt={`Preview of ${title}`}
                    className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 pt-8 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <span>Ver Demo</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </a>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pt-8 text-gray-700 font-mono text-sm">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white mb-1">View Live Demo</p>
                    <p className="text-xs text-gray-500 font-mono">{new URL(demoUrl).hostname}</p>
                  </div>
                </div>
              )}

              {/* Overlay visual for "Before/After" - Only show if not interactive or on hover */}
              {!demoUrl && (
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-4 py-2 border border-green-500/30 rounded text-xs font-mono text-green-400 pointer-events-none">
                  Lighthouse: 100
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OfferCard: React.FC<OfferCardProps> = ({ role, salary, location, blurred = true }) => {
  return (
    <div className="group relative p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all overflow-hidden">
      <div className={`transition-all duration-500 ${blurred ? 'blur-sm group-hover:blur-none opacity-50 group-hover:opacity-100' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-bold text-white">{role}</span>
          <span className="text-xs text-gray-500">{location}</span>
        </div>
        <div className="text-green-400 font-mono font-bold">{salary}</div>
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-mono">Hover to reveal</span>
        </div>
      )}
    </div>
  );
};

const BlurReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + (i * 0.15),
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default function Portfolio() {
  const mouse = useRef<number[]>([0, 0]);

  // Console Easter Egg
  useEffect(() => {
    console.clear();
    const styleTitle = "font-size: 20px; font-weight: bold; color: #00ff41; background: #000; padding: 10px;";
    const styleBody = "font-size: 14px; color: #ccc; background: #111; padding: 5px;";
    console.log("%c⚡ READY TO DEPLOY ⚡", styleTitle);
    console.log("%cHello CTO / EM.\n\nThis portfolio is built with React 19 and optimized for performance.\nLooking for someone who understands both business and code? Let's talk.", styleBody);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    ];
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black text-white selection:bg-green-500/30 selection:text-green-200 font-sans overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* Fixed Navigation / Status Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter font-mono">
          FREIXANET<span className="text-green-500">.DEV</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-gray-400">
          <span>BCN • REMOTE</span>
          <span className="flex items-center gap-1 text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AVAILABLE FOR HIRE
          </span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center items-start px-4 md:px-20">
        <HeroScene mouse={mouse} />

        <div className="z-10 text-left space-y-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-green-400 font-mono text-sm md:text-base mb-4 tracking-widest uppercase">
              Available for Remote Work
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] md:leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              <BlurReveal text="Frontend Developer" className="block text-white" />
              <span className="text-white block mt-2 text-3xl md:text-5xl lg:text-6xl">
                <BlurReveal text="React, TS & Next.js" delay={0.5} className="text-gray-400" />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light"
          >
            Building <span className="text-white font-medium">pixel-perfect</span>, accessible, and conversion-focused interfaces.
            Clean, maintainable, and scalable code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3 pointer-events-auto"
          >
            <MetricBadge icon={Zap} text="Performance Obsessed" />
            <MetricBadge icon={CheckCircle} text="Best Practices" />
            <MetricBadge icon={Database} text="Business Oriented" />
          </motion.div>
        </div>

        {/* Micro CTA */}
        <motion.a
          href="#work"
          className="fixed bottom-8 right-8 z-40 hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded pointer-events-auto"
          whileHover={{ scale: 1.05 }}
        >
          <Code size={12} />
          <span>View Case Studies</span>
          <ArrowRight size={12} />
        </motion.a>
      </section>

      {/* CASE STUDIES SECTION */}
      <section id="work" className="relative w-full bg-black z-20 py-24">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Technical Experience (Case Studies)</h2>
          <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="space-y-20">
          <CaseStudy
            title="Admin Dashboard"
            category="SaaS B2B"
            impact="Load time from 5s to 0.4s"
            description="Client needed to manage +10k products with real-time updates. Implemented React Query for caching and list virtualization, achieving massive reduction in load times."
            metrics={[
              { value: "0.4s", label: "Load Time" },
              { value: "+30%", label: "Productivity" }
            ]}
            stack={["React", "TypeScript", "TanStack Query", "Tailwind"]}
            side="right"
            githubLink={true}
            demoUrl="https://lexia-asistente-legal-freixanet-freixanets-projects.vercel.app"
          />

          <CaseStudy
            title="Transactional Checkout"
            category="E-commerce"
            impact="-25% Abandonment"
            description="High abandonment rate due to confusing validations. Created a robust flow with Stripe Elements and real-time validation using Zod and Zustand for global state management."
            metrics={[
              { value: "40%", label: "Final Abandonment" },
              { value: "100%", label: "Cart Recovery" }
            ]}
            stack={["React", "Zustand", "Stripe API", "Zod"]}
            side="left"
            githubLink={true}
            demoUrl="https://lexia-asistente-legal-freixanet-freixanets-projects.vercel.app"
          />

          <CaseStudy
            title="Mortgage Calculator"
            category="Internal Tool"
            impact="0 Calculation Errors"
            description="Agents were using error-prone Excel sheets. Developed a web app with financial logic encapsulated in custom hooks and tested with Vitest to ensure absolute precision."
            metrics={[
              { value: "100%", label: "Accuracy" },
              { value: "Total", label: "Team Adoption" }
            ]}
            stack={["TypeScript", "Vitest", "Custom Hooks", "CSS Modules"]}
            side="right"
            githubLink={true}
            demoUrl="https://lexia-asistente-legal-freixanet-freixanets-projects.vercel.app"
          />
        </div>
      </section>

      {/* INVISIBLE TECHNICAL TEST */}
      <section className="py-32 border-t border-white/10 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-wider uppercase mb-8">
            <Terminal size={12} />
            Evidence of Quality
          </div>

          <h3 className="text-3xl md:text-5xl font-bold mb-12">
            Technical Validation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: "Performance", desc: "Average across all deployed projects.", badge: "Lighthouse 100" },
              { title: "Best Practices", desc: "Clean code, strict typing, and testing.", badge: "TypeScript" },
              { title: "Accessibility", desc: "Keyboard navigable and screen reader ready.", badge: "ARIA Ready" },
              { title: "SEO", desc: "Technical optimization for correct indexing.", badge: "Semantic HTML" },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors rounded-lg">
                <div className="text-green-500 text-xs font-mono mb-3 border border-green-500/20 inline-block px-2 py-0.5 rounded">
                  {item.badge}
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF & CTA */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-white text-black p-8 md:p-16 rounded-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Profitable from Week 1?
            </h2>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              I aim to provide immediate value. No long learning curves.
              Available for technical interviews and code challenges.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a href="mailto:hola@marcfreixanet.com" className="bg-black text-white px-8 py-4 font-bold text-lg rounded hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
                Send Email
                <ArrowRight size={16} />
              </a>
              <button className="px-8 py-4 font-bold text-black border-2 border-black/10 hover:bg-black/5 rounded transition-colors">
                Download CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER STACK */}
      <footer className="py-12 border-t border-white/10 bg-black text-center text-gray-600 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 mb-8">
          {["React", "TypeScript", "Next.js", "Tailwind", "Three.js", "Vite", "Vitest"].map(tech => (
            <span key={tech} className="hover:text-white cursor-default transition-colors">
              {tech}
            </span>
          ))}
        </div>
        <p>© 2025 Marc Freixanet. Built with code.</p>
      </footer>
    </div>
  );
}