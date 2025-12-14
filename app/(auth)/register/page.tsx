"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-amber-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl border-2 border-amber-200 p-8 sm:p-10 bg-white shadow-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900">
            Create Account
          </h1>
          <p className="text-amber-700">Join MemoryLane today</p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-amber-900 font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-amber-900 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-amber-900 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-amber-900 font-medium"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
              required
              className="border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md h-11"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>

        <p className="text-center text-sm text-amber-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-600 hover:text-amber-800 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
