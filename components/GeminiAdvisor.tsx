import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SimulationResult, SimulationParams, Language } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Sparkles, Bot } from 'lucide-react';
import { translations } from '../utils/translations';

interface GeminiAdvisorProps {
  result: SimulationResult;
  params: SimulationParams;
  language: Language;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ result, params, language }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  
  useEffect(() => {
    setAdvice(null);
  }, [language]);

  const t = translations[language].advisor;

  const generateAdvice = async () => {
    if (!process.env.API_KEY) {
      setAdvice(t.errorKey);
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const promptIt = `
        Sei un mentore finanziario di successo, esperto in finanza personale per i giovani.
        Il tuo obiettivo è motivare un giovane adulto italiano a iniziare a investire ORA.
        
        DATI DELLA SIMULAZIONE:
        - Inizio investimento: ${params.startAge} anni.
        - Investimento: ${formatCurrency(params.dailyAmount)}/giorno.
        - Durata del sacrificio: Solo ${params.investmentDurationYears} anni (dai ${params.startAge} ai ${params.startAge + params.investmentDurationYears} anni). Poi STOP versamenti.
        - Totale versato di tasca propria: ${formatCurrency(result.totalInvested)}.
        - Rendimento ipotizzato: ${params.interestRate}% annuo.
        - Età finale: ${params.targetAge} anni.
        - CAPITALE FINALE: ${formatCurrency(result.finalAmount)}.
        - GUADAGNO PURO: ${formatCurrency(result.totalInterestEarned)}.

        CREA UNA RISPOSTA IN ITALIANO CON QUESTA STRUTTURA (Usa Markdown):
        1. **La Rivelazione**: Una frase a effetto shock su come ${formatCurrency(result.totalInvested)} sono diventati ${formatCurrency(result.finalAmount)} senza fare nulla dopo aver smesso di versare.
        2. **La Visione**: Descrivi vividamente cosa può fare un adulto di ${params.targetAge} anni con questa cifra.
        3. **Il Verdetto**: Una conclusione potente sull'iniziare presto (a ${params.startAge} anni).
        Tono: Energico, diretto, ispirazionale. Usa emoji. Max 150 parole.
      `;

      const promptEn = `
        You are a successful financial mentor, expert in personal finance for young adults.
        Your goal is to motivate a young investor to start investing NOW.
        
        SIMULATION DATA:
        - Start Age: ${params.startAge}.
        - Investment: ${formatCurrency(params.dailyAmount)}/day.
        - Sacrifice Duration: Only ${params.investmentDurationYears} years (from ${params.startAge} to ${params.startAge + params.investmentDurationYears}). Then STOP contributing.
        - Total out of pocket: ${formatCurrency(result.totalInvested)}.
        - Interest Rate: ${params.interestRate}% annual.
        - Target Age: ${params.targetAge}.
        - FINAL CAPITAL: ${formatCurrency(result.finalAmount)}.
        - PURE PROFIT: ${formatCurrency(result.totalInterestEarned)}.

        CREATE A RESPONSE IN ENGLISH WITH THIS STRUCTURE (Use Markdown):
        1. **The Revelation**: A shocking statement on how ${formatCurrency(result.totalInvested)} turned into ${formatCurrency(result.finalAmount)} doing nothing after contributions stopped.
        2. **The Vision**: Vividly describe what a ${params.targetAge}-year-old can do with this amount.
        3. **The Verdict**: A powerful conclusion on starting early (at ${params.startAge}).
        Tone: Energetic, direct, inspirational. Use emojis. Max 150 words.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: language === 'it' ? promptIt : promptEn,
      });

      setAdvice(response.text || "No response generated.");
    } catch (error) {
      console.error(error);
      setAdvice(t.errorGen);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 shadow-xl">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {t.title}
              </h3>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>
          
          {!advice && (
            <button
              onClick={generateAdvice}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all transform active:scale-95 ${
                loading 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'
              }`}
            >
              {loading ? (
                <>
                  <Bot className="w-4 h-4 animate-spin" /> {t.buttonLoading}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> {t.buttonIdle}
                </>
              )}
            </button>
          )}
        </div>

        {advice ? (
          <div className="animate-fadeIn">
             <div className="prose prose-invert prose-sm max-w-none text-slate-300 bg-indigo-950/30 p-5 rounded-xl border border-indigo-500/20">
                <div style={{ whiteSpace: 'pre-line' }} className="leading-relaxed font-medium">
                  {advice.replace(/\*\*/g, '')}
                </div>
             </div>
             <p className="text-xs text-slate-500 mt-3 text-center flex items-center justify-center gap-1">
               {t.disclaimer}
             </p>
          </div>
        ) : (
          !loading && (
            <div className="bg-slate-900/50 rounded-xl p-6 text-center border border-dashed border-slate-700">
              <p className="text-slate-400 text-sm mb-2">
                {t.placeholderTitle}
              </p>
              <p className="text-indigo-400 text-sm font-medium">
                {t.placeholderText}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;