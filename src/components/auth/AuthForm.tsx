import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const AuthForm = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        // Full payload for registration
        const res = await axios.post(
          "https://slotly-backend-92ig.onrender.com/api/users/register",
          form
        );
        if (res.status === 201) {
          // Registration successful → go to login
          setMode("login");
          navigate("/auth");
        }
      } else {
        // Login flow
        const res = await axios.post(
          "https://slotly-backend-92ig.onrender.com/api/users/login",
          {
            email: form.email,
            password: form.password,
          }
        );
        const user = res.data;
        localStorage.setItem("userId", user._id);
        localStorage.setItem("token", user.token);

        const businessRes = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/businesses/user/${user._id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (businessRes.data.businesses?.length > 0) {
          navigate("/dashboard");
        } else {
          navigate("/business/register");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-background rounded-2xl shadow-[0_30px_60px_-20px_hsl(0_0%_0%/0.18)] ring-1 ring-foreground/5 p-7 sm:p-9">
        <h2 className="font-display text-3xl text-foreground tracking-tight">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to manage your shop."
            : "Start in 90 seconds. No card required."}
        </p>

        {/* Toggle */}
        <div className="mt-6 grid grid-cols-2 p-1 rounded-full bg-muted">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "relative py-2.5 text-sm font-medium rounded-full transition-all",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name 
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Fade & Co."
                  className="w-full h-11 px-3.5 rounded-lg bg-muted/60 border border-border focus:border-olive focus:bg-background outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-3.5 rounded-lg bg-muted/60 border border-border focus:border-olive focus:bg-background outline-none transition-colors text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@yourshop.com"
              className="w-full h-11 px-3.5 rounded-lg bg-muted/60 border border-border focus:border-olive focus:bg-background outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  className="text-xs text-olive hover:text-olive-deep transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 pr-11 rounded-lg bg-muted/60 border border-border focus:border-olive focus:bg-background outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full h-11 inline-flex items-center justify-center gap-2 bg-olive hover:bg-olive-deep text-cream rounded-lg font-medium text-sm transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Continue with email
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground text-center">
          By continuing, you agree to Slotly's{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
