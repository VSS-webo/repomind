
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GitBranch,
  Search,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Network,
  FileCode,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { getGraph, api } from "@/lib/api";

type Entity = {
  id: string;
  name: string;
  type: string;
  file?: string;
};

type ImpactResult = {
  target?: string;
  direct_dependencies?: string[];
  affected_nodes?: string[];
  impacted_nodes?: string[];
  impact?: string[];
  paths?: unknown[];
  [key: string]: any;
};

export default function ImpactAnalysisPage() {
  const params = useParams<{ id: string }>();
  const repoId = params.id;

  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [error, setError] = useState("");

  async function loadEntities() {
    try {
      setLoadingEntities(true);
      setError("");

      const response = await getGraph(repoId);
      const nodes = response.nodes ?? response.data?.nodes ?? [];

      const mapped: Entity[] = nodes.map((item: any) => {
        const node = item.data ?? item;

        return {
          id: String(node.id ?? node.entity_id ?? node.name),
          name: String(node.label ?? node.name ?? node.id),
          type: String(node.type ?? node.kind ?? "unknown"),
          file: node.file ?? node.file_path ?? node.path,
        };
      });

      setEntities(mapped);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load repository entities"
      );
    } finally {
      setLoadingEntities(false);
    }
  }

  async function analyzeImpact() {
    if (!selectedId) return;

    try {
      setLoadingImpact(true);
      setError("");
      setResult(null);

      const response = await api.get(
        `/api/repositories/${repoId}/impact/${encodeURIComponent(selectedId)}`
      );

      setResult(response.data);
    } catch (err: any) {
      console.error("Impact analysis error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Impact analysis failed"
      );
    } finally {
      setLoadingImpact(false);
    }
  }

  useEffect(() => {
    if (repoId) loadEntities();
  }, [repoId]);

  const filteredEntities = entities.filter((entity) =>
    `${entity.name} ${entity.type} ${entity.file ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function formatValue(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return JSON.stringify(value, null, 2);
  }

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="min-w-0 flex-1">
        <header className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2">
            <GitBranch className="text-indigo-400" size={22} />
            <h1 className="text-xl font-bold">Impact Analysis</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Discover which components may be affected by a code change.
          </p>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 p-6">
          {/* Selection */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-semibold">Select a component</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a function, method, or class to trace its impact.
            </p>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0b1020] px-3">
                <Search size={16} className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter components..."
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={loadingEntities}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b1020] px-3 py-3 text-sm outline-none md:max-w-md"
              >
                <option value="">
                  {loadingEntities ? "Loading components..." : "Select component"}
                </option>
                {filteredEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    [{entity.type}] {entity.name}
                    {entity.file ? ` — ${entity.file}` : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={analyzeImpact}
                disabled={!selectedId || loadingImpact}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-40"
              >
                {loadingImpact ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <GitBranch size={16} />
                )}
                Analyze
              </button>
            </div>

            <button
              onClick={loadEntities}
              disabled={loadingEntities}
              className="mt-3 flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-300"
            >
              <RefreshCw size={13} />
              Refresh components
            </button>
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <AlertCircle size={16} className="mt-0.5" />
              {error}
            </div>
          )}

          {/* Selected entity */}
          {selectedId && (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <FileCode className="text-indigo-300" />
              <div>
                <p className="text-xs text-gray-500">Selected component</p>
                <p className="mt-1 font-medium">
                  {entities.find((e) => e.id === selectedId)?.name ?? selectedId}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loadingImpact && (
            <div className="flex flex-col items-center py-20">
              <LoaderCircle size={30} className="animate-spin text-indigo-400" />
              <p className="mt-4 text-sm text-gray-400">
                Tracing dependency relationships...
              </p>
            </div>
          )}

          {/* Results */}
          {result && !loadingImpact && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Impact Results</h2>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Analysis complete
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <Network className="text-indigo-400" size={20} />
                  <p className="mt-3 text-sm text-gray-500">Affected components</p>
                  <p className="mt-2 text-3xl font-bold">
                    {(
                      result.affected_nodes ??
                      result.impacted_nodes ??
                      result.impact ??
                      []
                    ).length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <GitBranch className="text-purple-400" size={20} />
                  <p className="mt-3 text-sm text-gray-500">Direct dependencies</p>
                  <p className="mt-2 text-3xl font-bold">
                    {(result.direct_dependencies ?? []).length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <FileCode className="text-cyan-400" size={20} />
                  <p className="mt-3 text-sm text-gray-500">Dependency paths</p>
                  <p className="mt-2 text-3xl font-bold">
                    {(result.paths ?? []).length}
                  </p>
                </div>
              </div>

              {/* Raw result fields */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="mb-4 font-semibold">Dependency details</h3>

                <div className="space-y-4">
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
                        {key.replaceAll("_", " ")}
                      </p>

                      <pre className="overflow-auto rounded-lg bg-[#050812] p-4 text-xs leading-6 text-gray-300">
                        {formatValue(value)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {!result && !loadingImpact && !error && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] py-16 text-center">
              <GitBranch size={35} className="mx-auto mb-3 text-gray-600" />
              <p className="font-medium">Ready to analyze impact</p>
              <p className="mt-2 text-sm text-gray-500">
                Select a component above to discover its dependencies.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
