import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { businessInfo } from "@/data/mockData";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
          {businessInfo.name}
        </Link>
        <Button asChild size="sm">
          <Link to="/businessname/book">Book Now</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
