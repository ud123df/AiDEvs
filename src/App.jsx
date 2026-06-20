import { useState, useEffect, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #f5f0e8;
    --acid: #c8f53c;
    --ember: #ff4d1c;
    --steel: #1e1e2e;
    --muted: #6b6b7b;
    --border: rgba(245,240,232,0.12);
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-display);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom Cursor */
  .cursor {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--acid);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
  }
  .cursor.big {
    width: 44px; height: 44px;
    background: rgba(200,245,60,0.25);
  }

  /* Noise Overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9998;
    opacity: 0.5;
  }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 3rem;
    background: rgba(10,10,10,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
    color: var(--white);
    cursor: pointer;
  }
  .nav-logo span { color: var(--acid); }

  .nav-links {
    display: flex;
    gap: 0.5rem;
    list-style: none;
  }

  .nav-links li button {
    background: none;
    border: none;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: color 0.2s;
    border-radius: 2px;
  }
  .nav-links li button:hover,
  .nav-links li button.active {
    color: var(--acid);
  }

  .nav-cta {
    background: var(--acid) !important;
    color: var(--black) !important;
    font-weight: 700 !important;
    padding: 0.5rem 1.2rem !important;
    border-radius: 2px !important;
  }
  .nav-cta:hover { background: var(--white) !important; }

  /* PAGES */
  .page { min-height: 100vh; padding-top: 80px; }

  /* HOME */
  .hero {
    min-height: calc(100vh - 80px);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    position: relative;
    overflow: hidden;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rem 3rem 6rem 4rem;
    position: relative;
    z-index: 2;
  }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--acid);
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .hero-tag::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--acid);
  }

  .hero-h1 {
    font-size: clamp(3rem, 7vw, 6.5rem);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.04em;
    margin-bottom: 2rem;
  }
  .hero-h1 em {
    font-style: normal;
    color: var(--acid);
    display: block;
  }

  .hero-desc {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    line-height: 1.8;
    color: var(--muted);
    max-width: 420px;
    margin-bottom: 3rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .btn-primary {
    background: var(--acid);
    color: var(--black);
    border: none;
    padding: 1rem 2.2rem;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-primary:hover {
    background: var(--white);
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: none;
    color: var(--white);
    border: 1px solid var(--border);
    padding: 1rem 2.2rem;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-ghost:hover {
    border-color: var(--acid);
    color: var(--acid);
  }

  .hero-right {
    position: relative;
    overflow: hidden;
    background: var(--steel);
  }

  .hero-visual {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: pulse 6s ease-in-out infinite;
  }
  .orb-1 { width: 400px; height: 400px; background: rgba(200,245,60,0.15); top: 10%; left: 10%; }
  .orb-2 { width: 300px; height: 300px; background: rgba(255,77,28,0.1); bottom: 10%; right: 10%; animation-delay: -3s; }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.5;
  }

  .hero-badge {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .hero-badge-ring {
    width: 260px; height: 260px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: spin 20s linear infinite;
  }

  .hero-badge-inner {
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(200,245,60,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 20s linear infinite reverse;
    background: radial-gradient(circle, rgba(200,245,60,0.05) 0%, transparent 70%);
  }

  .hero-badge-center {
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: -0.03em;
    animation: spin 20s linear infinite;
  }
  .hero-badge-center span { color: var(--acid); }

  .hero-dot {
    position: absolute;
    width: 10px; height: 10px;
    background: var(--acid);
    border-radius: 50%;
    top: -5px; left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 20px var(--acid);
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse {
    0%, 100% { transform: scale(1) translate(0,0); opacity: 0.8; }
    50% { transform: scale(1.1) translate(10px, -10px); opacity: 1; }
  }

  .stats-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .stat-item {
    padding: 2.5rem 2rem;
    border-right: 1px solid var(--border);
    transition: background 0.3s;
  }
  .stat-item:last-child { border-right: none; }
  .stat-item:hover { background: rgba(200,245,60,0.03); }

  .stat-num {
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--acid);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* MARQUEE */
  .marquee-wrap {
    padding: 1.5rem 0;
    background: var(--acid);
    overflow: hidden;
    white-space: nowrap;
  }

  .marquee-track {
    display: inline-flex;
    gap: 3rem;
    animation: marquee 25s linear infinite;
  }

  .marquee-item {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--black);
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .marquee-item::after {
    content: '✦';
    opacity: 0.5;
  }

  @keyframes marquee { to { transform: translateX(-50%); } }

  /* SECTION COMMONS */
  .section {
    padding: 8rem 4rem;
  }

  .section-tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--acid);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .section-tag::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--acid);
  }

  .section-title {
    font-size: clamp(2.4rem, 4.5vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 1.5rem;
  }
  .section-title em {
    font-style: normal;
    color: var(--acid);
  }

  /* WORK PAGE */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1px;
    border: 1px solid var(--border);
    background: var(--border);
    margin-top: 4rem;
  }

  .service-card {
    background: var(--black);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: background 0.3s;
  }
  .service-card:hover { background: var(--steel); }
  .service-card:hover .service-arrow { transform: translate(4px, -4px); color: var(--acid); }

  .service-num {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--muted);
    margin-bottom: 2rem;
    letter-spacing: 0.1em;
  }

  .service-icon {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  .service-title {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .service-desc {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.8;
    color: var(--muted);
    margin-bottom: 2rem;
  }

  .service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .service-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    padding: 0.25rem 0.65rem;
    border: 1px solid var(--border);
    color: var(--muted);
    text-transform: uppercase;
  }

  .service-arrow {
    font-size: 1.2rem;
    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
    transition: all 0.2s;
    color: var(--muted);
  }

  .service-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: var(--acid);
    transition: width 0.4s ease;
  }
  .service-card:hover .service-bar { width: 100%; }

  /* PROCESS */
  .process-section {
    padding: 6rem 4rem;
    background: var(--steel);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .process-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    margin-top: 4rem;
    border: 1px solid var(--border);
  }

  .process-step {
    padding: 2.5rem;
    border-right: 1px solid var(--border);
    position: relative;
  }
  .process-step:last-child { border-right: none; }

  .process-step-num {
    font-family: var(--font-mono);
    font-size: 3rem;
    font-weight: 700;
    color: rgba(200,245,60,0.15);
    line-height: 1;
    margin-bottom: 1.5rem;
  }

  .process-step-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .process-step-desc {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.7;
    color: var(--muted);
  }

  /* CONTACT PAGE */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
  }

  .contact-info h2 {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 1.5rem;
  }
  .contact-info h2 em { font-style: normal; color: var(--acid); }

  .contact-info p {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--muted);
    margin-bottom: 3rem;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact-detail {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.2rem;
    border: 1px solid var(--border);
    transition: border-color 0.2s, background 0.2s;
  }
  .contact-detail:hover {
    border-color: rgba(200,245,60,0.3);
    background: rgba(200,245,60,0.03);
  }

  .contact-detail-icon {
    font-size: 1.2rem;
    margin-top: 2px;
  }

  .contact-detail-text {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.7;
  }
  .contact-detail-text strong { color: var(--white); display: block; margin-bottom: 0.2rem; }

  /* MAP */
  .map-container {
    margin-top: 2rem;
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
  }
  .map-container iframe { display: block; }

  /* FORM */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.6rem;
  }

  .form-input, .form-textarea {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    color: var(--white);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    padding: 0.9rem 1.1rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
    border-radius: 0;
  }
  .form-input:focus, .form-textarea:focus {
    border-color: rgba(200,245,60,0.5);
    background: rgba(200,245,60,0.03);
  }
  .form-input::placeholder, .form-textarea::placeholder {
    color: var(--muted);
  }

  .form-textarea { resize: vertical; min-height: 140px; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-status {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--acid);
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* FUTURE PAGE */
  .future-hero {
    padding: 6rem 4rem 4rem;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  .future-hero h1 {
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.9;
    margin-bottom: 2rem;
  }
  .future-hero h1 em { font-style: normal; color: var(--acid); }

  .future-hero p {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.9;
    color: var(--muted);
    max-width: 600px;
    margin: 0 auto;
  }

  .timeline {
    padding: 4rem;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 4rem;
    top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 3rem;
    padding: 3rem 0;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .timeline-item:last-child { border-bottom: none; }

  .timeline-year {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--acid);
    padding-top: 4px;
    position: relative;
  }
  .timeline-year::before {
    content: '';
    position: absolute;
    left: -2.5rem;
    top: 8px;
    width: 8px; height: 8px;
    background: var(--acid);
    border-radius: 50%;
    box-shadow: 0 0 12px var(--acid);
  }

  .timeline-content h3 {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .timeline-content p {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.8;
    color: var(--muted);
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin: 4rem;
  }

  .value-card {
    background: var(--black);
    padding: 3rem 2.5rem;
    transition: background 0.3s;
  }
  .value-card:hover { background: var(--steel); }

  .value-card-icon {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  .value-card h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .value-card p {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.8;
    color: var(--muted);
  }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 3rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--steel);
  }

  .footer-logo {
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
  }
  .footer-logo span { color: var(--acid); }

  .footer-text {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--muted);
  }

  /* MOBILE HAMBURGER */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .hamburger span {
    display: block;
    width: 22px; height: 2px;
    background: var(--white);
    transition: all 0.2s;
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; flex-direction: column; position: fixed; top: 64px; left: 0; right: 0; background: rgba(10,10,10,0.97); backdrop-filter: blur(20px); padding: 1.5rem; border-bottom: 1px solid var(--border); }
    .nav-links.open { display: flex; }
    .hamburger { display: flex; }
    .hero { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .hero-left { padding: 3rem 1.5rem; }
    .stats-strip { grid-template-columns: repeat(2, 1fr); }
    .section { padding: 4rem 1.5rem; }
    .services-grid { grid-template-columns: 1fr; }
    .process-steps { grid-template-columns: 1fr 1fr; }
    .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
    .form-row { grid-template-columns: 1fr; }
    .timeline { padding: 2rem 1.5rem 2rem 3rem; }
    .timeline::before { left: 1.5rem; }
    .timeline-item { grid-template-columns: 1fr; gap: 0.5rem; padding: 2rem 0; }
    .timeline-year::before { left: -2rem; }
    .values-grid { grid-template-columns: 1fr; margin: 2rem 1.5rem; }
    footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  }

  @media (max-width: 480px) {
    .stats-strip { grid-template-columns: 1fr 1fr; }
    .process-steps { grid-template-columns: 1fr; }
    .future-hero { padding: 3rem 1.5rem 2rem; }
  }

  /* FADE ANIM */
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: none;
  }
