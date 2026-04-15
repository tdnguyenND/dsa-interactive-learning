import React, {useState, useCallback, useRef, useEffect} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface CodePlaygroundProps {
  code: string;
  title?: string;
  solution?: string;
}

function CodePlaygroundInner({code, title = 'Python', solution}: CodePlaygroundProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [output, setOutput] = useState('');
  const [outputType, setOutputType] = useState<'normal' | 'error' | 'loading'>('normal');
  const [showSolution, setShowSolution] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);

  useEffect(() => {
    let destroyed = false;

    async function initEditor() {
      if (!editorRef.current || viewRef.current) return;

      const {EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter} = await import('@codemirror/view');
      const {EditorState} = await import('@codemirror/state');
      const {python} = await import('@codemirror/lang-python');
      const {oneDark} = await import('@codemirror/theme-one-dark');
      const {defaultKeymap, history, historyKeymap} = await import('@codemirror/commands');
      const {
        syntaxHighlighting,
        defaultHighlightStyle,
        bracketMatching,
        indentOnInput,
      } = await import('@codemirror/language');
      const {closeBrackets, closeBracketsKeymap} = await import('@codemirror/autocomplete');

      if (destroyed) return;

      const state = EditorState.create({
        doc: currentCode,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          python(),
          oneDark,
          syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...closeBracketsKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setCurrentCode(update.state.doc.toString());
            }
          }),
          EditorView.theme({
            '&': {fontSize: '14px'},
            '.cm-content': {padding: '12px 0'},
            '.cm-gutters': {minWidth: '3em'},
          }),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current!,
      });
    }

    initEditor();

    return () => {
      destroyed = true;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRun = useCallback(async () => {
    setOutput('Loading Python runtime...');
    setOutputType('loading');

    try {
      const {usePyodide: _} = await import('../../hooks/usePyodide');
      // Directly use the module-level function
      const {loadPyodideAndRun} = await import('./pyodideRunner');
      const result = await loadPyodideAndRun(currentCode);

      if (result.stderr) {
        setOutput(result.stderr);
        setOutputType('error');
      } else {
        setOutput(result.stdout || '(no output)');
        setOutputType('normal');
      }
    } catch (err: any) {
      setOutput(err.message || 'Unknown error');
      setOutputType('error');
    }
  }, [currentCode]);

  const handleReset = useCallback(() => {
    setCurrentCode(code);
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {from: 0, to: viewRef.current.state.doc.length, insert: code},
      });
    }
    setOutput('');
    setOutputType('normal');
  }, [code]);

  return (
    <div className="code-playground">
      <div className="code-playground__header">
        <span style={{fontWeight: 600, fontSize: '0.85rem'}}>{title}</span>
        <div className="code-playground__actions">
          {solution && (
            <button
              className="code-playground__btn code-playground__btn--reset"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
          <button className="code-playground__btn code-playground__btn--reset" onClick={handleReset}>
            Reset
          </button>
          <button className="code-playground__btn code-playground__btn--run" onClick={handleRun}>
            Run
          </button>
        </div>
      </div>
      <div ref={editorRef} />
      {output && (
        <div className={`code-playground__output ${
          outputType === 'error' ? 'code-playground__output--error' :
          outputType === 'loading' ? 'code-playground__output--loading' : ''
        }`}>
          {output}
        </div>
      )}
      {showSolution && solution && (
        <div style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--ifm-color-emphasis-300)',
          background: 'var(--ifm-color-emphasis-50)',
        }}>
          <strong style={{fontSize: '0.85rem'}}>Solution:</strong>
          <pre style={{margin: '0.5rem 0 0', fontSize: '0.85rem', whiteSpace: 'pre-wrap'}}>
            <code>{solution}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function CodePlayground(props: CodePlaygroundProps) {
  return (
    <BrowserOnly fallback={<div className="code-playground"><pre style={{padding: '1rem'}}><code>{props.code}</code></pre></div>}>
      {() => <CodePlaygroundInner {...props} />}
    </BrowserOnly>
  );
}
