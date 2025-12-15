"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Registration failed");
      }

      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border-2 border-cyan-500/30 p-8 sm:p-10 bg-slate-900 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/50">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Create Account
          </h1>
          <p className="text-slate-400">Join MemoryLane and start preserving memories</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-white font-semibold"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
              required
              className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 h-12 font-bold text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}