`;

const services = [
  {
    icon: "🤖",
    title: "AI Agent Development",
    desc: "Autonomous agents that plan, reason, and act—tailored to your business workflows and objectives.",
    tags: ["LangChain", "AutoGen", "OpenAI", "Anthropic"],
  },
  {
    icon: "🧠",
    title: "ML Engineering",
    desc: "End-to-end machine learning pipelines: data ingestion, model training, evaluation, and production deployment.",
    tags: ["PyTorch", "TensorFlow", "MLflow", "Kubernetes"],
  },
  {
    icon: "🔗",
    title: "RAG Systems",
    desc: "Retrieval-Augmented Generation architectures that ground LLMs in your proprietary knowledge bases.",
    tags: ["Pinecone", "Weaviate", "LlamaIndex", "pgvector"],
  },
  {
    icon: "⚡",
    title: "LLM Fine-Tuning",
    desc: "Domain-specific fine-tuning and RLHF alignment for open-source and proprietary models.",
    tags: ["LoRA", "QLoRA", "PEFT", "vLLM"],
  },
  {
    icon: "🌐",
    title: "AI API Integration",
    desc: "Seamlessly embed AI capabilities into existing products through clean, scalable API layers.",
    tags: ["REST", "GraphQL", "FastAPI", "gRPC"],
  },
  {
    icon: "📊",
    title: "Data Intelligence",
    desc: "Transform raw data into actionable insight with intelligent analytics and real-time dashboards.",
    tags: ["Spark", "dbt", "Airflow", "Snowflake"],
  },
];

const timeline = [
  {
    year: "2025 — NOW",
    title: "Foundation & Dominance",
    desc: "Building the world's most capable AI development studio. Establishing partnerships, proving value, and shipping products that matter.",
  },
  {
    year: "2026 — Q1",
    title: "Autonomous Systems Lab",
    desc: "Launch our proprietary research division focused on multi-agent coordination and emergent AI behavior in production environments.",
  },
  {
    year: "2027",
    title: "AiDEvS Intelligence Platform",
    desc: "A unified platform for enterprises to deploy, monitor, and evolve AI systems—our own stack, our own infrastructure.",
  },
  {
    year: "2028",
    title: "Global AI Infrastructure",
    desc: "Partner with governments and institutions to deploy ethical, sovereign AI systems across critical infrastructure.",
  },
  {
    year: "2030+",
    title: "Human-AI Co-evolution",
    desc: "Pioneer frameworks for meaningful human-AI collaboration—not replacement, but augmentation at civilizational scale.",
  },
];

const values = [
  {
    icon: "🎯",
    title: "Precision Over Hype",
    desc: "We don't chase trends. We build with purpose, shipping only what genuinely moves the needle.",
  },
  {
    icon: "🔬",
    title: "Research-Driven",
    desc: "Every solution is grounded in rigorous methodology. We read the papers, then we build beyond them.",
  },
  {
    icon: "🛡️",
    title: "Ethical by Design",
    desc: "Safety and transparency aren't compliance checkboxes—they are core architectural principles.",
  },
  {
    icon: "🚀",
    title: "Speed with Depth",
    desc: "We move fast without sacrificing quality. Iterative delivery, not shortcuts.",
  },
  {
    icon: "🤝",
    title: "True Partnership",
    desc: "We embed with your team, understand your domain, and build as if it were our own product.",
  },
  {
    icon: "♾️",
    title: "Long-term Thinking",
    desc: "We optimize for durable systems, not quick wins. Our clients grow; so do we.",
  },
];

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, style }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in" style={style}>{children}</div>;
}

function HomePage({ setPage }) {
  return (
    <div>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">AI-Powered Development Studio</div>
          <h1 className="hero-h1">
            Build the<br />
            <em>Intelligent</em><br />
            Future
          </h1>
          <p className="hero-desc">
            AiDEvS engineers AI agents, ML systems, and intelligent infrastructure for companies that refuse to be left behind.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("work")}>
              See Our Work →
            </button>
            <button className="btn-ghost" onClick={() => setPage("contact")}>
              Get in Touch
            </button>
          </div>
        </div>
        <div className="hero-right">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="grid-pattern" />
          <div className="hero-visual">
            <div className="hero-badge">
              <div className="hero-badge-ring">
                <div className="hero-badge-inner">
                  <div className="hero-badge-center">
                    Ai<span>DEvS</span>
                  </div>
                </div>
                <div className="hero-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-strip">
        {[
          { num: "50+", label: "AI Systems Shipped" },
          { num: "98%", label: "Client Retention" },
          { num: "12x", label: "Avg. ROI Delivered" },
          { num: "24/7", label: "Monitoring & Support" },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) =>
            ["AI Agents", "ML Engineering", "LLM Fine-Tuning", "RAG Systems", "Data Intelligence", "API Integration", "Computer Vision", "NLP", "Reinforcement Learning", "AI Infrastructure"].map((t, j) => (
              <span className="marquee-item" key={`${i}-${j}`}>{t}</span>
            ))
          )}
        </div>
      </div>

      <section className="section">
        <FadeIn>
          <div className="section-tag">Why AiDEvS</div>
          <h2 className="section-title">
            Not consultants.<br /><em>Builders.</em>
          </h2>
        </FadeIn>
        <FadeIn style={{ marginTop: "3rem", maxWidth: "700px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: "1.9", color: "var(--muted)" }}>
            We don't write decks about AI strategy. We write code. AiDEvS is a specialised engineering studio that embeds directly into your product and ships intelligent systems that create measurable impact—from autonomous agents to production ML pipelines.
          </p>
        </FadeIn>
        <FadeIn style={{ marginTop: "2rem" }}>
          <button className="btn-primary" onClick={() => setPage("work")}>Explore Our Services →</button>
        </FadeIn>
      </section>
    </div>
  );
}

function WorkPage() {
  return (
    <div>
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <FadeIn>
          <div className="section-tag">Our Services</div>
          <h1 className="section-title">
            What We <em>Build</em>
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: "1.8", color: "var(--muted)", maxWidth: "560px", marginTop: "1rem" }}>
            End-to-end AI engineering—from prototype to production. Every engagement is a full-stack build.
          </p>
        </FadeIn>
        <div className="services-grid">
          {services.map((s, i) => (
            <FadeIn key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="service-card">
                <div className="service-num">0{i + 1}</div>
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <div className="service-tags">
                  {s.tags.map((t, j) => <span className="service-tag" key={j}>{t}</span>)}
                </div>
                <span className="service-arrow">↗</span>
                <div className="service-bar" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="process-section">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <FadeIn>
            <div className="section-tag">How We Work</div>
            <h2 className="section-title">Our <em>Process</em></h2>
          </FadeIn>
          <div className="process-steps">
            {[
              { n: "01", t: "Discovery", d: "Deep-dive into your domain, data, and desired outcomes." },
              { n: "02", t: "Architecture", d: "Design a robust, scalable AI system blueprint." },
              { n: "03", t: "Build & Iterate", d: "Rapid sprints with continuous feedback and deployment." },
              { n: "04", t: "Ship & Scale", d: "Production deployment with monitoring and ongoing support." },
            ].map((p, i) => (
              <FadeIn key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="process-step">
                  <div className="process-step-num">{p.n}</div>
                  <h3 className="process-step-title">{p.t}</h3>
                  <p className="process-step-desc">{p.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // const submit = (e) => {
  //   e.preventDefault();
  //   setSent(true);
  //   setTimeout(() => setSent(false), 4000);
  //   setForm({ name: "", email: "", phone: "", message: "" });
  // };

  const sendEmail = async (e) => {

  e.preventDefault();

  try {

    await emailjs.send(

      "service_xi2ds6c",

      "template_r0xbqmc",

      {
        name: form.name,
        email: form.email,
        message: form.message,
      },

      "c9AWEN_9o9OS7OPc-"
    );

    alert("Message sent successfully!");

  } catch (error) {

    console.log(error);

    alert("Failed to send message");
  }
};

  return (
    <section className="section">
      <div className="contact-grid">
        <FadeIn>
          <div className="contact-info">
            <div className="section-tag">Contact</div>
            <h2>Let's Build<br /><em>Together</em></h2>
            <p>Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back within 24 hours.</p>
            <div className="contact-details">
              {[
                { icon: "📍", label: "Location", val: "Chandigarh, Punjab\nIndia 560001" },
                { icon: "📧", label: "Email", val: "udit.sharma2312@gmail.com" },
                { icon: "📞", label: "Phone", val: "+91 7876854973" },
                { icon: "🕐", label: "Hours", val: "Mon – Fri, 9 AM – 7 PM IST" },
              ].map((d, i) => (
                <div className="contact-detail" key={i}>
                  <span className="contact-detail-icon">{d.icon}</span>
                  <div className="contact-detail-text">
                    <strong>{d.label}</strong>{d.val}
                  </div>
                </div>
              ))}
            </div>
            <div className="map-container" style={{ marginTop: "2rem" }}>
              <iframe
                title="AiDEvS Location"
                width="100%"
                height="220"
                frameBorder="0"
                style={{ border: 0, filter: "invert(0.85) hue-rotate(180deg) saturate(0.4)" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539082!2d77.4908526456244!3d12.954517292949485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1697000000000!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn style={{ transitionDelay: "0.15s" }}>
          <div>
            <div className="section-tag">Send a Message</div>
            <form onSubmit={sendEmail}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handle} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-textarea" name="message" placeholder="Tell us about your project, goals, and timeline..." value={form.message} onChange={handle} required />
              </div>
              <button className="btn-primary" type="submit" style={{ width: "100%", justifyContent: "center", display: "block" }}>
                Send Message →
              </button>
              {sent && (
                <div className="form-status">
                  ✓ Message sent! We'll be in touch within 24 hours.
                </div>
              )}
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FuturePage() {
  return (
    <div>
      <div className="future-hero">
        <FadeIn>
          <div className="section-tag" style={{ justifyContent: "center" }}>Future Ideology</div>
          <h1>
            Intelligence<br />
            <em>Amplified</em>
          </h1>
        </FadeIn>
        <FadeIn style={{ marginTop: "1.5rem", transitionDelay: "0.1s" }}>
          <p>
            We believe AI is not a product category—it is the operating system of the next civilisation. AiDEvS exists to ensure that operating system is built with rigour, ethics, and audacious ambition.
          </p>
        </FadeIn>
      </div>

      <div className="values-grid">
        {values.map((v, i) => (
          <FadeIn key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="value-card">
              <span className="value-card-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="section" style={{ paddingTop: "2rem" }}>
        <FadeIn>
          <div className="section-tag">The Roadmap</div>
          <h2 className="section-title">Where We're <em>Going</em></h2>
        </FadeIn>
      </div>

      <div className="timeline">
        {timeline.map((t, i) => (
          <FadeIn key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="timeline-item">
              <div className="timeline-year">{t.year}</div>
              <div className="timeline-content">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <section className="section" style={{ textAlign: "center", paddingTop: "2rem" }}>
        <FadeIn>
          <h2 className="section-title" style={{ maxWidth: "700px", margin: "0 auto 2rem" }}>
            Ready to be part of the <em>future</em>?
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
            Join the companies building intelligent systems that last.
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
function PromptLabPage() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authMode, setAuthMode] = useState("login");

  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
});

  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://prompt-engineer-agent-4.onrender.com";

  const registerUser = async () => {

  try {

    await axios.post(
      `${API}/register`,
      authData
    );

    alert("Registration successful");

    setAuthMode("login");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.detail ||
      "Registration failed"
    );
  }
};

  const loginUser = async () => {

  try {

    const response = await axios.post(
      `${API}/login`,
      {
        email: authData.email,
        password: authData.password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    setIsAuthenticated(true);

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.detail ||
      "Invalid credentials"
    );
  }
};

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (token && token !== "undefined") {

    setIsAuthenticated(true);

  } else {

    setIsAuthenticated(false);
  }

}, []);

  const generatePrompt = async () => {

    if (!task) return;

    setLoading(true);

    try {

      const response = await axios.post(
        `${API}/generate`,
        {
          task: task
        }
      );

      setResult(response.data.result);

    } catch (error) {

      console.log(error);

      setResult("Error generating prompt.");

    } finally {

      setLoading(false);
    }
  };

  const optimizePrompt = async () => {

    if (!task) return;

    setLoading(true);

    try {

      const response = await axios.post(
        `${API}/optimize`,
        {
          task: task
        }
      );

      setResult(response.data.optimized_prompt);

    } catch (error) {

      console.log(error);

      setResult("Error optimizing prompt.");

    } finally {

      setLoading(false);
    }
  };

  const evaluatePrompt = async () => {

    if (!task) return;

    setLoading(true);

    try {

      const response = await axios.post(
        `${API}/evaluate`,
        {
          task: task
        }
      );

      setResult(response.data.evaluation);

    } catch (error) {

      console.log(error);

      setResult("Error evaluating prompt.");

    } finally {

      setLoading(false);
    }
  };

  if (!isAuthenticated) {

  return (

    <section className="section">

      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >

        <FadeIn>

          <div className="section-tag">
            Prompt Lab Access
          </div>

          <h1
            className="section-title"
            style={{ marginBottom: "1rem" }}
          >
            {
              authMode === "login"
                ? <>Welcome <em>Back</em></>
                : <>Create <em>Account</em></>
            }
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              lineHeight: "1.8",
              marginBottom: "3rem",
            }}
          >
            Access the AiDEvS Prompt Engineering Lab and build production-grade AI prompts.
          </p>

        </FadeIn>

        <FadeIn style={{ transitionDelay: "0.1s" }}>

          <div
            style={{
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)",
              padding: "2rem",
              backdropFilter: "blur(20px)",
            }}
          >

            <div className="form-group">

              {
                authMode === "register" && (

                  <>
                    <label className="form-label">
                      Username
                    </label>

                    <input
                      className="form-input"
                      placeholder="Your username"
                      value={authData.username}
                      onChange={(e) =>
                        setAuthData({
                          ...authData,
                          username: e.target.value
                        })
                      }
                    />
                  </>
                )
              }

            </div>

            <div className="form-group">

              <label className="form-label">
                Email
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={authData.email}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    email: e.target.value
                  })
                }
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Password
              </label>

              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    password: e.target.value
                  })
                }
              />

            </div>

            <button
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onClick={
                authMode === "login"
                  ? loginUser
                  : registerUser
              }
            >
              {
                authMode === "login"
                  ? "Login →"
                  : "Create Account →"
              }
            </button>

            <button
              className="btn-ghost"
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onClick={() =>
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {
                authMode === "login"
                  ? "Create new account"
                  : "Already have an account?"
              }
            </button>

          </div>

        </FadeIn>

      </div>

    </section>
  );
}
  

  return (

    <section className="section">

      <FadeIn>

        <div className="section-tag">
          AI Prompt Engineering
        </div>

        <h1 className="section-title">
          Prompt <em>Lab</em>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--muted)",
            maxWidth: "700px",
            lineHeight: "1.8",
            marginTop: "1rem"
          }}
        >
          Generate, optimize, and evaluate production-grade AI prompts using our multi-agent prompt engineering system.
        </p>

      </FadeIn>

      <FadeIn style={{ marginTop: "3rem" }}>

        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Describe your AI task..."
          style={{
            width: "100%",
            minHeight: "220px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            color: "white",
            padding: "1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            outline: "none",
            resize: "vertical"
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "1.5rem"
          }}
        >

          <button
            className="btn-primary"
            onClick={generatePrompt}
          >
            Generate Prompt
          </button>

          <button
            className="btn-ghost"
            onClick={optimizePrompt}
          >
            Optimize Prompt
          </button>

          <button
            className="btn-ghost"
            onClick={evaluatePrompt}
          >
            Evaluate Prompt
          </button>

        </div>

      </FadeIn>

      <FadeIn style={{ marginTop: "3rem" }}>

        <div
          style={{
            border: "1px solid var(--border)",
            padding: "2rem",
            background: "rgba(255,255,255,0.02)",
            minHeight: "300px"
          }}
        >

          <div
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--acid)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.1em"
            }}
          >
            AI Output
          </div>

          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.8",
              color: "var(--white)",
              fontFamily: "var(--font-mono)"
            }}
          >
            {loading
              ? "Generating..."
              : result || "Your AI-generated output will appear here."}
          </div>

        </div>

      </FadeIn>

    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorBig, setCursorBig] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    const enter = () => setCursorBig(true);
    const leave = () => setCursorBig(false);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("button, a, input, textarea").forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => window.removeEventListener("mousemove", move);
  }, [page]);

  const navigate = (p) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { key: "home", label: "Home" },
    { key: "work", label: "Work" },
    { key: "promptlab", label: "Prompt Lab"},
    { key: "future", label: "Future" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <>
      <style>{styles}</style>

      <div
        className={`cursor ${cursorBig ? "big" : ""}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      <nav>
        <div className="nav-logo" onClick={() => navigate("home")}>
          Ai<span>DEvS</span>
        </div>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((n) => (
            <li key={n.key}>
              <button
                className={page === n.key ? "active" : ""}
                onClick={() => navigate(n.key)}
              >
                {n.label}
              </button>
            </li>
          ))}
          <li>
            <button className="nav-cta" onClick={() => navigate("contact")}>
              Start a Project
            </button>
          </li>
        </ul>
        <button
        className="btn-ghost"
        onClick={() => {

          localStorage.removeItem("token");

          localStorage.removeItem("user");

          setIsAuthenticated(false);

          setPage("home");
        }}
        >
        Logout
        </button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      <main className="page">
        {page === "home" && <HomePage setPage={navigate} />}
        {page === "work" && <WorkPage />}
        {page === "contact" && <ContactPage />}
        {page === "future" && <FuturePage />}
        {page === "promptlab" && <PromptLabPage />}
      </main>

      <footer>
        <div className="footer-logo">Ai<span>DEvS</span></div>
        <div className="footer-text">© 2025 AiDEvS. All rights reserved. Built with intelligence.</div>
        <div className="footer-text" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
          {navItems.map((n, i) => (
            <span key={n.key}>
              <span
                style={{ cursor: "pointer", color: "var(--muted)", transition: "color 0.2s" }}
                onClick={() => navigate(n.key)}
                onMouseEnter={e => e.target.style.color = "var(--acid)"}
                onMouseLeave={e => e.target.style.color = "var(--muted)"}
              >
                {n.label}
              </span>
              {i < navItems.length - 1 && " · "}
            </span>
          ))}
        </div>
      </footer>
    </>
  );
}
