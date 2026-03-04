import type { NextConfig } from "next";
import createMDX from '@next/mdx';

//import remarkMath from 'remark-math'
//import rehypeMathJax from 'rehype-mathjax'

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
      //remarkMath
    ],
    rehypePlugins: [
      'rehype-mathjax',
      //rehypeMathJax
    ],
  },
});

export default withMDX(nextConfig);
