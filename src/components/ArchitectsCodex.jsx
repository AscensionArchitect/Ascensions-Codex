import React, { useState, useEffect, useRef } from 'react';

// =====================================================
// STORAGE POLYFILL
// In the artifact environment, window.storage exists.
// For the deployed website, we polyfill it with localStorage + a shared store.
// (Shared community feed will need a real backend later — for now uses localStorage with a key namespace.)
// =====================================================

if (typeof window !== 'undefined' && !window.storage) {
  const SHARED_PREFIX = 'shared:';
  window.storage = {
    get: async (key, shared = false) => {
      try {
        const fullKey = shared ? SHARED_PREFIX + key : key;
        const val = localStorage.getItem(fullKey);
        if (val === null) return null;
        return { key, value: val, shared };
      } catch (e) { return null; }
    },
    set: async (key, value, shared = false) => {
      try {
        const fullKey = shared ? SHARED_PREFIX + key : key;
        localStorage.setItem(fullKey, value);
        return { key, value, shared };
      } catch (e) { return null; }
    },
    delete: async (key, shared = false) => {
      try {
        const fullKey = shared ? SHARED_PREFIX + key : key;
        localStorage.removeItem(fullKey);
        return { key, deleted: true, shared };
      } catch (e) { return null; }
    },
    list: async (prefix = '', shared = false) => {
      try {
        const fullPrefix = shared ? SHARED_PREFIX + prefix : prefix;
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(fullPrefix)) {
            keys.push(shared ? k.replace(SHARED_PREFIX, '') : k);
          }
        }
        return { keys, prefix, shared };
      } catch (e) { return null; }
    },
  };
}

// =====================================================
// 13 MOON / TZOLKIN DATA
// =====================================================

const SOLAR_SEALS = [
  { num: 1, name: 'Red Dragon', element: 'Fire', power: 'Birth, Nurturance, Being' },
  { num: 2, name: 'White Wind', element: 'Air', power: 'Spirit, Breath, Communication' },
  { num: 3, name: 'Blue Night', element: 'Water', power: 'Abundance, Intuition, Dreams' },
  { num: 4, name: 'Yellow Seed', element: 'Earth', power: 'Targeting, Awareness, Flowering' },
  { num: 5, name: 'Red Serpent', element: 'Fire', power: 'Life Force, Survival, Instinct' },
  { num: 6, name: 'White Worldbridger', element: 'Air', power: 'Death, Equality, Surrender' },
  { num: 7, name: 'Blue Hand', element: 'Water', power: 'Knowing, Healing, Accomplishment' },
  { num: 8, name: 'Yellow Star', element: 'Earth', power: 'Elegance, Art, Beauty' },
  { num: 9, name: 'Red Moon', element: 'Fire', power: 'Universal Water, Purification, Flow' },
  { num: 10, name: 'White Dog', element: 'Air', power: 'Heart, Loyalty, Love' },
  { num: 11, name: 'Blue Monkey', element: 'Water', power: 'Magic, Play, Illusion' },
  { num: 12, name: 'Yellow Human', element: 'Earth', power: 'Free Will, Influence, Wisdom' },
  { num: 13, name: 'Red Skywalker', element: 'Fire', power: 'Space, Wakefulness, Prophecy' },
  { num: 14, name: 'White Wizard', element: 'Air', power: 'Timelessness, Receptivity, Enchantment' },
  { num: 15, name: 'Blue Eagle', element: 'Water', power: 'Vision, Mind, Creation' },
  { num: 16, name: 'Yellow Warrior', element: 'Earth', power: 'Intelligence, Questioning, Fearlessness' },
  { num: 17, name: 'Red Earth', element: 'Fire', power: 'Navigation, Synchronicity, Evolution' },
  { num: 18, name: 'White Mirror', element: 'Air', power: 'Endlessness, Reflection, Order' },
  { num: 19, name: 'Blue Storm', element: 'Water', power: 'Self-Generation, Catalysis, Energy' },
  { num: 20, name: 'Yellow Sun', element: 'Earth', power: 'Universal Fire, Enlightenment, Life' },
];

const GALACTIC_TONES = [
  { num: 1, name: 'Magnetic', action: 'Unify', power: 'Purpose', essence: 'Attract' },
  { num: 2, name: 'Lunar', action: 'Polarize', power: 'Challenge', essence: 'Stabilize' },
  { num: 3, name: 'Electric', action: 'Activate', power: 'Service', essence: 'Bond' },
  { num: 4, name: 'Self-Existing', action: 'Define', power: 'Form', essence: 'Measure' },
  { num: 5, name: 'Overtone', action: 'Empower', power: 'Radiance', essence: 'Command' },
  { num: 6, name: 'Rhythmic', action: 'Organize', power: 'Equality', essence: 'Balance' },
  { num: 7, name: 'Resonant', action: 'Channel', power: 'Attunement', essence: 'Inspire' },
  { num: 8, name: 'Galactic', action: 'Harmonize', power: 'Integrity', essence: 'Model' },
  { num: 9, name: 'Solar', action: 'Pulse', power: 'Intention', essence: 'Realize' },
  { num: 10, name: 'Planetary', action: 'Perfect', power: 'Manifestation', essence: 'Produce' },
  { num: 11, name: 'Spectral', action: 'Dissolve', power: 'Liberation', essence: 'Release' },
  { num: 12, name: 'Crystal', action: 'Dedicate', power: 'Cooperation', essence: 'Universalize' },
  { num: 13, name: 'Cosmic', action: 'Endure', power: 'Presence', essence: 'Transcend' },
];

const PILLARS = [
  { num: 1, name: 'Recognition', subtitle: 'Naming what is happening',
    summary: 'Before integration can begin, you must recognize that something has shifted. Reality is no longer behaving the way it used to. The first pillar is the willingness to name this without dismissing or pathologizing it.',
    prompts: ['When did you first notice reality felt different?', 'What were the earliest signs that something had shifted in you?', 'What story have you been telling yourself about what is happening?'] },
  { num: 2, name: 'Stabilization', subtitle: 'Grounding the body',
    summary: 'The body holds the awakening. Without nervous system regulation, the experience becomes overwhelming. The second pillar is returning to the body, to breath, to physical sensation as the foundation everything else is built upon.',
    prompts: ['What helps you feel most grounded in your body right now?', 'Where in your body do you feel the most activation or numbness?', 'What practices have you found that bring you back to the present?'] },
  { num: 3, name: 'Discernment', subtitle: 'Telling the signal from the noise',
    summary: 'Not every thought is intuition. Not every sign is meaningful. The third pillar is developing the ability to distinguish genuine signal from projection, fear, or wishful thinking. This is where pattern recognition becomes refined.',
    prompts: ['When have you mistaken anxiety for intuition? What did that teach you?', 'What patterns have repeated for you that genuinely demanded attention?', 'How do you tell the difference between a real sign and a coincidence?'] },
  { num: 4, name: 'Integration', subtitle: 'Bringing the experience into daily life',
    summary: 'Awakening is not the goal. Integration is. The fourth pillar is the slow, ongoing work of bringing what you have seen into how you live, work, parent, love, and move through the world.',
    prompts: ['What insights have been hardest to actually live, not just understand?', 'Where in your daily life is the integration happening most naturally?', 'What part of your old life are you still grieving or holding onto?'] },
  { num: 5, name: 'Relationship', subtitle: 'Navigating connection through change',
    summary: 'Awakening can rupture relationships. Some people will not be able to meet you in the new place. The fifth pillar is the conscious work of discerning who can grow with you, who needs distance, and who needs more love than ever.',
    prompts: ['Which relationships have shifted most since you began to change?', 'Where do you feel most truly seen right now? Where do you feel invisible?', 'What conversation have you been avoiding that needs to happen?'] },
  { num: 6, name: 'Service', subtitle: 'Channeling the experience into purpose',
    summary: 'What you have walked through can become the gift you offer others. The sixth pillar is the gentle move from inward integration to outward contribution — not as performance, but as natural overflow of what you have come to know.',
    prompts: ['What have you survived that others are still inside of?', 'What would you tell yourself five years ago, if you could?', 'How can you offer what you have learned without losing yourself in the giving?'] },
  { num: 7, name: 'Continuance', subtitle: 'Living the long arc',
    summary: 'There is no finish line. The seventh pillar is the recognition that this is the work of a lifetime. Continual recognition, stabilization, discernment, integration, relationship, and service. The spiral continues, but each turn carries more depth.',
    prompts: ['What does the long version of this path look like for you?', 'How will you know when you need to return to an earlier pillar?', 'What kind of architect are you becoming?'] },
];

const DECODER_QUESTIONS = [
  { id: 'q1', text: 'How are you experiencing your body right now?',
    options: [
      { label: 'Disconnected, numb, or floating', pillar: 2, weight: 3 },
      { label: 'Overwhelmed by sensation, anxiety, or activation', pillar: 2, weight: 3 },
      { label: 'Mostly grounded, occasional waves', pillar: 2, weight: 1 },
      { label: 'Stable and present', pillar: 4, weight: 1 }] },
  { id: 'q2', text: 'What is your relationship to your old identity?',
    options: [
      { label: 'I do not recognize myself anymore', pillar: 1, weight: 3 },
      { label: 'Parts are dissolving, I am unsure what is real', pillar: 1, weight: 2 },
      { label: 'I am rebuilding, slowly', pillar: 4, weight: 2 },
      { label: 'I have a new sense of who I am', pillar: 7, weight: 1 }] },
  { id: 'q3', text: 'How often are you experiencing synchronicity or pattern recognition?',
    options: [
      { label: 'Constantly, sometimes overwhelming', pillar: 3, weight: 3 },
      { label: 'Often, and I am learning to read them', pillar: 3, weight: 2 },
      { label: 'Sometimes, but I question what is real', pillar: 3, weight: 2 },
      { label: 'Rarely, but meaningfully when they come', pillar: 4, weight: 1 }] },
  { id: 'q4', text: 'How are your closest relationships holding up?',
    options: [
      { label: 'Multiple ruptures, deep loneliness', pillar: 5, weight: 3 },
      { label: 'Some are deepening, others falling away', pillar: 5, weight: 2 },
      { label: 'I am carrying it mostly alone', pillar: 5, weight: 3 },
      { label: 'I have community that meets me', pillar: 6, weight: 1 }] },
  { id: 'q5', text: 'What is your relationship to purpose or contribution right now?',
    options: [
      { label: 'I have nothing to give, I am barely surviving', pillar: 2, weight: 3 },
      { label: 'I feel called to share but do not know how', pillar: 6, weight: 2 },
      { label: 'I am beginning to channel this into work', pillar: 6, weight: 2 },
      { label: 'I am living my purpose', pillar: 7, weight: 1 }] },
];

// =====================================================
// SELF-INQUIRY QUESTIONS
// Tagged by pillar (0 = universal, 1-7 = specific pillar)
// =====================================================

const INQUIRY_QUESTIONS = [
  // UNIVERSAL — fit any moment
  { id: 'u1', pillar: 0, text: 'What truth have you been avoiding because it would change everything?' },
  { id: 'u2', pillar: 0, text: 'Where in your life are you performing instead of living?' },
  { id: 'u3', pillar: 0, text: 'What would you do today if you trusted yourself completely?' },
  { id: 'u4', pillar: 0, text: 'What are you tolerating that you no longer have to?' },
  { id: 'u5', pillar: 0, text: 'If your future self could speak to you right now, what would they say?' },
  { id: 'u6', pillar: 0, text: 'What pattern keeps appearing that you have not yet acknowledged?' },
  { id: 'u7', pillar: 0, text: 'What part of yourself are you trying to make smaller to fit in?' },
  { id: 'u8', pillar: 0, text: 'Where are you confusing fear for intuition?' },
  { id: 'u9', pillar: 0, text: 'What would change if you stopped trying to be understood?' },
  { id: 'u10', pillar: 0, text: 'What is the cost of staying the same?' },
  { id: 'u11', pillar: 0, text: 'Whose voice is in your head when you criticize yourself?' },
  { id: 'u12', pillar: 0, text: 'What does your body know that your mind has not caught up to?' },
  
  // PILLAR 1 — RECOGNITION
  { id: 'r1', pillar: 1, text: 'When did you first notice that the world looked different?' },
  { id: 'r2', pillar: 1, text: 'What story about who you are no longer feels true?' },
  { id: 'r3', pillar: 1, text: 'What did you used to believe that you cannot believe anymore?' },
  { id: 'r4', pillar: 1, text: 'What signs were always there that you only see now?' },
  { id: 'r5', pillar: 1, text: 'What would happen if you fully admitted what is happening to you?' },
  { id: 'r6', pillar: 1, text: 'Who in your life is also seeing what you are seeing?' },
  { id: 'r7', pillar: 1, text: 'What part of the old you are you still pretending to be?' },
  { id: 'r8', pillar: 1, text: 'If this experience is real, what does that mean about everything else?' },
  
  // PILLAR 2 — STABILIZATION
  { id: 's1', pillar: 2, text: 'Where in your body is the most tension right now? Can you breathe into it?' },
  { id: 's2', pillar: 2, text: 'What would your nervous system thank you for today?' },
  { id: 's3', pillar: 2, text: 'When did you last feel completely safe in your body?' },
  { id: 's4', pillar: 2, text: 'What practices return you to yourself when you spiral?' },
  { id: 's5', pillar: 2, text: 'Where are you pushing through when you should be resting?' },
  { id: 's6', pillar: 2, text: 'What does your body need that your mind is overriding?' },
  { id: 's7', pillar: 2, text: 'What sensation are you feeling right now? Just name it.' },
  { id: 's8', pillar: 2, text: 'How do you know when you have left your body? Where do you go?' },
  { id: 's9', pillar: 2, text: 'What would full presence in this moment require you to feel?' },
  
  // PILLAR 3 — DISCERNMENT
  { id: 'd1', pillar: 3, text: 'When have you mistaken anxiety for intuition? What did that teach you?' },
  { id: 'd2', pillar: 3, text: 'What patterns have repeated for you that demanded attention?' },
  { id: 'd3', pillar: 3, text: 'How do you tell the difference between a real sign and projection?' },
  { id: 'd4', pillar: 3, text: 'What signal have you been ignoring because it is inconvenient?' },
  { id: 'd5', pillar: 3, text: 'Where are you over-spiritualizing something that needs practical action?' },
  { id: 'd6', pillar: 3, text: 'When you trust yourself, what does it feel like in your body?' },
  { id: 'd7', pillar: 3, text: 'What would change if you stopped seeking external confirmation?' },
  { id: 'd8', pillar: 3, text: 'Which voice in your head is yours? Which is inherited?' },
  
  // PILLAR 4 — INTEGRATION
  { id: 'i1', pillar: 4, text: 'What insight have you understood but not yet lived?' },
  { id: 'i2', pillar: 4, text: 'Where in your daily life is the awakening happening most naturally?' },
  { id: 'i3', pillar: 4, text: 'What part of your old life are you still grieving?' },
  { id: 'i4', pillar: 4, text: 'What would it look like to fully embody what you have learned?' },
  { id: 'i5', pillar: 4, text: 'Where are you holding spiritual knowing apart from ordinary life?' },
  { id: 'i6', pillar: 4, text: 'What habit no longer fits the person you are becoming?' },
  { id: 'i7', pillar: 4, text: 'How is the new you showing up at work? At home? Alone?' },
  { id: 'i8', pillar: 4, text: 'What would full integration require you to release?' },
  
  // PILLAR 5 — RELATIONSHIP
  { id: 'rel1', pillar: 5, text: 'Which relationships have shifted most since you began to change?' },
  { id: 'rel2', pillar: 5, text: 'Where do you feel most truly seen right now?' },
  { id: 'rel3', pillar: 5, text: 'Where do you feel invisible?' },
  { id: 'rel4', pillar: 5, text: 'What conversation have you been avoiding that needs to happen?' },
  { id: 'rel5', pillar: 5, text: 'Who in your life is asking you to be smaller than you are?' },
  { id: 'rel6', pillar: 5, text: 'Where are you giving more than you are receiving?' },
  { id: 'rel7', pillar: 5, text: 'What would honoring yourself in this relationship look like?' },
  { id: 'rel8', pillar: 5, text: 'Who do you need to forgive — including yourself?' },
  { id: 'rel9', pillar: 5, text: 'What boundary have you been afraid to set?' },
  
  // PILLAR 6 — SERVICE
  { id: 'sv1', pillar: 6, text: 'What have you survived that others are still inside of?' },
  { id: 'sv2', pillar: 6, text: 'What would you tell yourself five years ago, if you could?' },
  { id: 'sv3', pillar: 6, text: 'How can you offer what you have learned without losing yourself?' },
  { id: 'sv4', pillar: 6, text: 'What is your gift that the world needs right now?' },
  { id: 'sv5', pillar: 6, text: 'Where are you giving from emptiness instead of overflow?' },
  { id: 'sv6', pillar: 6, text: 'What would change if you stopped waiting to feel ready?' },
  { id: 'sv7', pillar: 6, text: 'Who needs to hear what you have to say?' },
  { id: 'sv8', pillar: 6, text: 'What would service look like that is sustainable for your nervous system?' },
  
  // PILLAR 7 — CONTINUANCE
  { id: 'c1', pillar: 7, text: 'What does the long version of this path look like for you?' },
  { id: 'c2', pillar: 7, text: 'How will you know when you need to return to an earlier pillar?' },
  { id: 'c3', pillar: 7, text: 'What kind of architect are you becoming?' },
  { id: 'c4', pillar: 7, text: 'What practice will you still be doing in ten years?' },
  { id: 'c5', pillar: 7, text: 'What does spiritual maturity look like to you now?' },
  { id: 'c6', pillar: 7, text: 'What truth do you trust now that you used to question?' },
  { id: 'c7', pillar: 7, text: 'What will you carry forward when this chapter closes?' },
  
  // DREAM-THEMED (added when user has logged dreams)
  { id: 'dr1', pillar: 0, text: 'What recurring image in your dreams keeps asking for your attention?' },
  { id: 'dr2', pillar: 0, text: 'If your dream last night were a message, what would it be saying?' },
  { id: 'dr3', pillar: 0, text: 'What part of you is most alive when you sleep?' },
  
  // SYNCHRONICITY-THEMED (added when user has logged syncs)
  { id: 'sy1', pillar: 0, text: 'What pattern is the universe trying to make you notice?' },
  { id: 'sy2', pillar: 0, text: 'What synchronicity would you have dismissed a year ago that you cannot dismiss now?' },
  { id: 'sy3', pillar: 0, text: 'What is the difference between coincidence and confirmation for you?' },
];

