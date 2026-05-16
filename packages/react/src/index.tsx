"use client";

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export type BuddyAnchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-center"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-center"
  | "center";

export type BuddyOverlay = "none" | "dim" | "spotlight" | "blur";
export type BuddyAnimation = "none" | "wiggle" | "bounce" | "pulse";
export type BuddyInteraction = "blocked" | "target" | "all";
export type BuddyPoint = {
  x: number | `${number}%`;
  y: number | `${number}%`;
};

type BuddyBaseCharacter = {
  type: "builtin" | "image";
  imageUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type BuddyHandLayer = {
  imageUrl: string;
  alt?: string;
  width?: number;
  height?: number;
  position: BuddyPoint;
  shoulderPivot: BuddyPoint;
  pointerAnchor?: BuddyPoint;
  rotation?: number;
  shake?: {
    enabled?: boolean;
    degrees?: number;
    durationMs?: number;
  };
};

export type BuddyCharacter = BuddyBaseCharacter & {
  hand?: BuddyHandLayer;
};

export type BuddyStepControls = {
  back?: boolean;
  next?: boolean;
  skip?: boolean;
  finish?: boolean;
  stepCount?: boolean;
};

export type BuddyStep = {
  id: string;
  target: string;
  title: string;
  body: string;
  character?: BuddyCharacter;
  pointerAnchor?: BuddyPoint;
  targetAnchor?: BuddyAnchor;
  offset?: { x?: number; y?: number };
  overlay?: BuddyOverlay;
  animation?: BuddyAnimation;
  controls?: BuddyStepControls;
  interaction?: BuddyInteraction;
};

export type BuddyTour = {
  id: string;
  autoStart?: boolean;
  completion?: {
    strategy: "localStorage";
    key?: string;
  };
  steps: BuddyStep[];
};

export type BuddyRemoteConfig = {
  projectKey?: string;
  configUrl: string;
  fallbackTours?: BuddyTour[];
  requestInit?: RequestInit;
};

export type BuddyAnalyticsEventType =
  | "tour_started"
  | "step_viewed"
  | "tour_skipped"
  | "tour_completed";

export type BuddyAnalyticsMetadata = Record<string, string | number | boolean | null>;

export type BuddyAnalyticsEvent = {
  type: BuddyAnalyticsEventType;
  tourId: string;
  stepId?: string;
  stepIndex?: number;
  stepCount: number;
  source: "local" | "remote" | "fallback";
  projectKey?: string;
  timestamp: string;
  metadata?: BuddyAnalyticsMetadata;
};

export type BuddyAnalyticsAdapter = {
  track?: (event: BuddyAnalyticsEvent) => void | Promise<void>;
  flush?: (events: BuddyAnalyticsEvent[]) => void | Promise<void>;
};

export type BuddyAnalyticsConfig = {
  enabled?: boolean;
  metadata?: BuddyAnalyticsMetadata;
  adapter?: BuddyAnalyticsAdapter;
};

export type BuddyEvents = {
  onStart?: (tour: BuddyTour) => void;
  onStepView?: (tour: BuddyTour, step: BuddyStep, index: number) => void;
  onComplete?: (tour: BuddyTour) => void;
  onSkip?: (tour: BuddyTour, step: BuddyStep, index: number) => void;
};

export type OnboardBuddyApi = {
  activeTourId: string | null;
  activeStepIndex: number;
  start: (tourId: string) => void;
  reset: (tourId: string) => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  complete: () => void;
};

export type OnboardBuddyProviderProps = BuddyEvents & {
  tours?: BuddyTour[];
  remoteConfig?: BuddyRemoteConfig;
  analytics?: BuddyAnalyticsConfig;
  children: ReactNode;
};

export type BuddyRemoteConfigResult = {
  tours: BuddyTour[];
  source: "fallback" | "remote";
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export type BuddyAnalyticsResult = {
  events: BuddyAnalyticsEvent[];
  clear: () => void;
  flush: () => Promise<number>;
};

type Position = {
  left: number;
  top: number;
  targetRect: DOMRect;
};

const OnboardBuddyContext = createContext<OnboardBuddyApi | null>(null);
const OnboardBuddyRemoteConfigContext = createContext<BuddyRemoteConfigResult | null>(null);
const OnboardBuddyAnalyticsContext = createContext<BuddyAnalyticsResult | null>(null);
const DEFAULT_CHARACTER: BuddyCharacter = { type: "builtin" };

export function useOnboardBuddy() {
  const context = useContext(OnboardBuddyContext);

  if (!context) {
    throw new Error("useOnboardBuddy must be used inside OnboardBuddyProvider.");
  }

  return context;
}

export function useOnboardBuddyRemoteConfig() {
  const context = useContext(OnboardBuddyRemoteConfigContext);

  if (!context) {
    throw new Error("useOnboardBuddyRemoteConfig must be used inside OnboardBuddyProvider.");
  }

  return context;
}

export function useOnboardBuddyAnalytics() {
  const context = useContext(OnboardBuddyAnalyticsContext);

  if (!context) {
    throw new Error("useOnboardBuddyAnalytics must be used inside OnboardBuddyProvider.");
  }

  return context;
}

export function OnboardBuddyProvider({
  tours,
  remoteConfig,
  analytics,
  children,
  onStart,
  onStepView,
  onComplete,
  onSkip
}: OnboardBuddyProviderProps) {
  const remote = useRemoteConfigLoader(remoteConfig);
  const resolvedTours = tours ?? remote.tours;
  const analyticsSource = tours ? "local" : remote.source;
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [analyticsEvents, setAnalyticsEvents] = useState<BuddyAnalyticsEvent[]>([]);

  const activeTour = useMemo(
    () => resolvedTours.find((tour) => tour.id === activeTourId) ?? null,
    [activeTourId, resolvedTours]
  );
  const activeStep = activeTour?.steps[activeStepIndex] ?? null;

  const getStorageKey = useCallback((tour: BuddyTour) => {
    return tour.completion?.key ?? `onboardbuddy:${tour.id}:completed`;
  }, []);

  const isCompleted = useCallback(
    (tour: BuddyTour) => {
      if (typeof window === "undefined") {
        return true;
      }

      return window.localStorage.getItem(getStorageKey(tour)) === "true";
    },
    [getStorageKey]
  );

  const markCompleted = useCallback(
    (tour: BuddyTour) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(getStorageKey(tour), "true");
      }
    },
    [getStorageKey]
  );

  const emitAnalytics = useCallback(
    (
      type: BuddyAnalyticsEventType,
      tour: BuddyTour,
      step?: BuddyStep,
      stepIndex?: number
    ) => {
      const enabled = analytics?.enabled ?? Boolean(analytics);

      if (!enabled) {
        return;
      }

      const event: BuddyAnalyticsEvent = {
        type,
        tourId: tour.id,
        stepId: step?.id,
        stepIndex,
        stepCount: tour.steps.length,
        source: analyticsSource,
        projectKey: remoteConfig?.projectKey,
        timestamp: new Date().toISOString(),
        metadata: analytics?.metadata
      };

      setAnalyticsEvents((current) => [...current, event]);

      void trackAnalyticsEvent(analytics?.adapter, event);
    },
    [analytics, analyticsSource, remoteConfig?.projectKey]
  );

  const start = useCallback(
    (tourId: string) => {
      const tour = resolvedTours.find((candidate) => candidate.id === tourId);

      if (!tour || tour.steps.length === 0) {
        return;
      }

      setActiveTourId(tour.id);
      setActiveStepIndex(0);
      onStart?.(tour);
      emitAnalytics("tour_started", tour);
    },
    [emitAnalytics, onStart, resolvedTours]
  );

  const reset = useCallback(
    (tourId: string) => {
      const tour = resolvedTours.find((candidate) => candidate.id === tourId);

      if (!tour) {
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(getStorageKey(tour));
      }

      start(tour.id);
    },
    [getStorageKey, resolvedTours, start]
  );

  const complete = useCallback(() => {
    if (!activeTour) {
      return;
    }

    markCompleted(activeTour);
    onComplete?.(activeTour);
    emitAnalytics("tour_completed", activeTour, activeStep ?? undefined, activeStepIndex);
    setActiveTourId(null);
    setActiveStepIndex(0);
  }, [activeStep, activeStepIndex, activeTour, emitAnalytics, markCompleted, onComplete]);

  const next = useCallback(() => {
    if (!activeTour) {
      return;
    }

    if (activeStepIndex >= activeTour.steps.length - 1) {
      complete();
      return;
    }

    setActiveStepIndex((current) => current + 1);
  }, [activeStepIndex, activeTour, complete]);

  const back = useCallback(() => {
    setActiveStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const skip = useCallback(() => {
    if (!activeTour || !activeStep) {
      return;
    }

    markCompleted(activeTour);
    onSkip?.(activeTour, activeStep, activeStepIndex);
    emitAnalytics("tour_skipped", activeTour, activeStep, activeStepIndex);
    setActiveTourId(null);
    setActiveStepIndex(0);
  }, [activeStep, activeStepIndex, activeTour, emitAnalytics, markCompleted, onSkip]);

  useEffect(() => {
    const firstTour = resolvedTours.find((tour) => tour.autoStart && !isCompleted(tour));

    if (firstTour) {
      start(firstTour.id);
    }
  }, [isCompleted, resolvedTours, start]);

  useEffect(() => {
    if (activeTour && activeStep) {
      onStepView?.(activeTour, activeStep, activeStepIndex);
      emitAnalytics("step_viewed", activeTour, activeStep, activeStepIndex);
    }
  }, [activeStep, activeStepIndex, activeTour, emitAnalytics, onStepView]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeTour) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTour, next, skip]);

  const api = useMemo(
    () => ({
      activeTourId,
      activeStepIndex,
      start,
      reset,
      next,
      back,
      skip,
      complete
    }),
    [activeStepIndex, activeTourId, back, complete, next, reset, skip, start]
  );

  const clearAnalytics = useCallback(() => {
    setAnalyticsEvents([]);
  }, []);

  const flushAnalytics = useCallback(async () => {
    const eventsToFlush = analyticsEvents;

    if (analytics?.adapter?.flush) {
      await analytics.adapter.flush(eventsToFlush);
    }

    setAnalyticsEvents([]);
    return eventsToFlush.length;
  }, [analytics?.adapter, analyticsEvents]);

  const analyticsResult = useMemo(
    () => ({
      events: analyticsEvents,
      clear: clearAnalytics,
      flush: flushAnalytics
    }),
    [analyticsEvents, clearAnalytics, flushAnalytics]
  );

  return (
    <OnboardBuddyContext.Provider value={api}>
      <OnboardBuddyRemoteConfigContext.Provider value={remote}>
        <OnboardBuddyAnalyticsContext.Provider value={analyticsResult}>
          {children}
          {activeTour && activeStep ? (
            <OnboardBuddyTour
              activeStepIndex={activeStepIndex}
              onBack={back}
              onComplete={complete}
              onNext={next}
              onSkip={skip}
              step={activeStep}
              totalSteps={activeTour.steps.length}
            />
          ) : null}
        </OnboardBuddyAnalyticsContext.Provider>
      </OnboardBuddyRemoteConfigContext.Provider>
    </OnboardBuddyContext.Provider>
  );
}

