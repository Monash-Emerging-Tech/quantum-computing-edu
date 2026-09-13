/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Load page data from MDX files.
 */

import fs from "fs";
import path from "path";
import { cache } from "react";

type PageFile = {
  page_name: string;
  file_extension: string;
};

type PageInfo = {
  file_path: string;
  title?: string;
  short_name?: string;
  description?: string;
};

/**
 * Load a list of pages from a data section.
 *
 * @param section Name of the section in the data directory
 * @returns List of pages in the section
 */
const loadPagesList = cache((section: string): PageFile[] => {
  const dataDir = path.join(process.cwd(), "data", section);

  return fs
    .readdirSync(dataDir)
    .filter(file => file.endsWith(".mdx") || file.endsWith(".md"))
    .map(page => {
      // Split on the last occurrence of '.'
      const [name, extension] = page.split(/\.(?=[^.]+$)/);

      // Restructure data into object
      return {
        page_name: name,
        file_extension: extension,
      };
    })
    .toSorted((a, b) => a.page_name.localeCompare(b.page_name));
});

/**
 * Load the frontmatter metadata from a page source file.
 *
 * @param section Name of the section in the data directory
 * @param page_name Name or sub-path of the page in the data section
 * @returns Page metadata
 */
const loadPageInformation = cache(
  async (section: string, page_name: string): Promise<PageInfo> => {
    try {
      const { frontmatter } = await import(
        /* turbopackOptional: true */ `@/data/${section}/${page_name}`
      );
      return {
        file_path: `@/data/${section}/${page_name}`,
        title: frontmatter?.title,
        short_name: frontmatter["short-name"],
        description: frontmatter?.description,
      };
    } catch {
      return { file_path: `@/data/${section}/${page_name}` };
    }
  },
);

export type { PageInfo };
export { loadPagesList, loadPageInformation };
