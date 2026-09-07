/**
 * Interactive quantum computing education web interface
 * MNET 2025
 *
 * Vertical page index displayed on the side of a page.
 */

import { loadGatesAndCircuits } from "@/lib/data-loading";
import { loadPagesList } from "@/lib/load-pages-list";
import Link from "next/link";
import styles from "./side_index.module.css";

export default function SideIndexMenu() {
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();

  console.log(
    "Loaded " + gate_map.size + " gates and " + circuit_map.size + " circuits.",
  );

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
            <th className={styles["index-header"]}>Gates</th>
          </tr>
        </thead>
        <tbody>
          {gate_map
            .values()
            .map(gate => (
              <tr
                key={gate.gate_id}
                id={"gate-" + gate.gate_id}
                className={styles["index-link-row"]}
              >
                <td>
                  <Link
                    href={"/gates/" + gate.gate_id}
                    className={styles["side-index-link-no-underline"]}
                  >
                    <div className={styles["index-link-box"]}>
                      {gate.full_name}
                    </div>
                  </Link>
                </td>
              </tr>
            ))
            .toArray()}
        </tbody>
      </table>

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

const SectionList = ({ section }: { section: string }) => {
  return loadPagesList(section).map(({ page_name }) => (
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
            {page_name.charAt(0).toUpperCase() +
              page_name.slice(1).replaceAll("_", " ")}
          </div>
        </Link>
      </td>
    </tr>
  ));
};
