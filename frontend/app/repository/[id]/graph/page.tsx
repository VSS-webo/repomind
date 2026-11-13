
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  RefreshCw,
  Search,
  Network,
  X,
  Code2,
  FileCode,
  Layers,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { getGraph } from "@/lib/api";


type GraphNodeData = {
  label: string;
  type: string;
  file?: string;
  details?: string;
  original: Record<string, unknown>;
};

function CustomNode({ data, selected }: NodeProps<Node<GraphNodeData>>) {
  const type = String(data.type || "function").toLowerCase();

  const colors: Record<string, string> = {
    class: "border-purple-500/60 bg-purple-500/10",
    function: "border-blue-500/60 bg-blue-500/10",
    method: "border-cyan-500/60 bg-cyan-500/10",
    file: "border-emerald-500/60 bg-emerald-500/10",
    module: "border-emerald-500/60 bg-emerald-500/10",
  };

  const color = colors[type] || "border-indigo-500/60 bg-indigo-500/10";

  return (
    <div
      className={`min-w-[180px] rounded-xl border p-3 shadow-xl backdrop-blur-sm ${color} ${
        selected ? "ring-2 ring-indigo-400" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-2">
        <Code2 size={15} className="text-indigo-300" />
        <span className="max-w-[200px] truncate text-sm font-semibold text-white">
          {data.label}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-400">
          {type}
        </span>

        {data.file && (
          <span className="max-w-[110px] truncate text-[10px] text-gray-500">
            {data.file}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

function normalizeGraph(raw: any): { nodes: Node<GraphNodeData>[]; edges: Edge[] } {
  // Supports common graph response formats.
  const rawNodes = raw?.nodes ?? raw?.data?.nodes ?? raw?.elements?.nodes ?? [];
  const rawEdges = raw?.edges ?? raw?.data?.edges ?? raw?.elements?.edges ?? [];

  const nodes: Node<GraphNodeData>[] = rawNodes.map((item: any, index: number) => {
    const n = item?.data ?? item;

    const id = String(
      n.id ?? n.entity_id ?? n.name ?? n.label ?? `node-${index}`
    );

    const label = String(
      n.label ?? n.name ?? n.qualified_name ?? n.id ?? `Node ${index}`
    );

    const type = String(
      n.type ?? n.kind ?? n.entity_type ?? "function"
    );

    return {
      id,
      type: "custom",
      position: {
        x: Number(n.x ?? n.position?.x ?? (index % 5) * 260),
        y: Number(n.y ?? n.position?.y ?? Math.floor(index / 5) * 150),
      },
      data: {
        label,
        type,
        file: n.file ?? n.file_path ?? n.path,
        details: n.description ?? n.docstring,
        original: n,
      },
    };
  });

  const nodeIds = new Set(nodes.map((node) => node.id));

  const edges: Edge[] = rawEdges
    .map((item: any, index: number) => {
      const e = item?.data ?? item;

      const source = String(
        e.source ?? e.from ?? e.source_id ?? e.src ?? ""
      );

      const target = String(
        e.target ?? e.to ?? e.target_id ?? e.dst ?? ""
      );

      if (!nodeIds.has(source) || !nodeIds.has(target)) {
        return null;
      }

      return {
        id: String(e.id ?? `edge-${index}`),
        source,
        target,
        label: e.type ?? e.label ?? undefined,
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
        },
        style: {
          stroke: "#6366f1",
          strokeWidth: 1.5,
        },
        labelStyle: {
          fill: "#a5b4fc",
          fontSize: 10,
        },
      };
    })
    .filter(Boolean) as Edge[];

  // Basic layout for nodes without positions.
  if (nodes.length > 0) {
    nodes.forEach((node, index) => {
      if (!node.position) {
        node.position = {
          x: (index % 5) * 260,
          y: Math.floor(index / 5) * 150,
        };
      }
    });
  }

  return { nodes, edges };
}

function DependencyGraphPageContent() {
  const params = useParams<{ id: string }>();
  const repoId = params.id;

  const [nodes, setNodes] = useState<Node<GraphNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node<GraphNodeData> | null>(
    null
  );

  async function loadGraph() {
    try {
      setLoading(true);
      setError("");

      const response = await getGraph(repoId);
      const graph = normalizeGraph(response);

      setNodes(graph.nodes);
      setEdges(graph.edges);
      setSelectedNode(null);
    } catch (err: any) {
      console.error("Graph loading error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load dependency graph"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (repoId) loadGraph();
  }, [repoId]);

  const visibleNodes = useMemo(() => {
    if (!search.trim()) return nodes;

    const query = search.toLowerCase();

    return nodes.filter((node) => {
      const data = node.data;
      return (
        data.label.toLowerCase().includes(query) ||
        data.type.toLowerCase().includes(query) ||
        String(data.file || "").toLowerCase().includes(query)
      );
    });
  }, [nodes, search]);

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes]
  );

  const visibleEdges = useMemo(
    () =>
      edges.filter(
        (edge) =>
          visibleNodeIds.has(edge.source as string) &&
          visibleNodeIds.has(edge.target as string)
      ),
    [edges, visibleNodeIds]
  );

  const stats = {
    nodes: nodes.length,
    edges: edges.length,
    classes: nodes.filter((n) => n.data.type.toLowerCase() === "class").length,
    functions: nodes.filter(
      (n) => ["function", "method"].includes(n.data.type.toLowerCase())
    ).length,
  };

  return (
    <div className="flex min-h-screen bg-[#080b14] text-white">
      <Sidebar repoId={repoId} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Network className="text-indigo-400" size={22} />
              <h1 className="text-xl font-bold">Dependency Graph</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Explore relationships between repository components
            </p>
          </div>

          <button
            onClick={loadGraph}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 border-b border-white/10 p-5 md:grid-cols-4">
          {[
            { label: "Nodes", value: stats.nodes, icon: Network },
            { label: "Edges", value: stats.edges, icon: Layers },
            { label: "Classes", value: stats.classes, icon: Code2 },
            { label: "Functions", value: stats.functions, icon: FileCode },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={15} />
                  {item.label}
                </div>
                <p className="mt-2 text-2xl font-bold">{item.value}</p>
              </div>
            );
          })}
        </section>

        {/* Search */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
            <Search size={16} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter nodes by name, type, or file..."
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-600"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={15} className="text-gray-500" />
              </button>
            )}
          </div>

          <span className="whitespace-nowrap text-xs text-gray-500">
            {visibleNodes.length} / {nodes.length}
          </span>
        </div>

        {/* Graph */}
        <div className="relative min-h-[500px] flex-1">
          {loading ? (
            <div className="flex h-full min-h-[500px] items-center justify-center">
              <div className="text-center">
                <RefreshCw className="mx-auto mb-3 animate-spin text-indigo-400" />
                <p className="text-sm text-gray-400">Loading dependency graph...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[500px] items-center justify-center">
              <div className="max-w-md rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <p className="font-semibold text-red-300">Graph unavailable</p>
                <p className="mt-2 text-sm text-gray-400">{error}</p>
                <button
                  onClick={loadGraph}
                  className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : nodes.length === 0 ? (
            <div className="flex h-full min-h-[500px] items-center justify-center">
              <div className="text-center">
                <Network size={35} className="mx-auto mb-3 text-gray-600" />
                <p className="font-medium">No graph data available</p>
                <p className="mt-2 text-sm text-gray-500">
                  Analyze the repository first, then refresh.
                </p>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={visibleNodes}
              edges={visibleEdges}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) => setSelectedNode(node)}
              onPaneClick={() => setSelectedNode(null)}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2}
              className="bg-[#080b14]"
            >
              <Background color="#20263a" gap={24} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const type = String(node.data?.type || "").toLowerCase();
                  if (type === "class") return "#a855f7";
                  if (type === "method") return "#06b6d4";
                  if (type === "file") return "#10b981";
                  return "#6366f1";
                }}
                maskColor="rgba(8,11,20,0.75)"
              />
            </ReactFlow>
          )}

          {/* Selected node details */}
          {selectedNode && (
            <aside className="absolute right-4 top-4 z-10 w-72 rounded-xl border border-white/10 bg-[#111827] p-4 shadow-2xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-400">
                    Selected component
                  </p>
                  <h3 className="mt-2 break-words font-semibold">
                    {selectedNode.data.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="mt-1 capitalize">{selectedNode.data.type}</p>
                </div>

                {selectedNode.data.file && (
                  <div>
                    <p className="text-xs text-gray-500">File</p>
                    <p className="mt-1 break-all text-gray-300">
                      {selectedNode.data.file}
                    </p>
                  </div>
                )}

                {selectedNode.data.details && (
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="mt-1 text-gray-300">
                      {selectedNode.data.details}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500">Node ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-gray-400">
                    {selectedNode.id}
                  </p>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-gray-500">Connections</p>
                  <p className="mt-1 font-semibold">
                    {
                      edges.filter(
                        (e) =>
                          e.source === selectedNode.id ||
                          e.target === selectedNode.id
                      ).length
                    }{" "}
                    edges
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Legend */}
        <footer className="flex flex-wrap gap-5 border-t border-white/10 px-5 py-3 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
            Classes
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            Functions
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Methods
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Files
          </span>
          <span className="ml-auto">Scroll to zoom · Drag to pan · Click a node for details</span>
        </footer>
      </main>
    </div>
  );
}

export default function DependencyGraphPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-400">
          Loading RepoMind AI...
        </div>
      }
    >
      <DependencyGraphPageContent />
    </Suspense>
  );
}