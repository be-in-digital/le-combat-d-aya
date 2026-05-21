"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  type Ref,
  type RefObject,
  type ReactNode,
} from "react";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_REVEAL: [number, number, number, number] = [0.65, 0, 0.35, 1];

const VIEWPORT = { once: true, margin: "-60px 0px -60px 0px" } as const;

/* ---------- FadeUp ---------- */

type FadeUpProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  distance?: number;
  children?: ReactNode;
};

export function FadeUp({
  delay = 0,
  duration = 0.85,
  distance = 28,
  children,
  ...rest
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------- FadeIn (no translate) ---------- */

export function FadeIn({
  delay = 0,
  duration = 1,
  children,
  ...rest
}: HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Stagger ---------- */

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
  },
};

export function Stagger({
  children,
  staggerDelay = 0.1,
  initialDelay = 0.05,
  ...rest
}: HTMLMotionProps<"div"> & {
  staggerDelay?: number;
  initialDelay?: number;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...rest
}: HTMLMotionProps<"div"> & { children?: ReactNode }) {
  return (
    <motion.div variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}

/* ---------- RevealText : clip-path word reveal ---------- */

type RevealTextProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  inline?: boolean;
  /**
   * Animate on mount instead of waiting for viewport intersection. Use for
   * above-the-fold headings — viewport detection is unreliable for elements
   * that are already visible on first paint, and a stuck `y: 115%` leaves the
   * heading hidden behind the parent's `overflow-hidden` clip.
   */
  eager?: boolean;
};

export function RevealText({
  children,
  delay = 0,
  duration = 1.05,
  className = "",
  inline = false,
  eager = false,
}: RevealTextProps) {
  const Wrapper: "span" | "div" = inline ? "span" : "div";
  const Inner = inline ? motion.span : motion.div;
  // Observe the (stationary) wrapper, not the translated inner element.
  // The inner starts at y: 115%, which pushes its bounding-box out of the
  // viewport — IntersectionObserver-based `whileInView` on the inner would
  // not fire reliably. Anchoring useInView on the wrapper keeps detection
  // accurate, and also stays correct when nested inside a parent that uses
  // variant propagation (which would otherwise hijack the child's `animate`).
  const wrapperRef = useRef<HTMLElement | null>(null);
  const inView = useInView(wrapperRef as RefObject<Element>, {
    once: true,
    margin: "-60px 0px -60px 0px",
  });
  const controls = useAnimationControls();
  useEffect(() => {
    if (eager || inView) controls.start({ y: "0%" });
  }, [eager, inView, controls]);
  return (
    <Wrapper
      ref={wrapperRef as Ref<HTMLDivElement & HTMLSpanElement>}
      className={`${inline ? "inline-block" : "block"} overflow-hidden align-bottom ${className}`}
      aria-hidden={false}
    >
      <Inner
        className={inline ? "inline-block" : "block"}
        initial={{ y: "115%" }}
        animate={controls}
        transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </Inner>
    </Wrapper>
  );
}

/* ---------- ImageReveal : editorial drape ---------- */

type Direction = "up" | "down" | "left" | "right";

const clipMap: Record<Direction, { from: string; to: string }> = {
  up: { from: "inset(100% 0% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
  down: { from: "inset(0% 0% 100% 0%)", to: "inset(0% 0% 0% 0%)" },
  left: { from: "inset(0% 100% 0% 0%)", to: "inset(0% 0% 0% 0%)" },
  right: { from: "inset(0% 0% 0% 100%)", to: "inset(0% 0% 0% 0%)" },
};

export function ImageReveal({
  children,
  className = "",
  delay = 0,
  duration = 1.25,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
}) {
  const { from, to } = clipMap[direction];
  return (
    <motion.div
      className={className}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: to }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_REVEAL }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Float : gentle continuous drift ---------- */

export function Float({
  children,
  className = "",
  duration = 14,
  amplitude = 18,
  rotate = 0,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  duration?: number;
  amplitude?: number;
  rotate?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.6, 0],
        x: [0, amplitude * 0.6, 0, -amplitude * 0.4, 0],
        rotate: rotate ? [0, rotate, 0, -rotate / 2, 0] : 0,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Magnetic : subtle pointer-following button ---------- */

export function Magnetic({
  children,
  className = "",
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * strength);
        y.set((e.clientY - cy) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- ProgressFill : animated bar fill ---------- */

export function ProgressFill({
  percent,
  className = "",
  duration = 1.8,
  delay = 0.2,
}: {
  percent: number;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ width: "0%" }}
      whileInView={{ width: `${percent}%` }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: EASE_REVEAL }}
    />
  );
}

/* ---------- CountUp : animated number ---------- */

export function CountUp({
  to,
  duration = 1.8,
  className = "",
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const display = useTransform(spring, (v) =>
    `${prefix}${Math.round(v).toLocaleString("fr-FR")}${suffix}`,
  );

  if (inView) motionValue.set(to);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

/* ---------- Parallax : translate on scroll ---------- */

export function Parallax({
  children,
  className = "",
  offset = 60,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
