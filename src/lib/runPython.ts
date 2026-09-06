export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string | null;
  /** Result of evaluating a variable-state `assertion` option, if one was passed. */
  assertionResult?: boolean;
  /** Set instead of `assertionResult` when the assertion itself isn't valid Python. */
  assertionError?: string | null;
  durationMs: number;
}

export interface RunOptions {
  stdin?: string;
  /** Boolean Python expression evaluated against globals after `code` runs. */
  assertion?: string;
}

export interface LanguageRunner {
  runCode(code: string, options?: RunOptions): Promise<ExecutionResult>;
}

class PyodideRunner implements LanguageRunner {
  private worker: Worker | null = null;
  private pending = new Map<string, (r: ExecutionResult) => void>();

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL("../workers/pyodide.worker.ts", import.meta.url));
      this.worker.onmessage = (e: MessageEvent) => {
        const { id, ...result } = e.data;
        this.pending.get(id)?.(result);
        this.pending.delete(id);
      };
    }
    return this.worker;
  }

  runCode(code: string, options?: RunOptions): Promise<ExecutionResult> {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.getWorker().postMessage({ id, code, ...options });
    });
  }
}

export const pythonRunner: LanguageRunner = new PyodideRunner();

/** Whether an assertion string is the `stdout == '...'` shape, checked in JS after execution. */
export function isStdoutAssertion(assertion: string): boolean {
  return assertion.trim().startsWith("stdout ==");
}

/** Handles the `stdout == '...'` assertion shape used across levels.json entries. */
export function checkStdoutAssertion(assertion: string, stdout: string): boolean {
  const match = assertion.match(/stdout\s*==\s*'([\s\S]*)'/);
  if (!match) return false;
  const expected = match[1].replace(/\\n/g, "\n");
  return stdout === expected;
}
