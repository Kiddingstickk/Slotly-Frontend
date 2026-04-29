import { Link } from "react-router-dom";
import WaveBackdrop from "@/components/auth/WaveBackdrop";
import AuthForm from "@/components/auth/AuthForm";
import SplitText from "@/components/ui/SplitText";

const Login = () => {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-cream">
      {/* Left / hero */}
      <div className="relative lg:min-h-screen overflow-hidden text-cream lg:flex lg:flex-col">
        <WaveBackdrop />

        {/* Mobile compressed hero */}
        <div className="relative px-6 pt-8 pb-20 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-cream/15 backdrop-blur flex items-center justify-center ring-1 ring-cream/20">
              <span className="text-cream font-display font-semibold text-lg italic leading-none">S</span>
            </div>
            <span className="font-display font-medium text-[20px] text-cream">Slotly</span>
          </Link>

          <div className="mt-8">
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-cream">
              Run a fuller chair.
              <br />
              <em className="italic font-light text-cream/90">Every single day.</em>
            </h1>
            <p className="mt-4 text-sm text-cream/75 max-w-xs">
              Build a smoother, busier shop with easy booking & payments.
            </p>
          </div>
        </div>

        {/* Desktop hero */}
        <div className="relative hidden lg:flex flex-col h-full px-12 xl:px-16 pt-10 pb-12">
          <Link to="/" className="inline-flex items-center gap-2.5 self-start">
            <div className="w-10 h-10 rounded-md bg-cream/15 backdrop-blur flex items-center justify-center ring-1 ring-cream/20">
              <span className="text-cream font-display font-semibold text-xl italic leading-none">S</span>
            </div>
            <span className="font-display font-medium text-[24px] text-cream">Slotly</span>
          </Link>

          <div className="my-auto max-w-xl">
            <h1 className="font-display font-light text-5xl xl:text-6xl leading-[1.02] tracking-tightest text-cream">
              <SplitText text="Run a fuller chair." />
              <br />
              <em className="italic text-cream/85">
                <SplitText text="Every single day." delay={350} />
              </em>
            </h1>
            <p className="mt-6 text-base text-cream/75 max-w-md leading-relaxed">
              Build a smoother, busier shop with easy booking & payments — designed for barbers, nail techs and salon owners.
            </p>

            <div className="mt-10 flex items-center gap-6 text-xs text-cream/60 font-mono uppercase tracking-widest">
              <span>12,000+ shops</span>
              <span className="w-1 h-1 rounded-full bg-cream/40" />
              <span>$48M booked</span>
              <span className="w-1 h-1 rounded-full bg-cream/40" />
              <span>4.9★</span>
            </div>
          </div>

          <div className="text-xs text-cream/50">© Slotly · Made for service businesses</div>
        </div>
      </div>

      {/* Right / form */}
      <div className="relative -mt-10 lg:mt-0 lg:flex lg:items-center lg:justify-center px-5 sm:px-8 lg:px-10 pb-12 lg:pb-0">
        <div className="lg:hidden absolute inset-x-0 top-0 h-10 bg-background rounded-t-3xl" />
        <div className="relative pt-8 lg:pt-0 lg:py-16 w-full">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
