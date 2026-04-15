import React, {useMemo, useState, useCallback} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import AlgorithmVisualizer from '../AlgorithmVisualizer';
import ArrayVisualizer from './ArrayVisualizer';
import type {VisualizerStep} from '../../hooks/useVisualizerEngine';
import type {ArrayState} from '../../algorithms/sorting/bubbleSort';
import {generateBubbleSortSteps} from '../../algorithms/sorting/bubbleSort';
import {generateSelectionSortSteps} from '../../algorithms/sorting/selectionSort';
import {generateInsertionSortSteps} from '../../algorithms/sorting/insertionSort';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion';

const generators: Record<SortAlgorithm, (arr: number[]) => VisualizerStep<ArrayState>[]> = {
  bubble: generateBubbleSortSteps,
  selection: generateSelectionSortSteps,
  insertion: generateInsertionSortSteps,
};

const labels: Record<SortAlgorithm, string> = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
};

interface SortingVisualizerProps {
  algorithm: SortAlgorithm;
  initialData?: number[];
  showAlgorithmPicker?: boolean;
}

function SortingVisualizerInner({algorithm: initialAlgo, initialData, showAlgorithmPicker = false}: SortingVisualizerProps) {
  const defaultData = [38, 27, 43, 3, 9, 82, 10];
  const [data, setData] = useState(initialData ?? defaultData);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>(initialAlgo);

  const steps = useMemo(() => generators[algorithm](data), [algorithm, data]);

  const maxValue = useMemo(() => Math.max(...data), [data]);

  const renderState = useCallback((step: VisualizerStep<ArrayState>) => {
    return <ArrayVisualizer step={step} maxValue={maxValue} />;
  }, [maxValue]);

  const randomize = useCallback(() => {
    const newData = Array.from({length: 8}, () => Math.floor(Math.random() * 90) + 10);
    setData(newData);
  }, []);

  return (
    <div>
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
        {showAlgorithmPicker && (
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SortAlgorithm)}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
              fontSize: '0.85rem',
            }}
          >
            {Object.entries(labels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
        <button className="visualizer__btn" onClick={randomize}>
          Randomize
        </button>
        <span style={{fontSize: '0.8rem', opacity: 0.6}}>
          Data: [{data.join(', ')}]
        </span>
      </div>
      <AlgorithmVisualizer
        steps={steps}
        renderState={renderState}
        title={labels[algorithm]}
      />
    </div>
  );
}

export default function SortingVisualizer(props: SortingVisualizerProps) {
  return (
    <BrowserOnly fallback={<div className="visualizer"><p style={{padding: '1rem'}}>Loading...</p></div>}>
      {() => <SortingVisualizerInner {...props} />}
    </BrowserOnly>
  );
}
