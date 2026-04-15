import React, {useMemo} from 'react';
import type {VisualizerStep} from '../../hooks/useVisualizerEngine';
import type {ArrayState} from '../../algorithms/sorting/bubbleSort';

interface ArrayVisualizerProps {
  step: VisualizerStep<ArrayState>;
  maxValue?: number;
}

function getBarClass(index: number, highlights: Record<string, number[]>): string {
  if (highlights.swapping?.includes(index)) return 'array-bar__bar array-bar__bar--swapping';
  if (highlights.comparing?.includes(index)) return 'array-bar__bar array-bar__bar--comparing';
  if (highlights.sorted?.includes(index)) return 'array-bar__bar array-bar__bar--sorted';
  if (highlights.active?.includes(index)) return 'array-bar__bar array-bar__bar--active';
  return 'array-bar__bar';
}

export default function ArrayVisualizer({step, maxValue}: ArrayVisualizerProps) {
  const {array} = step.state;
  const max = maxValue ?? Math.max(...array, 1);
  const maxHeight = 180;

  return (
    <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', minHeight: maxHeight + 40}}>
      {array.map((value, index) => {
        const height = (value / max) * maxHeight;
        const barClass = getBarClass(index, step.highlights);

        return (
          <div key={index} className="array-bar">
            <div
              className={barClass}
              style={{height: `${Math.max(height, 8)}px`}}
            />
            <span className="array-bar__label">{value}</span>
            <span className="array-bar__index">[{index}]</span>
          </div>
        );
      })}
    </div>
  );
}
