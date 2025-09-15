/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Components for the interactive circuit.
 */

"use client";

//import { useState, useEffect } from "react";
//import Link from "next/link";

import styles from "./circuit.module.css";

/**
 * Create the circuit
 * @param data The circuit data encoded as a Qobj
 * @returns JSX quantum circuit container element
 */
//const Circuit = ({data}: {data: Qobj}) => {
const Circuit = () => {
  const dummy_circuit_data = {
    name: "HHL",
    desc: "The Harrow-Hassidim-Lloyd algorithm ...",
    inputs: [
      {
        name: "Matrix A",
        type: "Oracular access matrix"
      },
      {
        name: "Vector b",
        type: "State initialisation"
      }
    ],
    outputs: [
      {
        name: "Vector x",
        type: "Sampled distribution"
      }
    ],
    registers: [
      {
        name: "ancilla",
        qubits: 1,
        desc: "The ancilla qubit, also known as the auxiliary qubit in HHL, is used in the Ancilla Quantum Encoding (AQE) step to encode ..."
      },
      {
        name: "clock",
        qubits: 8,
        desc: "The clock register is used by Quantum Phase Estimation (QPE) to store the eigenvalues of the matrix A."
      },
      {
        name: "state",
        qubits: 2,
        desc: "The state register, also known as the result register, is initialised with the vector b and used by QPE to estimate the eigenvalues. Upon measurement, this register contains an index (encoded in binary) of the result vector."
      }
    ],
    gates: [
      // This is the most complicated part
    ]
  }
  
  const data = dummy_circuit_data;
  
  return <div id="circuit-container" className={styles["circuit-container"]}>
    <div id="circuit-grid" className={styles["circuit-grid"]}>
      <div id="circuit-qubit-label-container" className={styles["circuit-qubit-label-container"]}>
        
      </div>
      {
        data.registers.map(
          ({name, qubits, desc}) => [...Array(5).keys()].map(
            (_, i) => <QubitLine key={i} name={name} qubits={qubits} desc={desc}/>
          )
        )
      }
    </div>
  </div>
}

/**
 * Create a qubit line in the circuit
 * @param data The circuit data encoded as a Qobj
 * @returns JSX quantum circuit container element
 */
const QubitLine = ({name, qubits, desc}: {name: string, qubits: number, desc: string}) => {
  return <div className={styles["circuit-qubit-line"]} title={name}>
    <div className={styles["circuit-gate"]}>H</div>
  </div>
}

export default Circuit;
