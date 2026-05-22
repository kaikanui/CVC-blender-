/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, AlertCircle, RefreshCw, Eye, Touchpad, HelpCircle } from 'lucide-react';
import { audio } from './AudioPlayer.ts';

interface HandTrackerProps {
  onSelectChoice: (index: number) => void;
  choicesCount: number;
  isCorrect: boolean | null;
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
  trackingMode: 'finger' | 'touch';
  setTrackingMode: (mode: 'finger' | 'touch') => void;
  onCalibrationUpdate?: (x: number, y: number) => void;
}

export default function HandTracker({
  onSelectChoice,
  choicesCount,
  isCorrect,
  cameraActive,
  setCameraActive,
  trackingMode,
  setTrackingMode,
}: HandTrackerProps) {
  const onSelectChoiceRef = useRef(onSelectChoice);
  useEffect(() => {
    onSelectChoiceRef.current = onSelectChoice;
  }, [onSelectChoice]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const isMovementLockedRef = useRef(false);
  const wasCorrectRef = useRef(false);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Floating coordinates for the UI dot (smoothed)
  const [dotPos, setDotPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isDwellActive, setIsDwellActive] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 100
  const lastDwellProgressRef = useRef(0);

  // Reset the tracking dot back to the center of the screen when correct answer is achieved
  // and keep it locked there until 2 seconds after the new word pops up
  useEffect(() => {
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;

    if (isCorrect) {
      dotRef.current = { x: midX, y: midY };
      setDotPos({ x: midX, y: midY });
      
      // Lock movement immediately
      isMovementLockedRef.current = true;
      wasCorrectRef.current = true;
      
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    } else {
      // If we were in correct state and now we are not (new word popped up),
      // keep it locked for exactly 2 seconds from this moment.
      if (wasCorrectRef.current) {
        wasCorrectRef.current = false;
        isMovementLockedRef.current = true;
        dotRef.current = { x: midX, y: midY };
        setDotPos({ x: midX, y: midY });

        if (unlockTimerRef.current) {
          clearTimeout(unlockTimerRef.current);
        }

        unlockTimerRef.current = setTimeout(() => {
          isMovementLockedRef.current = false;
          unlockTimerRef.current = null;
        }, 2000);
      }
    }
  }, [isCorrect]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);
  const [mediaPipeStatus, setMediaPipeStatus] = useState<'unloaded' | 'loading' | 'ready' | 'failed'>('unloaded');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);

  // Stats for visual debugging / feedback
  const [debugFps, setDebugFps] = useState(0);
  const [activeMotionLevel, setActiveMotionLevel] = useState(0);

  // References for tracking loops
  const streamRef = useRef<MediaStream | null>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const requestRef = useRef<number | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);
  const currentHoveredIndexRef = useRef<number | null>(null);
  const cameraUtilsLoadedRef = useRef(false);
  const handsClassLoadedRef = useRef(false);
  const mpInstanceRef = useRef<any>(null);
  const mpCameraRef = useRef<any>(null);

  // Dwell parameters
  const DWELL_DURATION = 1250; // 1.25 seconds standard dwell

  // Load scripts helper
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(s);
    });
  };

  // Initialize MediaPipe Script Loading
  const initMediaPipeScripts = async () => {
    if (mediaPipeStatus === 'loading' || mediaPipeStatus === 'ready') return;
    
    setMediaPipeStatus('loading');
    setErrorMessage(null);
    try {
      // 1. Load Camera Utils CDN
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
      cameraUtilsLoadedRef.current = true;
      
      // 2. Load Hands CDN
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
      handsClassLoadedRef.current = true;
      
      setMediaPipeStatus('ready');
      console.log('MediaPipe CDN scripts downloaded successfully!');
    } catch (e: any) {
      console.warn('MediaPipe script loading failed, falling back to Hover Touch Mode:', e);
      setMediaPipeStatus('failed');
      setTrackingMode('touch'); // Automatic fail-safe mode setup
    }
  };

  // Turn camera ON or OFF
  useEffect(() => {
    if (cameraActive) {
      startCamera();
      // If finger mode is requested, load the scripts
      if (trackingMode === 'finger') {
        initMediaPipeScripts();
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive, trackingMode]);

  const startCamera = async () => {
    stopCamera();
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn(e));
        };
      }
      setHasCameraAccess(true);
    } catch (err: any) {
      console.error('Camera capture failed:', err);
      setHasCameraAccess(false);
      setErrorMessage('Could not open camera. Please grant camera access or use the Hover / Touch mode!');
      setCameraActive(false);
      setTrackingMode('touch');
    }
  };

  const stopCamera = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (mpCameraRef.current) {
      try {
        mpCameraRef.current.stop();
      } catch (e) {}
      mpCameraRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    previousFrameRef.current = null;
    setIsDwellActive(false);
    setHoveredCardIndex(null);
  };

  // Initialize and run MediaPipe model on the video
  useEffect(() => {
    if (cameraActive && trackingMode === 'finger' && mediaPipeStatus === 'ready' && videoRef.current) {
      let isStopped = false;
      
      try {
        const mpHands = (window as any).Hands;
        if (!mpHands) {
          setTrackingMode('touch');
          return;
        }

        const hands = new mpHands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55
        });

        hands.onResults((results: any) => {
          if (isStopped) return;
          
          if (isMovementLockedRef.current) {
            // Keep at center, do not process updates, but maintain idle feedback
            dotRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            setActiveMotionLevel(prev => Math.max(0, prev * 0.7));
            return;
          }
          
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            // Landmark 8 is index finger tip
            const indexTip = landmarks[8];
            const px = (1 - indexTip.x) * window.innerWidth; // Mirror horizontally
            const py = indexTip.y * window.innerHeight;
            
            // Smooth positioning
            const targetX = Math.max(0, Math.min(window.innerWidth, px));
            const targetY = Math.max(0, Math.min(window.innerHeight, py));
            
            dotRef.current = {
              x: dotRef.current.x * 0.7 + targetX * 0.3,
              y: dotRef.current.y * 0.7 + targetY * 0.3,
            };
            
            setDotPos({ ...dotRef.current });
            setActiveMotionLevel(100); // Visual signal of tracking
          } else {
            // Decaying signal if hand was lost
            setActiveMotionLevel(prev => Math.max(0, prev * 0.7));
          }
        });

        mpInstanceRef.current = hands;

        const mpCameraCls = (window as any).Camera;
        if (mpCameraCls) {
          const camera = new mpCameraCls(videoRef.current, {
            onFrame: async () => {
              if (isStopped) return;
              await hands.send({ image: videoRef.current! });
            },
            width: 640,
            height: 480
          });
          camera.start();
          mpCameraRef.current = camera;
        }

      } catch (e: any) {
        console.warn('Error configuring MediaPipe hands, using Hover Mode fallback:', e);
        setTrackingMode('touch');
      }

      return () => {
        isStopped = true;
        if (mpInstanceRef.current) {
          try {
            mpInstanceRef.current.close();
          } catch (e) {}
          mpInstanceRef.current = null;
        }
      };
    }
  }, [cameraActive, trackingMode, mediaPipeStatus]);

  // Main custom motion tracking & intersection check loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const processMotionFrame = () => {
      // 1. FPS measure
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setDebugFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // 3. Dwell Interaction Intersection Detection (Runs for all modes including Mouse fallback)
      checkCardCollisions();

      requestRef.current = requestAnimationFrame(processMotionFrame);
    };

    if (cameraActive || trackingMode === 'touch') {
      requestRef.current = requestAnimationFrame(processMotionFrame);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [cameraActive, trackingMode, choicesCount]);

  // Touch and Mouse hover mapping helper
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMovementLockedRef.current) return;
    if (trackingMode === 'touch') {
      dotRef.current = { x: e.clientX, y: e.clientY };
      setDotPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMovementLockedRef.current) return;
    if (trackingMode === 'touch' && e.touches.length > 0) {
      const touch = e.touches[0];
      dotRef.current = { x: touch.clientX, y: touch.clientY };
      setDotPos({ x: touch.clientX, y: touch.clientY });
    }
  };

  // Inspect DOM list coordinates for match card layouts to trigger selection dwell timings
  const checkCardCollisions = () => {
    const dotX = dotRef.current.x;
    const dotY = dotRef.current.y;
    
    // Find client bounding rectangles of active matching choice cards
    const cards = document.querySelectorAll('.phonics-match-choice');
    let intersectingIndex: number | null = null;

    cards.forEach((card) => {
      const indexAttr = card.getAttribute('data-choice-index');
      if (indexAttr === null) return;
      const index = parseInt(indexAttr, 10);
      
      const rect = card.getBoundingClientRect();
      if (
        dotX >= rect.left &&
        dotX <= rect.right &&
        dotY >= rect.top &&
        dotY <= rect.bottom
      ) {
         intersectingIndex = index;
      }
    });

    if (intersectingIndex !== null) {
      if (currentHoveredIndexRef.current !== intersectingIndex) {
        // Just entered a brand new card! Init timer
        currentHoveredIndexRef.current = intersectingIndex;
        hoverStartTimeRef.current = performance.now();
        setHoveredCardIndex(intersectingIndex);
        setIsDwellActive(true);
        lastDwellProgressRef.current = 0;
        setDwellProgress(0);
        audio.playTick(); // Tick on entering
      } else {
        // Still hovering the same card! Calc progress ratio
        const elapsed = performance.now() - (hoverStartTimeRef.current || performance.now());
        const pct = Math.min(100, (elapsed / DWELL_DURATION) * 100);
        
        // Soft audio feedback ticks as dwell progresses
        if (Math.floor(pct / 20) > Math.floor(lastDwellProgressRef.current / 20)) {
          audio.playTick();
        }

        lastDwellProgressRef.current = pct;
        setDwellProgress(pct);

        if (elapsed >= DWELL_DURATION) {
          // Trigger Selection Event
          onSelectChoiceRef.current(intersectingIndex);
          audio.playPop();
          // Reset tracking state after execution to avoid multiple triggers on transition
          currentHoveredIndexRef.current = null;
          hoverStartTimeRef.current = null;
          setHoveredCardIndex(null);
          setIsDwellActive(false);
          lastDwellProgressRef.current = 0;
          setDwellProgress(0);
        }
      }
    } else {
      // Free space, cleared hover states
      if (currentHoveredIndexRef.current !== null) {
        currentHoveredIndexRef.current = null;
        hoverStartTimeRef.current = null;
        setHoveredCardIndex(null);
        setIsDwellActive(false);
        lastDwellProgressRef.current = 0;
        setDwellProgress(0);
      }
    }
  };

  return (
    <div 
      id="camera-tracking-viewport"
      className="relative flex flex-col items-stretch w-full h-full flex-1 min-h-0 rounded-[24px] overflow-hidden bg-white border border-[#e07a5f]/15 text-[#3d405b] shadow-sm"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Hidden processing layout & video elements */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        width="160"
        height="120"
        className="hidden"
      />

      {/* Floating Orange Cursor Overlay spanning absolute Screen Viewport */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <motion.div
          animate={{
            x: dotPos.x - 20,
            y: dotPos.y - 20,
            scale: isDwellActive ? [1, 1.25, 1.15] : 1,
          }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute w-10 h-10 flex items-center justify-center pointer-events-none"
        >
          {/* Terracotta/Orange Glowing pointer dot from theme palette */}
          <div className="relative w-5 h-5 rounded-full bg-[#e07a5f] shadow-[0_0_15px_rgba(224,122,95,0.75)] border-2 border-white flex items-center justify-center">
            {isDwellActive && (
              <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-60" />
            )}
          </div>

          {/* Glowing loader ring around pointer tracking progress */}
          {isDwellActive && (
            <svg className="absolute w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="rgba(224, 122, 95, 0.25)"
                strokeWidth="3"
                fill="transparent"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="18"
                stroke="#e07a5f"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - dwellProgress / 100)}
                transition={{ duration: 0.05 }}
              />
            </svg>
          )}

          {/* Interactive Sparkle particles on success match */}
          {isCorrect && (
            <div className="absolute top-0 animate-bounce text-[#81b29a]">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Tracker Menu Panel Header */}
      <div id="tracker-dashboard-panel" className="p-3 bg-[#f4f1de] border-b border-[#3d405b]/10 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#e07a5f]" />
            <h3 className="font-extrabold text-[10px] tracking-widest uppercase text-[#3d405b]/80">Sensor Controller</h3>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-full py-0.5 px-2 border border-[#3d405b]/10">
            <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-[#81b29a] animate-pulse' : 'bg-[#e07a5f]'}`} />
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#3d405b]/70">
              {cameraActive ? 'Active' : 'Off'}
            </span>
          </div>
        </div>

        {/* Dynamic Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-[#e9edc9] p-0.5 rounded-lg border border-[#3d405b]/10">
          <button
            onClick={() => {
              setCameraActive(true);
              setTrackingMode('finger');
            }}
            className={`flex flex-col items-center gap-0.5 rounded-md py-1 transition-all cursor-pointer ${
              cameraActive && trackingMode === 'finger'
                ? 'bg-[#81b29a] text-white shadow-sm font-bold'
                : 'text-[#3d405b]/70 hover:text-[#3d405b]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[8px] uppercase font-bold tracking-wider leading-none">Finger AI</span>
          </button>

          <button
            onClick={() => {
              setCameraActive(false);
              setTrackingMode('touch');
            }}
            className={`flex flex-col items-center gap-0.5 rounded-md py-1 transition-all cursor-pointer ${
              !cameraActive && trackingMode === 'touch'
                ? 'bg-[#3d405b] text-white shadow-sm font-bold'
                : 'text-[#3d405b]/70 hover:text-[#3d405b]'
            }`}
          >
            <Touchpad className="w-3.5 h-3.5" />
            <span className="text-[8px] uppercase font-bold tracking-wider leading-none">Hover Mode</span>
          </button>
        </div>
      </div>

      {/* Camera Live Feed / Canvas Viewbox preview display */}
      <div id="camera-feed-box" className="relative aspect-video bg-[#3d405b] flex items-center justify-center border-b border-[#3d405b]/10 flex-1 min-h-0">
        {cameraActive ? (
          <div className="w-full h-full relative overflow-hidden">
            <video
              id="raw-mirror-stream"
              ref={(el) => {
                if (el && streamRef.current) {
                  el.srcObject = streamRef.current;
                  el.play().catch(e => {});
                }
              }}
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1] opacity-65 grayscale contrast-125"
            />
            {/* Visual scan grids representing tracking zones */}
            <div className="absolute inset-0 bg-[radial-gradient(inset_circle_at_center,transparent_40%,rgba(61,64,91,0.5))] pointer-events-none" />
            <div className="absolute inset-0 border-2 border-dashed border-[#e07a5f]/30 m-6 rounded-2xl pointer-events-none" />
            
            {/* Live debug sensors indicator */}
            <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-white/95 backdrop-blur rounded-md py-0.5 px-2 text-[9px] font-bold text-[#3d405b]/80 border border-[#3d405b]/10 pointer-events-none shadow-sm">
              <span>FPS: {debugFps}</span>
              <span className="flex items-center gap-1">
                HAND DETECT: <span className="text-[#e07a5f] font-extrabold">{activeMotionLevel > 0 ? 'YES' : 'NO'}</span>
              </span>
            </div>

            {trackingMode === 'finger' && mediaPipeStatus === 'loading' && (
              <div className="absolute inset-0 bg-[#3d405b]/95 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                <RefreshCw className="w-7 h-7 text-[#e07a5f] animate-spin mb-2" />
                <span className="text-xs font-bold text-[#e07a5f] uppercase tracking-widest animate-pulse">Initializing Finger AI</span>
                <span className="text-[10px] text-[#f4f1de]/80 mt-1">Downloading tracking models...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center max-w-xs flex flex-col items-center">
            <Touchpad className="w-10 h-10 text-[#81b29a] mb-2" />
            <span className="text-sm font-bold text-[#f4f1de]">Hover & Slide Control</span>
            <p className="text-[11px] text-[#f4f1de]/80 mt-1 leading-normal">
              Glide your finger or move your mouse over any card below to focus the orange target and match words!
            </p>
          </div>
        )}

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute inset-x-4 top-4 bg-[#e07a5f] text-white rounded-xl p-3 flex gap-2 items-start shadow-md pointer-events-none"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-xs">Sensor Alert</h4>
                <p className="text-[10px] opacity-90 leading-normal">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guide/Instruction overlay */}
      <div className="p-3 bg-[#fdfcf0] text-[#3d405b]/80 text-[10px] flex gap-1.5 items-start leading-normal shrink-0">
        <HelpCircle className="w-4 h-4 text-[#e07a5f] shrink-0" />
        <div>
          {trackingMode === 'finger' && (
            <p>
              <strong>Finger AI:</strong> Hold up 1 finger. Move it to guide the orange dot over the card choices!
            </p>
          )}
          {trackingMode === 'touch' && (
            <p>
              <strong>Hover:</strong> Slide your mouse or swipe across, and hold still on a picture card to match!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
