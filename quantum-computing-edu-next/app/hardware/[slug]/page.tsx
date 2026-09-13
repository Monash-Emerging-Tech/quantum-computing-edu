/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for hardware pages (part of a dynamic route).
 */

import { loadPageInformation, loadPagesList } from "@/lib/page-loading";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generate per-page metadata for hardware pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/hardware/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pageInfo = await loadPageInformation("hardware", slug);
  return {
    title: pageInfo.title ?? slug,
    description: pageInfo?.description ?? `Information about quantum hardware.`,
  };
}

/**
 * Generate all pages at build time.
 */
export async function generateStaticParams() {
  return loadPagesList("hardware").map(({ page_name }) => ({
    slug: page_name,
  }));
}

/**
 * Render the page.
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<"/hardware/[slug]">) {
  const { slug } = await params;

  return <Content slug={slug} />;
}

/**
 * Create the content of the hardware page.
 * @returns JSX content for the hardware page
 */
async function Content({ slug }: { slug: string }) {
  let MarkdownPage = () => <div>The page couldn't be loaded.</div>;

  // Attempt to import the documentation from the relevant markdown file
  try {
    const { default: MarkdownPage_import } = await import(
      `@/data/hardware/${slug}`
    );
    MarkdownPage = MarkdownPage_import;
  } catch {
    console.error("Failed to load hardware page " + slug);
  }

  return (
    <div
      id="hardware-page-container"
      className={styles["hardware-page-container"]}
    >
      <MarkdownPage />
    </div>
  );
}
