
// "use client";

// import Link from "next/link";
// import {
//   Sparkles,
//   Home,
//   Network,
//   Search,
//   Bot,
//   BarChart3,
//   BookOpen,
//   ArrowRight,
//   GitBranch,
//   Code2,
//   Zap,
//   CheckCircle2,
// } from "lucide-react";

// const features = [
//   {
//     title: "Repository Dashboard",
//     description:
//       "Get an overview of Chronix with repository statistics and key insights.",
//     icon: Home,
//     href: "/repository/demo",
//     color: "blue",
//     status: "Available",
//   },
//   {
//     title: "Dependency Graph",
//     description:
//       "Explore code relationships, functions, classes, and dependencies.",
//     icon: Network,
//     href: "/repository/demo/graph",
//     color: "purple",
//     status: "Available",
//   },
//   {
//     title: "Semantic Search",
//     description:
//       "Find relevant code using natural-language queries and semantic similarity.",
//     icon: Search,
//     href: "/repository/demo/search",
//     color: "emerald",
//     status: "Available",
//   },
//   {
//     title: "Repository AI Chat",
//     description:
//       "Ask questions about the repository and explore answers with code references.",
//     icon: Bot,
//     href: "/repository/demo/chat",
//     color: "pink",
//     status: "Available",
//   },
//   {
//     title: "Analytics",
//     description:
//       "Explore detailed repository statistics, complexity, and code insights.",
//     icon: BarChart3,
//     href: "/repository/demo/analytics",
//     color: "orange",
//     status: "Coming Soon",
//   },
//   {
//     title: "Documentation",
//     description:
//       "Learn how RepoMind analyzes, indexes, and understands codebases.",
//     icon: BookOpen,
//     href: "/",
//     color: "cyan",
//     status: "Explore",
//   },
// ];

// const colorStyles: Record<string, string> = {
//   blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/50",
//   purple:
//     "bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/50",
//   emerald:
//     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50",
//   pink: "bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:border-pink-500/50",
//   orange:
//     "bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:border-orange-500/50",
//   cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/50",
// };

// export default function DemoPage() {
//   return (
//     <main className="min-h-screen bg-[#080b14] px-5 py-10 text-white sm:px-8">
//       <div className="mx-auto max-w-7xl">

//         {/* Header */}
//         <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
//               <Code2 className="text-indigo-400" size={24} />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold">RepoMind AI</h1>
//               <p className="text-xs text-gray-500">
//                 Explore · Understand · Build
//               </p>
//             </div>
//           </Link>

//           <Link
//             href="https://github.com/VSS-webo"
//             target="_blank"
//             rel="noreferrer"
//             className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
//           >
//             <GitBranch  size={17} />
//             GitHub
//             <ArrowRight size={14} />
//           </Link>
//         </div>

//         {/* Hero */}
//         <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-[#10152b] to-blue-950/50 p-7 sm:p-12">
//           <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
//           <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

//           <div className="relative">
//             <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
//               Pre-indexed Demo · Chronix
//             </div>

//             <div className="flex items-center gap-3">
//               <Sparkles size={30} className="text-indigo-400" />
//               <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
//                 Explore RepoMind
//               </h2>
//             </div>

//             <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
//               Experience how RepoMind transforms a codebase into an
//               interactive knowledge system. Explore repository structure,
//               search code semantically, and ask questions about
//               implementation details.
//             <br/>
//             <br/>

//               This demo is actually working, but as the free tier for render(others as well) is limited to very less RAM,
//               it doesnt work properly, so this is a demo.

//               <br/>
//             <br/>
//             This currently works for python files, will update for other languages as well.

//             </p>

//             <div className="mt-8 flex flex-wrap gap-3">
//               <Link
//                 href="/repository/demo"
//                 className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
//               >
//                 Explore Repository
//                 <ArrowRight size={17} />
//               </Link>

//               <Link
//                 href="/repository/demo/chat"
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08]"
//               >
//                 <Bot size={17} />
//                 Try AI Chat
//               </Link>
//             </div>
//           </div>