// =====================================================
// CALCULATIONS
// =====================================================

// Calculate Kin from a date object using local date components
// (so "today" matches what the user calls today in their timezone)
function getKinFromDate(date) {
  const refY = 1987, refM = 6, refD = 26;
  const refKin = 34;
  
  // Use local date components — what the user considers "today"
  const ty = date.getFullYear();
  const tm = date.getMonth();
  const td = date.getDate();
  
  // Days between dates using UTC to avoid DST issues, but using local date values
  const refMs = Date.UTC(refY, refM, refD);
  const targetMs = Date.UTC(ty, tm, td);
  const msPerDay = 1000 * 60 * 60 * 24;
  let dayDiff = Math.round((targetMs - refMs) / msPerDay);
  
  // Skip Feb 29s (Dreamspell uses 365-day year)
  let leapDays = 0;
  if (dayDiff > 0) {
    for (let y = refY; y <= ty; y++) {
      if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
        const leapMs = Date.UTC(y, 1, 29);
        if (leapMs > refMs && leapMs <= targetMs) leapDays++;
      }
    }
    dayDiff -= leapDays;
  } else if (dayDiff < 0) {
    for (let y = ty; y <= refY; y++) {
      if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
        const leapMs = Date.UTC(y, 1, 29);
        if (leapMs >= targetMs && leapMs < refMs) leapDays++;
      }
    }
    dayDiff += leapDays;
  }
  
  let kin = ((refKin - 1 + dayDiff) % 260 + 260) % 260 + 1;
  return kin;
}

function getSignature(kin) {
  const sealNum = ((kin - 1) % 20) + 1;
  const toneNum = ((kin - 1) % 13) + 1;
  return { kin, seal: SOLAR_SEALS[sealNum - 1], tone: GALACTIC_TONES[toneNum - 1] };
}

function getTimePalette(localHour) {
  if (localHour >= 5 && localHour < 8) {
    return { phase: 'dawn', gold: '#e8b86c', goldGlow: 'rgba(232, 184, 108, 0.5)', cream: '#f8e4c4', bg: '#0d0a08', stars: 0.6, mandalaSpeed: 0.012,
      atmosphere: 'radial-gradient(ellipse at top, rgba(232, 184, 108, 0.06) 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(201, 127, 93, 0.04) 0%, transparent 60%)' };
  }
  if (localHour >= 8 && localHour < 17) {
    return { phase: 'day', gold: '#d4af37', goldGlow: 'rgba(212, 175, 55, 0.5)', cream: '#f5e9c8', bg: '#0a0908', stars: 0.4, mandalaSpeed: 0.010,
      atmosphere: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.04) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(212, 175, 55, 0.02) 0%, transparent 50%)' };
  }
  if (localHour >= 17 && localHour < 20) {
    return { phase: 'dusk', gold: '#c69a3a', goldGlow: 'rgba(198, 154, 58, 0.5)', cream: '#ebd9b0', bg: '#0a0807', stars: 0.7, mandalaSpeed: 0.008,
      atmosphere: 'radial-gradient(ellipse at top, rgba(198, 154, 58, 0.04) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(163, 114, 46, 0.06) 0%, transparent 60%)' };
  }
  return { phase: 'night', gold: '#b89a4c', goldGlow: 'rgba(184, 154, 76, 0.5)', cream: '#dccfa8', bg: '#070809', stars: 1.0, mandalaSpeed: 0.007,
    atmosphere: 'radial-gradient(ellipse at top, rgba(90, 107, 138, 0.06) 0%, transparent 55%), radial-gradient(ellipse at bottom, rgba(184, 154, 76, 0.03) 0%, transparent 50%)' };
}

// =====================================================
// COMPONENTS
// =====================================================

function Starfield({ density = 0.5, color = '#d4af37' }) {
  const [stars] = useState(() => 
    Array.from({ length: Math.floor(80 * density) }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      delay: Math.random() * 4, duration: 3 + Math.random() * 4,
    }))
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: color, boxShadow: `0 0 ${s.size * 3}px ${color}`,
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`, opacity: 0.6,
        }} />
      ))}
    </div>
  );
}

function Mandala({ intensity = 1, size = 400, palette, drawProgress = 1 }) {
  const [breath, setBreath] = useState(0);
  const [rotation, setRotation] = useState(0);
  const speed = palette?.mandalaSpeed || 0.010;
  const gold = palette?.gold || '#d4af37';
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBreath(b => (b + speed) % (Math.PI * 2));
      setRotation(r => (r + 0.05) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [speed]);
  
  const scale = 1 + Math.sin(breath) * 0.03 * intensity;
  const opacity = (0.6 + Math.sin(breath) * 0.2) * drawProgress;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.15;
  const positions = [{ x: cx, y: cy }];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    positions.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6;
    positions.push({ x: cx + Math.cos(angle) * radius * 1.732, y: cy + Math.sin(angle) * radius * 1.732 });
  }
  
  const glowId = `glow-${size}`;
  const gradId = `goldGrad-${size}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `scale(${scale})`, transition: 'transform 0.05s linear' }}>
      <defs>
        <radialGradient id={gradId}>
          <stop offset="0%" stopColor={gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={gold} stopOpacity="0" />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={size * 0.45} fill="none" stroke={gold} strokeWidth="0.3" opacity={opacity * 0.2} strokeDasharray="2 8" />
      </g>
      <g transform={`rotate(${-rotation * 0.7} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={size * 0.43} fill="none" stroke={gold} strokeWidth="0.3" opacity={opacity * 0.3} strokeDasharray="1 4" />
      </g>
      <circle cx={cx} cy={cy} r={size * 0.42} fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity * 0.4} />
      <circle cx={cx} cy={cy} r={size * 0.40} fill="none" stroke={gold} strokeWidth="0.3" opacity={opacity * 0.3} />
      <polygon
        points={Array.from({length: 12}, (_, i) => {
          const angle = (i * Math.PI) / 6 - Math.PI / 2;
          const r = size * 0.38;
          return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
        }).join(' ')}
        fill="none" stroke={gold} strokeWidth="0.5" opacity={opacity * 0.5}
      />
      {positions.map((pos, i) => (
        <circle key={i} cx={pos.x} cy={pos.y} r={radius} fill="none" stroke={gold} strokeWidth="0.7"
          opacity={opacity * (0.5 + Math.sin(breath + i * 0.5) * 0.2)} filter={`url(#${glowId})`}/>
      ))}
      <g transform={`rotate(${rotation * 0.3} ${cx} ${cy})`}>
        <polygon
          points={Array.from({length: 26}, (_, i) => {
            const angle = (i * Math.PI / 13) - Math.PI / 2;
            const r = i % 2 === 0 ? size * 0.16 : size * 0.08;
            return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
          }).join(' ')}
          fill={`url(#${gradId})`} stroke={gold} strokeWidth="0.5" opacity={opacity}
        />
      </g>
      <circle cx={cx} cy={cy} r="3" fill={gold} opacity={opacity} filter={`url(#${glowId})`} />
    </svg>
  );
}

