"use client";

import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Sparkles,
  Globe,
  Lock,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  Wifi
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 overflow-hidden flex flex-col font-sans relative selection:bg-cyan-500/30">
      
      {/* --- Background Effects --- */}
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0"></div>
      
      {/* Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-5 w-full max-w-7xl mx-auto z-50 sticky top-0 backdrop-blur-md bg-[#030712]/60 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            $
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">LendFlow</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</Link>
          <Link href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</Link>
          <Link href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
          </Link>
          <Link href="/register">
            <Button className=" text-black hover:bg-slate-200 rounded-full px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col z-10 relative">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-start text-center pt-24 px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto relative w-full"
          >
            {/* Futuristic Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-cyan-400 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Loan Management</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1] mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                Manage the loan process
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                from start to finish
              </span>
            </h1>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed font-light">
              Deliver an exceptional financing experience without the risk. LendFlow handles every step of the application, management, and regulatory compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] border-none text-base font-semibold px-8 py-6 rounded-full transition-all hover:scale-105 group">
                  Explore Our Solution
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" className="bg-slate-900/50 hover:bg-slate-800 text-white border border-slate-700/50 text-base font-medium px-8 py-6 rounded-full backdrop-blur-md transition-all">
                  View Live Demo
                </Button>
              </Link>
            </div>

            {/* Floating Avatar 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute top-[10%] left-[5%] hidden lg:block animate-float"
            >
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="font-medium text-slate-300">Approval <span className="text-white">Granted</span></span>
              </div>
            </motion.div>
            
            {/* Floating Avatar 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute top-[25%] right-[0%] hidden lg:block animate-float-delayed"
            >
              {/* <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-medium text-slate-300">Funds <span className="text-white">Disbursed</span></span>
              </div> */}
            </motion.div>
          </motion.div>

          {/* Futuristic Mockup Section */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="mt-20 relative w-full max-w-6xl mx-auto pb-20"
          >
            {/* Futuristic Platform Glowing Stand */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-32 bg-cyan-500/20 blur-[100px] rounded-[100%]"></div>

            {/* Floating Card 1: Revenue Analytics */}
            <motion.div 
              className="absolute left-[2%] top-[15%] z-20 hidden lg:block"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="bg-[#0b1121]/80 backdrop-blur-xl p-5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-64 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-[20px] rounded-full"></div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Total Volume</span>
                    <div className="text-sm text-emerald-400 font-semibold">+24.5%</div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white tracking-tight">$8.4M</div>
                
                {/* Mini Sparkline Chart Mockup */}
                <div className="mt-4 flex items-end gap-1 h-12">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500/10 to-cyan-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2: Security */}
            <motion.div 
              className="absolute right-[2%] top-[25%] z-20 hidden lg:block"
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <div className="bg-[#0b1121]/80 backdrop-blur-xl p-5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-56 border border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 blur-[20px] rounded-full"></div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Security</span>
                </div>
                <div className="text-xl font-bold text-white">Bank-Grade</div>
                <div className="text-xs text-slate-400 mt-1">End-to-end encryption</div>
              </div>
            </motion.div>

            {/* Floating Card 3: Active Users */}
            <motion.div 
              className="absolute left-[8%] bottom-[20%] z-20 hidden lg:block"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
            >
              <div className="bg-[#0b1121]/80 backdrop-blur-xl p-4 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-48 border border-white/10 relative overflow-hidden flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Borrowers</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">14,205</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Now</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 4: Uptime / Latency */}
            <motion.div 
              className="absolute right-[5%] bottom-[15%] z-20 hidden lg:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="bg-[#0b1121]/80 backdrop-blur-xl p-4 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-48 border border-white/10 relative overflow-hidden flex flex-col gap-2">
                <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-cyan-500/10 blur-[15px] rounded-full"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">API Status</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">12<span className="text-sm text-slate-400 font-medium">ms</span></div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mt-1">99.99% Uptime</div>
              </div>
            </motion.div>

            {/* Phone Mockup Center */}
            <div className="mx-auto w-[340px] h-[680px] bg-[#030712] rounded-[50px] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[10px] border-[#1e293b] overflow-hidden relative flex flex-col z-10 transform-gpu perspective-[1000px] rotate-x-[5deg]">
              
              {/* Phone Notch/Dynamic Island */}
              <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-40 flex items-center justify-between px-3 border border-white/5">
                 <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
              </div>
              
              {/* Phone Content Mockup */}
              <div className="flex-1 bg-gradient-to-b from-[#0f172a] to-[#030712] p-6 pt-14 flex flex-col relative overflow-hidden">
                
                {/* Inner Glow */}
                <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-cyan-600/20 blur-[80px] rounded-full"></div>

                <div className="flex justify-between items-center mb-10 z-10">
                  <div className="space-y-1.5">
                    <div className="w-7 h-0.5 bg-slate-400 rounded-full"></div>
                    <div className="w-5 h-0.5 bg-slate-400 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-tr from-cyan-500 to-purple-500"></div>
                  </div>
                </div>
                
                <div className="z-10 mb-8">
                  <p className="text-sm text-slate-400 mb-1">Available Credit</p>
                  <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-2">
                    $12,450<span className="text-slate-500 text-2xl">.00</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8 z-10">
                  <div className="bg-[#1e293b]/50 backdrop-blur-md p-4 rounded-3xl border border-slate-700/50 flex flex-col justify-between hover:bg-[#1e293b] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                      <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-sm font-medium text-slate-200">History</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-3xl shadow-[0_10px_20px_rgba(6,182,212,0.3)] flex flex-col justify-between cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">Apply Now</div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="flex-1 bg-[#0b1121]/80 backdrop-blur-xl rounded-[2rem] p-5 border border-white/5 -mx-2 z-10 shadow-inner">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-semibold text-white">Active Loans</div>
                    <div className="text-xs font-medium text-cyan-400">View All</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700">
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">Personal Loan</div>
                          <div className="text-xs text-slate-500">Auto-pay on 12th</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">$450.00</div>
                        <div className="text-[10px] text-slate-500">Upcoming</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700">
                          <ShieldCheck className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">Vehicle EMI</div>
                          <div className="text-xs text-slate-500">Completed</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-400">$210.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Built for the Future of Lending
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Everything you need to launch, manage, and scale your lending operations with military-grade security and blazing fast performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Clock, title: "Real-Time Decisions", desc: "Automated underwriting engines process applications in milliseconds, not days." },
                { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption with advanced compliance protocols built right into the core." },
                { icon: Globe, title: "Global Infrastructure", desc: "Scale globally from day one with multi-currency support and localized compliance." },
                { icon: BarChart3, title: "Predictive Analytics", desc: "AI-driven insights to predict defaults and optimize your lending portfolio." },
                { icon: ShieldCheck, title: "Risk Mitigation", desc: "Advanced KYC/AML integration and identity verification built-in." },
                { icon: Zap, title: "API-First Design", desc: "Integrate seamlessly with your existing stack using our modern GraphQL API." },
              ].map((feature, idx) => (
                <div key={idx} className="bg-[#0b1121]/50 backdrop-blur-xl border border-slate-800/60 p-8 rounded-3xl hover:bg-[#0f172a]/80 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center mb-6 group-hover:border-cyan-500/50 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-transparent to-[#050b14] relative z-10">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                How LendFlow Works
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Three simple steps to supercharge your lending pipeline.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-12 relative">
              
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-purple-500/0 -translate-y-1/2 -z-10"></div>

              {[
                { step: "01", title: "Integrate API", desc: "Connect your front-end using our lightning-fast API." },
                { step: "02", title: "Set Parameters", desc: "Define your custom risk models and loan parameters." },
                { step: "03", title: "Automate Funding", desc: "Watch as applications process and fund automatically." },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2rem] w-full max-w-sm relative z-10 text-center shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-slate-950 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative z-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-[3rem] p-12 md:p-20 text-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px]"></div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
                Ready to transform your lending?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
                Join hundreds of financial institutions already using LendFlow to scale their operations securely.
              </p>
              
              <Link href="/register">
                <Button size="lg" className="relative z-10 text-black hover:bg-slate-200 px-10 py-6 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-[#030712] pt-16 pb-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
              
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    $
                  </div>
                  <span className="font-bold text-xl text-white tracking-tight">LendFlow</span>
                </div>
                <p className="text-slate-400 max-w-sm mb-6">
                  The modern, API-first lending infrastructure built for scale, speed, and uncompromising security.
                </p>
                <div className="flex gap-4">
                  {/* Social Icons Placeholders */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 cursor-pointer transition-colors">
                      <div className="w-4 h-4 rounded-full bg-current opacity-50"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-6">Product</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Integrations</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Changelog</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-6">Developers</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">API Reference</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Status</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">GitHub</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <p>© {new Date().getFullYear()} LendFlow Inc. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
                <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}