//           {/* Repository identity */}
//           <div className="relative mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-7">
//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
//               <GitBranch  size={30} />
//             </div>

//             <div>
//               <h3 className="text-xl font-bold tracking-wide">CHRONIX</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 A real GitHub repository · Pre-indexed for demonstration
//               </p>
//             </div>

//             <Link
//               href="https://github.com/VSS-webo/chronix"
//               target="_blank"
//               rel="noreferrer"
//               className="ml-auto flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
//             >
//               View source
//               <ArrowRight size={15} />
//             </Link>
//           </div>
//         </section>

//         {/* Features */}
//         <section className="mt-12">
//           <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
//             <div>
//               <div className="flex items-center gap-2">
//                 <Zap size={21} className="text-indigo-400" />
//                 <h2 className="text-2xl font-bold">Explore Demo Features</h2>
//               </div>
//               <p className="mt-2 text-sm text-gray-500">
//                 Try the RepoMind capabilities with Chronix.
//               </p>
//             </div>

//             <span className="text-xs text-gray-600">
//               4 interactive features
//             </span>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {features.map((feature) => {
//               const Icon = feature.icon;
//               const comingSoon = feature.status === "Coming Soon";

//               return (
//                 <Link
//                   key={feature.title}
//                   href={feature.href}
//                   className={`group relative flex min-h-[190px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.045] ${
//                     comingSoon ? "opacity-75" : ""
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div
//                       className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${colorStyles[feature.color]}`}
//                     >
//                       <Icon size={23} />
//                     </div>

//                     <span
//                       className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
//                         comingSoon
//                           ? "bg-orange-500/10 text-orange-400"
//                           : "bg-emerald-500/10 text-emerald-400"
//                       }`}
//                     >
//                       {feature.status}
//                     </span>
//                   </div>

//                   <h3 className="mt-5 font-semibold text-gray-100">
//                     {feature.title}
//                   </h3>

//                   <p className="mt-2 text-sm leading-6 text-gray-500">
//                     {feature.description}
//                   </p>

//                   <div className="mt-auto flex justify-end pt-4">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-gray-500 transition group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
//                       <ArrowRight size={16} />
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* Demo notice */}
//         <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5">
//           <CheckCircle2
//             size={20}
//             className="mt-0.5 shrink-0 text-blue-400"
//           />
//           <div>
//             <p className="text-sm font-medium text-blue-300">
//               Ready to explore — no setup required
//             </p>
//             <p className="mt-1 text-sm leading-6 text-gray-500">
//               This demo uses pre-indexed Chronix repository data.
//               You do not need to clone anything, run a backend,
//               or configure an API key to explore the available features.
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
//           RepoMind AI · Explore codebases intelligently
//         </footer>
//       </div>
//     </main>
//   );
// }


// "use client";

// import Link from "next/link";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   Bot,
//   Code2,
//   GitBranch,
//   Search,
//   Network,
//   Layers3,
//   Sparkles,
//   Terminal,
//   Zap,
//   Check,
//   Github,
//   Workflow,
//   Braces,
// } from "lucide-react";

// const features = [
//   {
//     number: "01",
//     icon: Network,
//     title: "See how your code connects",
//     description:
//       "Explore functions, classes, and dependencies through an interactive graph. Understand how different parts of a repository relate to each other.",
//     tag: "Dependency Graph",
//     href: "/repository/demo/graph",
//   },
//   {
//     number: "02",
//     icon: Search,
//     title: "Find code by describing it",
//     description:
//       "Search with natural language instead of guessing filenames. Find relevant implementations based on what the code actually does.",
//     tag: "Semantic Search",
//     href: "/repository/demo/search",
//   },
//   {
//     number: "03",
//     icon: Bot,
//     title: "Ask questions about your code",
//     description:
//       "Explore implementation details, understand unfamiliar functions, and ask questions about the architecture of a repository.",
//     tag: "Repository Chat",
//     href: "/repository/demo/chat",
//   },
// ];

