import { MapPin, Phone } from "lucide-react";

const AboutSection = ({ businessInfo }: { businessInfo: any }) => {
  return (
    <section id="about" className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          About Us
        </h2>
        <div className="flex flex-row gap-4 md:gap-12">
          {/* Logo / Owner Image */}
          {businessInfo.logo && (
            <div className="w-2/5 h-48 md:w-1/2 md:h-80 shrink-0 overflow-hidden rounded-lg">
              <img
                src={businessInfo.logo}
                alt={`${businessInfo.name} logo`}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          {/* Text */}
          <div className="space-y-4 md:pl-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              {businessInfo.bio}
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {businessInfo.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {businessInfo.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;