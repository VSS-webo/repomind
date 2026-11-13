
"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  GitBranch,
  Network,
  Brain,
  ArrowRight,
  Plus,
  Code2,
  Sparkles,
  Loader2,
} from "lucide-react";

import { cloneRepository } from "@/lib/api";

function HomeContent() {
  const router = useRouter();

  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const features = [
    {
      icon: Network,
      title: "Dependency Intelligence",
      description:
        "Explore files, classes, functions and dependencies through interactive graphs.",
    },
    {
      icon: GitBranch,
      title: "Change Impact Analysis",
      description:
        "Understand what breaks when a function, class or module changes.",
    },
    {
      icon: Search,
      title: "Semantic Code Search",
      description:
      "Find relevant implementation using natural-language queries.",
    },
    {
      icon: Brain,
      title: "Repository AI",
      description:
        "Ask questions about your codebase with grounded source references.",
    },
  ];

  async function handleConnect() {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const repo = await cloneRepository(repoUrl.trim());

      router.push(`/repository/${repo.repo_id}`);
    } catch (error: any) {
  console.error("Repository clone error:", error);

  alert(
    error.response?.data?.detail ||
    error.message ||
    "Failed to connect repository"
  );
} finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
            <Code2 size={22} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            RepoMind <span className="text-indigo-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="hidden sm:block">
            Codebase Intelligence
          </span>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-400">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Ready
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            <Sparkles size={15} />
            Understand codebases. Predict changes.
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Your codebase,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              understood by AI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Analyze repository architecture, trace dependencies,
            discover change impact and ask intelligent questions
            about your code.
          </p>

          {/* GitHub Input */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-indigo-500/5 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Code2 className="shrink-0 text-gray-400" size={21} />

                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConnect();
                  }}
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-medium transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}

                {loading ? "Connecting..." : "Analyze Repository"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <p className="mt-4 text-xs text-gray-600">
              Start with a public GitHub repository.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10">
          <p className="text-sm font-medium text-indigo-400">
            PLATFORM CAPABILITIES
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Everything about your code, connected.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-400/30 hover:bg-indigo-400/[0.04]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Icon size={22} />
                </div>

                <h3 className="mb-3 font-semibold">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs text-indigo-400 opacity-0 transition group-hover:opacity-100">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-gray-500">
          <span>RepoMind AI · Codebase Intelligence</span>
          <span>Built for developers</span>
        </div>
      </footer>
    </main>
  );
}
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
          Loading RepoMind AI...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}