// const workflow = [
//   {
//     step: "01",
//     title: "Index",
//     description: "Build a structured representation of the repository.",
//     icon: Layers3,
//   },
//   {
//     step: "02",
//     title: "Understand",
//     description: "Connect code entities and their relationships.",
//     icon: Workflow,
//   },
//   {
//     step: "03",
//     title: "Explore",
//     description: "Search, navigate, and ask questions.",
//     icon: Sparkles,
//   },
// ];

// function ProductPreview() {
//   return (
//     <div className="relative mx-auto w-full max-w-[760px]">
//       <div className="absolute -inset-8 rounded-[40px] bg-indigo-500/[0.07] blur-3xl" />

//       <div className="relative overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c1019] shadow-2xl shadow-black/40">
//         {/* Window header */}
//         <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5">
//           <div className="flex items-center gap-2">
//             <div className="flex gap-1.5">
//               <span className="h-2.5 w-2.5 rounded-full bg-[#ff6058]" />
//               <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
//               <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
//             </div>
//             <span className="ml-3 text-xs text-gray-500">
//               repomind / chronix
//             </span>
//           </div>

//           <div className="flex items-center gap-1.5 text-xs text-gray-500">
//             <GitBranch size={13} />
//             main
//           </div>
//         </div>

//         {/* Workspace */}
//         <div className="grid min-h-[310px] grid-cols-1 sm:grid-cols-[155px_1fr]">
//           {/* Sidebar */}
//           <div className="hidden border-r border-white/[0.06] p-4 sm:block">
//             <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
//               Workspace
//             </p>

//             {[
//               ["Overview", Layers3],
//               ["Graph", Network],
//               ["Search", Search],
//               ["AI Chat", Bot],
//             ].map(([label, Icon], i) => {
//               const ItemIcon = Icon as typeof Layers3;

//               return (
//                 <div
//                   key={label as string}
//                   className={`mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs ${
//                     i === 1
//                       ? "bg-indigo-500/[0.12] text-indigo-300"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   <ItemIcon size={14} />
//                   {label as string}
//                 </div>
//               );
//             })}

//             <div className="mt-8 border-t border-white/[0.06] pt-4">
//               <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gray-600">
//                 Repository
//               </p>
//               <div className="flex items-center gap-2 text-xs text-gray-400">
//                 <Code2 size={13} />
//                 chronix
//               </div>
//             </div>
//           </div>

//           {/* Graph preview */}
//           <div className="relative flex min-w-0 flex-col p-4 sm:p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-200">
//                   Dependency Graph
//                 </p>
//                 <p className="mt-1 text-[11px] text-gray-500">
//                   Repository relationships
//                 </p>
//               </div>
//               <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-gray-500">
//                 Preview
//               </span>
//             </div>

//             <div className="relative mt-5 flex-1 overflow-hidden rounded-xl border border-white/[0.05] bg-[#090d15]">
//               <svg
//                 viewBox="0 0 480 245"
//                 className="absolute inset-0 h-full w-full"
//                 fill="none"
//               >
//                 <defs>
//                   <pattern
//                     id="repo-grid"
//                     width="24"
//                     height="24"
//                     patternUnits="userSpaceOnUse"
//                   >
//                     <path
//                       d="M 24 0 L 0 0 0 24"
//                       stroke="white"
//                       strokeOpacity=".035"
//                       fill="none"
//                     />
//                   </pattern>
//                 </defs>

//                 <rect width="480" height="245" fill="url(#repo-grid)" />

//                 {/* Connections */}
//                 <g stroke="#6476a8" strokeOpacity=".45" strokeWidth="1.2">
//                   <path d="M240 48 L130 105" />
//                   <path d="M240 48 L350 105" />
//                   <path d="M130 105 L85 175" />
//                   <path d="M130 105 L200 175" />
//                   <path d="M350 105 L280 175" />
//                   <path d="M350 105 L400 175" />
//                   <path d="M200 175 L280 175" />
//                 </g>

//                 {/* Nodes */}
//                 <g>
//                   <rect x="181" y="23" width="118" height="40" rx="9" fill="#181d34" stroke="#6366f1" strokeOpacity=".7" />
//                   <text x="240" y="40" textAnchor="middle" fill="#a5b4fc" fontSize="10">main.py</text>
//                   <text x="240" y="52" textAnchor="middle" fill="#818cf8" fontSize="8">entry point</text>

