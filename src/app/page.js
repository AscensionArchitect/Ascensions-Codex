1 "use client";
2 import { useState, useEffect } from "react";
3
4 // =====================================================
5 // THE HUB
6 // Homepage at /. Beacons replacement.
7 // Links to /codex (the sanctuary) and external products.
8 // =====================================================
9
10 const PRODUCTS = [
11 {
12 id: 1,
13 title: "If Things Feel Different and You Can't Explain Why",
14 description:
15 "A short, grounded guide for people whose inner world shifted quietly and nothing replaced it yet.",
16 url: "https://ascensionarchitect.gumroad.com/l/nootx",
17 format: "PDF",
18 label: "Start here",
19 },
20 {
21 id: 2,
22 title: "Awareness: The Architecture Of Reality",
23 description: "The book that wrote itself after I died.",
24 url: "https://ascensionarchitect.gumroad.com/l/xssyqq",
25 format: "Book · PDF",
26 label: "The book",
27 },
28 {
29 id: 3,
30 title: "The Post-Awakening Integration Toolkit",
31 description:
32 "A complete 7-pillar system for navigating the aftershocks of awakening, integrating your new identity, and
embodying the shift.",
33 url: "https://ascensionarchitect.gumroad.com/l/fblhz",
34 format: "PDF",
35 label: "The toolkit",
36 },
37 {
38 id: 4,
39 title: "The Doorways",
40 description:
41 "A practitioner's guide to out-of-body experience, astral travel, remote viewing, and the Focus States. The
real map — not the seven-days-to-astral-flight version. Built on Monroe's framework, written from the
practitioner side.",
42 url: "https://ascensionarchitect.gumroad.com/l/bnyqo",
43 format: "PDF · Practitioner's guide",
44 label: "The doorways",
45 },
46 {
47 id: 5,
48 title: "13 Moon Calendar & Synchronicity Tracker 2026–2027",
49 description:
50 "221-page premium PDF system for living in natural time. Complete 13 Moon Calendar (2026–2027).",
51 url: "https://ascensionarchitect.gumroad.com/l/xiuhbg",
52 format: "PDF · 221 pages",
53 label: "The calendar",
54 },
55 {
56 id: 6,
57 title: "The 13:20 Activation Guide",
58 description:
59 "The 7-day protocol I used to shift from chaos to synchronicity after my 2019 near-death experience.",
60 url: "https://ascensionarchitect.gumroad.com/l/qkzksa",
Hub.jsx  ·  Page 2
61 format: "PDF · 7-day protocol",
62 label: "The protocol",
63 },
64 {
65 id: 7,
66 title: "God Talks, You Forgot How To Listen — The 7 Languages of Divine Communication",
67 description:
68 "A 13-page guide teaching you to recognize the seven languages God uses to communicate every day — through
synchronicities, intuition, dreams, people, nature, body sensations, and divine downloads. Stop navigating
life blind. Start hearing the conversation that never stopped.",
69 url: "https://ascensionarchitect.gumroad.com/l/zdbrm",
70 format: "PDF · 13 pages",
71 label: "The languages",
72 },
73 ];
74
75 const SOCIALS = [
76 {
77 name: "Instagram",
78 handle: "@ascension_architect",
79 url: "https://www.instagram.com/ascension_architect",
80 icon: "IG",
81 },
82 {
83 name: "TikTok",
84 handle: "@the.ascension.arc",
85 url: "https://www.tiktok.com/@the.ascension.arc",
86 icon: "TT",
87 },
88 {
89 name: "YouTube",
90 handle: "@theascensionarchitect",
91 url: "https://youtube.com/@theascensionarchitect",
92 icon: "YT",
93 },
94 {
95 name: "Facebook",
96 handle: "Ascension Architect",
97 url: "https://www.facebook.com/profile.php?id=61581511754283",
98 icon: "FB",
99 },
100 ];
101
102 const DISCORD_INVITE = "5qZf8V8ms";
103 const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE}`;
104 const BMC_URL = "https://buymeacoffee.com/contactascw";
105 const CONTACT_EMAIL = "Contact.ascensionarchitect@gmail.com";
106
107 // =====================================================
108 // SUB-COMPONENTS
109 // =====================================================
110
111 function Starfield() {
112 const [stars] = useState(() =>
113 Array.from({ length: 60 }, () => ({
114 x: Math.random() * 100,
115 y: Math.random() * 100,
116 size: Math.random() * 1.4 + 0.3,
117 delay: Math.random() * 5,
118 duration: 4 + Math.random() * 5,
119 }))
120 );
121
122 return (
123 <div
124 style={{
125 position: "fixed",
126 inset: 0,
127 pointerEvents: "none",
128 zIndex: 0,
129 }}
130 >
131 {stars.map((s, i) => (
132 <div
133 key={i}
134 style={{
135 position: "absolute",
136 left: `${s.x}%`,
137 top: `${s.y}%`,
138 width: s.size,
139 height: s.size,
140 borderRadius: "50%",
141 background: "#d4af37",
142 boxShadow: `0 0 ${s.size * 3}px #d4af37`,
143 animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
144 opacity: 0.5,
145 }}
146 />
147 ))}
148 </div>
149 );
150 }
151
152 function Mandala({ size = 280 }) {
153 const [breath, setBreath] = useState(0);
154 const [rotation, setRotation] = useState(0);
155
156 useEffect(() => {
157 const interval = setInterval(() => {
158 setBreath((b) => (b + 0.01) % (Math.PI * 2));
159 setRotation((r) => (r + 0.04) % 360);
160 }, 50);
161 return () => clearInterval(interval);
162 }, []);
163
164 const scale = 1 + Math.sin(breath) * 0.025;
165 const opacity = 0.55 + Math.sin(breath) * 0.18;
166
167 const cx = size / 2;
168 const cy = size / 2;
169 const radius = size * 0.15;
170
171 const positions = [{ x: cx, y: cy }];
172 for (let i = 0; i < 6; i++) {
173 const angle = (i * Math.PI) / 3;
174 positions.push({
175 x: cx + Math.cos(angle) * radius,
176 y: cy + Math.sin(angle) * radius,
177 });
178 }
179 for (let i = 0; i < 6; i++) {
180 const angle = (i * Math.PI) / 3 + Math.PI / 6;
181 positions.push({
182 x: cx + Math.cos(angle) * radius * 1.732,
183 y: cy + Math.sin(angle) * radius * 1.732,
184 });
185 }
186
187 return (
188 <svg
189 width={size}
190 height={size}
191 viewBox={`0 0 ${size} ${size}`}
192 style={{
193 transform: `scale(${scale})`,
194 transition: "transform 0.05s linear",
195 }}
196 >
197 <defs>
198 <radialGradient id="hubGoldGrad">
199 <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
200 <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
201 </radialGradient>
202 <filter id="hubGlow">
203 <feGaussianBlur stdDeviation="2" result="coloredBlur" />
204 <feMerge>
Hub.jsx  ·  Page 3
205 <feMergeNode in="coloredBlur" />
206 <feMergeNode in="SourceGraphic" />
207 </feMerge>
208 </filter>
209 </defs>
210
211 <g transform={`rotate(${rotation} ${cx} ${cy})`}>
212 <circle
213 cx={cx}
214 cy={cy}
215 r={size * 0.45}
216 fill="none"
217 stroke="#d4af37"
218 strokeWidth="0.3"
219 opacity={opacity * 0.2}
220 strokeDasharray="2 8"
221 />
222 </g>
223
224 <circle
225 cx={cx}
226 cy={cy}
227 r={size * 0.42}
228 fill="none"
229 stroke="#d4af37"
230 strokeWidth="0.5"
231 opacity={opacity * 0.4}
232 />
233
234 <polygon
235 points={Array.from({ length: 12 }, (_, i) => {
236 const angle = (i * Math.PI) / 6 - Math.PI / 2;
237 const r = size * 0.38;
238 return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
239 }).join(" ")}
240 fill="none"
241 stroke="#d4af37"
242 strokeWidth="0.5"
243 opacity={opacity * 0.5}
244 />
245
246 {positions.map((pos, i) => (
247 <circle
248 key={i}
249 cx={pos.x}
250 cy={pos.y}
251 r={radius}
252 fill="none"
253 stroke="#d4af37"
254 strokeWidth="0.7"
255 opacity={opacity * (0.5 + Math.sin(breath + i * 0.5) * 0.2)}
256 filter="url(#hubGlow)"
257 />
258 ))}
259
260 <g transform={`rotate(${rotation * 0.3} ${cx} ${cy})`}>
261 <polygon
262 points={Array.from({ length: 26 }, (_, i) => {
263 const angle = (i * Math.PI) / 13 - Math.PI / 2;
264 const r = i % 2 === 0 ? size * 0.16 : size * 0.08;
265 return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
266 }).join(" ")}
267 fill="url(#hubGoldGrad)"
268 stroke="#d4af37"
269 strokeWidth="0.5"
270 opacity={opacity}
271 />
272 </g>
273
274 <circle
275 cx={cx}
276 cy={cy}
277 r="3"
Hub.jsx  ·  Page 4
278 fill="#d4af37"
279 opacity={opacity}
280 filter="url(#hubGlow)"
281 />
282 </svg>
283 );
284 }
285
286 function RevealText({ text, delay = 0, charDelay = 30 }) {
287 return (
288 <span>
289 {text.split("").map((char, i) => (
290 <span
291 key={i}
292 style={{
293 display: "inline-block",
294 opacity: 0,
295 animation: `letterReveal 0.8s ${
296 delay + i * charDelay
297 }ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
298 whiteSpace: char === " " ? "pre" : "normal",
299 }}
300 >
301 {char}
302 </span>
303 ))}
304 </span>
305 );
306 }
307
308 // =====================================================
309 // MAIN HUB
310 // =====================================================
311
312 export default function Hub() {
313 const [discordOnline, setDiscordOnline] = useState(null);
314
315 useEffect(() => {
316 const fetchDiscord = async () => {
317 try {
318 const res = await fetch(
319 `https://discord.com/api/guilds/widget.json?invite=${DISCORD_INVITE}`,
320 { signal: AbortSignal.timeout(3000) }
321 );
322 if (res.ok) {
323 const data = await res.json();
324 if (data.presence_count !== undefined) {
325 setDiscordOnline(data.presence_count);
326 }
327 }
328 } catch (e) {
329 // Silent fallback
330 }
331 };
332
333 fetchDiscord();
334 const interval = setInterval(fetchDiscord, 60000);
335 return () => clearInterval(interval);
336 }, []);
337
338 return (
339 <div style={styles.app}>
340 <style>{globalStyles}</style>
341 <Starfield />
342 <div style={styles.bgGradient} />
343 <div style={styles.bgNoise} />
344
345 <main style={styles.main}>
346 {/* HERO */}
347 <section style={styles.hero}>
348 <div style={styles.heroMandalaWrap}>
349 <Mandala size={320} />
350 </div>
Hub.jsx  ·  Page 5
351
352 <div style={styles.heroContent}>
353 <div style={styles.brandMark}> </div>
354
355 <div style={styles.heroEyebrow}>
356 <RevealText
357 text="ASCENSION ARCHITECT"
358 delay={400}
359 charDelay={40}
360 />
361 </div>
362
363 <h1 style={styles.heroTitle}>
364 <RevealText
365 text="Awakening the World"
366 delay={1200}
367 charDelay={45}
368 />
369 <br />
370 <span style={styles.heroTitleAccent}>
371 <RevealText
372 text="one Soul at a time."
373 delay={2200}
374 charDelay={45}
375 />
376 </span>
377 </h1>
378
379 <p style={styles.heroBio}>
380 In 2019 I died. When I came back I wasn't the same. Now I spend
381 my time teaching, serving, learning, healing — helping who I
382 can, when I can.
383 <span style={styles.heroBioHeart}> 
384 </p>
385
</span>
386 <a href="/codex" style={styles.heroCTA} className="primaryCTA">
387 <span style={styles.heroCTAText}>Enter The Codex</span>
388 <span style={styles.heroCTAArrow}>→</span>
389 </a>
390 <div style={styles.heroCTASubtitle}>
391 The full experience · sanctuary, calendar, tracker, and more
392 </div>
393 </div>
394 </section>
395
396 {/* DISCORD / SANCTUARY */}
397 <section style={styles.section}>
398 <div style={styles.sectionHeader}>
399 <div style={styles.sectionEyebrow}>THE LIVING COMMUNITY</div>
400 <h2 style={styles.sectionTitle}>The Sanctuary</h2>
401 </div>
402
403 <a
404 href={DISCORD_URL}
405 target="_blank"
406 rel="noopener noreferrer"
407 style={styles.discordCard}
408 className="discordCardBtn"
409 >
410 <div style={styles.discordCardLeft}>
411 <div style={styles.discordIcon}>
412 <svg width="28" height="28" viewBox="0 0 24 24" fill="#d4af37">
413 <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608
1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677
4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993
3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0
1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793
12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0
1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0
6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02
15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0
1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0
2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
Hub.jsx  ·  Page 6
414 </svg>
415 </div>
416 <div>
417 <div style={styles.discordTitle}>The Architects Sanctuary</div>
418 <div style={styles.discordSubtitle}>
419 Voice rooms · daily reflections · live community
420 </div>
421 </div>
422 </div>
423
424 <div style={styles.discordStats}>
425 <div style={styles.discordStat}>
426 <div style={styles.discordStatVal}>
427 Growing
428 </div>
429 <div style={styles.discordStatLabel}>Daily</div>
430 </div>
431 {discordOnline !== null && (
432 <>
433 <div style={styles.discordStatDivider} />
434 <div style={styles.discordStat}>
435 <div style={styles.discordStatLive}>
436 <span style={styles.livePulse} />
437 {discordOnline}
438 </div>
439 <div style={styles.discordStatLabel}>Online</div>
440 </div>
441 </>
442 )}
443 </div>
444 </a>
445 </section>
446
447 {/* PRODUCTS */}
448 <section style={styles.section}>
449 <div style={styles.sectionHeader}>
450 <div style={styles.sectionEyebrow}>THE OFFERINGS</div>
451 <h2 style={styles.sectionTitle}>Free for all who walk the path</h2>
452 <p style={styles.sectionSubtitle}>
453 Pay what you feel called to. Or take freely.
454 </p>
455 </div>
456
457 <div style={styles.productList}>
458 {PRODUCTS.map((product, i) => (
459 <a
460 key={product.id}
461 href={product.url}
462 target="_blank"
463 rel="noopener noreferrer"
464 style={{
465 ...styles.productCard,
466 animationDelay: `${i * 80}ms`,
467 }}
468 className="productCardBtn"
469 >
470 <div style={styles.productCardInner} className="productCardInner">
471 <div style={styles.productNum} className="productNum">
472 {String(i + 1).padStart(2, "0")}
473 </div>
474 <div style={styles.productContent}>
475 <div style={styles.productLabelRow}>
476 <span style={styles.productLabel}>{product.label}</span>
477 <span style={styles.productFormat}>{product.format}</span>
478 </div>
479 <h3 style={styles.productTitle}>{product.title}</h3>
480 <p style={styles.productDesc}>{product.description}</p>
481 </div>
482 <div style={styles.productArrow} className="productArrow">→</div>
483 </div>
484 </a>
485 ))}
486 </div>
Hub.jsx  ·  Page 7
487 </section>
488
489 {/* SOCIALS */}
490 <section style={styles.section}>
491 <div style={styles.sectionHeader}>
492 <div style={styles.sectionEyebrow}>WHERE TO FIND ME</div>
493 <h2 style={styles.sectionTitle}>The signal</h2>
494 </div>
495
496 <div style={styles.socialGrid}>
497 {SOCIALS.map((social) => (
498 <a
499 key={social.name}
500 href={social.url}
501 target="_blank"
502 rel="noopener noreferrer"
503 style={styles.socialCard}
504 className="socialCardBtn"
505 >
506 <div style={styles.socialIcon}>{social.icon}</div>
507 <div style={styles.socialName}>{social.name}</div>
508 <div style={styles.socialHandle}>{social.handle}</div>
509 </a>
510 ))}
511 </div>
512 </section>
513
514 {/* SUPPORT */}
515 <section style={styles.section}>
516 <div style={styles.sectionHeader}>
517 <div style={styles.sectionEyebrow}>IF IT MOVES YOU</div>
518 <h2 style={styles.sectionTitle}>Support the work</h2>
519 <p style={styles.sectionSubtitle}>
520 Everything I make is free. Tips fuel what comes next.
521 </p>
522 </div>
523
524 <a
525 href={BMC_URL}
526 target="_blank"
527 rel="noopener noreferrer"
528 style={styles.supportBtn}
529 className="supportBtnHover"
530 >
531 <span style={styles.supportEmoji}> </span>
532 <span>Buy me a coffee</span>
533 </a>
534 </section>
535
536 {/* FOOTER */}
537 <footer style={styles.footer}>
538 <div style={styles.footerOrnament}> </div>
539 <a href={`mailto:${CONTACT_EMAIL}`} style={styles.footerEmail}>
540 {CONTACT_EMAIL}
541 </a>
542 <div style={styles.footerCopyright}>
543 © {new Date().getFullYear()} Ascension Architect · All rights
544 reserved
545 </div>
546 </footer>
547 </main>
548 </div>
549 );
550 }
551
552 // =====================================================
553 // STYLES
554 // =====================================================
555
556 const globalStyles = `
557 @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;
1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
558
Hub.jsx  ·  Page 8
559 * { box-sizing: border-box; margin: 0; padding: 0; }
560
561 body {
562 background: #0a0908;
563 color: #e8e1d6;
564 font-family: 'Cormorant Garamond', serif;
565 overflow-x: hidden;
566 }
567
568 ::selection { background: #d4af37; color: #0a0908; }
569
570 @keyframes fadeIn {
571 from { opacity: 0; transform: translateY(8px); }
572 to { opacity: 1; transform: translateY(0); }
573 }
574 @keyframes fadeInUp {
575 from { opacity: 0; transform: translateY(16px); }
576 to { opacity: 1; transform: translateY(0); }
577 }
578 @keyframes letterReveal {
579 from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(4px); }
580 to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
581 }
582 @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
583 @keyframes breathePulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
584 @keyframes livePulse {
585 0%, 100% { transform: scale(1); opacity: 1; }
586 50% { transform: scale(1.4); opacity: 0.6; }
587 }
588
589 .primaryCTA {
590 transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
591 text-decoration: none;
592 }
593 .primaryCTA:hover {
594 background: #d4af37 !important;
595 color: #0a0908 !important;
596 transform: translateY(-2px);
597 box-shadow: 0 16px 40px -12px rgba(212, 175, 55, 0.4);
598 letter-spacing: 0.4em !important;
599 }
600 .primaryCTA:hover span:last-child {
601 transform: translateX(8px);
602 }
603
604 .productCardBtn {
605 text-decoration: none;
606 transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
607 animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
608 display: block;
609 }
610 .productCardBtn:hover {
611 border-color: rgba(212, 175, 55, 0.5) !important;
612 background: rgba(212, 175, 55, 0.04) !important;
613 transform: translateY(-2px);
614 box-shadow: 0 12px 32px -16px rgba(212, 175, 55, 0.3);
615 }
616 .productCardBtn:hover .productArrow { transform: translateX(8px); }
617
618 .socialCardBtn {
619 text-decoration: none;
620 transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
621 }
622 .socialCardBtn:hover {
623 border-color: rgba(212, 175, 55, 0.5) !important;
624 background: rgba(212, 175, 55, 0.06) !important;
625 transform: translateY(-2px);
626 }
627
628 .discordCardBtn {
629 text-decoration: none;
630 transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
631 }
Hub.jsx  ·  Page 9
632 .discordCardBtn:hover {
633 border-color: rgba(212, 175, 55, 0.5) !important;
634 background: rgba(212, 175, 55, 0.06) !important;
635 transform: translateY(-2px);
636 box-shadow: 0 16px 40px -16px rgba(212, 175, 55, 0.3);
637 }
638
639 .supportBtnHover {
640 text-decoration: none;
641 transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
642 }
643 .supportBtnHover:hover {
644 background: rgba(212, 175, 55, 0.1) !important;
645 border-color: #d4af37 !important;
646 transform: translateY(-2px);
647 letter-spacing: 0.35em !important;
648 }
649
650 a[href^="mailto:"]:hover { color: #d4af37 !important; }
651
652 ::-webkit-scrollbar { width: 6px; }
653 ::-webkit-scrollbar-track { background: transparent; }
654 ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 3px; }
655 ::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.4); }
656
657 @media (max-width: 700px) {
658 .productCardInner {
659 flex-direction: column !important;
660 align-items: flex-start !important;
661 gap: 16px !important;
662 }
663 .productArrow {
664 align-self: flex-end;
665 margin-top: -32px;
666 }
667 }
668 `;
669
670 const styles = {
671 app: {
672 minHeight: "100vh",
673 background: "#0a0908",
674 color: "#e8e1d6",
675 fontFamily: "'Cormorant Garamond', serif",
676 position: "relative",
677 overflow: "hidden",
678 },
679 bgNoise: {
680 position: "fixed",
681 inset: 0,
682 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200'
height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0
0.83 0 0 0 0 0.69 0 0 0 0 0.22 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25'
filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
683 pointerEvents: "none",
684 opacity: 0.2,
685 mixBlendMode: "overlay",
686 zIndex: 0,
687 },
688 bgGradient: {
689 position: "fixed",
690 inset: 0,
691 background:
692 "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(ellipse at
bottom, rgba(212, 175, 55, 0.025) 0%, transparent 50%)",
693 pointerEvents: "none",
694 zIndex: 0,
695 },
696 main: {
697 position: "relative",
698 zIndex: 1,
699 maxWidth: 760,
700 margin: "0 auto",
Hub.jsx  ·  Page 10
701 padding: "60px 24px 40px",
702 },
703
704 hero: {
705 position: "relative",
706 paddingTop: 40,
707 paddingBottom: 80,
708 textAlign: "center",
709 },
710 heroMandalaWrap: {
711 position: "absolute",
712 top: 80,
713 left: "50%",
714 transform: "translateX(-50%)",
715 opacity: 0.5,
716 zIndex: 0,
717 },
718 heroContent: {
719 position: "relative",
720 zIndex: 2,
721 },
722 brandMark: {
723 fontSize: 28,
724 color: "#d4af37",
725 marginBottom: 28,
726 animation: "fadeIn 1s ease-out",
727 textShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
728 },
729 heroEyebrow: {
730 fontFamily: "'JetBrains Mono', monospace",
731 fontSize: 11,
732 letterSpacing: "0.5em",
733 color: "#d4af37",
734 marginBottom: 32,
735 fontWeight: 400,
736 },
737 heroTitle: {
738 fontSize: "clamp(36px, 7vw, 64px)",
739 fontWeight: 300,
740 fontStyle: "italic",
741 lineHeight: 1.1,
742 color: "#f5e9c8",
743 marginBottom: 32,
744 letterSpacing: "-0.01em",
745 },
746 heroTitleAccent: {
747 color: "#d4af37",
748 },
749 heroBio: {
750 fontSize: 17,
751 lineHeight: 1.7,
752 color: "#c9c0b3",
753 maxWidth: 480,
754 margin: "0 auto 48px",
755 fontStyle: "italic",
756 animation: "fadeIn 1.5s ease-out 3.5s both",
757 },
758 heroBioHeart: {
759 fontStyle: "normal",
760 },
761 heroCTA: {
762 display: "inline-flex",
763 alignItems: "center",
764 gap: 16,
765 background: "transparent",
766 color: "#d4af37",
767 border: "1px solid #d4af37",
768 padding: "18px 40px",
769 fontFamily: "'JetBrains Mono', monospace",
770 fontSize: 12,
771 letterSpacing: "0.3em",
772 textTransform: "uppercase",
773 fontWeight: 500,
Hub.jsx  ·  Page 11
774 cursor: "pointer",
775 animation: "fadeInUp 1s ease-out 4s both",
776 },
777 heroCTAText: {
778 transition: "all 0.4s ease",
779 },
780 heroCTAArrow: {
781 transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
782 fontSize: 14,
783 },
784 heroCTASubtitle: {
785 fontFamily: "'JetBrains Mono', monospace",
786 fontSize: 9,
787 letterSpacing: "0.25em",
788 color: "#7a736a",
789 marginTop: 16,
790 textTransform: "uppercase",
791 animation: "fadeIn 1s ease-out 4.5s both",
792 },
793
794 section: {
795 marginBottom: 80,
796 animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
797 },
798 sectionHeader: {
799 textAlign: "center",
800 marginBottom: 40,
801 },
802 sectionEyebrow: {
803 fontFamily: "'JetBrains Mono', monospace",
804 fontSize: 10,
805 letterSpacing: "0.4em",
806 color: "#d4af37",
807 marginBottom: 12,
808 textTransform: "uppercase",
809 },
810 sectionTitle: {
811 fontSize: "clamp(28px, 4vw, 40px)",
812 fontWeight: 300,
813 fontStyle: "italic",
814 color: "#f5e9c8",
815 marginBottom: 12,
816 letterSpacing: "-0.005em",
817 },
818 sectionSubtitle: {
819 fontSize: 15,
820 color: "#a89e8e",
821 fontStyle: "italic",
822 maxWidth: 440,
823 margin: "0 auto",
824 lineHeight: 1.6,
825 },
826
827 discordCard: {
828 display: "flex",
829 justifyContent: "space-between",
830 alignItems: "center",
831 gap: 24,
832 background: "rgba(10, 9, 8, 0.5)",
833 border: "1px solid rgba(212, 175, 55, 0.2)",
834 padding: "28px 32px",
835 color: "inherit",
836 flexWrap: "wrap",
837 },
838 discordCardLeft: {
839 display: "flex",
840 alignItems: "center",
841 gap: 20,
842 flex: 1,
843 minWidth: 240,
844 },
845 discordIcon: {
846 width: 48,
Hub.jsx  ·  Page 12
847 height: 48,
848 display: "flex",
849 alignItems: "center",
850 justifyContent: "center",
851 border: "1px solid rgba(212, 175, 55, 0.3)",
852 borderRadius: 4,
853 flexShrink: 0,
854 },
855 discordTitle: {
856 fontSize: 22,
857 fontStyle: "italic",
858 fontWeight: 300,
859 color: "#f5e9c8",
860 marginBottom: 4,
861 lineHeight: 1.2,
862 },
863 discordSubtitle: {
864 fontSize: 13,
865 color: "#a89e8e",
866 fontStyle: "italic",
867 lineHeight: 1.4,
868 },
869 discordStats: {
870 display: "flex",
871 alignItems: "center",
872 gap: 20,
873 },
874 discordStat: {
875 textAlign: "center",
876 },
877 discordStatVal: {
878 fontFamily: "'Cormorant Garamond', serif",
879 fontSize: 28,
880 fontStyle: "italic",
881 fontWeight: 300,
882 color: "#d4af37",
883 lineHeight: 1,
884 },
885 discordStatLive: {
886 fontFamily: "'Cormorant Garamond', serif",
887 fontSize: 28,
888 fontStyle: "italic",
889 fontWeight: 300,
890 color: "#d4af37",
891 lineHeight: 1,
892 display: "flex",
893 alignItems: "center",
894 gap: 8,
895 justifyContent: "center",
896 },
897 livePulse: {
898 width: 8,
899 height: 8,
900 borderRadius: "50%",
901 background: "#4ade80",
902 boxShadow: "0 0 12px #4ade80",
903 animation: "livePulse 2s ease-in-out infinite",
904 },
905 discordStatLabel: {
906 fontFamily: "'JetBrains Mono', monospace",
907 fontSize: 9,
908 letterSpacing: "0.3em",
909 color: "#7a736a",
910 marginTop: 6,
911 textTransform: "uppercase",
912 },
913 discordStatDivider: {
914 width: 1,
915 height: 32,
916 background: "rgba(212, 175, 55, 0.2)",
917 },
918
919 productList: {
Hub.jsx  ·  Page 13
920 display: "flex",
921 flexDirection: "column",
922 gap: 12,
923 },
924 productCard: {
925 display: "block",
926 background: "rgba(10, 9, 8, 0.5)",
927 border: "1px solid rgba(212, 175, 55, 0.15)",
928 color: "inherit",
929 },
930 productCardInner: {
931 display: "flex",
932 alignItems: "center",
933 gap: 24,
934 padding: "24px 28px",
935 },
936 productNum: {
937 fontFamily: "'JetBrains Mono', monospace",
938 fontSize: 14,
939 letterSpacing: "0.2em",
940 color: "#d4af37",
941 flexShrink: 0,
942 width: 28,
943 },
944 productContent: {
945 flex: 1,
946 minWidth: 0,
947 },
948 productLabelRow: {
949 display: "flex",
950 alignItems: "center",
951 gap: 12,
952 marginBottom: 8,
953 flexWrap: "wrap",
954 },
955 productLabel: {
956 fontFamily: "'JetBrains Mono', monospace",
957 fontSize: 9,
958 letterSpacing: "0.3em",
959 color: "#d4af37",
960 border: "1px solid rgba(212, 175, 55, 0.3)",
961 padding: "3px 10px",
962 textTransform: "uppercase",
963 },
964 productFormat: {
965 fontFamily: "'JetBrains Mono', monospace",
966 fontSize: 10,
967 letterSpacing: "0.15em",
968 color: "#7a736a",
969 textTransform: "uppercase",
970 },
971 productTitle: {
972 fontSize: 19,
973 fontStyle: "italic",
974 fontWeight: 300,
975 color: "#f5e9c8",
976 lineHeight: 1.3,
977 marginBottom: 6,
978 },
979 productDesc: {
980 fontSize: 14,
981 color: "#a89e8e",
982 lineHeight: 1.5,
983 fontStyle: "italic",
984 },
985 productArrow: {
986 fontSize: 24,
987 color: "#d4af37",
988 transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
989 flexShrink: 0,
990 fontWeight: 300,
991 },
992
Hub.jsx  ·  Page 14
993 socialGrid: {
994 display: "grid",
995 gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
996 gap: 12,
997 },
998 socialCard: {
999 background: "rgba(10, 9, 8, 0.5)",
1000 border: "1px solid rgba(212, 175, 55, 0.15)",
1001 padding: "20px 16px",
1002 textAlign: "center",
1003 color: "inherit",
1004 },
1005 socialIcon: {
1006 fontFamily: "'JetBrains Mono', monospace",
1007 fontSize: 16,
1008 letterSpacing: "0.15em",
1009 color: "#d4af37",
1010 marginBottom: 12,
1011 fontWeight: 500,
1012 },
1013 socialName: {
1014 fontSize: 15,
1015 color: "#f5e9c8",
1016 fontStyle: "italic",
1017 marginBottom: 4,
1018 },
1019 socialHandle: {
1020 fontFamily: "'JetBrains Mono', monospace",
1021 fontSize: 10,
1022 letterSpacing: "0.1em",
1023 color: "#7a736a",
1024 overflow: "hidden",
1025 textOverflow: "ellipsis",
1026 whiteSpace: "nowrap",
1027 },
1028
1029 supportBtn: {
1030 display: "flex",
1031 alignItems: "center",
1032 justifyContent: "center",
1033 gap: 12,
1034 background: "transparent",
1035 color: "#d4af37",
1036 border: "1px solid rgba(212, 175, 55, 0.3)",
1037 padding: "18px 32px",
1038 fontFamily: "'JetBrains Mono', monospace",
1039 fontSize: 12,
1040 letterSpacing: "0.3em",
1041 textTransform: "uppercase",
1042 fontWeight: 400,
1043 maxWidth: 320,
1044 margin: "0 auto",
1045 },
1046 supportEmoji: {
1047 fontSize: 16,
1048 },
1049
1050 footer: {
1051 textAlign: "center",
1052 padding: "60px 20px 40px",
1053 borderTop: "1px solid rgba(212, 175, 55, 0.1)",
1054 marginTop: 40,
1055 },
1056 footerOrnament: {
1057 fontSize: 18,
1058 color: "rgba(212, 175, 55, 0.4)",
1059 marginBottom: 24,
1060 },
1061 footerEmail: {
1062 display: "inline-block",
1063 fontFamily: "'JetBrains Mono', monospace",
1064 fontSize: 12,
1065 letterSpacing: "0.05em",
Hub.jsx  ·  Page 15
1066 color: "#a89e8e",
1067 textDecoration: "none",
1068 marginBottom: 16,
1069 transition: "color 0.3s ease",
1070 textTransform: "lowercase",
1071 },
1072 footerCopyright: {
1073 fontFamily: "'JetBrains Mono', monospace",
1074 fontSize: 9,
1075 letterSpacing: "0.3em",
1076 color: "#5a544c",
1077 textTransform: "uppercase",
1078 },
1079 };
1080
