import React, {useMemo, useCallback} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useVisualizerEngine, type VisualizerStep} from '../../hooks/useVisualizerEngine';

interface AlgorithmVisualizerProps<T> {
  steps: VisualizerStep<T>[];
  renderState: (step: VisualizerStep<T>) => React.ReactNode;
  title?: string;
}

function AlgorithmVisualizerInner<T>({steps, renderState, title}: AlgorithmVisualizerProps<T>) {
  const engine = useVisualizerEngine<T>(steps);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    engine.setSpeed(parseFloat(e.target.value));
  }, [engine]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    engine.goToStep(parseInt(e.target.value, 10));
  }, [engine]);

  if (!engine.currentStep) {
    return <div className="visualizer"><p style={{padding: '1rem'}}>No steps to visualize.</p></div>;
  }

  const isPlaying = engine.playbackState === 'playing';

  return (
    <div className="visualizer">
      {title && (
        <div style={{
          padding: '0.5rem 1rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          borderBottom: '1px solid var(--ifm-color-emphasis-300)',
          background: 'var(--ifm-color-emphasis-100)',
        }}>
          {title}
        </div>
      )}

      <div className="visualizer__canvas">
        {renderState(engine.currentStep)}
      </div>

      <div className="visualizer__controls">
        <button className="visualizer__btn" onClick={engine.reset} title="Reset">
          {'|<'}
        </button>
        <button className="visualizer__btn" onClick={engine.stepBack} title="Step Back">
          {'<'}
        </button>
        <button
          className={`visualizer__btn ${isPlaying ? 'visualizer__btn--active' : ''}`}
          onClick={isPlaying ? engine.pause : engine.play}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '||' : '>'}
        </button>
        <button className="visualizer__btn" onClick={engine.stepForward} title="Step Forward">
          {'>'}
        </button>

        <span style={{fontSize: '0.8rem', opacity: 0.7, minWidth: '80px', textAlign: 'center'}}>
          Step {engine.currentStepIndex + 1} / {engine.totalSteps}
        </span>

        <input
          type="range"
          min={0}
          max={engine.totalSteps - 1}
          value={engine.currentStepIndex}
          onChange={handleSliderChange}
          style={{flex: 1, minWidth: '100px'}}
          title="Scrub through steps"
        />

        <div className="visualizer__speed">
          <span>Speed:</span>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={engine.speed}
            onChange={handleSpeedChange}
          />
          <span>{engine.speed}x</span>
        </div>
      </div>

      {engine.currentStep.explanation && (
        <div className="visualizer__info">
          {engine.currentStep.explanation}
        </div>
      )}
    </div>
  );
}

export default function AlgorithmVisualizer<T>(props: AlgorithmVisualizerProps<T>) {
  return (
    <BrowserOnly fallback={<div className="visualizer"><p style={{padding: '1rem'}}>Loading visualizer...</p></div>}>
      {() => <AlgorithmVisualizerInner {...props} />}
    </BrowserOnly>
  );
}
