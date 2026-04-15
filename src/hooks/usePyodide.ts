import {useState, useCallback, useRef, useEffect} from 'react';

interface PyodideInstance {
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(options: {batched: (text: string) => void}): void;
  setStderr(options: {batched: (text: string) => void}): void;
}

interface PyodideResult {
  stdout: string;
  stderr: string;
  result: unknown;
}

let pyodidePromise: Promise<PyodideInstance> | null = null;

function loadPyodide(): Promise<PyodideInstance> {
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

export function usePyodide() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const pyodideRef = useRef<PyodideInstance | null>(null);

  useEffect(() => {
    // Check if already loaded
    if (pyodidePromise) {
      pyodidePromise.then((p) => {
        pyodideRef.current = p;
        setReady(true);
      });
    }
  }, []);

  const runPython = useCallback(async (code: string): Promise<PyodideResult> => {
    setLoading(true);
    try {
      if (!pyodideRef.current) {
        const p = await loadPyodide();
        pyodideRef.current = p;
        setReady(true);
      }

      const pyodide = pyodideRef.current;
      let stdout = '';
      let stderr = '';

      pyodide.setStdout({batched: (text: string) => { stdout += text + '\n'; }});
      pyodide.setStderr({batched: (text: string) => { stderr += text + '\n'; }});

      const result = await pyodide.runPythonAsync(code);

      return {stdout: stdout.trimEnd(), stderr: stderr.trimEnd(), result};
    } catch (err: any) {
      return {stdout: '', stderr: err.message || String(err), result: undefined};
    } finally {
      setLoading(false);
    }
  }, []);

  return {runPython, loading, ready};
}
