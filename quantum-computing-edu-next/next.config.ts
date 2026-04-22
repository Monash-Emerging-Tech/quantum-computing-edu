import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: `dist/${process.env.NEXT_PUBLIC_BUILD}`,
  basePath: process.env.NEXT_PUBLIC_BASEPATH,
  trailingSlash: true,
  images: { unoptimized: true },
  //experimental: {
  //  inlineCss: true,
  //},
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      'remark-math',
    ],
    rehypePlugins: [
      'rehype-mathjax',
      ['rehype-citation', {
        bibliography: 'citation/references.bib',
        csl: 'citation/ieee.csl',
        lang: 'en-US',
        linkCitations: true,
        showTooltips: true,
      }],
    ],
  },
});

export default withMDX(nextConfig);
