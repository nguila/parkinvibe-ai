
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Pill, 
  BookOpen, 
  BrainCircuit, 
  ChevronRight, 
  CheckCircle2, 
  Plus,
  AlertCircle,
  Sparkles, 
  BarChart3, 
  Users, 
  Phone, 
  History, 
  TrendingUp, 
  Bell, 
  BellRing, 
  BellOff, 
  ShieldCheck, 
  Stethoscope, 
  Trophy, 
  PartyPopper, 
  Loader2, 
  Clock, 
  Flame, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Zap,
  Moon,
  Sun,
  Accessibility
} from 'lucide-react';
import { View, Medication, DiaryEntry, Contact, AIContent } from './types';
import * as gemini from './services/geminiService';

// Reusable Components
const NavItem = ({ icon: Icon, label, active, onClick, darkMode = false }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-0 transition-all duration-300 relative flex-1 min-w-0 tap-vibrate ${
      active ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-slate-500' : 'text-slate-400')
    }`}
  >
    <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? (darkMode ? 'bg-slate-800 ring-2 ring-slate-700' : 'bg-indigo-50 ring-2 ring-indigo-100') : 'bg-transparent'}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 text-center truncate w-full ${active ? 'opacity-100 scale-105' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
);

const CircularProgress = ({ size = 60, progress = 0, strokeWidth = 5, darkMode = false }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className={darkMode ? "text-slate-800" : "text-slate-100"}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-indigo-500 progress-ring__circle transition-all duration-500"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className={`absolute text-[10px] font-black ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{Math.round(progress)}%</span>
    </div>
  );
};

const InteractiveCard = ({ title, children, icon: Icon, color = "indigo", action, className = "", subtitle = "", duration = "", onClick, darkMode = false }: any) => {
  const colorMap: any = {
    indigo: { bg: 'bg-indigo-50', darkBg: 'bg-indigo-950/30', text: 'text-indigo-600', darkText: 'text-indigo-400', border: 'border-indigo-100', accent: 'border-l-indigo-500' },
    green: { bg: 'bg-emerald-50', darkBg: 'bg-emerald-950/30', text: 'text-emerald-600', darkText: 'text-emerald-400', border: 'border-emerald-100', accent: 'border-l-emerald-500' },
    amber: { bg: 'bg-amber-50', darkBg: 'bg-amber-950/30', text: 'text-amber-600', darkText: 'text-amber-400', border: 'border-amber-100', accent: 'border-l-amber-500' },
    purple: { bg: 'bg-purple-50', darkBg: 'bg-purple-950/30', text: 'text-purple-600', darkText: 'text-purple-400', border: 'border-purple-100', accent: 'border-l-purple-500' },
    rose: { bg: 'bg-rose-50', darkBg: 'bg-rose-950/30', text: 'text-rose-600', darkText: 'text-rose-400', border: 'border-rose-100', accent: 'border-l-rose-500' },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div 
      onClick={onClick}
      className={`${darkMode ? 'bg-slate-900 border-slate-800 shadow-slate-950/50' : 'bg-white border-white shadow-slate-200/50'} rounded-[2rem] p-6 shadow-xl border-l-8 ${c.accent} mb-5 transition-all duration-500 hover:shadow-2xl ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-2xl ${darkMode ? c.darkBg + ' ' + c.darkText : c.bg + ' ' + c.text}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className={`font-extrabold text-lg leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{title}</h3>
            <div className="flex items-center space-x-3 mt-1">
              {subtitle && <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? c.darkText : c.text}`}>{subtitle}</span>}
              {duration && (
                <span className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Clock size={12} className="mr-1" /> {duration}
                </span>
              )}
            </div>
          </div>
        </div>
        {action}
      </div>
      <div className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed text-sm font-medium`}>
        {children}
      </div>
    </div>
  );
};

