/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Quantum Fourier Transform gate.
 */

import { Unitary, StandardGate, Gate, QuantumCircuit, GateType } from "../components/circuit-types";

/**
 * Define the Quantum Fourier Transform gate
 */
const QFT = (qubits: Array<number>, inverse: boolean): Gate => ({
  type: GateType.LARGE,
  name: "QFT",
  longName: "Quantum Fourier Transform",
  color: "green",
  qubits: qubits,
  controls: [],
  anticontrols: [],
  inverse: inverse,
  //components: 
})

export { QFT };
