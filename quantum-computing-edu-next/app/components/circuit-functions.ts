/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Functions for the interactive circuit.
 */

import { Operation } from "@/app/circuit-data/circuit-parsing";

/**
 * Calculate the visual width & height of a gate
 * @param operation The quantum gate to calculate the dimensions of
 * @param qubitPositions The vertical arrangement of the qubits in the circuit
 * @returns [width: int, height: int]
 */
const calculateGateDimensions = (operation: Operation, qubitPositions: Array<number>): [number, number] => {
  
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



export { calculateGateDimensions };
