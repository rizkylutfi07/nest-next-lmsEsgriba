"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { useRole, type AuthResponse } from "../(dashboard)/role-context";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-x-0 top-[-160px] h-80 bg-gradient-to-b from-primary/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute left-[-60px] bottom-[-60px] h-80 w-80 rounded-full bg-emerald-400/15 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md border-white/10 bg-card/70 shadow-xl shadow-black/30">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-background shadow-lg shadow-primary/40">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Arunika LMS</p>
                <p className="text-lg font-semibold">Masuk ke dashboard</p>
              </div>
            </div>
            <CardDescription>
              Gunakan kredensial Anda. Role (admin/guru/siswa) akan mengikuti akun saat login.
            </CardDescription>
            <div className="flex gap-2">
              <Badge tone="info">Multi-role</Badge>
              <Badge tone="success">JWT Protected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="space-y-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={14} />
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-primary/20 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                  placeholder="admin@sekolah.id"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Lock size={14} />
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-primary/20 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                  placeholder="********"
                  minLength={6}
                />
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Sparkles size={16} />
                {loading ? "Memproses..." : "Masuk"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Belum ada akun? Admin dapat mendaftar via API <code>/auth/register</code>.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
