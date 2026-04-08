import type { MDXComponents } from 'mdx/types';
import Link from "next/link";
 
const components: MDXComponents = {
  a: ({ href, children }: Readonly<{href: string, children: React.ReactNode}>) => (
    <Link href={href} target={href.startsWith("http") ? "_blank" : ""}>{children}</Link>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components;
}
