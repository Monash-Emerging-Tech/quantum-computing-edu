/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Components for the interactive circuit.
 */

"use client";

import { useState, useEffect } from "react";
//import Link from "next/link";

import styles from "./circuit.module.css";

enum GateType {
  I = 0,
  H,
  X,
  Y,
  Z
}

/**
 * Create the circuit
 * @param data The circuit data encoded as a Qobj
 * @returns JSX quantum circuit container element
 */
//const Circuit = ({data}: {data: Qobj}) => {
const Circuit = () => {
  const dummyCircuitData = {
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
        qubits: [0],
        desc: "The ancilla qubit, also known as the auxiliary qubit in HHL, is used in the Ancilla Quantum Encoding (AQE) step to encode ..."
      },
      {
        name: "clock",
        qubits: [1,2,3,4,5,6,7,8],
        desc: "The clock register is used by Quantum Phase Estimation (QPE) to store the eigenvalues of the matrix A."
      },
      {
        name: "state",
        qubits: [9,10],
        desc: "The state register, also known as the result register, is initialised with the vector b and used by QPE to estimate the eigenvalues. Upon measurement, this register contains an index (encoded in binary) of the result vector."
      },
    ],
    gates: [
      // This is the most complicated part
      {
        type: GateType.H,
        qubits: [1],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [2],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [3],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [4],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [5],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [6],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [7],
        controls: [],
        anticontrols: []
      },
      {
        type: GateType.H,
        qubits: [8],
        controls: [],
        anticontrols: []
      }
    ]
  }
  
  const data = dummyCircuitData;
  
  // Calculate the vertical position of each qubit in the circuit
  const qubitOrder = data.registers.flatMap(({qubits}) => qubits);
  let qubitPositions: Array<number> = [];
  qubitOrder.forEach((q, i) => qubitPositions[q] = i);
  
  return <div id="circuit-container" className={styles["circuit-container"]}>
    <div id="circuit-qubit-label-container" className={styles["circuit-qubit-label-container"]}>
      
    </div>
    <div id="circuit-grid" className={styles["circuit-grid"]}>
      {
        data.registers.map(
          ({name, qubits, desc}) => qubits.map(
            (qb, i) => <QubitLine key={i} name={name} qubit={qb} desc={desc}/>
          )
        )
      }
      {
        data.gates.map(
          ({type, qubits, controls, anticontrols}, i) => <Gate key={i} type={type} qubits={qubits} qubitPositions={qubitPositions} controls={controls} anticontrols={anticontrols}/>
        )
      }
    </div>
  </div>
}

/**
 * Create a qubit line in the circuit
 * @param name Name of the parent register
 * @param qubit Qubit ID
 * @param desc Description of the parent register
 * @returns JSX element
 */
const QubitLine = ({name, qubit, desc}: {name: string, qubit: number, desc: string}) => {
  return <div className={styles["circuit-qubit-line"]} title={name}>
    {/*<div className={styles["circuit-gate"]}>H</div>*/}
  </div>
}

/**
 * Create quantum gate
 * @param type Which type of gate it is
 * @param qubits The qubits that the gate applies to
 * @param controls Control qubits
 * @param anticontrols Anti-control qubits
 * @returns JSX element
 */
const Gate = ({
  type,
  qubits,
  controls,
  anticontrols,
  qubitPositions
}: {
  type: GateType,
  qubits: Array<number>,
  controls: Array<number>,
  anticontrols: Array<number>,
  qubitPositions: Array<number>
}) => {
  const [lineSeparation, setlineSeparation] = useState(0);
  
  useEffect(() => {
    //const root = document.documentElement;
    const container = document.getElementById("circuit-container");
    const grid = document.getElementById("circuit-grid");
    if (!container || !grid) {
      console.error("Circuit container not found - unable to add gate");
      return;
    }
    
    // Calculate sizes (in em)
    const computedStyle = window.getComputedStyle(container);
    const lineSeparationStyle = parseFloat(computedStyle.getPropertyValue("--qubit-line-margin"));
    
    setlineSeparation(lineSeparationStyle);
  }, []);
  
  const upperQubitPos = Math.min.apply(Math, qubits.map(q => qubitPositions[q]));
  const lowerQubitPos = Math.max.apply(Math, qubits.map(q => qubitPositions[q]));
  
  return <div
    className={styles["circuit-gate"]}
    style={{
      top: (upperQubitPos+0.5)*lineSeparation*2 + "em",
      //left: 1 + "em",
      padding: "1rem"
    }}
  >H</div>
}

export default Circuit;
