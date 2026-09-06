"use client";

export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className="h-48 w-full resize-none rounded-2xl border-b-4 border-black/30 bg-[#0d1417] p-4 font-mono text-sm text-green-300 outline-none focus:border-quest-blue"
      placeholder="# write your Python here"
    />
  );
}
