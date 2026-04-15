import type {VisualizerStep} from '../../hooks/useVisualizerEngine';
import type {ArrayState} from './bubbleSort';

export function generateSelectionSortSteps(input: number[]): VisualizerStep<ArrayState>[] {
  const arr = [...input];
  const steps: VisualizerStep<ArrayState>[] = [];
  const n = arr.length;

  steps.push({
    state: {array: [...arr]},
    highlights: {},
    explanation: `Starting array: [${arr.join(', ')}]. Selection sort finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.`,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      state: {array: [...arr]},
      highlights: {
        active: [i],
        sorted: Array.from({length: i}, (_, k) => k),
      },
      explanation: `Pass ${i + 1}: Finding the minimum element in the unsorted portion [${i}..${n - 1}]. Current minimum: arr[${i}]=${arr[i]}.`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        state: {array: [...arr]},
        highlights: {
          comparing: [minIdx, j],
          active: [i],
          sorted: Array.from({length: i}, (_, k) => k),
        },
        explanation: `Comparing current min arr[${minIdx}]=${arr[minIdx]} with arr[${j}]=${arr[j]}.`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          state: {array: [...arr]},
          highlights: {
            active: [minIdx],
            sorted: Array.from({length: i}, (_, k) => k),
          },
          explanation: `New minimum found: arr[${minIdx}]=${arr[minIdx]}.`,
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        state: {array: [...arr]},
        highlights: {
          swapping: [i, minIdx],
          sorted: Array.from({length: i}, (_, k) => k),
        },
        explanation: `Swap arr[${i}] and arr[${minIdx}]. Place ${arr[i]} at position ${i}.`,
      });
    }

    steps.push({
      state: {array: [...arr]},
      highlights: {
        sorted: Array.from({length: i + 1}, (_, k) => k),
      },
      explanation: `Position ${i} is now sorted with value ${arr[i]}.`,
    });
  }

  steps.push({
    state: {array: [...arr]},
    highlights: {sorted: Array.from({length: n}, (_, k) => k)},
    explanation: `Sorting complete! Final array: [${arr.join(', ')}].`,
  });

  return steps;
}
