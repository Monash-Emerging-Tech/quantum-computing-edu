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

import { calculateGateDimensions, calculateOperationSpan } from "./circuit-functions";

import styles from "./circuit.module.css";

import {
  Popover,
  PopoverTrigger,
  //PopoverContent,
  //PopoverDescription,
  //PopoverHeading,
  //PopoverClose
} from "./popover";



/**
 * Create quantum gate (operation) visual in the context of a circuit
 * @param operation All gate information
 * @param qubitOrder The qubit IDs arranged in vertical display order
 * @param qubitPositions The vertical position of each qubit in the circuit
 * @param timePosition Current horizontal position in the circuit
 * @param info_bubble_child Child information bubble element
 * @returns JSX element
 */
const OperationComponent = (
  {
    operation,
    qubitOrder,
    qubitPositions,
    timePosition,
    info_bubble_child
  }: {
    operation: Operation,
    qubitOrder: Array<number>,
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
  
  const [min_qubit_pos, _max_qubit_pos, covered_positions_filled, covered_qubits_filled] = calculateOperationSpan(operation, qubitOrder, qubitPositions);
  
  return <div
    className={styles["circuit-operation-container"]}
    style={{
      top: (upperQubitPos+0.5)*lineSeparation*2 + "em",
      left: (timePosition * gateMargin * 3 + 1) + "em",
    }}
  >
    <ControlLineComponent
      operation={operation}
      lineSeparation={lineSeparation}
      gateBaseSize={gateBaseSize}
      gateMargin={gateMargin}
      gateWidth={gateWidth}
      lineHeight={covered_positions_filled.length}
      topOffset={min_qubit_pos - upperQubitPos}
    />
    <GateComponent
      operation={operation}
      lineSeparation={lineSeparation}
      gateBaseSize={gateBaseSize}
      gateMargin={gateMargin}
      gateWidth={gateWidth}
      gateHeight={gateHeight}
      info_bubble_child={info_bubble_child}
    />
  </div>
}



/**
 * Create quantum gate visual independent of the circuit context
 * @param operation All gate information
 * @param lineSeparation Distance between lines in the circuit defined by CSS
 * @param gateBaseSize Base gate size defined by CSS
 * @param gateMargin Margin between gates defined by CSS
 * @param gateWidth Relative width of the gate
 * @param gateHeight Height of the gate (in qubits)
 * @param info_bubble_child Child information bubble element
 * @returns JSX element
 */
const GateComponent = (
  {
    operation,
    lineSeparation,
    gateBaseSize,
    gateMargin,
    gateWidth,
    gateHeight,
    info_bubble_child
  }: {
    operation: Operation,
    lineSeparation: number,
    gateBaseSize: number,
    gateMargin: number,
    gateWidth: number,
    gateHeight: number,
    info_bubble_child: React.ReactNode
  }
) => <Popover>
  <PopoverTrigger asChild={true}>
    <div
      className={styles["circuit-gate"]}
      style={{
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
</Popover>;



/**
 * Create quantum gate visual independent of the circuit context
 * @param operation All gate information
 * @param lineSeparation Distance between lines in the circuit defined by CSS
 * @param lineHeight Height of the line (in qubits)
 * @returns JSX element
 */
const ControlLineComponent = (
  {
    operation,
    lineSeparation,
    gateBaseSize,
    gateMargin,
    gateWidth,
    lineHeight,
    topOffset
  }: {
    operation: Operation,
    lineSeparation: number,
    gateBaseSize: number,
    gateMargin: number,
    gateWidth: number,
    lineHeight: number,
    topOffset: number
  }
) => 
    <div
      className={styles["circuit-control-line"]}
      style={{
        top: lineSeparation * topOffset * 2 + "em",
        left: (gateWidth * gateBaseSize + gateMargin * (gateWidth-1))/2 + "em",
        height: lineSeparation * (lineHeight-1) * 2 + "em",
        background: operation.gate.color,
      }}
    ></div>;



export default OperationComponent;
