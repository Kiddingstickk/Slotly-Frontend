import { useEffect, useState, useRef } from "react";

const PhotosSection = ({ businessInfo }: { businessInfo: any }) => {
  const [typedHeading, setTypedHeading] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [hasTyped, setHasTyped] = useState(false); 
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTyped) {
          const text = "Gallery";
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setTypedHeading(text.slice(0, i));
            if (i >= text.length) {
              clearInterval(interval);
              setShowGallery(true);
              setHasTyped(true);
            }
          }, 100);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasTyped]);

  return (
      <section id="photos" ref={sectionRef} className="py-16">
        <div className="w-full px-4 md:px-12">
          {/* Heading shifted fully to the right */}
          <h2
            className="mb-8 text-right leading-[0.85] tracking-tight text-foreground uppercase"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
            }}
          >
            {typedHeading}
          </h2>
        </div>

        {/* Gallery fade-in after heading finishes typing */}
        <div
          className={`flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide transition-opacity duration-700 ${
            showGallery ? "opacity-100" : "opacity-0"
          }`}
        >
          {businessInfo.images && businessInfo.images.length > 0 ? (
            businessInfo.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="w-[70vw] md:w-[30vw] shrink-0 snap-center aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))
          ) : (
            <p className="px-4 text-muted-foreground">
              No gallery images uploaded yet.
            </p>
          )}
        </div>
      </section>
  );
};

export default PhotosSection;