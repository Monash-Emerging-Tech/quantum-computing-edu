/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Functions for the interactive circuit.
 */

import { Operation } from "@/lib/circuit-parsing";

/**
 * Calculate the visual width & height of a gate
 * @param operation The quantum gate to calculate the dimensions of
 * @param qubitPositions The vertical arrangement of the qubits in the circuit
 * @returns [width: int, height: int]
 */
const calculateGateDimensions = (operation: Operation, qubitPositions: number[]): [number, number] => {
  
  const upperQubitPos = Math.min.apply(Math, operation.qubits.map(q => qubitPositions[q]));
  const lowerQubitPos = Math.max.apply(Math, operation.qubits.map(q => qubitPositions[q]));
  const gateHeight = lowerQubitPos - upperQubitPos + 1;
  const gateWidth = Math.round(Math.log2(gateHeight+1));
  //const gateWidth = gateHeight > 2 ? 2 : 1;
  
  if (operation.gate.gate_id == "barrier") {
    return [1,gateHeight];
  }
  
  return [
    gateWidth,
    gateHeight
  ];
}

/**
 * Find all qubit positions covered by the gate and its control points
 * @param operation The quantum gate to calculate the dimensions of
 * @param qubitOrder The qubit IDs arranged in vertical display order
 * @param qubitPositions The vertical position of each qubit in the circuit
 * @returns [width: int, height: int]
 */
const calculateOperationSpan = (operation: Operation, qubitOrder: number[], qubitPositions: number[]): [number, number, number[], number[]] => {
  // Get a list of explicitly covered qubit positions (including controls)
  const covered_positions = [...operation.qubits, ...operation.controls, ...operation.anticontrols].map((qubit) => qubitPositions[qubit]);
  // Find the minimum & maximum covered qubit positions
  const min_qubit_pos = Math.min(...covered_positions);
  const max_qubit_pos = Math.max(...covered_positions);
  // Create an array of qubit positions between the extremes
  const covered_positions_filled = Array(max_qubit_pos - min_qubit_pos + 1).fill(0).map((_, j) => min_qubit_pos+j);
  // Create an arrau of qubit IDs between the extremes
  const covered_qubits_filled = covered_positions_filled.map((pos) => qubitOrder[pos]);
  
  return [min_qubit_pos, max_qubit_pos, covered_positions_filled, covered_qubits_filled];
}



export { calculateGateDimensions, calculateOperationSpan };
