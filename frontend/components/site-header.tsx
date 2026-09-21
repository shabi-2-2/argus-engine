import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-black/50">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-widest">
          ARGUS
        </Link>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          Phase 01 · Architecture
        </span>
      </div>
    </header>
  );
}