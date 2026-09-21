import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center">
        <section className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 py-16 sm:items-center sm:text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Autonomous Investigation &amp; Root-Cause Intelligence
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Give ARGUS a problem.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">It investigates.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            ARGUS connects to your software project, gathers evidence from the
            codebase and system, and autonomously investigates technical problems
            — producing root-cause reports backed by evidence, not guesses.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
            <span>Code Agent</span>
            <span>Git Agent</span>
            <span>Log Agent</span>
            <span>Metrics Agent</span>
            <span>Correlation Agent</span>
            <span>Critic Agent</span>
            <span>Root Cause Agent</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The investigation dashboard, project connections, and live agent
            visualization arrive in later phases. This build establishes the
            architecture foundation.
          </p>
        </section>
      </main>
    </div>
  );
}