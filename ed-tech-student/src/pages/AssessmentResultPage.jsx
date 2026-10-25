import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Trophy, Clock, Target } from 'lucide-react';

export function AssessmentResultPage() {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && assessmentId) {
      loadResult();
    }
  }, [user, assessmentId]);

  async function loadResult() {
    try {
      // 1. Fetch submission
      const { data: subData, error: subErr } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .eq('student_id', user.id)
        .single();

      if (subErr || !subData) {
        // Not submitted yet
        navigate(`/assessments/${assessmentId}`);
        return;
      }
      setSubmission(subData);

      // 2. Fetch assessment details
      const { data: aData, error: aErr } = await supabase
        .from('assessments')
        .select('title, total_marks')
        .eq('id', assessmentId)
        .single();

      if (aErr) throw aErr;
      setAssessment(aData);

      // 3. Fetch questions
      const { data: qData, error: qErr } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('id', { ascending: true });

      if (qErr) throw qErr;
      setQuestions(qData || []);

    } catch (err) {
      console.error(err);
      alert("Error loading results: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
  }

  const scorePct = Math.round((submission.score / assessment.total_marks) * 100) || 0;
  const isPassed = scorePct >= 60;

  // Calculate exact correct/wrong based on the stored answers JSON if it exists
  const studentAnswers = submission.answers || {};
  let correctCount = 0;
  let wrongCount = 0;

  questions.forEach(q => {
    if (studentAnswers[q.id] === q.correct_option) correctCount++;
    else wrongCount++;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-8 pt-20">

        <Link to="/assessments" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} /> Back to Assessments
        </Link>

        {/* HERO RESULT CARD */}
        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

          <h1 className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-slate-800 mb-2">{assessment.title}</h1>
          <p className="text-slate-500 font-medium mb-8">Exam Results</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * scorePct / 100)} className={isPassed ? 'text-emerald-500' : 'text-red-500'} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-800">
                  {scorePct}%
                </div>
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {isPassed ? 'Passed' : 'Failed'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Trophy size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Score</span>
                </div>
                <div className="text-xl font-bold text-slate-700">{submission.score} / {assessment.total_marks}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Time</span>
                </div>
                <div className="text-xl font-bold text-slate-700">{submission.time_taken_minutes || 0} min</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <CheckCircle2 size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Correct</span>
                </div>
                <div className="text-xl font-bold text-emerald-700">{correctCount}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <XCircle size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Wrong</span>
                </div>
                <div className="text-xl font-bold text-red-700">{wrongCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED QUESTION BREAKDOWN */}
        <div className="space-y-6">
          <h2 className="text-xl font-black font-['Plus_Jakarta_Sans'] text-slate-800 flex items-center gap-2">
            <Target className="text-indigo-600" /> Answer Review
          </h2>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const studentAnswer = studentAnswers[q.id];
              const isCorrect = studentAnswer === q.correct_option;
              const isUnanswered = studentAnswer === undefined || studentAnswer === null;

              return (
                <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 pt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {idx + 1}</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-1">{q.question_text}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(optNum => {
                          const optText = q[`option_${optNum}`];
                          if (!optText) return null;

                          const isStudentChoice = studentAnswer === optNum;
                          const isActualCorrect = q.correct_option === optNum;

                          let style = "p-3 rounded-xl border-2 text-sm font-semibold flex items-center gap-3 ";

                          if (isActualCorrect) {
                            style += "bg-emerald-50 border-emerald-500 text-emerald-800";
                          } else if (isStudentChoice && !isCorrect) {
                            style += "bg-red-50 border-red-500 text-red-800";
                          } else {
                            style += "bg-slate-50 border-slate-100 text-slate-500";
                          }

                          return (
                            <div key={optNum} className={style}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isActualCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : isStudentChoice ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300'}`}>
                                {String.fromCharCode(64 + optNum)}
                              </div>
                              {optText}
                              {isStudentChoice && <span className="ml-auto text-[10px] uppercase tracking-widest font-black opacity-70">Your Answer</span>}
                            </div>
                          );
                        })}
                      </div>

                      {isUnanswered && (
                        <div className="mt-2 text-sm font-bold text-amber-600 bg-amber-50 p-3 rounded-xl">
                          You did not answer this question.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
<button
  onClick={() => navigate('/dashboard')}
  className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
>
  Return to Dashboard
</button>
      </div >

    </div >
  );
}
