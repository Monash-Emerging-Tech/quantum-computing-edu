import type { NextConfig } from "next";
import createMDX from '@next/mdx';

//import remarkMath from 'remark-math'
//import rehypeMathJax from 'rehype-mathjax'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      'remark-math',
      //remarkMath
    ],
    rehypePlugins: [
      'rehype-mathjax',
      //rehypeMathJax
    ],
  },
});

export default withMDX(nextConfig);
