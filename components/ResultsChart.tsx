import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { YearData, Language } from '../types';
import { formatCurrency } from '../utils/calculations';
import { translations } from '../utils/translations';

interface ResultsChartProps {
  data: YearData[];
  contributionEndAge: number;
  language: Language;
}

const ResultsChart: React.FC<ResultsChartProps> = ({ data, contributionEndAge, language }) => {
  const t = translations[language].chart;

  // Custom Tooltip Component for rich interaction
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalValue = payload[0].value;
      const principal = payload[1].value;
      const interest = totalValue - principal;
      const roi = principal > 0 ? ((interest / principal) * 100).toFixed(1) : 0;
      const isContributing = parseInt(label) <= contributionEndAge;
      
      const principalPercentage = totalValue > 0 ? (principal / totalValue) * 100 : 0;
      const interestPercentage = totalValue > 0 ? (interest / totalValue) * 100 : 0;

      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700 min-w-[240px] text-white z-50">
          <div className="flex justify-between items-center mb-3">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
              {t.tooltipAge} <span className="text-white text-lg ml-1">{label}</span>
            </p>
            {isContributing ? (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Phase 1: Accumulation
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Phase 2: Growth
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-indigo-300 font-bold text-sm">{t.seriesValue}</span>
              <span className="text-white font-bold text-lg">{formatCurrency(totalValue)}</span>
            </div>
            
            <div className="h-px bg-slate-700/50"></div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t.seriesPrincipal}</span>
                <span className="text-slate-300 font-medium">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400">{t.seriesInterest}</span>
                <span className="text-emerald-300 font-medium">+{formatCurrency(interest)}</span>
              </div>
            </div>
            
            {/* Visual ROI Bar */}
            <div className="mt-2 pt-2 border-t border-slate-700/50">
              <div className="flex justify-between text-[10px] mb-1.5 opacity-80 font-medium">
                  <span className="text-slate-400">{principalPercentage.toFixed(0)}% Principale</span>
                  <span className="text-emerald-400">{interestPercentage.toFixed(0)}% Interessi</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${principalPercentage}%` }} className="h-full bg-slate-500" />
                  <div style={{ width: `${interestPercentage}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
              </div>
            </div>

            <div className="mt-2 pt-2 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">{t.roi}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +{roi}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[450px] w-full glass-panel p-1 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden group border border-slate-700/50 bg-slate-800/20">
       {/* Background Grid Decoration */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03] pointer-events-none invert"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 p-5 pb-0 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="bg-indigo-500 w-2 h-6 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
            {t.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1">Simulazione esponenziale in tempo reale</p>
        </div>
        
        <div className="flex gap-4 text-xs bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 mt-3 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></span>
            <span className="text-slate-300 font-medium">{t.seriesValue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-600"></span>
            <span className="text-slate-400 font-medium">{t.seriesPrincipal}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.4} />
            
            <XAxis 
              dataKey="age" 
              tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} 
              axisLine={false}
              tickLine={false}
              dy={10}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`} 
              tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            {/* Area to highlight contribution phase */}
            <ReferenceArea 
               x1={data[0]?.age} 
               x2={contributionEndAge} 
               fill="#6366f1" 
               fillOpacity={0.05} 
               strokeOpacity={0}
            />
            
            <ReferenceLine 
              x={contributionEndAge} 
              stroke="#f43f5e" 
              strokeDasharray="3 3" 
              strokeWidth={1.5}
            >
              <div style={{display: 'none'}}>Label handled by custom logic if needed</div>
            </ReferenceLine>

            <Area 
              type="monotone" 
              dataKey="totalValue" 
              name={t.seriesValue} 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
              animationDuration={1500}
              animationEasing="ease-out"
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#6366f1' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="totalPrincipal" 
              name={t.seriesPrincipal} 
              stroke="#475569" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorPrincipal)" 
              animationDuration={1500}
              animationEasing="ease-out"
            />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsChart;