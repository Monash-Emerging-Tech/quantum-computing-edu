/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for quantum gate information pages (part of a dynamic route).
 */

import { loadPageInformation, loadPagesList } from "@/lib/page-loading";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generates per-page metadata for gate pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/gates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pageInfo = await loadPageInformation("gates", slug);
  return {
    title: pageInfo.title ?? slug,
    description:
      pageInfo?.description ?? `Learn about the ${slug} quantum gate.`,
  };
}

// Ensure that some core gates have pre-built pages (this is entirely optional)
export async function generateStaticParams() {
  return loadPagesList("gates").map(({ page_name }) => ({
    slug: page_name,
  }));
}

/**
 *
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<"/gates/[slug]">) {
  const { slug } = await params;
  return <Content slug={slug} />;
}

/**
 * Create the gate information page
 * @returns JSX content for the gate page
 */
async function Content({ slug }: { slug: string }) {
  let MarkdownPage = () => <div>The page couldn't be loaded.</div>;

  // Attempt to import the documentation from the relevant markdown file
  try {
    const { default: MarkdownPage_import } = await import(
      `@/data/gates/${slug}`
    );
    MarkdownPage = MarkdownPage_import;
  } catch {
    console.error("Failed to load gate page " + slug);
  }

  return (
    <div id="gates-page-container" className={styles["gates-page-container"]}>
      <MarkdownPage />
    </div>
  );
}
