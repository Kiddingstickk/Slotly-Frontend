import { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const SplitText = ({
  text,
  className,
  delay = 0,
  stagger = 35,
}: SplitTextProps) => {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const words = text.split(" ");

  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, ci) => {
            const total = wi * 100 + ci;
            const style: CSSProperties = {
              display: "inline-block",
              animationDelay: `${delay + total * stagger}ms`,
            };
            return (
              <span
                key={ci}
                style={style}
                className={cn("reveal-init", inView && "animate-fade-up")}
              >
                {char}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
