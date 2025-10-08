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
    <h1 id="page-header"  className={styles["page-header"]}>
      Interactive Quantum Circuits
    </h1>
    
    <h2 id="circuit-header" className={styles["circuit-header"]}>
      Harrow-Hassidim-Lloyd Algorithm
    </h2>
    
    <Circuit />
    
    <div id="circuit-information-container">
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Algorithm Overview</h3>
        
        <p>
          The Harrow-Hassidim-Lloyd Algorithm inverts a Hermitian matrix, <code>A</code>,
          and creates a quantum state corresponding to the solution of <code>Ax = b</code>,
          where A and b are known.
        </p>
        
      </section>
      
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Circuit Explanation</h3>
        
        <p>
          The circuit requires oracular access to the Hermitian matrix <code>A</code>.{" "}
          For current implementations, the matrix is converted to a unitary operator,{" "}
          <code>U</code>, which is used during construction of the circuit.
          
          After construction of the main circuit, the qubits in the <code>state</code>{" "}
          register are initialised using the input vector <code>b</code>.
          All other qubits are initialised to <code>|0⟩</code>.
        </p>
        
      </section>
      
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Mathematical Proofs</h3>
      </section>
      
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Literature</h3>
        
        <p>
          Quantum algorithm for linear systems of equations
          <br />
          [citation]
        </p>
      </section>
      
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Use Cases</h3>
      </section>
      
      <section className={styles["information-section"]}>
        <h3 className={styles["h3"]}>Extra Information</h3>
        
        <h4>Theoretical problems</h4>
        
        <h4>Implementation problems</h4>
      </section>
    </div>
  </div>
