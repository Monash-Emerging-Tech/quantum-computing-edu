/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for quantum circuit information pages (part of a dynamic route).
 */

import { loadPagesList } from "@/lib/page-loading";
import fs from "fs";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generates per-page metadata for circuit pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/circuits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const all_pages = loadPagesList("circuits");
  const match = all_pages.find(({ page_name }) => page_name === slug);
  if (
    !match ||
    !fs.existsSync(
      `${process.cwd()}/data/circuits/${match.page_name}.${match.file_extension}`,
    )
  ) {
    return { title: slug };
  }
  try {
    const { frontmatter } = await import(
      `@/data/circuits/${match.page_name}.${match.file_extension}`
    );
    return {
      title: frontmatter?.title ?? slug,
      description: frontmatter?.description,
    };
  } catch {
    return { title: slug };
  }
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
  const all_pages = loadPagesList("circuits");

  const matching_pages = all_pages.filter(
    ({ page_name }) => page_name === slug,
  );

  // Attempt to import the documentation from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    slug !== undefined &&
    slug !== "" &&
    matching_pages.length > 0 &&
    fs.existsSync(
      `${process.cwd()}/data/circuits/${matching_pages[0].page_name}.${matching_pages[0].file_extension}`,
    )
  ) {
    // NOTE: Something weird can happen during build time here, where .md file extensions can cause a cryptic build error.
    // This particular code seems stable, but changing this could cause issues.
    const { default: MarkdownPage_import } = await import(
      `@/data/circuits/${matching_pages[0].page_name}.${matching_pages[0].file_extension}`
    );
    MarkdownPage = MarkdownPage_import;
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
