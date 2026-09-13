/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for meta documentation pages (part of a dynamic route).
 */

import { loadPageInformation, loadPagesList } from "@/lib/page-loading";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generate per-page metadata for docs pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pageInfo = await loadPageInformation("docs", slug);
  return {
    title: pageInfo.title ?? slug,
    description: pageInfo?.description ?? `QCET documentation.`,
  };
}

/**
 * Generate all pages at build time.
 */
export async function generateStaticParams() {
  return loadPagesList("docs").map(({ page_name }) => ({ slug: page_name }));
}

/**
 * Render the page.
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;

  return <Content slug={slug} />;
}

/**
 * Create the content of the documentation page.
 * @returns JSX content for the documentation page
 */
async function Content({ slug }: { slug: string }) {
  let MarkdownPage = () => <div>The page couldn't be loaded.</div>;

  // Attempt to import the documentation from the relevant markdown file
  try {
    const { default: MarkdownPage_import } = await import(
      `@/data/docs/${slug}`
    );
    MarkdownPage = MarkdownPage_import;
  } catch {
    console.error("Failed to load docs page " + slug);
  }

  return (
    <div id="docs-page-container" className={styles["docs-page-container"]}>
      <MarkdownPage />
    </div>
  );
}
