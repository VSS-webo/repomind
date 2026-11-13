
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Bug,
  Sparkles,
  Code2,
  LoaderCircle,
  AlertTriangle,
  Clipboard,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { reviewCode } from "@/lib/api";

type Finding = {
  title?: string;
  severity?: string;
  category?: string;
  description?: string;
  file?: string;
  line?: number;
  suggestion?: string;
};

export default function CodeReviewPage() {
  const params = useParams();
  const repoId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [diff, setDiff] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();

    if (!diff.trim() || loading) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await reviewCode(diff, repoId);
      setResult(response);
    } catch (err: any) {
      console.error("AI review error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "AI code review failed"
      );
    } finally {
      setLoading(false);
    }
  }

  const findings: Finding[] =
    result?.findings ??
    result?.issues ??
    result?.review?.findings ??
    [];

  function severityColor(severity = "medium") {
    const value = severity.toLowerCase();

    if (value === "critical") return "border-red-500/30 bg-red-500/10 text-red-300";
    if (value === "high") return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    if (value === "medium") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";

    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  async function copyResult() {
    await navigator.clipboard.writeText(
      JSON.stringify(result, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="min-w-0 flex-1">
        <header className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={22} />
            <h1 className="text-xl font-bold">AI Code Review</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Detect potential bugs, security risks, and improvements in your diff.
          </p>
        </header>

        <div className="mx-auto max-w-5xl space-y-6 p-6">
          {/* Diff input */}
          <form
            onSubmit={handleReview}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-indigo-400" />
              <h2 className="font-semibold">Git Diff</h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Paste your code changes below.
            </p>

            <textarea
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              placeholder={`diff --git a/example.py b/example.py
+def calculate_total(items):
+    return sum(items)`}
              rows={14}
              className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-[#050812] p-4 font-mono text-xs leading-6 text-gray-300 outline-none focus:border-indigo-500/40"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-600">
                Review the actual changes, not the entire repository.
              </span>

              <button
                type="submit"
                disabled={loading || !diff.trim()}
                className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-40"
              >
                {loading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Review Changes
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-16">
              <LoaderCircle size={30} className="animate-spin text-indigo-400" />
              <p className="mt-4 text-sm text-gray-400">
                Reviewing code changes...
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Analyzing correctness, security, and maintainability
              </p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Review Results</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {findings.length} potential findings
                  </p>
                </div>

                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 hover:text-white"
                >
                  {copied ? <CheckCircle2 size={14} /> : <Clipboard size={14} />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-indigo-400" />
                  <h3 className="font-semibold">Summary</h3>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                  {result.summary ??
                    result.review_summary ??
                    result.overall_assessment ??
                    result.review?.summary ??
                    "Review completed. Inspect findings below."}
                </p>
              </div>

              {/* Findings */}
              {findings.length > 0 ? (
                <div className="space-y-4">
                  {findings.map((finding, index) => (
                    <article
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Bug size={16} className="text-indigo-400" />

                        <h3 className="font-semibold">
                          {finding.title ?? `Finding ${index + 1}`}
                        </h3>

                        <span
                          className={`rounded-md border px-2 py-1 text-xs uppercase ${severityColor(finding.severity)}`}
                        >
                          {finding.severity ?? "Medium"}
                        </span>

                        {finding.category && (
                          <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                            {finding.category}
                          </span>
                        )}
                      </div>

                      {finding.file && (
                        <p className="mt-3 font-mono text-xs text-gray-500">
                          {finding.file}
                          {finding.line ? `:${finding.line}` : ""}
                        </p>
                      )}

                      <p className="mt-3 text-sm leading-7 text-gray-300">
                        {finding.description ?? "No description provided."}
                      </p>

                      {finding.suggestion && (
                        <div className="mt-4 rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
                          <p className="mb-2 text-xs font-semibold text-emerald-300">
                            Suggested Fix
                          </p>
                          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                            {finding.suggestion}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                  <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={30} />
                  <p className="font-medium">No structured findings returned</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Inspect the raw review response below.
                  </p>
                </div>
              )}

              {/* Raw response */}
              <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <summary className="cursor-pointer text-sm text-gray-400">
                  Raw review response
                </summary>
                <pre className="mt-4 overflow-auto rounded-lg bg-[#050812] p-4 text-xs leading-6 text-gray-300">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>

              <p className="text-xs leading-5 text-gray-600">
                AI-generated findings are suggestions, not verified vulnerabilities.
                Validate them before applying changes.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
