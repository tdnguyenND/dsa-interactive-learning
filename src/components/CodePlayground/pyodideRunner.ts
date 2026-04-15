interface PyodideInstance {
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(options: {batched: (text: string) => void}): void;
  setStderr(options: {batched: (text: string) => void}): void;
}

let pyodidePromise: Promise<PyodideInstance> | null = null;

function loadPyodideInstance(): Promise<PyodideInstance> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.onload = async () => {
      try {
        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });
        resolve(pyodide);
      } catch (err) {
        pyodidePromise = null;
        reject(err);
      }
    };
    script.onerror = () => {
      pyodidePromise = null;
      reject(new Error('Failed to load Pyodide'));
    };
    document.head.appendChild(script);
  });

  return pyodidePromise;
}

export async function loadPyodideAndRun(code: string) {
  const pyodide = await loadPyodideInstance();

  let stdout = '';
  let stderr = '';

  pyodide.setStdout({batched: (text: string) => { stdout += text + '\n'; }});
  pyodide.setStderr({batched: (text: string) => { stderr += text + '\n'; }});

  try {
    const result = await pyodide.runPythonAsync(code);
    return {stdout: stdout.trimEnd(), stderr: stderr.trimEnd(), result};
  } catch (err: any) {
    return {stdout: stdout.trimEnd(), stderr: err.message || String(err), result: undefined};
  }
}
