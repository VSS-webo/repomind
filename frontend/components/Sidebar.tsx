
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Network,
  Search,
  GitBranch,
  Brain,
  Code2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  repoId: string;
}

export default function Sidebar({ repoId }: SidebarProps) {
  const pathname = usePathname();

  const base = `/repository/${repoId}`;

  const items = [
    { name: "Overview", href: base, icon: LayoutDashboard },
    { name: "Dependency Graph", href: `${base}/graph`, icon: Network },
    { name: "Impact Analysis", href: `${base}/impact`, icon: GitBranch },
    { name: "Semantic Search", href: `${base}/search`, icon: Search },
    { name: "Repository AI", href: `${base}/chat`, icon: Brain },
    {name: "AI Code Review",href: `${base}/review`,icon: ShieldCheck,},
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-[#0b0f1a] p-5">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
          <Code2 size={20} />
        </div>
        <span className="text-lg font-bold">
          RepoMind <span className="text-indigo-400">AI</span>
        </span>
      </Link>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Workspace
      </p>

      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== base && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                active
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
