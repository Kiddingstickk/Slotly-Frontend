import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = ({ businessInfo }: { businessInfo: any }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="border-t bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </button>
            <Link
              to={`/${businessInfo._id}/book`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Book Now
            </Link>
            <button
              onClick={() => scrollTo("contact")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </nav>
          <div className="flex gap-5">
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;