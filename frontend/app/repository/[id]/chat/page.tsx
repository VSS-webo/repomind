
"use client";

import { useState , Suspense } from "react";
import { useParams } from "next/navigation";
import {
  Brain,
  Sparkles,
  Send,
  LoaderCircle,
  Bot,
  User,
  FileCode,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { askRepository } from "@/lib/api";

type Source = {
  file?: string;
  name?: string;
  code?: string;
  snippet?: string;
  content?: string;
  score?: number;
  distance?: number;
  metadata?: Record<string, any>;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

function extractSources(response: any): Source[] {
  const sources =
    response.sources ??
    response.contexts ??
    response.results ??
    response.data?.sources ??
    [];

  return sources.map((source: any) => {
    const metadata = source.metadata ?? {};

    return {
      ...source,
      file:
        source.file ??
        metadata.file ??
        metadata.file_path ??
        metadata.source ??
        "Unknown file",
      name: source.name ?? metadata.name ?? metadata.symbol ?? "",
      code:
        source.code ??
        source.snippet ??
        source.content ??
        metadata.code ??
        "",
      metadata,
    };
  });
}

function extractAnswer(response: any): string {
  return (
    response.answer ??
    response.response ??
    response.message ??
    response.data?.answer ??
    response.data?.response ??
    "No answer was returned by the AI."
  );
}

function RepositoryChatContent () {
  const params = useParams<{ id: string }>();
  const repoId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topK, setTopK] = useState("6");

  async function sendQuestion(text?: string) {
    const query = (text ?? question).trim();

    if (!query || loading) return;

    const userMessage: Message = {
      role: "user",
      content: query,
    };

    setMessages((previous) => [...previous, userMessage]);
    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await askRepository(repoId, query, Number(topK));

      const assistantMessage: Message = {
        role: "assistant",
        content: extractAnswer(response),
        sources: extractSources(response),
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (err: any) {
      console.error("Repository AI error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to generate an answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    if (loading) return;
    setMessages([]);
    setError("");
  }

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="text-indigo-400" size={22} />
              <h1 className="text-xl font-bold">Repository AI</h1>
              <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300">
                RAG
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Ask questions and understand your codebase with AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              Context
              <select
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-white/10 bg-[#0b1020] px-2 py-2 text-white outline-none"
              >
                <option value="3">3 chunks</option>
                <option value="6">6 chunks</option>
                <option value="8">8 chunks</option>
                <option value="10">10 chunks</option>
              </select>
            </label>

            <button
              onClick={clearChat}
              disabled={loading || messages.length === 0}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 disabled:opacity-40"
            >
              <Trash2 size={15} />
              Clear
            </button>
          </div>
        </header>

        {/* Chat body */}
        <section className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5">
            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                  <Sparkles size={30} className="text-indigo-400" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  Understand any codebase
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Ask RepoMind about functions, classes, architecture,
                  dependencies, or implementation details.
                </p>

                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {[
                    "Explain the architecture of this repository",
                    "Where are HTTP retries implemented?",
                    "How does authentication work?",
                    "Explain the main classes and their responsibilities",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendQuestion(suggestion)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-gray-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
                    >
                      <Sparkles
                        size={15}
                        className="mb-2 text-indigo-400"
                      />
                      <p>{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div className="flex-1 space-y-6 py-8">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
                      <Bot size={18} className="text-indigo-400" />
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LoaderCircle
                          size={15}
                          className="animate-spin text-indigo-400"
                        />
                        Analyzing repository context...
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="ml-12 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                    {error}
                    <button
                      onClick={() => sendQuestion(messages[messages.length - 1]?.content)}
                      className="ml-2 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="sticky bottom-0 border-t border-white/10 bg-[#080b14] px-5 py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion();
              }}
              className="mx-auto max-w-4xl"
            >
              <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition focus-within:border-indigo-500/40">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendQuestion();
                    }
                  }}
                  placeholder="Ask anything about your repository..."
                  rows={2}
                  disabled={loading}
                  className="max-h-40 min-h-[48px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-gray-600"
                />

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Send question"
                >
                  {loading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-gray-600">
                AI answers are generated using retrieved repository context.
                Verify important code details against the source.
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className="flex gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isUser ? "bg-white/10" : "bg-indigo-500/15"
        }`}
      >
        {isUser ? (
          <User size={18} className="text-gray-300" />
        ) : (
          <Bot size={18} className="text-indigo-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-semibold">
          {isUser ? "You" : "RepoMind AI"}
        </p>

        <div className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">
          {message.content}
        </div>

        {!isUser && (
          <button
            onClick={() => navigator.clipboard.writeText(message.content)}
            className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-300"
          >
            <Copy size={13} />
            Copy answer
          </button>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesPanel sources={message.sources} />
        )}
      </div>
    </div>
  );
}

function SourcesPanel({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-2">
          <FileCode size={15} className="text-indigo-400" />
          Retrieved sources ({sources.length})
        </span>

        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/5 p-3">
          {sources.map((source, index) => (
            <div
              key={`${source.file}-${index}`}
              className="rounded-lg border border-white/5 bg-[#050812] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-indigo-300">
                  {source.file}
                </span>

                {typeof source.distance === "number" && (
                  <span className="shrink-0 text-xs text-gray-500">
                    Distance: {source.distance.toFixed(3)}
                  </span>
                )}
              </div>

              {source.name && (
                <p className="mt-1 text-xs text-gray-400">{source.name}</p>
              )}

              {(source.code || source.snippet || source.content) && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-400">
                  {source.code || source.snippet || source.content}
                </pre>
              )}

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    source.code || source.snippet || source.content || ""
                  )
                }
                className="mt-2 text-xs text-gray-500 hover:text-indigo-300"
              >
                Copy source
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default function RepositoryChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
          Loading RepoMind AI...
        </div>
      }
    >
      <RepositoryChatContent  />
    </Suspense>
  );
}