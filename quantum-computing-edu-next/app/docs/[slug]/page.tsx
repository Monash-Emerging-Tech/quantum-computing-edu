/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Page generator for meta documentation pages (part of a dynamic route).
 */

import fs from "fs";

import { loadDocPagesList } from '@/app/doc-data/load-docs-list';

import styles from "./page.module.css";

// Ensure that some core gates have pre-built pages (this is entirely optional)
//export async function generateStaticParams() {
//  return [{ slug: 'identity' }, { slug: 'pauli-x' }, { slug: 'pauli-y' }, { slug: 'pauli-z' }, { slug: 'hadamard' }, { slug: 'barrier' }, { slug: 'swap' }]
//}

/**
 * 
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<'/docs/[slug]'>) {
  const { slug } = await params;
  
  return <Content slug={slug} />
}

/**
 * Create the documentation page
 * @returns JSX content for the documentation page
 */
async function Content({ slug }: { slug: string }) {
  const all_docs = loadDocPagesList();
  
  const matching_docs = all_docs.filter(({doc_name}) => doc_name === slug);
  
  // Attempt to import the documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    slug !== undefined &&
    slug !== "" &&
    matching_docs.length > 0 &&
    fs.existsSync(`${process.cwd()}/app/doc-data/${matching_docs[0].doc_name}.${matching_docs[0].file_extension}`)
  ) {
    // NOTE: Something weird can happen during build time here, where .md file extensions can cause a cryptic build error.
    // This particular code seems stable, but changing this could cause issues.
    const { default: MarkdownPage_import } = await import(`@/app/doc-data/${matching_docs[0].doc_name}.${matching_docs[0].file_extension}`);
    MarkdownPage = MarkdownPage_import;
  }
  
  return (
    <div id="docs-page-container" className={styles["docs-page-container"]}>
      <MarkdownPage />
    </div>
  )
}