//                   <rect x="70" y="86" width="120" height="39" rx="8" fill="#111b2a" stroke="#38bdf8" strokeOpacity=".5" />
//                   <text x="130" y="102" textAnchor="middle" fill="#7dd3fc" fontSize="10">services.py</text>
//                   <text x="130" y="114" textAnchor="middle" fill="#64748b" fontSize="8">module</text>

//                   <rect x="290" y="86" width="120" height="39" rx="8" fill="#111b2a" stroke="#38bdf8" strokeOpacity=".5" />
//                   <text x="350" y="102" textAnchor="middle" fill="#7dd3fc" fontSize="10">utils.py</text>
//                   <text x="350" y="114" textAnchor="middle" fill="#64748b" fontSize="8">module</text>

//                   <rect x="25" y="157" width="120" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
//                   <text x="85" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">AuthService</text>
//                   <text x="85" y="185" textAnchor="middle" fill="#64748b" fontSize="8">class</text>

//                   <rect x="145" y="157" width="110" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
//                   <text x="200" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">retry_request</text>
//                   <text x="200" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>

//                   <rect x="225" y="157" width="110" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
//                   <text x="280" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">parse_config</text>
//                   <text x="280" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>

//                   <rect x="340" y="157" width="120" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
//                   <text x="400" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">load_settings</text>
//                   <text x="400" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>
//                 </g>
//               </svg>

//               <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0c1019]/90 px-3 py-2 backdrop-blur">
//                 <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
//                   <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
//                   Modules
//                 </span>
//                 <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
//                   <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
//                   Functions
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600">
//               <span>Code relationships</span>
//               <span>Illustrative visualization</span>
//             </div>
//           </div>
//         </div>

//         {/* Bottom status */}
//         <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3 text-[10px] text-gray-500 sm:px-5">
//           <span className="flex items-center gap-1.5">
//             <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//             Demo workspace
//           </span>
//           <span>RepoMind AI</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DemoPage() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-[#080a0f] text-white">
//       {/* Navbar */}
//       <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080a0f]/85 backdrop-blur-xl">
//         <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
//           <Link href="/" className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
//               <Code2 size={19} />
//             </div>
//             <span className="text-[17px] font-semibold tracking-tight">
//               RepoMind<span className="text-indigo-400">.</span>
//             </span>
//           </Link>

//           <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
//             <a href="#features" className="transition hover:text-white">
//               Features
//             </a>
//             <a href="#workflow" className="transition hover:text-white">
//               How it works
//             </a>
//             <Link
//               href="https://github.com/VSS-webo"
//               target="_blank"
//               rel="noreferrer"
//               className="transition hover:text-white"
//             >
//               GitHub
//             </Link>
//           </div>

//           <Link
//             href="/repository/demo"
//             className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
//           >
//             Try Demo
//             <ArrowUpRight size={15} />
//           </Link>
//         </nav>
//       </header>

//       {/* Hero */}
//       <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
//         <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-[120px]" />

//         <div className="relative mx-auto max-w-7xl">
//           <div className="mx-auto max-w-3xl text-center">
//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-1.5 text-xs text-gray-400">
//               <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
//               AI-powered code intelligence
//               <span className="text-gray-600">·</span>
//               <span className="text-indigo-300">Explore the demo</span>
//             </div>

//             <h1 className="text-4xl font-semibold leading-[1.13] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
//               Your codebase.
//               <br />
//               <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
//                 Understood.
//               </span>
//             </h1>

//             <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
//               Navigate complex repositories, discover relationships between
//               code, and understand implementation details without getting
//               lost in thousands of files.
//             </p>

//             <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
//               <Link
//                 href="/repository/demo"
//                 className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
//               >
//                 Explore Chronix
//                 <ArrowRight size={16} />
//               </Link>

//               <Link
//                 href="/repository/demo/chat"
//                 className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.025] px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06]"
//               >
//                 <Bot size={16} />
//                 Ask the code
//               </Link>
//             </div>

