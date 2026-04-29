import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import BusinessImage from "@/components/site/BusinessImage";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

const BusinessSite = () => {
  const { businessId } = useParams();

  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]); 
  const [reviews, setReviews] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch business info
        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/businesses/${businessId}`
        );
        const biz = res.data;
        setBusinessInfo(biz);
  
        // 2. Fetch employees for this business
        const empRes = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/employees/business/${businessId}`
        );
        setTeam(empRes.data);
  
        //(Optional) 3. Fetch reviews if you want testimonials
        const revRes = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/reviews/business/${businessId}`
        );
        setReviews(revRes.data);

         // 4. Availability
        const availRes = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/availability/business/${businessId}`
        );
        setAvailability(availRes.data);
  
      } catch (err) {
        console.error("Error fetching business site data:", err);
      }
    };
    if (businessId) fetchData();
  }, [businessId]);
  
  
  function formatTime(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayAvailability = availability.find((a) => a.day_of_week === today);

  if (!businessInfo) return <p>Loading...</p>;

  const bookHref = `/${businessInfo._id}/book`;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <span className="font-display text-lg tracking-tight">{businessInfo.name}</span>
          <Link
            to={bookHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-olive text-cream text-xs font-medium hover:bg-olive-deep transition-colors"
          >
            Book now
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 sm:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Top detail line */}
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            {businessInfo.createdAt
              ? `EST. ${new Date(businessInfo.createdAt).getFullYear()}`
              : ""}
            {businessInfo.city_id?.name && businessInfo.city_id?.state
              ? ` · ${businessInfo.city_id.name}, ${businessInfo.city_id.state}`
              : ""}
          </div>

          {/* Business name */}
          <h1
            className="font-display font-light text-foreground leading-[0.92] tracking-tightest"
            style={{ fontSize: "clamp(3.5rem, 14vw, 9.5rem)" }}
          >
            {businessInfo.name}
          </h1>

          {/* Category + tagline */}
          <div className="mt-6 flex items-baseline gap-4 flex-wrap">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-olive-deep">
              {businessInfo.category_id?.name}
            </p>
            <span className="text-muted-foreground text-sm">— by appointment only</span>
          </div>

          <div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
            <div className="sm:col-span-8 aspect-[16/10] rounded-2xl overflow-hidden h-full">
              <BusinessImage src={businessInfo.images?.[0]} index={1} />
            </div>
            <div className="sm:col-span-4 aspect-[4/5] rounded-2xl overflow-hidden h-full">
              <BusinessImage src={businessInfo.images?.[1]} index={2} />
            </div>
          </div>


        </div>
      </section>


      {/* About */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-cream/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            About the studio
          </div>
          <p className="font-display text-2xl sm:text-3xl text-foreground leading-snug tracking-tight">
            {businessInfo.bio}
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-14 aspect-[16/8] rounded-2xl overflow-hidden">
          <BusinessImage src={businessInfo.images?.[2]} index={3} />
        </div>
      </section>


      {/* Services */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Menu
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight mt-2">
                Services
              </h2>
            </div>
            <Link
              to={bookHref}
              className="font-mono text-[11px] uppercase tracking-widest text-olive-deep hover:underline"
            >
              Book a service →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {businessInfo.services?.map((s: any) => (
              <div key={s._id} className="bg-background p-6 sm:p-7 flex flex-col">
                <h3 className="font-display text-xl text-foreground mt-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">
                  Takes about {s.duration} min.
                </p>
                <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {s.duration} min
                  </span>
                  <span className="font-display text-2xl text-olive-deep">₹{s.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {(businessInfo.images || []).slice(3, 6).map((img: string, n: number) => (
            <div key={n} className="aspect-[4/5] rounded-2xl overflow-hidden">
              <BusinessImage src={img} index={n + 4} />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 bg-cream/40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              The chairs
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight mt-2">
              Our team
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((m) => (
              <div
                key={m._id}
                className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] 
                          bg-background rounded-2xl border border-border p-6 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-cream-deep flex items-center justify-center font-mono text-sm font-semibold text-olive-deep ring-1 ring-olive/15">
                  {m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-display text-lg text-foreground leading-tight">{m.name}</h3>
                <div className="font-mono text-[10px] uppercase tracking-widest text-olive-deep/80 mt-1">
                  {m.role || "Team member"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          {/* Heading block */}
          <div className="mb-12 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Said about us
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-tight mt-2">
              Words from the chair
            </h2>
          </div>

          {/* Real reviews mapped in */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0, 4).map((r) => (
              <figure
                key={r.id}
                className="relative bg-background border border-border rounded-2xl p-7 sm:p-8 shadow-sm"
              >
                <Quote className="w-6 h-6 text-olive/30 mb-4" />
                <blockquote className="font-display italic text-lg sm:text-xl text-foreground leading-snug">
                  {r.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.author}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                      with {businessInfo.name}
                    </div>
                  </div>
                  <div className="flex gap-0.5" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i < r.rating ? "fill-olive text-olive" : "text-stone-light"
                        )}
                      />
                    ))}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>




      {/* CTA BAND */}
      <section className="px-5 sm:px-8">
        <div className="max-w-7xl mx-auto bg-olive-deep text-cream rounded-3xl px-8 sm:px-16 py-16 sm:py-24 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70 mb-5">
            {todayAvailability
              ? `Open today · ${formatTime(todayAvailability.start_time)} – ${formatTime(todayAvailability.end_time)}`
              : "Open today"}
          </div>
          <h2
            className="font-display font-light tracking-tight leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
          >
            Ready when you are.
          </h2>
          <Link
            to={bookHref}
            className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-full bg-cream text-olive-deep font-medium hover:bg-background transition-colors"
          >
            Book an appointment
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 sm:px-8 mt-16 mb-10">
        <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="font-display text-base text-foreground">{businessInfo.name}</div>
          <div>{businessInfo.address} · {businessInfo.hours}</div>
          <div className="flex gap-4">
            <a href={businessInfo.instagram || "#"} className="hover:text-foreground">Instagram</a>
            <a href={businessInfo.google || "#"} className="hover:text-foreground">Google</a>
            <a href={businessInfo.map || "#"} className="hover:text-foreground">Map</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          Powered by Slotly
        </div>
      </footer>
    </div>
  );
};

export default BusinessSite;
