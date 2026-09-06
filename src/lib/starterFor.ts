/** Pulls a runnable starter snippet out of the xlsx task string where possible. */
export function starterFor(task: string): string {
  const [codePart] = task.split("|");
  return codePart
    .split("/")
    .map((line) => line.trim())
    .join("\n");
}
