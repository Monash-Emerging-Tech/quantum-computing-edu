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
const Barrier: StandardGate = {
  type: GateType.LARGE,
  name: "Barrier",
  longName: "Barrier",
  color: "white",
  unitary: []
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
export { GateType, GateI, GateX, GateY, GateZ, GateH, GateSwap, GateCNOT, Barrier };
