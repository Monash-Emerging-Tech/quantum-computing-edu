/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for meta documentation pages (part of a dynamic route).
 */

import { loadPagesList } from "@/lib/load-pages-list";
import fs from "fs";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generate per-page metadata for docs pages.
 */
export async function generateMetadata({ params }: PageProps<'/docs/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const all_docs = loadPagesList("docs");
  const match = all_docs.find(({ page_name }) => page_name === slug);
  if (!match || !fs.existsSync(`${process.cwd()}/data/docs/${match.page_name}.${match.file_extension}`)) {
    return { title: slug };
  }
  try {
    const { frontmatter } = await import(`@/data/docs/${match.page_name}.${match.file_extension}`);
    return {
      title: frontmatter?.title ?? slug,
      description: frontmatter?.description,
    };
  } catch {
    return { title: slug };
  }
}

/**
 * Generate all pages at build time.
*/
export async function generateStaticParams() {
  return loadPagesList("docs").map(({page_name}) => ({slug: page_name}));
}

/**
 * Render the page.
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<'/docs/[slug]'>) {
  const { slug } = await params;

  return <Content slug={slug} />
}

/**
 * Create the content of the documentation page.
 * @returns JSX content for the documentation page
 */
async function Content({ slug }: { slug: string }) {
  const all_docs = loadPagesList("docs");

  const matching_docs = all_docs.filter(({page_name}) => page_name === slug);

  // Attempt to import the documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    slug !== undefined &&
    slug !== "" &&
    matching_docs.length > 0 &&
    fs.existsSync(`${process.cwd()}/data/docs/${matching_docs[0].page_name}.${matching_docs[0].file_extension}`)
  ) {
    // NOTE: Something weird can happen during build time here, where .md file extensions can cause a cryptic build error.
    // This particular code seems stable, but changing this could cause issues.
    const { default: MarkdownPage_import } = await import(`@/data/docs/${matching_docs[0].page_name}.${matching_docs[0].file_extension}`);
    MarkdownPage = MarkdownPage_import;
  }

  return (
    <div id="docs-page-container" className={styles["docs-page-container"]}>
      <MarkdownPage />
    </div>
  )
}
