import Link from "next/link";

interface SceneNavProps {
  prevScene: { slug: string; title: string } | null;
  nextScene: { slug: string; title: string } | null;
}

export function SceneNavigation({ prevScene, nextScene }: SceneNavProps) {
  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t">
      {prevScene ? (
        <Link
          href={`/scene/${prevScene.slug}`}
          className="flex items-center gap-2 text-dim hover:text-gold transition-colors group max-w-[45%]"
        >
          <svg className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="min-w-0">
            <p className="font-ui text-[10px] text-dim">Previous</p>
            <p className="font-heading text-xs truncate">{prevScene.title}</p>
          </div>
        </Link>
      ) : <div />}

      {nextScene ? (
        <Link
          href={`/scene/${nextScene.slug}`}
          className="flex items-center gap-2 text-dim hover:text-gold transition-colors group max-w-[45%] text-right ml-auto"
        >
          <div className="min-w-0">
            <p className="font-ui text-[10px] text-dim">Next</p>
            <p className="font-heading text-xs truncate">{nextScene.title}</p>
          </div>
          <svg className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : <div />}
    </div>
  );
}
