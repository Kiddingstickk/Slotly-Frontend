import { useEffect, useState, useRef } from "react";
import { Clock, IndianRupee } from "lucide-react";

const ServicesSection = ({ services }: { services: any[] }) => {
  const [typedHeading, setTypedHeading] = useState("");
  const [showServices, setShowServices] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hasTyped, setHasTyped] = useState(false); 

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasTyped) { // 👈 only run once
        const text = "Our Services";
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setTypedHeading(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(interval);
            setShowServices(true);
            setHasTyped(true); // 👈 mark as done
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
    <section id="services" ref={sectionRef} className="px-4 py-16">
      <div className="w-full px-4 md:px-12 flex flex-col md:flex-row">
        {/* Heading stays left */}
        <div className="flex-1">
          <h2
            className="mb-8 text-left leading-[0.85] tracking-tight text-foreground uppercase"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
            }}
          >
            {typedHeading}
          </h2>
        </div>

        {/* Services content shifts right with breathing room */}
        <div
          className={`flex-1 transition-opacity duration-700 ${
            showServices ? "opacity-100" : "opacity-0"
          } text-right pr-4 md:pr-12`}
        >
          {services.map((service, idx) => (
            <div key={idx} className="py-3 border-b">
              <h3 className="text-sm md:text-base font-normal text-foreground leading-relaxed tracking-wide">
                {service.name}
              </h3>
              <div className="flex justify-end gap-4 text-xs md:text-sm text-muted-foreground font-light">
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {service.price}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;