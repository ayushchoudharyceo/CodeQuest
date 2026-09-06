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
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors ${
            passedSteps[i] || i < currentIndex
              ? "bg-quest-green"
              : i === currentIndex
              ? "bg-quest-blue"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
