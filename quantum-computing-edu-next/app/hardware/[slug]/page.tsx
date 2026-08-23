/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Page generator for hardware pages (part of a dynamic route).
 */

import { loadPagesList } from "@/lib/load-pages-list";
import fs from "fs";
import type { Metadata } from "next";
import styles from "./page.module.css";

/**
 * Generate per-page metadata for hardware pages.
 */
export async function generateMetadata({
  params,
}: PageProps<"/hardware/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const all_hardware = loadPagesList("hardware");
  const match = all_hardware.find(({ page_name }) => page_name === slug);
  if (
    !match ||
    !fs.existsSync(
      `${process.cwd()}/data/hardware/${match.page_name}.${match.file_extension}`,
    )
  ) {
    return { title: slug };
  }
  try {
    const { frontmatter } = await import(
      `@/data/hardware/${match.page_name}.${match.file_extension}`
    );
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
  const all_hardware = loadPagesList("hardware");

  const matching_hardware = all_hardware.filter(
    ({ page_name }) => page_name === slug,
  );

  // Attempt to import the hardware from the relevant markdown file, if it is defined & it exists
  let MarkdownPage = () => <></>;
  if (
    slug !== undefined &&
    slug !== "" &&
    matching_hardware.length > 0 &&
    fs.existsSync(
      `${process.cwd()}/data/hardware/${matching_hardware[0].page_name}.${matching_hardware[0].file_extension}`,
    )
  ) {
    // NOTE: Something weird can happen during build time here, where .md file extensions can cause a cryptic build error.
    // This particular code seems stable, but changing this could cause issues.
    const { default: MarkdownPage_import } = await import(
      `@/data/hardware/${matching_hardware[0].page_name}.${matching_hardware[0].file_extension}`
    );
    MarkdownPage = MarkdownPage_import;
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
