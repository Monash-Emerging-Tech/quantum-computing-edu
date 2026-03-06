/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Vertical page index displayed on the side of the a page.
 */

import Link from "next/link";

import styles from "./side_index.module.css";

import { loadGatesAndCircuits } from '@/app/circuit-data/data-loading';
import { loadDocPagesList } from '@/app/doc-data/load-docs-list';

export default function SideIndexMenu() {
  // Load all the gates and circuits in the database
  const [gate_map, circuit_map] = loadGatesAndCircuits();
  console.log("Loaded "+gate_map.size+" gates and "+circuit_map.size+" circuits.");
  
  return <div className={styles["side-index-container"]}>
    <header>
      <Link href="/" className={styles["side-index-link-nounderline"]}>
        <h2 className={styles["index-header"]+" "+styles["index-home"]}>
          Home
        </h2>
      </Link>
    </header>
    
    <table className={styles["index-table"]}>
      <thead>
        <tr>
          <th className={styles["index-header"]}>
            Gates
          </th>
        </tr>
      </thead>
      <tbody>
        {
          gate_map.values().map(
            (gate) =>
              <tr key={gate.gate_id} id={"circuit-"+gate.gate_id} className={styles["index-link-row"]}>
                <td>
                  <Link href={"/gates/"+gate.gate_id} className={styles["side-index-link-nounderline"]}>
                    <div className={styles["index-link-box"]}>
                      {gate.full_name}
                    </div>
                  </Link>
                </td>
              </tr>
          ).toArray()
        }
      </tbody>
    </table>
    
    <table className={styles["index-table"]}>
      <thead>
        <tr>
          <th className={styles["index-header"]}>
            Circuits
          </th>
        </tr>
      </thead>
      <tbody>
        {
          circuit_map.values().map(
            (circuit) =>
              <tr key={circuit.circuit_id} id={"circuit-"+circuit.circuit_id} className={styles["index-link-row"]}>
                <td>
                  <Link href={"/circuits/"+circuit.circuit_id} className={styles["side-index-link-nounderline"]}>
                    <div className={styles["index-link-box"]}>
                      {circuit.full_name}
                    </div>
                  </Link>
                </td>
              </tr>
          ).toArray()
        }
      </tbody>
    </table>
    
    <table className={styles["index-table"]}>
      <thead>
        <tr>
          <th className={styles["index-header"]}>
            Documentation
          </th>
        </tr>
      </thead>
      <tbody>
        {
          loadDocPagesList().map(
            ({doc_name}) =>
              <tr key={doc_name} id={"doc-page-"+doc_name} className={styles["index-link-row"]}>
                <td>
                  <Link href={"/docs/"+doc_name} className={styles["side-index-link-nounderline"]}>
                    <div className={styles["index-link-box"]}>
                      {doc_name.charAt(0).toUpperCase() + doc_name.slice(1).replaceAll("_", " ")}
                    </div>
                  </Link>
                </td>
              </tr>
          )
        }
      </tbody>
    </table>
  </div>;
}