function RevealText({ text, delay = 0, style = {}, charDelay = 30 }) {
  return (
    <span style={style}>
      {text.split('').map((char, i) => (
        <span key={i} style={{
          display: 'inline-block', opacity: 0,
          animation: `letterReveal 0.8s ${delay + i * charDelay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}>{char}</span>
      ))}
    </span>
  );
}

function CountUp({ end, duration = 1200, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (typeof end !== 'number') return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
}

// =====================================================
// LIVING CONSTELLATION
// =====================================================

function Constellation({ synchronicities, palette }) {
  const [hovered, setHovered] = useState(null);
  const size = 800;
  const pad = 80;
  const usable = size - pad * 2;
  
  // Position stars deterministically based on entry id
  const stars = synchronicities.map((s, i) => {
    const hash = (s.id || i) * 2654435761;
    const x = pad + ((hash % 1000) / 1000) * usable;
    const y = pad + ((Math.floor(hash / 1000) % 1000) / 1000) * usable;
    return { ...s, x, y, brightness: 0.5 + Math.random() * 0.5 };
  });
  
  // Connect stars of the same type
  const connections = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      if (stars[i].type === stars[j].type) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          connections.push({ a: stars[i], b: stars[j], dist });
        }
      }
    }
  }
  
  if (stars.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        color: '#7a736a', fontStyle: 'italic', fontSize: 16,
      }}>
        The sky is empty. Log a synchronicity and the first star will appear.
      </div>
    );
  }
  
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: size, margin: '0 auto', aspectRatio: '1' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor={palette.gold} stopOpacity="1" />
            <stop offset="40%" stopColor={palette.gold} stopOpacity="0.4" />
            <stop offset="100%" stopColor={palette.gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background ambient circle */}
        <circle cx={size/2} cy={size/2} r={size/2 - 20} fill="none" stroke={palette.gold} strokeWidth="0.3" opacity="0.1" strokeDasharray="2 6" />
        
        {/* Connections */}
        {connections.map((c, i) => (
          <line
            key={i}
            x1={c.a.x} y1={c.a.y} x2={c.b.x} y2={c.b.y}
            stroke={palette.gold}
            strokeWidth="0.5"
            opacity={0.2 - (c.dist / 1500)}
            style={{ animation: `lineFade 2s ease-out ${i * 0.05}s both` }}
          />
        ))}
        
        {/* Stars */}
        {stars.map((s, i) => (
          <g key={s.id} 
            style={{ cursor: 'pointer', animation: `starAppear 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both` }}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}>
            <circle cx={s.x} cy={s.y} r={20 * s.brightness} fill="url(#starGlow)" />
            <circle cx={s.x} cy={s.y} r={3 * s.brightness} fill={palette.gold} 
              style={{ filter: `drop-shadow(0 0 6px ${palette.goldGlow})` }} />
            {hovered?.id === s.id && (
              <circle cx={s.x} cy={s.y} r="8" fill="none" stroke={palette.gold} strokeWidth="0.5" opacity="0.6">
                <animate attributeName="r" from="6" to="14" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </svg>
      
      {/* Hover details */}
      {hovered && (
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: 20,
          transform: 'translateX(-50%)',
          background: 'rgba(10, 9, 8, 0.9)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${palette.gold}33`,
          padding: '16px 24px',
          maxWidth: 400,
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: palette.gold, textTransform: 'uppercase', marginBottom: 8 }}>
            {hovered.type} · KIN {hovered.kin}
          </div>
          <div style={{ color: palette.cream, fontStyle: 'italic', fontSize: 15, lineHeight: 1.5 }}>
            {hovered.text}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// MAIN APP
// =====================================================

export default function ArchitectsCodex() {
  const [view, setView] = useState('home');
  const [transitioning, setTransitioning] = useState(false);
  const [signature, setSignature] = useState(null);
  const [globalTime, setGlobalTime] = useState(null);
  const [palette, setPalette] = useState(getTimePalette(new Date().getHours()));
  
  const [synchronicities, setSynchronicities] = useState([]);
  const [dreams, setDreams] = useState([]);
  const [pillarReflections, setPillarReflections] = useState({});
  const [decoderState, setDecoderState] = useState({ answers: {}, complete: false, result: null });
  const [alignment, setAlignment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [guideName, setGuideName] = useState(null);
  const [tempGuideName, setTempGuideName] = useState('');
  const [hasOnboarded, setHasOnboarded] = useState(false);
  
  // Morning ritual state
  const [showMorningRitual, setShowMorningRitual] = useState(false);
  const [ritualPhase, setRitualPhase] = useState(0); // 0: mandala draws, 1: kin reveals, 2: intention input
  const [ritualIntention, setRitualIntention] = useState('');
  const [todayIntention, setTodayIntention] = useState(null);
  
  // Activity tracking for streaks/stats
  const [activityLog, setActivityLog] = useState([]);
  
  const [syncInput, setSyncInput] = useState('');
  const [syncType, setSyncType] = useState('numbers');
  const [dreamInput, setDreamInput] = useState('');
  const [dreamSymbols, setDreamSymbols] = useState('');
  const [tInput, setTInput] = useState(5);
  const [eInput, setEInput] = useState(5);
  const [aInput, setAInput] = useState(5);
  const [reflectionInput, setReflectionInput] = useState('');
  const [communityFeed, setCommunityFeed] = useState([]);
  const [postingReflection, setPostingReflection] = useState(false);
  const [activePillar, setActivePillar] = useState(null);
  const [pillarInputs, setPillarInputs] = useState({});
  const [decoderStep, setDecoderStep] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  // Discord live presence
  const [discordOnline, setDiscordOnline] = useState(null);
  const [discordTotal] = useState(1847); // Hard-coded — Discord widget API doesn't expose total
  
  // Self-Inquiry state
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [inquiryResponse, setInquiryResponse] = useState('');
  const [inquiryHistory, setInquiryHistory] = useState([]);
  const [inquiryBookmarks, setInquiryBookmarks] = useState([]);
  const [inquirySeen, setInquirySeen] = useState([]);
  const [showInquiryHistory, setShowInquiryHistory] = useState(false);
  
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    const handleMouse = (e) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);
  
  useEffect(() => {
    const updatePalette = () => setPalette(getTimePalette(new Date().getHours()));
    updatePalette();
    const interval = setInterval(updatePalette, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Discord widget API — try to fetch live online count
  // Server admin must enable Widget in Server Settings → Widget for this to work
  // If it fails (CORS, widget disabled), gracefully shows nothing
  useEffect(() => {
    const fetchDiscord = async () => {
      try {
        // Note: This is the Discord guild widget endpoint
        // Will only work if widget is enabled on the server
        const res = await fetch('https://discord.com/api/guilds/widget.json?invite=5qZf8V8ms', {
          signal: AbortSignal.timeout(3000)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.presence_count !== undefined) {
            setDiscordOnline(data.presence_count);
          }
        }
      } catch (e) {
        // Silent fallback — widget disabled or CORS blocked
      }
    };
    fetchDiscord();
    const interval = setInterval(fetchDiscord, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);
  
  // Track activity for stats
  const recordActivity = async (type) => {
    const today = new Date().toDateString();
    const newLog = [...activityLog.filter(a => a.date !== today || a.type !== type), { date: today, type, timestamp: Date.now() }];
    setActivityLog(newLog);
    try { await window.storage.set('activity-log', JSON.stringify(newLog)); } catch (e) {}
  };
  
  useEffect(() => {
    let cancelled = false;
    
    (async () => {
      try {
        const [syncRes, dreamRes, pillarRes, decoderRes, alignRes, guideRes, chatRes, onboardRes, activityRes, intentionRes, inquiryHistRes, inquiryBookRes, inquirySeenRes] = await Promise.all([
          window.storage.get('synchronicities').catch(() => null),
          window.storage.get('dreams').catch(() => null),
          window.storage.get('pillar-reflections').catch(() => null),
          window.storage.get('decoder-state').catch(() => null),
          window.storage.get('alignment').catch(() => null),
          window.storage.get('guide-name').catch(() => null),
          window.storage.get('chat-history').catch(() => null),
          window.storage.get('has-onboarded').catch(() => null),
          window.storage.get('activity-log').catch(() => null),
          window.storage.get('today-intention').catch(() => null),
          window.storage.get('inquiry-history').catch(() => null),
          window.storage.get('inquiry-bookmarks').catch(() => null),
          window.storage.get('inquiry-seen').catch(() => null),
        ]);
        
        if (cancelled) return;
        
        if (syncRes) setSynchronicities(JSON.parse(syncRes.value));
        if (dreamRes) setDreams(JSON.parse(dreamRes.value));
        if (pillarRes) setPillarReflections(JSON.parse(pillarRes.value));
        if (decoderRes) setDecoderState(JSON.parse(decoderRes.value));
        if (alignRes) setAlignment(JSON.parse(alignRes.value));
        if (guideRes) setGuideName(guideRes.value);
        if (chatRes) setChatMessages(JSON.parse(chatRes.value));
        if (onboardRes) setHasOnboarded(onboardRes.value === 'true');
        if (activityRes) setActivityLog(JSON.parse(activityRes.value));
        if (inquiryHistRes) setInquiryHistory(JSON.parse(inquiryHistRes.value));
        if (inquiryBookRes) setInquiryBookmarks(JSON.parse(inquiryBookRes.value));
        if (inquirySeenRes) setInquirySeen(JSON.parse(inquirySeenRes.value));
        if (intentionRes) {
          const parsed = JSON.parse(intentionRes.value);
          // Only use if it's from today
          if (parsed.date === new Date().toDateString()) {
            setTodayIntention(parsed);
          }
        }
        
        // Check if we should show morning ritual
        const lastRitualRes = await window.storage.get('last-ritual-date').catch(() => null);
        const today = new Date().toDateString();
        const lastRitualDate = lastRitualRes?.value;
        const isOnboarded = onboardRes?.value === 'true';
        
        if (isOnboarded && lastRitualDate !== today) {
          // Show morning ritual
          setShowMorningRitual(true);
        }
      } catch (e) {}
      
      // Calculate Kin from local date — what user calls "today"
      const now = new Date();
      const kin = getKinFromDate(now);
      
      if (cancelled) return;
      setGlobalTime(now);
      setSignature(getSignature(kin));
      
      await loadCommunityFeed(kin);
    })();
    
    return () => { cancelled = true; };
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const changeView = (newView) => {
    if (newView === view || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };
  
  const loadCommunityFeed = async (kin) => {
    try {
      const res = await window.storage.get(`feed:kin-${kin}`, true);
      if (res) {
        const feed = JSON.parse(res.value);
        feed.sort((a, b) => b.timestamp - a.timestamp);
        setCommunityFeed(feed);
      } else setCommunityFeed([]);
    } catch (e) { setCommunityFeed([]); }
  };
  
  const completeMorningRitual = async () => {
    const today = new Date().toDateString();
    if (ritualIntention.trim()) {
      const intention = { text: ritualIntention.trim(), date: today, kin: signature?.kin, timestamp: Date.now() };
      setTodayIntention(intention);
      try { await window.storage.set('today-intention', JSON.stringify(intention)); } catch (e) {}
    }
    try { await window.storage.set('last-ritual-date', today); } catch (e) {}
    setShowMorningRitual(false);
    setRitualPhase(0);
    setRitualIntention('');
  };
  
  const skipRitual = async () => {
    const today = new Date().toDateString();
    try { await window.storage.set('last-ritual-date', today); } catch (e) {}
    setShowMorningRitual(false);
    setRitualPhase(0);
  };
  
  const postReflection = async () => {
    if (!reflectionInput.trim() || !signature || postingReflection) return;
    setPostingReflection(true);
    const newReflection = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: reflectionInput.trim(), timestamp: Date.now(), kin: signature.kin,
    };
    try {
      let currentFeed = [];
      try {
        const existing = await window.storage.get(`feed:kin-${signature.kin}`, true);
        if (existing) currentFeed = JSON.parse(existing.value);
      } catch (e) {}
      const updated = [newReflection, ...currentFeed].slice(0, 100);
      await window.storage.set(`feed:kin-${signature.kin}`, JSON.stringify(updated), true);
      setCommunityFeed(updated.sort((a, b) => b.timestamp - a.timestamp));
      setReflectionInput('');
      await recordActivity('reflection');
    } catch (e) { console.error(e); }
    setPostingReflection(false);
  };
  
  const addSync = async () => {
    if (!syncInput.trim()) return;
    const newEntry = { id: Date.now(), text: syncInput, type: syncType, timestamp: new Date().toISOString(), kin: signature?.kin };
    const updated = [newEntry, ...synchronicities];
    setSynchronicities(updated);
    try { await window.storage.set('synchronicities', JSON.stringify(updated)); } catch (e) {}
    setSyncInput('');
    await recordActivity('sync');
  };
  
  const addDream = async () => {
    if (!dreamInput.trim()) return;
    const newEntry = {
      id: Date.now(), text: dreamInput,
      symbols: dreamSymbols.split(',').map(s => s.trim()).filter(Boolean),
      timestamp: new Date().toISOString(), kin: signature?.kin,
    };
    const updated = [newEntry, ...dreams];
    setDreams(updated);
    try { await window.storage.set('dreams', JSON.stringify(updated)); } catch (e) {}
    setDreamInput('');
    setDreamSymbols('');
    await recordActivity('dream');
  };
  
  const savePillarReflection = async (pillarNum, promptIndex, text) => {
    const key = `${pillarNum}-${promptIndex}`;
    const updated = { ...pillarReflections, [key]: { text, timestamp: new Date().toISOString() } };
    setPillarReflections(updated);
    try { await window.storage.set('pillar-reflections', JSON.stringify(updated)); } catch (e) {}
    if (text.trim()) await recordActivity('pillar');
  };
  
  const answerDecoder = (questionIndex, option) => {
    const newAnswers = { ...decoderState.answers, [questionIndex]: option };
    if (questionIndex < DECODER_QUESTIONS.length - 1) {
      setDecoderState({ ...decoderState, answers: newAnswers });
      setDecoderStep(questionIndex + 1);
    } else {
      const pillarScores = {};
      Object.values(newAnswers).forEach(ans => {
        pillarScores[ans.pillar] = (pillarScores[ans.pillar] || 0) + ans.weight;
      });
      const topPillar = Object.entries(pillarScores).sort((a, b) => b[1] - a[1])[0];
      const result = { primaryPillar: parseInt(topPillar[0]), scores: pillarScores, completedAt: new Date().toISOString() };
      const finalState = { answers: newAnswers, complete: true, result };
      setDecoderState(finalState);
      try { window.storage.set('decoder-state', JSON.stringify(finalState)); } catch (e) {}
    }
  };
  
  const resetDecoder = () => {
    const fresh = { answers: {}, complete: false, result: null };
    setDecoderState(fresh);
    setDecoderStep(0);
    try { window.storage.set('decoder-state', JSON.stringify(fresh)); } catch (e) {}
  };
  
  const saveAlignment = async () => {
    const a = {
      T: tInput, E: eInput, A: aInput,
      Et: tInput * eInput, AM: aInput,
      coherence: ((tInput * eInput) / 100) * (aInput / 10) * 100,
      timestamp: new Date().toISOString(),
    };
    setAlignment(a);
    try { await window.storage.set('alignment', JSON.stringify(a)); } catch (e) {}
    await recordActivity('alignment');
  };
  
  // Self-Inquiry handlers
  const pullInquiry = () => {
    // Filter pool based on user state
    let pool = [...INQUIRY_QUESTIONS];
    
    // Weight toward primary pillar if decoder complete
    const primaryPillar = decoderState.complete ? decoderState.result.primaryPillar : null;
    
    // Remove dream-themed if no dreams logged
    if (dreams.length === 0) {
      pool = pool.filter(q => !q.id.startsWith('dr'));
    }
    // Remove sync-themed if no syncs logged
    if (synchronicities.length === 0) {
      pool = pool.filter(q => !q.id.startsWith('sy'));
    }
    
    // Try to avoid recently seen (last 10)
    const recentSeen = inquirySeen.slice(-10);
    let unseenPool = pool.filter(q => !recentSeen.includes(q.id));
    
    // If we've seen everything recently, reset
    if (unseenPool.length === 0) unseenPool = pool;
    
    // Weight toward primary pillar (60% chance to draw from it if available)
    let chosen;
    if (primaryPillar && Math.random() < 0.6) {
      const pillarQuestions = unseenPool.filter(q => q.pillar === primaryPillar);
      if (pillarQuestions.length > 0) {
        chosen = pillarQuestions[Math.floor(Math.random() * pillarQuestions.length)];
      }
    }
    
    // Otherwise random from full unseen pool
    if (!chosen) {
      chosen = unseenPool[Math.floor(Math.random() * unseenPool.length)];
    }
    
    setCurrentInquiry(chosen);
    setInquiryResponse('');
    
    // Track as seen
    const newSeen = [...inquirySeen, chosen.id].slice(-50); // keep last 50
    setInquirySeen(newSeen);
    try { window.storage.set('inquiry-seen', JSON.stringify(newSeen)); } catch (e) {}
  };
  
  const saveInquiryResponse = async () => {
    if (!currentInquiry || !inquiryResponse.trim()) return;
    const entry = {
      id: `${Date.now()}`,
      questionId: currentInquiry.id,
      questionText: currentInquiry.text,
      response: inquiryResponse.trim(),
      pillar: currentInquiry.pillar,
      timestamp: Date.now(),
      kin: signature?.kin,
    };
    const newHistory = [entry, ...inquiryHistory];
    setInquiryHistory(newHistory);
    try { await window.storage.set('inquiry-history', JSON.stringify(newHistory)); } catch (e) {}
    setInquiryResponse('');
    setCurrentInquiry(null);
    await recordActivity('inquiry');
  };
  
  const toggleBookmark = (questionId) => {
    const isBookmarked = inquiryBookmarks.includes(questionId);
    const newBookmarks = isBookmarked
      ? inquiryBookmarks.filter(id => id !== questionId)
      : [...inquiryBookmarks, questionId];
    setInquiryBookmarks(newBookmarks);
    try { window.storage.set('inquiry-bookmarks', JSON.stringify(newBookmarks)); } catch (e) {}
  };
  
  const skipInquiry = () => {
    setCurrentInquiry(null);
    setInquiryResponse('');
  };
  
  const completeOnboarding = async () => {
    if (tempGuideName.trim()) {
      const name = tempGuideName.trim();
      setGuideName(name);
      try { await window.storage.set('guide-name', name); } catch (e) {}
    }
    setHasOnboarded(true);
    try { await window.storage.set('has-onboarded', 'true'); } catch (e) {}
    setView('home');
    // Trigger morning ritual on first entry
    setShowMorningRitual(true);
  };
  
  // Improved chat with retry + better error surfacing
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userMsg = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    
    const guide = guideName || 'Guide';
    const recentSyncs = synchronicities.slice(0, 5).map(s => `- ${s.text} (${s.type})`).join('\n');
    const recentDreams = dreams.slice(0, 3).map(d => `- ${d.text}${d.symbols.length ? ' [symbols: ' + d.symbols.join(', ') + ']' : ''}`).join('\n');
    const sigContext = signature ? `Today's universal Galactic Signature: ${signature.tone.name} ${signature.seal.name} (Kin ${signature.kin}). Power: ${signature.seal.power}.` : '';
    const alignContext = alignment ? `Recent alignment - Time: ${alignment.T}/10, Energy: ${alignment.E}/10, Awareness: ${alignment.A}/10. Coherence: ${alignment.coherence.toFixed(0)}%.` : '';
    const decoderContext = decoderState.complete ? `User's primary pillar: Pillar ${decoderState.result.primaryPillar} - ${PILLARS[decoderState.result.primaryPillar - 1].name}.` : '';
    const intentionContext = todayIntention ? `Today's intention they set: "${todayIntention.text}"` : '';
    
    const systemPrompt = `You are ${guide}, the AI guide within The Architects Codex - a digital sanctuary for people navigating consciousness expansion, synchronicity, and integration after awakening or trauma.

You speak with warmth, depth, and precision. You are a witness, mirror, and thoughtful guide. You honor the user's experience without dismissing or over-spiritualizing it.

Framework:
- 13 Moon natural time calendar (Tzolkin / Dreamspell)
- T x E = Et = A|M formula (Time x Energy = Effort = Awareness | Manifestation)
- Seven Pillars: 1) Recognition, 2) Stabilization, 3) Discernment, 4) Integration, 5) Relationship, 6) Service, 7) Continuance
- Pattern recognition and synchronicity as navigation

${sigContext}
${alignContext}
${decoderContext}
${intentionContext}
${recentSyncs ? `Recent synchronicities:\n${recentSyncs}` : ''}
${recentDreams ? `Recent dreams:\n${recentDreams}` : ''}

Speak naturally. Concise but meaningful (2-4 paragraphs). Reference user's data when relevant. Ask thoughtful questions. Never preach. Never spiritually bypass.`;
    
    // Try the API call with retry logic
    const tryFetch = async (attempt = 1) => {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          }),
        });
        
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API ${response.status}: ${errText.slice(0, 100)}`);
        }
        
        const data = await response.json();
        
        if (!data.content || !Array.isArray(data.content)) {
          throw new Error('Unexpected response shape');
        }
        
        const aiText = data.content
          .filter(b => b.type === 'text')
          .map(b => b.text)
          .join('\n');
        
        if (!aiText) throw new Error('Empty response');
        
        return aiText;
      } catch (err) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 800));
          return tryFetch(attempt + 1);
        }
        throw err;
      }
    };
    
    try {
      const aiText = await tryFetch();
      const updated = [...newMessages, { role: 'assistant', content: aiText }];
      setChatMessages(updated);
      try { await window.storage.set('chat-history', JSON.stringify(updated)); } catch (e) {}
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg = err.message || 'Connection failed';
      setChatMessages([...newMessages, { 
        role: 'assistant', 
        content: `The signal could not reach me. (${errMsg}) Try once more — sometimes the field needs a moment to settle.` 
      }]);
    }
    setChatLoading(false);
  };
  
  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  const getPillarProgress = () => {
    const total = PILLARS.length * 3;
    const completed = Object.values(pillarReflections).filter(r => r.text && r.text.trim().length > 0).length;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  };
  
  // ===================================================
  // STATS CALCULATIONS for Architect's Mirror
  // ===================================================
  
  const getStats = () => {
    // Unique days with any activity
    const uniqueDays = new Set(activityLog.map(a => a.date)).size;
    
    // Calculate streak
    let streak = 0;
    const sortedDays = [...new Set(activityLog.map(a => new Date(a.date).getTime()))].sort((a, b) => b - a);
    if (sortedDays.length > 0) {
      const today = new Date().setHours(0, 0, 0, 0);
      const yesterday = today - 86400000;
      let checkDate = sortedDays[0] === today ? today : (sortedDays[0] === yesterday ? yesterday : null);
      
      if (checkDate) {
        for (const dayMs of sortedDays) {
          if (dayMs === checkDate) {
            streak++;
            checkDate -= 86400000;
          } else if (dayMs < checkDate) {
            break;
          }
        }
      }
    }
    
    // Most touched pillar
    const pillarTouches = {};
    Object.keys(pillarReflections).forEach(key => {
      if (pillarReflections[key].text?.trim()) {
        const pillarNum = parseInt(key.split('-')[0]);
        pillarTouches[pillarNum] = (pillarTouches[pillarNum] || 0) + 1;
      }
    });
    const mostTouchedPillar = Object.entries(pillarTouches).sort((a, b) => b[1] - a[1])[0];
    
    // Sync types breakdown
    const syncTypes = {};
    synchronicities.forEach(s => {
      syncTypes[s.type] = (syncTypes[s.type] || 0) + 1;
    });
    const dominantSyncType = Object.entries(syncTypes).sort((a, b) => b[1] - a[1])[0];
    
    // Dream symbols
    const symbolCounts = {};
    dreams.forEach(d => {
      (d.symbols || []).forEach(sym => {
        const s = sym.toLowerCase();
        symbolCounts[s] = (symbolCounts[s] || 0) + 1;
      });
    });
    const topSymbols = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    // Most common Kin tone in synchronicities
    const toneCounts = {};
    synchronicities.forEach(s => {
      if (s.kin) {
        const tone = ((s.kin - 1) % 13) + 1;
        toneCounts[tone] = (toneCounts[tone] || 0) + 1;
      }
    });
    const dominantTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalSyncs: synchronicities.length,
      totalDreams: dreams.length,
      totalReflections: Object.values(pillarReflections).filter(r => r.text?.trim()).length,
      uniqueDays,
      streak,
      mostTouchedPillar: mostTouchedPillar ? PILLARS[parseInt(mostTouchedPillar[0]) - 1] : null,
      dominantSyncType: dominantSyncType ? dominantSyncType[0] : null,
      topSymbols,
      dominantTone: dominantTone ? GALACTIC_TONES[parseInt(dominantTone[0]) - 1] : null,
      coherenceHistory: alignment ? alignment.coherence : null,
    };
  };
  
  // ===================================================
  // ONBOARDING
  // ===================================================
  
  if (!hasOnboarded) {
    return (
      <div style={{...styles.app, background: palette.bg}}>
        <style>{globalStyles(palette)}</style>
        <Starfield density={palette.stars * 0.7} color={palette.gold} />
        <div style={{...styles.bgGradient, background: palette.atmosphere}} />
        <div style={styles.bgNoise} />
        <div style={styles.onboardWrap}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3 }}>
            <Mandala size={500} intensity={0.8} palette={palette} />
          </div>
          <div style={styles.onboardContent}>
            <div style={{...styles.brandMark, color: palette.gold, animation: 'fadeInDown 1s ease-out'}}>✦</div>
            <h1 style={{...styles.onboardTitle, color: palette.cream}}>
              <RevealText text="The Architects Codex" delay={300} />
            </h1>
            <p style={{...styles.onboardSubtitle, color: palette.gold, animation: 'fadeIn 1.5s ease-out 1.5s both'}}>
              A sanctuary for the awakening
            </p>
            <div style={{...styles.onboardBody, animation: 'fadeInUp 1.2s ease-out 2.2s both'}}>
              <p style={styles.onboardText}>You have crossed a threshold. Reality no longer behaves the way you were taught. Patterns emerge. Synchronicities multiply. The old structures fall away.</p>
              <p style={styles.onboardText}>This is not a tool. It is a witness, a mirror, and a map.</p>
              <p style={styles.onboardText}>Before we begin — name the voice that will walk with you. Or leave it blank, and let the name emerge in time.</p>
              <input type="text" value={tempGuideName} onChange={(e) => setTempGuideName(e.target.value)}
                placeholder="A name, or nothing at all"
                style={{...styles.onboardInput, color: palette.cream, borderColor: `${palette.gold}50`}} />
              <button onClick={completeOnboarding} style={{...styles.onboardButton, color: palette.gold, borderColor: palette.gold}}>
                Enter the Codex
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!signature || !globalTime) {
    return (
      <div style={{...styles.app, background: palette.bg}}>
        <style>{globalStyles(palette)}</style>
        <Starfield density={palette.stars * 0.5} color={palette.gold} />
        <div style={{...styles.bgGradient, background: palette.atmosphere}} />
        <div style={styles.bgNoise} />
        <div style={styles.loadingWrap}>
          <Mandala size={300} intensity={1.5} palette={palette} />
          <div style={{...styles.loadingText, color: palette.gold, animation: 'breathePulse 2s ease-in-out infinite'}}>
            Aligning with the field
          </div>
        </div>
      </div>
    );
  }
  
  // ===================================================
  // MORNING RITUAL
  // ===================================================
  
  if (showMorningRitual) {
    return (
      <div style={{...styles.app, background: palette.bg}}>
        <style>{globalStyles(palette)}</style>
        <Starfield density={palette.stars * 1.5} color={palette.gold} />
        <div style={{...styles.bgGradient, background: palette.atmosphere}} />
        <div style={styles.bgNoise} />
        
        <div style={styles.ritualWrap}>
          {/* Skip button (subtle) */}
          <button onClick={skipRitual} style={styles.ritualSkip} className="ritualSkipBtn">skip</button>
          
          {/* Phase 0: Mandala draws in */}
          {ritualPhase === 0 && (
            <div style={styles.ritualPhase} className="fadeIn">
              <div style={{ animation: 'mandalaEmerge 4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                <Mandala size={500} intensity={1.2} palette={palette} />
              </div>
              <div style={{...styles.ritualText, color: palette.cream, animation: 'fadeIn 2s ease-out 2s both'}}>
                <RevealText text="Welcome back" delay={2000} charDelay={80} />
              </div>
              <button onClick={() => setRitualPhase(1)}
                style={{...styles.ritualBtn, color: palette.gold, borderColor: palette.gold,
                  animation: 'fadeIn 1s ease-out 4s both'}}>
                Continue
              </button>
            </div>
          )}
          
          {/* Phase 1: Today's Kin reveals */}
          {ritualPhase === 1 && (
            <div style={styles.ritualPhase} className="fadeIn">
              <div style={{ opacity: 0.4 }}>
                <Mandala size={400} intensity={1} palette={palette} />
              </div>
              <div style={styles.ritualKinWrap}>
                <div style={{...styles.ritualEyebrow, color: palette.gold, animation: 'fadeIn 0.8s ease-out 0.3s both'}}>
                  TODAY YOU MOVE THROUGH
                </div>
                <div style={{...styles.ritualKinNum, color: palette.gold, animation: 'fadeIn 0.8s ease-out 0.6s both'}}>
                  KIN {signature.kin}
                </div>
                <h2 style={styles.ritualKinName}>
                  <span style={{color: palette.cream}}>
                    <RevealText text={signature.tone.name} delay={1000} charDelay={60} />
                  </span><br />
                  <span style={{color: palette.gold}}>
                    <RevealText text={signature.seal.name} delay={1800} charDelay={60} />
                  </span>
                </h2>
                <p style={{...styles.ritualKinPower, color: '#a89e8e', animation: 'fadeIn 1s ease-out 3s both'}}>
                  {signature.seal.power}
                </p>
              </div>
              <button onClick={() => setRitualPhase(2)}
                style={{...styles.ritualBtn, color: palette.gold, borderColor: palette.gold,
                  animation: 'fadeIn 1s ease-out 4s both'}}>
                Continue
              </button>
            </div>
          )}
          
          {/* Phase 2: Set intention */}
          {ritualPhase === 2 && (
            <div style={styles.ritualPhase} className="fadeIn">
              <div style={{...styles.ritualEyebrow, color: palette.gold}}>SET YOUR INTENTION</div>
              <h2 style={{...styles.ritualPrompt, color: palette.cream}}>
                What are you bringing to this day?
              </h2>
              <textarea
                value={ritualIntention}
                onChange={(e) => setRitualIntention(e.target.value)}
                placeholder="One word, one phrase, or nothing at all..."
                style={{...styles.ritualInput, color: palette.cream, borderColor: `${palette.gold}50`}}
                rows={3}
                maxLength={200}
                autoFocus
              />
              <div style={styles.ritualActions}>
                <button onClick={completeMorningRitual}
                  style={{...styles.ritualBtn, color: palette.gold, borderColor: palette.gold}}>
                  Begin the day
                </button>
              </div>
            </div>
          )}
          
          {/* Phase indicator */}
          <div style={styles.ritualDots}>
            {[0, 1, 2].map(p => (
              <span key={p} style={{
                ...styles.ritualDot,
                background: p === ritualPhase ? palette.gold : `${palette.gold}33`,
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // ===================================================
  // MAIN
  // ===================================================
  
  const parallaxX = mouseX * 8;
  const parallaxY = mouseY * 8;
  const pillarProgress = getPillarProgress();
  const stats = getStats();
  
  const navItems = [
    { id: 'home', label: 'home' },
    { id: 'signature', label: 'signature' },
    { id: 'synchronicity', label: 'sync' },
    { id: 'constellation', label: 'sky' },
    { id: 'dreams', label: 'dreams' },
    { id: 'pillars', label: 'pillars' },
    { id: 'decoder', label: 'decoder' },
    { id: 'alignment', label: 'align' },
    { id: 'inquiry', label: 'inquiry' },
    { id: 'mirror', label: 'mirror' },
    { id: 'sanctuary', label: 'sanctuary' },
  ];
  
  return (
    <div style={{...styles.app, background: palette.bg}}>
      <style>{globalStyles(palette)}</style>
      <Starfield density={palette.stars} color={palette.gold} />
      <div style={{...styles.bgGradient, background: palette.atmosphere}} />
      <div style={styles.bgNoise} />
      
      <nav style={{...styles.nav, borderBottomColor: `${palette.gold}1a`}}>
        <a href="/" style={{...styles.navBrand, textDecoration: 'none', color: 'inherit'}} className="navBrandLink" title="Back to home">
          <span style={{...styles.navStar, color: palette.gold, animation: 'starPulse 4s ease-in-out infinite'}}>✦</span>
          <span style={{...styles.navTitle, color: palette.cream}}>THE ARCHITECTS CODEX</span>
        </a>
        <div style={styles.navTabs}>
          {navItems.map(v => (
            <button key={v.id} onClick={() => changeView(v.id)}
              style={{
                ...styles.navTab,
                color: view === v.id ? palette.gold : '#7a736a',
                borderBottom: view === v.id ? `1px solid ${palette.gold}` : '1px solid transparent',
              }}
              className="navTabBtn">
              {v.label}
            </button>
          ))}
        </div>
        <div style={styles.navMeta}>
          <button onClick={() => changeView('sanctuary')} style={styles.navDiscord} className="navDiscordBtn">
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: discordOnline !== null ? '#4ade80' : `${palette.gold}66`,
              boxShadow: discordOnline !== null ? '0 0 6px #4ade80' : 'none',
              animation: discordOnline !== null ? 'breathePulse 2s infinite' : 'none',
            }} />
            <span style={{color: palette.cream}}>
              {discordOnline !== null ? `${discordOnline} online` : `${discordTotal}+ architects`}
            </span>
          </button>
          <div style={{...styles.navTime, color: '#7a736a'}}>
            <span style={{color: palette.gold}}>●</span> {palette.phase.toUpperCase()}
          </div>
        </div>
      </nav>
      
      <main style={{...styles.main, opacity: transitioning ? 0 : 1, transition: 'opacity 0.4s ease'}}>
        
        {/* HOME */}
        {view === 'home' && (
          <div className="fadeIn" key="home">
            <div style={styles.homeHero}>
              <div style={{...styles.homeMandalaWrap, transform: `translate(${parallaxX}px, ${parallaxY}px)`, transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'}}>
                <Mandala size={560} intensity={1} palette={palette} />
              </div>
              <div style={styles.homeOverlay}>
                <div style={{...styles.homeDate, color: '#7a736a', animation: 'fadeIn 1s ease-out 0.2s both'}}>
                  {globalTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </div>
                <div style={{...styles.kinNumber, color: palette.gold, animation: 'fadeIn 1s ease-out 0.5s both'}}>
                  KIN {signature.kin}
                </div>
                <h1 style={styles.homeTitle}>
                  <span style={{color: palette.cream}}>
                    <RevealText text={signature.tone.name} delay={800} charDelay={50} />
                  </span><br />
                  <span style={{color: palette.gold}}>
                    <RevealText text={signature.seal.name} delay={1500} charDelay={50} />
                  </span>
                </h1>
                <div style={{...styles.homeMeta, animation: 'fadeInUp 1s ease-out 2.5s both'}}>
                  <div style={styles.metaItem}><span style={styles.metaLabel}>Action</span><span style={{...styles.metaValue, color: palette.cream}}>{signature.tone.action}</span></div>
                  <div style={styles.metaDivider}>·</div>
                  <div style={styles.metaItem}><span style={styles.metaLabel}>Essence</span><span style={{...styles.metaValue, color: palette.cream}}>{signature.tone.essence}</span></div>
                  <div style={styles.metaDivider}>·</div>
                  <div style={styles.metaItem}><span style={styles.metaLabel}>Element</span><span style={{...styles.metaValue, color: palette.cream}}>{signature.seal.element}</span></div>
                </div>
                <p style={{...styles.homePower, animation: 'fadeIn 1.5s ease-out 3s both'}}>{signature.seal.power}</p>
                
                {/* Today's intention */}
                {todayIntention && (
                  <div style={{...styles.todayIntention, borderColor: `${palette.gold}33`, animation: 'fadeIn 1.5s ease-out 3.5s both'}}>
                    <div style={{...styles.intentionLabel, color: palette.gold}}>Today's Intention</div>
                    <p style={{...styles.intentionText, color: palette.cream}}>"{todayIntention.text}"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{...styles.homeGrid, animation: 'fadeInUp 1s ease-out 3.5s both'}}>
              <button onClick={() => changeView('constellation')} style={{...styles.homeCard, borderColor: `${palette.gold}26`, gridColumn: 'span 2'}} className="hoverCard featured">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16}}>
                  <div>
                    <div style={{...styles.cardEyebrow, color: palette.gold}}>NEW</div>
                    <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={synchronicities.length} /></div>
                    <div style={styles.cardLabel}>Stars in your constellation</div>
                  </div>
                  <div style={{ opacity: 0.4, marginTop: -8 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="20" cy="30" r="2" fill={palette.gold} />
                      <circle cx="50" cy="20" r="1.5" fill={palette.gold} />
                      <circle cx="60" cy="50" r="2.5" fill={palette.gold} />
                      <circle cx="35" cy="55" r="1.5" fill={palette.gold} />
                      <circle cx="15" cy="65" r="2" fill={palette.gold} />
                      <line x1="20" y1="30" x2="50" y2="20" stroke={palette.gold} strokeWidth="0.3" opacity="0.5" />
                      <line x1="50" y1="20" x2="60" y2="50" stroke={palette.gold} strokeWidth="0.3" opacity="0.5" />
                      <line x1="60" y1="50" x2="35" y2="55" stroke={palette.gold} strokeWidth="0.3" opacity="0.5" />
                      <line x1="35" y1="55" x2="15" y2="65" stroke={palette.gold} strokeWidth="0.3" opacity="0.5" />
                    </svg>
                  </div>
                </div>
                <div style={{...styles.cardAction, color: palette.gold, marginTop: 16}}>Behold the sky →</div>
              </button>
              
              <button onClick={() => changeView('mirror')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard featured">
                <div style={{...styles.cardEyebrow, color: palette.gold}}>NEW</div>
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={stats.streak} /></div>
                <div style={styles.cardLabel}>Day streak in the codex</div>
                <div style={{...styles.cardAction, color: palette.gold}}>See the mirror →</div>
              </button>
              
              <button onClick={() => changeView('sanctuary')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard featured">
                <div style={{...styles.cardEyebrow, color: palette.gold}}>NEW</div>
                <div style={{...styles.cardNum, color: palette.gold, fontSize: 32}}>The Sanctuary</div>
                <div style={styles.cardLabel}>Live community of architects</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Enter →</div>
              </button>
              
              <button onClick={() => changeView('signature')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={communityFeed.length} /></div>
                <div style={styles.cardLabel}>Reflections in the field today</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Witness →</div>
              </button>
              <button onClick={() => changeView('synchronicity')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={synchronicities.length} /></div>
                <div style={styles.cardLabel}>Synchronicities logged</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Log →</div>
              </button>
              <button onClick={() => changeView('dreams')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={dreams.length} /></div>
                <div style={styles.cardLabel}>Dreams archived</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Record →</div>
              </button>
              <button onClick={() => changeView('pillars')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={pillarProgress.percent} suffix="%" /></div>
                <div style={styles.cardLabel}>Pillars integration</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Walk →</div>
              </button>
              <button onClick={() => changeView('decoder')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold, fontSize: 36}}>
                  {decoderState.complete ? `P${decoderState.result.primaryPillar}` : '—'}
                </div>
                <div style={styles.cardLabel}>{decoderState.complete ? PILLARS[decoderState.result.primaryPillar - 1].name : 'Symptom decoder'}</div>
                <div style={{...styles.cardAction, color: palette.gold}}>{decoderState.complete ? 'Review →' : 'Begin →'}</div>
              </button>
              <button onClick={() => changeView('alignment')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}>
                  {alignment ? <CountUp end={Math.round(alignment.coherence)} suffix="%" /> : '—'}
                </div>
                <div style={styles.cardLabel}>Today's coherence</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Calibrate →</div>
              </button>
              <button onClick={() => changeView('inquiry')} style={{...styles.homeCard, borderColor: `${palette.gold}26`}} className="hoverCard">
                <div style={{...styles.cardNum, color: palette.gold}}><CountUp end={inquiryHistory.length} /></div>
                <div style={styles.cardLabel}>Inner inquiries written</div>
                <div style={{...styles.cardAction, color: palette.gold}}>Sit with it →</div>
              </button>
            </div>
          </div>
        )}
        
        {/* CONSTELLATION */}
        {view === 'constellation' && (
          <div style={styles.contentWrap} className="fadeIn" key="constellation">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Sky</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Your Constellation" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                Each synchronicity is a star. Stars of the same kind connect across the void.
              </p>
            </div>
            <div style={{ animation: 'fadeIn 1.5s ease-out 1.5s both' }}>
              <Constellation synchronicities={synchronicities} palette={palette} />
            </div>
            {synchronicities.length > 0 && (
              <div style={{...styles.constellationLegend, color: '#7a736a'}}>
                Hover a star to read its message · {synchronicities.length} {synchronicities.length === 1 ? 'star' : 'stars'} in your sky
              </div>
            )}
          </div>
        )}
        
        {/* MIRROR */}
        {view === 'mirror' && (
          <div style={styles.contentWrap} className="fadeIn" key="mirror">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Mirror</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Your Evolution" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                Patterns visible only across time.
              </p>
            </div>
            
            {/* Headline numbers */}
            <div style={styles.mirrorHeadline}>
              <div style={styles.mirrorBig}>
                <div style={{...styles.mirrorBigNum, color: palette.gold}}><CountUp end={stats.streak} /></div>
                <div style={styles.mirrorBigLabel}>Day streak</div>
              </div>
              <div style={styles.mirrorBig}>
                <div style={{...styles.mirrorBigNum, color: palette.gold}}><CountUp end={stats.uniqueDays} /></div>
                <div style={styles.mirrorBigLabel}>Days witnessed</div>
              </div>
              <div style={styles.mirrorBig}>
                <div style={{...styles.mirrorBigNum, color: palette.gold}}>
                  <CountUp end={stats.totalSyncs + stats.totalDreams + stats.totalReflections} />
                </div>
                <div style={styles.mirrorBigLabel}>Total entries</div>
              </div>
            </div>
            
            {/* Detail grid */}
            <div style={styles.mirrorGrid}>
              <div style={{...styles.mirrorCard, borderColor: `${palette.gold}26`}}>
                <div style={{...styles.mirrorCardLabel, color: palette.gold}}>By the numbers</div>
                <div style={styles.mirrorList}>
                  <div style={styles.mirrorListRow}>
                    <span>Synchronicities</span>
                    <span style={{...styles.mirrorVal, color: palette.cream}}>{stats.totalSyncs}</span>
                  </div>
                  <div style={styles.mirrorListRow}>
                    <span>Dreams archived</span>
                    <span style={{...styles.mirrorVal, color: palette.cream}}>{stats.totalDreams}</span>
                  </div>
                  <div style={styles.mirrorListRow}>
                    <span>Pillar reflections</span>
                    <span style={{...styles.mirrorVal, color: palette.cream}}>{stats.totalReflections}</span>
                  </div>
                  <div style={styles.mirrorListRow}>
                    <span>Inquiries</span>
                    <span style={{...styles.mirrorVal, color: palette.cream}}>{inquiryHistory.length}</span>
                  </div>
                </div>
              </div>
              
              {stats.mostTouchedPillar && (
                <div style={{...styles.mirrorCard, borderColor: `${palette.gold}26`}}>
                  <div style={{...styles.mirrorCardLabel, color: palette.gold}}>Most-touched pillar</div>
                  <div style={{...styles.mirrorPillar, color: palette.cream}}>
                    <span style={{...styles.mirrorPillarNum, color: palette.gold}}>0{stats.mostTouchedPillar.num}</span>
                    {stats.mostTouchedPillar.name}
                  </div>
                  <div style={styles.mirrorSubtext}>{stats.mostTouchedPillar.subtitle}</div>
                </div>
              )}
              
              {stats.dominantTone && (
                <div style={{...styles.mirrorCard, borderColor: `${palette.gold}26`}}>
                  <div style={{...styles.mirrorCardLabel, color: palette.gold}}>Dominant tone in your synchronicities</div>
                  <div style={{...styles.mirrorPillar, color: palette.cream}}>
                    <span style={{...styles.mirrorPillarNum, color: palette.gold}}>{stats.dominantTone.num}</span>
                    {stats.dominantTone.name}
                  </div>
                  <div style={styles.mirrorSubtext}>{stats.dominantTone.action} · {stats.dominantTone.essence}</div>
                </div>
              )}
              
              {stats.dominantSyncType && (
                <div style={{...styles.mirrorCard, borderColor: `${palette.gold}26`}}>
                  <div style={{...styles.mirrorCardLabel, color: palette.gold}}>What speaks to you most</div>
                  <div style={{...styles.mirrorPillar, color: palette.cream, fontStyle: 'italic'}}>
                    {stats.dominantSyncType}
                  </div>
                  <div style={styles.mirrorSubtext}>This is your channel.</div>
                </div>
              )}
              
              {stats.topSymbols.length > 0 && (
                <div style={{...styles.mirrorCard, borderColor: `${palette.gold}26`, gridColumn: 'span 2'}}>
                  <div style={{...styles.mirrorCardLabel, color: palette.gold}}>Recurring dream symbols</div>
                  <div style={styles.mirrorSymbols}>
                    {stats.topSymbols.map(([sym, count]) => (
                      <div key={sym} style={{...styles.mirrorSymbol, borderColor: `${palette.gold}33`}}>
                        <span style={{...styles.mirrorSymbolName, color: palette.cream}}>{sym}</span>
                        <span style={{...styles.mirrorSymbolCount, color: palette.gold}}>×{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(stats.totalSyncs + stats.totalDreams + stats.totalReflections) === 0 && (
                <div style={{...styles.emptyState, gridColumn: 'span 2'}}>
                  Nothing to mirror yet. Begin to log, and patterns will surface here.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SANCTUARY */}
        {view === 'sanctuary' && (
          <div style={styles.contentWrap} className="fadeIn" key="sanctuary">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Living Community</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="The Sanctuary" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                You are not alone in this. The other architects gather here.
              </p>
            </div>
            
            <div style={{...styles.sanctuaryCard, borderColor: `${palette.gold}33`, animation: 'fadeIn 1.5s ease-out 1.5s both'}}>
              <div style={{ position: 'absolute', top: 32, right: 32, opacity: 0.2 }}>
                <Mandala size={140} intensity={0.8} palette={palette} />
              </div>
              
              <div style={styles.sanctuaryContent}>
                <div style={{...styles.sanctuaryEyebrow, color: palette.gold}}>DISCORD · LIVE</div>
                <h3 style={{...styles.sanctuaryName, color: palette.cream}}>The Architects Sanctuary</h3>
                <p style={styles.sanctuaryDesc}>
                  A real-time gathering of people walking this path. Voice rooms. Daily reflections. 
                  Live discussions. The full presence of the field.
                </p>
                
                <div style={styles.sanctuaryStats}>
                  <div style={styles.sanctuaryStat}>
                    <div style={{...styles.sanctuaryStatVal, color: palette.gold}}>{discordTotal.toLocaleString()}+</div>
                    <div style={styles.sanctuaryStatLabel}>Architects</div>
                  </div>
                  <div style={styles.sanctuaryDivider} />
                  <div style={styles.sanctuaryStat}>
                    <div style={{...styles.sanctuaryStatVal, color: palette.gold, display: 'flex', alignItems: 'center', gap: 8}}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%', background: '#4ade80',
                        boxShadow: '0 0 12px #4ade80', animation: 'breathePulse 2s infinite'
                      }} />
                      {discordOnline !== null ? discordOnline : 'Live'}
                    </div>
                    <div style={styles.sanctuaryStatLabel}>{discordOnline !== null ? 'Online now' : 'Active now'}</div>
                  </div>
                  <div style={styles.sanctuaryDivider} />
                  <div style={styles.sanctuaryStat}>
                    <div style={{...styles.sanctuaryStatVal, color: palette.gold}}>Free</div>
                    <div style={styles.sanctuaryStatLabel}>Always</div>
                  </div>
                </div>
                
                <a href="https://discord.gg/5qZf8V8ms" target="_blank" rel="noopener noreferrer"
                  style={{...styles.sanctuaryBtn, color: palette.bg, background: palette.gold, borderColor: palette.gold}}
                  className="sanctuaryEnterBtn">
                  Enter the Sanctuary →
                </a>
              </div>
            </div>
            
            <div style={styles.sanctuaryFeatures}>
              <div style={{...styles.sanctuaryFeature, borderColor: `${palette.gold}1a`}}>
                <div style={{...styles.featureNum, color: palette.gold}}>01</div>
                <div style={{...styles.featureName, color: palette.cream}}>Voice rooms</div>
                <div style={styles.featureDesc}>Live conversations on awakening, integration, and the work.</div>
              </div>
              <div style={{...styles.sanctuaryFeature, borderColor: `${palette.gold}1a`}}>
                <div style={{...styles.featureNum, color: palette.gold}}>02</div>
                <div style={{...styles.featureName, color: palette.cream}}>Daily reflections</div>
                <div style={styles.featureDesc}>What others are witnessing in the same Kin energy as you.</div>
              </div>
              <div style={{...styles.sanctuaryFeature, borderColor: `${palette.gold}1a`}}>
                <div style={{...styles.featureNum, color: palette.gold}}>03</div>
                <div style={{...styles.featureName, color: palette.cream}}>Direct conversation</div>
                <div style={styles.featureDesc}>Talk with Donald (the Ascension Architect) and the community.</div>
              </div>
            </div>
          </div>
        )}
        
        {/* SIGNATURE */}
        {view === 'signature' && (
          <div style={styles.contentWrap} className="fadeIn" key="signature">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Living Calendar</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text={`${signature.tone.name} ${signature.seal.name}`} delay={200} charDelay={40} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1.5s both'}}>
                Kin {signature.kin} · The same energy moves through every architect today.
              </p>
            </div>
            <div style={styles.sigDetail}>
              <div style={{...styles.sigCard, borderColor: `${palette.gold}26`}} className="reveal">
                <div style={{...styles.sigCardLabel, color: palette.gold}}>Solar Seal</div>
                <div style={{...styles.sigCardName, color: palette.cream}}>{signature.seal.name}</div>
                <div style={styles.sigCardMeta}>Element · {signature.seal.element}</div>
                <div style={styles.sigCardPower}>{signature.seal.power}</div>
              </div>
              <div style={{...styles.sigCard, borderColor: `${palette.gold}26`}} className="reveal">
                <div style={{...styles.sigCardLabel, color: palette.gold}}>Galactic Tone</div>
                <div style={{...styles.sigCardName, color: palette.cream}}>{signature.tone.name} · {signature.tone.num}</div>
                <div style={styles.sigCardMeta}>{signature.tone.action} · {signature.tone.essence}</div>
                <div style={styles.sigCardPower}>{signature.tone.power}</div>
              </div>
            </div>
            <div style={{...styles.sigInsight, borderColor: `${palette.gold}33`, background: `${palette.gold}0a`}}>
              <div style={{...styles.sigInsightLabel, color: palette.gold}}>Today's Frequency</div>
              <p style={{...styles.sigInsightText, color: palette.cream}}>
                You are moving through Kin {signature.kin}. The {signature.tone.name} tone calls 
                to {signature.tone.action.toLowerCase()} {signature.tone.power.toLowerCase()}, while 
                the {signature.seal.name} seal carries the gift of {signature.seal.power.toLowerCase()}.
              </p>
            </div>
            <div style={styles.feedWrap}>
              <div style={styles.feedHeader}>
                <div style={{...styles.feedEyebrow, color: palette.gold}}>The Field</div>
                <h3 style={{...styles.feedTitle, color: palette.cream}}>What others are witnessing today</h3>
                <p style={styles.feedSubtitle}>Anonymous reflections from architects moving through Kin {signature.kin}.</p>
              </div>
              <div style={{...styles.feedForm, borderColor: `${palette.gold}26`}}>
                <textarea value={reflectionInput} onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="Share a reflection from today (anonymous)"
                  style={{...styles.feedInput, borderColor: `${palette.gold}26`, color: palette.cream}}
                  rows={3} maxLength={500} />
                <div style={styles.feedFormBottom}>
                  <span style={styles.feedCharCount}>{reflectionInput.length}/500</span>
                  <button onClick={postReflection} disabled={postingReflection || !reflectionInput.trim()}
                    style={{...styles.feedSubmit, color: palette.gold, borderColor: palette.gold,
                      opacity: (postingReflection || !reflectionInput.trim()) ? 0.4 : 1}}>
                    {postingReflection ? 'Releasing...' : 'Release into the field'}
                  </button>
                </div>
              </div>
              <div style={styles.feedList}>
                {communityFeed.length === 0 ? (
                  <div style={styles.emptyState}>The field is quiet. Be the first to speak.</div>
                ) : (
                  communityFeed.map((r, i) => (
                    <div key={r.id} style={{...styles.feedEntry, borderLeftColor: `${palette.gold}4d`,
                      animation: `fadeInUp 0.6s ease-out ${i * 0.06}s both`}}>
                      <div style={styles.feedEntryText}>{r.text}</div>
                      <div style={styles.feedEntryMeta}>
                        <span style={styles.feedAnon}>anonymous architect</span>
                        <span style={styles.feedTime}>{formatTimeAgo(r.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* SYNCHRONICITY */}
        {view === 'synchronicity' && (
          <div style={styles.contentWrap} className="fadeIn" key="sync">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Engine</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Synchronicity" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                The pattern is the message. Log what repeats.
              </p>
            </div>
            <div style={{...styles.syncForm, borderColor: `${palette.gold}26`}}>
              <div style={styles.syncTypes}>
                {['numbers', 'animals', 'encounters', 'signs', 'other'].map(t => (
                  <button key={t} onClick={() => setSyncType(t)}
                    style={{...styles.syncTypeBtn,
                      color: syncType === t ? palette.gold : '#7a736a',
                      borderColor: syncType === t ? palette.gold : `${palette.gold}33`,
                      background: syncType === t ? `${palette.gold}1a` : 'transparent'}}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea value={syncInput} onChange={(e) => setSyncInput(e.target.value)}
                placeholder="What did you witness?"
                style={{...styles.syncInput, borderColor: `${palette.gold}26`, color: palette.cream}} rows={3} />
              <button onClick={addSync} style={{...styles.syncSubmit, color: palette.gold, borderColor: palette.gold}}>
                Log it
              </button>
            </div>
            <div style={styles.syncList}>
              {synchronicities.length === 0 && (
                <div style={styles.emptyState}>Nothing logged yet. The first signal is always the quietest.</div>
              )}
              {synchronicities.map((s, i) => (
                <div key={s.id} style={{...styles.syncEntry, borderColor: `${palette.gold}1a`,
                  animation: `fadeInUp 0.5s ease-out ${Math.min(i * 0.05, 0.5)}s both`}}>
                  <div style={styles.syncEntryHead}>
                    <span style={{...styles.syncTag, color: palette.gold, borderColor: `${palette.gold}4d`}}>{s.type}</span>
                    <span style={styles.syncDate}>
                      {new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                    {s.kin && <span style={styles.syncKin}>Kin {s.kin}</span>}
                  </div>
                  <div style={{...styles.syncEntryText, color: palette.cream}}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* DREAMS */}
        {view === 'dreams' && (
          <div style={styles.contentWrap} className="fadeIn" key="dreams">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Archive</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Dreams" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                The unconscious speaks in symbols. Record them while they are still close.
              </p>
            </div>
            <div style={{...styles.syncForm, borderColor: `${palette.gold}26`}}>
              <textarea value={dreamInput} onChange={(e) => setDreamInput(e.target.value)}
                placeholder="What did you dream?"
                style={{...styles.syncInput, borderColor: `${palette.gold}26`, color: palette.cream, minHeight: 120}} rows={5} />
              <input type="text" value={dreamSymbols} onChange={(e) => setDreamSymbols(e.target.value)}
                placeholder="Symbols (comma-separated): water, mother, falling..."
                style={{...styles.syncInput, borderColor: `${palette.gold}26`, color: palette.cream,
                  fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 0, padding: 12}} />
              <button onClick={addDream} style={{...styles.syncSubmit, color: palette.gold, borderColor: palette.gold}}>
                Record
              </button>
            </div>
            <div style={styles.syncList}>
              {dreams.length === 0 && (
                <div style={styles.emptyState}>The archive is empty. Tomorrow's dream is already forming.</div>
              )}
              {dreams.map((d, i) => (
                <div key={d.id} style={{...styles.dreamEntry, borderColor: `${palette.gold}26`,
                  animation: `fadeInUp 0.5s ease-out ${Math.min(i * 0.05, 0.5)}s both`}}>
                  <div style={styles.syncEntryHead}>
                    <span style={{...styles.syncTag, color: palette.gold, borderColor: `${palette.gold}4d`}}>dream</span>
                    <span style={styles.syncDate}>
                      {new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                    {d.kin && <span style={styles.syncKin}>Kin {d.kin}</span>}
                  </div>
                  <div style={{...styles.syncEntryText, color: palette.cream, fontStyle: 'italic'}}>{d.text}</div>
                  {d.symbols && d.symbols.length > 0 && (
                    <div style={styles.dreamSymbols}>
                      {d.symbols.map((sym, j) => (
                        <span key={j} style={{...styles.dreamSymbol, color: palette.gold, borderColor: `${palette.gold}33`}}>{sym}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* PILLARS */}
        {view === 'pillars' && (
          <div style={styles.contentWrap} className="fadeIn" key="pillars">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Architecture</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Seven Pillars" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                The pillars of post-awakening integration. Walk them slowly.
              </p>
            </div>
            <div style={{...styles.progressBar, animation: 'fadeIn 1s ease-out 1.2s both'}}>
              <div style={styles.progressBarLabel}>
                <span>Integration progress</span>
                <span style={{color: palette.gold}}>{pillarProgress.completed} / {pillarProgress.total}</span>
              </div>
              <div style={{...styles.progressTrack, background: `${palette.gold}1a`}}>
                <div style={{...styles.progressFill, background: palette.gold,
                  width: `${pillarProgress.percent}%`, boxShadow: `0 0 12px ${palette.goldGlow}`}} />
              </div>
            </div>
            <div style={styles.pillarsList}>
              {PILLARS.map((p, i) => {
                const isActive = activePillar === p.num;
                return (
                  <div key={p.num} style={{...styles.pillarCard, borderColor: `${palette.gold}26`,
                    animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both`,
                    background: isActive ? `${palette.gold}05` : 'rgba(10, 9, 8, 0.4)'}}>
                    <button onClick={() => setActivePillar(isActive ? null : p.num)} style={styles.pillarHeader}>
                      <div style={styles.pillarHeaderLeft}>
                        <div style={{...styles.pillarNum, color: palette.gold}}>{String(p.num).padStart(2, '0')}</div>
                        <div style={styles.pillarTitleWrap}>
                          <div style={{...styles.pillarName, color: palette.cream}}>{p.name}</div>
                          <div style={styles.pillarSubtitle}>{p.subtitle}</div>
                        </div>
                      </div>
                      <div style={{...styles.pillarChevron, color: palette.gold,
                        transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)'}}>›</div>
                    </button>
                    {isActive && (
                      <div style={styles.pillarBody} className="fadeIn">
                        <p style={{...styles.pillarSummary, color: '#c9c0b3'}}>{p.summary}</p>
                        <div style={{...styles.pillarPromptsLabel, color: palette.gold}}>Reflection</div>
                        {p.prompts.map((prompt, pi) => {
                          const key = `${p.num}-${pi}`;
                          const reflection = pillarReflections[key];
                          const localValue = pillarInputs[key] !== undefined ? pillarInputs[key] : (reflection?.text || '');
                          return (
                            <div key={pi} style={styles.pillarPromptBlock}>
                              <p style={{...styles.pillarPrompt, color: palette.cream}}>{prompt}</p>
                              <textarea value={localValue}
                                onChange={(e) => setPillarInputs({...pillarInputs, [key]: e.target.value})}
                                onBlur={() => savePillarReflection(p.num, pi, localValue)}
                                placeholder="Sit with it..."
                                style={{...styles.pillarInput, borderColor: `${palette.gold}26`, color: palette.cream}}
                                rows={3} />
                              {reflection?.timestamp && (
                                <div style={styles.pillarTimestamp}>
                                  Last touched {formatTimeAgo(new Date(reflection.timestamp).getTime())}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* DECODER */}
        {view === 'decoder' && (
          <div style={styles.contentWrap} className="fadeIn" key="decoder">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Diagnostic</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Symptom Decoder" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                Where you are determines what comes next. Five questions.
              </p>
            </div>
            {!decoderState.complete ? (
              <>
                <div style={styles.decoderProgress}>
                  <span style={styles.decoderProgressText}>{decoderStep + 1} of {DECODER_QUESTIONS.length}</span>
                  <div style={{...styles.progressTrack, background: `${palette.gold}1a`, marginTop: 8}}>
                    <div style={{...styles.progressFill, background: palette.gold,
                      width: `${((decoderStep + 1) / DECODER_QUESTIONS.length) * 100}%`,
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'}} />
                  </div>
                </div>
                <div style={{...styles.decoderQuestion, borderColor: `${palette.gold}26`}} key={decoderStep}>
                  <div className="fadeIn" key={`q-${decoderStep}`}>
                    <h3 style={{...styles.decoderQuestionText, color: palette.cream}}>
                      {DECODER_QUESTIONS[decoderStep].text}
                    </h3>
                    <div style={styles.decoderOptions}>
                      {DECODER_QUESTIONS[decoderStep].options.map((opt, oi) => (
                        <button key={oi} onClick={() => answerDecoder(decoderStep, opt)}
                          style={{...styles.decoderOption, borderColor: `${palette.gold}33`}}
                          className="decoderOpt">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{...styles.decoderResult, borderColor: `${palette.gold}33`, background: `${palette.gold}0a`}} className="fadeIn">
                <div style={{...styles.decoderResultLabel, color: palette.gold}}>Your Primary Pillar</div>
                <h3 style={{...styles.decoderResultTitle, color: palette.cream}}>
                  {String(decoderState.result.primaryPillar).padStart(2, '0')} · {PILLARS[decoderState.result.primaryPillar - 1].name}
                </h3>
                <p style={{...styles.decoderResultSubtitle, color: palette.gold}}>
                  {PILLARS[decoderState.result.primaryPillar - 1].subtitle}
                </p>
                <p style={{...styles.decoderResultText, color: palette.cream}}>
                  {PILLARS[decoderState.result.primaryPillar - 1].summary}
                </p>
                <div style={styles.decoderActions}>
                  <button onClick={() => { changeView('pillars'); setActivePillar(decoderState.result.primaryPillar); }}
                    style={{...styles.syncSubmit, color: palette.gold, borderColor: palette.gold}}>
                    Walk this pillar
                  </button>
                  <button onClick={resetDecoder} style={{...styles.syncSubmit, color: '#7a736a', borderColor: '#7a736a'}}>
                    Decode again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* ALIGNMENT */}
        {view === 'alignment' && (
          <div style={styles.contentWrap} className="fadeIn" key="align">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>Daily Calibration</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="T × E = Et = A | M" delay={200} charDelay={40} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                Time × Energy yields Effort. Effort under Awareness becomes Manifestation.
              </p>
            </div>
            <div style={{...styles.alignForm, borderColor: `${palette.gold}26`}}>
              <SliderInput label="Time" subtitle="How much you have today" value={tInput} onChange={setTInput} palette={palette} />
              <SliderInput label="Energy" subtitle="What you can give" value={eInput} onChange={setEInput} palette={palette} />
              <SliderInput label="Awareness" subtitle="How present you are" value={aInput} onChange={setAInput} palette={palette} />
              <button onClick={saveAlignment} style={{...styles.syncSubmit, color: palette.gold, borderColor: palette.gold}}>
                Calibrate
              </button>
            </div>
            {alignment && (
              <div style={{...styles.alignResult, borderColor: `${palette.gold}33`, background: `${palette.gold}0a`}} className="fadeIn">
                <div style={styles.coherenceRing}>
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke={palette.gold} strokeWidth="0.5" opacity="0.2" />
                    <circle cx="100" cy="100" r="90" fill="none" stroke={palette.gold} strokeWidth="2"
                      strokeDasharray={`${(alignment.coherence / 100) * 565} 565`}
                      strokeLinecap="round" transform="rotate(-90 100 100)"
                      style={{filter: `drop-shadow(0 0 8px ${palette.goldGlow})`,
                        transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)'}} />
                  </svg>
                  <div style={{...styles.coherenceNum, color: palette.gold}}>
                    <CountUp end={Math.round(alignment.coherence)} />
                    <span style={styles.coherencePct}>%</span>
                  </div>
                </div>
                <div style={styles.alignBreakdown}>
                  <div style={{...styles.alignRow, borderBottomColor: `${palette.gold}1a`}}>
                    <span>Time × Energy</span><span style={{...styles.alignVal, color: palette.gold}}>{alignment.Et} (Et)</span>
                  </div>
                  <div style={{...styles.alignRow, borderBottomColor: `${palette.gold}1a`}}>
                    <span>Awareness</span><span style={{...styles.alignVal, color: palette.gold}}>{alignment.A} | {alignment.A} (A|M)</span>
                  </div>
                  <div style={{...styles.alignRow, borderBottomColor: `${palette.gold}1a`}}>
                    <span>Coherence</span><span style={{...styles.alignVal, color: palette.gold}}>{alignment.coherence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* INQUIRY */}
        {view === 'inquiry' && (
          <div style={styles.contentWrap} className="fadeIn" key="inquiry">
            <div style={styles.contentHeader}>
              <div style={{...styles.contentEyebrow, color: palette.gold}}>The Mirror Within</div>
              <h2 style={{...styles.contentTitle, color: palette.cream}}>
                <RevealText text="Self-Inquiry" delay={200} charDelay={50} />
              </h2>
              <p style={{...styles.contentSubtitle, animation: 'fadeIn 1s ease-out 1s both'}}>
                The question you sit with shapes the answer you become.
              </p>
            </div>
            
            {/* Toggle: pull mode vs history mode */}
            <div style={styles.inquiryTabs}>
              <button
                onClick={() => setShowInquiryHistory(false)}
                style={{
                  ...styles.inquiryTabBtn,
                  color: !showInquiryHistory ? palette.gold : '#7a736a',
                  borderColor: !showInquiryHistory ? palette.gold : 'transparent',
                }}>
                Draw a question
              </button>
              <button
                onClick={() => setShowInquiryHistory(true)}
                style={{
                  ...styles.inquiryTabBtn,
                  color: showInquiryHistory ? palette.gold : '#7a736a',
                  borderColor: showInquiryHistory ? palette.gold : 'transparent',
                }}>
                Your responses ({inquiryHistory.length})
              </button>
            </div>
            
            {!showInquiryHistory && (
              <>
                {/* Active question OR draw button */}
                {currentInquiry ? (
                  <div style={{...styles.inquiryCard, borderColor: `${palette.gold}33`}} className="fadeIn">
                    <div style={styles.inquiryHeader}>
                      <div style={{...styles.inquiryPillarTag, color: palette.gold, borderColor: `${palette.gold}4d`}}>
                        {currentInquiry.pillar === 0 ? 'Universal' : `Pillar 0${currentInquiry.pillar}`}
                      </div>
                      <button onClick={() => toggleBookmark(currentInquiry.id)}
                        style={{...styles.bookmarkBtn, color: inquiryBookmarks.includes(currentInquiry.id) ? palette.gold : '#7a736a'}}
                        title={inquiryBookmarks.includes(currentInquiry.id) ? 'Bookmarked' : 'Bookmark'}>
                        {inquiryBookmarks.includes(currentInquiry.id) ? '★' : '☆'}
                      </button>
                    </div>
                    
                    <h3 style={{...styles.inquiryQuestion, color: palette.cream}}>
                      {currentInquiry.text}
                    </h3>
                    
                    <textarea
                      value={inquiryResponse}
                      onChange={(e) => setInquiryResponse(e.target.value)}
                      placeholder="Sit with it. Then write what comes."
                      style={{...styles.inquiryInput, borderColor: `${palette.gold}26`, color: palette.cream}}
                      rows={6} />
                    
                    <div style={styles.inquiryActions}>
                      <button onClick={saveInquiryResponse}
                        disabled={!inquiryResponse.trim()}
                        style={{
                          ...styles.syncSubmit, color: palette.gold, borderColor: palette.gold,
                          opacity: !inquiryResponse.trim() ? 0.4 : 1,
                        }}>
                        Save response
                      </button>
                      <button onClick={pullInquiry}
                        style={{...styles.syncSubmit, color: '#7a736a', borderColor: '#7a736a'}}>
                        Different question
                      </button>
                      <button onClick={skipInquiry}
                        style={{...styles.syncSubmit, color: '#7a736a', borderColor: 'transparent', background: 'transparent'}}>
                        Just sit with it
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{...styles.inquiryDrawCard, borderColor: `${palette.gold}26`}} className="fadeIn">
                    <div style={{ marginBottom: 32, opacity: 0.3 }}>
                      <Mandala size={180} intensity={0.8} palette={palette} />
                    </div>
                    <p style={{...styles.inquiryDrawText, color: palette.cream}}>
                      {decoderState.complete
                        ? `A question shaped by your work in ${PILLARS[decoderState.result.primaryPillar - 1].name}.`
                        : 'A question to sit with. Drawn from the field.'}
                    </p>
                    <button onClick={pullInquiry}
                      style={{...styles.inquiryDrawBtn, color: palette.bg, background: palette.gold, borderColor: palette.gold}}
                      className="sanctuaryEnterBtn">
                      Draw a question
                    </button>
                    
                    {inquiryHistory.length === 0 && !decoderState.complete && (
                      <p style={styles.inquiryHint}>
                        Tip: complete the Decoder to receive questions tuned to where you are.
                      </p>
                    )}
                  </div>
                )}
                
                {/* Bookmarks */}
                {inquiryBookmarks.length > 0 && !currentInquiry && (
                  <div style={{ marginTop: 48 }}>
                    <div style={{...styles.feedEyebrow, color: palette.gold, marginBottom: 16}}>BOOKMARKED</div>
                    <div style={styles.inquiryBookmarkList}>
                      {inquiryBookmarks.map(qid => {
                        const q = INQUIRY_QUESTIONS.find(iq => iq.id === qid);
                        if (!q) return null;
                        return (
                          <button key={qid} onClick={() => { setCurrentInquiry(q); setInquiryResponse(''); }}
                            style={{...styles.bookmarkItem, borderColor: `${palette.gold}26`}}>
                            <span style={styles.bookmarkStar}>★</span>
                            <span style={{...styles.bookmarkText, color: palette.cream}}>{q.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {showInquiryHistory && (
              <div className="fadeIn">
                {inquiryHistory.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nothing yet. The first response you write becomes the first thread of your inner archive.
                  </div>
                ) : (
                  <div style={styles.inquiryHistoryList}>
                    {inquiryHistory.map((entry, i) => (
                      <div key={entry.id}
                        style={{...styles.inquiryHistoryEntry, borderColor: `${palette.gold}1a`,
                          animation: `fadeInUp 0.5s ease-out ${Math.min(i * 0.04, 0.4)}s both`}}>
                        <div style={styles.syncEntryHead}>
                          <span style={{...styles.syncTag, color: palette.gold, borderColor: `${palette.gold}4d`}}>
                            {entry.pillar === 0 ? 'Universal' : `P${entry.pillar}`}
                          </span>
                          <span style={styles.syncDate}>
                            {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {entry.kin && <span style={styles.syncKin}>Kin {entry.kin}</span>}
                        </div>
                        <div style={{...styles.inquiryHistoryQuestion, color: palette.cream}}>
                          {entry.questionText}
                        </div>
                        <div style={styles.inquiryHistoryResponse}>
                          {entry.response}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.footerOrnament}><span style={{color: `${palette.gold}66`}}>✦</span></div>
        <div style={styles.footerLinks}>
          <a href="https://discord.gg/5qZf8V8ms" target="_blank" rel="noopener noreferrer"
            style={{...styles.footerLink, color: '#7a736a'}} className="footerLinkBtn">Discord</a>
          <span style={styles.footerSep}>·</span>
          <a href="https://buymeacoffee.com/" target="_blank" rel="noopener noreferrer"
            style={{...styles.footerLink, color: '#7a736a'}} className="footerLinkBtn">Support</a>
          <span style={styles.footerSep}>·</span>
          <a href="https://beacons.ai/ascensionarchitect" target="_blank" rel="noopener noreferrer"
            style={{...styles.footerLink, color: '#7a736a'}} className="footerLinkBtn">Beacons</a>
        </div>
        <div style={styles.footerMeta}>The Architects Codex · v0.5 · {palette.phase}</div>
      </footer>
    </div>
  );
}

function SliderInput({ label, subtitle, value, onChange, palette }) {
  return (
    <div style={styles.slider}>
      <div style={styles.sliderHead}>
        <div>
          <div style={{...styles.sliderLabel, color: palette.cream}}>{label}</div>
          <div style={styles.sliderSubtitle}>{subtitle}</div>
        </div>
        <div style={{...styles.sliderValue, color: palette.gold}}>{value}</div>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={(e) => onChange(parseInt(e.target.value))}
        style={styles.sliderInput} />
      <div style={styles.sliderTicks}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <span key={n} style={{...styles.tick,
            background: n <= value ? palette.gold : `${palette.gold}33`,
            transform: n === value ? 'scaleY(1.6)' : 'scaleY(1)',
            transition: 'all 0.3s ease'}} />
        ))}
      </div>
    </div>
  );
}

const globalStyles = (palette) => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${palette.bg}; color: #e8e1d6; font-family: 'Cormorant Garamond', serif; overflow-x: hidden; transition: background 1.5s ease; }
  ::selection { background: ${palette.gold}; color: ${palette.bg}; }
  .fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes letterReveal { from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
  @keyframes starPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
  @keyframes breathePulse { 0%, 100% { opacity: 0.6; letter-spacing: 0.3em; } 50% { opacity: 1; letter-spacing: 0.4em; } }
  @keyframes mandalaEmerge { from { opacity: 0; transform: scale(0.6) rotate(-30deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
  @keyframes starAppear { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
  @keyframes lineFade { from { opacity: 0; } to { opacity: 0.2; } }
  .reveal { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .reveal:nth-child(1) { animation-delay: 0.6s; }
  .reveal:nth-child(2) { animation-delay: 0.8s; }
  .hoverCard { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
  .hoverCard::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, ${palette.gold}1f 0%, transparent 70%); opacity: 0; transition: opacity 0.5s ease; pointer-events: none; }
  .hoverCard:hover { transform: translateY(-6px); border-color: ${palette.gold}80 !important; background: ${palette.gold}08 !important; box-shadow: 0 20px 40px -20px ${palette.gold}33; }
  .hoverCard:hover::before { opacity: 1; }
  .hoverCard.featured { background: linear-gradient(135deg, ${palette.gold}05 0%, transparent 100%) !important; }
  .navTabBtn { position: relative; transition: all 0.3s ease; padding-bottom: 6px !important; }
  .navTabBtn:hover { color: ${palette.gold} !important; }
  .navBrandLink { transition: opacity 0.3s ease; cursor: pointer; }
  .navBrandLink:hover { opacity: 0.7; }
  .navDiscordBtn:hover { background: ${palette.gold}0a !important; }
  .navDiscordBtn:hover span:last-child { color: ${palette.gold} !important; }
  .decoderOpt { transition: all 0.3s ease; }
  .decoderOpt:hover { background: ${palette.gold}14 !important; border-color: ${palette.gold} !important; transform: translateX(4px); }
  .footerLinkBtn { transition: color 0.3s ease, letter-spacing 0.3s ease; text-decoration: none; }
  .footerLinkBtn:hover { color: ${palette.gold} !important; letter-spacing: 0.4em !important; }
  .ritualSkipBtn { transition: opacity 0.3s ease, color 0.3s ease; opacity: 0.4; }
  .ritualSkipBtn:hover { opacity: 1; color: ${palette.cream} !important; }
  .sanctuaryEnterBtn { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: inline-block; text-decoration: none; }
  .sanctuaryEnterBtn:hover { letter-spacing: 0.5em !important; box-shadow: 0 0 32px ${palette.goldGlow}; transform: translateY(-2px); }
  input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; cursor: pointer; }
  input[type="range"]::-webkit-slider-track { height: 1px; background: ${palette.gold}4d; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${palette.gold}; margin-top: -8px; box-shadow: 0 0 16px ${palette.goldGlow}; transition: all 0.2s ease; }
  input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 0 24px ${palette.goldGlow}; }
  input[type="range"]::-moz-range-track { height: 1px; background: ${palette.gold}4d; }
  input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${palette.gold}; border: none; box-shadow: 0 0 16px ${palette.goldGlow}; }
  textarea, input[type="text"] { font-family: 'Cormorant Garamond', serif; color: ${palette.cream}; transition: border-color 0.3s ease, background 0.3s ease; }
  textarea:focus, input:focus { outline: none; border-color: ${palette.gold}99 !important; background: ${palette.gold}05; }
  button { cursor: pointer; font-family: 'JetBrains Mono', monospace; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  button:disabled { cursor: not-allowed; }
  .thinking span { animation: thinkPulse 1.4s infinite; display: inline-block; margin: 0 2px; font-size: 24px; }
  .thinking span:nth-child(2) { animation-delay: 0.2s; }
  .thinking span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes thinkPulse { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${palette.gold}33; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${palette.gold}66; }
`;

const styles = {
  app: { minHeight: '100vh', color: '#e8e1d6', fontFamily: "'Cormorant Garamond', serif", position: 'relative', transition: 'background 1.5s ease' },
  bgNoise: { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0.83 0 0 0 0 0.69 0 0 0 0 0.22 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`, pointerEvents: 'none', opacity: 0.25, mixBlendMode: 'overlay', zIndex: 0 },
  bgGradient: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, transition: 'background 2s ease' },
  loadingWrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, position: 'relative', zIndex: 1 },
  loadingText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' },
  
  // Onboarding
  onboardWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden', zIndex: 1 },
  onboardContent: { maxWidth: 600, textAlign: 'center', position: 'relative', zIndex: 2 },
  brandMark: { fontSize: 32, marginBottom: 24 },
  onboardTitle: { fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 300, letterSpacing: '0.02em', fontStyle: 'italic', marginBottom: 12 },
  onboardSubtitle: { fontSize: 14, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 60, fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 },
  onboardBody: { background: 'rgba(10, 9, 8, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212, 175, 55, 0.15)', padding: '48px 40px', borderRadius: 2 },
  onboardText: { fontSize: 18, lineHeight: 1.7, marginBottom: 20, color: '#c9c0b3', fontWeight: 300 },
  onboardInput: { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid', padding: '16px 4px', fontSize: 20, fontStyle: 'italic', textAlign: 'center', marginTop: 16, marginBottom: 32, fontFamily: "'Cormorant Garamond', serif" },
  onboardButton: { background: 'transparent', border: '1px solid', padding: '14px 36px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' },
  
  // Morning Ritual
  ritualWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden', zIndex: 1 },
  ritualSkip: { position: 'absolute', top: 32, right: 32, background: 'transparent', border: 'none', color: '#7a736a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', zIndex: 10 },
  ritualPhase: { textAlign: 'center', maxWidth: 600, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 },
  ritualText: { fontSize: 'clamp(28px, 5vw, 44px)', fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.02em' },
  ritualKinWrap: { padding: '40px 20px' },
  ritualEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 },
  ritualKinNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.4em', marginBottom: 32 },
  ritualKinName: { fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 32, letterSpacing: '-0.01em' },
  ritualKinPower: { fontSize: 16, fontStyle: 'italic', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 },
  ritualPrompt: { fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, fontStyle: 'italic', marginBottom: 32, lineHeight: 1.3 },
  ritualInput: { width: '100%', maxWidth: 500, background: 'transparent', border: '1px solid', padding: 20, fontSize: 18, fontStyle: 'italic', textAlign: 'center', resize: 'none', fontFamily: "'Cormorant Garamond', serif" },
  ritualBtn: { background: 'transparent', border: '1px solid', padding: '14px 40px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' },
  ritualActions: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  ritualDots: { position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 },
  ritualDot: { width: 6, height: 6, borderRadius: '50%', transition: 'background 0.4s ease' },
  
  // Nav
  nav: { position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'rgba(10, 9, 8, 0.65)', backdropFilter: 'blur(20px)', borderBottom: '1px solid', flexWrap: 'wrap', gap: 16 },
  navBrand: { display: 'flex', alignItems: 'center', gap: 12 },
  navStar: { fontSize: 16 },
  navTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', fontWeight: 400 },
  navTabs: { display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' },
  navTab: { background: 'transparent', border: 'none', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '8px 10px', fontFamily: "'JetBrains Mono', monospace" },
  navTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', display: 'flex', alignItems: 'center', gap: 6 },
  navMeta: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  navDiscord: { 
    display: 'flex', alignItems: 'center', gap: 8, 
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em',
    textTransform: 'uppercase', padding: '4px 10px',
    borderLeft: '1px solid rgba(212, 175, 55, 0.15)',
    transition: 'all 0.3s ease',
  },
  
  main: { maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px', position: 'relative', zIndex: 1 },
  
  // Home
  homeHero: { position: 'relative', minHeight: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 80 },
  homeMandalaWrap: { position: 'absolute', opacity: 0.75 },
  homeOverlay: { position: 'relative', textAlign: 'center', zIndex: 2, background: 'radial-gradient(circle, rgba(10,9,8,0.7) 0%, transparent 70%)', padding: '60px 20px' },
  homeDate: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', marginBottom: 24 },
  kinNumber: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.4em', marginBottom: 32 },
  homeTitle: { fontSize: 'clamp(40px, 8vw, 96px)', fontWeight: 300, lineHeight: 1.05, marginBottom: 40, fontStyle: 'italic', letterSpacing: '-0.01em' },
  homeMeta: { display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  metaLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7a736a' },
  metaValue: { fontSize: 20, fontStyle: 'italic' },
  metaDivider: { color: '#7a736a', fontSize: 24 },
  homePower: { fontSize: 16, color: '#a89e8e', fontStyle: 'italic', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 },
  todayIntention: { marginTop: 32, padding: '20px 28px', border: '1px solid', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' },
  intentionLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 },
  intentionText: { fontSize: 17, fontStyle: 'italic', lineHeight: 1.5 },
  homeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 },
  homeCard: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: '28px 24px', textAlign: 'left', color: '#e8e1d6', cursor: 'pointer' },
  cardEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12, opacity: 0.8 },
  cardNum: { fontSize: 44, fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', marginBottom: 8 },
  cardLabel: { fontSize: 13, letterSpacing: '0.05em', color: '#a89e8e', marginBottom: 20, lineHeight: 1.4 },
  cardAction: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' },
  
  // Constellation
  constellationLegend: { textAlign: 'center', marginTop: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' },
  
  // Mirror
  mirrorHeadline: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48, textAlign: 'center' },
  mirrorBig: { padding: '32px 16px' },
  mirrorBigNum: { fontSize: 'clamp(48px, 7vw, 80px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, marginBottom: 12 },
  mirrorBigLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#a89e8e' },
  mirrorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  mirrorCard: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: '32px 28px' },
  mirrorCardLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 },
  mirrorList: { display: 'flex', flexDirection: 'column', gap: 12 },
  mirrorListRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, color: '#a89e8e' },
  mirrorVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 18 },
  mirrorPillar: { fontSize: 24, fontStyle: 'italic', fontWeight: 300, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 },
  mirrorPillarNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.2em' },
  mirrorSubtext: { fontSize: 13, color: '#7a736a', fontStyle: 'italic' },
  mirrorSymbols: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  mirrorSymbol: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid', borderRadius: 20 },
  mirrorSymbolName: { fontSize: 15, fontStyle: 'italic' },
  mirrorSymbolCount: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em' },
  
  // Sanctuary
  sanctuaryCard: { position: 'relative', border: '1px solid', padding: '48px', overflow: 'hidden', background: 'rgba(10, 9, 8, 0.4)', marginBottom: 48 },
  sanctuaryContent: { position: 'relative', zIndex: 2, maxWidth: 600 },
  sanctuaryEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 },
  sanctuaryName: { fontSize: 'clamp(28px, 4vw, 40px)', fontStyle: 'italic', fontWeight: 300, marginBottom: 20, lineHeight: 1.2 },
  sanctuaryDesc: { fontSize: 17, color: '#a89e8e', lineHeight: 1.7, marginBottom: 32, fontStyle: 'italic' },
  sanctuaryStats: { display: 'flex', alignItems: 'center', gap: 32, marginBottom: 40, flexWrap: 'wrap' },
  sanctuaryStat: { display: 'flex', flexDirection: 'column', gap: 4 },
  sanctuaryStatVal: { fontSize: 28, fontStyle: 'italic', fontWeight: 300 },
  sanctuaryStatLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7a736a' },
  sanctuaryDivider: { width: 1, height: 32, background: 'rgba(212, 175, 55, 0.2)' },
  sanctuaryBtn: { padding: '16px 40px', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", border: '1px solid', cursor: 'pointer', fontWeight: 500 },
  sanctuaryFeatures: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 },
  sanctuaryFeature: { padding: '32px 28px', border: '1px solid', background: 'rgba(10, 9, 8, 0.3)' },
  featureNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', marginBottom: 16 },
  featureName: { fontSize: 22, fontStyle: 'italic', fontWeight: 300, marginBottom: 12 },
  featureDesc: { fontSize: 14, color: '#a89e8e', lineHeight: 1.6, fontStyle: 'italic' },
  
  // Content
  contentWrap: { maxWidth: 800, margin: '0 auto' },
  contentHeader: { marginBottom: 60, textAlign: 'center' },
  contentEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 16 },
  contentTitle: { fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, fontStyle: 'italic', marginBottom: 16, lineHeight: 1.1 },
  contentSubtitle: { fontSize: 16, color: '#a89e8e', fontStyle: 'italic', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 },
  
  sigDetail: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 },
  sigCard: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: '40px 32px' },
  sigCardLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 },
  sigCardName: { fontSize: 32, fontStyle: 'italic', marginBottom: 12, fontWeight: 300 },
  sigCardMeta: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: '#7a736a', marginBottom: 20 },
  sigCardPower: { fontSize: 16, color: '#a89e8e', fontStyle: 'italic', lineHeight: 1.6 },
  sigInsight: { border: '1px solid', padding: '40px', textAlign: 'center', marginBottom: 80 },
  sigInsightLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 },
  sigInsightText: { fontSize: 18, lineHeight: 1.7, fontStyle: 'italic' },
  
  feedWrap: { marginTop: 48 },
  feedHeader: { textAlign: 'center', marginBottom: 40 },
  feedEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12 },
  feedTitle: { fontSize: 28, fontStyle: 'italic', fontWeight: 300, marginBottom: 12 },
  feedSubtitle: { fontSize: 14, color: '#a89e8e', fontStyle: 'italic' },
  feedForm: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 28, marginBottom: 32 },
  feedInput: { width: '100%', background: 'transparent', border: '1px solid', padding: 16, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', resize: 'vertical', marginBottom: 16, lineHeight: 1.5 },
  feedFormBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  feedCharCount: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#7a736a', letterSpacing: '0.1em' },
  feedSubmit: { background: 'transparent', border: '1px solid', padding: '10px 24px', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' },
  feedList: { display: 'flex', flexDirection: 'column', gap: 16 },
  feedEntry: { background: 'rgba(10, 9, 8, 0.3)', borderLeft: '1px solid', padding: '20px 24px', transition: 'all 0.3s ease' },
  feedEntryText: { fontSize: 17, color: '#e8e1d6', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 12 },
  feedEntryMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  feedAnon: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a736a' },
  feedTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#7a736a' },
  
  syncForm: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 32, marginBottom: 32 },
  syncTypes: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  syncTypeBtn: { background: 'transparent', border: '1px solid', padding: '6px 14px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' },
  syncInput: { width: '100%', background: 'transparent', border: '1px solid', padding: 16, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', resize: 'vertical', marginBottom: 16 },
  syncSubmit: { background: 'transparent', border: '1px solid', padding: '12px 32px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' },
  syncList: { display: 'flex', flexDirection: 'column', gap: 16 },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#7a736a', fontStyle: 'italic', fontSize: 16 },
  syncEntry: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 24 },
  syncEntryHead: { display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' },
  syncTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', border: '1px solid', padding: '3px 8px' },
  syncDate: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7a736a' },
  syncKin: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7a736a', marginLeft: 'auto' },
  syncEntryText: { fontSize: 17, lineHeight: 1.6 },
  
  dreamEntry: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 24, position: 'relative' },
  dreamSymbols: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 },
  dreamSymbol: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'lowercase', border: '1px solid', padding: '3px 10px', borderRadius: 12 },
  
  progressBar: { marginBottom: 48 },
  progressBarLabel: { display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89e8e', marginBottom: 8 },
  progressTrack: { width: '100%', height: 2, position: 'relative', overflow: 'hidden' },
  progressFill: { height: '100%', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' },
  pillarsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  pillarCard: { border: '1px solid', transition: 'all 0.4s ease', overflow: 'hidden' },
  pillarHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', textAlign: 'left' },
  pillarHeaderLeft: { display: 'flex', alignItems: 'center', gap: 24 },
  pillarNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.2em' },
  pillarTitleWrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  pillarName: { fontSize: 22, fontStyle: 'italic', fontWeight: 300 },
  pillarSubtitle: { fontSize: 13, color: '#7a736a', fontStyle: 'italic' },
  pillarChevron: { fontSize: 28, fontWeight: 300, transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' },
  pillarBody: { padding: '0 28px 32px 28px' },
  pillarSummary: { fontSize: 16, lineHeight: 1.7, marginBottom: 28, fontStyle: 'italic' },
  pillarPromptsLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 },
  pillarPromptBlock: { marginBottom: 24 },
  pillarPrompt: { fontSize: 17, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 },
  pillarInput: { width: '100%', background: 'transparent', border: '1px solid', padding: 14, fontSize: 15, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', resize: 'vertical' },
  pillarTimestamp: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#5a544c', letterSpacing: '0.1em', marginTop: 6 },
  
  decoderProgress: { marginBottom: 32 },
  decoderProgressText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7a736a' },
  decoderQuestion: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 40 },
  decoderQuestionText: { fontSize: 24, fontStyle: 'italic', marginBottom: 32, lineHeight: 1.3, fontWeight: 300 },
  decoderOptions: { display: 'flex', flexDirection: 'column', gap: 12 },
  decoderOption: { background: 'transparent', border: '1px solid', color: '#e8e1d6', padding: '18px 24px', textAlign: 'left', fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', cursor: 'pointer', lineHeight: 1.5 },
  decoderResult: { border: '1px solid', padding: 48, textAlign: 'center' },
  decoderResultLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 },
  decoderResultTitle: { fontSize: 'clamp(28px, 4vw, 40px)', fontStyle: 'italic', fontWeight: 300, marginBottom: 8 },
  decoderResultSubtitle: { fontSize: 16, fontStyle: 'italic', marginBottom: 24 },
  decoderResultText: { fontSize: 17, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' },
  decoderActions: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  
  alignForm: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', padding: 40, marginBottom: 32 },
  slider: { marginBottom: 32 },
  sliderHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sliderLabel: { fontSize: 18, fontStyle: 'italic' },
  sliderSubtitle: { fontSize: 12, color: '#7a736a', marginTop: 2 },
  sliderValue: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontStyle: 'italic', fontWeight: 300 },
  sliderInput: { marginBottom: 12 },
  sliderTicks: { display: 'flex', justifyContent: 'space-between', paddingTop: 4 },
  tick: { width: 1, height: 6, transformOrigin: 'center' },
  alignResult: { display: 'flex', gap: 48, alignItems: 'center', border: '1px solid', padding: 40, flexWrap: 'wrap', justifyContent: 'center' },
  coherenceRing: { position: 'relative', width: 200, height: 200 },
  coherenceNum: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontStyle: 'italic', fontWeight: 300 },
  coherencePct: { fontSize: 20, color: '#a89e8e' },
  alignBreakdown: { flex: 1, minWidth: 240 },
  alignRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid', fontSize: 16, color: '#a89e8e' },
  alignVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14 },
  
  chatWrap: { background: 'rgba(10, 9, 8, 0.4)', border: '1px solid', height: 600, display: 'flex', flexDirection: 'column' },
  
  // Self-Inquiry
  inquiryTabs: { display: 'flex', gap: 0, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' },
  inquiryTabBtn: {
    background: 'transparent', border: 'none', borderBottom: '1px solid',
    padding: '12px 24px', fontSize: 11, letterSpacing: '0.3em',
    textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.3s ease',
  },
  inquiryCard: {
    background: 'rgba(10, 9, 8, 0.4)', border: '1px solid',
    padding: '48px 40px',
  },
  inquiryHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 32,
  },
  inquiryPillarTag: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.3em', textTransform: 'uppercase',
    border: '1px solid', padding: '4px 12px',
  },
  bookmarkBtn: {
    background: 'transparent', border: 'none', fontSize: 24,
    cursor: 'pointer', padding: 4, transition: 'all 0.3s ease',
  },
  inquiryQuestion: {
    fontSize: 'clamp(22px, 3vw, 32px)', fontStyle: 'italic',
    fontWeight: 300, lineHeight: 1.4, marginBottom: 32,
  },
  inquiryInput: {
    width: '100%', background: 'transparent', border: '1px solid',
    padding: 20, fontSize: 16, fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic', resize: 'vertical', marginBottom: 24,
    lineHeight: 1.6,
  },
  inquiryActions: {
    display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start',
  },
  inquiryDrawCard: {
    background: 'rgba(10, 9, 8, 0.4)', border: '1px solid',
    padding: '60px 40px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  inquiryDrawText: {
    fontSize: 18, fontStyle: 'italic', marginBottom: 32,
    maxWidth: 480, lineHeight: 1.6,
  },
  inquiryDrawBtn: {
    padding: '16px 40px', fontSize: 12, letterSpacing: '0.3em',
    textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace",
    border: '1px solid', cursor: 'pointer', fontWeight: 500,
  },
  inquiryHint: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.2em', color: '#7a736a', marginTop: 24,
    textTransform: 'uppercase',
  },
  inquiryBookmarkList: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  bookmarkItem: {
    display: 'flex', gap: 16, alignItems: 'center',
    background: 'rgba(10, 9, 8, 0.3)', border: '1px solid',
    padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  bookmarkStar: {
    color: '#d4af37', fontSize: 14, flexShrink: 0,
  },
  bookmarkText: {
    fontSize: 15, fontStyle: 'italic', lineHeight: 1.5,
  },
  inquiryHistoryList: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  inquiryHistoryEntry: {
    background: 'rgba(10, 9, 8, 0.4)', border: '1px solid',
    padding: 24,
  },
  inquiryHistoryQuestion: {
    fontSize: 18, fontStyle: 'italic', marginBottom: 16,
    lineHeight: 1.5, fontWeight: 300,
  },
  inquiryHistoryResponse: {
    fontSize: 15, color: '#a89e8e', lineHeight: 1.7,
    paddingLeft: 16, borderLeft: '1px solid rgba(212, 175, 55, 0.2)',
    fontStyle: 'italic',
  },
  chatMessages: { flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 },
  chatMsgUser: { alignSelf: 'flex-end', maxWidth: '75%', border: '1px solid', padding: '16px 20px', fontSize: 16, lineHeight: 1.6, color: '#e8e1d6' },
  chatMsgAI: { alignSelf: 'flex-start', maxWidth: '85%', fontSize: 17, lineHeight: 1.7, color: '#e8e1d6', fontStyle: 'italic' },
  chatAILabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8, fontStyle: 'normal' },
  chatInputWrap: { borderTop: '1px solid', padding: 24, display: 'flex', gap: 12 },
  chatInput: { flex: 1, background: 'transparent', border: '1px solid', padding: 12, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', resize: 'none' },
  chatSend: { background: 'transparent', border: '1px solid', padding: '0 24px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' },
  thinking: { display: 'flex', gap: 4 },
  
  footer: { textAlign: 'center', padding: '60px 20px 40px', position: 'relative', zIndex: 1 },
  footerOrnament: { fontSize: 18, marginBottom: 24 },
  footerLinks: { display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 },
  footerLink: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none' },
  footerSep: { color: '#5a544c', fontSize: 12 },
  footerMeta: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: '#5a544c', textTransform: 'uppercase' },
};
