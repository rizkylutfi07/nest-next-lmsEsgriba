"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";
import { useRole, type AuthResponse } from "../(dashboard)/role-context";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth(data);
      router.replace("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background selection:bg-primary/20">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vw] rounded-full bg-purple-500/20 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[30%] -right-[10%] h-[60vh] w-[60vw] rounded-full bg-blue-500/20 blur-[120px] animate-pulse duration-[10000ms] delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] h-[50vh] w-[50vw] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse duration-[12000ms] delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div
          className={`w-full max-w-[420px] transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          {/* Logo/Brand Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-3 shadow-lg shadow-primary/25 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Selamat Datang
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Masuk untuk mengakses Arunika LMS
            </p>
          </div>

          {/* Login Card */}
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <Mail size={18} />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all"
                      placeholder="nama@sekolah.sch.id"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <Lock size={18} />
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 dark:text-red-400 border border-red-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] font-medium text-base"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground/60">
            Powered by <span className="font-semibold text-foreground/80">Arunika Team</span>
            <br />
            &copy; 2025 All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
