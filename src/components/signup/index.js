import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true }); 
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Firebase Auth Error:", err);

      const errorString = JSON.stringify(err) || err.message || err.code || String(err);

      if (errorString.includes("popup-closed-by-user")) {
        setError("Google sign-in was cancelled. Please try again.");
      } 
      else if (
        errorString.includes("invalid-credential") || 
        errorString.includes("account-exists-with-different-credential") ||
        errorString.includes("credential-already-in-use")
      ) {
        setError("This account is already registered with a password. Please sign in using your email and password.");
      } 
      else {
        setError(err.message ? err.message.replace("Firebase: ", "") : "An error occurred during sign-in.");
      }
    }

    setLoading(false);
  };

  return (
    <section className="relative z-10 min-h-screen bg-[#F8F9FF] dark:bg-[#060912] flex items-center justify-center py-16 px-4 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20 dark:blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-600/20 dark:blur-[150px] animate-pulse-slow delay-700"></div>
      </div>

      <div className="w-full max-w-[380px] mx-auto bg-white/90 dark:bg-[#121723]/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-white/5 relative overflow-hidden transition-all duration-300">
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-5">
            <img src="/images/logo/logo.svg" alt="Lurnix Logo" className="w-[140px] h-[40px] object-contain" />
          </Link>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-dark dark:text-white mb-1.5">Welcome Back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your details to access your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide text-gray-600 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#242933] text-dark dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm" 
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">Password</label>
                <Link to="#" className="text-xs font-bold text-primary hover:text-primary/80 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#242933] text-dark dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm" 
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] mt-3.5 text-sm disabled:opacity-70">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-gray-100 dark:bg-gray-800"></span>
            <span className="relative bg-white dark:bg-[#17182b] px-3 text-xs text-gray-400 font-bold uppercase tracking-[2px]">OR</span>
          </div>

          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full py-2.5 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-70">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="google" />
            Continue with Google
          </button>

          <p className="text-center mt-7 text-xs text-gray-500 dark:text-gray-400 font-medium">
            New to Lurnix? <Link to="/signup" className="text-primary font-bold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;