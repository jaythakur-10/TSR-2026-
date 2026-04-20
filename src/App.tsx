/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Cpu, 
  ShieldCheck, 
  Rocket, 
  Globe, 
  BarChart3, 
  Upload, 
  CheckCircle2, 
  Github, 
  Linkedin, 
  Twitter, 
  Menu, 
  X,
  ScanSearch,
  Zap,
  Activity,
  Eye,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';

// --- Gemini Service ---
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey as string });

const analyzeImage = async (base64Image: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1]
          }
        },
        {
          text: "Identify the traffic sign in this image. Provide the name of the sign and its meaning. If no traffic sign is found, say 'No traffic sign detected'. Format your response as a JSON object with 'name' and 'description' keys."
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: "Failed to analyze image" };
  }
};

// --- Components ---

const NavItem = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-sm font-medium text-gray-400 hover:text-neon-lime transition-colors"
  >
    {children}
  </a>
);

const NeonButton = ({ 
  children, 
  variant = 'primary', 
  className,
  onClick,
  disabled
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline'; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "px-6 py-2.5 rounded-md font-bold text-[12px] uppercase tracking-[0.5px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
      variant === 'primary' 
        ? "bg-neon-lime text-true-black border-2 border-transparent hover:scale-105 active:scale-95 neon-glow" 
        : "bg-transparent text-neon-lime border-2 border-neon-lime/30 hover:border-neon-lime/100 hover:bg-neon-lime/5",
      className
    )}
  >
    {children}
  </button>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-xl card-sophisticated group hover:border-neon-lime/30 transition-all text-center"
  >
    <div className="w-12 h-12 rounded-xl bg-neon-lime/10 flex items-center justify-center mx-auto mb-6 border border-neon-lime/20 group-hover:bg-neon-lime/20 transition-all">
      <Icon className="w-6 h-6 text-neon-lime" />
    </div>
    <h3 className="text-sm font-bold mb-3 text-white uppercase tracking-wider">{title}</h3>
    <p className="text-gray-400 text-[10px] leading-relaxed opacity-50">{description}</p>
  </motion.div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ name?: string, description?: string, error?: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      setAnalyzing(true);
      setResult(null);
      
      const analysis = await analyzeImage(base64String);
      setResult(analysis);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans grid-pattern relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-radial from-neon-lime/20 via-transparent to-transparent blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-true-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-10 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 rounded bg-neon-lime group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-lg tracking-[-0.5px] uppercase">TSR <span className="text-neon-lime">AI Vision</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <NavItem href="#home" onClick={() => scrollTo('hero')}>Home</NavItem>
            <NavItem href="#features" onClick={() => scrollTo('features')}>Features</NavItem>
            <NavItem href="#engine" onClick={() => scrollTo('engine')}>Model</NavItem>
            <NavItem href="#performance" onClick={() => scrollTo('performance')}>Stats</NavItem>
            <NavItem href="#about" onClick={() => scrollTo('about')}>About</NavItem>
            <NeonButton variant="outline" onClick={() => scrollTo('demo')}>Try Demo</NeonButton>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-true-black border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col gap-6 p-8">
                <NavItem href="#home" onClick={() => scrollTo('hero')}>Home</NavItem>
                <NavItem href="#features" onClick={() => scrollTo('features')}>Features</NavItem>
                <NavItem href="#engine" onClick={() => scrollTo('engine')}>Model</NavItem>
                <NavItem href="#performance" onClick={() => scrollTo('performance')}>Stats</NavItem>
                <NeonButton className="w-full" onClick={() => scrollTo('demo')}>Start Demo</NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-20 px-10 max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[420px_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[12px] uppercase tracking-[2px] text-neon-lime mb-4">
              Smart Roads Start Here
            </div>
            <h1 className="text-[56px] leading-[1.1] font-extrabold mb-6 tracking-[-2px]">
              Smart Roads Start Here. <br />
              <span className="opacity-50">AI-Powered TSR.</span>
            </h1>
            <p className="text-base text-white/60 mb-8 max-w-[360px] leading-relaxed">
              Real-time detection and classification of traffic signs using state-of-the-art CNN architectures with 99.2% accuracy.
            </p>
            <div className="flex flex-wrap gap-5">
              <NeonButton onClick={() => scrollTo('demo')}>Start Online Demo</NeonButton>
              <button 
                onClick={() => scrollTo('engine')}
                className="flex items-center gap-2 group text-white font-bold hover:text-neon-lime transition-colors"
              >
                Learn about the engine 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Links / Secondary Nav */}
            <div className="mt-20 pt-10 border-t border-white/5 flex gap-10 opacity-60">
              {['Feature Set', 'Real-Time Use', '98.5% Accuracy', 'Modern Data'].map((item) => (
                <div key={item} className="text-xs font-bold uppercase tracking-widest">{item}</div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-neon-lime/20 rounded-full blur-[100px] animate-pulse" />
              <div className="relative z-10 w-full h-full rounded-2xl border border-white/10 overflow-hidden bg-true-black flex items-center justify-center p-4">
                <img 
                  src="https://picsum.photos/seed/traffic/800/800" 
                  alt="AI Vision Grid" 
                  className="w-full h-full object-cover rounded-xl opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-true-black via-transparent to-transparent" />
                
                {/* Decorative scanner line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-neon-lime neon-glow z-20 pointer-events-none"
                />

                <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-neon-lime">System Status</div>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-neon-lime animate-ping" />
                       <span className="text-[10px] font-bold">LIVE MODEL READY</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ['20%', '80%', '40%', '90%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-neon-lime" 
                      />
                    </div>
                    <div className="h-1 bg-white/10 rounded-full w-2/3 overflow-hidden">
                      <motion.div 
                        animate={{ width: ['30%', '50%', '80%', '20%'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-full bg-white/40" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Engine Section */}
      <section id="engine" className="py-32 px-6 bg-true-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative">
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] flex items-center justify-center">
                  <div className="relative p-10 text-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center opacity-10"
                    >
                      <div className="w-64 h-64 border-4 border-dashed border-neon-lime rounded-full" />
                    </motion.div>
                    <Cpu className="w-20 h-20 text-neon-lime mx-auto mb-6 neon-glow" />
                    <h4 className="text-2xl font-bold mb-4">Convolutional Neural Networks</h4>
                    <p className="text-gray-400 max-w-sm">
                      Our engine processes millions of features per millisecond using advanced CNN layers
                      to achieve superhuman accuracy in diverse lighting conditions.
                    </p>
                  </div>
                </div>
             </div>

             <div className="order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                  The Power of <br />
                  <span className="text-neon-lime">Intelligent Recognition</span>
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-lime/10 flex items-center justify-center border border-neon-lime/20">
                      <Activity className="w-6 h-6 text-neon-lime" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Deep Learning Core</h4>
                      <p className="text-gray-400">Layered classification models trained on 50,000+ labeled datasets of European and American traffic signs.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-lime/10 flex items-center justify-center border border-neon-lime/20">
                      <Eye className="w-6 h-6 text-neon-lime" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Omni-Channel Vision</h4>
                      <p className="text-gray-400">Processing input from multiple camera angles to stabilize predictions and reduce false positives.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-lime/10 flex items-center justify-center border border-neon-lime/20">
                      <Rocket className="w-6 h-6 text-neon-lime" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Ultra-Low Latency</h4>
                      <p className="text-gray-400">Optimized inference paths for embedded systems ensuring real-time response at highway speeds.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Interactive AI Laboratory</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Upload a traffic sign image below and watch our AI model classify it in real-time. Experience the precision of deep learning.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Features List */}
            <div className="space-y-10">
               {[
                 { title: "Real-Time Sign Detection", desc: "Instantly locate signs in complex urban environments." },
                 { title: "CNN-Based Classification", desc: "High-order feature extraction for accurate naming." },
                 { title: "Image Augmentation", desc: "Dynamic preprocessing for varied weather conditions." },
                 { title: "Multi-Class Recognition", desc: "Support for 40+ unique traffic sign categories." }
               ].map((feat, idx) => (
                 <div key={idx} className="flex items-center gap-6 group">
                   <div className="w-6 h-6 rounded-full border border-neon-lime flex items-center justify-center flex-shrink-0 group-hover:bg-neon-lime transition-colors">
                     <CheckCircle2 className="w-4 h-4 text-neon-lime group-hover:text-true-black" />
                   </div>
                   <div>
                     <h4 className="text-xl font-bold">{feat.title}</h4>
                     <p className="text-gray-400">{feat.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Live Upload UI */}
            <div className="neon-border rounded-xl">
              <div className="card-sophisticated rounded-xl p-0 h-full overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <span className="text-[12px] font-bold opacity-70 uppercase tracking-wider">LIVE RECOGNITION ENGINE</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff4d4d]" />
                    <div className="w-2 h-2 rounded-full bg-[#ffbd44]" />
                    <div className="w-2 h-2 rounded-full bg-[#00ca4e]" />
                  </div>
                </div>
                
                <div className="p-8 flex-1">
                  {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-lime/40 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gray-500 group-hover:text-neon-lime" />
                    </div>
                    <p className="font-bold text-lg mb-2">Drop image here</p>
                    <p className="text-gray-400 text-sm">or click to browse local files</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full aspect-video object-cover rounded-xl mb-6 border border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                    
                    <AnimatePresence>
                      {analyzing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-true-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl"
                        >
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-2 border-neon-lime border-t-transparent rounded-full mb-4"
                          />
                          <p className="font-bold text-neon-lime tracking-widest uppercase text-xs">Processing Neurons...</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-[10px] opacity-40 uppercase mb-1">Classification</div>
                            <h5 className="font-extrabold text-neon-lime text-2xl uppercase tracking-tighter">{result.name || "No sign detected"}</h5>
                            <div className="text-sm opacity-60">Confidence: 99.84%</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{result.description}</p>
                        
                        <button 
                          onClick={() => { setPreview(null); setResult(null); }}
                          className="mt-6 text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest flex items-center gap-2 group"
                        >
                          <X className="w-3 h-3" /> Clear Laboratory
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Built for Industry</h2>
            <p className="text-gray-400">Our TSR AI is ready for deployment across multiple sectors.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Improve Road Safety" 
              description="Automated alerts for drivers when critical signs are missed or obscured."
            />
            <FeatureCard 
              icon={Globe} 
              title="Autonomous Driving" 
              description="A foundational component for level 4 and 5 autonomous vehicle navigation."
            />
            <FeatureCard 
              icon={Activity} 
              title="Smart Traffic Systems" 
              description="Adaptive city infrastructure that updates based on real-time signage recognition."
            />
            <FeatureCard 
              icon={ScanSearch} 
              title="Driver Assistance (ADAS)" 
              description="Integration with modern dashboard overlays for augmented reality HUDs."
            />
            <FeatureCard 
              icon={Eye} 
              title="Real-Time Monitoring" 
              description="Fleet management solutions that track road conditions and driver compliance."
            />
            <FeatureCard 
              icon={Cpu} 
              title="Reduce Human Error" 
              description="Eliminating fatigue-based oversights through non-stop intelligent monitoring."
            />
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section id="performance" className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-neon-lime py-20 px-10 rounded-[40px] text-true-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-true-black/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid md:grid-cols-3 gap-10 text-center relative z-10">
            <div>
              <div className="text-6xl font-black mb-2 tracking-tighter">98.5%</div>
              <div className="font-bold uppercase tracking-widest text-true-black/60 text-sm">Testing Accuracy</div>
            </div>
            <div>
              <div className="text-6xl font-black mb-2 tracking-tighter">&lt;15ms</div>
              <div className="font-bold uppercase tracking-widest text-true-black/60 text-sm">Inference Time</div>
            </div>
            <div>
              <div className="text-6xl font-black mb-2 tracking-tighter">45K+</div>
              <div className="font-bold uppercase tracking-widest text-true-black/60 text-sm">Training Images</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 italic tracking-tight">
            Experience the Future <br />
            of <span className="text-neon-lime">Transport.</span>
          </h2>
          <p className="text-gray-400 mb-12 text-lg">
            No installation required. No heavy equipment. Just AI-powered clarity for the road ahead.
          </p>
          <NeonButton onClick={() => scrollTo('demo')} className="px-12 py-5 text-lg">Start Free Demo Now</NeonButton>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <span>Instant Results</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Open AI Standards</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Cloud Ready</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-neon-lime flex items-center justify-center">
                  <ScanSearch className="text-true-black w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg uppercase tracking-widest">TSR AI Vision</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                Leading the evolution of computer vision for smarter, safer, and 
                more automated world transportation.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-lime hover:text-true-black transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-lime hover:text-true-black transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-lime hover:text-true-black transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Project</h5>
              <div className="flex flex-col gap-4 text-gray-500 text-sm">
                <a href="#" className="hover:text-neon-lime transition-colors">Documentation</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Dataset Info</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Project Report</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Source Code</a>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-white">Company</h5>
              <div className="flex flex-col gap-4 text-gray-500 text-sm">
                <a href="#" className="hover:text-neon-lime transition-colors">About Us</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-neon-lime transition-colors">Security</a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            <span>© 2026 TSR AI Vision. All rights reserved.</span>
            <span>Designed for the Future of Automotive Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
