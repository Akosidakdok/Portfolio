import { useEffect } from 'react';

function App() {
  // This hook handles the scroll reveal animations
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    reveals.forEach(reveal => observer.observe(reveal));

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <>
      
      <nav className="fixed w-full bg-[#050505]/80 backdrop-blur-md border-b border-gray-900 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-cyan-400 tracking-tight neon-text">CJ.Dev</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-400 hover:text-cyan-400 transition">About</a>
              <a href="#skills" className="text-gray-400 hover:text-cyan-400 transition">Skills</a>
              <a href="#projects" className="text-gray-400 hover:text-cyan-400 transition">Projects</a>
              <a href="#contact" className="text-gray-400 hover:text-cyan-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      
      <section id="about" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[80vh]">
        <div className="md:w-1/2 reveal">
          <h2 className="text-sm font-semibold text-cyan-400 tracking-widest uppercase mb-3 drop-shadow-md">Christian James D. Baldonado</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Building modern web apps <br /> <span className="text-cyan-400 neon-text">& data-driven systems.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            I'm a Bachelor of Science in Information Technology student at PLV actively seeking an internship. I specialize in full-stack web development, combining React frontends with scalable databases, AI integrations, and interactive UI design.
          </p>
          <div className="flex gap-4">
            <a href="#projects" className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transform hover:-translate-y-1">View Projects</a>
            <a href="#contact" className="bg-transparent text-cyan-400 border border-cyan-500 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-950/30 transition transform hover:-translate-y-1">Contact Me</a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center reveal delay-200">
          <div className="w-72 h-72 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-gray-800 shadow-[0_0_40px_rgba(34,211,238,0.15)] relative group transition-all duration-700 hover:scale-105">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-20 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
            <span className="text-gray-600 text-sm font-mono tracking-widest">&lt; Profile /&gt;</span>
          </div>
        </div>
      </section>

      
      <section id="skills" className="bg-[#0a0a0a] py-24 border-y border-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-white reveal">Technical Arsenal</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-[#050505] rounded-xl border border-gray-800 interactive-card reveal delay-100 group">
              <div className="font-bold text-2xl mb-2 text-cyan-400 group-hover:neon-text transition duration-300">React.js</div>
              <p className="text-sm text-gray-500">Vite, Tailwind, TypeScript</p>
            </div>
            <div className="p-6 bg-[#050505] rounded-xl border border-gray-800 interactive-card reveal delay-200 group">
              <div className="font-bold text-2xl mb-2 text-cyan-400 group-hover:neon-text transition duration-300">Firebase</div>
              <p className="text-sm text-gray-500">Auth, Firestore, Hosting</p>
            </div>
            <div className="p-6 bg-[#050505] rounded-xl border border-gray-800 interactive-card reveal delay-300 group">
              <div className="font-bold text-2xl mb-2 text-cyan-400 group-hover:neon-text transition duration-300">Python</div>
              <p className="text-sm text-gray-500">NumPy, Pandas, Data Analysis</p>
            </div>
            <div className="p-6 bg-[#050505] rounded-xl border border-gray-800 interactive-card reveal delay-400 group">
              <div className="font-bold text-2xl mb-2 text-cyan-400 group-hover:neon-text transition duration-300">UI / Game Dev</div>
              <p className="text-sm text-gray-500">Figma, Interactive Design</p>
            </div>
          </div>
        </div>
      </section>

      
      <section id="projects" className="py-24 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-white reveal">Featured Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            
            <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 interactive-card reveal delay-100 flex flex-col">
              <div className="h-48 border-b border-gray-800 bg-black flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <span className="text-gray-600 font-mono text-sm tracking-widest group-hover:text-cyan-400 transition duration-500">FEASIFY_UI.TSX</span>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">React</span>
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">TypeScript</span>
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">OpenAI</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">FeasiFy System</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-1">An AI-assisted web-based financial feasibility system built for BSBA FM students. Automates the generation of financial parameters and complex system architecture.</p>
                <a href="#" className="inline-flex items-center text-cyan-400 font-semibold hover:text-cyan-300 transition group mt-auto">
                  View Repository 
                  <span className="ml-2 transform group-hover:translate-x-2 transition">&rarr;</span>
                </a>
              </div>
            </div>

            
            <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-800 interactive-card reveal delay-200 flex flex-col">
              <div className="h-48 border-b border-gray-800 bg-black flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <span className="text-gray-600 font-mono text-sm tracking-widest group-hover:text-cyan-400 transition duration-500">ITCH_IO_LAUNCH.HTML</span>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">Game Dev</span>
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">HTML/CSS</span>
                  <span className="text-xs font-mono bg-cyan-950 border border-cyan-900 text-cyan-400 px-2 py-1 rounded">UI Design</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">The Great Debate</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-1">A 2D platform fighting game spin-off of the Cyndikato tabletop game. Designed and launched on itch.io, handling the layout, descriptions, and web presence.</p>
                <a href="#" className="inline-flex items-center text-cyan-400 font-semibold hover:text-cyan-300 transition group mt-auto">
                  View on itch.io 
                  <span className="ml-2 transform group-hover:translate-x-2 transition">&rarr;</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      
      <footer id="contact" className="bg-[#0a0a0a] border-t border-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="text-3xl font-bold mb-6 text-white">Initialize Connection</h2>
          <p className="text-gray-400 mb-10 text-lg">I am currently looking for an internship position. Let's discuss how my full-stack web development skills can contribute to your team.</p>
          <div className="flex justify-center gap-8 mb-12 font-mono">
            <a href="#" className="text-gray-500 hover:text-cyan-400 hover:neon-text transform hover:-translate-y-1 transition text-sm tracking-widest uppercase">GitHub</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 hover:neon-text transform hover:-translate-y-1 transition text-sm tracking-widest uppercase">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 hover:neon-text transform hover:-translate-y-1 transition text-sm tracking-widest uppercase">Email</a>
          </div>
          <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">&copy; 2026 Christian James D. Baldonado. System Online.</p>
        </div>
      </footer>
    </>
  );
}

export default App;