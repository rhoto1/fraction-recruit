"use client";

import { useState, FormEvent, useRef } from "react";

const BEHAVIORAL_QUESTIONS = [
  "I often explore technical problems beyond the scope of my assigned work, driven purely by curiosity.",
  "I engage most productively when there is clear external recognition or reward attached to the outcome.",
  "I feel uncomfortable closing a ticket if I suspect the underlying problem has not been fully resolved.",
  "Once I have completed my assigned tasks, I consider my responsibility for a feature to be fulfilled.",
  "Critical code reviews from peers are among the most valuable parts of my professional development.",
  "I find it difficult to stay engaged when my technical approach is regularly questioned by others.",
  "When a project I invested significant effort in is cancelled or pivoted, I adapt quickly without lingering frustration.",
  "Extended periods of repetitive or maintenance-focused work significantly reduce my motivation.",
  "I will raise concerns about technical risk even when the broader team is aligned on shipping quickly.",
  "In practice, I typically defer to business timelines when there is tension between speed and technical rigour.",
  "I am comfortable openly acknowledging mistakes or knowledge gaps in front of my team.",
  "I feel confident challenging a technical decision made by a more senior colleague when I have strong evidence to the contrary.",
  "I escalate risks or blockers early, even when doing so draws attention to difficulties I am facing.",
  "I actively seek feedback on my work from peers, even when it is not formally required.",
  "I feel a genuine connection to the broader impact of the product I am building, beyond my individual contributions.",
];

const LIKERT_OPTIONS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const TECH_SKILLS = [
  { name: "TypeScript", desc: "Production-level experience" },
  { name: "JavaScript & Node.js", desc: "v10+" },
  { name: "Angular", desc: "Frontend framework experience" },
  { name: "Python", desc: "Backend services / ML-adjacent work" },
  { name: "SQL", desc: "Schema design, queries, optimisation" },
  { name: "MongoDB", desc: "Document database, v3.6+" },
  { name: "Redis", desc: "In-memory data structures, caching" },
  { name: "Socket.io", desc: "Real-time websocket communication" },
  { name: "Nginx", desc: "Reverse proxy, load balancing" },
  { name: "PM2", desc: "Process management" },
  { name: "GraphicsMagick / FFMPEG", desc: "Media processing" },
  { name: "MCP Servers", desc: "Desirable" },
  { name: "ML / Data-driven features", desc: "Desirable" },
];

