/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for quantum circuit information pages (part of a dynamic route).
 */

import { loadPagesList, loadPageInformation } from "@/lib/page-loading";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generates per-page metadata for circuit pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/circuits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pageInfo = await loadPageInformation("circuits", slug);
  return {
    title: pageInfo.title ?? slug,
    description:
      pageInfo?.description ?? `Information about the ${slug} quantum circuit.`,
  };
}

// Ensure that some core gates have pre-built pages (this is entirely optional)
export async function generateStaticParams() {
  return loadPagesList("circuits").map(({ page_name }) => ({
    slug: page_name,
  }));
}

/**
 *
 * @param params Page properties to retrieve the slug in the dynamic route segment
 * @returns React component for the page
 */
export default async function Page({ params }: PageProps<"/circuits/[slug]">) {
  const { slug } = await params;

  return <Content slug={slug} />;
}

/**
 * Create the interactive circuit page
 * @returns JSX content for the circuit page
 */
async function Content({ slug }: { slug: string }) {
  let MarkdownPage = () => <div>The page couldn't be loaded.</div>;

  // Attempt to import the documentation from the relevant markdown file
  try {
    const { default: MarkdownPage_import } = await import(
      `@/data/circuits/${slug}`
    );
    MarkdownPage = MarkdownPage_import;
  } catch {
    console.error("Failed to load circuit page " + slug);
  }

  return (
    <div
      id="circuits-page-container"
      className={styles["circuits-page-container"]}
    >
      <MarkdownPage />
    </div>
  );
}
