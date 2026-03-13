import type { MDXComponents } from 'mdx/types';
import Link from "next/link";
 
const components: MDXComponents = {
  a: ({ href, children }) => (
    <Link href={href}>{children}</Link>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components;
}
