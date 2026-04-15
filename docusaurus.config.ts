import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'DSA Interactive Learning',
  tagline: 'Master Data Structures & Algorithms with interactive visualizations',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://tdnguyenND.github.io',
  baseUrl: '/dsa-interactive-learning/',

  organizationName: 'tdnguyenND',
  projectName: 'dsa-interactive-learning',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-n8MVd4RsNIU0tQ2/19eFc7feYkHc0aBIhxnt1GzMRj3OJrJYck0nehr/rJTAAraz',
      crossorigin: 'anonymous',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://github.com/tdnguyenND/dsa-interactive-learning/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'DSA Learning',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'dsaSidebar',
          position: 'left',
          label: 'Learn',
        },
        {
          href: 'https://github.com/tdnguyenND/dsa-interactive-learning',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Getting Started', to: '/docs/intro'},
            {label: 'Fundamentals', to: '/docs/fundamentals/big-o-notation'},
            {label: 'Sorting', to: '/docs/sorting/comparison-sorts'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'GitHub', href: 'https://github.com/tdnguyenND/dsa-interactive-learning'},
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} DSA Interactive Learning. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
