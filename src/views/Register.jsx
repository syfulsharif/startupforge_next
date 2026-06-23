import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { Eye, EyeOff, Check, X, Camera, Sparkles, Chrome } from "lucide-react";

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

export const Register = () => {
  const { register, googleLogin, currentUser, authLoading } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("collaborator");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reqLength, setReqLength] = useState(false);
  const [reqUpper, setReqUpper] = useState(false);
  const [reqLower, setReqLower] = useState(false);
  const [strengthScore, setStrengthScore] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Google Onboarding State
  const [isGoogleOnboarding, setIsGoogleOnboarding] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSelect = (googleEmail, googleName, googleImage) => {
    setName(googleName || "");
    setEmail(googleEmail || "");
    setAvatar(googleImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
    setIsGoogleOnboarding(true);
  };

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.replace("/dashboard");
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    const hasMinLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    setReqLength(hasMinLength);
    setReqUpper(hasUpper);
    setReqLower(hasLower);
    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    setStrengthScore(score);
  }, [password]);

  // Load Google GIS SDK on mount
  useEffect(() => {
    if (isGoogleOnboarding) return;
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
        const buttonElement = document.getElementById("realRegisterGoogleButton");
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
  }, [isGoogleOnboarding]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.VITE_IMGBB_API_KEY || '40fc352c6909e2cee7457e65b91131f8';
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setAvatar(data.data.url);
      } else {
        alert("Image upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error uploading image to ImgBB.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isGoogleOnboarding && strengthScore < 3) return;
    setLoading(true);
    if (isGoogleOnboarding) {
      const res = await googleLogin(email, name, avatar, role, true);
      setLoading(false);
      if (res.success) {
        router.push("/dashboard");
      }
    } else {
      const res = await register(name, email, password, role, avatar);
      setLoading(false);
      if (res.success) {
        router.push("/dashboard");
      }
    }
  };
  const getStrengthLabel = () => {
    switch (strengthScore) {
      case 3:
        return { text: "Excellent", color: "bg-emerald-500 text-emerald-400" };
      case 2:
        return { text: "Good", color: "bg-amber-500 text-amber-500" };
      default:
        return { text: "Weak", color: "bg-rose-500 text-rose-500" };
    }
  };
  return <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative">
      
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold mx-auto mb-2">
            <Sparkles size={18} />
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">Join the Forge Build-force</h2>
          <p className="text-slate-650 dark:text-slate-400 text-[11px] mt-1">
            Create an account to pitch ideas, join team squads, and formalize equity milestones.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs text-slate-650 dark:text-slate-350">
          
          {isGoogleOnboarding && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-450 dark:text-indigo-300 text-[10px] rounded-lg mb-4 flex items-center justify-between">
              <div>
                <span className="font-bold">Linked to Google Account!</span> Review and customize your Name, Email, and select your Role.
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGoogleOnboarding(false);
                  setName("");
                  setEmail("");
                  setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
                }}
                className="text-[9px] text-rose-500 hover:underline font-bold border-0 bg-transparent cursor-pointer ml-2"
              >
                Disconnect
              </button>
            </div>
          )}
          
          {/* Avatar Upload (ImgBB) */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <label className="text-slate-700 dark:text-slate-330 font-semibold block text-center">Profile Picture (ImgBB File Upload)</label>
            <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarUploading}
                />
              </label>
            </div>
            {avatarUploading ? (
              <span className="text-[10px] text-indigo-500 font-semibold">Uploading to ImgBB...</span>
            ) : (
              <span className="text-[10px] text-slate-500">Hover & click to upload custom image</span>
            )}
          </div>

          {
            /* Full Name */
          }
          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-330 font-semibold block">Full Name</label>
            <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Elena Rostova"
    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-3 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs"
  />
          </div>

          {
    /* Email segment */
  }
          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-330 font-semibold block">Email Address</label>
            <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="elena@rost.io"
    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-3 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs font-mono"
  />
          </div>

          {
    /* Role Selection */
  }
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-330 font-semibold block">Account Purpose (Your Platform Role)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("collaborator")}
                className={`py-2 px-3.5 border rounded-lg text-center font-bold font-sans transition ${role === "collaborator" ? "bg-primary border-primary text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                Collaborator / Builder
              </button>
              <button
                type="button"
                onClick={() => setRole("founder")}
                className={`py-2 px-3.5 border rounded-lg text-center font-bold font-sans transition ${role === "founder" ? "bg-primary border-primary text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                Startup Founder / Initiator
              </button>
            </div>
          </div>

          {
    /* Password box */
  }
          {!isGoogleOnboarding && (
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-330 font-semibold block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-3 pr-10 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-355"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {
                /* Password strength visual meter */
              }
              <div className="space-y-1 mt-2.5">
                <div className="flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400">
                  <span>Password Strength Checklist:</span>
                  <span className={`font-semibold ${getStrengthLabel().color}`}>{getStrengthLabel().text}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1">
                  <div className={`h-full rounded ${strengthScore >= 1 ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                  <div className={`h-full rounded ${strengthScore >= 2 ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                  <div className={`h-full rounded ${strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                </div>
              </div>

              {
                /* Checklists items */
              }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] mt-2 bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-205/65 border-slate-200 dark:border-slate-850/60 rounded-lg select-none">
                <span className={`flex items-center gap-1 ${reqLength ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {reqLength ? <Check size={11} /> : <X size={11} />} Min 6 Chars
                </span>
                <span className={`flex items-center gap-1 ${reqUpper ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {reqUpper ? <Check size={11} /> : <X size={11} />} 1 Uppercase
                </span>
                <span className={`flex items-center gap-1 ${reqLower ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {reqLower ? <Check size={11} /> : <X size={11} />} 1 Lowercase
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!isGoogleOnboarding && strengthScore < 3)}
            className="w-full bg-primary hover:bg-primary/95 text-white py-2.5 font-bold rounded-lg transition-all shadow-lg shadow-primary/15 flex items-center justify-center gap-1 border-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span>{isGoogleOnboarding ? "Complete Google Registration" : "Create Account Profile"}</span>}
          </button>

        </form>

        {!isGoogleOnboarding && (
          <>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-455 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div id="realRegisterGoogleButton" className="w-full flex justify-center"></div>
          </>
        )}

        <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-5 flex justify-center text-xxs text-slate-500 dark:text-slate-455 dark:text-slate-450 gap-1 select-none">
          <span>Already registered?</span>
          <Link href="/login" className="text-cyan-500 dark:text-cyan-400 hover:underline">Sign In portal &gt;</Link>
        </div>

      </div>

    </div>;
};
