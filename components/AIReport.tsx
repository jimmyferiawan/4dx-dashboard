
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DashboardData } from '../types';
import { getLaggingScore, getLeadingScore, calculateControlScore } from '../utils';
import { INFLUENCING_FACTORS } from '../constants';
import { Bot, Loader2, FileText, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface AIReportProps {
  data: DashboardData;
  previousData?: DashboardData;
}

const AIReport: React.FC<AIReportProps> = ({ data, previousData }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract a comprehensive summary for the AI
  const getSummary = (dashboardData: DashboardData) => {
    return dashboardData.indicators.map(lag => {
      const lagScore = getLaggingScore(lag);
      return {
        category: lag.name,
        score: lagScore.toFixed(1),
        leadings: lag.leadings.map(lead => {
          const leadScore = getLeadingScore(lead);
          return {
            name: lead.name,
            score: leadScore.toFixed(1),
            // Pass ALL controls so AI can analyze trends (both improvements and regressions)
            controls: lead.controls.map(c => ({
              name: c.name,
              actual: c.actual,
              target: c.target,
              score: calculateControlScore(c).toFixed(1)
            }))
          };
        })
      };
    });
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const currentSummary = getSummary(data);
      const previousSummary = previousData ? getSummary(previousData) : null;

      const prompt = `
        Anda adalah Asisten Direktur Operasional Tambang (Senior Mining Manager). Tinjau data kinerja mingguan 4DX berikut dan buat laporan analisis mendalam.
        
        KONTEKS DATA:
        - Hirarki Kinerja: 
          1. **KPI Strategic** (Hasil Akhir: Productivity, Availability, Cycle Time). Skor KPI Strategic adalah rata-rata dari ketiga indikator ini.
          2. **Leading Indicators** (Pendorong Kinerja: e.g., Productivity Loader).
          3. **Control Indicators** (Aktivitas Harian Lapangan: e.g., Front Condition, Road Condition).
        - Skor: 0-100% (Target 100%).

        DATA MINGGU INI:
        ${JSON.stringify(currentSummary, null, 2)}

        KAMUS FAKTOR TEKNIS & PENYEBAB (Gunakan ini untuk menjelaskan "MENGAPA"):
        ${JSON.stringify(INFLUENCING_FACTORS, null, 2)}

        ${previousSummary ? `DATA MINGGU SEBELUMNYA (Untuk Analisis Tren):
        ${JSON.stringify(previousSummary, null, 2)}` : ''}

        INSTRUKSI PENULISAN LAPORAN:
        Buat laporan dalam BAHASA INDONESIA yang Profesional, Tegas, dan Berorientasi Data. Ikuti struktur ini:

        1. **Ringkasan Eksekutif (Executive Summary)**:
           - Berikan status kesehatan proyek secara keseluruhan dalam 2-3 kalimat padat. Sebutkan performa agregat KPI Strategic.

        2. **Analisis Rantai Kausalitas & Korelasi (Deep Dive Analysis)**:
           *INI ADALAH BAGIAN TERPENTING.* Jangan bahas indikator secara terpisah. Hubungkan titik-titik dari Control -> Leading -> KPI Strategic.
           
           Gunakan pola analisis berikut untuk setiap Key Indicator (Lagging):
           
           a. **Analisis PRODUCTIVITY**:
              - Jelaskan bagaimana *Control Indicators* (seperti Front Condition Index, Blasting Quality, Loading Time) secara langsung mempengaruhi *Leading Indicators* (Productivity Loader/Hauler).
              - *Contoh Narasi*: "Penurunan skor Productivity menjadi X% berkorelasi kuat dengan rendahnya Productivity Loader (Y%). Akar masalah utamanya adalah Front Condition Index yang hanya Z%, yang menyebabkan manuver unit terhambat dan cycle time loading membengkak."
           
           b. **Analisis AVAILABILITY**:
              - Hubungkan *Control Indicators* (Idle Time, Rain/Slippery, Deviasi HM) dengan *Effective Working Hours (EWH)*.
              - Jelaskan dampaknya: Apakah unit tersedia tapi tidak bekerja (Idle)? Atau breakdown tinggi?
           
           c. **Analisis CYCLE TIME**:
              - Hubungkan efisiensi Supply Chain/Inventory dengan kelancaran operasi.

        3. **Identifikasi Hambatan Kritis (Critical Bottlenecks)**:
           - Sebutkan 3 Control Indicator dengan performa terburuk yang menjadi "leher botol" utama minggu ini.

        4. **Rekomendasi Perbaikan Taktis (Actionable Insights)**:
           - Berikan 3-4 solusi teknis spesifik berdasarkan "Kamus Faktor Teknis".
           - Jangan berikan saran umum seperti "Tingkatkan kinerja". Berikan saran teknis seperti "Lakukan perbaikan grading jalan di segmen X untuk meningkatkan Travel Speed" atau "Review desain blasting untuk mengurangi material oversize."

        GAYA BAHASA:
        - Gunakan istilah pertambangan yang tepat.
        - Fokus pada hubungan sebab-akibat.
        - Objektif dan solutif.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text);

    } catch (err) {
      setError("Gagal membuat laporan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-indigo-100">Analis Kinerja AI</h2>
          </div>
          {previousData && (
             <div className="flex items-center mt-1 ml-8 space-x-1 text-xs text-indigo-300/70">
                <TrendingUp className="w-3 h-3" />
                <span>Membandingkan dengan data minggu lalu</span>
             </div>
          )}
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          <span>{loading ? 'Menganalisis Tren...' : 'Buat Laporan Mingguan'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-800/50 text-rose-300 rounded-lg text-sm flex items-center space-x-2 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
        </div>
      )}

      {report && (
        <div className="mt-4 prose prose-invert prose-sm max-w-none bg-slate-950 p-6 rounded-lg border border-slate-800 shadow-inner">
          <div dangerouslySetInnerHTML={{ 
            __html: report
              .replace(/\*\?(.*?)\*\*/g, '<strong class="text-indigo-200">$1</strong>')
              .replace(/# (.*?)\n/g, '<h3 class="text-lg font-bold text-white mb-2">$1</h3>')
              .replace(/## (.*?)\n/g, '<h4 class="text-md font-bold text-slate-200 mt-5 mb-2 border-b border-slate-800 pb-1">$1</h4>')
              .replace(/- (.*?)\n/g, '<li class="text-slate-300 ml-4 mb-1">$1</li>')
              .replace(/\n/g, '<br />')
          }} />
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
             <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Dibuat oleh Gemini 3 Flash</span>
             <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReport;