const TremorChart = ({ data, darkMode = false }: { data: DiaryEntry[], darkMode?: boolean }) => {
  const chartData = [...data].reverse().slice(-7);
  if (chartData.length === 0) {
    return (
      <div className={`h-32 flex items-center justify-center text-xs font-bold uppercase tracking-widest border-2 border-dashed rounded-3xl ${darkMode ? 'text-slate-600 border-slate-800' : 'text-slate-400 border-slate-100'}`}>
        Aguardando registos...
      </div>
    );
  }
  return (
    <div className="flex items-end justify-between h-32 px-4 space-x-2">
      {chartData.map((entry, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group relative">
          <div 
            className="w-full bg-indigo-500 rounded-t-xl transition-all duration-500 hover:bg-indigo-600 cursor-pointer" 
            style={{ height: `${(entry.tremorLevel / 10) * 100}%` }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-xl transition-opacity">
              Nível {entry.tremorLevel}
            </div>
          </div>
          <span className={`text-[8px] mt-2 font-black truncate w-full text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {entry.date.split('/')[0]}/{entry.date.split('/')[1]}
          </span>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [exerciseTab, setExerciseTab] = useState<'daily' | 'physio' | 'favorites'>('daily');
  const [diaryDarkMode, setDiaryDarkMode] = useState(false);
  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Levodopa', dosage: '100mg', time: '08:00', taken: false, remindersEnabled: true },
    { id: '2', name: 'Pramipexol', dosage: '0.125mg', time: '14:00', taken: false, remindersEnabled: true },
    { id: '3', name: 'Levodopa', dosage: '100mg', time: '20:00', taken: false, remindersEnabled: true },
  ]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Dr. Silva (Neurologista)', phone: '912345678', relation: 'Médico' },
    { id: '2', name: 'Maria (Esposa)', phone: '987654321', relation: 'Cuidadora' }
  ]);
  const [aiPlan, setAiPlan] = useState<AIContent | null>(null);
  const [physioPlan, setPhysioPlan] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingPhysio, setLoadingPhysio] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [completedPhysio, setCompletedPhysio] = useState<Set<number>>(new Set());
  const [visibleItemsCount, setVisibleItemsCount] = useState(0);
  const [streak, setStreak] = useState(12);

  // Symptom Checker
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomResult, setSymptomResult] = useState<{level: string, advice: string} | null>(null);
  const [checkingSymptoms, setCheckingSymptoms] = useState(false);

  // Diary
  const [newNote, setNewNote] = useState('');
  const [tremorLevel, setTremorLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState('smile');

  // Load Favorites and Diary on startup
  useEffect(() => {
    const savedFavorites = localStorage.getItem('parkinvibe_favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    const savedDiary = localStorage.getItem('parkinvibe_diary');
    if (savedDiary) setDiary(JSON.parse(savedDiary));
  }, []);

  // Save Favorites and Diary when updated
  useEffect(() => {
    localStorage.setItem('parkinvibe_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('parkinvibe_diary', JSON.stringify(diary));
  }, [diary]);

  // Stats calculation
  const medProgress = (meds.filter(m => m.taken).length / meds.length) * 100;
  const exProgress = aiPlan ? (completedExercises.size / (aiPlan.physicalExercises.length + 1)) * 100 : 0;
  const totalDailyProgress = (medProgress + exProgress) / 2;

  const requestNotificationAccess = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const toggleExerciseComplete = (idx: number) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const togglePhysioComplete = (idx: number) => {
    setCompletedPhysio(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const toggleFavorite = (e: React.MouseEvent, exercise: any) => {
    e.stopPropagation(); 
    setFavorites(prev => {
      const isFav = prev.find(f => f.title === exercise.title);
      if (isFav) {
        return prev.filter(f => f.title !== exercise.title);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const isFavorite = (title: string) => favorites.some(f => f.title === title);

  const handleSymptomAnalysis = async () => {
    if (!symptomInput.trim()) return;
    setCheckingSymptoms(true);
    try {
      const result = await gemini.classifySymptoms(symptomInput);
      setSymptomResult(result);
    } catch (e) {
      console.error("Erro na análise de sintomas:", e);
    } finally {
      setCheckingSymptoms(false);
    }
  };

  const loadDailyAI = useCallback(async () => {
    setLoadingAI(true);
    setCompletedExercises(new Set());
    setVisibleItemsCount(0);
    setAiPlan(null);
    try {
      const plan = await gemini.getDailyPlan();
      setAiPlan(plan);
      setLoadingAI(false);
      let count = 0;
      const timer = setInterval(() => {
        count++;
        setVisibleItemsCount(count);
        if (count >= (plan.physicalExercises?.length || 0) + 2) clearInterval(timer);
      }, 350);
    } catch (e) {
      console.error(e);
      setLoadingAI(false);
    }
  }, []);

  const loadPhysioAI = useCallback(async () => {
    if (physioPlan.length > 0) return; // Carregar apenas uma vez por sessão para não gastar tokens
    setLoadingPhysio(true);
    try {
      const plan = await gemini.getPhysioPlan();
      setPhysioPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPhysio(false);
    }
  }, [physioPlan]);

  useEffect(() => {
    loadDailyAI();
  }, [loadDailyAI]);

  useEffect(() => {
    if (exerciseTab === 'physio') {
      loadPhysioAI();
    }
  }, [exerciseTab, loadPhysioAI]);

  const toggleMed = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Summary Header */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-100 flex items-center justify-between border border-indigo-50 relative overflow-hidden">
        <div className="flex items-center space-x-5 z-10">
          <CircularProgress progress={totalDailyProgress} size={80} strokeWidth={8} />
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-tight">O seu dia</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Quase lá! Faltam 2 tarefas.</p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-indigo-50 px-4 py-2 rounded-2xl z-10">
          <Flame className="text-orange-500 animate-pulse" size={24} fill="currentColor" />
          <span className="text-xs font-black text-indigo-700">{streak} Dias</span>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-full -mr-12 -mt-12 blur-2xl"></div>
      </div>

      {/* AI Motivation Mesh Card */}
      <div className="mesh-gradient rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden animate-float">
        <Sparkles className="absolute -right-6 -top-6 text-white/20 w-32 h-32" />
        <Zap className="absolute left-4 top-4 text-white/10" size={40} />
        <div className="relative z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 opacity-80">Insight da Manhã</h3>
          <p className="text-xl font-extrabold italic leading-snug">
            "{aiPlan?.motivation || 'Carregando sua dose de inspiração...'}"
          </p>
          <div className="mt-6 flex items-center space-x-2 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Assistente IA Ativo</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-5">
        <div onClick={() => setCurrentView(View.MEDICATION)} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 tap-vibrate cursor-pointer flex flex-col justify-between h-40">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
            <Pill size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Medicação</p>
            <p className="text-lg font-black text-slate-800">{meds.filter(m => !m.taken).length} Restantes</p>
          </div>
        </div>
        <div onClick={() => setCurrentView(View.EXERCISES)} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 tap-vibrate cursor-pointer flex flex-col justify-between h-40">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Exercícios</p>
            <p className="text-lg font-black text-slate-800">{aiPlan ? aiPlan.physicalExercises.length : '--' } Planeados</p>
          </div>
        </div>
      </div>

      {/* Symptom Summary */}
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2.5rem] flex items-center space-x-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm text-rose-500">
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 className="font-black text-rose-900 text-sm uppercase tracking-widest">Resumo Semanal</h4>
          <p className="text-rose-800/70 text-sm leading-tight mt-1">
            Os seus tremores têm estado <strong>15% mais controlados</strong> esta semana.
          </p>
        </div>
      </div>
    </div>
  );

  const renderMedication = () => (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-black text-slate-800">Meds</h2>
        <div className="flex space-x-3">
          <button onClick={requestNotificationAccess} className={`p-3 rounded-2xl ${notificationsEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
            <Bell size={24} />
          </button>
          <button className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg tap-vibrate"><Plus size={24} /></button>
        </div>
      </div>
      
      <div className="space-y-4">
        {meds.map((med) => (
          <div 
            key={med.id} 
            onClick={() => toggleMed(med.id)} 
            className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 tap-vibrate cursor-pointer ${
              med.taken 
              ? 'bg-emerald-50 border-emerald-100 shadow-none grayscale opacity-60' 
              : 'bg-white border-white shadow-xl shadow-slate-200/40 hover:scale-[1.02]'
            }`}
          >
            <div className="flex items-center space-x-5">
              <div className={`p-4 rounded-[1.2rem] transition-colors duration-500 ${med.taken ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'}`}>
                <Pill size={28} />
              </div>
              <div>
                <p className={`text-lg font-black leading-tight ${med.taken ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>{med.name}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{med.dosage}</span>
                  <span className="text-xs font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md">{med.time}</span>
                </div>
              </div>
            </div>
            {med.taken ? (
              <div className="bg-emerald-200 text-emerald-700 p-2 rounded-full"><CheckCircle2 size={24} /></div>
            ) : (
              <ChevronRight className="text-slate-300" size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiary = () => (
    <div className={`space-y-6 animate-fadeIn pb-10 transition-colors duration-500 ${diaryDarkMode ? 'bg-black p-4 -mx-6 min-h-screen' : ''}`}>
      <div className="flex justify-between items-center px-2">
        <h2 className={`text-3xl font-black ${diaryDarkMode ? 'text-white' : 'text-slate-800'}`}>Diário</h2>
        <button 
          onClick={() => setDiaryDarkMode(!diaryDarkMode)}
          className={`p-3 rounded-2xl tap-vibrate transition-all ${diaryDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-white text-indigo-600 shadow-lg'}`}
        >
          {diaryDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      
      <div className={`${diaryDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'} rounded-[2.5rem] p-8 shadow-2xl border space-y-8`}>
        <div>
          <label className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-6 text-center ${diaryDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Como se sente agora?</label>
          <div className="flex justify-around items-center">
            {[
              { id: 'frown', icon: Frown, color: 'rose' },
              { id: 'meh', icon: Meh, color: 'amber' },
              { id: 'smile', icon: Smile, color: 'emerald' },
            ].map((mood) => (
              <button 
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-5 rounded-3xl transition-all duration-300 transform tap-vibrate ${
                  selectedMood === mood.id 
                  ? `bg-${mood.color}-100 text-${mood.color}-600 scale-125 ring-4 ring-${mood.color}-50` 
                  : `${diaryDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'} opacity-60`
                }`}
              >
                <mood.icon size={36} strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${diaryDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Intensidade do Tremor</label>
            <span className={`font-black text-sm px-3 py-1 rounded-full ${diaryDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{tremorLevel}/10</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={tremorLevel} 
            onChange={(e) => setTremorLevel(parseInt(e.target.value))} 
            className={`w-full h-4 rounded-full appearance-none cursor-pointer accent-indigo-600 ${diaryDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
          />
        </div>

        <textarea 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
          placeholder="Algo que queira registar hoje?" 
          className={`w-full p-6 border-2 rounded-[2rem] text-sm outline-none transition-all min-h-[150px] font-medium ${diaryDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-4 focus:ring-indigo-900 focus:bg-slate-800' : 'bg-slate-50 border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:bg-white'}`} 
        />

        <button 
          onClick={() => {
            const entry: DiaryEntry = { id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleDateString('pt-PT'), timestamp: Date.now(), mood: selectedMood, tremorLevel, notes: newNote };
            setDiary([entry, ...diary]); setNewNote(''); setTremorLevel(5);
          }} 
          disabled={!newNote.trim()} 
          className={`w-full py-5 rounded-[2rem] font-black tap-vibrate disabled:opacity-50 flex items-center justify-center space-x-3 text-lg transition-all ${diaryDarkMode ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-950/50 hover:bg-indigo-400' : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700'}`}
        >
          <Heart size={24} fill="currentColor" />
          <span>GUARDAR DIA</span>
        </button>
      </div>

      <div className="space-y-4 px-2">
        <h3 className={`text-sm font-black uppercase tracking-widest flex items-center space-x-2 ${diaryDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          <History size={16} />
          <span>Últimos Registos</span>
        </h3>
        {diary.map(entry => (
          <div key={entry.id} className={`${diaryDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'} p-6 rounded-[2rem] shadow-lg border`}>
             <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${diaryDarkMode ? 'text-indigo-400' : 'text-indigo-400'}`}>{entry.date}</span>
                <span className={`${diaryDarkMode ? 'bg-rose-950/50 text-rose-400' : 'bg-rose-50 text-rose-600'} text-[10px] font-black px-2 py-0.5 rounded`}>TREMOR {entry.tremorLevel}</span>
             </div>
             <p className={`text-sm font-medium italic ${diaryDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{entry.notes}"</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Treino</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gerado pela sua IA</p>
        </div>
        <button onClick={loadDailyAI} className="p-3 bg-white rounded-2xl shadow-lg text-indigo-600 tap-vibrate">
          <Zap size={20} fill="currentColor" />
        </button>
      </div>

      {/* Segmented Control for Exercise Tabs */}
      <div className="bg-slate-200/50 p-1 rounded-[1.5rem] flex items-center mx-2">
        <button 
          onClick={() => setExerciseTab('daily')}
          className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${exerciseTab === 'daily' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
        >
          Diário
        </button>
        <button 
          onClick={() => setExerciseTab('physio')}
          className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${exerciseTab === 'physio' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
        >
          Fisio
        </button>
        <button 
          onClick={() => setExerciseTab('favorites')}
          className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${exerciseTab === 'favorites' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
        >
          Favoritos
        </button>
      </div>

      {(loadingAI || loadingPhysio) && (
        <div className="flex flex-col items-center py-20 text-indigo-400">
          <Loader2 className="animate-spin mb-4" size={48} strokeWidth={3} />
          <p className="text-sm font-black uppercase tracking-widest text-center">A preparar os exercícios perfeitos...</p>
        </div>
      )}

      <div className="space-y-6">
        {exerciseTab === 'daily' && !loadingAI && (
          <>
            {aiPlan?.physicalExercises.map((ex, idx) => {
              const isVisible = visibleItemsCount >= idx + 2;
              const isDone = completedExercises.has(idx);
              const isFav = isFavorite(ex.title);
              const color = idx % 2 === 0 ? 'green' : 'amber';
              
              if (!isVisible) return null;
              
              return (
                <InteractiveCard
                  key={idx}
                  title={ex.title}
                  subtitle={ex.target}
                  duration={ex.duration}
                  icon={Activity}
                  color={isDone ? 'indigo' : color}
                  onClick={() => toggleExerciseComplete(idx)}
                  className={`animate-fadeIn ${isDone ? 'bg-slate-50 border-l-emerald-500 opacity-60 shadow-none grayscale-[0.5]' : ''}`}
                  action={
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => toggleFavorite(e, ex)}
                        className={`p-3 rounded-2xl transition-all tap-vibrate ${isFav ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-300'}`}
                      >
                        <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <div className={`p-3 rounded-2xl transition-all ${isDone ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-50 text-slate-200'}`}>
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  }
                >
                  {ex.description}
                </InteractiveCard>
              );
            })}

            {visibleItemsCount >= (aiPlan?.physicalExercises.length || 0) + 2 && (
              <InteractiveCard
                title="Desafio Mental"
                icon={BrainCircuit}
                color="purple"
                subtitle="Cérebro Ativo"
                className="animate-fadeIn shadow-2xl"
              >
                <div className="bg-purple-50 p-6 rounded-[2rem] border-2 border-dashed border-purple-200 mb-6">
                  <p className="text-xl font-black text-purple-900 text-center leading-tight">
                    {aiPlan?.mentalExercise.question}
                  </p>
                </div>
                <details className="group">
                  <summary className="list-none w-full bg-white border-2 border-purple-100 py-4 rounded-2xl text-purple-600 font-black text-center tap-vibrate cursor-pointer flex items-center justify-center space-x-2">
                    <span>Ver Resposta</span>
                    <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-4 p-6 bg-indigo-900 text-white rounded-[2rem] text-center font-black text-lg animate-fadeIn">
                    {aiPlan?.mentalExercise.answer}
                  </div>
                </details>
              </InteractiveCard>
            )}
          </>
        )}

        {exerciseTab === 'physio' && !loadingPhysio && (
          <div className="animate-fadeIn">
            <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white mb-8 shadow-xl shadow-indigo-100">
               <div className="flex items-center space-x-3 mb-2">
                  <Accessibility size={24} />
                  <h3 className="font-black text-lg">Plano de Fisioterapia</h3>
               </div>
               <p className="text-xs font-bold text-indigo-100 leading-relaxed">
                  Focado em mobilidade, postura e alongamentos específicos para combater a rigidez.
               </p>
            </div>
            {physioPlan.map((ex, idx) => {
              const isDone = completedPhysio.has(idx);
              const isFav = isFavorite(ex.title);
              
              return (
                <InteractiveCard
                  key={idx}
                  title={ex.title}
                  subtitle={ex.target}
                  duration={ex.duration}
                  icon={Stethoscope}
                  color={isDone ? 'indigo' : 'purple'}
                  onClick={() => togglePhysioComplete(idx)}
                  className={isDone ? 'bg-slate-50 border-l-emerald-500 opacity-60 shadow-none' : ''}
                  action={
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => toggleFavorite(e, ex)}
                        className={`p-3 rounded-2xl transition-all tap-vibrate ${isFav ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-300'}`}
                      >
                        <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <div className={`p-3 rounded-2xl transition-all ${isDone ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-50 text-slate-200'}`}>
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  }
                >
                  {ex.description}
                </InteractiveCard>
              );
            })}
          </div>
        )}

        {exerciseTab === 'favorites' && (
          <div className="space-y-4 px-2">
            {favorites.length === 0 ? (
              <div className="py-20 text-center text-slate-400 space-y-4">
                <Heart size={48} strokeWidth={1} className="mx-auto opacity-30" />
                <p className="font-bold text-sm">Ainda não guardou nenhum exercício.</p>
                <button 
                  onClick={() => setExerciseTab('daily')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200"
                >
                  Explorar exercícios
                </button>
              </div>
            ) : (
              favorites.map((ex, idx) => (
                <InteractiveCard
                  key={idx}
                  title={ex.title}
                  subtitle={ex.target}
                  duration={ex.duration}
                  icon={Activity}
                  color="indigo"
                  action={
                    <button 
                      onClick={(e) => toggleFavorite(e, ex)}
                      className="p-3 rounded-2xl bg-rose-100 text-rose-600 tap-vibrate"
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>
                  }
                >
                  {ex.description}
                </InteractiveCard>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderApoio = () => (
    <div className="space-y-8 animate-fadeIn pb-10">
      <h2 className="text-3xl font-black text-slate-800 px-2">Apoio</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 flex items-center justify-between tap-vibrate">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <Users size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-lg leading-tight">{contact.name}</h4>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{contact.relation}</p>
              </div>
            </div>
            <a href={`tel:${contact.phone}`} className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100/50 tap-vibrate">
              <Phone size={24} fill="currentColor" />
            </a>
          </div>
        ))}
      </div>

      <div className="bg-rose-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-rose-200 relative overflow-hidden tap-vibrate">
        <AlertCircle className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <AlertCircle size={40} strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-black mb-2">Emergência</h3>
          <p className="text-rose-100 text-sm font-bold mb-8 leading-tight">
            Toque abaixo para ligar imediatamente para o 112.
          </p>
          <a 
            href="tel:112"
            className="block w-full bg-white text-rose-600 py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-rose-50 transition-all active:scale-95"
          >
            LIGAR 112
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-md mx-auto min-h-screen flex flex-col relative pb-24 overflow-x-hidden selection:bg-indigo-100 transition-colors duration-500 ${currentView === View.DIARY && diaryDarkMode ? 'bg-black' : 'bg-[#f0f4f8]'}`}>
      {/* Dynamic Header */}
      <header className={`px-8 pt-10 pb-6 glass flex justify-between items-center sticky top-0 z-50 rounded-b-[2rem] shadow-sm transition-colors duration-500 ${currentView === View.DIARY && diaryDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/70 border-white'}`}>
        <div onClick={() => setCurrentView(View.DASHBOARD)} className="cursor-pointer tap-vibrate">
          <h1 className={`text-2xl font-black tracking-tighter flex items-center ${currentView === View.DIARY && diaryDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            <Zap className={`mr-1 ${currentView === View.DIARY && diaryDarkMode ? 'fill-indigo-400' : 'fill-indigo-600'}`} size={24} />
            ParkinVibe
          </h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ml-1 ${currentView === View.DIARY && diaryDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Daily Companion</p>
        </div>
        <div onClick={() => setCurrentView(View.CONTACTS)} className={`w-12 h-12 rounded-2xl p-0.5 shadow-md ring-2 cursor-pointer overflow-hidden tap-vibrate border-2 ${currentView === View.DIARY && diaryDarkMode ? 'bg-slate-800 ring-slate-700 border-slate-700' : 'bg-white ring-white border-indigo-50'}`}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=parkin&backgroundColor=b6e3f4`} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Context */}
      <main className="flex-1 px-6 pt-6">
        {currentView === View.DASHBOARD && renderDashboard()}
        {currentView === View.EXERCISES && renderExercises()}
        {currentView === View.MEDICATION && renderMedication()}
        {currentView === View.DIARY && renderDiary()}
        {currentView === View.REPORTS && (
          <div className="space-y-6 animate-fadeIn pb-10">
            <h2 className="text-3xl font-black text-slate-800 px-2">Dados</h2>
            <InteractiveCard title="Verificador de IA" icon={Stethoscope} color="rose" subtitle="Sintomas">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 leading-tight">Como se sente fisicamente hoje? A IA analisará a gravidade.</p>
                <textarea 
                  value={symptomInput} 
                  onChange={(e) => setSymptomInput(e.target.value)} 
                  placeholder="Ex: Sinto os meus dedos mais presos..." 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all font-medium" 
                  rows={3} 
                />
                <button 
                  onClick={handleSymptomAnalysis} 
                  disabled={checkingSymptoms || !symptomInput.trim()} 
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black shadow-lg tap-vibrate flex items-center justify-center space-x-2"
                >
                  {checkingSymptoms ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                  <span>ANALISAR AGORA</span>
                </button>
                {symptomResult && (
                  <div className={`mt-4 p-5 rounded-[1.5rem] border-l-4 animate-fadeIn ${
                    symptomResult.level === 'ESTÁVEL' ? 'bg-emerald-50 border-l-emerald-500 text-emerald-800' :
                    symptomResult.level === 'OBSERVAR' ? 'bg-amber-50 border-l-amber-500 text-amber-800' :
                    'bg-rose-50 border-l-rose-500 text-rose-800'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck size={18} />
                      <span className="font-black text-xs uppercase tracking-widest">{symptomResult.level}</span>
                    </div>
                    <p className="text-sm font-bold leading-tight">{symptomResult.advice}</p>
                  </div>
                )}
              </div>
            </InteractiveCard>
            <InteractiveCard title="Gráfico de Evolução" icon={History} color="indigo" subtitle="Tremores">
              <div className="pt-2"><TremorChart data={diary} /></div>
            </InteractiveCard>
          </div>
        )}
        {currentView === View.CONTACTS && renderApoio()}
      </main>

      {/* Floating Navigation Bar */}
      <nav className={`fixed bottom-6 left-6 right-6 max-w-md mx-auto glass rounded-[2.5rem] px-4 py-3 flex justify-between items-center z-50 shadow-2xl transition-colors duration-500 ${currentView === View.DIARY && diaryDarkMode ? 'bg-slate-900/90 border-slate-800 shadow-indigo-950/20' : 'bg-white/95 border-white shadow-indigo-200/50'}`}>
        <NavItem icon={LayoutDashboard} label="Home" active={currentView === View.DASHBOARD} onClick={() => setCurrentView(View.DASHBOARD)} darkMode={currentView === View.DIARY && diaryDarkMode} />
        <NavItem icon={Activity} label="Treino" active={currentView === View.EXERCISES} onClick={() => setCurrentView(View.EXERCISES)} darkMode={currentView === View.DIARY && diaryDarkMode} />
        <NavItem icon={Pill} label="Meds" active={currentView === View.MEDICATION} onClick={() => setCurrentView(View.MEDICATION)} darkMode={currentView === View.DIARY && diaryDarkMode} />
        <NavItem icon={BookOpen} label="Diário" active={currentView === View.DIARY} onClick={() => setCurrentView(View.DIARY)} darkMode={currentView === View.DIARY && diaryDarkMode} />
        <NavItem icon={BarChart3} label="Dados" active={currentView === View.REPORTS} onClick={() => setCurrentView(View.REPORTS)} darkMode={currentView === View.DIARY && diaryDarkMode} />
        <NavItem icon={Users} label="Apoio" active={currentView === View.CONTACTS} onClick={() => setCurrentView(View.CONTACTS)} darkMode={currentView === View.DIARY && diaryDarkMode} />
      </nav>
    </div>
  );
};

export default App;
