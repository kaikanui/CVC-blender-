/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, Flame, Star, Trophy, RefreshCw, 
  Sparkles, Heart, ArrowRight, CheckCircle2, XCircle, ChevronRight, HelpCircle
} from 'lucide-react';
import { WordItem, GameLevel } from '../types.ts';
import { generateQuestion } from '../data.ts';
import { audio } from './AudioPlayer.ts';
import HandTracker from './HandTracker.tsx';

// Montessori and Orton-Gillingham sounding blocks styled with authentic Natural Tones
const PHONEME_STYLING = {
  consonant: {
    color: 'text-[#3d405b]',
    bg: 'bg-[#f4f1de] border-[#3d405b]/20',
    label: 'Consonant Sound',
  },
  vowel: {
    color: 'text-[#e07a5f]',
    bg: 'bg-[#e07a5f]/10 border-[#e07a5f]/40',
    label: 'Vowel Sound',
  },
  digraph: {
    color: 'text-[#81b29a]',
    bg: 'bg-[#81b29a]/15 border-[#81b29a]/40',
    label: 'Digraph/Blend',
  },
};

export default function PhonicsGameBoard() {
  // Game state
  const [level, setLevel] = useState<GameLevel>(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highStreak, setHighStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Current question assets
  const [question, setQuestion] = useState<{ target: WordItem; choices: WordItem[] } | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [matchState, setMatchState] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [advanceSecondsLeft, setAdvanceSecondsLeft] = useState(0);

  // Web camera sensor options - Default to off/touch for instant load and flawless performance on older iPads
  const [cameraActive, setCameraActive] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'finger' | 'touch'>('touch');

  // Ref to hold the active timeout for clearing incorrect selections
  const incorrectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (incorrectTimeoutRef.current) {
        clearTimeout(incorrectTimeoutRef.current);
      }
    };
  }, []);

  // Trigger loading next question loop
  useEffect(() => {
    loadNextQuestion();
  }, [level]);

  // Handle sound settings toggle
  useEffect(() => {
    audio.toggleSound(soundEnabled);
  }, [soundEnabled]);

  const loadNextQuestion = () => {
    setSelectedIdx(null);
    setMatchState('none');
    setIsAutoAdvancing(false);

    if (incorrectTimeoutRef.current) {
      clearTimeout(incorrectTimeoutRef.current);
      incorrectTimeoutRef.current = null;
    }
    
    const previousId = question?.target?.id;
    const q = generateQuestion(level, previousId);
    setQuestion(q);
  };

  // Montessori sound breakups to tokenize words beautifully!
  function tokenizePhonemes(word: string): { text: string; type: 'consonant' | 'vowel' | 'digraph' }[] {
    const digraphs = ['ch', 'sh', 'th', 'wh', 'ck', 'ng', 'sh', 'll'];
    const complexVowels = ['ee', 'ea', 'oa', 'ai', 'ay', 'ou', 'ow', 'oo', 'oi', 'oy'];
    const vowelsList = ['a', 'e', 'i', 'o', 'u', 'y'];
    
    const tokens: { text: string; type: 'consonant' | 'vowel' | 'digraph' }[] = [];
    let i = 0;
    while (i < word.length) {
      const nextTwo = word.substring(i, i + 2).toLowerCase();
      
      // 1. Check complex vowel teams
      if (complexVowels.includes(nextTwo)) {
        tokens.push({ text: word.substring(i, i + 2), type: 'vowel' });
        i += 2;
        continue;
      }
      
      // 2. Check consonant digraphs
      if (digraphs.includes(nextTwo)) {
        tokens.push({ text: word.substring(i, i + 2), type: 'digraph' });
        i += 2;
        continue;
      }
      
      // 3. Fallback to single character rules
      const char = word[i];
      const charLower = char.toLowerCase();
      if (vowelsList.includes(charLower)) {
        tokens.push({ text: char, type: 'vowel' });
      } else {
        tokens.push({ text: char, type: 'consonant' });
      }
      i++;
    }
    return tokens;
  }

  // Speak sounding phonemes slowly for phonetic practice
  const processPhonicsReading = () => {
    if (!question) return;
    const tokens = tokenizePhonemes(question.target.word);
    const soundArray = tokens.map(t => t.text.toLowerCase());
    
    audio.speakPhonicsAndBlend(question.target.word, soundArray);
  };

  // Handle choice selection (from camera or click fallback)
  const handleSelectChoice = (choiceIndex: number) => {
    if (matchState === 'correct' || isAutoAdvancing) return;

    if (incorrectTimeoutRef.current) {
      clearTimeout(incorrectTimeoutRef.current);
      incorrectTimeoutRef.current = null;
    }

    setSelectedIdx(choiceIndex);
    const chosenWord = question?.choices[choiceIndex];

    const isMatch = level === 'first-sound'
      ? chosenWord?.word.toLowerCase().startsWith(question?.target.word.toLowerCase())
      : chosenWord?.id === question?.target.id;

    if (isMatch) {
      // CORRECT CHOICE MATCHED!
      setMatchState('correct');
      setScore(prev => prev + 10);
      setStreak(prev => {
        const next = prev + 1;
        if (next > highStreak) setHighStreak(next);
        return next;
      });

      audio.playSuccess();
      
      // Trigger temporary visual counting auto-advance timer of 3 seconds for kids to digest
      setIsAutoAdvancing(true);
      setAdvanceSecondsLeft(3);
    } else {
      // INCORRECT SELECTION!
      setMatchState('incorrect');
      setStreak(0); // Break streak on error, but keep high score
      audio.playIncorrect();
      
      // Reset after brief highlight to allow retry
      incorrectTimeoutRef.current = setTimeout(() => {
        setMatchState('none');
        setSelectedIdx(null);
        incorrectTimeoutRef.current = null;
      }, 2500);
    }
  };

  // Advancer count countdown clock
  useEffect(() => {
    if (isAutoAdvancing && advanceSecondsLeft > 0) {
      const timer = setTimeout(() => {
        setAdvanceSecondsLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAutoAdvancing && advanceSecondsLeft === 0) {
      loadNextQuestion();
    }
  }, [isAutoAdvancing, advanceSecondsLeft]);

  return (
    <div id="phonics-main-layout" className="w-full h-full flex flex-col text-[#3d405b] font-sans bg-[#fdfcf0] transition-colors duration-300 overflow-hidden">
      
      {/* Natural Tones Top Navigation Header */}
      <header className="bg-[#f4f1de] border-b border-[#e07a5f]/20 px-6 py-3 flex flex-row items-center justify-between gap-4 shadow-sm shrink-0">
        
        {/* Progress Tracker integrated in Header as requested */}
        <div id="top-progress-tracker" className="flex items-center gap-3 bg-white/95 border border-[#e07a5f]/15 px-4 py-2 rounded-2xl shadow-sm tracking-tight shrink-0">
          <div className="flex items-center gap-1 text-xs font-black text-[#3d405b] uppercase">
            <Trophy className="w-4 h-4 text-[#e07a5f]" />
            <span className="hidden sm:inline">Tracker:</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#3d405b]">
            <span className="text-sm">⭐</span>
            <span>Score: <span className="font-extrabold text-[#e07a5f]">{score}</span></span>
          </div>
          <div className="w-px h-4 bg-[#3d405b]/10" />
          <div className="flex items-center gap-1 text-xs font-bold text-[#3d405b]">
            <span className="text-sm">🔥</span>
            <span>Run: <span className="font-extrabold text-[#e07a5f]">{streak}</span></span>
          </div>
          <div className="w-px h-4 bg-[#3d405b]/10" />
          <div className="flex items-center gap-1 text-xs font-bold text-[#3d405b]">
            <span className="text-sm">🏆</span>
            <span>Best: <span className="font-extrabold text-[#81b29a]">{highStreak}</span></span>
          </div>
        </div>

        {/* Natural Tones Level Tags and Tabs bar wrapper */}
        <div id="difficulty-tabs-wrapper" className="flex flex-wrap items-center gap-1 bg-[#e9edc9] p-1 rounded-xl border border-[#3d405b]/10 overflow-x-auto max-w-full">
          {[
            { idx: 'first-sound', label: 'First Sounds', icon: '🔤' },
            { idx: 1, label: 'CVC', icon: '🐱' },
            { idx: 2, label: 'Blends', icon: '🐸' },
            { idx: 3, label: 'Digraphs', icon: '🦆' },
            { idx: 4, label: 'Advanced', icon: '⛵' },
            { idx: 'heart', label: 'Heart', icon: '❤️' }
          ].map((tab) => {
            const active = level === tab.idx;
            return (
              <button
                id={`tab-btn-${tab.idx}`}
                key={tab.idx}
                onClick={() => setLevel(tab.idx as GameLevel)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer text-[11px] font-bold leading-none select-none ${
                  active 
                    ? 'bg-white text-[#3d405b] shadow-md border border-[#e07a5f]/15 scale-[1.02]'
                    : 'text-[#3d405b]/65 hover:text-[#3d405b] hover:bg-white/45'
                }`}
              >
                <span className="text-sm shrink-0">
                  {tab.idx === 'heart' ? '❤️' : tab.idx === 'first-sound' ? '🔤' : tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Muting controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-full p-2 bg-white hover:bg-white text-[#3d405b] border border-[#e07a5f]/10 transition shadow-sm cursor-pointer"
            title={soundEnabled ? 'Mute Phonics' : 'Unmute Phonics'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#81b29a]" /> : <VolumeX className="w-4 h-4 text-[#e07a5f]" />}
          </button>
        </div>
      </header>

      {/* Main Core Layout Bento Grid */}
      <main className="w-full flex-1 min-h-0 px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
        
        {/* LEFT COLUMN: Camera Sensor */}
        <section className="md:col-span-4 flex flex-col gap-4 min-h-0">
          {/* PHYSICAL CAMERA TRACKER CONTAINER */}
          <HandTracker
            onSelectChoice={handleSelectChoice}
            choicesCount={question?.choices?.length || 4}
            isCorrect={matchState === 'correct'}
            cameraActive={cameraActive}
            setCameraActive={setCameraActive}
            trackingMode={trackingMode}
            setTrackingMode={setTrackingMode}
          />
        </section>

        {/* RIGHT COLUMN: Natural Tones Big Interactive Play Board */}
        <section className="md:col-span-8 flex flex-col gap-4 items-stretch justify-start min-h-0">
          
          {/* THE GIANT TARGET WORD SCREEN AT THE TOP - BEAUTIFUL SAGE EXTRA BOARD BORDER */}
          <div id="target-word-display" className="bg-white px-6 py-4 rounded-3xl shadow-sm border-4 border-[#81b29a] text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden flex-1 min-h-[11rem]">
            {/* Elegant organic style background details */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#f2cc8f]/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#81b29a]/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col gap-1 w-full">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#81b29a]">
                {level === 'first-sound' ? 'Initial Letter Sound Level' : 'Read and sound out this word'}
              </span>
              
              {/* Giant Word displayed as a single, combined word */}
              {question ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-2">
                  {level === 'first-sound' ? (
                    <>
                      <div className="flex flex-row items-center gap-4">
                        <span className="text-6xl md:text-7xl font-black text-[#e07a5f] tracking-wide select-none drop-shadow-md bg-stone-50 border-2 border-[#e07a5f]/20 rounded-2xl px-6 py-2 shadow-inner">
                          {question.target.word}
                        </span>
                      </div>
                      
                      <span className="text-xs font-bold text-[#3d405b]/70 mt-1">
                        Find the picture starting with the sound of <span className="font-extrabold text-[#e07a5f]">"{question.target.word}"</span>!
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl md:text-6xl font-extrabold text-[#3d405b] tracking-wider capitalize leading-none drop-shadow-sm">
                        {question.target.word}
                      </span>
                      {question.target.category === 'heart' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 mt-1 animate-pulse select-none shadow-sm">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Heart Word
                        </span>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="w-24 h-12 rounded-xl bg-[#e9edc9]/50 animate-pulse mt-2 mx-auto" />
              )}
            </div>

            {question?.target.hint && (
              <div className="text-[10px] font-semibold text-[#3d405b]/75 italic bg-[#f2cc8f]/20 rounded-lg py-1 px-3 border border-[#f2cc8f]/30 max-w-lg mx-auto">
                Family Note: {question.target.hint}
              </div>
            )}
          </div>

          {/* COLOR STATUS BANNER WITH NATURAL TONES HIGHLIGHTING */}
          <div id="status-interactive-strip" className="relative shrink-0">
            <AnimatePresence mode="wait">
              {matchState === 'correct' ? (
                <motion.div
                  key="correct-banner"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#81b29a] text-white rounded-xl p-2.5 px-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce text-white" />
                    <div>
                      <h4 className="font-extrabold text-[#3d405b] text-sm leading-tight">Amazing Reading! 🎉</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg py-1 px-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Next Word in {advanceSecondsLeft}s</span>
                    <ArrowRight className="w-3.5 h-3.5 animate-ping text-[#3d405b]" />
                  </div>
                </motion.div>
              ) : matchState === 'incorrect' ? (
                <motion.div
                  key="incorrect-banner"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#e07a5f] text-white rounded-xl p-2.5 px-4 flex items-center gap-2 shadow-sm"
                >
                  <span className="text-lg animate-wiggle inline-block">⭐</span>
                  <div>
                    <h4 className="font-bold text-xs leading-tight">Close Try! Let's check another card.</h4>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default-banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#f4f1de]/70 border border-[#3d405b]/10 rounded-xl p-2 px-3 flex items-center justify-between text-[#3d405b]/80"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <HelpCircle className="w-3.5 h-3.5 text-[#e07a5f] shrink-0" />
                    <span>Point with hand camera, or hover choice card to select!</span>
                  </div>
                  {question?.target.category === 'heart' && (
                    <span className="bg-[#e07a5f]/10 text-[#e07a5f] font-extrabold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                       heart word
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* IMAGES GRID MATCH SPACES WITH NATURAL BUBBLE CLUE CIRCLES */}
          <div 
            id="phonics-images-match-grid" 
            className="grid grid-cols-2 gap-3 shrink-0"
          >
            {question ? (
              question.choices.map((choice, index) => {
                const isSelected = selectedIdx === index;
                
                // Beautiful Natural Tones matching configurations
                let borderStyle = 'border-transparent hover:border-[#81b29a]';
                let backgroundStyle = 'bg-white hover:scale-[1.01]';

                if (isSelected) {
                  if (matchState === 'correct') {
                    borderStyle = 'border-[#81b29a] ring-2 ring-[#81b29a]/20';
                    backgroundStyle = 'bg-[#81b29a]/5';
                  } else if (matchState === 'incorrect') {
                    borderStyle = 'border-[#e07a5f] ring-2 ring-[#e07a5f]/20 animate-wiggle';
                    backgroundStyle = 'bg-[#e07a5f]/5';
                  }
                }

                // Friendly graphic bubbles in Natural Tones: f2cc8f, e9edc9, 81b29a, e07a5f
                const backgroundBubbles = [
                  'bg-[#f2cc8f]/25',
                  'bg-[#e9edc9]',
                  'bg-[#81b29a]/25',
                  'bg-[#e07a5f]/15'
                ];
                const bubbleColor = backgroundBubbles[index % backgroundBubbles.length];

                return (
                  <motion.div
                    key={choice.id + index}
                    data-choice-index={index}
                    onClick={() => handleSelectChoice(index)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className={`phonics-match-choice group relative flex flex-col items-center justify-center p-2.5 border-2 rounded-2xl cursor-pointer text-center select-none shadow-sm transition-all duration-150 h-28 md:h-32 ${borderStyle} ${backgroundStyle}`}
                  >
                    {/* Natural Tone Bubble behind choice emoji */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${bubbleColor} shrink-0`}>
                      <span 
                        className="text-4xl select-none filter drop-shadow-sm pointer-events-none"
                        style={{ contentVisibility: 'auto' }}
                      >
                        {choice.emoji}
                      </span>
                    </div>

                    {/* Word text with beautiful letter highlighting - only for heart words */}
                    {choice.category === 'heart' && (
                      <span className="text-xs font-black text-[#3d405b] uppercase mt-1 tracking-wide">
                        {level === 'first-sound' ? (
                          <>
                            <span className="text-[#e07a5f] font-extrabold decoration-[#e07a5f] underline underline-offset-2">
                              {choice.word[0]}
                            </span>
                            <span>
                              {choice.word.slice(1)}
                            </span>
                          </>
                        ) : (
                          choice.word
                        )}
                      </span>
                    )}

                    {/* Badge checkers absolute */}
                    {isSelected && matchState === 'correct' && (
                      <div className="absolute top-2.5 right-2.5 text-[#81b29a] pointer-events-none">
                        <CheckCircle2 className="w-5 h-5 fill-white" />
                      </div>
                    )}
                    {isSelected && matchState === 'incorrect' && (
                      <div className="absolute top-2.5 right-2.5 text-[#e07a5f] pointer-events-none">
                        <XCircle className="w-5 h-5 fill-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              // Skeletal loading fallbacks
              Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white/60 border border-[#3d405b]/10 rounded-2xl h-24 md:h-28 animate-pulse" 
                />
              ))
            )}
          </div>

          {/* NEXT SKIP CONTROLS */}
          <div className="flex justify-end shrink-0">
            <button
              onClick={loadNextQuestion}
              className="px-4 py-1.5 rounded-lg border border-[#3d405b]/15 bg-white hover:bg-white/90 text-[#3d405b] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition shadow-sm"
            >
              Skip word <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>
      </main>

      {/* Decorative Natural Tone footer instructions */}
      <footer className="py-2 border-t border-[#e07a5f]/15 bg-[#f4f1de]/40 text-center text-[#3d405b]/60 text-[9px] shrink-0">
        <p className="max-w-2xl mx-auto px-4 leading-normal">
          Phonics matching game styled using Natural Tones supporting Orton-Gillingham learning.
        </p>
      </footer>
    </div>
  );
}
