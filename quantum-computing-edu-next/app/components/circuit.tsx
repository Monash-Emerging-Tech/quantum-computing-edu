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

/**
 * Define a Unitary matrix datatype.
 * Each entry in the 2D array is a complex number of the form [real, imaginary].
 */
type Unitary = Array<Array<[number, number]>>

/**
 * Define the basic types of gates that exist
 */
enum GateType {
  SINGLE,
  SWAP,
  LARGE,
}

/**
 * Define type for standard/common gate information.
 */
type StandardGate = {
  type: GateType,
  name: string,
  longName: string,
  color: string,
  unitary: Unitary
}

/**
 * Define common gates
 */
const GateI: StandardGate = {
  type: GateType.SINGLE,
  name: "I",
  longName: "Identity",
  color: "white",
  unitary: [
    [[1,0],[0,0]],
    [[0,0],[1,0]]
  ]
}
const GateX: StandardGate = {
  type: GateType.SINGLE,
  name: "X",
  longName: "Pauli X", // AKA Not
  color: "blue",
  unitary: [
    [[0,0],[1,0]],
    [[1,0],[0,0]]
  ]
}
const GateY: StandardGate = {
  type: GateType.SINGLE,
  name: "Y",
  longName: "Pauli Y",
  color: "blue",
  unitary: [
    [[0,0],[0,-1]],
    [[0,1],[0,0]]
  ]
}
const GateZ: StandardGate = {
  type: GateType.SINGLE,
  name: "Z",
  longName: "Pauli Z",
  color: "blue",
  unitary: [
    [[1,0],[0,0]],
    [[0,0],[-1,0]]
  ]
}
const GateH: StandardGate = {
  type: GateType.SINGLE,
  name: "H",
  longName: "Hadamard",
  color: "red",
  unitary: [
    [[Math.SQRT1_2,0],[Math.SQRT1_2,0]],
    [[Math.SQRT1_2,0],[-Math.SQRT1_2,0]]
  ]
}
const GateSwap: StandardGate = {
  type: GateType.SWAP,
  name: "SWAP",
  longName: "Swap",
  color: "black",
  unitary: [
    [[1,0],[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[1,0],[0,0]],
    [[0,0],[1,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0],[1,0]]
  ]
}
const GateCNOT: StandardGate = {
  type: GateType.SINGLE,
  name: "CX",
  longName: "Controlled Not",
  color: "black",
  unitary: [
    [[1,0],[0,0],[0,0],[0,0]],
    [[0,0],[1,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0],[1,0]],
    [[0,0],[0,0],[1,0],[0,0]]
  ]
}

/**
 * Define the structure of a gate
 */
type Gate = {
  type: GateType,
  name: string,
  longName: string,
  color: string,
  qubits: Array<number>,
  controls: Array<number>,
  anticontrols: Array<number>,
  
  // For a custom gate, the constituent circuit should be defined.
  components?: QuantumCircuit,
}

/**
 * Define the structure of a quantum circuit.
 * A quantum circuit may be made up of gates or a single unitary matrix.
 */
type QuantumCircuit = {
  name: string,
  desc: string,
  inputs: Array<{
    name: string,
    type: string,
  }>,
  outputs: Array<{
    name: string,
    type: string,
  }>,
  registers: Array<{
    name: string,
    desc: string,
    qubits: Array<number>,
  }>,
  gates?: Array<Gate>,
  unitary?: Unitary
}



/**
 * Create the circuit
 * @param data The circuit data encoded as a Qobj
 * @returns JSX quantum circuit container element
 */
//const Circuit = ({data}: {data: Qobj}) => {
const Circuit = () => {
  const dummyCircuitData: QuantumCircuit = {
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
      {
        type: GateType.LARGE,
        name: "Ψ",
        longName: "Encode input vector",
        color: "black",
        qubits: [9,10],
        controls: [],
        anticontrols: [],
        //components: 
      } as Gate,
      
      //{
      //  type: GateType.LARGE,
      //  name: "QPE",
      //  longName: "Quantum Phase Estimation",
      //  color: "blue",
      //  qubits: [1,2,3,4,5,6,7,8,9,10],
      //  controls: [],
      //  anticontrols: [],
      //  //components: 
      //} as Gate,
      ...([...Array(8)].map((_, i) => ({
        ...GateH,
        qubits: [i+1],
        controls: [],
        anticontrols: []
      } as Gate))),
      {
        type: GateType.LARGE,
        name: "U",
        longName: "Hamiltonian Simulation",
        color: "black",
        qubits: [1,2,3,4,5,6,7,8,9,10],
        controls: [],
        anticontrols: [],
        //components: 
      } as Gate,
      {
        type: GateType.LARGE,
        name: "QFT†",
        longName: "Inverse Quantum Fourier Transform",
        color: "green",
        qubits: [1,2,3,4,5,6,7,8],
        controls: [],
        anticontrols: [],
        //components: 
      } as Gate,
      
      {
        type: GateType.LARGE,
        name: "AQE",
        longName: "Ancilla Quantum Encoding",
        color: "purple",
        qubits: [0,1,2,3,4,5,6,7,8],
        controls: [],
        anticontrols: [],
        //components: 
      } as Gate,
      {
        type: GateType.LARGE,
        name: "QPE†",
        longName: "Inverse Quantum Phase Estimation",
        color: "blue",
        qubits: [1,2,3,4,5,6,7,8,9,10],
        controls: [],
        anticontrols: [],
        //components: 
      } as Gate,
    ]
  }
  
  const data = dummyCircuitData;
  
  //console.log(data);
  
  // Calculate the vertical position of each qubit in the circuit
  const qubitOrder = data.registers.flatMap(({qubits}) => qubits);
  let qubitPositions: Array<number> = [];
  qubitOrder.forEach((q, i) => qubitPositions[q] = i);
  
  // Calculate the horizontal positions of the gates
  let qubitLastGatePos: Array<number> = Array(qubitOrder.length).fill(0);
  const gateTimePositions = data.gates!.map((gate, i) => {
    // Find the qubit with the rightmost gate position
    const gatePos = Math.max.apply(Math, gate.qubits.map(q => qubitLastGatePos[q]));
    
    // Get the width of the gate
    const [gateWidth, _] = calculateGateDimensions(gate, qubitPositions);
    
    // Update the next gate position for each applicable qubit
    gate.qubits.forEach(q => qubitLastGatePos[q] = gatePos+gateWidth);
    gate.controls.forEach(q => qubitLastGatePos[q] = gatePos+gateWidth);
    gate.anticontrols.forEach(q => qubitLastGatePos[q] = gatePos+1);
    return gatePos;
  });
  
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
        data.gates!.map(
          (gate, i) => <GateComponent
            key={i}
            gate={gate}
            qubitPositions={qubitPositions}
            timePosition={gateTimePositions[i]}
          />
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
const GateComponent = ({
  gate,
  qubitPositions,
  timePosition
}: {
  gate: Gate,
  qubitPositions: Array<number>,
  timePosition: number
}) => {
  const [lineSeparation, setLineSeparation] = useState(0);
  const [gateBaseSize, setGateWidth] = useState(0);
  const [gateMargin, setGateMargin] = useState(0);
  
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
    const gateWidthStyle = parseFloat(computedStyle.getPropertyValue("--gate-size"));
    const gateMarginStyle = parseFloat(computedStyle.getPropertyValue("--gate-h-margin"));
    
    setLineSeparation(lineSeparationStyle);
    setGateWidth(gateWidthStyle);
    setGateMargin(gateMarginStyle);
  }, []);
  
  // Find gate position and vertical span
  const upperQubitPos = Math.min.apply(Math, gate.qubits.map(q => qubitPositions[q]));
  const lowerQubitPos = Math.max.apply(Math, gate.qubits.map(q => qubitPositions[q]));
  //const gateHeight = lowerQubitPos - upperQubitPos + 1;
  //const gateWidth = Math.round(Math.log2(gateHeight+1));
  
  const [gateWidth, gateHeight] = calculateGateDimensions(gate, qubitPositions);
  
  return <div
    className={styles["circuit-gate"]}
    style={{
      top: (upperQubitPos+0.5)*lineSeparation*2 + "em",
      left: (timePosition * gateMargin * 3 + 1) + "em",
      height: ((gateHeight - 1) * lineSeparation * 2 + gateBaseSize) + "em",
      width: (gateWidth * gateBaseSize + gateMargin * (gateWidth-1)) + "em",
      lineHeight: ((gateHeight - 1) * lineSeparation * 2 + gateBaseSize) + "em",
      background: gate.color,
    }}
  >{gate.name}</div>
}



/**
 * Calculate the visual width & height of a gate
 * @param gate The quantum gate to calculate the dimensions of
 * @param qubitPositions The vertical arrangement of the qubits in the circuit
 * @returns [width: int, height: int]
 */
const calculateGateDimensions = (gate: Gate, qubitPositions: Array<number>): [number, number] => {
  const upperQubitPos = Math.min.apply(Math, gate.qubits.map(q => qubitPositions[q]));
  const lowerQubitPos = Math.max.apply(Math, gate.qubits.map(q => qubitPositions[q]));
  const gateHeight = lowerQubitPos - upperQubitPos + 1;
  const gateWidth = Math.round(Math.log2(gateHeight+1));
  //const gateWidth = gateHeight > 2 ? 2 : 1;
  
  return [
    gateWidth,
    gateHeight
  ];
}



export default Circuit;
