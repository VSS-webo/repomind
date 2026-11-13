
"use client";

import Link from "next/link";
import {
  Sparkles,
  Home,
  Network,
  Search,
  Bot,
  BarChart3,
  BookOpen,
  ArrowRight,
  GitBranch,
  Code2,
  Zap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Repository Dashboard",
    description:
      "Get an overview of Chronix with repository statistics and key insights.",
    icon: Home,
    href: "/repository/demo",
    color: "blue",
    status: "Available",
  },
  {
    title: "Dependency Graph",
    description:
      "Explore code relationships, functions, classes, and dependencies.",
    icon: Network,
    href: "/repository/demo/graph",
    color: "purple",
    status: "Available",
  },
  {
    title: "Semantic Search",
    description:
      "Find relevant code using natural-language queries and semantic similarity.",
    icon: Search,
    href: "/repository/demo/search",
    color: "emerald",
    status: "Available",
  },
  {
    title: "Repository AI Chat",
    description:
      "Ask questions about the repository and explore answers with code references.",
    icon: Bot,
    href: "/repository/demo/chat",
    color: "pink",
    status: "Available",
  },
  {
    title: "Analytics",
    description:
      "Explore detailed repository statistics, complexity, and code insights.",
    icon: BarChart3,
    href: "/repository/demo/analytics",
    color: "orange",
    status: "Coming Soon",
  },
  {
    title: "Documentation",
    description:
      "Learn how RepoMind analyzes, indexes, and understands codebases.",
    icon: BookOpen,
    href: "/",
    color: "cyan",
    status: "Explore",
  },
];

const colorStyles: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/50",
  purple:
    "bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/50",
  emerald:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:border-pink-500/50",
  orange:
    "bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:border-orange-500/50",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/50",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#080b14] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
              <Code2 className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">RepoMind AI</h1>
              <p className="text-xs text-gray-500">
                Explore · Understand · Build
              </p>
            </div>
          </Link>

          <Link
            href="https://github.com/VSS-webo"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
          >
            <GitBranch  size={17} />
            GitHub
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-[#10152b] to-blue-950/50 p-7 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Pre-indexed Demo · Chronix
            </div>

            <div className="flex items-center gap-3">
              <Sparkles size={30} className="text-indigo-400" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Explore RepoMind
              </h2>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Experience how RepoMind transforms a codebase into an
              interactive knowledge system. Explore repository structure,
              search code semantically, and ask questions about
              implementation details.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/repository/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Explore Repository
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/repository/demo/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08]"
              >
                <Bot size={17} />
                Try AI Chat
              </Link>
            </div>
          </div>

          {/* Repository identity */}
          <div className="relative mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <GitBranch  size={30} />
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-wide">CHRONIX</h3>
              <p className="mt-1 text-sm text-gray-500">
                A real GitHub repository · Pre-indexed for demonstration
              </p>
            </div>

            <Link
              href="https://github.com/VSS-webo/chronix"
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              View source
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={21} className="text-indigo-400" />
                <h2 className="text-2xl font-bold">Explore Demo Features</h2>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Try the RepoMind capabilities with Chronix.
              </p>
            </div>

            <span className="text-xs text-gray-600">
              4 interactive features
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const comingSoon = feature.status === "Coming Soon";

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={`group relative flex min-h-[190px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.045] ${
                    comingSoon ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${colorStyles[feature.color]}`}
                    >
                      <Icon size={23} />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        comingSoon
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold text-gray-100">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>

                  <div className="mt-auto flex justify-end pt-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-gray-500 transition group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Demo notice */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-blue-400"
          />
          <div>
            <p className="text-sm font-medium text-blue-300">
              Ready to explore — no setup required
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              This demo uses pre-indexed Chronix repository data.
              You do not need to clone anything, run a backend,
              or configure an API key to explore the available features.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
          RepoMind AI · Explore codebases intelligently
        </footer>
      </div>
    </main>
  );
}
