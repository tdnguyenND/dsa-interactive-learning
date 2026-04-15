import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const topics = [
  {title: 'Fundamentals', desc: 'Big-O notation, recursion, bit manipulation', link: '/docs/fundamentals/big-o-notation', icon: '{}'},
  {title: 'Arrays & Strings', desc: 'Two pointers, sliding window, prefix sum', link: '/docs/arrays-and-strings/arrays', icon: '[]'},
  {title: 'Linked Lists', desc: 'Singly, doubly linked lists, fast/slow pointers', link: '/docs/linked-lists/singly-linked-list', icon: '->'},
  {title: 'Stacks & Queues', desc: 'LIFO, FIFO, monotonic stack, priority queue', link: '/docs/stacks-and-queues/stacks', icon: '||'},
  {title: 'Trees', desc: 'Binary trees, BST, AVL, heap, trie', link: '/docs/trees/binary-trees', icon: '/\\'},
  {title: 'Hash Tables', desc: 'Hashing, collision handling, patterns', link: '/docs/hash-tables/hash-tables', icon: '#'},
  {title: 'Graphs', desc: 'BFS, DFS, Dijkstra, MST, topological sort', link: '/docs/graphs/graph-representations', icon: 'o-o'},
  {title: 'Sorting', desc: 'Bubble, merge, quick, heap, radix sort', link: '/docs/sorting/comparison-sorts', icon: '<>'},
  {title: 'Searching', desc: 'Binary search and its many variations', link: '/docs/searching/binary-search', icon: '?'},
  {title: 'Dynamic Programming', desc: 'Memoization, tabulation, knapsack, LCS', link: '/docs/dynamic-programming/dp-introduction', icon: 'dp'},
  {title: 'Greedy', desc: 'Greedy choice property, interval scheduling', link: '/docs/greedy/greedy-algorithms', icon: '>>'},
  {title: 'Backtracking', desc: 'N-Queens, sudoku, permutations', link: '/docs/backtracking/backtracking', icon: '<-'},
];

const features = [
  {title: 'Interactive Visualizations', desc: 'Watch algorithms execute step-by-step with play, pause, and speed controls. See exactly how data moves through each operation.'},
  {title: 'Run Code in Browser', desc: 'Write and execute Python code directly in the browser. No setup needed — powered by Pyodide (CPython compiled to WebAssembly).'},
  {title: 'Comprehensive Coverage', desc: 'From arrays to dynamic programming — every major data structure and algorithm explained with theory, code, complexity analysis, and practice problems.'},
];

function TopicCard({title, desc, link, icon}: {title: string; desc: string; link: string; icon: string}) {
  return (
    <Link to={link} className="topic-card">
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
        <span style={{
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: '1.1rem',
          fontWeight: 700,
          opacity: 0.6,
          width: '2rem',
          textAlign: 'center',
        }}>{icon}</span>
        <Heading as="h3" style={{margin: 0, fontSize: '1.05rem'}}>{title}</Heading>
      </div>
      <p style={{margin: 0, paddingLeft: '2.75rem'}}>{desc}</p>
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Master DSA Interactively"
      description="Learn Data Structures and Algorithms with interactive visualizations, live code editor, and step-by-step animations">
      <header className="hero hero--dsa">
        <div className="container">
          <Heading as="h1" className="hero__title">
            DSA Interactive Learning
          </Heading>
          <p className="hero__subtitle">
            Master Data Structures & Algorithms through interactive visualizations,
            live code execution, and step-by-step animations.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              Start Learning
            </Link>
            <Link className="button button--outline button--lg" to="/docs/fundamentals/big-o-notation"
              style={{borderColor: 'currentColor', color: 'inherit'}}>
              Jump to Topics
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="row" style={{gap: '1.5rem', justifyContent: 'center'}}>
              {features.map((f, i) => (
                <div key={i} className="col col--3 feature-card">
                  <Heading as="h3" style={{fontSize: '1.1rem'}}>{f.title}</Heading>
                  <p style={{fontSize: '0.9rem', margin: 0}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{padding: '2rem 0 4rem'}}>
          <div className="container">
            <Heading as="h2" style={{textAlign: 'center', marginBottom: '2rem'}}>
              Topics
            </Heading>
            <div className="topic-grid">
              {topics.map((t, i) => (
                <TopicCard key={i} {...t} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
