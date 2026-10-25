import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyCertificate } from "../lib/sharedMockData";

export function CertificateVerify() {
  const { code } = useParams();
  const [inputCode, setInputCode] = useState(code || "");
  const [searched, setSearched] = useState(false);
  const [cert, setCert] = useState(() => (code ? verifyCertificate(code) : null));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    setCert(verifyCertificate(inputCode));
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-12 items-center p-6">
      <div className="text-center mb-10 w-full max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/20 mb-5">
          <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Certificate Verification</h1>
        <p className="text-secondary text-sm">Verify the authenticity of an Atelier Academy digital credential.</p>
      </div>

      <div className="w-full max-w-lg mb-10">
        <form onSubmit={handleSearch} className="flex bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-2 pl-6">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold tracking-wider placeholder:text-slate-400 placeholder:font-normal uppercase"
            placeholder="Enter Verification Code..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          />
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
            Verify
          </button>
        </form>
      </div>

      {(cert || searched) && (
        <div className="w-full max-w-2xl">
          {cert ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/10">
              <div className="bg-emerald-50 px-8 py-6 flex items-center gap-4 border-b border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2">
                    Verified Credential
                  </h3>
                  <p className="text-emerald-700 text-sm">This is an authentic Atelier Academy certificate.</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-outline-variant/10">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Recipient</p>
                    <p className="text-lg font-bold text-on-surface">{cert.student?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Issue Date</p>
                    <p className="text-lg font-bold text-on-surface">{new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="pb-6 border-b border-outline-variant/10">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Program</p>
                  <p className="text-xl font-headline font-bold text-primary">{cert.course?.title}</p>
                  <p className="text-sm text-secondary mt-1">{cert.course?.department} · Batch {cert.batch?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Credential ID</p>
                  <code className="text-sm font-mono font-bold bg-surface-container-low px-3 py-1.5 rounded text-on-surface">{cert.verify_code}</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-3xl shadow-sm border border-red-100 p-8 text-center text-red-800">
              <span className="material-symbols-outlined text-4xl mb-3 text-red-400">error</span>
              <p className="font-bold text-lg">Invalid Code</p>
              <p className="text-sm text-red-700 mt-1">We couldn't find a certificate matching that code.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-16">
        <Link to="/login" className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
