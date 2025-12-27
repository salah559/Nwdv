import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setLocation("/admin/messages");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl border border-white/10 p-12">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/20 rounded-2xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold text-center mb-2">
            Admin Access
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Enter password to view messages
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-ui font-bold mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Access"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
