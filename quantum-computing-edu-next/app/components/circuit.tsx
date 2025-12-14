/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Components for the interactive circuit.
 */

"use client";

import { useState, useEffect } from "react";
//import Link from "next/link";

// Import types and basic gates
import { Unitary, StandardGate, Gate, QuantumCircuit, GateType, GateI, GateX, GateY, GateZ, GateH, GateSwap, GateCNOT, Barrier } from "./circuit-types";

import styles from "./circuit.module.css";

// Import info bubbles
import GateInfoBubble from "./info_bubbles";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverClose
} from "./popover";



/**
 * Create the circuit
 * @param data The circuit data encoded as a Qobj
 * @returns JSX quantum circuit container element
 */
const Circuit = ({data}: {data: QuantumCircuit}) => {
//const Circuit = () => {
  //const data = dummyCircuitData;
  
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
    <div id="circuit-qubit-label-container" className={styles["circuit-qubit-label-container"]}>
      {
        data.registers.map(
          ({name, qubits, desc}, i) => <RegisterLabel
            key={i}
            name={name}
            qubits={qubits}
            desc={desc}
            qubitPositions={qubitPositions}
          />
        )
      }
    </div>
  </div>
}

/**
 * Create a register label to name the qubits
 * @param name Name of the register
 * @param qubits List of Qubit IDs
 * @param desc Description of the register
 * @param qubitPositions Vertical qubit arrangement
 * @returns JSX element
 */
const RegisterLabel = ({
  name,
  qubits,
  desc,
  qubitPositions
}: {
  name: string,
  qubits: Array<number>,
  desc: string,
  qubitPositions: Array<number>
}) => {
  return <div className={styles["circuit-register"]} title={name+" register"}>
    <div className={styles["circuit-register-text-container"]}>
      <div className={styles["circuit-register-text-align-container"]}>
        <div className={styles["circuit-register-text"]}>{name}</div>
      </div>
    </div>
    {
      qubits.map(
        (q, i) => <div className={styles["circuit-qubit-label"]} key={i}>{q}</div>
      )
    }
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
  return <div className={styles["circuit-qubit-line"]} title={name}></div>
}

/**
 * Create quantum gate
 * @param gate All gate information
 * @param qubitPositions Vertical qubit arrangement
 * @param timePosition Current horizontal position in the circuit
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
  
  return <Popover>
    <PopoverTrigger asChild={true}>
      <div
        className={styles["circuit-gate"]}
        style={{
          top: (upperQubitPos+0.5)*lineSeparation*2 + "em",
          left: (timePosition * gateMargin * 3 + 1) + "em",
          height: ((gateHeight - 1) * lineSeparation * 2 + gateBaseSize) + "em",
          width: (gateWidth * gateBaseSize + gateMargin * (gateWidth-1)) + "em",
          lineHeight: ((gateHeight - 1) * lineSeparation * 2 + gateBaseSize) + "em",
          background: gate.color,
        }}
      >
        {/*<GateInfoBubble data={gate}/>*/}
        {gate.name != "Barrier" ? gate.name : <></>}
        {gate.inverse ? (<sup>†</sup>) : <></>}
      </div>
    </PopoverTrigger>
    <GateInfoBubble gate={gate}/>
  </Popover>
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
  
  if (gate.name == "Barrier") {
    return [1,gateHeight];
  }
  
  return [
    gateWidth,
    gateHeight
  ];
}



export default Circuit;
