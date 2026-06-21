import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({ to, duration = 2, decimals = 0, suffix = "", prefix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, duration, count]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [rounded]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
