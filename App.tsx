import React, { useState, useEffect, useMemo } from 'react';
import { SimulationParams, SimulationResult, Language } from './types';
import { calculateGrowth, formatCurrency } from './utils/calculations';
import ResultsChart from './components/ResultsChart';
import GeminiAdvisor from './components/GeminiAdvisor';
import { translations } from './utils/translations';
import { 
  TrendingUp, 
  Wallet, 
  ArrowRight, 
  Github, 
  PiggyBank, 
  Globe, 
  ChevronDown, 
  Star, 
  Calculator, 
  BarChart2, 
  Sparkles,
  Sigma,
  Pi,
  Zap,
  Clock,
  Infinity
} from 'lucide-react';

const DEFAULT_PARAMS: SimulationParams = {
  dailyAmount: 3.50,
  interestRate: 10,
  startAge: 18,
  investmentDurationYears: 5,
  targetAge: 50,
};

const MathBackground = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
    {/* Clean background blobs - removed mix-blend-screen to fix artifacts */}
    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/10 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

    {/* Golden Spiral & Fibonacci Rectangles */}
    <div className="absolute top-10 -right-20 opacity-[0.05] text-indigo-400 scale-150 sm:scale-100 origin-center">
       <svg width="800" height="800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
          {/* Rotating Rectangles Group */}
          <g className="animate-reverse-spin origin-center" style={{transformBox: 'fill-box', transformOrigin: '50% 50%'}}>
             <rect x="50" y="50" width="1" height="1" strokeOpacity="0.8" />
             <rect x="50" y="51" width="2" height="2" strokeOpacity="0.7" />
             <rect x="47" y="48" width="5" height="5" strokeOpacity="0.6" />
             <rect x="55" y="45" width="13" height="13" strokeOpacity="0.5" />
             <rect x="42" y="66" width="21" height="21" strokeOpacity="0.4" />
             <rect x="8" y="32" width="34" height="34" strokeOpacity="0.3" />
          </g>
          
          {/* The Spiral */}
          <path d="
            M 50 50 
            a 1 1 0 0 1 1 1 
            a 2 2 0 0 1 -2 2 
            a 3 3 0 0 1 -3 -3 
            a 5 5 0 0 1 5 -5 
            a 8 8 0 0 1 8 8 
            a 13 13 0 0 1 -13 13 
            a 21 21 0 0 1 -21 -21 
            a 34 34 0 0 1 34 -34 
            a 55 55 0 0 1 55 55"
            className="animate-draw"
            style={{animationDuration: '20s'}}
           />
       </svg>
    </div>

    {/* Floating Math Symbols */}
    <div className="absolute top-1/4 left-10 text-slate-700 animate-float-math" style={{animationDelay: '0s'}}>
      <Sigma size={40} strokeWidth={1} />
    </div>
    <div className="absolute bottom-1/3 right-20 text-indigo-900 animate-float-math" style={{animationDelay: '2s'}}>
      <Pi size={50} strokeWidth={1} />
    </div>
    <div className="absolute top-1/2 left-1/4 text-purple-900/50 animate-float-math" style={{animationDelay: '4s'}}>
      <span className="text-6xl font-serif italic">φ</span>
    </div>
    <div className="absolute bottom-20 left-20 text-slate-800 animate-float-math" style={{animationDelay: '1s'}}>
      <Infinity size={40} strokeWidth={1} />
    </div>
  </div>
));

