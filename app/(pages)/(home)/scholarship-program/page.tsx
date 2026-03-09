"use client";

import { useState, useRef } from "react";
import { createScholarshipApplication } from "@/app/_actions/scholarship";

const questions = [
    {
        id: "names_age",
        number: "01",
        label: "Tell us your names and age",
        fields: [
            { name: "full_names", placeholder: "Full names", type: "text" },
            { name: "age", placeholder: "Age", type: "number" },
        ],
    },
    {
        id: "struggle",
        number: "02",
        label: "What is your biggest struggle?",
        fields: [{ name: "biggest_struggle", placeholder: "Share your story honestly...", type: "textarea" }],
    },
    {
        id: "why",
        number: "03",
        label: "Why should we choose you?",
        fields: [{ name: "why_choose_you", placeholder: "Make your case — be real, be bold...", type: "textarea" }],
    },
    {
        id: "commit",
        number: "04",
        label: "Are you 100% ready to commit?",
        fields: [{ name: "ready_to_commit", placeholder: "Tell us what commitment means to you...", type: "textarea" }],
    },
    {
        id: "contact",
        number: "05",
        label: "Leave us your contact numbers",
        sublabel: "WhatsApp & direct calls",
        fields: [
            { name: "whatsapp_number", placeholder: "WhatsApp number", type: "tel" },
            { name: "call_number", placeholder: "Direct call number", type: "tel" },
        ],
    },
    {
        id: "location",
        number: "06",
        label: "Where do you stay?",
        fields: [{ name: "location", placeholder: "Your area / neighbourhood", type: "text" }],
    },
];

export default function ScholarshipFormPage() {
    const [step, setStep] = useState(0);
    const [values, setValues] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    const current = questions[step];
    const progress = ((step) / questions.length) * 100;

    const handleChange = (name: string, value: string) => {
        setValues((v) => ({ ...v, [name]: value }));
    };

    const currentFieldsFilled = current.fields.every(
        (f) => values[f.name]?.trim().length > 0
    );

    const handleNext = () => {
        if (step < questions.length - 1) setStep((s) => s + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        const formData = new FormData();
        Object.entries(values).forEach(([k, v]) => formData.append(k, v));
        const result = await createScholarshipApplication(formData);
        setSubmitting(false);
        if (result?.error) {
            setError(result.error);
        } else {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center px-6">
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+NeueBebas+NeuePlayfair+Display:wght@700family=Plus+Jakarta+Sans:wght@300;400;500;600;900family=Plus+Jakarta+Sans:wght@300;400;500&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
          * { box-sizing: border-box; }
          body { background: #0b0c10; }
          .glow { text-shadow: 0 0 40px rgba(224,32,32,0.4); }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.8s ease forwards; }
        `}</style>
                <div className="text-center fade-up">
                    <div className="text-6xl mb-6">🌙</div>
                    <h1 className="text-4xl font-bold text-[#e02020] glow mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        Application Received
                    </h1>
                    <p className="text-[#8a8a9a] text-lg max-w-md mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Thank you, <span className="text-white font-medium">{values.full_names}</span>. We've received your application and will be in touch soon.
                    </p>
                    <div className="mt-10 inline-block h-px w-24 bg-[#e02020] opacity-40" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0c10] flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+NeuePlayfair+Display:ital,wght@0,700;0,900;1,700family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .red { color: #e02020; }
        .red-border { border-color: #e02020; }

        .form-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          padding: 14px 18px;
          width: 100%;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          resize: none;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .form-input:focus {
          border-color: #e02020;
          background: rgba(224,32,32,0.06);
        }

        .btn-primary {
          background: #e02020;
          color: #0b0c10;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          padding: 14px 32px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

        .btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 14px 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        .progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #e02020, #ff4444);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.4s ease forwards; }

        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>

            <div className="noise-overlay" />

            {/* Header */}
            <header className="relative z-10 px-8 pt-8 pb-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                        <p className="text-white font-semibold text-sm leading-none">New Moon Gym Plus</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Scholarship Programme</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[#e02020] text-xs font-medium uppercase tracking-widest">
                        {step + 1} <span className="text-white/20">/ {questions.length}</span>
                    </p>
                </div>
            </header>

            {/* Progress */}
            <div className="progress-bar relative z-10">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Main */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-xl">

                    {/* Question header */}
                    <div key={step} className="slide-in mb-10">
                        <p className="text-[#e02020] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                            Question {current.number}
                        </p>
                        <h2
                            className="text-3xl md:text-4xl font-bold text-white leading-tight mb-1"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            {current.label}
                        </h2>
                        {current.sublabel && (
                            <p className="text-white/35 text-sm mt-2">{current.sublabel}</p>
                        )}
                    </div>

                    {/* Fields */}
                    <div key={`fields-${step}`} className="slide-in space-y-4">
                        {current.fields.map((field) =>
                            field.type === "textarea" ? (
                                <textarea
                                    key={field.name}
                                    className="form-input"
                                    rows={5}
                                    placeholder={field.placeholder}
                                    value={values[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                />
                            ) : (
                                <input
                                    key={field.name}
                                    type={field.type}
                                    className="form-input"
                                    placeholder={field.placeholder}
                                    value={values[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && currentFieldsFilled && step < questions.length - 1) handleNext();
                                    }}
                                />
                            )
                        )}
                    </div>

                    {/* Error */}
                    {error && step === questions.length - 1 && (
                        <p className="mt-4 text-red-400 text-sm">{error}</p>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center gap-3 mt-8">
                        {step > 0 && (
                            <button className="btn-ghost" onClick={handleBack}>← Back</button>
                        )}
                        {step < questions.length - 1 ? (
                            <button
                                className="btn-primary"
                                onClick={handleNext}
                                disabled={!currentFieldsFilled}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={!currentFieldsFilled || submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Application"}
                            </button>
                        )}
                    </div>

                    {/* Step dots */}
                    <div className="flex gap-2 mt-10">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className="h-1 rounded-full transition-all duration-300"
                                style={{
                                    width: i === step ? "24px" : "8px",
                                    background: i <= step ? "#e02020" : "rgba(255,255,255,0.1)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-8 py-5 border-t border-white/5 text-center">
                <p className="text-white/20 text-xs">Full Body Transformation Scholarship · New Moon Gym Plus</p>
            </footer>
        </div>
    );
}