/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Gate component(s) (client-side) for the interactive circuit.
 */

"use client";

import { useState, useEffect } from "react";
//import Link from "next/link";

// Import types and basic gates
import { Gate, QuantumCircuit, Operation } from "@/app/circuit-data/circuit-parsing";

import { calculateGateDimensions } from "./circuit-functions";

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
 * Create quantum gate
 * @param gate All gate information
 * @param qubitPositions Vertical qubit arrangement
 * @param timePosition Current horizontal position in the circuit
 * @returns JSX element
 */
const GateComponent = (
  {
    operation,
    qubitPositions,
    timePosition,
    info_bubble_child
  }: {
    operation: Operation,
    qubitPositions: Array<number>,
    timePosition: number,
    info_bubble_child: React.ReactNode
  }
) => {
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
  const upperQubitPos = Math.min.apply(Math, operation.qubits.map(q => qubitPositions[q]));
  const lowerQubitPos = Math.max.apply(Math, operation.qubits.map(q => qubitPositions[q]));
  //const gateHeight = lowerQubitPos - upperQubitPos + 1;
  //const gateWidth = Math.round(Math.log2(gateHeight+1));
  
  const [gateWidth, gateHeight] = calculateGateDimensions(operation, qubitPositions);
  
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
          background: operation.gate.color,
        }}
      >
        {operation.gate.gate_id != "barrier" ? operation.gate.display_name : <></>}
        {operation.exponent > 1 ? (<sup>{(operation.inverse ? "-" : "") + operation.exponent.toString()}</sup>) : (operation.inverse ? (<sup>†</sup>) : <></>)}
      </div>
    </PopoverTrigger>
    {info_bubble_child}
  </Popover>
}



export default GateComponent;
