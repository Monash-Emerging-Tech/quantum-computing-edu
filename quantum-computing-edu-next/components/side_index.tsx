/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Vertical page index displayed on the side of a page.
 */

import { loadPageInformation, loadPagesList } from "@/lib/page-loading";
import Link from "next/link";
import styles from "./side_index.module.css";

export default function SideIndexMenu() {
  return (
    <div className={styles["side-index-container"]}>
      <Link href="/" className={styles["side-index-link-no-underline"]}>
        <h2 className={styles["index-header"] + " " + styles["index-home"]}>
          QCET
        </h2>
      </Link>

      <table className={styles["index-table"]}>
        <thead>
          <tr>
            <th className={styles["index-header"]}>Circuits</th>
          </tr>
        </thead>
        <tbody>
          <SectionList section={"circuits"} />
        </tbody>
      </table>

      <table className={styles["index-table"]}>
        <thead>
          <tr>
            <th className={styles["index-header"]}>Gates</th>
          </tr>
        </thead>
        <tbody>
          <SectionList section={"gates"} />
        </tbody>
      </table>

      <table className={styles["index-table"]}>
        <thead>
          <tr>
            <th className={styles["index-header"]}>Hardware</th>
          </tr>
        </thead>
        <tbody>
          <SectionList section={"hardware"} />
        </tbody>
      </table>

      <table className={styles["index-table"]}>
        <thead>
          <tr>
            <th className={styles["index-header"]}>Documentation</th>
          </tr>
        </thead>
        <tbody>
          <SectionList section={"docs"} />
        </tbody>
      </table>
    </div>
  );
}

const SectionList = ({ section }: { section: string }) =>
  loadPagesList(section).map(async ({ page_name }) => (
    <tr
      key={page_name}
      id={`${section}-page-${page_name}`}
      className={styles["index-link-row"]}
    >
      <td>
        <Link
          href={`/${section}/${page_name}`}
          className={styles["side-index-link-no-underline"]}
        >
          <div className={styles["index-link-box"]}>
            {(await loadPageInformation(section, page_name)).title ??
              page_name.charAt(0).toUpperCase() +
                page_name.slice(1).replaceAll("_", " ")}
          </div>
        </Link>
      </td>
    </tr>
  ));
