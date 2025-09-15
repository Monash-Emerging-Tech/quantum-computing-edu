/**
 * Interactive quantum computing education web interface
 * MNET 2025
 */

//import Link from "next/link";
//import Image from "next/image";

import styles from "./page.module.css";

import Circuit from "./components/circuit";

export default function Home() {
  return <CircuitPage />;
}

/**
 * Create the interactive circuit page
 * @returns JSX content for the circuit page
 */
const CircuitPage = () =>
  <div id="circuit-page-container" className={styles["circuit-page-container"]}>
    <div id="page-header"  className={styles["page-header"]}>
      Interactive Quantum Circuits
    </div>
    <div id="circuit-header" className={styles["circuit-header"]}>
      Harrow-Hassidim-Lloyd Algorithm
    </div>
    <Circuit />
  </div>
