/// <reference lib="webworker" />

// Loaded from CDN inside the worker so the main bundle stays small.
// See https://pyodide.org/en/stable/usage/webworker.html
declare function importScripts(...urls: string[]): void;
declare const loadPyodide: any;

let pyodideReadyPromise: Promise<any> | null = null;

function initPyodide() {
  if (!pyodideReadyPromise) {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
    pyodideReadyPromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });
  }
  return pyodideReadyPromise;
}

// Kick off loading immediately so it's warm by the time a level needs it.
initPyodide();

const WATCHDOG_MS = 3000;

interface RunRequest {
  id: string;
  code: string;
  stdin?: string; // optional single mocked input() value, per PY-05 style levels
  // Boolean Python expression evaluated against the user's globals after `code`
  // runs, for levels graded on variable state rather than stdout (e.g. PY-02).
  assertion?: string;
}

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { id, code, stdin, assertion } = event.data;
  const started = performance.now();

  try {
    const pyodide = await initPyodide();

    let stdout = "";
    let stderr = "";
    pyodide.setStdout({ batched: (s: string) => (stdout += s + "\n") });
    pyodide.setStderr({ batched: (s: string) => (stderr += s + "\n") });

    // Mock input() for levels that read from stdin (e.g. PY-05 "The Stream").
    if (stdin !== undefined) {
      pyodide.globals.set("__mock_input_value", stdin);
      await pyodide.runPythonAsync(
        "import builtins\n__answered=[False]\ndef __mock_input(prompt=''):\n    return __mock_input_value\nbuiltins.input = __mock_input\n"
      );
    }

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), WATCHDOG_MS)
    );

    await Promise.race([pyodide.runPythonAsync(code), timeout]);

    // Evaluated separately from `code` so a level whose assertion text isn't a
    // real Python expression (many Tier 2+ levels describe a grader that was
    // never wired up) is reported distinctly from an actual mistake in the
    // user's own code.
    let assertionResult: boolean | undefined;
    let assertionError: string | null = null;
    if (assertion) {
      try {
        const raw = await pyodide.runPythonAsync(`bool(${assertion})`);
        assertionResult = Boolean(raw);
      } catch (assertErr: any) {
        assertionError = String(assertErr?.message ?? assertErr);
      }
    }

    self.postMessage({
      id,
      success: true,
      stdout,
      stderr: stderr || null,
      assertionResult,
      assertionError,
      durationMs: performance.now() - started,
    });
  } catch (err: any) {
    const timedOut = err?.message === "TIMEOUT";
    self.postMessage({
      id,
      success: false,
      stdout: "",
      stderr: timedOut
        ? "Execution timed out (3s limit) — check for infinite loops."
        : String(err?.message ?? err),
      durationMs: performance.now() - started,
    });
  }
};
