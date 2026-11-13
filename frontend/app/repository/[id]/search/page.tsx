
"use client";

import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Sparkles,
  FileCode,
  ArrowUpRight,
  LoaderCircle,
  Code2,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { searchRepository } from "@/lib/api";

type SearchResult = {
  id?: string;
  file?: string;
  name?: string;
  type?: string;
  code?: string;
  snippet?: string;
  content?: string;
  distance?: number;
  score?: number;
  metadata?: Record<string, any>;
};

function SemanticSearchPageContent() {
  const params = useParams<{ id: string }>();
  const repoId = params.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [topK, setTopK] = useState("8");

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await searchRepository(repoId, query, Number(topK));

      const rawResults =
        response.results ??
        response.data?.results ??
        response.matches ??
        [];

      setResults(
        rawResults.map((item: any) => {
          const metadata = item.metadata ?? {};

          return {
            ...item,
            file:
              item.file ??
              metadata.file ??
              metadata.file_path ??
              metadata.source ??
              "Unknown file",
            name:
              item.name ??
              metadata.name ??
              metadata.symbol ??
              metadata.function ??
              "",
            type: item.type ?? metadata.type ?? "code",
            code:
              item.code ??
              item.snippet ??
              item.content ??
              metadata.code ??
              "",
            distance: item.distance,
            score: item.score,
            metadata,
          };
        })
      );
    } catch (err: any) {
      console.error("Semantic search error:", err);
      setResults([]);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function similarityLabel(result: SearchResult) {
    if (typeof result.score === "number") {
      return `${(result.score * 100).toFixed(1)}%`;
    }

    if (typeof result.distance === "number") {
      // Chroma cosine distance: smaller distance is better.
      const similarity = Math.max(0, Math.min(1, 1 - result.distance));
      return `${(similarity * 100).toFixed(1)}%`;
    }

    return "Semantic match";
  }

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="min-w-0 flex-1">
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={22} />
            <h1 className="text-xl font-bold">Semantic Code Search</h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Find relevant code using natural language and semantic similarity.
          </p>
        </header>

        <div className="mx-auto max-w-5xl space-y-6 p-6">
          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <label className="mb-3 block text-sm font-medium text-gray-300">
              What are you looking for?
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#0b1020] px-4">
                <Search className="shrink-0 text-gray-500" size={18} />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Where are HTTP retries handled?"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  <Search size={16} />
                )}
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  "Where are HTTP retries handled?",
                  "How does authentication work?",
                  "How are request headers prepared?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 transition hover:border-indigo-500/40 hover:text-indigo-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-500">
                Results
                <select
                  value={topK}
                  onChange={(e) => setTopK(e.target.value)}
                  className="rounded-md border border-white/10 bg-[#0b1020] px-2 py-1 text-white outline-none"
                >
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Results heading */}
          {searched && !loading && !error && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Search Results</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {results.length} matching code chunks
                </p>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                Semantic search
              </span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <LoaderCircle
                size={30}
                className="animate-spin text-indigo-400"
              />
              <p className="mt-4 text-sm text-gray-400">
                Searching repository...
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Comparing your query with indexed code
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && searched && results.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] py-16 text-center">
              <Search className="mx-auto mb-3 text-gray-600" size={30} />
              <p className="font-medium">No matching code found</p>
              <p className="mt-2 text-sm text-gray-500">
                Try a different query or index the repository again.
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, index) => (
                <article
                  key={result.id ?? `${result.file}-${index}`}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] transition hover:border-indigo-500/30"
                >
                  {/* Result header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileCode
                        size={16}
                        className="shrink-0 text-indigo-400"
                      />
                      <span className="truncate text-sm font-medium text-gray-200">
                        {result.file}
                      </span>
                    </div>

                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                      {similarityLabel(result)}
                    </span>
                  </div>

                  {/* Result content */}
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Code2 size={14} className="text-gray-500" />
                      <span className="text-sm font-semibold text-indigo-300">
                        {result.name || result.type || "Code snippet"}
                      </span>
                    </div>

                    <pre className="max-h-80 overflow-auto rounded-lg bg-[#050812] p-4 text-xs leading-6 text-gray-300">
                      <code>
                        {result.code || "No code snippet available."}
                      </code>
                    </pre>

                    {result.metadata?.start_line && (
                      <p className="mt-2 text-xs text-gray-600">
                        Lines {result.metadata.start_line}
                        {result.metadata.end_line
                          ? `–${result.metadata.end_line}`
                          : ""}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {result.type || "Code"}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(result.code || "");
                        }}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-300"
                      >
                        Copy code
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Initial state */}
          {!searched && (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Sparkles size={26} className="text-indigo-400" />
              </div>
              <h2 className="mt-4 font-semibold">Search your codebase intelligently</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Describe what you want to find. RepoMind retrieves relevant
                functions, classes, and code chunks based on meaning.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default function SemanticSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
          Loading RepoMind AI...
        </div>
      }
    >
      <SemanticSearchPageContent />
    </Suspense>
  );
}