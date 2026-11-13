
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  GitBranch,
  Network,
  Search,
  Brain,
  Code2,
  RefreshCw,
  ArrowRight,
  FolderGit2,
  Loader2,
  Activity,
  AlertCircle,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { getRepository, analyzeRepository } from "@/lib/api";

type Repository = {
  repo_id: string;
  name?: string;
  url?: string;
  owner?: string;
  description?: string;
  default_branch?: string;
  [key: string]: any;
};

type Analysis = {
  statistics?: {
    nodes?: number;
    edges?: number;
    files?: number;
    functions?: number;
    methods?: number;
    classes?: number;
  };
  [key: string]: any;
};

function RepositoryDashboardContent() {
  const params = useParams();
  const router = useRouter();

  const repoId = String(params.id);

  const [repo, setRepo] = useState<Repository | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function loadRepository() {
    setLoading(true);
    setError("");

    try {
      const data = await getRepository(repoId);
      setRepo(data);

      // If metadata already contains analysis statistics
      if (data.statistics) {
        setAnalysis(data);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Could not load repository."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setError("");

    try {
      const result = await analyzeRepository(repoId);
      setAnalysis(result);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Repository analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    loadRepository();
  }, [repoId]);

  const stats = analysis?.statistics || {};

  const metrics = [
    {
      label: "Files",
      value: stats.files ?? 0,
      icon: FolderGit2,
    },
    {
      label: "Functions",
      value: stats.functions ?? 0,
      icon: Code2,
    },
    {
      label: "Classes",
      value: stats.classes ?? 0,
      icon: Activity,
    },
    {
      label: "Graph Nodes",
      value: stats.nodes ?? 0,
      icon: Network,
    },
  ];

  const tools = [
    {
      title: "Dependency Graph",
      description: "Explore repository architecture and dependencies.",
      icon: Network,
      href: `/repository/${repoId}/graph`,
      color: "text-cyan-400",
    },
    {
      title: "Impact Analysis",
      description: "Understand how code changes affect other modules.",
      icon: GitBranch,
      href: `/repository/${repoId}/impact`,
      color: "text-orange-400",
    },
    {
      title: "Semantic Search",
      description: "Search code using natural-language queries.",
      icon: Search,
      href: `/repository/${repoId}/search`,
      color: "text-emerald-400",
    },
    {
      title: "Repository AI",
      description: "Ask questions about your codebase.",
      icon: Brain,
      href: `/repository/${repoId}/chat`,
      color: "text-purple-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
        <Loader2 className="mr-3 animate-spin" />
        Loading repository...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        {/* Header */}
        <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
              <FolderGit2 size={16} />
              Workspace / Repository
            </div>

            <h1 className="text-3xl font-bold">
              {repo?.name || repo?.repo_name || "Repository Dashboard"}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {repo?.url || repo?.description || repoId}
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-medium transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}

            {analyzing ? "Analyzing..." : "Analyze Repository"}
          </button>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Metrics */}
        <section className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {metric.label}
                  </span>

                  <Icon size={20} className="text-indigo-400" />
                </div>

                <p className="text-3xl font-bold">
                  {metric.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </section>

        {/* Graph stats */}
        <section className="mb-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">Graph Edges</p>
            <p className="mt-3 text-3xl font-bold">
              {(stats.edges ?? 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Relationships between repository entities
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">Methods</p>
            <p className="mt-3 text-3xl font-bold">
              {(stats.methods ?? 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Methods identified through AST analysis
            </p>
          </div>
        </section>

        {/* Tools */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Repository Intelligence
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Explore your repository with AI-powered tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.title}
                  onClick={() => router.push(tool.href)}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-indigo-400/30 hover:bg-indigo-400/[0.04]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Icon size={24} className={tool.color} />

                    <ArrowRight
                      size={18}
                      className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>

                  <h3 className="font-semibold">{tool.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {tool.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-gray-500">
          RepoMind AI · Repository Intelligence
        </footer>
      </main>
    </div>
  );
}
export default function RepositoryDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
          Loading RepoMind AI...
        </div>
      }
    >
      <RepositoryDashboardContent />
    </Suspense>
  );
}