//             <p className="mt-5 text-xs text-gray-600">
//               Pre-indexed repository · No setup required
//             </p>
//           </div>

//           {/* Product preview */}
//           <div className="mt-16 sm:mt-20">
//             <ProductPreview />
//           </div>
//         </div>
//       </section>

//       {/* Small technology strip */}
//       <section className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-6 sm:px-8">
//         <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500 sm:gap-x-12">
//           <span className="flex items-center gap-2">
//             <Braces size={15} />
//             Python code analysis
//           </span>
//           <span className="flex items-center gap-2">
//             <Network size={15} />
//             Dependency graphs
//           </span>
//           <span className="flex items-center gap-2">
//             <Search size={15} />
//             Semantic search
//           </span>
//           <span className="flex items-center gap-2">
//             <Sparkles size={15} />
//             Repository Q&A
//           </span>
//         </div>
//       </section>

//       {/* Features */}
//       <section id="features" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
//         <div className="mx-auto max-w-7xl">
//           <div className="max-w-xl">
//             <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
//               Explore your code
//             </p>
//             <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
//               More than a file browser.
//             </h2>
//             <p className="mt-5 text-base leading-7 text-gray-400">
//               A different way to navigate and understand software
//               repositories.
//             </p>
//           </div>

//           <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {features.map((feature) => {
//               const Icon = feature.icon;

//               return (
//                 <Link
//                   key={feature.number}
//                   href={feature.href}
//                   className="group flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.035]"
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-600">
//                       {feature.number}
//                     </span>
//                     <Icon
//                       size={19}
//                       className="text-gray-500 transition group-hover:text-indigo-400"
//                     />
//                   </div>

//                   <h3 className="mt-9 text-lg font-medium tracking-tight">
//                     {feature.title}
//                   </h3>

//                   <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">
//                     {feature.description}
//                   </p>

//                   <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-4">
//                     <span className="text-xs text-gray-400">{feature.tag}</span>
//                     <ArrowRight
//                       size={15}
//                       className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-indigo-400"
//                     />
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Workflow */}
//       <section
//         id="workflow"
//         className="scroll-mt-24 border-y border-white/[0.06] bg-white/[0.015] px-5 py-24 sm:px-8 sm:py-28"
//       >
//         <div className="mx-auto max-w-7xl">
//           <div className="max-w-xl">
//             <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
//               The workflow
//             </p>
//             <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
//               From source code to understanding.
//             </h2>
//             <p className="mt-5 text-base leading-7 text-gray-400">
//               RepoMind turns repository structure into something you can
//               actually explore.
//             </p>
//           </div>

//           <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
//             {workflow.map((item, index) => {
//               const Icon = item.icon;

//               return (
//                 <div key={item.step} className="relative">
//                   {index !== 2 && (
//                     <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-20px)] bg-gradient-to-r from-white/10 to-transparent md:block" />
//                   )}

//                   <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0b0e15] text-indigo-300">
//                     <Icon size={20} />
//                   </div>

//                   <p className="mt-6 text-xs text-gray-600">{item.step}</p>
//                   <h3 className="mt-2 text-xl font-medium">{item.title}</h3>
//                   <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500">
//                     {item.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Demo CTA */}
//       <section className="px-5 py-24 sm:px-8 sm:py-28">
//         <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c1019] px-6 py-14 sm:px-12 sm:py-16">
//           <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-indigo-500/[0.09] blur-[100px]" />

//           <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
//             <div className="max-w-xl">
//               <div className="mb-5 flex items-center gap-2 text-xs text-indigo-300">
//                 <Zap size={14} />
//                 INTERACTIVE DEMO
//               </div>

//               <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//                 Take a look inside Chronix.
//               </h2>

//               <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
//                 Explore a real GitHub repository with pre-indexed code,
//                 semantic search, dependency visualization, and repository AI chat.
//               </p>

