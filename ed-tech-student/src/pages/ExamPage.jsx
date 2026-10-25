import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2, Timer, Flag, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ExamPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: selected_option_number }
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (user && assessmentId) {
      loadAssessment();
    }
  }, [user, assessmentId]);

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examStarted, timeLeft]);

  async function loadAssessment() {
    setLoading(true);
    try {
      // 1. Check if already submitted
      const { data: subData } = await supabase
        .from('assessment_submissions')
        .select('id')
        .eq('assessment_id', assessmentId)
        .eq('student_id', user.id);
        
      if (subData && subData.length > 0) {
        navigate(`/assessments/${assessmentId}/result`);
        return;
      }

      // 2. Load Assessment Details
      const { data: aData, error: aErr } = await supabase
        .from('assessments')
        .select('id, title, duration_minutes, total_marks')
        .eq('id', assessmentId)
        .eq('is_published', true)
        .single();
        
      if (aErr || !aData) throw new Error("Assessment not found or not published.");
      
      setAssessment(aData);
      setTimeLeft(aData.duration_minutes * 60);

      // 3. Load Questions
      const { data: qData, error: qErr } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('id', { ascending: true });
        
      if (qErr) throw qErr;
      setQuestions(qData || []);

    } catch (err) {
      alert(err.message);
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  }

  const startExam = () => {
    setExamStarted(true);
  };

  const handleSelectOption = (qId, optionNum) => {
    setAnswers({ ...answers, [qId]: optionNum });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) {
        correct++;
      }
    });
    // Assuming each question is equally weighted, total_marks is calculated from correct ratio
    const score = Math.round((correct / questions.length) * assessment.total_marks);
    return score;
  };

  const autoSubmit = async () => {
    await submitExam();
  };

  const handleManualSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      if (!window.confirm(`You have only answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    await submitExam();
  };

  const submitExam = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    
    try {
      const score = calculateScore();
      const timeTakenSecs = (assessment.duration_minutes * 60) - timeLeft;
      const timeTakenMins = Math.round(timeTakenSecs / 60);
      
      const { error } = await supabase.from('assessment_submissions').insert({
        assessment_id: assessmentId,
        student_id: user.id,
        score: score,
        time_taken_minutes: timeTakenMins,
        submitted_at: new Date().toISOString(),
        answers: answers
      });

      if (error) throw error;
      navigate(`/assessments/${assessmentId}/result`);
    } catch (err) {
      alert("Submission failed: " + err.message);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-['Inter']">
        <div className="bg-white rounded-[2rem] p-12 max-w-lg w-full text-center shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">quiz</span>
          </div>
          <h1 className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-slate-800 mb-2">{assessment.title}</h1>
          <p className="text-slate-500 font-medium mb-8">Ready to begin your assessment?</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="material-symbols-outlined text-slate-400 mb-1">timer</span>
              <div className="text-xl font-bold text-slate-700">{assessment.duration_minutes}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minutes</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="material-symbols-outlined text-slate-400 mb-1">format_list_numbered</span>
              <div className="text-xl font-bold text-slate-700">{questions.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</div>
            </div>
          </div>
          
          <button 
            onClick={startExam}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full shadow-lg shadow-violet-500/30 transition-all active:scale-95 text-lg"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const progressPct = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Inter']">
      
      {/* Top Header & Timer */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-800 tracking-tight">{assessment.title}</h1>
          </div>
        </div>
        
        {/* Central Timer */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-50 px-6 py-2.5 rounded-full shadow-sm border border-slate-200/50">
          <Timer className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-600"} size={20} />
          <span className={`font-mono text-xl font-bold tabular-nums ${timeLeft < 60 ? "text-red-600" : "text-slate-800"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={handleManualSubmit} disabled={submitting} className="bg-violet-600 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:shadow-violet-200 active:scale-95 transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Rail: Question Navigator */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="bg-slate-50 rounded-xl p-6 sticky top-32 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isActive = idx === currentQIndex;
                
                let baseStyle = "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105 ";
                if (isActive) {
                  baseStyle += "bg-violet-600 text-white ring-4 ring-violet-200 shadow-md";
                } else if (isAnswered) {
                  baseStyle += "bg-indigo-100 text-indigo-700 border border-indigo-200";
                } else {
                  baseStyle += "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100";
                }

                return (
                  <div key={q.id} onClick={() => setCurrentQIndex(idx)} className={baseStyle}>
                    {idx + 1}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                <span>OVERALL PROGRESS</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 shadow-[0_0_8px_rgba(109,40,217,0.4)] transition-all duration-300" style={{ width: `${progressPct}%`}}></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Question Content Area */}
        <section className="md:col-span-9 space-y-8">
          <div className="bg-white rounded-2xl p-10 shadow-[0_20px_40px_rgba(71,70,85,0.06)] relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 left-0 w-2 h-full bg-violet-600"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">QUESTION {currentQIndex + 1}</span>
            </div>
            
            <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-800 mb-8 leading-tight">
              {currentQ.question_text}
            </h2>
            
            {/* Answer Selection */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map(optNum => {
                const optText = currentQ[`option_${optNum}`];
                if (!optText) return null;
                
                const isSelected = answers[currentQ.id] === optNum;
                const letter = String.fromCharCode(64 + optNum); // A, B, C, D
                
                return (
                  <label key={optNum} className="group block relative cursor-pointer">
                    <input 
                      type="radio" 
                      name={`question_${currentQ.id}`} 
                      className="hidden peer"
                      checked={isSelected}
                      onChange={() => handleSelectOption(currentQ.id, optNum)}
                    />
                    <div className="flex items-center p-5 rounded-xl border border-slate-200 transition-all peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:ring-1 peer-checked:ring-indigo-500 hover:bg-slate-50">
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-slate-500 group-hover:border-indigo-400'}`}>
                        {letter}
                      </span>
                      <span className="ml-4 text-lg font-medium text-slate-700">{optText}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          {/* Footer Navigation */}
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ArrowLeft size={20} /> Previous
            </button>
            
            <div className="flex gap-4">
              {currentQIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-10 py-4 bg-violet-600 text-white rounded-full font-extrabold shadow-xl hover:shadow-violet-500/30 active:scale-95 transition-all"
                >
                  Next Question <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleManualSubmit}
                  className="flex items-center gap-2 px-10 py-4 bg-emerald-500 text-white rounded-full font-extrabold shadow-xl hover:shadow-emerald-500/30 active:scale-95 transition-all"
                >
                  Finish Exam <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
