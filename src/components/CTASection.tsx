import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface CTAProps {
  businessInfo: {
    _id: string;
    name: string;
    bio: string;
  };
}


const CTASection = ({ businessInfo }: CTAProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="px-4 py-20 md:py-28 bg-primary text-primary-foreground">
      <div
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to Look Your Best?
        </h2>
        <p className="mt-4 text-lg opacity-80">
          Book your appointment today and let our experts take care of the rest.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-10 text-base font-semibold"
          >
            <Link to={`/${businessInfo._id}/book`}>Book Your Appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