//               <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
//                 <span className="flex items-center gap-1.5">
//                   <Check size={13} className="text-emerald-400" />
//                   No installation
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <Check size={13} className="text-emerald-400" />
//                   No API key
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <Check size={13} className="text-emerald-400" />
//                   Ready to explore
//                 </span>
//               </div>
//             </div>

//             <Link
//               href="/repository/demo"
//               className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
//             >
//               Open Demo
//               <ArrowUpRight size={16} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
//         <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//           <Link href="/" className="flex items-center gap-2 text-sm font-medium">
//             <Code2 size={17} className="text-indigo-400" />
//             RepoMind
//           </Link>

//           <p className="text-xs text-gray-600">
//             Built to make understanding codebases easier.
//           </p>

//           <div className="flex items-center gap-5 text-xs text-gray-500">
//             <Link
//               href="https://github.com/VSS-webo"
//               target="_blank"
//               rel="noreferrer"
//               className="transition hover:text-white"
//             >
//               GitHub
//             </Link>
//             <Link href="/repository/demo" className="transition hover:text-white">
//               Demo
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }



"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  GitBranch,
  Search,
  Network,
  Layers3,
  Sparkles,
  Zap,
  Check,
  Workflow,
  Braces,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Network,
    title: "See how your code connects",
    description:
      "Explore functions, classes, and dependencies through an interactive graph. Understand how different parts of a repository relate to each other.",
    tag: "Dependency Graph",
    href: "/repository/demo/graph",
  },
  {
    number: "02",
    icon: Search,
    title: "Find code by describing it",
    description:
      "Search with natural language instead of guessing filenames. Find relevant implementations based on what the code actually does.",
    tag: "Semantic Search",
    href: "/repository/demo/search",
  },
  {
    number: "03",
    icon: Bot,
    title: "Ask questions about your code",
    description:
      "Explore implementation details, understand unfamiliar functions, and ask questions about the architecture of a repository.",
    tag: "Repository Chat",
    href: "/repository/demo/chat",
  },
];

