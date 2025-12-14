/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * Types and standard gates.
 */

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
 * Define the structure of a general (custom) gate
 */
type Gate = {
  type: GateType,
  name: string,
  longName: string,
  color: string,
  qubits: Array<number>,
  controls: Array<number>,
  anticontrols: Array<number>,
  inverse: boolean,
  
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

export type { Unitary, StandardGate, Gate, QuantumCircuit };
//export { GateType, GateI, GateX, GateY, GateZ, GateH, GateSwap, GateCNOT, Barrier };
export { GateType };
