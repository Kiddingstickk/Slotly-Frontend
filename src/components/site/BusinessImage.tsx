import { cn } from "@/lib/utils";

interface BusinessImageProps {
  src?: string;
  alt?: string;
  index: number;
  className?: string;
}

/**
 * Image slot that renders an uploaded image when `src` is provided,
 * otherwise a clean cream placeholder labelled "Image N".
 */
const BusinessImage = ({ src, alt, index, className }: BusinessImageProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? `Image ${index}`}
        className={cn("w-full h-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "w-full h-full bg-cream border border-dashed border-olive/25 flex items-center justify-center",
        className
      )}
    >
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-olive-deep/60">
          Image
        </div>
        <div className="font-display text-3xl text-olive-deep/70 mt-0.5">
          {String(index).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export default BusinessImage;