const workflow = [
  {
    step: "01",
    title: "Index",
    description: "Build a structured representation of the repository.",
    icon: Layers3,
  },
  {
    step: "02",
    title: "Understand",
    description: "Connect code entities and their relationships.",
    icon: Workflow,
  },
  {
    step: "03",
    title: "Explore",
    description: "Search, navigate, and ask questions.",
    icon: Sparkles,
  },
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[900px]">
      <div className="absolute -inset-10 rounded-[50px] bg-indigo-500/[0.08] blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c1019] shadow-2xl shadow-black/40">
        {/* Window header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6058]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>

            <span className="ml-2 text-sm text-gray-400">
              repomind / chronix
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <GitBranch size={14} />
            main
          </div>
        </div>

        {/* Workspace */}
        <div className="grid min-h-[350px] grid-cols-1 sm:grid-cols-[185px_1fr]">
          {/* Sidebar */}
          <div className="hidden border-r border-white/[0.06] p-5 sm:block">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
              Workspace
            </p>

            {[
              ["Overview", Layers3],
              ["Graph", Network],
              ["Search", Search],
              ["AI Chat", Bot],
            ].map(([label, Icon], i) => {
              const ItemIcon = Icon as typeof Layers3;

              return (
                <div
                  key={label as string}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    i === 1
                      ? "bg-indigo-500/[0.12] text-indigo-300"
                      : "text-gray-500"
                  }`}
                >
                  <ItemIcon size={16} />
                  {label as string}
                </div>
              );
            })}

            <div className="mt-9 border-t border-white/[0.06] pt-5">
              <p className="mb-4 text-[10px] uppercase tracking-[0.15em] text-gray-600">
                Repository
              </p>

              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Code2 size={15} />
                chronix
              </div>
            </div>
          </div>

          {/* Graph preview */}
          <div className="relative flex min-w-0 flex-col p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-gray-200">
                  Dependency Graph
                </p>

                <p className="mt-1.5 text-xs text-gray-500">
                  Repository relationships
                </p>
              </div>

              <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-gray-500">
                Preview
              </span>
            </div>

            <div className="relative mt-6 min-h-[270px] flex-1 overflow-hidden rounded-xl border border-white/[0.05] bg-[#090d15]">
              <svg
                viewBox="0 0 480 245"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <defs>
                  <pattern
                    id="repo-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 24 0 L 0 0 0 24"
                      stroke="white"
                      strokeOpacity=".035"
                      fill="none"
                    />
                  </pattern>
                </defs>

                <rect width="480" height="245" fill="url(#repo-grid)" />

                {/* Connections */}
                <g stroke="#6476a8" strokeOpacity=".45" strokeWidth="1.2">
                  <path d="M240 48 L130 105" />
                  <path d="M240 48 L350 105" />
                  <path d="M130 105 L85 175" />
                  <path d="M130 105 L200 175" />
                  <path d="M350 105 L280 175" />
                  <path d="M350 105 L400 175" />
                  <path d="M200 175 L280 175" />
                </g>

                {/* Nodes */}
                <g>
                  <rect x="181" y="23" width="118" height="40" rx="9" fill="#181d34" stroke="#6366f1" strokeOpacity=".7" />
                  <text x="240" y="40" textAnchor="middle" fill="#a5b4fc" fontSize="10">main.py</text>
                  <text x="240" y="52" textAnchor="middle" fill="#818cf8" fontSize="8">entry point</text>

                  <rect x="70" y="86" width="120" height="39" rx="8" fill="#111b2a" stroke="#38bdf8" strokeOpacity=".5" />
                  <text x="130" y="102" textAnchor="middle" fill="#7dd3fc" fontSize="10">services.py</text>
                  <text x="130" y="114" textAnchor="middle" fill="#64748b" fontSize="8">module</text>

                  <rect x="290" y="86" width="120" height="39" rx="8" fill="#111b2a" stroke="#38bdf8" strokeOpacity=".5" />
                  <text x="350" y="102" textAnchor="middle" fill="#7dd3fc" fontSize="10">utils.py</text>
                  <text x="350" y="114" textAnchor="middle" fill="#64748b" fontSize="8">module</text>

                  <rect x="25" y="157" width="120" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
                  <text x="85" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">AuthService</text>
                  <text x="85" y="185" textAnchor="middle" fill="#64748b" fontSize="8">class</text>

                  <rect x="145" y="157" width="110" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
                  <text x="200" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">retry_request</text>
                  <text x="200" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>

                  <rect x="225" y="157" width="110" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
                  <text x="280" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">parse_config</text>
                  <text x="280" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>

                  <rect x="340" y="157" width="120" height="38" rx="8" fill="#141525" stroke="#a78bfa" strokeOpacity=".5" />
                  <text x="400" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="10">load_settings</text>
                  <text x="400" y="185" textAnchor="middle" fill="#64748b" fontSize="8">function</text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0c1019]/90 px-3 py-2 backdrop-blur">
                <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Modules
                </span>

                <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  Functions
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600">
              <span>Code relationships</span>
              <span>Illustrative visualization</span>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4 text-xs text-gray-500 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Demo workspace
          </span>

          <span>RepoMind AI</span>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080a0f] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080a0f]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <Code2 size={22} />
            </div>

            <span className="text-xl font-semibold tracking-tight">
              RepoMind<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-10 text-[15px] text-gray-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>

            <a href="#workflow" className="transition hover:text-white">
              How it works
            </a>

            <Link
              href="https://github.com/VSS-webo/repomind"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </Link>
          </div>

          <Link
            href="/repository/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Try Demo
            <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-1.5 text-xs text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              AI-powered code intelligence
              <span className="text-gray-600">·</span>
              <span className="text-indigo-300">Explore the demo</span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.13] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
              Your codebase.
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                Understood.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
              Navigate complex repositories, discover relationships between
              code, and understand implementation details without getting
              lost in thousands of files.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/repository/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Explore Chronix
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/repository/demo/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <Bot size={16} />
                Ask the code
              </Link>
            </div>

            <p className="mt-5 text-xs text-gray-600">
              Pre-indexed repository · No setup required
            </p>
            <p className="mt-5 text-xs text-gray-600">
                This is a demo as the free tier for render(and others as well) dont provide enough memory to run the huge model.
                This actually runs so made a demo of the working.

            </p>
          </div>

          {/* Product preview */}
          <div className="mt-16 sm:mt-20">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Technology strip */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-gray-500 sm:gap-x-14">
          <span className="flex items-center gap-2.5">
            <Braces size={16} />
            Python code analysis
          </span>

          <span className="flex items-center gap-2.5">
            <Network size={16} />
            Dependency graphs
          </span>

          <span className="flex items-center gap-2.5">
            <Search size={16} />
            Semantic search
          </span>

          <span className="flex items-center gap-2.5">
            <Sparkles size={16} />
            Repository Q&A
          </span>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
              Explore your code
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              More than a file browser.
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-400">
              A different way to navigate and understand software
              repositories.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.number}
                  href={feature.href}
                  className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.035] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {feature.number}
                    </span>

                    <Icon
                      size={20}
                      className="text-gray-500 transition group-hover:text-indigo-400"
                    />
                  </div>

                  <h3 className="mt-10 text-xl font-medium tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="text-xs text-gray-400">{feature.tag}</span>

                    <ArrowRight
                      size={16}
                      className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-indigo-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="scroll-mt-24 border-y border-white/[0.06] bg-[#0a0c12] px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.06] px-3.5 py-1.5 text-xs text-indigo-300">
              <Workflow size={14} />
              HOW REPOMIND WORKS
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              From code to clarity.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-400">
              RepoMind transforms an unfamiliar repository into a structured,
              searchable workspace that helps you understand how everything
              fits together.
            </p>
          </div>

          {/* Workflow cards */}
          <div className="relative mt-20 grid gap-5 md:grid-cols-3">
            {/* Connecting line */}
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[39px] hidden h-px bg-gradient-to-r from-indigo-500/0 via-indigo-400/30 to-indigo-500/0 md:block" />

            {workflow.map((item, index) => {
              const Icon = item.icon;

              const details = [
                {
                  label: "Repository structure",
                  description: "Files · Classes · Functions",
                },
                {
                  label: "Code relationships",
                  description: "Dependencies · References",
                },
                {
                  label: "Developer workspace",
                  description: "Search · Graph · AI Chat",
                },
              ];

              return (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-white/[0.07] bg-[#0d1018] p-7 transition duration-300 hover:border-indigo-400/20 hover:bg-[#10131d] sm:p-8"
                >
                  {/* Step header */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-[78px] w-[78px] items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.06] text-indigo-300 transition duration-300 group-hover:border-indigo-400/30 group-hover:bg-indigo-400/[0.10]">
                      <Icon size={29} strokeWidth={1.5} />
                    </div>

                    <span className="text-5xl font-medium tracking-[-0.06em] text-white/[0.045]">
                      {item.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-9 text-xl font-medium tracking-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                    {item.description}
                  </p>

                  {/* Detail panel */}
                  <div className="mt-7 rounded-xl border border-white/[0.05] bg-black/[0.18] p-4">
                    <p className="text-xs font-medium text-gray-300">
                      {details[index].label}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-gray-600">
                      {details[index].description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>One repository. Multiple ways to understand it.</span>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="px-5 py-28 sm:px-8 sm:py-36">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c1019] px-6 py-14 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-indigo-500/[0.09] blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-5 flex items-center gap-2 text-xs text-indigo-300">
                <Zap size={14} />
                INTERACTIVE DEMO
              </div>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Take a look inside Chronix.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
                Explore a real GitHub repository with pre-indexed code,
                semantic search, dependency visualization, and repository AI chat.
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  No installation
                </span>

                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  No API key
                </span>

                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  Ready to explore
                </span>
              </div>
            </div>

            <Link
              href="/repository/demo"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Open Demo
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-9 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-medium">
            <Code2 size={19} className="text-indigo-400" />
            RepoMind
          </Link>

          <p className="text-xs text-gray-600">
            Built to make understanding codebases easier.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link
              href="https://github.com/VSS-webo"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </Link>

            <Link href="/repository/demo" className="transition hover:text-white">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
