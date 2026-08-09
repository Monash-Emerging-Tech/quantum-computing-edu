/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Load page data from MDX files.
 */

import { cache } from "react";

import fs from "fs";
import path from "path";

type PageFile = {
  page_name: string,
  file_extension: string
};

/**
 * Load a list of pages from a data section.
 *
 * @param section Name of the section in the data directory
 * @returns List of pages in the section
 */
const loadPagesList = cache((section: string): PageFile[] => {
  const dataDir = path.join(process.cwd(), "data", section);

  return fs.readdirSync(dataDir)
    .filter(file => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((page) => {
      // Split on the last occurrence of '.'
      const [name, extension] = page.split(/\.(?=[^.]+$)/);

      // Restructure data into object
      return {
        page_name: name,
        file_extension: extension
      };
    })
    .toSorted((a, b) => a.page_name.localeCompare(b.page_name));
});

export { loadPagesList };