// Optimized Slider Component
const Slider = React.memo(({ 
  min, max, step = 1, value, onChange, label, valueDisplay, suffix, note 
}: { 
  min: number, max: number, step?: number, value: number, onChange: (v: number) => void, 
  label: string, valueDisplay: React.ReactNode, suffix?: string, note?: string 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-baseline">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="text-right">
        <span className="text-xl font-bold text-slate-100 font-mono tracking-tight">{valueDisplay}</span>
        {suffix && <span className="text-sm text-slate-500 font-sans ml-1">{suffix}</span>}
      </div>
    </div>
    
    <div className="relative h-6 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 z-10"
      />
    </div>
    
    {note && <p className="text-[10px] text-slate-500 font-medium leading-tight">{note}</p>}
  </div>
));

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [language, setLanguage] = useState<Language>('it');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<'optimal' | 'late' | 'custom'>('optimal');

  // Use useMemo to prevent recalculation on every render unless params change
  const simulation = useMemo(() => {
    return calculateGrowth(params);
  }, [params]);

  const handleChange = (key: keyof SimulationParams, value: number) => {
    if (isNaN(value)) return;
    setActiveStrategy('custom');
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      if (key === 'startAge') {
         if (value >= newParams.targetAge) newParams.targetAge = value + 10;
      }
      if (key === 'targetAge') {
         if (value <= newParams.startAge) newParams.startAge = value - 10;
      }
      return newParams;
    });
  };

  const applyStrategy = (type: 'optimal' | 'late') => {
    setActiveStrategy(type);
    if (type === 'optimal') {
      setParams({
        ...params,
        startAge: 18,
        investmentDurationYears: 5,
        dailyAmount: 5,
        targetAge: 55
      });
    } else {
       setParams({
        ...params,
        startAge: 25,
        investmentDurationYears: 40, // Investing until 65
        dailyAmount: 5,
        targetAge: 65
      });
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const t = translations[language];

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative bg-slate-900 text-slate-200">
      
      <MathBackground />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-2 rounded-xl text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <Sigma size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                {t.nav.title}
              </span>
            </div>

            <div className="hidden md:flex items-center bg-slate-800/50 p-1 rounded-full border border-slate-700/50 backdrop-blur-md">
              <button onClick={() => scrollToSection('calculator')} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
                <Calculator size={16} /> {t.nav.tools.calculator}
              </button>
              <button onClick={() => scrollToSection('chart')} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
                <BarChart2 size={16} /> {t.nav.tools.chart}
              </button>
              <button onClick={() => scrollToSection('ai')} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
                <Sparkles size={16} /> {t.nav.tools.ai}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all border border-slate-700 bg-slate-800/50 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50"
              >
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span>{t.nav.star}</span>
              </a>

              <div className="relative z-50">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all focus:ring-2 focus:ring-indigo-500/50"
                >
                  <Globe size={16} className="text-slate-400" />
                  <span>{language === 'it' ? 'IT' : 'EN'}</span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1 overflow-hidden z-[100]">
                    <button 
                      onClick={() => { setLanguage('it'); setIsLangOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <span>🇮🇹</span> Italiano
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <span>🇺🇸</span> English
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pb-12 pt-20 lg:pt-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wide mb-6 animate-fade-in-up">
            <Sparkles size={12} />
            The Power of Compound Interest
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8 max-w-5xl mx-auto leading-tight drop-shadow-2xl">
            {t.hero.titleStart}
            {/* FIXED: Removed bg-clip-text which was causing rendering artifacts on some screens */}
            <span className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">{t.hero.titleHighlight1}</span>
            {t.hero.titleMiddle}
            <span className="text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]">{t.hero.titleHighlight2}</span>
            {t.hero.titleEnd}
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
             <button 
               onClick={() => scrollToSection('calculator')}
               className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 font-lg rounded-2xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-1"
             >
               {t.nav.tools.calculator} 
               <ArrowRight className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-16 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* CONFIGURATION PANEL */}
          <div className="lg:col-span-4" id="calculator">
            <div className="glass-panel p-8 rounded-3xl shadow-2xl sticky top-28 border-t border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-700/50 pb-6">
                <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  <Calculator className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100 leading-tight">{t.config.title}</h2>
                  <p className="text-xs text-slate-500 font-medium">Imposta i tuoi parametri</p>
                </div>
              </div>

              {/* Strategy Selector */}
              <div className="mb-8 bg-slate-900/40 p-1.5 rounded-xl flex gap-1 border border-slate-700/50">
                 <button 
                   onClick={() => applyStrategy('optimal')}
                   className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeStrategy === 'optimal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                 >
                   <Zap size={14} /> {t.config.strategies.optimal}
                 </button>
                 <button 
                   onClick={() => applyStrategy('late')}
                   className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeStrategy === 'late' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                 >
                   <Clock size={14} /> {t.config.strategies.late}
                 </button>
              </div>
              
              <div className="space-y-10">
                <Slider 
                  label={t.config.dailyLabel}
                  min={1} max={20} step={0.5}
                  value={params.dailyAmount}
                  onChange={(v) => handleChange('dailyAmount', v)}
                  valueDisplay={formatCurrency(params.dailyAmount)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                    <p className="text-xs text-slate-500 mb-1">Inizio</p>
                    <p className="text-xl font-bold text-indigo-400">{params.startAge} <span className="text-xs font-normal text-slate-500">anni</span></p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                    <p className="text-xs text-slate-500 mb-1">Fine</p>
                    <p className="text-xl font-bold text-purple-400">{params.targetAge} <span className="text-xs font-normal text-slate-500">anni</span></p>
                  </div>
                </div>

                <Slider 
                  label={t.config.startAgeLabel}
                  min={14} max={60}
                  value={params.startAge}
                  onChange={(v) => handleChange('startAge', v)}
                  valueDisplay={params.startAge}
                  suffix="anni"
                />

                <Slider 
                  label={t.config.durationLabel}
                  min={1} max={40}
                  value={params.investmentDurationYears}
                  onChange={(v) => handleChange('investmentDurationYears', v)}
                  valueDisplay={params.investmentDurationYears}
                  suffix="anni"
                />

                <Slider 
                  label={t.config.rateLabel}
                  min={1} max={15} step={0.5}
                  value={params.interestRate}
                  onChange={(v) => handleChange('interestRate', v)}
                  valueDisplay={params.interestRate}
                  suffix="%"
                  note="S&P 500 Historical Avg"
                />

                <Slider 
                  label={t.config.targetAgeLabel}
                  min={params.startAge + 1} max={80}
                  value={params.targetAge}
                  onChange={(v) => handleChange('targetAge', v)}
                  valueDisplay={params.targetAge}
                  suffix="anni"
                />
              </div>
            </div>
          </div>

          {/* RESULTS DISPLAY */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-all group border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <Wallet size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.stats.invested}</span>
                </div>
                <p className="text-3xl font-bold text-slate-200 tracking-tight">{simulation ? formatCurrency(simulation.totalInvested) : '-'}</p>
                <div className="text-xs text-slate-500 mt-2 font-mono">Principal</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl shadow-lg hover:bg-slate-800/60 transition-all group border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2 text-emerald-500">
                  <TrendingUp size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.stats.market}</span>
                </div>
                <p className="text-3xl font-bold text-emerald-400 tracking-tight">{simulation ? formatCurrency(simulation.totalInterestEarned) : '-'}</p>
                <div className="text-xs text-emerald-500/50 mt-2 font-mono">Compound Interest</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden group border border-white/10">
                 {/* Decorative circles */}
                 <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white opacity-10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                 
                 <div className="flex items-center gap-2 mb-2 relative z-10 opacity-90">
                   <PiggyBank size={16} />
                   <span className="text-xs font-bold uppercase tracking-wider">{t.stats.total} {params.targetAge}</span>
                 </div>
                 <p className="text-4xl font-extrabold relative z-10 tracking-tight">{simulation ? formatCurrency(simulation.finalAmount) : '-'}</p>
                 <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-xs font-bold border border-white/10 relative z-10">
                   {t.stats.multiplier} {simulation ? (simulation.finalAmount / simulation.totalInvested).toFixed(1) : 0}x
                 </div>
              </div>
            </div>

            {/* Main Chart */}
            <div id="chart" className="relative">
               {simulation && (
                  <ResultsChart 
                    data={simulation.data} 
                    contributionEndAge={params.startAge + params.investmentDurationYears} 
                    language={language}
                  />
               )}
            </div>

            {/* AI Advisor */}
            <div id="ai">
              {simulation && (
                <GeminiAdvisor 
                  result={simulation} 
                  params={params} 
                  language={language}
                />
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
           <div className="bg-slate-800 text-indigo-400 p-4 rounded-2xl mb-6 shadow-xl shadow-black/20 border border-slate-700 hover:scale-105 transition-transform">
             <TrendingUp size={24} />
           </div>
           <p className="text-slate-400 font-medium mb-2">{t.footer.text}</p>
           <p className="text-slate-600 text-xs max-w-lg mb-8 uppercase tracking-widest">{t.footer.disclaimer}</p>
           
           <div className="flex gap-6">
             <a href="#" className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all">
               <Github size={20} />
             </a>
             <a href="#" className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all">
               <Globe size={20} />
             </a>
           </div>
        </div>
      </footer>

    </div>
  );
};

export default App;