export default function Home() {
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate all behavioral questions answered
    for (let i = 1; i <= BEHAVIORAL_QUESTIONS.length; i++) {
      if (!formData.get(`q${i}`)) {
        setFormState("error");
        setErrorMsg(`Please answer behavioral question ${i}.`);
        return;
      }
    }

    // Build behavioral answers summary for email
    let behavioralSummary = "BEHAVIORAL ASSESSMENT RESPONSES:\n\n";
    for (let i = 0; i < BEHAVIORAL_QUESTIONS.length; i++) {
      const answer = formData.get(`q${i + 1}`);
      behavioralSummary += `Q${i + 1}: ${BEHAVIORAL_QUESTIONS[i]}\nAnswer: ${answer}\n\n`;
    }
    formData.append("Behavioral Assessment", behavioralSummary);

    // Remove individual q fields from formData to keep email clean
    for (let i = 1; i <= BEHAVIORAL_QUESTIONS.length; i++) {
      formData.delete(`q${i}`);
    }

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormState("success");
        form.reset();
      } else {
        setFormState("error");
        setErrorMsg(result.message || "Submission failed. Please try again.");
      }
    } catch {
      setFormState("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#001F54] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="https://fraction-solutions.com" target="_blank" rel="noopener noreferrer">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Fraction</span>
              <span className="text-[#00a3ff]">Solutions</span>
            </span>
          </a>
          <a
            href="#apply"
            className="bg-[#00a3ff] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#0090e0] transition-colors"
          >
            Apply Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#001F54] to-[#0A1128] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-[#00a3ff]/10 border border-[#00a3ff]/30 rounded-full px-4 py-1.5 text-[#00a3ff] text-sm font-medium mb-6">
            Part-Time &middot; Remote &middot; Long-Term
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Senior Full-Stack Developer
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Join Fraction Solutions to build an enterprise-grade learning
            resource platform for IB students. Work with the top 1% of African
            talent empowering businesses across Europe.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-lg px-5 py-3">
              <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">
                Commitment
              </span>
              <span className="text-white font-semibold">30 hours / month</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-5 py-3">
              <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">
                Compensation
              </span>
              <span className="text-white font-semibold">$300 – $450 USD</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-5 py-3">
              <span className="text-white/50 block text-xs uppercase tracking-wider mb-1">
                Duration
              </span>
              <span className="text-white font-semibold">Long-term</span>
            </div>
          </div>
        </div>
      </section>

      {/* About the Role */}
      <section className="bg-[#0A1128] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            About the Role
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-[#00a3ff] font-semibold text-lg mb-3">
                Platform Assessment & Architecture
              </h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>Review and assess the current codebase and system design</li>
                <li>Evaluate scalability, maintainability, and security</li>
                <li>Identify technical debt and architectural constraints</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-[#00a3ff] font-semibold text-lg mb-3">
                Re-architecture & Modernisation
              </h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>Transition platform from PoC to enterprise-grade</li>
                <li>Improve system robustness, performance, and extensibility</li>
                <li>Establish clearer patterns and engineering standards</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-[#00a3ff] font-semibold text-lg mb-3">
                Feature Development
              </h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>Design and build new features for student learning outcomes</li>
                <li>Improve data flows for grading, feedback, and analytics</li>
                <li>Make the platform a go-to resource for IB students</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-[#00a3ff] font-semibold text-lg mb-3">
                ML & Data Collaboration
              </h3>
              <ul className="text-white/70 space-y-2 text-sm">
                <li>Work alongside ML-driven grading and prediction components</li>
                <li>Contribute to ML-related features and infrastructure</li>
                <li>Baseline understanding of ML systems expected</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Requirements */}
      <section className="bg-[#001F54]/40 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Technical Skills
          </h2>
          <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">
            We&apos;re looking for developers who have experience with or can
            quickly adapt to the following technologies.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TECH_SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#00a3ff]/40 transition-colors"
              >
                <div className="text-white font-semibold text-sm mb-1">
                  {skill.name}
                </div>
                <div className="text-white/50 text-xs">{skill.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soft Skills */}
      <section className="bg-[#0A1128] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            What We Value
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Self-Starter",
                desc: "Operate with autonomy and ownership",
              },
              {
                title: "Strong Self-Learner",
                desc: "Navigate evolving requirements and tech",
              },
              {
                title: "Clear Communicator",
                desc: "Proactive, transparent, comfortable with trade-offs",
              },
              {
                title: "Quality-Focused",
                desc: "Aligned with high standards and client expectations",
              },
              {
                title: "Collaborative",
                desc: "Work closely with engineers and stakeholders",
              },
              {
                title: "Resilient",
                desc: "Deliver consistently despite part-time constraints",
              },
            ].map((item) => (
              <div key={item.title} className="text-left bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-[#00a3ff] font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-[#0A1128] py-16 sm:py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Apply Now
          </h2>
          <p className="text-white/60 text-center mb-10">
            Fill out the form below. All fields marked with * are required.
          </p>

          {formState === "success" ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="text-green-400 text-5xl mb-4">&#10003;</div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Application Submitted!
              </h3>
              <p className="text-white/70">
                Thank you for your interest. We&apos;ll review your application
                and get back to you soon.
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="mt-6 text-[#00a3ff] hover:underline text-sm"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Form submission handled by /api/apply */}

              {/* Personal Information */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4 w-full">
                  Personal Information
                </legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="Full Name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="Email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="+263 77 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="Location"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="Harare, Zimbabwe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Timezone *
                    </label>
                    <input
                      type="text"
                      name="Timezone"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="CAT (UTC+2)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="LinkedIn"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </fieldset>

              {/* Portfolio Links */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4 w-full">
                  Portfolio & Links
                </legend>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="GitHub"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="Portfolio Website"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors"
                    placeholder="https://myportfolio.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Other Links
                  </label>
                  <textarea
                    name="Other Links"
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00a3ff] transition-colors resize-none"
                    placeholder="Any other relevant links (e.g., Dribbble, Stack Overflow, personal projects)"
                  />
                </div>
              </fieldset>

              {/* CV Upload */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4 w-full">
                  CV / Resume *
                </legend>
                <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#00a3ff]/40 transition-colors">
                  <input
                    type="file"
                    name="CV"
                    required
                    accept=".pdf,.doc,.docx"
                    className="w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00a3ff] file:text-white hover:file:bg-[#0090e0] file:cursor-pointer"
                  />
                  <p className="text-white/40 text-xs mt-2">
                    Accepted formats: PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>
              </fieldset>

              {/* Behavioral Assessment */}
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4 w-full">
                  Behavioral Assessment *
                </legend>
                <p className="text-white/50 text-sm -mt-2 mb-4">
                  Rate each statement on a scale from Strongly Disagree to
                  Strongly Agree. Answer honestly — there are no right or wrong
                  answers.
                </p>
                {BEHAVIORAL_QUESTIONS.map((question, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-xl p-5"
                  >
                    <p className="text-white/90 text-sm mb-4">
                      <span className="text-[#00a3ff] font-semibold mr-2">
                        {idx + 1}.
                      </span>
                      {question}
                    </p>
                    <div className="likert-group">
                      {LIKERT_OPTIONS.map((option) => (
                        <label key={option} className="likert-option">
                          <input
                            type="radio"
                            name={`q${idx + 1}`}
                            value={option}
                            required
                          />
                          <span className="likert-label">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </fieldset>

              {/* Error Message */}
              {formState === "error" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full bg-[#00a3ff] text-white py-3.5 rounded-full font-semibold text-lg hover:bg-[#0090e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === "submitting"
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
                <p className="text-white/40 text-xs text-center mt-3">
                  By submitting, you consent to Fraction Solutions processing
                  your application data.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001F54] border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">Fraction</span>
            <span className="text-[#00a3ff]">Solutions</span>
          </span>
          <p className="text-white/40 text-sm mt-2">
            We work with the top 1% of African talent to empower your business.
          </p>
          <p className="text-white/30 text-xs mt-4">
            &copy; {new Date().getFullYear()} Fraction Solutions. London, United
            Kingdom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
