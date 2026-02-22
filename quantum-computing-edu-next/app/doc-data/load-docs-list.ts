/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Load meta documentation data from MDX files.
 */

import { cache } from "react";

import fs from "fs";
import path from "path";

const docDataDir = path.join(process.cwd(), "app/doc-data/");

type DocFile = {
  doc_name: string,
  file_extension: string
};

/**
 * 
 * @returns 
 */
const loadDocPagesList = cache((): DocFile[] => {
  return fs.readdirSync(docDataDir)
    .filter(file => file.endsWith(".mdx") || file.endsWith(".md"))
    //.map((doc) => doc.replace(".mdx","").replace(".md",""))
    .map((doc) => {
      // Split on the last occurrence of the '.'
      const [name, extension] = doc.split(/\.(?=[^\.]+$)/);
      // Restructure data into object
      return {
        doc_name: name,
        file_extension: extension
      };
    })
    .toSorted((a,b) => a.doc_name.localeCompare(b.doc_name));
});

export { loadDocPagesList };
