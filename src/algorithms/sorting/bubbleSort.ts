import type {VisualizerStep} from '../../hooks/useVisualizerEngine';

export interface ArrayState {
  array: number[];
}

export function generateBubbleSortSteps(input: number[]): VisualizerStep<ArrayState>[] {
  const arr = [...input];
  const steps: VisualizerStep<ArrayState>[] = [];

  steps.push({
    state: {array: [...arr]},
    highlights: {},
    explanation: `Starting array: [${arr.join(', ')}]. Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.`,
  });

  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      // Comparing step
      steps.push({
        state: {array: [...arr]},
        highlights: {
          comparing: [j, j + 1],
          sorted: Array.from({length: i}, (_, k) => n - 1 - k),
        },
        explanation: `Pass ${i + 1}: Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}.`,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          state: {array: [...arr]},
          highlights: {
            swapping: [j, j + 1],
            sorted: Array.from({length: i}, (_, k) => n - 1 - k),
          },
          explanation: `${arr[j + 1]} > ${arr[j]}, so swap them. Array is now [${arr.join(', ')}].`,
        });
      } else {
        steps.push({
          state: {array: [...arr]},
          highlights: {
            sorted: Array.from({length: i}, (_, k) => n - 1 - k),
          },
          explanation: `${arr[j]} <= ${arr[j + 1]}, no swap needed.`,
        });
      }
    }

    // Mark the element that bubbled to its final position
    steps.push({
      state: {array: [...arr]},
      highlights: {
        sorted: Array.from({length: i + 1}, (_, k) => n - 1 - k),
      },
      explanation: `Pass ${i + 1} complete. Element ${arr[n - 1 - i]} is now in its final position at index ${n - 1 - i}.`,
    });

    if (!swapped) {
      steps.push({
        state: {array: [...arr]},
        highlights: {sorted: Array.from({length: n}, (_, k) => k)},
        explanation: `No swaps in this pass — the array is already sorted! Early termination.`,
      });
      return steps;
    }
  }

  steps.push({
    state: {array: [...arr]},
    highlights: {sorted: Array.from({length: n}, (_, k) => k)},
    explanation: `Sorting complete! Final array: [${arr.join(', ')}].`,
  });

  return steps;
}