function useRemoteConfigLoader(remoteConfig?: BuddyRemoteConfig): BuddyRemoteConfigResult {
  const fallbackTours = useMemo(
    () => remoteConfig?.fallbackTours ?? [],
    [remoteConfig?.fallbackTours]
  );
  const [tours, setTours] = useState<BuddyTour[]>(fallbackTours);
  const [source, setSource] = useState<"fallback" | "remote">("fallback");
  const [loading, setLoading] = useState(Boolean(remoteConfig));
  const [error, setError] = useState<Error | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const reload = useCallback(async () => {
    setReloadTrigger((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!remoteConfig || source === "fallback") {
      setTours(fallbackTours);
    }
  }, [fallbackTours, remoteConfig, source]);

  useEffect(() => {
    let cancelled = false;

    if (!remoteConfig) {
      setSource("fallback");
      setLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(remoteConfig.configUrl, window.location.origin);

        if (remoteConfig.projectKey) {
          url.searchParams.set("projectKey", remoteConfig.projectKey);
        }

        const response = await fetch(url, remoteConfig.requestInit);

        if (!response.ok) {
          throw new Error(`Failed to load OnboardBuddy config: ${response.status}`);
        }

        const remoteTours = parseRemoteTours(await response.json());

        if (!cancelled) {
          setTours(remoteTours);
          setSource("remote");
        }
      } catch (caughtError) {
        if (!cancelled) {
          setTours(remoteConfig.fallbackTours ?? []);
          setSource("fallback");
          setError(caughtError instanceof Error ? caughtError : new Error("Remote config failed."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fallbackTours, reloadTrigger, remoteConfig]);

  return useMemo(
    () => ({ tours, source, loading, error, reload }),
    [error, loading, reload, source, tours]
  );
}

async function trackAnalyticsEvent(adapter: BuddyAnalyticsAdapter | undefined, event: BuddyAnalyticsEvent) {
  try {
    await adapter?.track?.(event);
  } catch (error) {
    console.error("OnboardBuddy analytics track failed", error);
  }
}

type OnboardBuddyTourProps = {
  step: BuddyStep;
  activeStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
};

export function OnboardBuddyTour({
  step,
  activeStepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onComplete
}: OnboardBuddyTourProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const character = step.character ?? DEFAULT_CHARACTER;
  const width = character.width ?? 220;
  const height = character.height ?? 220;
  const controls = {
    back: true,
    next: true,
    skip: true,
    finish: true,
    stepCount: true,
    ...step.controls
  };
  const isLastStep = activeStepIndex === totalSteps - 1;
  const overlay = step.overlay ?? "spotlight";
  const interaction = step.interaction ?? "blocked";

  useEffect(() => {
    const updatePosition = () => {
      const target = document.querySelector(step.target);
      setIsMobile(window.matchMedia("(max-width: 720px)").matches);

      if (!target) {
        setPosition(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const targetAnchor = step.targetAnchor ?? "left-center";
      const pointer = characterPointerToPixels(character, step.pointerAnchor, width, height);
      const targetPoint = anchorToPoint(rect, targetAnchor);
      const nextLeft = clamp(
        targetPoint.x - pointer.x + (step.offset?.x ?? 0),
        12,
        window.innerWidth - width - 12
      );
      const nextTop = clamp(
        targetPoint.y - pointer.y + (step.offset?.y ?? 0),
        12,
        window.innerHeight - height - 12
      );

      setPosition({ left: nextLeft, top: nextTop, targetRect: rect });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [character, height, step.offset?.x, step.offset?.y, step.pointerAnchor, step.target, step.targetAnchor, width]);

  const wrapperStyle: CSSProperties =
    position && !isMobile
      ? {
          left: position.left,
          top: position.top,
          width
        }
      : {
          left: 16,
          right: 16,
          bottom: 16
        };

  return (
    <>
      {overlay !== "none" && position ? (
        <BuddyOverlayLayer
          interaction={interaction}
          overlay={overlay}
          targetRect={position.targetRect}
        />
      ) : null}
      <section
        aria-label={step.title}
        className={`obuddy-root obuddy-animation-${step.animation ?? "wiggle"} ${
          isMobile ? "obuddy-mobile" : ""
        }`}
        style={wrapperStyle}
      >
        <div className="obuddy-character" style={{ height, width }}>
          <BuddyCharacterLayer character={character} />
        </div>
        <div className="obuddy-card">
          <div className="obuddy-card-header">
            <h2>{step.title}</h2>
            {controls.stepCount ? (
              <span>
                {activeStepIndex + 1}/{totalSteps}
              </span>
            ) : null}
          </div>
          <p>{step.body}</p>
          <div className="obuddy-actions">
            {controls.skip ? (
              <button type="button" onClick={onSkip}>
                Skip
              </button>
            ) : null}
            <div>
              {controls.back && activeStepIndex > 0 ? (
                <button type="button" onClick={onBack}>
                  Back
                </button>
              ) : null}
              {isLastStep ? (
                controls.finish ? (
                  <button className="obuddy-primary" type="button" onClick={onComplete}>
                    Finish
                  </button>
                ) : null
              ) : controls.next ? (
                <button className="obuddy-primary" type="button" onClick={onNext}>
                  Next
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BuddyOverlayLayer({
  interaction,
  overlay,
  targetRect
}: {
  interaction: BuddyInteraction;
  overlay: BuddyOverlay;
  targetRect: DOMRect;
}) {
  const spotlightStyle: CSSProperties = {
    left: targetRect.left - 8,
    top: targetRect.top - 8,
    width: targetRect.width + 16,
    height: targetRect.height + 16
  };

  return (
    <div
      className={`obuddy-overlay obuddy-overlay-${overlay} obuddy-interaction-${interaction}`}
      aria-hidden="true"
    >
      {overlay === "spotlight" || overlay === "blur" ? (
        <div className="obuddy-spotlight" style={spotlightStyle} />
      ) : null}
    </div>
  );
}

function BuddyCharacterLayer({ character }: { character: BuddyCharacter }) {
  return (
    <>
      <div className="obuddy-character-base">
        {character.type === "image" && character.imageUrl ? (
          <img alt={character.alt ?? ""} src={character.imageUrl} />
        ) : (
          <BuiltInCharacter />
        )}
      </div>
      {character.hand ? <BuddyHandLayerView hand={character.hand} /> : null}
    </>
  );
}

function BuddyHandLayerView({ hand }: { hand: BuddyHandLayer }) {
  const handStyle: CSSProperties = {
    left: pointValueToCss(hand.position.x),
    top: pointValueToCss(hand.position.y),
    width: hand.width ?? 120,
    height: hand.height ?? 120,
    transformOrigin: `${pointValueToCss(hand.shoulderPivot.x)} ${pointValueToCss(
      hand.shoulderPivot.y
    )}`,
    ["--obuddy-hand-base-rotation" as string]: `${hand.rotation ?? 0}deg`,
    ["--obuddy-hand-shake-degrees" as string]: `${hand.shake?.degrees ?? 5}deg`,
    ["--obuddy-hand-shake-duration" as string]: `${hand.shake?.durationMs ?? 900}ms`
  };

  return (
    <img
      alt={hand.alt ?? ""}
      className={`obuddy-character-hand ${hand.shake?.enabled === false ? "" : "obuddy-hand-shake"}`}
      src={hand.imageUrl}
      style={handStyle}
    />
  );
}

function BuiltInCharacter() {
  return (
    <svg viewBox="0 0 240 240" role="img" aria-label="OnboardBuddy guide">
      <circle cx="103" cy="78" r="42" fill="#f7c948" />
      <circle cx="89" cy="72" r="5" fill="#1f2937" />
      <circle cx="116" cy="72" r="5" fill="#1f2937" />
      <path d="M88 91c12 10 26 10 39 0" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
      <path d="M71 126h62c20 0 36 16 36 36v45H35v-45c0-20 16-36 36-36Z" fill="#8b5cf6" />
      <path d="M141 134c31 6 52 0 75-28" stroke="#f7c948" strokeWidth="18" strokeLinecap="round" />
      <path d="M213 105l18-6-12 16Z" fill="#f7c948" />
      <path d="M54 137c-19 18-27 39-24 64" stroke="#f7c948" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}

function pointToPixels(point: BuddyPoint, width: number, height: number) {
  return {
    x: pointValueToPixels(point.x, width),
    y: pointValueToPixels(point.y, height)
  };
}

function pointValueToPixels(value: number | `${number}%`, size: number) {
  if (typeof value === "number") {
    return value;
  }

  return (Number(value.replace("%", "")) / 100) * size;
}

function pointValueToCss(value: number | `${number}%`) {
  return typeof value === "number" ? `${value}px` : value;
}

function characterPointerToPixels(
  character: BuddyCharacter,
  stepPointerAnchor: BuddyPoint | undefined,
  width: number,
  height: number
) {
  const hand = character.hand;

  if (hand?.pointerAnchor) {
    const handPointerAnchor = hand.pointerAnchor;

    return {
      x:
        pointValueToPixels(hand.position.x, width) +
        pointValueToPixels(handPointerAnchor.x, hand.width ?? 120),
      y:
        pointValueToPixels(hand.position.y, height) +
        pointValueToPixels(handPointerAnchor.y, hand.height ?? 120)
    };
  }

  return pointToPixels(stepPointerAnchor ?? { x: "82%", y: "40%" }, width, height);
}

function anchorToPoint(rect: DOMRect, anchor: BuddyAnchor) {
  const xMap: Record<BuddyAnchor, number> = {
    "top-left": rect.left,
    "top-center": rect.left + rect.width / 2,
    "top-right": rect.right,
    "right-center": rect.right,
    "bottom-right": rect.right,
    "bottom-center": rect.left + rect.width / 2,
    "bottom-left": rect.left,
    "left-center": rect.left,
    center: rect.left + rect.width / 2
  };
  const yMap: Record<BuddyAnchor, number> = {
    "top-left": rect.top,
    "top-center": rect.top,
    "top-right": rect.top,
    "right-center": rect.top + rect.height / 2,
    "bottom-right": rect.bottom,
    "bottom-center": rect.bottom,
    "bottom-left": rect.bottom,
    "left-center": rect.top + rect.height / 2,
    center: rect.top + rect.height / 2
  };

  return { x: xMap[anchor], y: yMap[anchor] };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseRemoteTours(payload: unknown): BuddyTour[] {
  if (isTourArray(payload)) {
    return payload;
  }

  if (isRecord(payload) && isTourArray(payload.tours)) {
    return payload.tours;
  }

  throw new Error("Remote OnboardBuddy config must be a tour array or { tours }.");
}

function isTourArray(value: unknown): value is BuddyTour[] {
  return Array.isArray(value) && value.every(isTour);
}

function isTour(value: unknown): value is BuddyTour {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    Array.isArray(value.steps) &&
    value.steps.every(isStep)
  );
}

function isStep(value: unknown): value is BuddyStep {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.target === "string" &&
    typeof value.title === "string" &&
    typeof value.body === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
