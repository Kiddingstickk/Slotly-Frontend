import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

interface HeroProps {
  businessInfo: {
    _id: string;
    name: string;
    bio: string;
  };
}

const HeroSection = ({ businessInfo }: HeroProps) => {
  const [slideIn, setSlideIn] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const typingStarted = useRef(false);

  const bio = (businessInfo.bio || "").slice(0, 300) + "…";
  const nameParts = businessInfo.name?.toUpperCase().split(" ") || [];

  useEffect(() => {
    const t1 = setTimeout(() => setSlideIn(true), 300);
    const t2 = setTimeout(() => {
      typingStarted.current = true;
    }, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (!typingStarted.current) {
      const check = setInterval(() => {
        if (typingStarted.current) {
          clearInterval(check);
          let i = 0;
        const interval = setInterval(() => {
          i++;
          setTypedText(bio.slice(0, i));   // ✅ original logic restored
          if (i >= bio.length) {
            clearInterval(interval);
            setShowButton(true);
          }
        }, 25);
        }
      }, 50);
      return () => clearInterval(check);
    }
  }, [bio]);

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Grid container */}
      <div className="relative h-screen flex">
        {/* Left side — Giant header */}
        <div
          className={`flex items-start w-[40%] md:w-[35%] pl-6 md:pl-12 transition-transform duration-700 ease-out ${
            slideIn ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ marginTop: "25vh" }}   // 👈 adjust this value (10vh, 25vh, 30vh, etc.)
        >
          <h1
            className="leading-[0.85] tracking-tight text-foreground uppercase"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(4rem, 10vw, 12rem)",
            }}
          >
            {nameParts.map((part, i) => (
              <span key={i} className="block">
                {part}
              </span>
            ))}
          </h1>
        </div>

        {/* Right side — Bio + Button */}
        <div className="flex-1 flex flex-col justify-center items-end pr-6 md:pr-12 pt-[45vh]">
          <div className="text-right max-w-lg md:max-w-xl">
            <p
              className="text-sm md:text-base text-muted-foreground leading-relaxed font-light tracking-wide"
            >
              {typedText}
              {typedText.length < bio.length && (
                <span className="inline-block w-[2px] h-4 bg-foreground ml-0.5 animate-pulse align-middle" />
              )}
            </p>
          </div>
          <div className="mt-8 md:mt-12">
            <Link
              to={`/${businessInfo._id}/book`}
              className={`inline-block border border-foreground text-foreground px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-foreground hover:text-background ${
                showButton ? "opacity-100" : "opacity-0"
              }`}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;