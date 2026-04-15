import type {VisualizerStep} from '../../hooks/useVisualizerEngine';
import type {ArrayState} from './bubbleSort';

export function generateInsertionSortSteps(input: number[]): VisualizerStep<ArrayState>[] {
  const arr = [...input];
  const steps: VisualizerStep<ArrayState>[] = [];
  const n = arr.length;

  steps.push({
    state: {array: [...arr]},
    highlights: {sorted: [0]},
    explanation: `Starting array: [${arr.join(', ')}]. Insertion sort builds a sorted portion from left to right. The first element is trivially sorted.`,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    steps.push({
      state: {array: [...arr]},
      highlights: {
        active: [i],
        sorted: Array.from({length: i}, (_, k) => k),
      },
      explanation: `Pick element arr[${i}]=${key}. Insert it into the correct position in the sorted portion [0..${i - 1}].`,
    });

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({
        state: {array: [...arr]},
        highlights: {
          comparing: [j, j + 1],
          active: [i],
          sorted: Array.from({length: i}, (_, k) => k),
        },
        explanation: `arr[${j}]=${arr[j]} > ${key}, shift arr[${j}] one position right.`,
      });

      arr[j + 1] = arr[j];
      j--;

      steps.push({
        state: {array: [...arr]},
        highlights: {
          swapping: [j + 1, j + 2],
          sorted: Array.from({length: i}, (_, k) => k),
        },
        explanation: `Shifted. Array: [${arr.join(', ')}].`,
      });
    }

    arr[j + 1] = key;

    steps.push({
      state: {array: [...arr]},
      highlights: {
        sorted: Array.from({length: i + 1}, (_, k) => k),
      },
      explanation: `Insert ${key} at position ${j + 1}. Sorted portion is now [${arr.slice(0, i + 1).join(', ')}].`,
    });
  }

  steps.push({
    state: {array: [...arr]},
    highlights: {sorted: Array.from({length: n}, (_, k) => k)},
    explanation: `Sorting complete! Final array: [${arr.join(', ')}].`,
  });

  return steps;
}
