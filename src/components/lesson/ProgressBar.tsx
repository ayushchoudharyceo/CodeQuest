export default function ProgressBar({
  total,
  currentIndex,
  passedSteps,
}: {
  total: number;
  currentIndex: number;
  passedSteps: boolean[];
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-1.5 py-1">
        {Array.from({ length: total }).map((_, i) => {
          const isPassed = passedSteps[i] || i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                isPassed
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/40"
                  : isCurrent
                  ? "bg-gradient-to-r from-sky-500 to-cyan-400 shadow-sm shadow-sky-500/40 ring-1 ring-sky-400/50"
                  : "bg-slate-800"
              }`}
            />
          );
        })}
      </div>
      <span className="font-mono text-xs font-bold text-slate-400">
        {currentIndex + 1}/{total}
      </span>
    </div>
  );
}
