import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import {
  Key,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  Zap,
  Globe,
  Chrome
} from "lucide-react";

const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT Decode error:", error);
    return null;
  }
};

export const Login = () => {
  const { login, googleLogin, currentUser, authLoading } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Google Loading State
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.replace("/dashboard");
    }
  }, [authLoading, currentUser, router]);

  // Load Google GIS SDK on mount
  useEffect(() => {
    const scriptId = "google-gsi-client";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "780289828922-fosql73vv34t51to901pe8lb7v4gtcj7.apps.googleusercontent.com";
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const decoded = decodeJwt(response.credential);
            if (decoded) {
              handleGoogleSelect(decoded.email, decoded.name, decoded.picture);
            }
          }
        });
        const buttonElement = document.getElementById("realGoogleButton");
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            { theme: "outline", size: "large", width: 300 }
          );
        }
      }
    };

    if (window.google?.accounts?.id) {
      setTimeout(initGoogle, 150);
    } else {
      script.onload = initGoogle;
    }
  }, []);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      router.replace(from);
    } else {
      setErrorMessage(res.message || "Credentials rejected. Invalid email or password.");
    }
  };

  const handleGoogleSelect = async (selectedEmail, selectedName, selectedImage) => {
    setGoogleLoading(true);
    const res = await googleLogin(selectedEmail, selectedName, selectedImage, undefined, false);
    setGoogleLoading(false);
    if (res.success) {
      router.replace(from);
    } else {
      if (res.isNotRegistered) {
        setErrorMessage("Google account is not registered. Redirecting to sign up...");
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      } else {
        setErrorMessage(res.message || "Google Single Sign-in authentication failed.");
      }
    }
  };
  return <div className="min-h-[85vh] bg-transparent text-slate-800 dark:text-slate-200 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {
          /* Brand visual header */
        }
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold mx-auto mb-2">
            <Key size={20} />
          </div>
          <h2 className="font-display font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl">StartupForge Secure Portal</h2>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">
            Sign in with your credentials to access the platform.
          </p>
        </div>

        {
          /* Regular Login Form */
        }
        <form onSubmit={handleManualLogin} className="space-y-4 text-xs text-slate-650 dark:text-slate-350">
          
          {errorMessage && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xxs font-medium flex items-center gap-1.5 leading-relaxed">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
              {errorMessage}
            </div>}

          {
    /* Email segment */
  }
          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-350 block font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="developer@example.com"
    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs font-mono"
  />
            </div>
          </div>

          {
    /* Password box */
  }
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-700 dark:text-slate-350 font-semibold">Password</label>
              <a href="#" className="text-primary hover:underline text-xxs">Forgot password?</a>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs"
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3 text-slate-500 hover:text-slate-350"
  >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
    type="submit"
    disabled={loading}
    className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-1 border-0"
  >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
                <span>Sign In Securely</span>
                <ChevronRight size={14} />
              </>}
          </button>

        </form>

        <div className="relative flex py-4 items-center animate-pulse">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div id="realGoogleButton" className="w-full flex justify-center"></div>

        <div className="border-t border-slate-200 dark:border-slate-800 bg-transparent mt-6 pt-5 flex justify-center text-xxs text-slate-500 dark:text-slate-455 dark:text-slate-450 gap-1.5 select-none">
          <span>New to group team building on StartupForge?</span>
          <Link href="/register" className="text-indigo-500 dark:text-indigo-400 hover:underline font-semibold">Create account &gt;</Link>
        </div>

      </div>

    </div>;
};
